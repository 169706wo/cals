"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Users, Plus, Minus } from "lucide-react";
import { calculateDutchpay, DutchpayRoundMode } from "@/lib/calculators/dutchpay";
import { formatWon, formatKoreanUnit } from "@/lib/formatters";

export function DutchpayCalculator() {
  const [totalAmount, setTotalAmount] = useState<string>("78500");
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [roundMode, setRoundMode] = useState<DutchpayRoundMode>("ceil100");

  const res = calculateDutchpay(Number(totalAmount), peopleCount, roundMode);

  const handleReset = () => {
    setTotalAmount("");
    setPeopleCount(2);
  };

  const adjustPeople = (delta: number) => {
    setPeopleCount((prev) => Math.max(1, prev + delta));
  };

  const copyText = !res.isError
    ? `[더치페이 정산 안내]\n총 금액: ${formatWon(res.totalAmount)}\n참석 인원: ${res.peopleCount}명\n1인당 보낼 금액: ${formatWon(res.amountPerPerson)}\n(정산 차액: ${res.difference > 0 ? `+${formatWon(res.difference)} 남음` : res.difference < 0 ? `${formatWon(res.difference)} 부족` : "0원 딱 맞음"})`
    : "";

  return (
    <CalculatorCard
      id="dutchpay"
      title="더치페이 (N빵) 계산기"
      description="총 금액을 참석 인원수로 나누고 10원/100원 단위로 깔끔하게 정산"
      badge="모임"
      icon={<Users className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={copyText}
    >
      <div className="space-y-4">
        {/* 총 결제 금액 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="totalAmount">총 결제 금액</Label>
            {Number(totalAmount) > 0 && (
              <span className="text-xs text-muted-foreground">{formatKoreanUnit(Number(totalAmount))}</span>
            )}
          </div>
          <Input
            id="totalAmount"
            type="number"
            placeholder="예: 78500"
            suffixNode="원"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>

        {/* 참석 인원수 */}
        <div className="space-y-1.5">
          <Label>참석 인원수</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => adjustPeople(-1)}
              disabled={peopleCount <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex-1 text-center py-2 bg-muted/40 rounded-xl border border-border font-semibold text-base">
              {peopleCount}명
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => adjustPeople(1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 절사/올림 단위 옵션 */}
        <div className="space-y-1.5">
          <Label>정산 단위 옵션</Label>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={() => setRoundMode("ceil100")}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                roundMode === "ceil100"
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              100원 올림
            </button>
            <button
              onClick={() => setRoundMode("floor100")}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                roundMode === "floor100"
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              100원 절사
            </button>
            <button
              onClick={() => setRoundMode("exact")}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                roundMode === "exact"
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              1원 단위
            </button>
            <button
              onClick={() => setRoundMode("ceil1000")}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                roundMode === "ceil1000"
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              1,000원 올림
            </button>
            <button
              onClick={() => setRoundMode("floor1000")}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                roundMode === "floor1000"
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              1,000원 절사
            </button>
            <button
              onClick={() => setRoundMode("ceil10")}
              className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                roundMode === "ceil10"
                  ? "bg-primary text-primary-foreground border-primary font-semibold"
                  : "bg-background border-input text-foreground hover:bg-muted"
              }`}
            >
              10원 올림
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
                <span className="text-xs text-muted-foreground">1인당 보낼 금액</span>
                <p className="text-[11px] text-muted-foreground">
                  총 {peopleCount}명 ({roundMode.includes("ceil") ? "올림" : roundMode.includes("floor") ? "절사" : "정확"})
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{formatWon(res.amountPerPerson)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-primary/10 flex items-center justify-between text-xs text-muted-foreground">
              <span>총 걷히는 금액: {formatWon(res.totalCollected)}</span>
              <span>
                {res.difference > 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    +{formatWon(res.difference)} (남음)
                  </span>
                ) : res.difference < 0 ? (
                  <span className="text-rose-500 font-medium">
                    {formatWon(res.difference)} (총무 부담)
                  </span>
                ) : (
                  <span className="text-muted-foreground font-medium">차액 없음 (딱 맞음)</span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
