"use client";

import type { SajuData } from "@/lib/types";

interface ResultCardProps {
  saju: SajuData;
  name?: string;
}

export default function ResultCard({ saju, name }: ResultCardProps) {
  const pillars = saju.pillars;
  const displayName = name || "당신";

  return (
    <div
      id="result-card"
      className="bg-cm-bg p-6 max-w-sm mx-auto"
      style={{ width: 360, minHeight: 360, border: "1px solid rgba(74, 71, 68, 0.15)" }}
    >
      {/* 헤더 */}
      <div className="text-center mb-5">
        <p className="font-serif text-2xl text-cm-accent">天命</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-cm-muted mt-2">{displayName}의 사주팔자</p>
      </div>

      {/* 사주 4주 한 줄 */}
      <div className="flex justify-center gap-3 mb-4">
        {(["year", "month", "day", "hour"] as const).map((key) => {
          const p = pillars[key];
          if (!p) return null;
          return (
            <div key={key} className="text-center">
              <div className="w-12 h-12 bg-cm-surface border border-cm-dim/15 flex items-center justify-center">
                <span className="font-serif text-lg text-cm-text">{p.ganzi}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 오행 바 */}
      <div className="flex gap-1 justify-center mb-4">
        {(
          [
            ["wood", "#4ade80"],
            ["fire", "#f87171"],
            ["earth", "#fbbf24"],
            ["metal", "#e2e8f0"],
            ["water", "#60a5fa"],
          ] as const
        ).map(([key, color]) => {
          const val = saju.oheng[key];
          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <div
                className="w-8"
                style={{
                  height: `${Math.max(val * 12, 4)}px`,
                  backgroundColor: color,
                  opacity: val > 0 ? 1 : 0.2,
                }}
              />
              <span className="text-[8px] text-cm-dim">{val}</span>
            </div>
          );
        })}
      </div>

      {/* 워터마크 */}
      <div className="text-center">
        <p className="text-[10px] text-cm-dim/40 tracking-[0.1em]">chunmyeong.vercel.app</p>
      </div>
    </div>
  );
}
