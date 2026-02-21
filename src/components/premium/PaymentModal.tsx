"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
}

export default function PaymentModal({ onClose }: Props) {
  const paymentRef = useRef<HTMLDivElement>(null);
  // [FIX] CRITICAL 7: 위젯 인스턴스를 useRef로 공유
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const widgetRef = useRef<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initPayment = async () => {
      try {
        const { loadTossPayments } = await import("@tosspayments/tosspayments-sdk");

        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          setError("결제 설정이 필요합니다.");
          setLoading(false);
          return;
        }

        const tossPayments = await loadTossPayments(clientKey);
        const widget = tossPayments.widgets({ customerKey: "ANONYMOUS" });
        widgetRef.current = widget;

        await widget.setAmount({ currency: "KRW", value: 1900 });

        if (paymentRef.current) {
          await widget.renderPaymentMethods({
            selector: "#payment-methods",
            variantKey: "DEFAULT",
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Payment init error:", err);
        setError("결제 모듈 로딩에 실패했습니다.");
        setLoading(false);
      }
    };

    initPayment();
  }, []);

  // [FIX] WARNING: ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handlePayment = async () => {
    try {
      const pendingOrderId = localStorage.getItem("pendingOrderId");
      if (!pendingOrderId) {
        setError("결제 정보가 없습니다. 다시 시도해주세요.");
        return;
      }

      // [FIX] CRITICAL 7: useRef의 위젯 인스턴스 재사용
      if (!widgetRef.current) {
        setError("결제 모듈이 준비되지 않았습니다.");
        return;
      }

      await widgetRef.current.requestPayment({
        orderId: pendingOrderId,
        orderName: "천명 프리미엄 분석",
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.code === "USER_CANCEL") {
        onClose();
        return;
      }
      setError("결제 요청에 실패했습니다.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-title"
    >
      <div className="w-full max-w-lg bg-cm-deep border-t border-cm-gold/20 rounded-t-2xl p-5 animate-slideUp">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 id="payment-title" className="font-serif text-lg text-cm-gold">프리미엄 결제</h3>
          <button
            onClick={onClose}
            className="text-cm-beige/40 hover:text-cm-beige text-xl"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 결제 위젯 영역 */}
        {loading && (
          <div className="h-40 flex items-center justify-center">
            <p className="text-sm text-cm-beige/50">결제 수단 로딩 중...</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-cm-red/10 border border-cm-red/30 rounded-lg mb-4">
            <p className="text-sm text-cm-red text-center">{error}</p>
          </div>
        )}

        <div id="payment-methods" ref={paymentRef} className="mb-4" />

        {/* 결제 버튼 */}
        {!loading && !error && (
          <button
            onClick={handlePayment}
            className="w-full py-3.5 bg-gradient-to-r from-cm-gold to-yellow-600 text-cm-navy font-bold rounded-lg text-base active:scale-[0.98]"
          >
            ₩1,900 결제하기
          </button>
        )}

        {/* 안내 */}
        <p className="text-[10px] text-cm-beige/30 text-center mt-3">
          결과 열람 전 전액 환불 가능 · 열람 후 환불 불가
        </p>
      </div>
    </div>
  );
}
