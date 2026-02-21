"use client";

import { useState } from "react";

export default function PdfDownloadButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { default: jsPDF } = await import("jspdf");

      const el = document.getElementById("premium-result-container");
      if (!el) {
        alert("결과를 찾을 수 없습니다.");
        return;
      }

      const canvas = await html2canvas(el, {
        backgroundColor: "#1a1a2e",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      while (position < pdfHeight) {
        if (position > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -position, pdfWidth, pdfHeight);
        position += pageHeight;
      }

      pdf.save("chunmyeong-premium.pdf");
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("PDF 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="btn-secondary px-6 py-2.5 inline-flex items-center gap-2"
      >
        <span>📄</span>
        <span>{loading ? "PDF 생성 중..." : "결과 PDF 다운로드"}</span>
      </button>
    </div>
  );
}
