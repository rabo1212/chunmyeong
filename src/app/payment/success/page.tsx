"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");
  const [resultId, setResultId] = useState("");
  // [FIX] CRITICAL 6: useRef로 이중 호출 방지
  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    if (!paymentKey || !orderId || !amount) {
      setStatus("error");
      setError("결제 정보가 올바르지 않습니다.");
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "결제 확인에 실패했습니다.");
        }

        const data = await res.json();
        setResultId(data.resultId);
        setStatus("success");

        // [FIX] WARNING: resultId만 저장 (전체 premiumData 저장 안 함)
        if (data.resultId) {
          localStorage.setItem("lastPremiumResultId", data.resultId);
        }
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "결제 확인 실패");
      }
    };

    confirmPayment();
  }, [searchParams]);

  // [FIX] CRITICAL 5: 리다이렉트를 useEffect로 이동
  useEffect(() => {
    if (status === "success" && resultId) {
      window.location.href = `/result/${resultId}`;
    }
  }, [status, resultId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="text-7xl text-cm-gold/80 mb-6"
        >
          ☰
        </motion.div>
        <h2 className="font-serif text-xl text-cm-gold mb-2">프리미엄 분석 생성 중...</h2>
        <p className="text-sm text-cm-beige/60 text-center">
          자미두수 명반, 월별 운세, 심층 분석을<br />AI가 생성하고 있습니다
        </p>
        <div className="w-48 h-1 bg-cm-deep rounded-full mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-cm-gold/60 rounded-full"
            animate={{ width: ["0%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-5xl mb-4">😢</div>
        <h2 className="font-serif text-xl text-cm-red mb-2">오류 발생</h2>
        <p className="text-sm text-cm-beige/60 text-center mb-6">{error}</p>
        <a href="/" className="btn-primary px-6 py-3">
          처음으로 돌아가기
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-5xl mb-4">✨</div>
      <h2 className="font-serif text-xl text-cm-gold mb-2">결제 완료!</h2>
      <p className="text-sm text-cm-beige/60">프리미엄 결과 페이지로 이동합니다...</p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-cm-beige/50">로딩 중...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
