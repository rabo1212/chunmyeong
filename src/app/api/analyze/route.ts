import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { computeSaju } from "@/lib/saju";
import { computeZiwei, computeLiunian, computeDaxianList } from "@/lib/ziwei";
import {
  SAJU_SYSTEM_PROMPT,
  buildSections1to6Prompt,
  buildSections7to12Prompt,
  buildAnalysisPrompt,
  SAJU_SYSTEM_PROMPT_LEGACY,
} from "@/lib/prompts";
import type { BirthInfo, SajuSection } from "@/lib/types";

export const maxDuration = 60;

// 간단한 메모리 기반 rate limit (IP당 분당 3회)
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

// JSON 파싱 헬퍼 (```json 블록 + {} 추출)
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

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "잠시 후 다시 시도해주세요. (1분 내 3회 제한)" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const birthInfo: BirthInfo = body.birthInfo;

    // 1. 사주 계산
    const saju = computeSaju(birthInfo);

    // 1.5 자미두수 계산 (프리미엄용)
    const ziweiResult = computeZiwei(birthInfo);
    const currentYear = new Date().getFullYear();
    const liunianData = computeLiunian(birthInfo, currentYear);
    const daxianList = computeDaxianList(birthInfo);

    // 2. OpenAI API 호출 — 12섹션 2회 분할 병렬
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY 환경변수 없음");
    const openai = new OpenAI({ apiKey });

    const prompt1 = buildSections1to6Prompt(saju.summary, birthInfo.name);
    const prompt2 = buildSections7to12Prompt(saju.summary, birthInfo.name, currentYear);

    const callGPT = async (prompt: string, system: string): Promise<string> => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          { role: "system", content: system },
          { role: "user", content: prompt },
        ],
      });

      return response.choices[0]?.message?.content ?? "";
    };

    // 2개 병렬 호출: 섹션1~6, 섹션7~12
    const results = await Promise.allSettled([
      callGPT(prompt1, SAJU_SYSTEM_PROMPT),
      callGPT(prompt2, SAJU_SYSTEM_PROMPT),
    ]);

    // 12섹션 파싱
    const sections: SajuSection[] = [];

    if (results[0].status === "fulfilled") {
      try {
        const data = parseJSON<{ sections: SajuSection[] }>(results[0].value);
        sections.push(...(data.sections || []));
      } catch (e) {
        console.error("섹션 1~6 파싱 실패:", e);
      }
    } else {
      console.error("섹션 1~6 호출 실패:", results[0].reason);
    }

    if (results[1].status === "fulfilled") {
      try {
        const data = parseJSON<{ sections: SajuSection[] }>(results[1].value);
        sections.push(...(data.sections || []));
      } catch (e) {
        console.error("섹션 7~12 파싱 실패:", e);
      }
    } else {
      console.error("섹션 7~12 호출 실패:", results[1].reason);
    }

    // sectionNumber 기준 정렬
    sections.sort((a, b) => a.sectionNumber - b.sectionNumber);

    // 섹션이 없는 경우 폴백: 레거시 단일 호출
    let interpretation = "";
    if (sections.length === 0) {
      console.warn("12섹션 생성 실패, 레거시 폴백");
      const legacyPrompt = buildAnalysisPrompt(saju.summary, currentYear);
      const fallback = await callGPT(legacyPrompt, SAJU_SYSTEM_PROMPT_LEGACY);
      interpretation = fallback;
    }

    return NextResponse.json({
      saju: {
        ...saju,
        birthInfo: { year: birthInfo.year, month: birthInfo.month, day: birthInfo.day },
      },
      sections,
      interpretation,
      // 프리미엄용 데이터
      ziweiSummary: ziweiResult?.summary ?? null,
      liunianData,
      daxianList,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다. 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
