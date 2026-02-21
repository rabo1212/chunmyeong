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

// JSON 파싱 헬퍼 — Claude가 가끔 ```json 블록으로 감쌀 수 있음
function parseJSON<T>(text: string): T {
  // ```json ... ``` 블록 제거
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }
  return JSON.parse(cleaned);
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
      // JSON 파싱 검증
      parseJSON(text);
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
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  const targetYear = new Date().getFullYear();
  const liunianSummary = buildLiunianSummary(input.liunianData);
  const daeunSummary = buildDaeunSummary(input.saju.daeun, input.saju.daeun.length > 0
    ? targetYear - input.saju.daeun[0].age
    : targetYear - 30 // fallback
  );

  // 프롬프트 3종 구성
  const prompt1 = buildZiweiYongshinPrompt(input.ziweiSummary, input.saju.summary);
  const prompt2 = buildMonthlyFortunePrompt(liunianSummary, input.saju.summary, targetYear);
  const prompt3 = buildFaceDaeunPrompt(
    input.saju.summary,
    input.interpretation,
    daeunSummary,
    input.hasFacePhoto
  );

  // 3건 병렬 호출
  const [result1, result2, result3] = await Promise.all([
    callClaude(anthropic, prompt1),
    callClaude(anthropic, prompt2),
    callClaude(anthropic, prompt3, input.hasFacePhoto ? input.selfieBase64 : null),
  ]);

  // JSON 파싱
  const data1 = parseJSON<{ ziwei12: ZiweiPalaceAnalysis[]; yongshin: YongshinInfo }>(result1);
  const data2 = parseJSON<{ monthlyFortune: MonthlyFortune[] }>(result2);
  const data3 = parseJSON<{ faceAreas: FaceAreaAnalysis[]; daeunDetail: DaeunDetail }>(result3);

  return {
    ziwei12: data1.ziwei12,
    monthlyFortune: data2.monthlyFortune,
    faceAreas: data3.faceAreas,
    daeunDetail: data3.daeunDetail,
    yongshin: data1.yongshin,
  };
}
