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
      className="flex flex-col items-center justify-center min-h-[80dvh] px-6 text-center"
    >
      {/* 로고 / 타이틀 영역 */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-8"
      >
        <div className="text-6xl mb-4 animate-float">&#9788;</div>
        <h1 className="font-serif text-4xl font-bold text-cm-gold glow-gold mb-2">
          天命
        </h1>
        <p className="font-serif text-lg text-cm-beige">천명</p>
      </motion.div>

      {/* 설명 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mb-12 space-y-3"
      >
        <p className="text-cm-ivory/90 text-base leading-relaxed">
          AI가 당신의 <span className="text-cm-gold font-bold">사주팔자</span>와{" "}
          <span className="text-cm-gold font-bold">관상</span>을
          <br />
          통합 분석해 드립니다
        </p>
        <div className="flex flex-col gap-2 text-sm text-cm-beige/70 mt-6">
          <div className="flex items-center justify-center gap-2">
            <span className="text-cm-gold">1</span>
            <span>생년월일시 입력</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-cm-gold">2</span>
            <span>셀카 한 장 촬영</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-cm-gold">3</span>
            <span>AI 통합 분석 결과 확인</span>
          </div>
        </div>
      </motion.div>

      {/* 시작 버튼 */}
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="btn-primary text-lg px-10 py-4 rounded-xl animate-pulse-gold"
      >
        내 천명 알아보기
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6 text-xs text-cm-beige/40"
      >
        소요시간 약 1분 · 무료
      </motion.p>
    </motion.div>
  );
}
