"use client";

import type { DaeunDetail } from "@/lib/types";

interface Props {
  detail: DaeunDetail;
}

export default function DaeunDetailSection({ detail }: Props) {
  return (
    <div className="card p-4">
      <h3 className="font-serif text-lg text-cm-gold text-center mb-4">
        大運 대운 상세 해석
      </h3>

      <div className="space-y-3">
        {/* 이전 대운 */}
        {detail.previous && (
          <div className="bg-cm-navy/40 rounded-lg p-3 opacity-70">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-cm-beige/40">⏪ 이전 대운</span>
              <span className="font-serif text-sm text-cm-beige/60">
                {detail.previous.ganzi}
              </span>
              <span className="text-[10px] text-cm-beige/30">
                ({detail.previous.ageRange})
              </span>
            </div>
            <p className="text-xs leading-relaxed text-cm-beige/50">
              {detail.previous.summary}
            </p>
          </div>
        )}

        {/* 현재 대운 (강조) */}
        <div className="bg-cm-gold/5 border-2 border-cm-gold/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔮</span>
              <span className="font-serif text-base text-cm-gold">
                현재 대운: {detail.current.ganzi}
              </span>
            </div>
            <span className="text-xs text-cm-beige/50">
              {detail.current.ageRange}
            </span>
          </div>
          <p className="font-serif text-sm text-cm-gold/80 mb-3 italic">
            &ldquo;{detail.current.title}&rdquo;
          </p>
          <p className="text-sm leading-relaxed text-cm-beige/80">
            {detail.current.analysis}
          </p>
        </div>

        {/* 다음 대운 */}
        {detail.next && (
          <div className="bg-cm-navy/40 rounded-lg p-3 opacity-70">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-cm-beige/40">⏩ 다음 대운</span>
              <span className="font-serif text-sm text-cm-beige/60">
                {detail.next.ganzi}
              </span>
              <span className="text-[10px] text-cm-beige/30">
                ({detail.next.ageRange})
              </span>
            </div>
            <p className="text-xs leading-relaxed text-cm-beige/50">
              {detail.next.summary}
            </p>
          </div>
        )}

        {/* 핵심 조언 */}
        <div className="flex items-start gap-2 bg-cm-deep/60 rounded-lg p-3 mt-2">
          <span className="text-lg">💡</span>
          <div>
            <span className="text-xs text-cm-gold font-bold">이 시기 핵심 조언</span>
            <p className="text-sm leading-relaxed text-cm-ivory mt-1">
              {detail.coreAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
