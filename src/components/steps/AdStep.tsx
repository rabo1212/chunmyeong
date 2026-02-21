"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AdStepProps {
  onNext: () => void;
}

function AdBanner() {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return;
    if (pushed.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle not loaded yet
    }
  }, []);

  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) {
    return (
      <div className="w-full h-64 bg-cm-deep/50 border border-cm-gold/10 rounded-xl flex flex-col items-center justify-center gap-2">
        <p className="text-cm-beige/30 text-sm">광고 준비 중</p>
        <p className="text-cm-beige/20 text-xs">서비스 유지를 위한 광고입니다</p>
      </div>
    );
  }

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block", width: "100%", height: "250px" }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT || ""}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

export default function AdStep({ onNext }: AdStepProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
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
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-[70dvh] px-6 text-center"
    >
      <div className="mb-6">
        <p className="text-cm-gold font-serif text-xl mb-2">분석이 완료되었습니다!</p>
        <p className="text-cm-beige/60 text-sm">
          잠시 후 결과를 확인할 수 있습니다
        </p>
      </div>

      {/* 광고 영역 */}
      <div className="w-full max-w-sm mb-6">
        <AdBanner />
      </div>

      <p className="text-xs text-cm-beige/30 mb-4">
        광고 수익은 AI 분석 비용에 사용됩니다
      </p>

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
