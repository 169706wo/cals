"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Coins, AlertCircle, CheckCircle2, ToggleLeft, ToggleRight } from "lucide-react";
import {
  calculateWage,
  TaxOption,
  MINIMUM_WAGE_2025,
  MINIMUM_WAGE_2026,
} from "@/lib/calculators/wage";
import { formatWon, formatKoreanUnit } from "@/lib/formatters";

export function WageCalculator() {
  const [wage, setWage] = useState<string>(String(MINIMUM_WAGE_2026));
  const [hours, setHours] = useState<string>("20");
  const [includeHoliday, setIncludeHoliday] = useState<boolean>(true);
  const [tax, setTax] = useState<TaxOption>("none");

  const res = calculateWage(Number(wage), Number(hours), tax, includeHoliday);

  const handleReset = () => {
    setWage(String(MINIMUM_WAGE_2026));
    setHours("20");
    setIncludeHoliday(true);
    setTax("none");
  };

  const copyText = !res.isError
    ? `[알바 급여 및 주휴수당 계산 결과]\n시급: ${formatWon(res.hourlyWage)} / 주 ${res.weeklyHours}시간 근무\n기본 주급: ${formatWon(res.basePay)}\n주휴수당: ${
        includeHoliday
          ? res.isHolidayAllowanceEligible
            ? `${formatWon(res.holidayAllowance)} (포함)`
            : "발생 안함 (주 15시간 미만)"
          : "미적용 (제외 선택됨)"
      }\n총 주급: ${formatWon(res.weeklyTotalPay)}\n월 환산 예상급여: ${formatWon(res.monthlyEstimatedPay)} (실수령액: ${formatWon(res.netMonthlyPay)})`
    : "";

  return (
    <CalculatorCard
      id="wage"
      title="주휴수당 및 알바 급여 계산기"
      description="시급과 주간 근무 시간을 기반으로 주휴수당 및 예상 주급/월급 산출"
      badge="알바/근무"
      icon={<Coins className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={copyText}
    >
      <div className="space-y-4">
        {/* 시급 입력 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="hourlyWage">시급</Label>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setWage(String(MINIMUM_WAGE_2025))}
              >
                25년 최저 ({formatWon(MINIMUM_WAGE_2025)})
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => setWage(String(MINIMUM_WAGE_2026))}
              >
                26년 최저 ({formatWon(MINIMUM_WAGE_2026)})
              </Button>
            </div>
          </div>
          <Input
            id="hourlyWage"
            type="number"
            placeholder="예: 10320"
            suffixNode="원"
            value={wage}
            onChange={(e) => setWage(e.target.value)}
          />
        </div>

        {/* 주간 근무 시간 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="weeklyHours">1주 총 근무 시간</Label>
            <span className="text-xs text-muted-foreground">
              {Number(hours) >= 15 ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 주휴수당 발생 요건 충족
                </span>
              ) : (
                <span className="text-amber-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> 주 15시간 미만 (주휴수당 미발생)
                </span>
              )}
            </span>
          </div>
          <Input
            id="weeklyHours"
            type="number"
            step="0.5"
            placeholder="예: 20"
            suffixNode="시간/주"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
          <div className="flex gap-1.5 pt-1 flex-wrap">
            {[14, 15, 20, 30, 40].map((h) => (
              <Button
                key={h}
                variant={Number(hours) === h ? "default" : "outline"}
                size="xs"
                onClick={() => setHours(String(h))}
              >
                주 {h}시간 {h === 15 ? "(최소)" : h === 40 ? "(풀타임)" : ""}
              </Button>
            ))}
          </div>
        </div>

        {/* 주휴수당 추가/제외 선택 옵션 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>주휴수당 포함 여부</Label>
            <span className="text-[11px] text-muted-foreground">
              {includeHoliday ? "주휴수당 포함 계산" : "주휴수당 미포함 (기본급만 계산)"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setIncludeHoliday(true)}
              className={`py-2 px-3 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                includeHoliday
                  ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              주휴수당 포함
            </button>
            <button
              type="button"
              onClick={() => setIncludeHoliday(false)}
              className={`py-2 px-3 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                !includeHoliday
                  ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              주휴수당 미포함 (제외)
            </button>
          </div>
        </div>

        {/* 세금 공제 옵션 */}
        <div className="space-y-1.5">
          <Label>세금 공제 옵션</Label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={() => setTax("none")}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                tax === "none"
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              미적용 (100%)
            </button>
            <button
              onClick={() => setTax("freelancer3_3")}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                tax === "freelancer3_3"
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              3.3% 프리랜서
            </button>
            <button
              onClick={() => setTax("insurance9_4")}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                tax === "insurance9_4"
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              4대보험 (약 9.4%)
            </button>
          </div>
        </div>

        {/* 결과 카드 */}
        {res.isError ? (
          <div className="p-3 text-xs text-destructive bg-destructive/10 rounded-xl">
            {res.errorMessage}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">총 예상 주급</span>
                <p className="text-[11px] text-muted-foreground">
                  기본급 {formatWon(res.basePay)}
                  {includeHoliday && res.isHolidayAllowanceEligible ? (
                    <span> + 주휴수당 {formatWon(res.holidayAllowance)}</span>
                  ) : !includeHoliday ? (
                    <span className="text-muted-foreground"> (주휴수당 제외됨)</span>
                  ) : null}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{formatWon(res.weeklyTotalPay)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-primary/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>월 환산 예상 급여 (주급 x 4.345주)</span>
                <span className="font-semibold text-foreground">{formatWon(res.monthlyEstimatedPay)}</span>
              </div>
              {res.deductionAmount > 0 && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>공제액 ({tax === "freelancer3_3" ? "소득세 3.3%" : "4대보험 약 9.4%"})</span>
                  <span className="font-semibold text-rose-500">-{formatWon(res.deductionAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-primary/10">
                <span className="font-medium text-foreground">월 예상 실 수령액</span>
                <span className="text-base font-bold text-primary">{formatWon(res.netMonthlyPay)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
