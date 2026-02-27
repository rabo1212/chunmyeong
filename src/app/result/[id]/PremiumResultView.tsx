"use client";

import { motion } from "framer-motion";
import SajuChart from "@/components/ui/SajuChart";
import OhengChart from "@/components/ui/OhengChart";
import SinsalSection from "@/components/ui/SinsalSection";
import ZiweiPalaceCards from "@/components/premium/ZiweiPalaceCards";
import MonthlyTimeline from "@/components/premium/MonthlyTimeline";
import DaeunDetailSection from "@/components/premium/DaeunDetailSection";
import YongshinSection from "@/components/premium/YongshinSection";
import PdfDownloadButton from "@/components/premium/PdfDownloadButton";
import ShareButtons from "@/components/ShareButtons";
import { parseMarkdown } from "@/lib/parse-markdown";
import type { PremiumResult } from "@/lib/types";

export default function PremiumResultView({ result }: { result: PremiumResult }) {
  const { saju, interpretation, premium } = result;

  return (
    <main className="flex-1 max-w-lg mx-auto">
      <div id="premium-result-container" className="px-4 py-8 space-y-8 no-scrollbar">
        {/* 프리미엄 배지 */}
        <div className="text-center py-4">
          <span className="inline-block px-4 py-1.5 border border-cm-accent/20 text-[10px] uppercase tracking-[0.3em] text-cm-accent mb-3">
            Premium
          </span>
          <h2 className="font-serif text-3xl font-normal text-cm-text">
            프리미엄 천명 분석
          </h2>
          <p className="text-[11px] uppercase tracking-[0.15em] text-cm-muted mt-3">
            Saju &middot; Ziwei &middot; Deep Analysis
          </p>
        </div>

        {/* 사주 차트 */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <SajuChart saju={saju} />
        </motion.div>

        {/* 오행 분포 */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <OhengChart oheng={saju.oheng} />
        </motion.div>

        {/* 신살 분석 */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <SinsalSection pillars={saju.pillars} specialSinsal={saju.specialSinsal} />
        </motion.div>

        {/* AI 종합 해석 */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          className="py-6 border-t border-cm-dim/10"
        >
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-cm-muted text-center mb-5">AI 종합 해석</h3>
          <div
            className="text-[13px] leading-[1.9] text-cm-muted"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(interpretation) }}
          />
        </motion.div>

        {/* === 프리미엄 섹션 === */}
        <div className="pt-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-[1px] bg-cm-accent/15" />
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-cm-accent">
              Premium Analysis
            </h3>
            <div className="flex-1 h-[1px] bg-cm-accent/15" />
          </div>
        </div>

        {/* 자미두수 12궁 */}
        {premium.ziwei12 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <ZiweiPalaceCards palaces={premium.ziwei12} />
          </motion.div>
        )}

        {/* 월별 운세 */}
        {premium.monthlyFortune && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <MonthlyTimeline fortunes={premium.monthlyFortune} />
          </motion.div>
        )}

        {/* 대운 상세 */}
        {premium.daeunDetail && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
            <DaeunDetailSection detail={premium.daeunDetail} />
          </motion.div>
        )}

        {/* 용신 + 행운 */}
        {premium.yongshin && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
            <YongshinSection yongshin={premium.yongshin} />
          </motion.div>
        )}

        {/* PDF 다운로드 */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.0 }}>
          <PdfDownloadButton />
        </motion.div>

        {/* 공유 */}
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-cm-dim text-center mb-4">Share</h3>
          <ShareButtons />
        </div>

        {/* 면책 */}
        <p className="text-[10px] uppercase tracking-[0.1em] text-cm-dim/60 text-center leading-relaxed">
          본 서비스는 엔터테인먼트 목적이며, 사주학적 해석은 과학적 근거에 기반하지 않습니다.
        </p>

        {/* 다시 분석 */}
        <div className="text-center pt-4 pb-10">
          <a href="/" className="btn-secondary inline-block">
            새로 분석하기
          </a>
        </div>
      </div>
    </main>
  );
}
