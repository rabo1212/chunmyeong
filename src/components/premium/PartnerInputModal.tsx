"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExtraOption } from "@/lib/types";

interface PartnerInputModalProps {
  extras: ExtraOption[];  // needsInput인 항목들만
  onSubmit: (partnerInfos: Record<string, PartnerInfo>) => void;
  onClose: () => void;
}

export interface PartnerInfo {
  name: string;
  year: number;
  month: number;
  day: number;
  gender: "male" | "female";
}

const LABEL_MAP: Record<string, { title: string; placeholder: string }> = {
  compatibility: { title: "연인·친구 궁합", placeholder: "상대방 이름" },
  celeb_match: { title: "유명인 궁합", placeholder: "유명인 이름 (예: 정국)" },
  family_match: { title: "가족 궁합", placeholder: "가족 이름 (예: 엄마)" },
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function PartnerInputModal({
  extras,
  onSubmit,
  onClose,
}: PartnerInputModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [infos, setInfos] = useState<Record<string, PartnerInfo>>({});
  const [form, setForm] = useState<PartnerInfo>({
    name: "",
    year: 1995,
    month: 1,
    day: 1,
    gender: "female",
  });

  const currentExtra = extras[currentIdx];
  const label = LABEL_MAP[currentExtra] || { title: currentExtra, placeholder: "이름" };
  const isLast = currentIdx === extras.length - 1;

  const handleNext = () => {
    if (!form.name.trim()) return;

    const updated = { ...infos, [currentExtra]: { ...form } };
    setInfos(updated);

    if (isLast) {
      onSubmit(updated);
    } else {
      setCurrentIdx((prev) => prev + 1);
      setForm({ name: "", year: 1995, month: 1, day: 1, gender: "female" });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => currentYear - i);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[360px] bg-cm-bg border border-cm-dim/15 p-6"
        >
          {/* 진행 표시 */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cm-accent font-semibold">
              {label.title}
            </p>
            <p className="text-[11px] text-cm-dim">
              {currentIdx + 1}/{extras.length}
            </p>
          </div>

          <h3 className="font-serif text-lg font-medium text-cm-text mb-5">
            상대방 정보를 입력해주세요
          </h3>

          {/* 이름 */}
          <div className="mb-4">
            <label className="text-[12px] font-medium text-cm-muted block mb-1.5">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder={label.placeholder}
              className="w-full px-3 py-2.5 bg-transparent border border-cm-dim/20 text-[14px] text-cm-text placeholder:text-cm-dim/50 focus:border-cm-accent/40 outline-none"
            />
          </div>

          {/* 생년월일 */}
          <div className="mb-4">
            <label className="text-[12px] font-medium text-cm-muted block mb-1.5">생년월일</label>
            <div className="flex gap-2">
              <select
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
                className="flex-1 px-2 py-2.5 bg-transparent border border-cm-dim/20 text-[13px] text-cm-text outline-none focus:border-cm-accent/40"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}년</option>
                ))}
              </select>
              <select
                value={form.month}
                onChange={(e) => setForm((f) => ({ ...f, month: Number(e.target.value) }))}
                className="w-[70px] px-2 py-2.5 bg-transparent border border-cm-dim/20 text-[13px] text-cm-text outline-none focus:border-cm-accent/40"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
              <select
                value={form.day}
                onChange={(e) => setForm((f) => ({ ...f, day: Number(e.target.value) }))}
                className="w-[70px] px-2 py-2.5 bg-transparent border border-cm-dim/20 text-[13px] text-cm-text outline-none focus:border-cm-accent/40"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>{d}일</option>
                ))}
              </select>
            </div>
          </div>

          {/* 성별 */}
          <div className="mb-6">
            <label className="text-[12px] font-medium text-cm-muted block mb-1.5">성별</label>
            <div className="flex gap-2">
              {(["female", "male"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setForm((f) => ({ ...f, gender: g }))}
                  className={`flex-1 py-2.5 text-[13px] font-medium border transition-all ${
                    form.gender === g
                      ? "border-cm-accent/40 text-cm-accent bg-cm-accent/5"
                      : "border-cm-dim/20 text-cm-muted"
                  }`}
                >
                  {g === "female" ? "여성" : "남성"}
                </button>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-cm-dim/20 text-[13px] text-cm-muted font-medium"
            >
              나중에
            </button>
            <button
              onClick={handleNext}
              disabled={!form.name.trim()}
              className="flex-1 btn-primary disabled:opacity-40"
            >
              {isLast ? "분석 시작" : "다음"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
