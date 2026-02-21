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

function getElementColor(el: string): string {
  switch (el) {
    case "wood": return "bg-oheng-wood/20 text-oheng-wood border-oheng-wood/30";
    case "fire": return "bg-oheng-fire/20 text-oheng-fire border-oheng-fire/30";
    case "earth": return "bg-oheng-earth/20 text-oheng-earth border-oheng-earth/30";
    case "metal": return "bg-oheng-metal/20 text-oheng-metal border-oheng-metal/30";
    case "water": return "bg-oheng-water/20 text-oheng-water border-oheng-water/30";
    default: return "bg-cm-deep text-cm-beige border-cm-gold/20";
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
        <span className="text-[10px] text-cm-beige/40">{label}</span>
        <div className="w-14 h-14 rounded-lg bg-cm-deep/50 border border-cm-gold/10 flex items-center justify-center text-cm-beige/20 text-xs">
          ?
        </div>
        <div className="w-14 h-14 rounded-lg bg-cm-deep/50 border border-cm-gold/10 flex items-center justify-center text-cm-beige/20 text-xs">
          ?
        </div>
        <span className="text-[10px] text-cm-beige/30">시간 미상</span>
      </div>
    );
  }

  const stemEl = STEM_ELEMENT[pillar.stem] ?? "";
  const branchEl = BRANCH_ELEMENT[pillar.branch] ?? "";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] text-cm-beige/50">{label}</span>
      <span className="text-[10px] text-cm-gold/60">{pillar.stemSipsin || ""}</span>
      <div
        className={`w-14 h-14 rounded-lg border flex flex-col items-center justify-center ${getElementColor(stemEl)} ${isDayMaster ? "ring-2 ring-cm-gold/50" : ""}`}
      >
        <span className="text-2xl font-serif font-bold">{pillar.stem}</span>
      </div>
      <div
        className={`w-14 h-14 rounded-lg border flex flex-col items-center justify-center ${getElementColor(branchEl)}`}
      >
        <span className="text-2xl font-serif font-bold">{pillar.branch}</span>
      </div>
      <span className="text-[10px] text-cm-beige/50">{pillar.branchSipsin || ""}</span>
      <span className="text-[9px] text-cm-beige/30">{pillar.unseong || ""}</span>
    </div>
  );
}

export default function SajuChart({ saju }: SajuChartProps) {
  return (
    <div className="card p-4">
      <h3 className="font-serif text-lg text-cm-gold text-center mb-4">
        四柱八字 사주팔자
      </h3>

      <div className="flex justify-center gap-4">
        <PillarColumn label="시주" pillar={saju.pillars.hour} />
        <PillarColumn label="일주" pillar={saju.pillars.day} isDayMaster />
        <PillarColumn label="월주" pillar={saju.pillars.month} />
        <PillarColumn label="년주" pillar={saju.pillars.year} />
      </div>

      <p className="text-center text-xs text-cm-beige/40 mt-3">
        일간(日干): <span className="text-cm-gold">{saju.dayMaster}</span> — 나를 대표하는 오행
      </p>
    </div>
  );
}
