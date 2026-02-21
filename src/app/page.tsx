"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import StepIndicator from "@/components/ui/StepIndicator";
import StartScreen from "@/components/steps/StartScreen";
import BirthInfoStep from "@/components/steps/BirthInfoStep";
import SelfieStep from "@/components/steps/SelfieStep";
import AnalyzingStep from "@/components/steps/AnalyzingStep";
import AdStep from "@/components/steps/AdStep";
import ResultStep from "@/components/steps/ResultStep";
import type { BirthInfo, AnalysisResult, PremiumData } from "@/lib/types";

type Step = "start" | "birth" | "selfie" | "analyzing" | "ad" | "result";

const STEP_NUMBER: Record<Step, number> = {
  start: 0,
  birth: 1,
  selfie: 2,
  analyzing: 3,
  ad: 4,
  result: 5,
};

export default function Home() {
  const [step, setStep] = useState<Step>("start");
  const [birthInfo, setBirthInfo] = useState<BirthInfo | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [premiumData, setPremiumData] = useState<PremiumData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFacePhoto, setHasFacePhoto] = useState(false);

  const handleBirthInfoNext = useCallback((info: BirthInfo) => {
    setBirthInfo(info);
    setStep("selfie");
  }, []);

  const handleSelfieNext = useCallback(
    async (selfieBase64: string | null) => {
      if (!birthInfo) return;
      setStep("analyzing");
      setError(null);
      setHasFacePhoto(!!selfieBase64);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthInfo, selfieBase64 }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "분석에 실패했습니다.");
        }

        const data: AnalysisResult = await res.json();
        setResult(data);
        setStep("ad");
      } catch (err) {
        setError(err instanceof Error ? err.message : "분석에 실패했습니다.");
        setStep("selfie");
      }
    },
    [birthInfo]
  );

  // 프리미엄 결제 준비
  const handlePaymentReady = useCallback(async (): Promise<{ orderId: string; amount: number } | null> => {
    if (!result) return null;

    try {
      const res = await fetch("/api/payment/ready", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saju: result.saju,
          interpretation: result.interpretation,
          ziweiSummary: result.ziweiSummary,
          liunianData: result.liunianData,
          daxianList: result.daxianList,
          hasFacePhoto,
        }),
      });

      if (!res.ok) {
        throw new Error("결제 준비에 실패했습니다.");
      }

      const data = await res.json();
      // orderId를 localStorage에 저장 (결제 위젯에서 사용)
      localStorage.setItem("pendingOrderId", data.orderId);
      return data;
    } catch (err) {
      console.error("Payment ready error:", err);
      return null;
    }
  }, [result, hasFacePhoto]);

  const handleRestart = useCallback(() => {
    setBirthInfo(null);
    setResult(null);
    setPremiumData(null);
    setError(null);
    setHasFacePhoto(false);
    setStep("start");
  }, []);

  const stepNumber = STEP_NUMBER[step];

  return (
    <main className="flex-1">
      {step !== "start" && step !== "result" && stepNumber > 0 && (
        <StepIndicator currentStep={stepNumber} />
      )}

      {error && step === "selfie" && (
        <div className="mx-4 mb-4 p-3 bg-cm-red/10 border border-cm-red/30 rounded-lg text-cm-red text-sm text-center">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "start" && (
          <StartScreen key="start" onStart={() => setStep("birth")} />
        )}

        {step === "birth" && (
          <BirthInfoStep
            key="birth"
            onNext={handleBirthInfoNext}
            onBack={() => setStep("start")}
          />
        )}

        {step === "selfie" && (
          <SelfieStep
            key="selfie"
            onNext={handleSelfieNext}
            onBack={() => setStep("birth")}
          />
        )}

        {step === "analyzing" && <AnalyzingStep key="analyzing" />}

        {step === "ad" && (
          <AdStep key="ad" onNext={() => setStep("result")} />
        )}

        {step === "result" && result && (
          <ResultStep
            key="result"
            result={result}
            name={birthInfo?.name}
            onRestart={handleRestart}
            premiumData={premiumData}
            onPaymentReady={handlePaymentReady}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
