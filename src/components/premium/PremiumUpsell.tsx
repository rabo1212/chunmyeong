"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PaymentModal from "./PaymentModal";

interface Props {
  onPaymentReady: () => Promise<{ orderId: string; amount: number } | null>;
}

const PREVIEW_ITEMS = [
  {
    emoji: "🔮",
    title: "자미두수 12궁 분석",
    preview: "당신의 명궁에 紫微星이 자리하여...",
  },
  {
    emoji: "📅",
    title: `${new Date().getFullYear()}년 월별 운세`,
    preview: "3월 ★★★★☆ 재물운이 크게...",
  },
  {
    emoji: "👁️",
    title: "관상 영역별 심층 분석",
    preview: "이마: 재물운이 뒷받침되는 형상으로...",
  },
  {
    emoji: "🌟",
    title: "용신 + 행운 정보",
    preview: "행운의 색: ███ 행운의 방향: ██",
  },
];

export default function PremiumUpsell({ onPaymentReady }: Props) {
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    setLoading(true);
    try {
      const result = await onPaymentReady();
      if (result) {
        setShowPayment(true);
      }
    } catch {
      alert("결제 준비 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="card p-5 border-cm-gold/30"
      >
        {/* 헤더 */}
        <div className="text-center mb-5">
          <span className="text-2xl">💎</span>
          <h3 className="font-serif text-lg text-cm-gold mt-1">
            더 깊은 나를 알고 싶다면
          </h3>
        </div>

        {/* 블러 미리보기 카드들 */}
        <div className="space-y-3 mb-5">
          {PREVIEW_ITEMS.map((item) => (
            <div
              key={item.title}
              className="bg-cm-navy/40 border border-cm-gold/10 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">🔒</span>
                <span className="font-serif text-sm text-cm-ivory">{item.title}</span>
              </div>
              <p className="text-xs text-cm-beige/60">{item.preview}</p>
              {/* 블러 라인 */}
              <div className="mt-1.5 space-y-1">
                <div className="h-2.5 bg-cm-beige/8 rounded blur-[3px]" />
                <div className="h-2.5 bg-cm-beige/6 rounded blur-[3px] w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* 가격 비교 */}
        <div className="text-center mb-4">
          <p className="text-xs text-cm-beige/50 mb-1">
            ⚡ 사주 카페 평균 3~5만원
          </p>
          <p className="text-sm text-cm-ivory">
            천명 프리미엄{" "}
            <span className="font-bold text-cm-gold text-lg">₩1,900</span>
          </p>
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={handleUnlock}
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-cm-gold to-yellow-600 text-cm-navy font-bold rounded-lg text-base shadow-lg shadow-cm-gold/20 hover:shadow-cm-gold/40 transition-shadow active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "준비 중..." : "💎 프리미엄 잠금해제 ₩1,900"}
        </button>

        {/* 결제 수단 안내 */}
        <p className="text-[10px] text-cm-beige/30 text-center mt-2">
          카카오페이 · 네이버페이 · 신용카드 결제 가능
        </p>
      </motion.div>

      {/* 결제 모달 */}
      {showPayment && (
        <PaymentModal onClose={() => setShowPayment(false)} />
      )}
    </>
  );
}
