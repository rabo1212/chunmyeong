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
  title: "천명(天命) - AI 사주 x 관상 분석",
  description:
    "사주팔자와 AI 관상 분석을 결합한 통합 운세 서비스. 생년월일과 셀카 한 장으로 당신의 천명을 알아보세요.",
  openGraph: {
    title: "천명(天命) - AI 사주 x 관상 분석",
    description: "사주팔자와 AI 관상 분석을 결합한 통합 운세 서비스",
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
        className={`${notoSerifKr.variable} ${notoSansKr.variable} font-sans antialiased bg-cm-navy text-cm-ivory stars-bg`}
      >
        <div className="max-w-lg mx-auto min-h-dvh relative flex flex-col">
          {children}
          <footer className="mt-auto py-4 px-4 text-center text-xs text-cm-beige/50 border-t border-cm-gold/10">
            <p>
              본 서비스는 엔터테인먼트 목적이며, 관상학·사주학적 해석은
              과학적 근거에 기반하지 않습니다.
            </p>
            <p className="mt-1 flex items-center justify-center gap-1">
              <span>&#128274;</span> 모든 사진은 AI 분석 후 즉시 삭제됩니다
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
