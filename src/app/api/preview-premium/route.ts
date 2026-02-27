import { NextRequest, NextResponse } from "next/server";
import { generatePremiumContent } from "@/lib/premium-generator";
import type { SajuData, LiunianData, DaxianItem } from "@/lib/types";

export const maxDuration = 60;

// 개발자 미리보기 전용 — 결제 없이 프리미엄 콘텐츠 생성
const DEV_KEY = "chunmyeong2026";

export async function POST(request: NextRequest) {
  try {
    const { devKey, saju, interpretation, ziweiSummary, liunianData, daxianList } =
      (await request.json()) as {
        devKey: string;
        saju: SajuData;
        interpretation: string;
        ziweiSummary: string;
        liunianData: LiunianData;
        daxianList: DaxianItem[];
      };

    if (devKey !== DEV_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const premiumData = await generatePremiumContent({
      saju,
      interpretation,
      ziweiSummary,
      liunianData,
      daxianList,
    });

    return NextResponse.json({ premiumData });
  } catch (error) {
    console.error("Preview premium error:", error);
    return NextResponse.json(
      { error: "프리미엄 미리보기 생성 실패" },
      { status: 500 }
    );
  }
}
