import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { saju, interpretation, ziweiSummary, liunianData, daxianList, selectedExtras } = body;

    if (!saju || !interpretation) {
      return NextResponse.json({ error: "분석 데이터가 필요합니다." }, { status: 400 });
    }

    if (!selectedExtras || !Array.isArray(selectedExtras) || selectedExtras.length !== 3) {
      return NextResponse.json({ error: "3가지 메뉴를 선택해주세요." }, { status: 400 });
    }

    const orderId = `cm_${nanoid(16)}`;
    const amount = 1990;

    // KV에 임시 저장 (30분 TTL)
    await kv.set(
      `pending:${orderId}`,
      {
        saju,
        interpretation,
        ziweiSummary,
        liunianData,
        daxianList,
        selectedExtras,
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
