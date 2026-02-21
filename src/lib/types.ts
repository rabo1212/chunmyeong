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
  summary: string;            // AI 전달용 사주 요약 텍스트
}

export interface AnalysisResult {
  saju: SajuData;
  interpretation: string;     // AI 해석 텍스트 (마크다운)
}
