import OpenAI from "openai";
import {
  PREMIUM_SYSTEM_PROMPT,
  buildZiweiYongshinPrompt,
  buildMonthlyFortunePrompt,
  buildDaeunDetailPrompt,
  buildDaeunSummary,
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

  const birthYear = input.saju.birthInfo?.year
    ?? (targetYear - 30);
  const daeunSummary = buildDaeunSummary(input.saju.daeun, birthYear);

  // 프롬프트 3종 구성
  const prompt1 = buildZiweiYongshinPrompt(input.ziweiSummary, input.saju.summary);
  const prompt2 = buildMonthlyFortunePrompt(liunianSummary, input.saju.summary, targetYear);
  const prompt3 = buildDaeunDetailPrompt(
    input.saju.summary,
    input.interpretation,
    daeunSummary,
  );

  // Promise.allSettled — 부분 실패 허용
  const results = await Promise.allSettled([
    callGPT(openai, prompt1),
    callGPT(openai, prompt2),
    callGPT(openai, prompt3),
  ]);

  // 결과 파싱 (실패 시 기본값)
  let ziwei12: ZiweiPalaceAnalysis[] = [];
  let yongshin: YongshinInfo = { element: "미확인", elementEmoji: "", color: "-", direction: "-", number: "-", gemstone: "-", food: "-", career: "-", analysis: "분석 중 오류가 발생했습니다." };
  let monthlyFortune: MonthlyFortune[] = [];
  let daeunDetail: DaeunDetail = {
    current: { ganzi: "-", ageRange: "-", title: "분석 실패", analysis: "프리미엄 분석 중 오류가 발생했습니다." },
    previous: null,
    next: null,
    coreAdvice: "-",
  };

  if (results[0].status === "fulfilled") {
    try {
      const data1 = parseJSON<{ ziwei12: ZiweiPalaceAnalysis[]; yongshin: YongshinInfo }>(results[0].value);
      ziwei12 = data1.ziwei12 || [];
      yongshin = data1.yongshin || yongshin;
    } catch (e) {
      console.error("Premium parse error (ziwei):", e);
    }
  } else {
    console.error("Premium call 1 failed:", results[0].reason);
  }

  if (results[1].status === "fulfilled") {
    try {
      const data2 = parseJSON<{ monthlyFortune: MonthlyFortune[] }>(results[1].value);
      monthlyFortune = data2.monthlyFortune || [];
    } catch (e) {
      console.error("Premium parse error (monthly):", e);
    }
  } else {
    console.error("Premium call 2 failed:", results[1].reason);
  }

  if (results[2].status === "fulfilled") {
    try {
      const data3 = parseJSON<{ daeunDetail: DaeunDetail }>(results[2].value);
      daeunDetail = data3.daeunDetail || daeunDetail;
    } catch (e) {
      console.error("Premium parse error (daeun):", e);
    }
  } else {
    console.error("Premium call 3 failed:", results[2].reason);
  }

  return { ziwei12, monthlyFortune, daeunDetail, yongshin };
}
