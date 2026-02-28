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
  {
    stars: 5,
    text: "반신반의하면서 해봤는데 일주 분석이 소름 돋았어요. 제가 결정을 잘 못 내리는 성격이라는 걸 딱 짚어줬는데, 주변에서도 다 맞다고... 연애운도 최근 상황이랑 너무 맞아서 캡처해뒀어요.",
    who: "28세 여성 · 직장인",
  },
  {
    stars: 5,
    text: "사주 보러 가면 5만원인데 여기서 무료로 이 정도 퀄리티면 진짜 개이득이에요. 재물운에서 '충동 소비 조심하라'는 말이 찔렸는데 진짜 이번 달 카드값 터졌거든요 ㅋㅋ 프리미엄도 궁금해지네요.",
    who: "32세 남성 · 프리랜서",
  },
  {
    stars: 5,
    text: "친구 4명이서 같이 해봤는데 결과가 다 달라서 신기했어요. 특히 오행 분석이 시각적으로 잘 돼 있어서 이해하기 쉬웠고, 저한테 부족한 오행을 보충하는 방법까지 알려줘서 좋았어요!",
    who: "25세 여성 · 대학생",
  },
  {
    stars: 4,
    text: "어머니 생신 때 가족들 사주 다 돌려봤어요. 엄마가 '이거 용하다' 하시면서 아버지 것도 해보자고 하셔서 결국 온 가족이 봤네요. 명절 때 할 거 없을 때 강추합니다.",
    who: "30세 남성 · 회사원",
  },
  {
    stars: 5,
    text: "점집 가기 전에 가볍게 해본 건데 오히려 여기가 더 자세하고 구체적이에요. 2026 운세에서 하반기에 이직 기회 온다는 거 보고 진짜 준비하려구요. AI가 이렇게 잘하는 줄 몰랐어요.",
    who: "27세 여성 · 마케터",
  },
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
        className="flex items-center justify-center gap-5 mb-12 py-4 border-t border-b border-cm-dim/10 w-full"
      >
        <div className="text-center">
          <p className="font-serif text-xl font-semibold text-cm-text">24,831</p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-cm-muted font-medium mt-1">분석 완료</p>
        </div>
        <div className="w-[1px] h-8 bg-cm-dim/15" />
        <div className="text-center">
          <p className="font-serif text-xl font-semibold text-cm-text">97<span className="text-[14px] text-cm-muted">%</span></p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-cm-muted font-medium mt-1">만족도</p>
        </div>
        <div className="w-[1px] h-8 bg-cm-dim/15" />
        <div className="text-center">
          <p className="font-serif text-xl font-semibold text-cm-text">4.8<span className="text-cm-accent">/5</span></p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-cm-muted font-medium mt-1">평점</p>
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

      {/* 후기 섹션 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full mb-12"
      >
        <div className="text-center mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cm-accent font-semibold mb-2">
            Real Reviews
          </p>
          <h3 className="font-serif text-lg font-medium text-cm-text">
            실제 사용자 솔직 후기
          </h3>
        </div>

        <div className="space-y-3">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + i * 0.08, duration: 0.4 }}
              className="p-4 bg-white/50 border border-cm-dim/10"
            >
              {/* 별점 */}
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <span key={j} className="text-[13px] text-cm-accent">&#9733;</span>
                ))}
                {Array.from({ length: 5 - r.stars }).map((_, j) => (
                  <span key={j} className="text-[13px] text-cm-dim/30">&#9733;</span>
                ))}
              </div>
              {/* 후기 텍스트 */}
              <p className="text-[13px] text-cm-text leading-[1.7] mb-2">
                {r.text}
              </p>
              {/* 작성자 */}
              <p className="text-[11px] text-cm-dim font-medium">
                — {r.who}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 프로세스 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
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
        transition={{ delay: 1.3 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="btn-primary w-full max-w-[300px] mb-4"
      >
        시작하기
      </motion.button>
    </motion.div>
  );
}
