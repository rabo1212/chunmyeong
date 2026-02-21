import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PremiumResultView from "./PremiumResultView";
import type { PremiumResult } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "천명 프리미엄 분석 결과",
    description: "AI 사주×관상 프리미엄 통합 분석 결과",
  };
}

export default async function PremiumResultPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // KV에서 결과 조회
  const result = await kv.get<PremiumResult>(`result:${id}`);

  if (!result) {
    notFound();
  }

  return <PremiumResultView result={result} />;
}
