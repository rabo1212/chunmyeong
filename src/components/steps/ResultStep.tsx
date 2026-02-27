"use client";

import { motion } from "framer-motion";
import SajuChart from "@/components/ui/SajuChart";
import OhengChart from "@/components/ui/OhengChart";
import SinsalSection from "@/components/ui/SinsalSection";
import SectionCard from "@/components/sections/SectionCard";
import ResultCard from "@/components/ResultCard";
import ShareButtons from "@/components/ShareButtons";
import CoupangBanner from "@/components/CoupangBanner";
import PremiumUpsell from "@/components/premium/PremiumUpsell";
import MonthlyTimeline from "@/components/premium/MonthlyTimeline";
import DaeunDetailSection from "@/components/premium/DaeunDetailSection";
import YongshinSection from "@/components/premium/YongshinSection";
import PdfDownloadButton from "@/components/premium/PdfDownloadButton";
import { parseMarkdown } from "@/lib/parse-markdown";
import type { NewAnalysisResult, PremiumData, SajuSection, ExtraOption } from "@/lib/types";

// 무료로 공개할 섹션 수
const FREE_SECTION_COUNT = 5;

interface ResultStepProps {
  result: NewAnalysisResult;
  name?: string;
  onRestart: () => void;
  premiumData?: PremiumData | null;
  onPaymentReady?: (selectedExtras: ExtraOption[]) => Promise<{ orderId: string; amount: number } | null>;
}

export default function ResultStep({
  result,
  name,
  onRestart,
  premiumData,
  onPaymentReady,
}: ResultStepProps) {
  const { saju, sections, interpretation } = result;
  const isPremium = !!premiumData;
  const hasSections = sections && sections.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      id={isPremium ? "premium-result-container" : undefined}
      className="px-4 py-8 space-y-8 no-scrollbar"
    >
      {/* 타이틀 */}
      <div className="text-center py-4">
        {isPremium && (
          <span className="inline-block px-4 py-1.5 border border-cm-accent/20 text-[10px] uppercase tracking-[0.3em] text-cm-accent mb-3">
            Premium
          </span>
        )}
        <h2 className="font-serif text-3xl font-normal text-cm-text">
          {name ? `${name}님의 천명` : "당신의 천명"}
        </h2>
        <p className="text-[12px] uppercase tracking-[0.15em] text-cm-muted font-medium mt-3">
          {isPremium
            ? "Saju &middot; Ziwei &middot; Deep Analysis"
            : "Saju &middot; AI Analysis"}
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
          className="py-6 border-b border-cm-dim/10"
        >
          <h3 className="text-[13px] font-medium tracking-[0.15em] text-cm-text text-center mb-4">
            대운 흐름
          </h3>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {saju.daeun.map((dw, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 border border-cm-dim/10 min-w-[56px]"
              >
                <span className="font-serif text-base font-medium text-cm-text">
                  {dw.ganzi}
                </span>
                <span className="text-[11px] text-cm-muted">{dw.age}세~</span>
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

      {/* === 12섹션 카드 === */}
      {hasSections ? (
        <div>
          <div className="text-center py-6 border-t border-cm-dim/10">
            <h3 className="font-serif text-xl font-medium text-cm-text">
              사주 해설
            </h3>
            <p className="text-[11px] uppercase tracking-[0.2em] text-cm-muted font-medium mt-2">
              12 Sections Deep Analysis
            </p>
          </div>

          {sections.map((section: SajuSection, index: number) => (
            <SectionCard
              key={section.sectionKey}
              section={section}
              locked={!isPremium && index >= FREE_SECTION_COUNT}
              delay={0.7 + index * 0.05}
            />
          ))}

          {/* 프리미엄 잠금 안내 (무료 사용자) */}
          {!isPremium && sections.length > FREE_SECTION_COUNT && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center py-6"
            >
              <p className="text-[11px] text-cm-dim">
                + {sections.length - FREE_SECTION_COUNT}개 섹션 더 보기
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        /* 레거시 폴백: 기존 마크다운 해석 */
        interpretation && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="py-6 border-t border-cm-dim/10"
          >
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-cm-muted text-center mb-6">
              AI 종합 해석
            </h3>
            <div
              className="text-[13px] leading-[1.9] text-cm-muted"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(interpretation) }}
            />
          </motion.div>
        )
      )}

      {/* === 프리미엄 섹션 === */}
      {isPremium && premiumData ? (
        <>
          <div className="pt-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-cm-accent/15" />
              <h3 className="text-[11px] uppercase tracking-[0.3em] text-cm-accent font-semibold">
                Premium Analysis
              </h3>
              <div className="flex-1 h-[1px] bg-cm-accent/15" />
            </div>
          </div>

          {/* 2026 운세 상세 */}
          {premiumData.monthlyFortune && premiumData.monthlyFortune.length > 0 && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
              <MonthlyTimeline fortunes={premiumData.monthlyFortune} />
            </motion.div>
          )}

          {/* 재물운 심화 */}
          {premiumData.deepWealth && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.0 }}>
              <div className="py-6 border-b border-cm-dim/10">
                <h3 className="text-[13px] font-medium tracking-[0.15em] text-cm-text text-center mb-5">
                  재물운 심화 분석
                </h3>
                <p className="text-[14px] leading-[1.9] text-cm-muted whitespace-pre-line">
                  {premiumData.deepWealth}
                </p>
              </div>
            </motion.div>
          )}

          {/* 직업·적성 심화 */}
          {premiumData.deepCareer && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }}>
              <div className="py-6 border-b border-cm-dim/10">
                <h3 className="text-[13px] font-medium tracking-[0.15em] text-cm-text text-center mb-5">
                  직업·적성 심화 분석
                </h3>
                <p className="text-[14px] leading-[1.9] text-cm-muted whitespace-pre-line">
                  {premiumData.deepCareer}
                </p>
              </div>
            </motion.div>
          )}

          {/* 대운 상세 */}
          {premiumData.daeunDetail && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.2 }}>
              <DaeunDetailSection detail={premiumData.daeunDetail} />
            </motion.div>
          )}

          {/* 용신 */}
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
        transition={{ delay: isPremium ? 1.5 : 1.3 }}
      >
        <h3 className="text-[11px] uppercase tracking-[0.2em] text-cm-muted font-medium text-center mb-4">Share</h3>
        <ShareButtons />
      </motion.div>

      {/* 쿠팡 파트너스 (프리미엄이면 숨김) */}
      {!isPremium && (
        <div className="flex justify-center">
          <CoupangBanner />
        </div>
      )}

      {/* 면책 */}
      <p className="text-[11px] tracking-[0.05em] text-cm-dim text-center leading-relaxed">
        본 서비스는 엔터테인먼트 목적이며, 사주학적 해석은 과학적 근거에 기반하지 않습니다.
      </p>

      {/* 다시 하기 */}
      <div className="text-center pt-4 pb-10">
        <button onClick={onRestart} className="btn-secondary">
          다시 분석하기
        </button>
      </div>
    </motion.div>
  );
}
