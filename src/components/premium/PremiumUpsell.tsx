"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PaymentModal from "./PaymentModal";
import { EXTRA_MENU_ITEMS } from "@/lib/types";
import type { ExtraOption } from "@/lib/types";

interface Props {
  onPaymentReady: (selectedExtras: ExtraOption[]) => Promise<{ orderId: string; amount: number } | null>;
}

export default function PremiumUpsell({ onPaymentReady }: Props) {
  const [selected, setSelected] = useState<ExtraOption[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSelection = (id: ExtraOption) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleUnlock = async () => {
    if (selected.length !== 3) return;
    setLoading(true);
    try {
      const result = await onPaymentReady(selected);
      if (result) setShowPayment(true);
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
        <div className="text-center mb-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-cm-accent font-semibold mb-3">Premium</p>
          <h3 className="font-serif text-xl text-cm-text font-medium">
            더 깊은 나를 알고 싶다면
          </h3>
          <p className="text-[13px] text-cm-muted mt-2">
            아래에서 <span className="text-cm-accent font-semibold">3가지</span>를 골라보세요
          </p>
        </div>

        {/* 메뉴 카드 리스트 */}
        <div className="space-y-2 mb-8">
          {EXTRA_MENU_ITEMS.map((item) => {
            const isSelected = selected.includes(item.id);
            const isDisabled = !isSelected && selected.length >= 3;

            return (
              <button
                key={item.id}
                onClick={() => toggleSelection(item.id)}
                disabled={isDisabled}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${
                  isSelected
                    ? "border border-cm-accent/40 bg-cm-accent/5"
                    : isDisabled
                    ? "border border-cm-dim/10 opacity-40"
                    : "border border-cm-dim/15 hover:border-cm-dim/30"
                }`}
              >
                {/* 체크 */}
                <div className={`w-5 h-5 flex items-center justify-center border text-[11px] ${
                  isSelected
                    ? "border-cm-accent bg-cm-accent text-cm-bg font-bold"
                    : "border-cm-dim/30"
                }`}>
                  {isSelected && "✓"}
                </div>

                {/* 이모지 */}
                <span className="text-lg">{item.emoji}</span>

                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] font-medium text-cm-text">{item.label}</span>
                  <p className="text-[12px] text-cm-muted mt-0.5">{item.desc}</p>
                </div>

                {/* 입력 필요 배지 */}
                {item.needsInput && (
                  <span className="text-[9px] uppercase tracking-[0.1em] text-cm-dim border border-cm-dim/20 px-1.5 py-0.5">
                    +입력
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 선택 카운터 + 가격 */}
        <div className="text-center mb-6">
          <p className="text-[12px] text-cm-muted mb-2">
            {selected.length < 3
              ? `${selected.length}/3 선택 — ${3 - selected.length}개 더 골라주세요`
              : "3/3 선택 완료"}
          </p>
          <p className="text-[12px] text-cm-muted mb-1">
            아메리카노 한 잔 가격으로 확인하는 내 운세
          </p>
          <p className="font-serif text-2xl font-semibold text-cm-text">
            ₩1,990
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleUnlock}
          disabled={loading || selected.length !== 3}
          className={`w-full btn-primary transition-all ${
            selected.length !== 3 ? "opacity-40 cursor-not-allowed" : ""
          } disabled:opacity-40`}
        >
          {loading ? "준비 중..." : "프리미엄 잠금해제"}
        </button>

        <p className="text-[11px] uppercase tracking-[0.1em] text-cm-muted text-center mt-3">
          카카오페이 · 네이버페이 · 신용카드
        </p>
      </motion.div>

      {showPayment && (
        <PaymentModal onClose={() => setShowPayment(false)} />
      )}
    </>
  );
}
