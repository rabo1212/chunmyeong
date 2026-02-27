"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");
  const [resultId, setResultId] = useState("");
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

  useEffect(() => {
    if (status === "success" && resultId) {
      window.location.href = `/result/${resultId}`;
    }
  }, [status, resultId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="relative w-16 h-16 mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
            style={{ border: "1px solid rgba(74, 71, 68, 0.2)" }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1"
            style={{ border: "1px solid transparent", borderTopColor: "#8b7748" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-lg text-cm-accent/50">&#9776;</span>
          </div>
        </div>
        <h2 className="font-serif text-xl text-cm-text font-normal mb-3">프리미엄 분석 생성 중</h2>
        <p className="text-[12px] text-cm-muted text-center leading-relaxed">
          자미두수 명반, 월별 운세, 심층 분석을<br />AI가 생성하고 있습니다
        </p>
        <div className="w-48 h-[1px] bg-cm-dim/15 mt-8 overflow-hidden">
          <motion.div
            className="h-full bg-cm-accent/50"
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
        <h2 className="font-serif text-xl text-cm-red font-normal mb-3">오류 발생</h2>
        <p className="text-[12px] text-cm-muted text-center mb-8">{error}</p>
        <a href="/" className="btn-primary px-8">
          처음으로 돌아가기
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="font-serif text-xl text-cm-accent font-normal mb-3">결제 완료</h2>
      <p className="text-[12px] text-cm-muted">프리미엄 결과 페이지로 이동합니다...</p>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[12px] text-cm-muted">로딩 중...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
