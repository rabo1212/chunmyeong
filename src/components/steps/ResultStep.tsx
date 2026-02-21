"use client";

import { motion } from "framer-motion";
import SajuChart from "@/components/ui/SajuChart";
import OhengChart from "@/components/ui/OhengChart";
import SinsalSection from "@/components/ui/SinsalSection";
import ResultCard from "@/components/ResultCard";
import ShareButtons from "@/components/ShareButtons";
import CoupangBanner from "@/components/CoupangBanner";
import PremiumUpsell from "@/components/premium/PremiumUpsell";
import ZiweiPalaceCards from "@/components/premium/ZiweiPalaceCards";
import MonthlyTimeline from "@/components/premium/MonthlyTimeline";
import FaceDetailAnalysis from "@/components/premium/FaceDetailAnalysis";
import DaeunDetailSection from "@/components/premium/DaeunDetailSection";
import YongshinSection from "@/components/premium/YongshinSection";
import PdfDownloadButton from "@/components/premium/PdfDownloadButton";
import { parseMarkdown } from "@/lib/parse-markdown";
import type { AnalysisResult, PremiumData } from "@/lib/types";

interface ResultStepProps {
  result: AnalysisResult;
  name?: string;
  onRestart: () => void;
  premiumData?: PremiumData | null;
  onPaymentReady?: () => Promise<{ orderId: string; amount: number } | null>;
}

export default function ResultStep({
  result,
  name,
  onRestart,
  premiumData,
  onPaymentReady,
}: ResultStepProps) {
  const { saju, interpretation } = result;
  const isPremium = !!premiumData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id={isPremium ? "premium-result-container" : undefined}
      className="px-4 py-6 space-y-6 no-scrollbar"
    >
      {/* 타이틀 */}
      <div className="text-center">
        {isPremium && (
          <span className="inline-block px-3 py-1 bg-cm-gold/20 border border-cm-gold/40 rounded-full text-xs text-cm-gold mb-2">
            PREMIUM
          </span>
        )}
        <h2 className="font-serif text-2xl text-cm-gold glow-gold">
          {name ? `${name}님의 천명` : "당신의 천명"}
        </h2>
        <p className="text-sm text-cm-beige/50 mt-1">
          {isPremium
            ? "사주팔자 × 자미두수 × AI 관상 통합 분석"
            : "사주팔자 × AI 관상 통합 분석"}
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

      {/* 신살 분석 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <SinsalSection pillars={saju.pillars} specialSinsal={saju.specialSinsal} />
      </motion.div>

      {/* AI 해석 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
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

      {/* === 프리미엄 섹션 === */}
      {isPremium && premiumData ? (
        <>
          <div className="border-t border-cm-gold/20 pt-6">
            <h3 className="font-serif text-center text-cm-gold text-lg mb-6 glow-gold">
              프리미엄 심층 분석
            </h3>
          </div>

          {premiumData.ziwei12 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
              <ZiweiPalaceCards palaces={premiumData.ziwei12} />
            </motion.div>
          )}

          {premiumData.monthlyFortune && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.0 }}>
              <MonthlyTimeline fortunes={premiumData.monthlyFortune} />
            </motion.div>
          )}

          {premiumData.faceAreas && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }}>
              <FaceDetailAnalysis areas={premiumData.faceAreas} />
            </motion.div>
          )}

          {premiumData.daeunDetail && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }}>
              <DaeunDetailSection detail={premiumData.daeunDetail} />
            </motion.div>
          )}

          {premiumData.yongshin && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.3 }}>
              <YongshinSection yongshin={premiumData.yongshin} />
            </motion.div>
          )}

          {/* PDF 다운로드 */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.4 }}>
            <PdfDownloadButton />
          </motion.div>
        </>
      ) : (
        /* 프리미엄 업셀 (무료 사용자) */
        onPaymentReady && (
          <PremiumUpsell onPaymentReady={onPaymentReady} />
        )
      )}

      {/* 공유용 카드 (숨김) */}
      <div className="overflow-hidden" style={{ height: 0 }}>
        <ResultCard saju={saju} name={name} />
      </div>

      {/* 공유 버튼 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: isPremium ? 1.5 : 1.0 }}
      >
        <h3 className="text-sm text-cm-beige/60 text-center mb-3">결과 공유하기</h3>
        <ShareButtons />
      </motion.div>

      {/* 쿠팡 파트너스 (프리미엄이면 숨김) */}
      {!isPremium && (
        <div className="flex justify-center">
          <CoupangBanner />
        </div>
      )}

      {/* 면책 */}
      <p className="text-[10px] text-cm-beige/30 text-center leading-relaxed">
        본 서비스는 엔터테인먼트 목적이며, 관상학·사주학적 해석은 과학적 근거에 기반하지 않습니다.
      </p>

      {/* 다시 하기 */}
      <div className="text-center pt-4 pb-8">
        <button onClick={onRestart} className="btn-secondary">
          다시 분석하기
        </button>
      </div>
    </motion.div>
  );
}
