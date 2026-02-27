"use client";

import type { SajuData, PillarData } from "@/lib/types";

interface SajuChartProps {
  saju: SajuData;
}

const STEM_ELEMENT: Record<string, string> = {
  "甲": "wood", "乙": "wood",
  "丙": "fire", "丁": "fire",
  "戊": "earth", "己": "earth",
  "庚": "metal", "辛": "metal",
  "壬": "water", "癸": "water",
};

const BRANCH_ELEMENT: Record<string, string> = {
  "子": "water", "丑": "earth", "寅": "wood", "卯": "wood",
  "辰": "earth", "巳": "fire", "午": "fire", "未": "earth",
  "申": "metal", "酉": "metal", "戌": "earth", "亥": "water",
};

function getElementTextColor(el: string): string {
  switch (el) {
    case "wood": return "text-oheng-wood";
    case "fire": return "text-oheng-fire";
    case "earth": return "text-oheng-earth";
    case "metal": return "text-oheng-metal";
    case "water": return "text-oheng-water";
    default: return "text-cm-muted";
  }
}

function PillarColumn({
  label,
  pillar,
  isDayMaster,
}: {
  label: string;
  pillar: PillarData | null;
  isDayMaster?: boolean;
}) {
  if (!pillar) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-[11px] font-medium tracking-[0.1em] text-cm-muted">{label}</span>
        <div className="w-14 h-14 border border-cm-dim/20 flex items-center justify-center text-cm-dim text-xs">
          ?
        </div>
        <div className="w-14 h-14 border border-cm-dim/20 flex items-center justify-center text-cm-dim text-xs">
          ?
        </div>
        <span className="text-[10px] text-cm-dim">시간 미상</span>
      </div>
    );
  }

  const stemEl = STEM_ELEMENT[pillar.stem] ?? "";
  const branchEl = BRANCH_ELEMENT[pillar.branch] ?? "";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[11px] font-medium tracking-[0.1em] text-cm-muted">{label}</span>
      <span className="text-[11px] text-cm-accent">{pillar.stemSipsin || ""}</span>
      <div
        className={`w-14 h-14 border border-cm-dim/30 flex flex-col items-center justify-center ${isDayMaster ? "border-cm-accent/60" : ""}`}
      >
        <span className={`text-2xl font-serif font-medium ${getElementTextColor(stemEl)}`}>{pillar.stem}</span>
      </div>
      <div
        className="w-14 h-14 border border-cm-dim/30 flex flex-col items-center justify-center"
      >
        <span className={`text-2xl font-serif ${getElementTextColor(branchEl)}`}>{pillar.branch}</span>
      </div>
      <span className="text-[11px] text-cm-muted">{pillar.branchSipsin || ""}</span>
      <span className="text-[10px] text-cm-dim">{pillar.unseong || ""}</span>
    </div>
  );
}

export default function SajuChart({ saju }: SajuChartProps) {
  return (
    <div className="py-6 border-b border-cm-dim/10">
      <h3 className="text-[13px] font-medium tracking-[0.15em] text-cm-text text-center mb-5">
        사주팔자
      </h3>

      <div className="flex justify-center gap-4">
        <PillarColumn label="시주" pillar={saju.pillars.hour} />
        <PillarColumn label="일주" pillar={saju.pillars.day} isDayMaster />
        <PillarColumn label="월주" pillar={saju.pillars.month} />
        <PillarColumn label="년주" pillar={saju.pillars.year} />
      </div>

      <p className="text-center text-[12px] text-cm-muted mt-4">
        일간: <span className="text-cm-accent">{saju.dayMaster}</span> — 나를 대표하는 오행
      </p>
    </div>
  );
}
