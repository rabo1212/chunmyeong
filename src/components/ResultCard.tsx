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
      className="bg-cm-navy p-6 rounded-2xl border border-cm-gold/30 max-w-sm mx-auto"
      style={{ width: 360, minHeight: 360 }}
    >
      {/* 헤더 */}
      <div className="text-center mb-4">
        <p className="font-serif text-2xl text-cm-gold glow-gold">天命</p>
        <p className="text-xs text-cm-beige/50 mt-1">{displayName}의 사주팔자</p>
      </div>

      {/* 사주 4주 한 줄 */}
      <div className="flex justify-center gap-3 mb-4">
        {(["year", "month", "day", "hour"] as const).map((key) => {
          const p = pillars[key];
          if (!p) return null;
          return (
            <div key={key} className="text-center">
              <div className="w-12 h-12 bg-cm-deep border border-cm-gold/20 rounded-lg flex items-center justify-center">
                <span className="font-serif text-lg text-cm-ivory">{p.ganzi}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 오행 바 */}
      <div className="flex gap-1 justify-center mb-4">
        {(
          [
            ["wood", "#4a7c59"],
            ["fire", "#d4483b"],
            ["earth", "#c9a96e"],
            ["metal", "#e8e8e8"],
            ["water", "#2c5f7c"],
          ] as const
        ).map(([key, color]) => {
          const val = saju.oheng[key];
          return (
            <div key={key} className="flex flex-col items-center gap-1">
              <div
                className="w-8 rounded-sm"
                style={{
                  height: `${Math.max(val * 12, 4)}px`,
                  backgroundColor: color,
                  opacity: val > 0 ? 1 : 0.2,
                }}
              />
              <span className="text-[8px] text-cm-beige/40">{val}</span>
            </div>
          );
        })}
      </div>

      {/* 워터마크 */}
      <div className="text-center">
        <p className="text-[10px] text-cm-beige/30">chunmyeong.vercel.app</p>
      </div>
    </div>
  );
}
