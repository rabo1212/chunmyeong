import OpenAI from "openai";
import {
  PREMIUM_SYSTEM_PROMPT,
  buildZiweiYongshinPrompt,
  buildMonthlyFortunePrompt,
  buildDaeunDetailPrompt,
  buildDaeunSummary,
  buildDeepWealthPrompt,
  buildDeepCareerPrompt,
} from "./premium-prompts";
import { buildLiunianSummary } from "./ziwei";
import type {
  SajuData,
  LiunianData,
  DaxianItem,
  PremiumData,
  ZiweiPalaceAnalysis,
  MonthlyFortune,
  DaeunDetail,
  YongshinInfo,
} from "./types";

interface PremiumInput {
  saju: SajuData;
  interpretation: string;
  ziweiSummary: string;
  liunianData: LiunianData;
  daxianList: DaxianItem[];
  selectedExtras?: string[];
}

// JSON 파싱 헬퍼
function parseJSON<T>(text: string): T {
  let cleaned = text.trim();

  const codeBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("JSON 파싱 실패");
  }
}

// OpenAI API 호출 (1회 재시도)
async function callGPT(
  openai: OpenAI,
  prompt: string,
): Promise<string> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          { role: "system", content: PREMIUM_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
      });

      return response.choices[0]?.message?.content ?? "";
    } catch (error) {
      if (attempt === 0) {
        console.warn("Premium GPT call failed, retrying:", error);
        continue;
      }
      throw error;
    }
  }
  throw new Error("GPT call failed after retries");
}

export async function generatePremiumContent(input: PremiumInput): Promise<PremiumData> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY 환경변수가 설정되지 않았습니다.");

  const openai = new OpenAI({ apiKey });

  const targetYear = new Date().getFullYear();
  const liunianSummary = buildLiunianSummary(input.liunianData);

  const birthYear = input.saju.birthInfo?.year ?? (targetYear - 30);
  const daeunSummary = buildDaeunSummary(input.saju.daeun, birthYear);
  const extras = input.selectedExtras || [];

  // 선택된 메뉴에 따라 필요한 프롬프트만 빌드 + 호출
  const calls: { key: string; promise: Promise<string> }[] = [];

  // 궁합류(compatibility, celeb_match, family_match)는 상대방 입력 후 별도 생성
  // 여기서는 입력 불필요 메뉴만 생성

  if (extras.includes("yearly_2026")) {
    calls.push({
      key: "monthly",
      promise: callGPT(openai, buildMonthlyFortunePrompt(liunianSummary, input.saju.summary, targetYear)),
    });
  }

  if (extras.includes("deep_wealth")) {
    calls.push({
      key: "wealth",
      promise: callGPT(openai, buildDeepWealthPrompt(input.saju.summary, input.interpretation)),
    });
  }

  if (extras.includes("deep_career")) {
    calls.push({
      key: "career",
      promise: callGPT(openai, buildDeepCareerPrompt(input.saju.summary, input.interpretation)),
    });
  }

  // 항상 용신은 생성 (기본 제공)
  calls.push({
    key: "ziwei_yongshin",
    promise: callGPT(openai, buildZiweiYongshinPrompt(input.ziweiSummary, input.saju.summary)),
  });

  // 대운도 기본 제공
  calls.push({
    key: "daeun",
    promise: callGPT(openai, buildDaeunDetailPrompt(input.saju.summary, input.interpretation, daeunSummary)),
  });

  const results = await Promise.allSettled(calls.map((c) => c.promise));

  // 결과 매핑
  const resultMap: Record<string, string> = {};
  calls.forEach((c, i) => {
    if (results[i].status === "fulfilled") {
      resultMap[c.key] = (results[i] as PromiseFulfilledResult<string>).value;
    } else {
      console.error(`Premium call ${c.key} failed:`, (results[i] as PromiseRejectedResult).reason);
    }
  });

  // 파싱
  let ziwei12: ZiweiPalaceAnalysis[] = [];
  let yongshin: YongshinInfo = { element: "미확인", elementEmoji: "", color: "-", direction: "-", number: "-", gemstone: "-", food: "-", career: "-", analysis: "분석 중 오류가 발생했습니다." };
  let monthlyFortune: MonthlyFortune[] = [];
  let daeunDetail: DaeunDetail = {
    current: { ganzi: "-", ageRange: "-", title: "분석 실패", analysis: "프리미엄 분석 중 오류가 발생했습니다." },
    previous: null, next: null, coreAdvice: "-",
  };
  let deepWealth: string | undefined;
  let deepCareer: string | undefined;

  if (resultMap.ziwei_yongshin) {
    try {
      const data = parseJSON<{ ziwei12: ZiweiPalaceAnalysis[]; yongshin: YongshinInfo }>(resultMap.ziwei_yongshin);
      ziwei12 = data.ziwei12 || [];
      yongshin = data.yongshin || yongshin;
    } catch (e) { console.error("Parse error (ziwei):", e); }
  }

  if (resultMap.monthly) {
    try {
      const data = parseJSON<{ monthlyFortune: MonthlyFortune[] }>(resultMap.monthly);
      monthlyFortune = data.monthlyFortune || [];
    } catch (e) { console.error("Parse error (monthly):", e); }
  }

  if (resultMap.daeun) {
    try {
      const data = parseJSON<{ daeunDetail: DaeunDetail }>(resultMap.daeun);
      daeunDetail = data.daeunDetail || daeunDetail;
    } catch (e) { console.error("Parse error (daeun):", e); }
  }

  if (resultMap.wealth) {
    deepWealth = resultMap.wealth;
  }

  if (resultMap.career) {
    deepCareer = resultMap.career;
  }

  return {
    ziwei12,
    monthlyFortune,
    daeunDetail,
    yongshin,
    deepWealth,
    deepCareer,
    selectedExtras: extras,
  } as PremiumData;
}
