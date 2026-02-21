import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { computeSaju } from "@/lib/saju";
import { computeZiwei, computeLiunian, computeDaxianList } from "@/lib/ziwei";
import { SAJU_SYSTEM_PROMPT, buildAnalysisPrompt } from "@/lib/prompts";
import type { BirthInfo } from "@/lib/types";

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
    let selfieBase64: string | null = body.selfieBase64 ?? null;

    // 1. 사주 계산
    const saju = computeSaju(birthInfo);

    // 1.5 자미두수 계산 (프리미엄용)
    const ziweiResult = computeZiwei(birthInfo);
    const currentYear = new Date().getFullYear();
    const liunianData = computeLiunian(birthInfo, currentYear);
    const daxianList = computeDaxianList(birthInfo);

    // 2. Claude API 호출
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

    const hasFace = !!selfieBase64;
    const promptText = buildAnalysisPrompt(saju.summary, hasFace);

    type ContentBlock =
      | { type: "image"; source: { type: "base64"; media_type: "image/jpeg"; data: string } }
      | { type: "text"; text: string };

    const content: ContentBlock[] = [];

    if (selfieBase64) {
      // base64 prefix 제거
      const base64Data = selfieBase64.replace(/^data:image\/\w+;base64,/, "");
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/jpeg",
          data: base64Data,
        },
      });
      // 즉시 참조 해제 (GC 대상)
      selfieBase64 = null;
    }

    content.push({ type: "text", text: promptText });

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 4000,
      temperature: 0.7,
      system: SAJU_SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });

    const interpretation =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({
      saju: {
        ...saju,
        // [FIX] CRITICAL 8: birthInfo 포함 (프리미엄 birthYear 계산용)
        birthInfo: { year: birthInfo.year, month: birthInfo.month, day: birthInfo.day },
      },
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
