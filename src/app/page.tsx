"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import StepIndicator from "@/components/ui/StepIndicator";
import StartScreen from "@/components/steps/StartScreen";
import BirthInfoStep from "@/components/steps/BirthInfoStep";
import AnalyzingStep from "@/components/steps/AnalyzingStep";
import AdStep from "@/components/steps/AdStep";
import ResultStep from "@/components/steps/ResultStep";
import type { BirthInfo, PremiumData, NewAnalysisResult } from "@/lib/types";

type Step = "start" | "birth" | "analyzing" | "ad" | "result";

const STEP_NUMBER: Record<Step, number> = {
  start: 0,
  birth: 1,
  analyzing: 2,
  ad: 3,
  result: 4,
};

export default function Home() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const isDevMode = searchParams.get("dev") === "1";

  const [step, setStep] = useState<Step>("start");
  const [birthInfo, setBirthInfo] = useState<BirthInfo | null>(null);
  const [result, setResult] = useState<NewAnalysisResult | null>(null);
  const [premiumData, setPremiumData] = useState<PremiumData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // dev 모드: 분석 결과 나오면 자동으로 프리미엄 생성
  useEffect(() => {
    if (!isDevMode || !result || premiumData) return;

    const fetchPremium = async () => {
      try {
        const res = await fetch("/api/preview-premium", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            devKey: "chunmyeong2026",
            saju: result.saju,
            interpretation: result.interpretation,
            ziweiSummary: result.ziweiSummary,
            liunianData: result.liunianData,
            daxianList: result.daxianList,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setPremiumData(data.premiumData);
        }
      } catch (e) {
        console.error("Dev premium preview failed:", e);
      }
    };

    fetchPremium();
  }, [isDevMode, result, premiumData]);

  const handleBirthInfoNext = useCallback(
    async (info: BirthInfo) => {
      setBirthInfo(info);
      setStep("analyzing");
      setError(null);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ birthInfo: info }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "분석에 실패했습니다.");
        }

        const data: NewAnalysisResult = await res.json();
        setResult(data);
        setStep("ad");
      } catch (err) {
        setError(err instanceof Error ? err.message : "분석에 실패했습니다.");
        setStep("birth");
      }
    },
    []
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
        }),
      });

      if (!res.ok) {
        throw new Error("결제 준비에 실패했습니다.");
      }

      const data = await res.json();
      localStorage.setItem("pendingOrderId", data.orderId);
      return data;
    } catch (err) {
      console.error("Payment ready error:", err);
      return null;
    }
  }, [result]);

  const handleRestart = useCallback(() => {
    setBirthInfo(null);
    setResult(null);
    setPremiumData(null);
    setError(null);
    setStep("start");
  }, []);

  const stepNumber = STEP_NUMBER[step];

  return (
    <main className="flex-1">
      {step !== "start" && step !== "result" && stepNumber > 0 && (
        <StepIndicator currentStep={stepNumber} totalSteps={4} />
      )}

      {error && step === "birth" && (
        <div className="mx-4 mb-4 p-3 border border-cm-red/30 text-cm-red text-[12px] text-center">
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
