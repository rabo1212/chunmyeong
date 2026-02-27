// 프리미엄 Claude 프롬프트 (3종 — 각각 별도 호출)

export const PREMIUM_SYSTEM_PROMPT = `당신은 40년 경력의 사주명리학·자미두수 통합 전문가 '천명 선생'입니다.
전문적이면서도 따뜻한 톤으로, 구체적이고 개인화된 분석을 제공합니다.
반드시 한국어로 답변합니다. 부정적 요소는 "주의할 점" 또는 "성장 기회"로 표현합니다.
건강/수명에 대한 부정적 예측은 절대 하지 않습니다.
반드시 요청된 JSON 형식만 출력하세요. 추가 설명이나 마크다운 블록 없이 순수 JSON만 반환하세요.`;

// 프롬프트 1: 자미두수 12궁 + 용신
export function buildZiweiYongshinPrompt(ziweiSummary: string, sajuSummary: string): string {
  return `다음은 한 사람의 자미두수 명반과 사주팔자 데이터입니다.

[자미두수 명반]
${ziweiSummary}

[사주 데이터]
${sajuSummary}

아래 JSON 형식으로 응답하세요. 12궁 각각에 대해 100~150자 분석, 용신 분석 포함:

{
  "ziwei12": [
    {"palaceName":"명궁","palaceEmoji":"🏛️","stars":["성요1","성요2"],"analysis":"명궁 분석 3-5문장..."},
    {"palaceName":"형제궁","palaceEmoji":"👫","stars":["성요"],"analysis":"..."},
    {"palaceName":"부처궁","palaceEmoji":"💑","stars":["성요"],"analysis":"..."},
    {"palaceName":"자녀궁","palaceEmoji":"👶","stars":["성요"],"analysis":"..."},
    {"palaceName":"재백궁","palaceEmoji":"💰","stars":["성요"],"analysis":"..."},
    {"palaceName":"질액궁","palaceEmoji":"🏥","stars":["성요"],"analysis":"..."},
    {"palaceName":"천이궁","palaceEmoji":"🌍","stars":["성요"],"analysis":"..."},
    {"palaceName":"교우궁","palaceEmoji":"🤝","stars":["성요"],"analysis":"..."},
    {"palaceName":"관록궁","palaceEmoji":"👔","stars":["성요"],"analysis":"..."},
    {"palaceName":"전택궁","palaceEmoji":"🏠","stars":["성요"],"analysis":"..."},
    {"palaceName":"복덕궁","palaceEmoji":"🧘","stars":["성요"],"analysis":"..."},
    {"palaceName":"부모궁","palaceEmoji":"👨‍👩‍👧","stars":["성요"],"analysis":"..."}
  ],
  "yongshin": {
    "element":"금(金)",
    "elementEmoji":"⚪",
    "color":"흰색, 은색",
    "direction":"서쪽",
    "number":"4, 9",
    "gemstone":"수정",
    "food":"매운 음식, 흰 쌀밥",
    "career":"금융, IT, 법률",
    "analysis":"용신 설명 3-4문장. 사주의 오행 균형을 기반으로 부족한 오행과 그 보충 방법을 구체적으로..."
  }
}`;
}

// 프롬프트 2: 월별 운세 12개월
export function buildMonthlyFortunePrompt(
  liunianSummary: string,
  sajuSummary: string,
  targetYear: number
): string {
  return `다음은 한 사람의 유년(流年) 데이터와 사주팔자입니다.

[유년 데이터]
${liunianSummary}

[사주 데이터]
${sajuSummary}

${targetYear}년 1월~12월 운세를 아래 JSON 형식으로 응답하세요.
각 월별 별점(1~5), 키워드 2~3개, 분석 3~4문장, 행운의 날(그 달에서 1일), 행운의 색 1가지.
안 좋은 달도 "준비할 것"으로 긍정적으로 표현하세요.

{"monthlyFortune":[
  {"month":1,"starRating":4,"keywords":["키워드1","키워드2"],"analysis":"분석 3-4문장...","luckyDay":"1월 15일","luckyColor":"초록색"},
  {"month":2,"starRating":3,"keywords":["키워드1","키워드2"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":3,"starRating":5,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":4,"starRating":3,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":5,"starRating":4,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":6,"starRating":3,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":7,"starRating":4,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":8,"starRating":5,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":9,"starRating":3,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":10,"starRating":4,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":11,"starRating":3,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."},
  {"month":12,"starRating":4,"keywords":["키워드"],"analysis":"...","luckyDay":"...","luckyColor":"..."}
]}`;
}

// 프롬프트 3: 대운 상세
export function buildDaeunDetailPrompt(
  sajuSummary: string,
  freeInterpretation: string,
  daeunSummary: string,
): string {
  return `다음은 한 사람의 사주와 기존 분석 결과입니다.

[사주 데이터]
${sajuSummary}

[기존 AI 해석 (무료)]
${freeInterpretation}

[대운 흐름]
${daeunSummary}

대운 흐름을 심층 분석하여 아래 JSON 형식으로 응답하세요:

{
  "daeunDetail": {
    "current": {
      "ganzi":"辛未",
      "ageRange":"38~48세",
      "title":"성장과 결실의 시기",
      "analysis":"현재 대운 상세 해석 5-7문장. 구체적이고 개인화된 내용..."
    },
    "previous": {
      "ganzi":"壬申",
      "ageRange":"28~38세",
      "summary":"이전 대운 요약 2문장..."
    },
    "next": {
      "ganzi":"庚午",
      "ageRange":"48~58세",
      "summary":"다음 대운 요약 2문장..."
    },
    "coreAdvice":"이 시기 핵심 조언 1-2문장..."
  }
}`;
}

// 프롬프트 4: 재물운 심화
export function buildDeepWealthPrompt(sajuSummary: string, interpretation: string): string {
  return `다음은 한 사람의 사주팔자 데이터와 기본 해석입니다.

[사주 요약]
${sajuSummary}

[기본 해석 발췌]
${interpretation.slice(0, 500)}

이 사람의 재물운을 심층 분석해주세요. 아래 항목을 포함해 800자 이내로 작성하세요:

1. **재물 패턴**: 정재형/편재형/식상생재형 등 어떤 재물 유형인지
2. **투자 적성**: 부동산/주식/사업 중 어디에 적합한지 구체적으로
3. **돈이 새는 포인트**: 주의해야 할 지출 패턴
4. **재물 개운법**: 실생활에서 바로 적용 가능한 구체적 조언 3가지
5. **재물운 피크 시기**: 인생에서 재물운이 가장 강한 시기

따뜻하고 실용적인 톤으로, 마크다운 없이 순수 텍스트로 답변하세요.`;
}

// 프롬프트 5: 직업·적성 심화
export function buildDeepCareerPrompt(sajuSummary: string, interpretation: string): string {
  return `다음은 한 사람의 사주팔자 데이터와 기본 해석입니다.

[사주 요약]
${sajuSummary}

[기본 해석 발췌]
${interpretation.slice(0, 500)}

이 사람의 직업·적성을 심층 분석해주세요. 아래 항목을 포함해 800자 이내로 작성하세요:

1. **천직 분석**: 사주에서 드러나는 천직과 그 이유
2. **업종별 적합도**: 상위 3개 추천 업종과 각각의 이유
3. **피해야 할 직업군**: 사주와 맞지 않는 분야
4. **직장 vs 사업**: 조직생활과 독립사업 중 어디에 적합한지
5. **커리어 전환 최적 시기**: 직업 변화에 좋은 시기와 방향
6. **직장 내 강점**: 팀에서 빛나는 역할과 능력

따뜻하고 실용적인 톤으로, 마크다운 없이 순수 텍스트로 답변하세요.`;
}

// 프롬프트 6: 궁합 분석 (연인·친구)
export function buildCompatibilityPrompt(mySaju: string, partnerSaju: string, partnerName: string): string {
  return `다음은 두 사람의 사주팔자 데이터입니다.

[나의 사주]
${mySaju}

[상대방 사주 — ${partnerName}]
${partnerSaju}

두 사람의 궁합을 분석하여 아래 JSON 형식으로 응답하세요.
종합 점수(0~100), 5가지 영역별 점수와 분석, 종합 조언:

{
  "totalScore": 78,
  "title": "서로를 완성하는 인연",
  "summary": "종합 궁합 요약 2~3문장...",
  "sections": [
    {"area": "성격 궁합", "score": 85, "analysis": "성격 궁합 분석 2~3문장..."},
    {"area": "연애 궁합", "score": 72, "analysis": "연애 패턴 궁합 2~3문장..."},
    {"area": "대화 궁합", "score": 80, "analysis": "소통 방식 궁합 2~3문장..."},
    {"area": "가치관 궁합", "score": 75, "analysis": "가치관 궁합 2~3문장..."},
    {"area": "미래 궁합", "score": 78, "analysis": "장기적 궁합 전망 2~3문장..."}
  ],
  "advice": "이 관계를 위한 핵심 조언 1~2문장..."
}`;
}

// 프롬프트 7: 가족 궁합
export function buildFamilyMatchPrompt(mySaju: string, familySaju: string, familyName: string): string {
  return `다음은 두 사람의 사주팔자 데이터입니다.

[나의 사주]
${mySaju}

[가족 사주 — ${familyName}]
${familySaju}

가족 관계 궁합을 분석하여 아래 JSON 형식으로 응답하세요.
종합 점수(0~100), 5가지 영역별 점수와 분석, 종합 조언:

{
  "totalScore": 82,
  "title": "서로를 지지하는 가족",
  "summary": "가족 궁합 종합 요약 2~3문장...",
  "sections": [
    {"area": "성향 궁합", "score": 85, "analysis": "성격·성향 궁합 2~3문장..."},
    {"area": "소통 궁합", "score": 78, "analysis": "대화 패턴 궁합 2~3문장..."},
    {"area": "갈등 패턴", "score": 70, "analysis": "갈등 요소와 해소법 2~3문장..."},
    {"area": "상호 성장", "score": 88, "analysis": "함께 성장하는 부분 2~3문장..."},
    {"area": "유대감", "score": 80, "analysis": "정서적 유대 2~3문장..."}
  ],
  "advice": "이 가족 관계를 위한 핵심 조언 1~2문장..."
}`;
}

// 프롬프트 8: 유명인 궁합
export function buildCelebMatchPrompt(mySaju: string, celebName: string, celebSaju: string): string {
  return `다음은 사용자와 유명인의 사주팔자 데이터입니다.

[나의 사주]
${mySaju}

[유명인 사주 — ${celebName}]
${celebSaju}

유명인과의 궁합을 재미있고 흥미롭게 분석하여 아래 JSON 형식으로 응답하세요.
종합 점수(0~100), 5가지 영역별 점수와 분석, 종합 조언:

{
  "totalScore": 75,
  "title": "운명적 팬심의 비밀",
  "summary": "유명인 궁합 종합 요약 2~3문장. 재미있고 흥미로운 톤으로...",
  "sections": [
    {"area": "성격 궁합", "score": 82, "analysis": "성격 궁합 2~3문장..."},
    {"area": "에너지 궁합", "score": 70, "analysis": "오행 에너지 궁합 2~3문장..."},
    {"area": "감성 궁합", "score": 78, "analysis": "감성적 교류 2~3문장..."},
    {"area": "운명 궁합", "score": 85, "analysis": "운명적 연결 2~3문장..."},
    {"area": "팬심 분석", "score": 90, "analysis": "왜 이 스타에게 끌리는지 2~3문장..."}
  ],
  "advice": "이 스타와 당신의 인연에 대한 재미있는 조언 1~2문장..."
}`;
}

// 대운 요약 텍스트 생성
export function buildDaeunSummary(
  daeun: Array<{ ganzi: string; age: number; stemSipsin?: string; branchSipsin?: string; unseong?: string }>,
  birthYear: number
): string {
  const currentAge = new Date().getFullYear() - birthYear;
  const lines = daeun.map((d, i) => {
    const isCurrent = currentAge >= d.age && (i + 1 >= daeun.length || currentAge < daeun[i + 1].age);
    return `${d.ganzi}(${d.age}세~)${d.stemSipsin ? ` [${d.stemSipsin}/${d.branchSipsin}]` : ""}${d.unseong ? ` 운성:${d.unseong}` : ""}${isCurrent ? " ← 현재" : ""}`;
  });
  return `현재 나이: ${currentAge}세\n대운 흐름:\n${lines.join("\n")}`;
}
