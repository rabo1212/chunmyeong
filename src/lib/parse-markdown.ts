// [FIX] CRITICAL 4: XSS 방지 — HTML 태그 제거 후 마크다운 변환
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function parseMarkdown(text: string): string {
  // 먼저 HTML 이스케이프 (XSS 방지)
  const escaped = escapeHtml(text);

  return escaped
    .replace(/## (.*)/g, '<h2 class="font-serif text-lg text-cm-gold mt-6 mb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cm-gold">$1</strong>')
    .replace(/\n- (.*)/g, '\n<li class="ml-4 text-sm leading-relaxed text-cm-beige/80">$1</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
