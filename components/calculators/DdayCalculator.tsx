"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Sparkles } from "lucide-react";
import { calculateDday, calculateDateOffset, formatDateString } from "@/lib/calculators/dday";

export function DdayCalculator() {
  const todayStr = formatDateString(new Date());

  // Mode 1: D-Day
  const [currentDate, setCurrentDate] = useState<string>(todayStr);
  const [targetDate, setTargetDate] = useState<string>(() => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    return formatDateString(nextMonth);
  });

  // Mode 2: N일 후 날짜 계산
  const [baseDateForOffset, setBaseDateForOffset] = useState<string>(todayStr);
  const [offsetDays, setOffsetDays] = useState<string>("100");

  const [subTab, setSubTab] = useState<"dday" | "offset">("dday");

  const ddayRes = calculateDday(targetDate, currentDate);
  const offsetResultDate = calculateDateOffset(baseDateForOffset, Number(offsetDays) || 0);

  const handleReset = () => {
    setCurrentDate(todayStr);
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    setTargetDate(formatDateString(nextMonth));
    setOffsetDays("100");
  };

  const copyText =
    subTab === "dday"
      ? `[디데이 계산] 기준일: ${ddayRes.currentDate} / 목표일: ${ddayRes.targetDate} => ${ddayRes.ddayText} (${ddayRes.relativeDescription})`
      : `[기념일 계산] 기준일: ${baseDateForOffset}로부터 ${offsetDays}일째 되는 날은 ${offsetResultDate}입니다.`;

  return (
    <CalculatorCard
      id="dday"
      title="디데이 (D-Day) 및 날짜 계산기"
      description="시험, 기념일, 목표일까지 남은 일수 및 N일 후 날짜 계산"
      badge="일상"
      icon={<CalendarIcon className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={copyText}
    >
      <div className="space-y-4">
        {/* 탭 */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl text-xs font-medium">
          <button
            onClick={() => setSubTab("dday")}
            className={`py-1.5 rounded-lg transition-colors ${
              subTab === "dday"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            디데이 (남은 일수)
          </button>
          <button
            onClick={() => setSubTab("offset")}
            className={`py-1.5 rounded-lg transition-colors ${
              subTab === "offset"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            기념일 (N일 후 날짜)
          </button>
        </div>

        {subTab === "dday" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="currentDate">기준 날짜 (기본: 오늘)</Label>
                <Input
                  id="currentDate"
                  type="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="targetDate">목표 날짜</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            </div>

            {/* 결과 카드 */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">목표일까지</span>
                <p className="text-xs font-medium text-foreground mt-0.5">{ddayRes.relativeDescription}</p>
              </div>
              <div className="text-right">
                <span
                  className={`text-3xl font-extrabold ${
                    ddayRes.isToday
                      ? "text-rose-600 dark:text-rose-400 animate-pulse"
                      : ddayRes.isFuture
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {ddayRes.ddayText}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="baseDate">기준 날짜</Label>
                <Input
                  id="baseDate"
                  type="date"
                  value={baseDateForOffset}
                  onChange={(e) => setBaseDateForOffset(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="offsetDays">경과 일수 (N일 후)</Label>
                <Input
                  id="offsetDays"
                  type="number"
                  placeholder="예: 100"
                  suffixNode="일 후"
                  value={offsetDays}
                  onChange={(e) => setOffsetDays(e.target.value)}
                />
              </div>
            </div>

            {/* 퀵 프리셋 버튼 */}
            <div className="flex gap-1.5 flex-wrap">
              {[50, 100, 200, 300, 365, 1000].map((days) => (
                <Button
                  key={days}
                  variant={Number(offsetDays) === days ? "default" : "outline"}
                  size="xs"
                  onClick={() => setOffsetDays(String(days))}
                >
                  {days === 365 ? "1주년(365일)" : `${days}일`}
                </Button>
              ))}
            </div>

            {/* 결과 카드 */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">계산된 날짜</span>
                <p className="text-xs text-muted-foreground mt-0.5">{offsetDays}일이 되는 날</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{offsetResultDate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
