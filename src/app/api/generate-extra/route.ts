import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import OpenAI from "openai";
import { computeSaju } from "@/lib/saju";
import {
  PREMIUM_SYSTEM_PROMPT,
  buildCompatibilityPrompt,
  buildFamilyMatchPrompt,
  buildCelebMatchPrompt,
} from "@/lib/premium-prompts";
import type { BirthInfo, CompatibilityResult, PremiumResult } from "@/lib/types";

export const maxDuration = 60;

interface PartnerInfo {
  name: string;
  year: number;
  month: number;
  day: number;
  gender: "male" | "female";
}

// JSON 파싱 헬퍼
function parseJSON<T>(text: string): T {
  let cleaned = text.trim();
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) cleaned = codeBlockMatch[1].trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("JSON 파싱 실패");
  }
}

export async function POST(request: NextRequest) {
  try {
    const { resultId, extraType, partnerInfo } = (await request.json()) as {
      resultId: string;
      extraType: "compatibility" | "celeb_match" | "family_match";
      partnerInfo: PartnerInfo;
    };

    if (!resultId || !extraType || !partnerInfo) {
      return NextResponse.json({ error: "필수 정보가 부족합니다." }, { status: 400 });
    }

    // 1. KV에서 기존 결과 조회
    const result = await kv.get<PremiumResult>(`result:${resultId}`);
    if (!result) {
      return NextResponse.json({ error: "결과를 찾을 수 없습니다." }, { status: 404 });
    }

    // 선택 메뉴에 해당 extra가 있는지 확인
    const selectedExtras = (result as PremiumResult & { selectedExtras?: string[] }).selectedExtras || [];
    if (!selectedExtras.includes(extraType)) {
      return NextResponse.json({ error: "선택하지 않은 메뉴입니다." }, { status: 403 });
    }

    // 2. 상대방 사주 계산
    const partnerBirthInfo: BirthInfo = {
      year: partnerInfo.year,
      month: partnerInfo.month,
      day: partnerInfo.day,
      hour: 12,
      minute: 0,
      gender: partnerInfo.gender,
      unknownTime: true,
      calendarType: "solar",
      name: partnerInfo.name,
    };

    const partnerSaju = computeSaju(partnerBirthInfo);

    // 3. GPT 호출
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY 미설정");

    const openai = new OpenAI({ apiKey });

    let prompt: string;
    if (extraType === "compatibility") {
      prompt = buildCompatibilityPrompt(result.saju.summary, partnerSaju.summary, partnerInfo.name);
    } else if (extraType === "family_match") {
      prompt = buildFamilyMatchPrompt(result.saju.summary, partnerSaju.summary, partnerInfo.name);
    } else {
      // celeb_match
      prompt = buildCelebMatchPrompt(result.saju.summary, partnerInfo.name, partnerSaju.summary);
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 3000,
      temperature: 0.7,
      messages: [
        { role: "system", content: PREMIUM_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices[0]?.message?.content ?? "";
    const compatibilityData = parseJSON<CompatibilityResult>(content);

    // 4. KV에 결과 업데이트 (기존 결과에 궁합 추가)
    const updatedResult = {
      ...result,
      premium: {
        ...result.premium,
        compatibility: {
          ...compatibilityData,
          extraType,
          partnerName: partnerInfo.name,
        },
      },
    };

    await kv.set(`result:${resultId}`, updatedResult, { ex: 2592000 });

    return NextResponse.json({
      compatibility: {
        ...compatibilityData,
        extraType,
        partnerName: partnerInfo.name,
      },
    });
  } catch (error) {
    console.error("Generate extra error:", error);
    return NextResponse.json(
      { error: "추가 분석 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
