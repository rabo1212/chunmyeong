"use client";

import { motion } from "framer-motion";
import type { SajuSection } from "@/lib/types";

// 섹션별 카테고리 라벨
const SECTION_LABELS: Record<string, string> = {
  overview: "총평",
  oheng: "오행",
  ilju: "일주",
  relationship: "대인관계",
  love: "연애",
  wealth: "재물",
  career: "직업",
  health: "건강",
  family: "가족",
  potential: "잠재력",
  yearly: "올해",
  letter: "편지",
};

interface SectionCardProps {
  section: SajuSection;
  locked?: boolean;
  delay?: number;
}

export default function SectionCard({ section, locked = false, delay = 0 }: SectionCardProps) {
  const label = SECTION_LABELS[section.sectionKey] || "";
  const num = String(section.sectionNumber).padStart(2, "0");

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className={`relative py-8 border-b border-cm-dim/10 ${
        locked ? "opacity-60" : ""
      }`}>
        {/* 넘버 + 라벨 */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-serif text-[13px] tracking-[0.15em] text-cm-dim">{num}</span>
          <span className="text-cm-dim/30">————</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-cm-muted">
            {label}
          </span>
        </div>

        {/* 제목 */}
        <h3 className={`font-serif text-lg font-normal leading-snug mb-4 ${
          locked ? "text-cm-muted/70" : "text-cm-text"
        }`}>
          {section.title}
        </h3>

        {/* 본문 */}
        <div className="relative">
          {locked ? (
            <p className="text-[13px] leading-[1.9] text-cm-dim/50 blur-[5px] select-none pointer-events-none">
              이 섹션에는 당신의 사주에 대한 깊이 있는 분석이 담겨있습니다. 오행의 흐름과 십신의 관계를 통해 당신만의 특별한 에너지 패턴을 읽어냅니다. 캐치프레이즈와 함께 스토리텔링 형식으로 풀어낸 해석입니다.
            </p>
          ) : (() => {
            // 첫 문장(캐치프레이즈)을 분리하여 강조 표시
            const firstDot = section.content.indexOf(".");
            const catchphrase = firstDot > 0 && firstDot < 60 ? section.content.slice(0, firstDot + 1) : null;
            const rest = catchphrase ? section.content.slice(firstDot + 1).trim() : section.content;
            return (
              <div className="text-[13px] leading-[1.9]">
                {catchphrase && (
                  <p className="text-cm-text font-medium mb-3">{catchphrase}</p>
                )}
                <p className="text-cm-muted">{rest}</p>
              </div>
            );
          })()}

          {/* 잠금 오버레이 */}
          {locked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-cm-muted">
                Premium
              </span>
            </div>
          )}
        </div>

        {/* 천명의 조언 */}
        {!locked && section.advice && (
          <div className="mt-5 pl-4 border-l-2 border-cm-accent/30">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cm-accent/60 mb-1">
              천명의 조언
            </p>
            <p className="text-[13px] text-cm-text/90 leading-relaxed">
              {section.advice}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
