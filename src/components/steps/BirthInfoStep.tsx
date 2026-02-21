"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { BirthInfo } from "@/lib/types";

interface BirthInfoStepProps {
  onNext: (info: BirthInfo) => void;
  onBack: () => void;
}

const SICHINS = [
  { label: "자시 (23:00~01:00)", hour: 0 },
  { label: "축시 (01:00~03:00)", hour: 2 },
  { label: "인시 (03:00~05:00)", hour: 4 },
  { label: "묘시 (05:00~07:00)", hour: 6 },
  { label: "진시 (07:00~09:00)", hour: 8 },
  { label: "사시 (09:00~11:00)", hour: 10 },
  { label: "오시 (11:00~13:00)", hour: 12 },
  { label: "미시 (13:00~15:00)", hour: 14 },
  { label: "신시 (15:00~17:00)", hour: 16 },
  { label: "유시 (17:00~19:00)", hour: 18 },
  { label: "술시 (19:00~21:00)", hour: 20 },
  { label: "해시 (21:00~23:00)", hour: 22 },
];

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
  const [sichinIdx, setSichinIdx] = useState(0);
  const [unknownTime, setUnknownTime] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [name, setName] = useState("");

  const days = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  );

  const handleSubmit = () => {
    const info: BirthInfo = {
      year,
      month,
      day,
      hour: unknownTime ? 12 : SICHINS[sichinIdx].hour,
      minute: 0,
      gender,
      unknownTime,
      name: name.trim() || undefined,
    };
    onNext(info);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="px-4 py-6 space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl text-cm-gold mb-1">사주 정보 입력</h2>
        <p className="text-sm text-cm-beige/60">양력 기준으로 입력해주세요</p>
      </div>

      {/* 이름 (선택) */}
      <div className="card p-4">
        <label className="block text-sm text-cm-beige/70 mb-2">이름 (선택)</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="결과에 표시할 이름"
          className="w-full bg-cm-navy/60 border border-cm-gold/20 rounded-lg px-3 py-2.5 text-cm-ivory placeholder:text-cm-beige/30 focus:outline-none focus:border-cm-gold/50"
        />
      </div>

      {/* 생년월일 */}
      <div className="card p-4">
        <label className="block text-sm text-cm-beige/70 mb-2">생년월일</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-cm-navy/60 border border-cm-gold/20 rounded-lg px-2 py-2.5 text-cm-ivory focus:outline-none focus:border-cm-gold/50"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-cm-navy/60 border border-cm-gold/20 rounded-lg px-2 py-2.5 text-cm-ivory focus:outline-none focus:border-cm-gold/50"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className="bg-cm-navy/60 border border-cm-gold/20 rounded-lg px-2 py-2.5 text-cm-ivory focus:outline-none focus:border-cm-gold/50"
          >
            {days.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 태어난 시간 */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-cm-beige/70">태어난 시간</label>
          <label className="flex items-center gap-2 text-sm text-cm-beige/50 cursor-pointer">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(e) => setUnknownTime(e.target.checked)}
              className="accent-cm-gold"
            />
            모름
          </label>
        </div>
        {!unknownTime && (
          <select
            value={sichinIdx}
            onChange={(e) => setSichinIdx(Number(e.target.value))}
            className="w-full bg-cm-navy/60 border border-cm-gold/20 rounded-lg px-3 py-2.5 text-cm-ivory focus:outline-none focus:border-cm-gold/50"
          >
            {SICHINS.map((s, i) => (
              <option key={i} value={i}>
                {s.label}
              </option>
            ))}
          </select>
        )}
        {unknownTime && (
          <p className="text-xs text-cm-beige/40 mt-1">
            시간을 모르면 시주(時柱)를 제외하고 분석합니다
          </p>
        )}
      </div>

      {/* 성별 */}
      <div className="card p-4">
        <label className="block text-sm text-cm-beige/70 mb-2">성별</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setGender("male")}
            className={`py-3 rounded-lg text-center font-bold transition-all ${
              gender === "male"
                ? "bg-cm-gold text-cm-navy"
                : "bg-cm-navy/60 border border-cm-gold/20 text-cm-beige/60"
            }`}
          >
            남성
          </button>
          <button
            onClick={() => setGender("female")}
            className={`py-3 rounded-lg text-center font-bold transition-all ${
              gender === "female"
                ? "bg-cm-gold text-cm-navy"
                : "bg-cm-navy/60 border border-cm-gold/20 text-cm-beige/60"
            }`}
          >
            여성
          </button>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 pt-2">
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
