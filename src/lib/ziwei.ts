import { createChart, calculateLiunian, getDaxianList } from "@orrery/core/ziwei";
import type { ZiweiChart, ZiweiPalace, ZiweiStar } from "@orrery/core/types";
import type { BirthInfo, DaxianItem, LiunianData } from "./types";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Lunar } = require("lunar-javascript");

// 12궁 한글 이름 → 이모지 매핑
const PALACE_EMOJI: Record<string, string> = {
  "명궁": "🏛️",
  "형제궁": "👫",
  "부처궁": "💑",
  "자녀궁": "👶",
  "재백궁": "💰",
  "질액궁": "🏥",
  "천이궁": "🌍",
  "교우궁": "🤝",
  "관록궁": "👔",
  "전택궁": "🏠",
  "복덕궁": "🧘",
  "부모궁": "👨‍👩‍👧",
};

function formatStar(star: ZiweiStar): string {
  let s = star.name;
  if (star.brightness) s += `(${star.brightness})`;
  if (star.siHua) s += `[${star.siHua}]`;
  return s;
}

export interface ZiweiResult {
  chart: ZiweiChart;
  summary: string;
  palaceList: Array<{
    name: string;
    emoji: string;
    ganZhi: string;
    stars: string[];
    isShenGong: boolean;
  }>;
}

export function computeZiwei(birthInfo: BirthInfo): ZiweiResult | null {
  // 시간 미상이면 자미두수 제한적
  // (자미두수는 시간이 매우 중요하지만, 기본값으로 계산은 가능)

  let { year, month, day } = birthInfo;
  if (birthInfo.calendarType === "lunar") {
    const lunarMonth = birthInfo.isLeapMonth ? -month : month;
    const lunar = Lunar.fromYmdHms(year, lunarMonth, day, 0, 0, 0);
    const solar = lunar.getSolar();
    year = solar.getYear();
    month = solar.getMonth();
    day = solar.getDay();
  }

  const hour = birthInfo.unknownTime ? 12 : birthInfo.hour;
  const minute = birthInfo.unknownTime ? 0 : birthInfo.minute;
  const isMale = birthInfo.gender === "male";

  try {
    const chart = createChart(year, month, day, hour, minute, isMale);

    // 12궁 리스트로 정리
    const palaceList = Object.entries(chart.palaces).map(([, palace]: [string, ZiweiPalace]) => ({
      name: palace.name,
      emoji: PALACE_EMOJI[palace.name] || "⭐",
      ganZhi: palace.ganZhi,
      stars: palace.stars.map((s: ZiweiStar) => formatStar(s)),
      isShenGong: palace.isShenGong,
    }));

    // AI 전달용 요약 텍스트
    const palaceSummaries = palaceList.map(
      (p) => `${p.name}[${p.ganZhi}]: ${p.stars.length > 0 ? p.stars.join(", ") : "없음"}${p.isShenGong ? " (신궁)" : ""}`
    );

    const summary = [
      `오행국: ${chart.wuXingJu.name}(${chart.wuXingJu.number}국)`,
      `명궁지: ${chart.mingGongZhi}, 신궁지: ${chart.shenGongZhi}`,
      `대한 시작 나이: ${chart.daXianStartAge}세`,
      "",
      "=== 12궁 성요 배치 ===",
      ...palaceSummaries,
    ].join("\n");

    return { chart, summary, palaceList };
  } catch (error) {
    console.error("Ziwei calculation error:", error);
    return null;
  }
}

export function computeLiunian(birthInfo: BirthInfo, targetYear: number): LiunianData | null {
  const ziweiResult = computeZiwei(birthInfo);
  if (!ziweiResult) return null;

  try {
    const liunian = calculateLiunian(ziweiResult.chart, targetYear);
    return {
      year: liunian.year,
      gan: liunian.gan,
      zhi: liunian.zhi,
      mingGongZhi: liunian.mingGongZhi,
      natalPalaceAtMing: liunian.natalPalaceAtMing,
      siHua: liunian.siHua,
      siHuaPalaces: liunian.siHuaPalaces,
      palaces: liunian.palaces,
      liuyue: liunian.liuyue.map((ly) => ({
        month: ly.month,
        mingGongZhi: ly.mingGongZhi,
        natalPalaceName: ly.natalPalaceName,
      })),
      daxianPalaceName: liunian.daxianPalaceName,
      daxianAgeStart: liunian.daxianAgeStart,
      daxianAgeEnd: liunian.daxianAgeEnd,
    };
  } catch (error) {
    console.error("Liunian calculation error:", error);
    return null;
  }
}

export function computeDaxianList(birthInfo: BirthInfo): DaxianItem[] {
  const ziweiResult = computeZiwei(birthInfo);
  if (!ziweiResult) return [];

  try {
    return getDaxianList(ziweiResult.chart);
  } catch (error) {
    console.error("Daxian calculation error:", error);
    return [];
  }
}

// 유년 요약 텍스트 생성 (프리미엄 프롬프트용)
export function buildLiunianSummary(liunian: LiunianData): string {
  const lines = [
    `유년: ${liunian.year}년 (${liunian.gan}${liunian.zhi})`,
    `유년 명궁: ${liunian.natalPalaceAtMing}`,
    `현재 대한: ${liunian.daxianPalaceName} (${liunian.daxianAgeStart}~${liunian.daxianAgeEnd}세)`,
    "",
    "사화:",
    ...Object.entries(liunian.siHua).map(([star, hua]) => `  ${star} → ${hua} (${liunian.siHuaPalaces[star] || ""})`),
    "",
    "유월(12개월) 명궁 위치:",
    ...liunian.liuyue.map((ly) => `  ${ly.month}월: ${ly.natalPalaceName}`),
  ];
  return lines.join("\n");
}
