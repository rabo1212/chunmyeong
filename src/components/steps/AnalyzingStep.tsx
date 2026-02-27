"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PHASES = [
  "만세력에서 사주를 조회하고 있습니다...",
  "천간과 지지의 조합을 분석합니다...",
  "오행의 균형을 살펴봅니다...",
  "십신의 관계를 풀어봅니다...",
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
      {/* 로딩 — 미니멀 라인 */}
      <div className="relative w-16 h-16 mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{ border: "1px solid rgba(74, 71, 68, 0.2)" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-1"
          style={{ border: "1px solid transparent", borderTopColor: "#d4c5a0" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-lg text-cm-accent/50">&#9776;</span>
        </div>
      </div>

      {/* 분석 단계 문구 */}
      <motion.p
        key={phaseIdx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-cm-muted text-[14px] mb-10"
      >
        {PHASES[phaseIdx]}
      </motion.p>

      {/* 진행 바 */}
      <div className="w-48 h-[1px] bg-cm-dim/15 overflow-hidden">
        <motion.div
          className="h-full bg-cm-accent/50"
          animate={{ width: ["0%", "100%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <p className="text-[10px] uppercase tracking-[0.15em] text-cm-dim mt-10">
        AI가 사주를 종합 분석하고 있어요
      </p>
    </motion.div>
  );
}
