"use client";

import type { MonthlyFortune } from "@/lib/types";

interface Props {
  fortunes: MonthlyFortune[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-[11px]">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-cm-accent" : "text-cm-dim/30"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function MonthlyTimeline({ fortunes }: Props) {
  return (
    <div className="py-6 border-b border-cm-dim/10">
      <h3 className="text-[13px] font-medium tracking-[0.15em] text-cm-text text-center mb-5">
        {new Date().getFullYear()}년 월별 운세
      </h3>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {fortunes.map((f) => {
          const isCurrentMonth = f.month === new Date().getMonth() + 1;
          return (
            <div
              key={f.month}
              className={`flex-shrink-0 w-[200px] p-4 border ${
                isCurrentMonth
                  ? "border-cm-accent/20"
                  : "border-cm-dim/10"
              }`}
            >
              {/* 월 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[14px] font-serif font-medium ${isCurrentMonth ? "text-cm-accent" : "text-cm-text"}`}>
                  {f.month}월
                  {isCurrentMonth && (
                    <span className="ml-1.5 text-[9px] uppercase tracking-[0.15em] text-cm-accent/70">Now</span>
                  )}
                </span>
                <StarRating rating={f.starRating} />
              </div>

              {/* 키워드 */}
              <div className="flex flex-wrap gap-1 mb-3">
                {f.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] font-medium px-1.5 py-0.5 border border-cm-accent/30 text-cm-accent"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* 분석 */}
              <p className="text-[13px] leading-[1.8] text-cm-muted mb-3">
                {f.analysis}
              </p>

              {/* 행운 정보 */}
              <div className="border-t border-cm-dim/10 pt-2 space-y-0.5">
                <p className="text-[11px] text-cm-muted">
                  행운의 날: <span className="text-cm-text font-medium">{f.luckyDay}</span>
                </p>
                <p className="text-[11px] text-cm-muted">
                  행운의 색: <span className="text-cm-text font-medium">{f.luckyColor}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
