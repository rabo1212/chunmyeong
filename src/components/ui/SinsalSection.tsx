"use client";

import { SINSAL_12_DESC } from "@/lib/sinsal";
import type { PillarData, SpecialSinsalData } from "@/lib/types";

interface SinsalSectionProps {
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData | null;
  };
  specialSinsal: SpecialSinsalData[];
}

const PILLAR_LABELS = ["년주", "월주", "일주", "시주"];

export default function SinsalSection({ pillars, specialSinsal }: SinsalSectionProps) {
  // 12신살 추출
  const pillarList = [pillars.year, pillars.month, pillars.day, pillars.hour];
  const sinsal12 = pillarList
    .map((p, i) => {
      if (!p) return null;
      const info = SINSAL_12_DESC[p.sinsal];
      if (!info) return null;
      return { pillar: PILLAR_LABELS[i], hanja: p.sinsal, ...info };
    })
    .filter(Boolean) as { pillar: string; hanja: string; name: string; emoji: string; desc: string }[];

  return (
    <div className="space-y-4">
      {/* 특수 신살 (천을귀인, 도화살 등) */}
      {specialSinsal.length > 0 && (
        <div>
          <h3 className="font-serif text-lg text-cm-gold mb-3">특수 신살</h3>
          <div className="space-y-2">
            {specialSinsal.map((s) => (
              <div
                key={s.hanja}
                className="card p-3"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl mt-0.5">{s.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif font-bold text-cm-ivory">
                        {s.name}
                      </span>
                      <span className="text-xs text-cm-beige/40">{s.hanja}</span>
                      <div className="flex gap-1">
                        {s.positions.map((pos) => (
                          <span
                            key={pos}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-cm-gold/20 text-cm-gold"
                          >
                            {pos}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-cm-beige/60 mt-1 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 12신살 */}
      <div>
        <h3 className="font-serif text-lg text-cm-gold mb-3">12신살</h3>
        <div className="grid grid-cols-1 gap-2">
          {sinsal12.map((s) => (
            <div
              key={s.pillar}
              className="card p-3 flex items-start gap-2"
            >
              <span className="text-lg">{s.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cm-gold/70 font-bold">{s.pillar}</span>
                  <span className="text-sm font-serif text-cm-ivory">
                    {s.name}
                  </span>
                  <span className="text-xs text-cm-beige/40">{s.hanja}</span>
                </div>
                <p className="text-xs text-cm-beige/50 mt-0.5 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {specialSinsal.length === 0 && (
        <p className="text-xs text-cm-beige/40 text-center">
          특수 신살이 발견되지 않았습니다
        </p>
      )}
    </div>
  );
}
