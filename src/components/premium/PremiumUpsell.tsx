"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PaymentModal from "./PaymentModal";

interface Props {
  onPaymentReady: () => Promise<{ orderId: string; amount: number } | null>;
}

const PREVIEW_ITEMS = [
  {
    title: "자미두수 12궁 분석",
    preview: "당신의 명궁에 자미성이 자리하여...",
  },
  {
    title: `${new Date().getFullYear()}년 월별 운세`,
    preview: "3월 ★★★★☆ 재물운이 크게...",
  },
  {
    title: "대운 상세 분석",
    preview: "현재 대운의 흐름과 전환점...",
  },
  {
    title: "용신 + 행운 정보",
    preview: "행운의 색 · 방향 · 숫자 · 보석",
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
        className="py-8 border-t border-b border-cm-dim/10"
      >
        {/* 헤더 */}
        <div className="text-center mb-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-cm-accent font-semibold mb-3">Premium</p>
          <h3 className="font-serif text-xl text-cm-text font-medium">
            더 깊은 나를 알고 싶다면
          </h3>
        </div>

        {/* 미리보기 */}
        <div className="space-y-0 mb-8">
          {PREVIEW_ITEMS.map((item, i) => (
            <div
              key={item.title}
              className="py-3 border-b border-cm-dim/8 flex items-center gap-3"
            >
              <span className="text-[12px] tracking-[0.15em] text-cm-muted font-serif font-medium">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-medium text-cm-text">{item.title}</span>
                <p className="text-[12px] text-cm-muted mt-0.5 blur-[2px]">{item.preview}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 가격 */}
        <div className="text-center mb-6">
          <p className="text-[12px] text-cm-muted mb-2">
            아메리카노 한 잔보다 저렴하게 확인하는 내 운세
          </p>
          <p className="font-serif text-2xl font-semibold text-cm-text">
            ₩1,900
          </p>
        </div>

        {/* CTA 버튼 */}
        <button
          onClick={handleUnlock}
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? "준비 중..." : "프리미엄 잠금해제"}
        </button>

        {/* 결제 수단 안내 */}
        <p className="text-[11px] uppercase tracking-[0.1em] text-cm-muted text-center mt-3">
          카카오페이 · 네이버페이 · 신용카드
        </p>
      </motion.div>

      {/* 결제 모달 */}
      {showPayment && (
        <PaymentModal onClose={() => setShowPayment(false)} />
      )}
    </>
  );
}
