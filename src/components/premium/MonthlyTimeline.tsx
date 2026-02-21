"use client";

import type { MonthlyFortune } from "@/lib/types";

interface Props {
  fortunes: MonthlyFortune[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-xs">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-cm-gold" : "text-cm-beige/20"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function MonthlyTimeline({ fortunes }: Props) {
  return (
    <div className="card p-4">
      <h3 className="font-serif text-lg text-cm-gold text-center mb-4">
        月運 {new Date().getFullYear()}년 월별 운세
      </h3>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {fortunes.map((f) => {
          const isCurrentMonth = f.month === new Date().getMonth() + 1;
          return (
            <div
              key={f.month}
              className={`flex-shrink-0 w-[200px] rounded-lg border p-3 ${
                isCurrentMonth
                  ? "border-cm-gold/40 bg-cm-gold/5"
                  : "border-cm-gold/10 bg-cm-navy/60"
              }`}
            >
              {/* 월 헤더 */}
              <div className="flex items-center justify-between mb-2">
                <span className={`font-serif text-sm ${isCurrentMonth ? "text-cm-gold" : "text-cm-ivory"}`}>
                  {f.month}월
                  {isCurrentMonth && (
                    <span className="ml-1 text-[10px] text-cm-gold/70">NOW</span>
                  )}
                </span>
                <StarRating rating={f.starRating} />
              </div>

              {/* 키워드 */}
              <div className="flex flex-wrap gap-1 mb-2">
                {f.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] px-1.5 py-0.5 bg-cm-gold/10 text-cm-gold rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* 분석 */}
              <p className="text-xs leading-relaxed text-cm-beige/70 mb-2">
                {f.analysis}
              </p>

              {/* 행운 정보 */}
              <div className="border-t border-cm-gold/10 pt-2 space-y-0.5">
                <p className="text-[10px] text-cm-beige/50">
                  행운의 날: <span className="text-cm-ivory">{f.luckyDay}</span>
                </p>
                <p className="text-[10px] text-cm-beige/50">
                  행운의 색: <span className="text-cm-ivory">{f.luckyColor}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
