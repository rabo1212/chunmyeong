import { calculateSaju } from "@orrery/core/saju";
import {
  STEM_INFO,
  BRANCH_ELEMENT,
  SKY_KR,
} from "@orrery/core/constants";
import { toHangul } from "@orrery/core/pillars";
import type { BirthInput } from "@orrery/core/types";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Lunar } = require("lunar-javascript");
import type { BirthInfo, SajuData, PillarData, OhengDistribution } from "./types";
import { calcSpecialSinsal } from "./sinsal";

const ELEMENT_KR: Record<string, string> = {
  tree: "목(木)",
  fire: "화(火)",
  earth: "토(土)",
  metal: "금(金)",
  water: "수(水)",
};

const ELEMENT_KEY: Record<string, keyof OhengDistribution> = {
  tree: "wood",
  fire: "fire",
  earth: "earth",
  metal: "metal",
  water: "water",
};

function stemToKr(stem: string): string {
  const idx = "甲乙丙丁戊己庚辛壬癸".indexOf(stem);
  return idx >= 0 ? SKY_KR[idx] : stem;
}

export function computeSaju(birthInfo: BirthInfo): SajuData {
  // 음력→양력 변환
  let { year, month, day } = birthInfo;
  if (birthInfo.calendarType === "lunar") {
    const lunarMonth = birthInfo.isLeapMonth ? -month : month;
    const lunar = Lunar.fromYmdHms(year, lunarMonth, day, 0, 0, 0);
    const solar = lunar.getSolar();
    year = solar.getYear();
    month = solar.getMonth();
    day = solar.getDay();
  }

  const input: BirthInput = {
    year,
    month,
    day,
    hour: birthInfo.unknownTime ? 12 : birthInfo.hour,
    minute: birthInfo.unknownTime ? 0 : birthInfo.minute,
    gender: birthInfo.gender === "male" ? "M" : "F",
    unknownTime: birthInfo.unknownTime,
  };

  const result = calculateSaju(input);

  // pillars 순서: [시주, 일주, 월주, 년주]
  const [siPillar, ilPillar, wolPillar, nyeonPillar] = result.pillars;

  function toPillarData(p: typeof ilPillar): PillarData {
    return {
      ganzi: p.pillar.ganzi,
      stem: p.pillar.stem,
      branch: p.pillar.branch,
      stemSipsin: p.stemSipsin,
      branchSipsin: p.branchSipsin,
      unseong: p.unseong,
      sinsal: p.sinsal,
      jigang: p.jigang,
    };
  }

  // 오행 분포 계산
  const oheng: OhengDistribution = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const allPillars = birthInfo.unknownTime
    ? [nyeonPillar, wolPillar, ilPillar]
    : [nyeonPillar, wolPillar, ilPillar, siPillar];

  for (const p of allPillars) {
    const stemEl = STEM_INFO[p.pillar.stem]?.element;
    if (stemEl) oheng[ELEMENT_KEY[stemEl]]++;
    const branchEl = BRANCH_ELEMENT[p.pillar.branch];
    if (branchEl) oheng[ELEMENT_KEY[branchEl]]++;
  }

  // 일간 정보
  const dayMaster = ilPillar.pillar.stem;
  const dayMasterElement = STEM_INFO[dayMaster]?.element ?? "tree";

  // 대운 데이터
  const daeun = result.daewoon.map((dw) => ({
    ganzi: dw.ganzi,
    age: dw.age,
    stemSipsin: dw.stemSipsin,
    branchSipsin: dw.branchSipsin,
    unseong: dw.unseong,
  }));

  // 특수 신살 계산
  const allStems = birthInfo.unknownTime
    ? [nyeonPillar.pillar.stem, wolPillar.pillar.stem, ilPillar.pillar.stem]
    : [nyeonPillar.pillar.stem, wolPillar.pillar.stem, ilPillar.pillar.stem, siPillar.pillar.stem];
  const allBranches = birthInfo.unknownTime
    ? [nyeonPillar.pillar.branch, wolPillar.pillar.branch, ilPillar.pillar.branch]
    : [nyeonPillar.pillar.branch, wolPillar.pillar.branch, ilPillar.pillar.branch, siPillar.pillar.branch];
  const specialSinsal = calcSpecialSinsal(allStems, allBranches, ilPillar.pillar.ganzi);

  // AI 전달용 사주 요약 텍스트
  const dayMasterKr = `${stemToKr(dayMaster)}${ELEMENT_KR[dayMasterElement] || dayMasterElement}`;
  const pillarsText = `${nyeonPillar.pillar.ganzi}년 ${wolPillar.pillar.ganzi}월 ${ilPillar.pillar.ganzi}일${birthInfo.unknownTime ? "" : ` ${siPillar.pillar.ganzi}시`}`;
  const ohengText = Object.entries(ELEMENT_KR)
    .map(([el, kr]) => `${kr}=${oheng[ELEMENT_KEY[el]]}`)
    .join(", ");
  const sipsinText = [
    `년주 천간: ${toHangul(nyeonPillar.stemSipsin)}`,
    `월주 천간: ${toHangul(wolPillar.stemSipsin)}`,
    `일주: 본인(${dayMasterKr})`,
    birthInfo.unknownTime ? null : `시주 천간: ${toHangul(siPillar.stemSipsin)}`,
  ]
    .filter(Boolean)
    .join(" / ");
  const daeunText = daeun
    .slice(0, 5)
    .map((d) => `${d.ganzi}(${d.age}세~)`)
    .join(" → ");

  // 12신살 텍스트
  const sinsal12Text = allPillars
    .map((p, i) => {
      const names = ["년주", "월주", "일주", "시주"];
      return `${names[i]}: ${p.sinsal}`;
    })
    .join(", ");

  // 특수 신살 텍스트
  const specialSinsalText = specialSinsal.length > 0
    ? specialSinsal.map((s) => `${s.name}(${s.hanja}) [${s.positions.join("·")}]`).join(", ")
    : "없음";

  const summary = [
    `사주: ${pillarsText}`,
    `일간(Day Master): ${dayMasterKr}`,
    `오행분포: ${ohengText}`,
    `십신: ${sipsinText}`,
    `12신살: ${sinsal12Text}`,
    `특수신살: ${specialSinsalText}`,
    `대운흐름: ${daeunText}`,
    `성별: ${birthInfo.gender === "male" ? "남성" : "여성"}`,
    `생년: ${birthInfo.year}년`,
  ].join("\n");

  return {
    pillars: {
      year: toPillarData(nyeonPillar),
      month: toPillarData(wolPillar),
      day: toPillarData(ilPillar),
      hour: birthInfo.unknownTime ? null : toPillarData(siPillar),
    },
    dayMaster,
    dayMasterElement,
    oheng,
    daeun,
    specialSinsal,
    summary,
  };
}
