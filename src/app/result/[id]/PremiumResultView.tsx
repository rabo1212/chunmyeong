"use client";

import { motion } from "framer-motion";
import SajuChart from "@/components/ui/SajuChart";
import OhengChart from "@/components/ui/OhengChart";
import SinsalSection from "@/components/ui/SinsalSection";
import ZiweiPalaceCards from "@/components/premium/ZiweiPalaceCards";
import MonthlyTimeline from "@/components/premium/MonthlyTimeline";
import FaceDetailAnalysis from "@/components/premium/FaceDetailAnalysis";
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
      <div id="premium-result-container" className="px-4 py-6 space-y-6 no-scrollbar">
        {/* 프리미엄 배지 */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-cm-gold/20 border border-cm-gold/40 rounded-full text-xs text-cm-gold mb-2">
            PREMIUM
          </span>
          <h2 className="font-serif text-2xl text-cm-gold glow-gold">
            프리미엄 천명 분석
          </h2>
          <p className="text-sm text-cm-beige/50 mt-1">
            사주팔자 × 자미두수 × AI 관상 통합 분석
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
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="card p-5">
          <h3 className="font-serif text-lg text-cm-gold text-center mb-4">AI 종합 해석</h3>
          <div
            className="text-sm leading-relaxed text-cm-beige/80 space-y-1"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(interpretation) }}
          />
        </motion.div>

        {/* === 프리미엄 섹션 === */}
        <div className="border-t border-cm-gold/20 pt-6">
          <h3 className="font-serif text-center text-cm-gold text-lg mb-6 glow-gold">
            프리미엄 심층 분석
          </h3>
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

        {/* 관상 심층 분석 */}
        {premium.faceAreas && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
            <FaceDetailAnalysis areas={premium.faceAreas} />
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
          <h3 className="text-sm text-cm-beige/60 text-center mb-3">결과 공유하기</h3>
          <ShareButtons />
        </div>

        {/* 면책 */}
        <p className="text-[10px] text-cm-beige/30 text-center leading-relaxed">
          본 서비스는 엔터테인먼트 목적이며, 관상학·사주학적 해석은 과학적 근거에 기반하지 않습니다.
        </p>

        {/* 다시 분석 */}
        <div className="text-center pt-4 pb-8">
          <a href="/" className="btn-secondary inline-block">
            새로 분석하기
          </a>
        </div>
      </div>
    </main>
  );
}
