"use client";

import type { OhengDistribution } from "@/lib/types";

interface OhengChartProps {
  oheng: OhengDistribution;
}

const ELEMENTS = [
  { key: "wood" as const, label: "목(木)", color: "bg-oheng-wood", textColor: "text-oheng-wood" },
  { key: "fire" as const, label: "화(火)", color: "bg-oheng-fire", textColor: "text-oheng-fire" },
  { key: "earth" as const, label: "토(土)", color: "bg-oheng-earth", textColor: "text-oheng-earth" },
  { key: "metal" as const, label: "금(金)", color: "bg-oheng-metal", textColor: "text-oheng-metal" },
  { key: "water" as const, label: "수(水)", color: "bg-oheng-water", textColor: "text-oheng-water" },
];

export default function OhengChart({ oheng }: OhengChartProps) {
  const total = Object.values(oheng).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="py-6 border-b border-cm-dim/10">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-cm-muted text-center mb-5">
        오행 분포
      </h3>

      <div className="space-y-3">
        {ELEMENTS.map(({ key, label, color, textColor }) => {
          const count = oheng[key];
          const pct = Math.round((count / total) * 100);
          return (
            <div key={key} className="flex items-center gap-3">
              <span className={`text-[12px] font-medium w-14 ${textColor}`}>{label}</span>
              <div className="flex-1 h-[3px] bg-cm-surface overflow-hidden">
                <div
                  className={`h-full ${color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[11px] text-cm-dim w-6 text-right">{count}</span>
            </div>
          );
        })}
      </div>

      {/* 부족한 오행 표시 */}
      {(() => {
        const missing = ELEMENTS.filter(({ key }) => oheng[key] === 0);
        if (missing.length === 0) return null;
        return (
          <p className="text-[11px] text-cm-dim mt-4 text-center">
            부족한 오행:{" "}
            {missing.map(({ label, textColor }) => (
              <span key={label} className={textColor}>
                {label}{" "}
              </span>
            ))}
          </p>
        );
      })()}
    </div>
  );
}
