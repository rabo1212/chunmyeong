"use client";

import { useState, useCallback } from "react";

interface ShareButtonsProps {
  resultCardId?: string;
}

export default function ShareButtons({
  resultCardId = "result-card",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = window.location.href;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const saveImage = useCallback(async () => {
    const el = document.getElementById(resultCardId);
    if (!el) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(el, {
        backgroundColor: "#1a1a2e",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = "chunmyeong-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("이미지 저장에 실패했습니다.");
    }
  }, [resultCardId]);

  const shareNative = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "천명(天命) - 내 사주 × 관상 분석 결과",
          text: "AI가 분석한 내 사주와 관상 결과를 확인해보세요!",
          url: window.location.href,
        });
      } catch {
        // 사용자가 공유 취소함
      }
    } else {
      copyLink();
    }
  }, [copyLink]);

  const shareTwitter = useCallback(() => {
    const text = encodeURIComponent(
      "AI가 분석한 내 사주 × 관상 결과! 천명(天命)에서 확인하세요 ✨"
    );
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      <button onClick={copyLink} className="btn-secondary text-sm py-2.5">
        {copied ? "복사됨!" : "링크 복사"}
      </button>
      <button onClick={saveImage} className="btn-secondary text-sm py-2.5">
        이미지 저장
      </button>
      <button onClick={shareNative} className="btn-secondary text-sm py-2.5">
        공유하기
      </button>
      <button onClick={shareTwitter} className="btn-secondary text-sm py-2.5">
        X(트위터)
      </button>
    </div>
  );
}
