import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import { generatePremiumContent } from "@/lib/premium-generator";
import type { SajuData, LiunianData, DaxianItem } from "@/lib/types";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "결제 정보가 부족합니다." }, { status: 400 });
    }

    // 1. 토스 결제 승인
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "결제 설정 오류" }, { status: 500 });
    }

    const encryptedKey = "Basic " + Buffer.from(secretKey + ":").toString("base64");

    const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: encryptedKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    if (!tossRes.ok) {
      const tossError = await tossRes.json().catch(() => ({}));
      console.error("Toss confirm error:", tossError);
      return NextResponse.json(
        { error: tossError.message || "결제 승인에 실패했습니다." },
        { status: 400 }
      );
    }

    // 2. KV에서 임시 데이터 조회
    const pendingData = await kv.get<{
      saju: SajuData;
      interpretation: string;
      ziweiSummary: string;
      liunianData: LiunianData;
      daxianList: DaxianItem[];
      hasFacePhoto: boolean;
    }>(`pending:${orderId}`);

    if (!pendingData) {
      return NextResponse.json(
        { error: "분석 데이터가 만료되었습니다. 다시 분석해주세요." },
        { status: 410 }
      );
    }

    // 3. 프리미엄 콘텐츠 생성
    const premiumData = await generatePremiumContent({
      saju: pendingData.saju,
      interpretation: pendingData.interpretation,
      ziweiSummary: pendingData.ziweiSummary,
      liunianData: pendingData.liunianData,
      daxianList: pendingData.daxianList,
      hasFacePhoto: pendingData.hasFacePhoto,
    });

    // 4. 결과 저장 (30일 TTL)
    const resultId = nanoid(12);
    await kv.set(
      `result:${resultId}`,
      {
        resultId,
        saju: pendingData.saju,
        interpretation: pendingData.interpretation,
        premium: premiumData,
        createdAt: new Date().toISOString(),
      },
      { ex: 2592000 } // 30일
    );

    // 5. 결제 기록 저장 (90일 TTL)
    await kv.set(
      `payment:${orderId}`,
      {
        orderId,
        paymentKey,
        amount,
        resultId,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
      { ex: 7776000 } // 90일
    );

    // 6. 임시 데이터 삭제
    await kv.del(`pending:${orderId}`);

    return NextResponse.json({ resultId, premiumData });
  } catch (error) {
    console.error("Payment confirm error:", error);
    return NextResponse.json(
      { error: "프리미엄 분석 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
