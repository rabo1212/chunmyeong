import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 - 천명",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 px-4 py-10 max-w-lg mx-auto">
      <Link href="/" className="text-[11px] uppercase tracking-[0.15em] text-cm-accent hover:text-cm-accent-soft transition-colors">
        &larr; 돌아가기
      </Link>

      <h1 className="font-serif text-2xl font-normal text-cm-text mt-8 mb-8">
        개인정보처리방침
      </h1>

      <div className="space-y-8 text-[13px] text-cm-muted leading-[1.9]">
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-cm-text mb-3">
            01 — 수집하는 정보
          </h2>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              <strong>필수:</strong> 생년월일, 태어난 시간, 성별 (사주 분석 목적)
            </li>
            <li>
              <strong>미수집:</strong> 이메일, 전화번호, 주소, 사진 등 개인 식별 정보
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-cm-text mb-3">
            02 — 분석 결과 보관
          </h2>
          <p>
            분석 결과 텍스트는 사용자의 브라우저 세션에서만 존재하며,
            페이지를 닫거나 새로고침하면 소멸됩니다.
            서버에 분석 이력을 저장하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-cm-text mb-3">
            03 — 제3자 제공
          </h2>
          <ul className="list-disc ml-4 space-y-1">
            <li>
              AI 분석을 위해 Anthropic Claude API에 사주 데이터를
              일시적으로 전달합니다. Anthropic의{" "}
              <a
                href="https://www.anthropic.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cm-accent hover:text-cm-accent-soft transition-colors"
              >
                개인정보 정책
              </a>
              에 따라 처리됩니다.
            </li>
            <li>
              Google AdSense 광고 표시를 위해 쿠키가 사용될 수 있습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-cm-text mb-3">
            04 — 면책사항
          </h2>
          <p className="py-3 border-t border-cm-dim/10 text-cm-dim">
            본 서비스는 엔터테인먼트 목적으로 제공됩니다.
            사주학적 해석은 과학적 근거에 기반하지 않으며,
            의료, 법률, 재정적 조언을 대체하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-[10px] uppercase tracking-[0.2em] text-cm-text mb-3">
            05 — 문의
          </h2>
          <p>
            개인정보 관련 문의사항이 있으시면 서비스 내 문의 기능을
            이용해주세요.
          </p>
        </section>
      </div>

      <p className="text-[10px] uppercase tracking-[0.1em] text-cm-dim mt-10 text-center">
        최종 업데이트: 2026년 2월
      </p>
    </main>
  );
}
