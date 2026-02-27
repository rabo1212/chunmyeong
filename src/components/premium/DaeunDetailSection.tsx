"use client";

import type { DaeunDetail } from "@/lib/types";

interface Props {
  detail: DaeunDetail;
}

export default function DaeunDetailSection({ detail }: Props) {
  return (
    <div className="py-6 border-b border-cm-dim/10">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-cm-muted text-center mb-5">
        대운 상세 해석
      </h3>

      <div className="space-y-0">
        {/* 이전 대운 */}
        {detail.previous && (
          <div className="py-4 border-b border-cm-dim/8 opacity-60">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.1em] text-cm-dim">이전 대운</span>
              <span className="font-serif text-[13px] text-cm-muted">
                {detail.previous.ganzi}
              </span>
              <span className="text-[10px] text-cm-dim">
                ({detail.previous.ageRange})
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-cm-dim">
              {detail.previous.summary}
            </p>
          </div>
        )}

        {/* 현재 대운 (강조) */}
        <div className="py-6 border-b border-cm-dim/8 border-l-2 border-l-cm-accent/40 pl-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-cm-accent">
                현재 대운: {detail.current.ganzi}
              </span>
            </div>
            <span className="text-[10px] text-cm-dim">
              {detail.current.ageRange}
            </span>
          </div>
          <p className="text-[13px] text-cm-accent/70 mb-3 italic">
            &ldquo;{detail.current.title}&rdquo;
          </p>
          <p className="text-[13px] leading-[1.9] text-cm-muted">
            {detail.current.analysis}
          </p>
        </div>

        {/* 다음 대운 */}
        {detail.next && (
          <div className="py-4 border-b border-cm-dim/8 opacity-60">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.1em] text-cm-dim">다음 대운</span>
              <span className="font-serif text-[13px] text-cm-muted">
                {detail.next.ganzi}
              </span>
              <span className="text-[10px] text-cm-dim">
                ({detail.next.ageRange})
              </span>
            </div>
            <p className="text-[12px] leading-relaxed text-cm-dim">
              {detail.next.summary}
            </p>
          </div>
        )}

        {/* 핵심 조언 */}
        <div className="pt-5 pl-4 border-l-2 border-cm-accent/30">
          <p className="text-[10px] uppercase tracking-[0.15em] text-cm-accent/60 mb-1">이 시기 핵심 조언</p>
          <p className="text-[13px] leading-relaxed text-cm-text">
            {detail.coreAdvice}
          </p>
        </div>
      </div>
    </div>
  );
}
