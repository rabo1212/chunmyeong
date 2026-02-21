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
    <div className="card p-4">
      <h3 className="font-serif text-lg text-cm-gold text-center mb-4">
        紫微斗數 자미두수 12궁 분석
      </h3>

      <div className="space-y-2">
        {palaces.map((palace, i) => (
          <div
            key={palace.palaceName}
            className="border border-cm-gold/10 rounded-lg overflow-hidden"
          >
            {/* 궁 헤더 */}
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-cm-navy/60 hover:bg-cm-navy/80 transition-colors text-left"
            >
              <span className="text-xl">{palace.palaceEmoji}</span>
              <div className="flex-1 min-w-0">
                <span className="font-serif text-sm text-cm-ivory">
                  {palace.palaceName}
                </span>
                {palace.stars.length > 0 && (
                  <p className="text-[10px] text-cm-beige/40 truncate">
                    {palace.stars.join(" · ")}
                  </p>
                )}
              </div>
              <span className="text-cm-beige/30 text-xs">
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
                  <div className="px-3 py-3 bg-cm-deep/40 border-t border-cm-gold/10">
                    <p className="text-sm leading-relaxed text-cm-beige/80">
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
