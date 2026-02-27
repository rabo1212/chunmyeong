"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ZiweiPalaceAnalysis } from "@/lib/types";

interface Props {
  palaces: ZiweiPalaceAnalysis[];
}

export default function ZiweiPalaceCards({ palaces }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="py-6 border-b border-cm-dim/10">
      <h3 className="text-[10px] uppercase tracking-[0.2em] text-cm-muted text-center mb-5">
        자미두수 12궁 분석
      </h3>

      <div className="space-y-0">
        {palaces.map((palace, i) => (
          <div
            key={palace.palaceName}
            className="border-b border-cm-dim/8"
          >
            {/* 궁 헤더 */}
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center gap-3 px-1 py-3.5 hover:bg-cm-surface/30 transition-colors text-left"
            >
              <span className="text-lg">{palace.palaceEmoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[13px] text-cm-text">
                  {palace.palaceName}
                </span>
                {palace.stars.length > 0 && (
                  <p className="text-[10px] text-cm-dim truncate">
                    {palace.stars.join(" · ")}
                  </p>
                )}
              </div>
              <span className="text-cm-dim text-[10px]">
                {expanded === i ? "▲" : "▼"}
              </span>
            </button>

            {/* 분석 내용 */}
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-1 pb-4 pt-1">
                    <p className="text-[13px] leading-[1.9] text-cm-muted">
                      {palace.analysis}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
