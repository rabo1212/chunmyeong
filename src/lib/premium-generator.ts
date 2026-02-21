import Anthropic from "@anthropic-ai/sdk";
import {
  PREMIUM_SYSTEM_PROMPT,
  buildZiweiYongshinPrompt,
  buildMonthlyFortunePrompt,
  buildFaceDaeunPrompt,
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
  FaceAreaAnalysis,
  DaeunDetail,
  YongshinInfo,
} from "./types";

interface PremiumInput {
  saju: SajuData;
  interpretation: string;
  ziweiSummary: string;
  liunianData: LiunianData;
  daxianList: DaxianItem[];
  hasFacePhoto: boolean;
  selfieBase64?: string | null;
}

// [FIX] WARNING: JSON 파싱 개선 — 더 범용적인 블록 추출
function parseJSON<T>(text: string): T {
  let cleaned = text.trim();

  // ```json ... ``` 블록 추출 (앞뒤 설명 텍스트 대응)
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }

  // 그래도 파싱 안 되면 { } 블록만 추출
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

// Claude API 호출 (1회 재시도)
async function callClaude(
  anthropic: Anthropic,
  prompt: string,
  selfieBase64?: string | null
): Promise<string> {
  type ContentBlock =
    | { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } }
    | { type: "text"; text: string };

  const content: ContentBlock[] = [];

  if (selfieBase64) {
    const base64Data = selfieBase64.replace(/^data:image\/\w+;base64,/, "");
    content.push({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: base64Data },
    });
  }
  content.push({ type: "text", text: prompt });

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4000,
        temperature: 0.7,
        system: PREMIUM_SYSTEM_PROMPT,
        messages: [{ role: "user", content }],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";
      return text;
    } catch (error) {
      if (attempt === 0) {
        console.warn("Premium Claude call failed, retrying:", error);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Claude call failed after retries");
}

export async function generatePremiumContent(input: PremiumInput): Promise<PremiumData> {
  // [FIX] WARNING: API 키 명시적 검증
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다.");

  const anthropic = new Anthropic({ apiKey });

  const targetYear = new Date().getFullYear();
  const liunianSummary = buildLiunianSummary(input.liunianData);

  // [FIX] CRITICAL 8: birthYear 계산 수정 — saju.birthInfo에서 직접 가져옴
  const birthYear = input.saju.birthInfo?.year
    ?? (targetYear - 30); // fallback
  const daeunSummary = buildDaeunSummary(input.saju.daeun, birthYear);

  // 프롬프트 3종 구성
  const prompt1 = buildZiweiYongshinPrompt(input.ziweiSummary, input.saju.summary);
  const prompt2 = buildMonthlyFortunePrompt(liunianSummary, input.saju.summary, targetYear);
  const prompt3 = buildFaceDaeunPrompt(
    input.saju.summary,
    input.interpretation,
    daeunSummary,
    input.hasFacePhoto
  );

  // [FIX] CRITICAL 9: Promise.allSettled — 부분 실패 허용
  const results = await Promise.allSettled([
    callClaude(anthropic, prompt1),
    callClaude(anthropic, prompt2),
    callClaude(anthropic, prompt3, input.hasFacePhoto ? input.selfieBase64 : null),
  ]);

  // 결과 파싱 (실패 시 기본값)
  let ziwei12: ZiweiPalaceAnalysis[] = [];
  let yongshin: YongshinInfo = { element: "미확인", elementEmoji: "", color: "-", direction: "-", number: "-", gemstone: "-", food: "-", career: "-", analysis: "분석 중 오류가 발생했습니다." };
  let monthlyFortune: MonthlyFortune[] = [];
  let faceAreas: FaceAreaAnalysis[] = [];
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
      const data3 = parseJSON<{ faceAreas: FaceAreaAnalysis[]; daeunDetail: DaeunDetail }>(results[2].value);
      faceAreas = data3.faceAreas || [];
      daeunDetail = data3.daeunDetail || daeunDetail;
    } catch (e) {
      console.error("Premium parse error (face/daeun):", e);
    }
  } else {
    console.error("Premium call 3 failed:", results[2].reason);
  }

  return { ziwei12, monthlyFortune, faceAreas, daeunDetail, yongshin };
}
