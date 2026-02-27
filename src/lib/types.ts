export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: "male" | "female";
  unknownTime: boolean;
  name?: string;
  calendarType: "solar" | "lunar";
  isLeapMonth?: boolean;  // 윤달 여부 (음력일 때만)
}

export interface PillarData {
  ganzi: string;       // 60갑자 (예: '甲子')
  stem: string;        // 천간 (예: '甲')
  branch: string;      // 지지 (예: '子')
  stemSipsin: string;  // 천간 십신
  branchSipsin: string;// 지지 십신
  unseong: string;     // 12운성
  sinsal: string;      // 12신살
  jigang: string;      // 지장간
}

export interface DaeunData {
  ganzi: string;
  age: number;
  stemSipsin: string;
  branchSipsin: string;
  unseong: string;
}

export interface OhengDistribution {
  wood: number;    // 목
  fire: number;    // 화
  earth: number;   // 토
  metal: number;   // 금
  water: number;   // 수
}

export interface SpecialSinsalData {
  name: string;
  hanja: string;
  emoji: string;
  desc: string;
  positions: string[];
}

export interface SajuData {
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData | null;  // 시간 모를 시 null
  };
  dayMaster: string;          // 일간 (예: '甲')
  dayMasterElement: string;   // 일간 오행 (예: 'tree')
  oheng: OhengDistribution;
  daeun: DaeunData[];
  specialSinsal: SpecialSinsalData[];  // 특수 신살
  summary: string;            // AI 전달용 사주 요약 텍스트
  birthInfo?: { year: number; month: number; day: number }; // 프리미엄 birthYear 계산용
}

export interface AnalysisResult {
  saju: SajuData;
  interpretation: string;     // AI 해석 텍스트 (마크다운)
  // 프리미엄용 데이터 (결제 시 활용)
  ziweiSummary?: string;
  liunianData?: LiunianData;
  daxianList?: DaxianItem[];
}

// === 프리미엄 타입 ===

export interface DaxianItem {
  ageStart: number;
  ageEnd: number;
  palaceName: string;
  ganZhi: string;
  mainStars: string[];
}

export interface LiuyueData {
  month: number;
  mingGongZhi: string;
  natalPalaceName: string;
}

export interface LiunianData {
  year: number;
  gan: string;
  zhi: string;
  mingGongZhi: string;
  natalPalaceAtMing: string;
  siHua: Record<string, string>;
  siHuaPalaces: Record<string, string>;
  palaces: Record<string, string>;
  liuyue: LiuyueData[];
  daxianPalaceName: string;
  daxianAgeStart: number;
  daxianAgeEnd: number;
}

export interface ZiweiPalaceAnalysis {
  palaceName: string;       // 궁 이름 (명궁, 형제궁, ...)
  palaceEmoji: string;      // 이모지
  stars: string[];           // 입궁 성요 목록
  analysis: string;         // AI 분석 (3-5문장)
}

export interface MonthlyFortune {
  month: number;
  starRating: number;       // 1-5
  keywords: string[];       // 2-3개 키워드
  analysis: string;         // 3-4문장
  luckyDay: string;
  luckyColor: string;
}

export interface DaeunDetail {
  current: {
    ganzi: string;
    ageRange: string;
    title: string;           // "성장과 결실의 시기" 등
    analysis: string;       // 5-7문장
  };
  previous: {
    ganzi: string;
    ageRange: string;
    summary: string;        // 2문장
  } | null;
  next: {
    ganzi: string;
    ageRange: string;
    summary: string;        // 2문장
  } | null;
  coreAdvice: string;
}

export interface YongshinInfo {
  element: string;          // 용신 오행
  elementEmoji: string;
  color: string;
  direction: string;
  number: string;
  gemstone: string;
  food: string;
  career: string;
  analysis: string;         // 용신 설명 3-4문장
}

export interface PremiumData {
  ziwei12: ZiweiPalaceAnalysis[];
  monthlyFortune: MonthlyFortune[];
  daeunDetail: DaeunDetail;
  yongshin: YongshinInfo;
}

export interface PremiumResult {
  resultId: string;
  saju: SajuData;
  interpretation: string;
  premium: PremiumData;
  createdAt: string;
}

// === 12섹션 사주 해설 ===

export interface SajuSection {
  sectionNumber: number;       // 1~12
  sectionKey: string;          // "overview", "oheng", "ilju", ...
  title: string;               // "멈추지 않는 불꽃 — 당신은 타오르는 개척자"
  content: string;             // 본문 (150~250자)
  advice: string;              // [천명의 조언] 1줄
}

// 12섹션 키 목록
export const SECTION_KEYS = [
  "overview",       // 1. 사주 총평 & 핵심 기질
  "oheng",          // 2. 오행 균형 & 개운법
  "ilju",           // 3. 일주 성격 심층
  "relationship",   // 4. 대인관계 & 소통
  "love",           // 5. 연애 & 이성운
  "wealth",         // 6. 재물운 & 경제 패턴
  "career",         // 7. 직업 & 적성
  "health",         // 8. 건강 & 활력
  "family",         // 9. 가족운 & 뿌리
  "potential",      // 10. 숨겨진 잠재력
  "yearly",         // 11. 2026 올해의 방향
  "letter",         // 12. 천명의 편지
] as const;

export type SectionKey = typeof SECTION_KEYS[number];

// === 패키지 선택 모델 ===

export type ExtraOption =
  | "compatibility"       // 궁합분석
  | "celeb_compatibility" // 유명인 궁합
  | "yearly_fortune"      // 2026 운세 상세
  | "monthly_fortune"     // 월별운세
  | "deep_wealth"         // 재물운 심화
  | "deep_career"         // 직업/적성 심화
  | "ziwei_12"            // 자미두수 12궁
  | "daeun_detail";       // 대운 상세

export interface PackageSelection {
  extras: [ExtraOption, ExtraOption]; // 정확히 2개 선택
}

// === 궁합 분석 ===

export interface CompatibilitySection {
  area: string;       // "성격 궁합", "연애 궁합" 등
  score: number;      // 0~100
  analysis: string;   // 분석 2~3문장
}

export interface CompatibilityResult {
  totalScore: number;            // 종합 점수 0~100
  title: string;                 // "운명의 상대 — 서로를 완성하는 인연"
  summary: string;               // 종합 요약 2~3문장
  sections: CompatibilitySection[];  // 5개 영역
  advice: string;                // [천명의 조언] 1줄
}

// === 유명인 DB ===

export type CelebrityCategory = "idol" | "actor" | "comedian" | "athlete" | "other";

export interface CelebrityInfo {
  id: string;                    // "bts-jungkook"
  name: string;                  // "정국"
  group?: string;                // "BTS"
  category: CelebrityCategory;
  birthInfo: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    gender: "male" | "female";
    calendarType: "solar" | "lunar";
    unknownTime: boolean;
  };
  emoji: string;                 // "🎤"
  tags: string[];                // ["BTS", "보컬", "1997"]
}

// === 새 분석 결과 (12섹션 기반) ===

export interface NewAnalysisResult extends AnalysisResult {
  sections: SajuSection[];       // 12개 섹션
}
