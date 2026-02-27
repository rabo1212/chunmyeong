"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

const PREVIEW_CARDS = [
  { label: "총평", emoji: "🔮", preview: "당신의 핵심 기질과 타고난 에너지를 분석합니다" },
  { label: "연애운", emoji: "💕", preview: "이상적인 연인상과 연애 패턴을 알려드립니다" },
  { label: "재물운", emoji: "💰", preview: "돈의 흐름과 투자 적성을 파악합니다" },
  { label: "올해운세", emoji: "📅", preview: "2026년 나에게 찾아올 기회와 변화" },
];

const REVIEWS = [
  { text: "사주를 이렇게 쉽고 재밌게 볼 수 있다니!", who: "28세 여성" },
  { text: "연애운이 정말 소름 돋게 맞았어요", who: "32세 남성" },
  { text: "친구들이랑 돌려봤는데 다들 신기해해요", who: "25세 여성" },
];

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center px-6 pt-16 pb-12"
    >
      {/* 히어로 */}
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="text-center mb-10"
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-cm-accent font-semibold mb-5">
          天命 · AI Saju
        </p>
        <h1 className="font-serif text-3xl font-medium text-cm-text leading-snug mb-4">
          오늘,<br />
          당신의 운명을<br />
          읽어드립니다
        </h1>
        <p className="text-[15px] text-cm-muted leading-[1.7]">
          AI가 사주팔자를 분석해<br />
          당신만의 인생 지도를 그려요
        </p>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="btn-primary w-full max-w-[300px] text-[13px] py-4 mb-4"
      >
        무료로 시작하기
      </motion.button>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[11px] text-cm-dim font-medium mb-12"
      >
        약 1분 · 5가지 무료 분석
      </motion.p>

      {/* 사회적 증거 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="flex items-center justify-center gap-6 mb-12 py-4 border-t border-b border-cm-dim/10 w-full"
      >
        <div className="text-center">
          <p className="font-serif text-xl font-semibold text-cm-text">24,831</p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-cm-muted font-medium mt-1">분석 완료</p>
        </div>
        <div className="w-[1px] h-8 bg-cm-dim/15" />
        <div className="text-center">
          <p className="font-serif text-xl font-semibold text-cm-text">4.7<span className="text-cm-accent">/5</span></p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-cm-muted font-medium mt-1">만족도</p>
        </div>
      </motion.div>

      {/* 미리보기 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="w-full mb-12"
      >
        <p className="text-[12px] font-medium text-cm-muted text-center mb-4">
          이런 걸 알 수 있어요
        </p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {PREVIEW_CARDS.map((card) => (
            <div
              key={card.label}
              className="flex-shrink-0 w-[150px] p-4 border border-cm-dim/15"
            >
              <span className="text-2xl mb-2 block">{card.emoji}</span>
              <p className="text-[13px] font-medium text-cm-text mb-1">{card.label}</p>
              <p className="text-[11px] text-cm-muted leading-relaxed">{card.preview}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 후기 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full mb-12 space-y-3"
      >
        {REVIEWS.map((r, i) => (
          <div key={i} className="py-3 border-b border-cm-dim/8">
            <p className="text-[13px] text-cm-text leading-relaxed">
              &ldquo;{r.text}&rdquo;
            </p>
            <p className="text-[11px] text-cm-dim mt-1">— {r.who}</p>
          </div>
        ))}
      </motion.div>

      {/* 프로세스 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="flex items-center gap-6 mb-8"
      >
        {[
          { num: "01", text: "입력" },
          { num: "02", text: "분석" },
          { num: "03", text: "결과" },
        ].map((step, i) => (
          <div key={step.num} className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[12px] tracking-[0.15em] text-cm-dim font-serif font-medium">{step.num}</span>
              <span className="text-[12px] uppercase tracking-[0.15em] text-cm-muted font-medium">{step.text}</span>
            </div>
            {i < 2 && <span className="text-cm-dim">—</span>}
          </div>
        ))}
      </motion.div>

      {/* 하단 CTA */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="btn-primary w-full max-w-[300px] mb-4"
      >
        시작하기
      </motion.button>
    </motion.div>
  );
}
