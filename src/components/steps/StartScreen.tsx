"use client";

import { motion } from "framer-motion";

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[85dvh] px-6 text-center"
    >
      {/* 로고 */}
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-16"
      >
        <h1 className="font-serif text-5xl font-normal text-cm-text tracking-tight mb-4">
          天命
        </h1>
        <p className="text-[12px] uppercase tracking-[0.3em] text-cm-muted font-medium">
          AI Saju Analysis
        </p>
      </motion.div>

      {/* 설명 */}
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-16"
      >
        <p className="text-cm-muted text-[15px] leading-[1.8]">
          당신의 <span className="text-cm-accent">사주팔자</span>를
          <br />
          AI가 깊이 있게 분석해 드립니다
        </p>
      </motion.div>

      {/* 단계 안내 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="flex items-center gap-6 mb-16"
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
            {i < 2 && <span className="text-cm-dim/30">—</span>}
          </div>
        ))}
      </motion.div>

      {/* 시작 버튼 */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="btn-primary w-full max-w-[280px]"
      >
        시작하기
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 text-[11px] uppercase tracking-[0.15em] text-cm-dim font-medium"
      >
        약 1분 소요 &middot; 기본 분석 무료
      </motion.p>
    </motion.div>
  );
}
