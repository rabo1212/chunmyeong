/**
 * 신살(神殺) 계산 및 해석
 * - 12신살: @orrery/core에서 제공 (년지 기준)
 * - 특수 신살: 천을귀인, 도화살, 문창귀인 등 직접 계산
 */

// ─── 12신살 해석 ───

export const SINSAL_12_DESC: Record<string, { name: string; emoji: string; desc: string }> = {
  "劫殺": { name: "겁살", emoji: "⚡", desc: "과감하고 결단력 있으나, 급한 성격을 조절하면 큰 성과를 이룹니다" },
  "災殺": { name: "재살", emoji: "🌊", desc: "예상치 못한 변화가 올 수 있으나, 이를 통해 더 강해집니다" },
  "天殺": { name: "천살", emoji: "🌩️", desc: "하늘의 시련이 있지만, 극복 후 크게 성장하는 기운입니다" },
  "地殺": { name: "지살", emoji: "🏔️", desc: "안정을 추구하며, 묵묵히 노력하면 반드시 결실을 맺습니다" },
  "年殺": { name: "연살", emoji: "📅", desc: "매년 새로운 기회가 찾아오며, 변화를 두려워하지 않는 기질입니다" },
  "月殺": { name: "월살", emoji: "🌙", desc: "감수성이 풍부하고, 주변 사람들과의 관계에서 성장합니다" },
  "亡身": { name: "망신", emoji: "🔥", desc: "열정적이고 에너지가 넘치나, 때로는 신중함이 필요합니다" },
  "將星": { name: "장성", emoji: "⭐", desc: "리더십이 뛰어나고, 사람들을 이끄는 자질이 있습니다" },
  "飜安": { name: "번안", emoji: "🔄", desc: "변화와 이동이 많으며, 새로운 환경에서 능력을 발휘합니다" },
  "驛馬": { name: "역마", emoji: "🐎", desc: "이동과 변동의 기운이 강해, 해외나 출장에 인연이 많습니다" },
  "孤害": { name: "육해", emoji: "💫", desc: "독립심이 강하고, 자기만의 길을 개척하는 힘이 있습니다" },
  "花蓋": { name: "화개", emoji: "🎨", desc: "예술적 재능과 학문적 깊이가 뛰어나며, 종교·철학에 인연이 있습니다" },
};

// ─── 특수 신살 계산 테이블 ───

// 천을귀인(天乙貴人): 일간 기준 → 해당 지지에 있으면 발동
const CHEONUL_TABLE: Record<string, string[]> = {
  "甲": ["丑", "未"], "乙": ["子", "申"], "丙": ["酉", "亥"],
  "丁": ["酉", "亥"], "戊": ["丑", "未"], "己": ["子", "申"],
  "庚": ["丑", "未"], "辛": ["寅", "午"], "壬": ["卯", "巳"],
  "癸": ["卯", "巳"],
};

// 도화살(桃花殺): 년지/일지 기준 → 해당 지지에 있으면 발동
const DOHWA_TABLE: Record<string, string> = {
  "寅": "卯", "午": "卯", "戌": "卯",
  "巳": "午", "酉": "午", "丑": "午",
  "申": "酉", "子": "酉", "辰": "酉",
  "亥": "子", "卯": "子", "未": "子",
};

// 문창귀인(文昌貴人): 일간 기준
const MUNCHANG_TABLE: Record<string, string> = {
  "甲": "巳", "乙": "午", "丙": "申", "丁": "酉", "戊": "申",
  "己": "酉", "庚": "亥", "辛": "子", "壬": "寅", "癸": "卯",
};

// 천덕귀인(天德貴人): 월지 기준 → 해당 천간이 있으면 발동
const CHEONDUK_TABLE: Record<string, string> = {
  "寅": "丁", "卯": "申", "辰": "壬", "巳": "辛",
  "午": "亥", "未": "甲", "申": "癸", "酉": "寅",
  "戌": "丙", "亥": "乙", "子": "巳", "丑": "庚",
};

// 홍염살(紅艶殺): 일간 기준
const HONGYEOM_TABLE: Record<string, string> = {
  "甲": "午", "乙": "申", "丙": "寅", "丁": "未", "戊": "辰",
  "己": "辰", "庚": "戌", "辛": "酉", "壬": "子", "癸": "申",
};

// 양인(羊刃): 일간 기준
const YANGIN_TABLE: Record<string, string> = {
  "甲": "卯", "乙": "寅", "丙": "午", "丁": "巳", "戊": "午",
  "己": "巳", "庚": "酉", "辛": "申", "壬": "子", "癸": "亥",
};

// 괴강살(魁罡殺): 일주 간지로 판별
const GOEGANG_GANZI = ["庚辰", "庚戌", "壬辰", "壬戌"];

export interface SpecialSinsal {
  name: string;
  hanja: string;
  emoji: string;
  desc: string;
  positions: string[]; // 어느 주에서 발견되었는지
}

/**
 * 특수 신살 계산
 * @param stems  [년간, 월간, 일간, 시간] (시간 없으면 3개)
 * @param branches [년지, 월지, 일지, 시지] (시간 없으면 3개)
 * @param dayGanzi 일주 간지 (예: "甲子")
 */
export function calcSpecialSinsal(
  stems: string[],
  branches: string[],
  dayGanzi: string,
): SpecialSinsal[] {
  const result: SpecialSinsal[] = [];
  const dayStem = stems[2]; // 일간
  const yearBranch = branches[0]; // 년지
  const dayBranch = branches[2]; // 일지

  const PILLAR_NAMES = ["년주", "월주", "일주", "시주"];

  // 1. 천을귀인
  const cheonulBranches = CHEONUL_TABLE[dayStem] || [];
  const cheonulPos: string[] = [];
  branches.forEach((b, i) => {
    if (cheonulBranches.includes(b)) cheonulPos.push(PILLAR_NAMES[i]);
  });
  if (cheonulPos.length > 0) {
    result.push({
      name: "천을귀인", hanja: "天乙貴人", emoji: "👑",
      desc: "가장 귀한 귀인살로, 어려울 때 반드시 도움을 받는 운입니다. 관직이나 사회적 지위에 유리하며, 위기를 기회로 바꾸는 힘이 있습니다",
      positions: cheonulPos,
    });
  }

  // 2. 도화살 (년지 기준 + 일지 기준)
  const dohwaFromYear = DOHWA_TABLE[yearBranch];
  const dohwaFromDay = DOHWA_TABLE[dayBranch];
  const dohwaPos: string[] = [];
  branches.forEach((b, i) => {
    if (b === dohwaFromYear || b === dohwaFromDay) dohwaPos.push(PILLAR_NAMES[i]);
  });
  if (dohwaPos.length > 0) {
    result.push({
      name: "도화살", hanja: "桃花殺", emoji: "🌸",
      desc: "매력과 예술적 재능이 뛰어납니다. 이성에게 인기가 많고, 대인관계가 좋아 사회생활에 유리합니다",
      positions: dohwaPos,
    });
  }

  // 3. 문창귀인
  const munchangBranch = MUNCHANG_TABLE[dayStem];
  const munchangPos: string[] = [];
  branches.forEach((b, i) => {
    if (b === munchangBranch) munchangPos.push(PILLAR_NAMES[i]);
  });
  if (munchangPos.length > 0) {
    result.push({
      name: "문창귀인", hanja: "文昌貴人", emoji: "📚",
      desc: "학문과 시험에 강한 귀인입니다. 공부, 자격증, 승진 시험 등에서 좋은 결과를 기대할 수 있습니다",
      positions: munchangPos,
    });
  }

  // 4. 천덕귀인
  const monthBranch = branches[1]; // 월지
  const cheondukStem = CHEONDUK_TABLE[monthBranch];
  const cheondukPos: string[] = [];
  stems.forEach((s, i) => {
    if (s === cheondukStem) cheondukPos.push(PILLAR_NAMES[i]);
  });
  if (cheondukPos.length > 0) {
    result.push({
      name: "천덕귀인", hanja: "天德貴人", emoji: "🙏",
      desc: "하늘의 덕을 타고난 사람입니다. 재난을 피하고 복을 받으며, 인덕이 있어 주변의 도움이 많습니다",
      positions: cheondukPos,
    });
  }

  // 5. 홍염살
  const hongyeomBranch = HONGYEOM_TABLE[dayStem];
  const hongyeomPos: string[] = [];
  branches.forEach((b, i) => {
    if (b === hongyeomBranch) hongyeomPos.push(PILLAR_NAMES[i]);
  });
  if (hongyeomPos.length > 0) {
    result.push({
      name: "홍염살", hanja: "紅艶殺", emoji: "💃",
      desc: "화려하고 매력적인 기운입니다. 연예·예술 분야에서 두각을 나타내며, 강한 카리스마가 있습니다",
      positions: hongyeomPos,
    });
  }

  // 6. 역마살 (12신살에도 있지만, 특수 신살에 별도 강조)
  // 이미 12신살로 포함되므로 생략

  // 7. 양인살
  const yanginBranch = YANGIN_TABLE[dayStem];
  const yanginPos: string[] = [];
  branches.forEach((b, i) => {
    if (b === yanginBranch) yanginPos.push(PILLAR_NAMES[i]);
  });
  if (yanginPos.length > 0) {
    result.push({
      name: "양인살", hanja: "羊刃殺", emoji: "⚔️",
      desc: "강한 추진력과 결단력의 소유자입니다. 리더십이 뛰어나며, 군인·경찰·외과의사 등 강한 직업에 적성이 맞습니다",
      positions: yanginPos,
    });
  }

  // 8. 괴강살
  if (GOEGANG_GANZI.includes(dayGanzi)) {
    result.push({
      name: "괴강살", hanja: "魁罡殺", emoji: "🦁",
      desc: "의지가 매우 강하고 총명합니다. 권위와 카리스마가 있어 지도자적 기질이 강하며, 학문이나 무예에 재능이 있습니다",
      positions: ["일주"],
    });
  }

  return result;
}
