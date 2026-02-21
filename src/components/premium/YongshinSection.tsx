"use client";

import type { YongshinInfo } from "@/lib/types";

interface Props {
  yongshin: YongshinInfo;
}

const LUCKY_ITEMS = [
  { key: "color", label: "행운의 색", emoji: "🎨" },
  { key: "direction", label: "행운의 방향", emoji: "🧭" },
  { key: "number", label: "행운의 숫자", emoji: "🔢" },
  { key: "gemstone", label: "행운의 보석", emoji: "💎" },
  { key: "food", label: "보충 음식", emoji: "🍽️" },
  { key: "career", label: "추천 직업군", emoji: "👔" },
] as const;

export default function YongshinSection({ yongshin }: Props) {
  return (
    <div className="card p-4">
      <h3 className="font-serif text-lg text-cm-gold text-center mb-4">
        用神 용신 분석 & 행운 정보
      </h3>

      {/* 용신 메인 */}
      <div className="bg-cm-gold/5 border border-cm-gold/20 rounded-lg p-4 mb-4 text-center">
        <p className="text-xs text-cm-beige/50 mb-1">당신의 용신</p>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-3xl">{yongshin.elementEmoji}</span>
          <span className="font-serif text-2xl text-cm-gold">{yongshin.element}</span>
        </div>
        <p className="text-sm leading-relaxed text-cm-beige/80 text-left">
          {yongshin.analysis}
        </p>
      </div>

      {/* 행운 그리드 */}
      <div className="grid grid-cols-2 gap-2">
        {LUCKY_ITEMS.map(({ key, label, emoji }) => (
          <div
            key={key}
            className="bg-cm-navy/60 border border-cm-gold/10 rounded-lg p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-base">{emoji}</span>
              <span className="text-[10px] text-cm-beige/50">{label}</span>
            </div>
            <p className="text-sm text-cm-ivory font-medium">
              {yongshin[key as keyof YongshinInfo] as string}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
