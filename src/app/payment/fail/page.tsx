"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h2 className="font-serif text-xl text-cm-red font-normal mb-3">결제 실패</h2>
      <p className="text-[12px] text-cm-muted text-center mb-2">
        {message || "결제 처리 중 문제가 발생했습니다."}
      </p>
      {code && (
        <p className="text-[10px] text-cm-dim mb-8">오류 코드: {code}</p>
      )}
      <a href="/" className="btn-primary px-8">
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
          <p className="text-[12px] text-cm-muted">로딩 중...</p>
        </div>
      }
    >
      <FailContent />
    </Suspense>
  );
}
