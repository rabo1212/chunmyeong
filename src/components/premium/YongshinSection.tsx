"use client";

import type { YongshinInfo } from "@/lib/types";

interface Props {
  yongshin: YongshinInfo;
}

const LUCKY_ITEMS = [
  { key: "color", label: "행운의 색" },
  { key: "direction", label: "행운의 방향" },
  { key: "number", label: "행운의 숫자" },
  { key: "gemstone", label: "행운의 보석" },
  { key: "food", label: "보충 음식" },
  { key: "career", label: "추천 직업군" },
] as const;

export default function YongshinSection({ yongshin }: Props) {
  return (
    <div className="py-6 border-b border-cm-dim/10">
      <h3 className="text-[13px] font-medium tracking-[0.15em] text-cm-text text-center mb-5">
        용신 분석 · 행운 정보
      </h3>

      {/* 용신 메인 */}
      <div className="py-6 border-b border-cm-dim/8 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-cm-muted font-medium mb-2">당신의 용신</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-3xl">{yongshin.elementEmoji}</span>
          <span className="font-serif text-2xl font-semibold text-cm-accent">{yongshin.element}</span>
        </div>
        <p className="text-[14px] leading-[1.9] text-cm-muted text-left">
          {yongshin.analysis}
        </p>
      </div>

      {/* 행운 그리드 */}
      <div className="grid grid-cols-2 gap-0">
        {LUCKY_ITEMS.map(({ key, label }) => (
          <div
            key={key}
            className="py-3 px-3 border-b border-cm-dim/8"
          >
            <p className="text-[11px] uppercase tracking-[0.1em] text-cm-muted font-medium mb-1">{label}</p>
            <p className="text-[14px] font-medium text-cm-text">
              {yongshin[key as keyof YongshinInfo] as string}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
