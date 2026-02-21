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

export interface FaceAreaAnalysis {
  area: string;             // forehead, eyes, nose, mouth, overall
  areaLabel: string;        // 이마, 눈, 코, 입/턱, 전체
  areaEmoji: string;
  faceReading: string;      // 관상 분석
  sajuCross: string;        // 사주 교차 분석
  advice: string;           // 생활 조언
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
  faceAreas: FaceAreaAnalysis[];
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
