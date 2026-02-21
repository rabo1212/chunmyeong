"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PHASES = [
  "만세력에서 사주를 조회하고 있습니다...",
  "천간과 지지의 조합을 분석합니다...",
  "오행의 균형을 살펴봅니다...",
  "십신의 관계를 풀어봅니다...",
  "관상에서 기운을 읽고 있습니다...",
  "대운의 흐름을 추적합니다...",
  "운명의 실타래를 종합합니다...",
];

export default function AnalyzingStep() {
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIdx((prev) => (prev + 1) % PHASES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70dvh] px-6 text-center"
    >
      {/* 팔괘 회전 애니메이션 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="text-7xl mb-8 text-cm-gold/80"
      >
        &#9776;
      </motion.div>

      {/* 분석 단계 문구 */}
      <motion.p
        key={phaseIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-cm-beige/80 text-base mb-6"
      >
        {PHASES[phaseIdx]}
      </motion.p>

      {/* 진행 바 */}
      <div className="w-48 h-1 bg-cm-deep rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-cm-gold/60 rounded-full"
          animate={{ width: ["0%", "100%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <p className="text-xs text-cm-beige/40 mt-8">
        AI가 사주와 관상을 종합 분석하고 있어요
      </p>
    </motion.div>
  );
}
