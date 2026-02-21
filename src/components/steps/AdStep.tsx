"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AdStepProps {
  onNext: () => void;
}

export default function AdStep({ onNext }: AdStepProps) {
  const [countdown, setCountdown] = useState(5);
  const hasAdsense = !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    // AdSense가 없으면 바로 스킵
    if (!hasAdsense) {
      onNext();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasAdsense, onNext]);

  if (!hasAdsense) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70dvh] px-6 text-center"
    >
      <div className="mb-8">
        <p className="text-cm-gold font-serif text-xl mb-2">분석이 완료되었습니다!</p>
        <p className="text-cm-beige/60 text-sm">
          잠시 후 결과를 확인할 수 있습니다
        </p>
      </div>

      {/* AdSense 광고 영역 */}
      <div className="w-full max-w-sm h-64 bg-cm-deep/50 border border-cm-gold/10 rounded-xl flex items-center justify-center mb-8">
        <p className="text-cm-beige/30 text-sm">광고 영역</p>
      </div>

      <button
        onClick={onNext}
        disabled={countdown > 0}
        className={`btn-primary px-10 transition-all ${
          countdown > 0 ? "opacity-50 cursor-not-allowed" : "animate-pulse-gold"
        }`}
      >
        {countdown > 0 ? `결과 확인 (${countdown}초)` : "결과 확인하기"}
      </button>
    </motion.div>
  );
}
