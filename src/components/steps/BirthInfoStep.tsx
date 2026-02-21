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
    "자시(子時)", "자시(子時)", "축시(丑時)", "축시(丑時)",
    "인시(寅時)", "인시(寅時)", "묘시(卯時)", "묘시(卯時)",
    "진시(辰時)", "진시(辰時)", "사시(巳時)", "사시(巳時)",
    "오시(午時)", "오시(午時)", "미시(未時)", "미시(未時)",
    "신시(申時)", "신시(申時)", "유시(酉時)", "유시(酉時)",
    "술시(戌時)", "술시(戌時)", "해시(亥時)", "해시(亥時)",
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

  const days = Array.from(
    { length: getDaysInMonth(year, month) },
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
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <select
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="bg-cm-navy/60 border border-cm-gold/20 rounded-lg px-3 py-2.5 text-cm-ivory focus:outline-none focus:border-cm-gold/50"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}시
                  </option>
                ))}
              </select>
              <select
                value={minute}
                onChange={(e) => setMinute(Number(e.target.value))}
                className="bg-cm-navy/60 border border-cm-gold/20 rounded-lg px-3 py-2.5 text-cm-ivory focus:outline-none focus:border-cm-gold/50"
              >
                {MINUTES.map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}분
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-cm-gold/60">
              {getSichinName(hour)} · 정확한 시간일수록 분석이 정밀해집니다
            </p>
          </div>
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
