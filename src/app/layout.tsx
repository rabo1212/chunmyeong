import type { Metadata } from "next";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif-kr",
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "천명(天命) - AI 사주 분석",
  description:
    "AI가 당신의 사주팔자를 깊이 있게 분석합니다. 생년월일만으로 12가지 영역의 상세 운세를 확인하세요.",
  openGraph: {
    title: "천명(天命) - AI 사주 분석",
    description: "AI가 당신의 사주팔자를 깊이 있게 분석합니다",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 카카오 AdFit */}
        <Script
          src="//t1.daumcdn.net/kas/static/ba.min.js"
          strategy="afterInteractive"
        />
        {/* Google AdSense (선택) */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${notoSerifKr.variable} ${notoSansKr.variable} font-sans antialiased bg-cm-bg text-cm-text`}
      >
        <div className="max-w-lg mx-auto min-h-dvh relative flex flex-col">
          {children}
          <footer className="mt-auto py-6 px-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cm-dim">
              본 서비스는 엔터테인먼트 목적이며, 사주학적 해석은
              과학적 근거에 기반하지 않습니다.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
