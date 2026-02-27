"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BirthInfo } from "@/lib/types";

interface BirthInfoStepProps {
  onNext: (info: BirthInfo) => void;
  onBack: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

function getSichinName(hour: number): string {
  const names = [
    "자시", "자시", "축시", "축시",
    "인시", "인시", "묘시", "묘시",
    "진시", "진시", "사시", "사시",
    "오시", "오시", "미시", "미시",
    "신시", "신시", "유시", "유시",
    "술시", "술시", "해시", "해시",
  ];
  return names[hour] || "";
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export default function BirthInfoStep({ onNext, onBack }: BirthInfoStepProps) {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [name, setName] = useState("");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [isLeapMonth, setIsLeapMonth] = useState(false);

  const days = Array.from(
    { length: calendarType === "lunar" ? 30 : getDaysInMonth(year, month) },
    (_, i) => i + 1
  );

  const handleSubmit = () => {
    const info: BirthInfo = {
      year,
      month,
      day,
      hour: unknownTime ? 12 : hour,
      minute: unknownTime ? 0 : minute,
      gender,
      unknownTime,
      name: name.trim() || undefined,
      calendarType,
      isLeapMonth: calendarType === "lunar" ? isLeapMonth : undefined,
    };
    onNext(info);
  };

  const selectStyle = "w-full bg-transparent border border-cm-dim/20 px-3 py-2.5 text-cm-text focus:outline-none focus:border-cm-accent/50 transition-colors text-[13px]";
  const inputStyle = "w-full bg-transparent border border-cm-dim/20 px-3 py-2.5 text-cm-text placeholder:text-cm-dim focus:outline-none focus:border-cm-accent/50 transition-colors text-[13px]";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-4 py-8 space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl font-normal text-cm-text mb-2">사주 정보 입력</h2>
        <p className="text-[11px] uppercase tracking-[0.15em] text-cm-muted">
          {calendarType === "solar" ? "SOLAR" : "LUNAR"} CALENDAR
        </p>
      </div>

      {/* 이름 (선택) */}
      <div className="pb-6 border-b border-cm-dim/10">
        <label className="block text-[10px] uppercase tracking-[0.2em] text-cm-muted mb-3">이름 (선택)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="결과에 표시할 이름"
          className={inputStyle}
        />
      </div>

      {/* 양력/음력 선택 */}
      <div className="pb-6 border-b border-cm-dim/10">
        <label className="block text-[10px] uppercase tracking-[0.2em] text-cm-muted mb-3">달력 종류</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setCalendarType("solar"); setIsLeapMonth(false); }}
            className={`py-2.5 text-center text-[12px] uppercase tracking-[0.1em] font-medium transition-all ${
              calendarType === "solar"
                ? "bg-cm-text text-cm-bg"
                : "border border-cm-dim/20 text-cm-muted"
            }`}
          >
            양력
          </button>
          <button
            onClick={() => setCalendarType("lunar")}
            className={`py-2.5 text-center text-[12px] uppercase tracking-[0.1em] font-medium transition-all ${
              calendarType === "lunar"
                ? "bg-cm-text text-cm-bg"
                : "border border-cm-dim/20 text-cm-muted"
            }`}
          >
            음력
          </button>
        </div>
        {calendarType === "lunar" && (
          <label className="flex items-center gap-2 mt-3 text-[12px] text-cm-muted cursor-pointer">
            <input
              type="checkbox"
              checked={isLeapMonth}
              onChange={(e) => setIsLeapMonth(e.target.checked)}
              className="accent-cm-accent"
            />
            윤달
          </label>
        )}
      </div>

      {/* 생년월일 */}
      <div className="pb-6 border-b border-cm-dim/10">
        <label className="block text-[10px] uppercase tracking-[0.2em] text-cm-muted mb-3">생년월일</label>
        <div className="grid grid-cols-3 gap-2">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectStyle}>
            {YEARS.map((y) => (<option key={y} value={y}>{y}년</option>))}
          </select>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={selectStyle}>
            {MONTHS.map((m) => (<option key={m} value={m}>{m}월</option>))}
          </select>
          <select value={day} onChange={(e) => setDay(Number(e.target.value))} className={selectStyle}>
            {days.map((d) => (<option key={d} value={d}>{d}일</option>))}
          </select>
        </div>
      </div>

      {/* 태어난 시간 */}
      <div className="pb-6 border-b border-cm-dim/10">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-cm-muted">태어난 시간</label>
          <label className="flex items-center gap-2 text-[12px] text-cm-dim cursor-pointer">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => setUnknownTime(e.target.checked)}
              className="accent-cm-accent"
            />
            모름
          </label>
        </div>
        {!unknownTime && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <select value={hour} onChange={(e) => setHour(Number(e.target.value))} className={selectStyle}>
                {HOURS.map((h) => (<option key={h} value={h}>{String(h).padStart(2, "0")}시</option>))}
              </select>
              <select value={minute} onChange={(e) => setMinute(Number(e.target.value))} className={selectStyle}>
                {MINUTES.map((m) => (<option key={m} value={m}>{String(m).padStart(2, "0")}분</option>))}
              </select>
            </div>
            <p className="text-[11px] text-cm-accent/60">
              {getSichinName(hour)} · 정확한 시간일수록 분석이 정밀해집니다
            </p>
          </div>
        )}
        {unknownTime && (
          <p className="text-[11px] text-cm-dim mt-1">
            시간을 모르면 시주를 제외하고 분석합니다
          </p>
        )}
      </div>

      {/* 성별 */}
      <div className="pb-6 border-b border-cm-dim/10">
        <label className="block text-[10px] uppercase tracking-[0.2em] text-cm-muted mb-3">성별</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setGender("male")}
            className={`py-3 text-center text-[12px] font-medium transition-all ${
              gender === "male"
                ? "bg-cm-text text-cm-bg"
                : "border border-cm-dim/20 text-cm-muted"
            }`}
          >
            남성
          </button>
          <button
            onClick={() => setGender("female")}
            className={`py-3 text-center text-[12px] font-medium transition-all ${
              gender === "female"
                ? "bg-cm-text text-cm-bg"
                : "border border-cm-dim/20 text-cm-muted"
            }`}
          >
            여성
          </button>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-4">
        <button onClick={onBack} className="btn-secondary flex-1">
          이전
        </button>
        <button onClick={handleSubmit} className="btn-primary flex-1">
          다음
        </button>
      </div>
    </motion.div>
  );
}
