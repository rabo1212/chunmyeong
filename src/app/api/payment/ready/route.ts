import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { saju, interpretation, ziweiSummary, liunianData, daxianList, hasFacePhoto } = body;

    if (!saju || !interpretation) {
      return NextResponse.json({ error: "분석 데이터가 필요합니다." }, { status: 400 });
    }

    const orderId = `cm_${nanoid(16)}`;
    const amount = 1900;

    // KV에 임시 저장 (30분 TTL)
    await kv.set(
      `pending:${orderId}`,
      {
        saju,
        interpretation,
        ziweiSummary,
        liunianData,
        daxianList,
        hasFacePhoto: !!hasFacePhoto,
        createdAt: new Date().toISOString(),
      },
      { ex: 1800 } // 30분
    );

    return NextResponse.json({ orderId, amount });
  } catch (error) {
    console.error("Payment ready error:", error);
    return NextResponse.json(
      { error: "결제 준비 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
