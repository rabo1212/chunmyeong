import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import { generatePremiumContent } from "@/lib/premium-generator";
import type { SajuData, LiunianData, DaxianItem } from "@/lib/types";

export const maxDuration = 60;

const FIXED_AMOUNT = 1900;

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "결제 정보가 부족합니다." }, { status: 400 });
    }

    // [FIX] CRITICAL 1: 금액 위변조 방지 — 서버 측 고정 금액 검증
    if (Number(amount) !== FIXED_AMOUNT) {
      return NextResponse.json({ error: "금액이 올바르지 않습니다." }, { status: 400 });
    }

    // [FIX] CRITICAL 3: 이중 결제 방지 — 이미 처리된 주문이면 기존 결과 반환
    const existingPayment = await kv.get<{ resultId: string }>(`payment:${orderId}`);
    if (existingPayment) {
      return NextResponse.json({ resultId: existingPayment.resultId });
    }

    // [FIX] CRITICAL 2: Race condition 방지 — 처리 중 잠금
    const lockKey = `lock:${orderId}`;
    const acquired = await kv.set(lockKey, "1", { ex: 120, nx: true });
    if (!acquired) {
      return NextResponse.json({ error: "이미 처리 중입니다." }, { status: 409 });
    }

    // 1. 토스 결제 승인
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      await kv.del(lockKey);
      return NextResponse.json({ error: "결제 설정 오류" }, { status: 500 });
    }

    const encryptedKey = "Basic " + Buffer.from(secretKey + ":").toString("base64");

    const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: encryptedKey,
        "Content-Type": "application/json",
      },
      // [FIX] 서버 측 고정 금액으로 토스 API 호출
      body: JSON.stringify({ paymentKey, orderId, amount: FIXED_AMOUNT }),
    });

    if (!tossRes.ok) {
      const tossError = await tossRes.json().catch(() => ({}));
      console.error("Toss confirm error:", tossError);
      await kv.del(lockKey);
      return NextResponse.json(
        { error: "결제 승인에 실패했습니다." },
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
      await kv.del(lockKey);
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
        amount: FIXED_AMOUNT,
        resultId,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      },
      { ex: 7776000 } // 90일
    );

    // 6. 임시 데이터 + 잠금 삭제
    await kv.del(`pending:${orderId}`);
    await kv.del(lockKey);

    return NextResponse.json({ resultId, premiumData });
  } catch (error) {
    console.error("Payment confirm error:", error);
    return NextResponse.json(
      { error: "프리미엄 분석 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
