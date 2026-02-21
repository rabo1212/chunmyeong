"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FaceAreaAnalysis } from "@/lib/types";

interface Props {
  areas: FaceAreaAnalysis[];
}

export default function FaceDetailAnalysis({ areas }: Props) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="card p-4">
      <h3 className="font-serif text-lg text-cm-gold text-center mb-4">
        觀相 관상 영역별 심층 분석
      </h3>

      {/* 영역 탭 */}
      <div className="flex gap-1 mb-4 overflow-x-auto no-scrollbar">
        {areas.map((area, i) => (
          <button
            key={area.area}
            onClick={() => setSelected(i)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
              selected === i
                ? "bg-cm-gold/20 text-cm-gold border border-cm-gold/40"
                : "bg-cm-navy/60 text-cm-beige/50 border border-cm-gold/10"
            }`}
          >
            <span>{area.areaEmoji}</span>
            <span>{area.areaLabel}</span>
          </button>
        ))}
      </div>

      {/* 선택된 영역 상세 */}
      <AnimatePresence mode="wait">
        {areas[selected] && (
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* 관상 분석 */}
            <div className="bg-cm-navy/40 rounded-lg p-3">
              <h4 className="text-xs text-cm-gold/70 mb-1.5 font-bold">관상 분석</h4>
              <p className="text-sm leading-relaxed text-cm-beige/80">
                {areas[selected].faceReading}
              </p>
            </div>

            {/* 사주 교차 분석 */}
            <div className="bg-cm-gold/5 border border-cm-gold/10 rounded-lg p-3">
              <h4 className="text-xs text-cm-gold mb-1.5 font-bold">사주 교차 분석 ✨</h4>
              <p className="text-sm leading-relaxed text-cm-beige/80">
                {areas[selected].sajuCross}
              </p>
            </div>

            {/* 실생활 조언 */}
            <div className="flex items-start gap-2 bg-cm-deep/60 rounded-lg p-3">
              <span className="text-lg">💡</span>
              <p className="text-sm leading-relaxed text-cm-ivory">
                {areas[selected].advice}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
