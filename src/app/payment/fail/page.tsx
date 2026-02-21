"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-5xl mb-4">😢</div>
      <h2 className="font-serif text-xl text-cm-red mb-2">결제 실패</h2>
      <p className="text-sm text-cm-beige/60 text-center mb-2">
        {message || "결제 처리 중 문제가 발생했습니다."}
      </p>
      {code && (
        <p className="text-xs text-cm-beige/30 mb-6">오류 코드: {code}</p>
      )}
      <a href="/" className="btn-primary px-6 py-3">
        다시 시도하기
      </a>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-cm-beige/50">로딩 중...</p>
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
