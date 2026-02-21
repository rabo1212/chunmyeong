"use client";

import { motion } from "framer-motion";
import SajuChart from "@/components/ui/SajuChart";
import OhengChart from "@/components/ui/OhengChart";
import ResultCard from "@/components/ResultCard";
import ShareButtons from "@/components/ShareButtons";
import type { AnalysisResult } from "@/lib/types";

interface ResultStepProps {
  result: AnalysisResult;
  name?: string;
  onRestart: () => void;
}

function parseMarkdown(text: string): string {
  return text
    .replace(/## (.*)/g, '<h2 class="font-serif text-lg text-cm-gold mt-6 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cm-gold">$1</strong>')
    .replace(/\n- (.*)/g, '\n<li class="ml-4 text-sm leading-relaxed text-cm-beige/80">$1</li>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}

export default function ResultStep({ result, name, onRestart }: ResultStepProps) {
  const { saju, interpretation } = result;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-6 space-y-6 no-scrollbar"
    >
      {/* 타이틀 */}
      <div className="text-center">
        <h2 className="font-serif text-2xl text-cm-gold glow-gold">
          {name ? `${name}님의 천명` : "당신의 천명"}
        </h2>
        <p className="text-sm text-cm-beige/50 mt-1">
          사주팔자 × AI 관상 통합 분석
        </p>
      </div>

      {/* 사주 차트 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <SajuChart saju={saju} />
      </motion.div>

      {/* 오행 분포 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <OhengChart oheng={saju.oheng} />
      </motion.div>

      {/* 대운 타임라인 */}
      {saju.daeun.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card p-4"
        >
          <h3 className="font-serif text-lg text-cm-gold text-center mb-3">
            大運 대운 흐름
          </h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {saju.daeun.map((dw, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-2 py-2 bg-cm-navy/60 border border-cm-gold/10 rounded-lg min-w-[56px]"
              >
                <span className="font-serif text-sm text-cm-ivory">
                  {dw.ganzi}
                </span>
                <span className="text-[10px] text-cm-beige/50">{dw.age}세~</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI 해석 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="card p-5"
      >
        <h3 className="font-serif text-lg text-cm-gold text-center mb-4">
          AI 종합 해석
        </h3>
        <div
          className="text-sm leading-relaxed text-cm-beige/80 space-y-1"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(interpretation) }}
        />
      </motion.div>

      {/* 공유용 카드 (숨김) */}
      <div className="overflow-hidden" style={{ height: 0 }}>
        <ResultCard saju={saju} name={name} />
      </div>

      {/* 공유 버튼 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-sm text-cm-beige/60 text-center mb-3">결과 공유하기</h3>
        <ShareButtons />
      </motion.div>

      {/* 다시 하기 */}
      <div className="text-center pt-4 pb-8">
        <button onClick={onRestart} className="btn-secondary">
          다시 분석하기
        </button>
      </div>
    </motion.div>
  );
}
