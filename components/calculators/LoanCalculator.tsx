"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Landmark, ChevronDown, ChevronUp } from "lucide-react";
import { calculateLoanEqualPayment } from "@/lib/calculators/loan";
import { formatWon, formatKoreanUnit } from "@/lib/formatters";

export function LoanCalculator() {
  const [principal, setPrincipal] = useState<string>("50000000"); // 5천만원
  const [rate, setRate] = useState<string>("4.5"); // 4.5%
  const [months, setMonths] = useState<string>("24"); // 24개월 (2년)
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const res = calculateLoanEqualPayment(
    Number(principal),
    Number(rate),
    Number(months)
  );

  const handleReset = () => {
    setPrincipal("50000000");
    setRate("4.5");
    setMonths("24");
    setShowSchedule(false);
  };

  const addPrincipal = (amt: number) => {
    const curr = Number(principal) || 0;
    setPrincipal(String(curr + amt));
  };

  const setYearPreset = (years: number) => {
    setMonths(String(years * 12));
  };

  const copyText = !res.isError
    ? `[대출 원리금 균등상환 계산 결과]\n대출원금: ${formatWon(res.principal)} / 연이자율: ${res.annualInterestRate}% / 기간: ${res.months}개월\n월 상환액: ${formatWon(res.monthlyPayment)}\n총 이자액: ${formatWon(res.totalInterest)}\n총 상환금액: ${formatWon(res.totalPayment)}`
    : "";

  return (
    <CalculatorCard
      id="loan"
      title="대출 원리금 균등상환 계산기"
      description="원금과 이자를 매월 동일한 금액으로 상환하는 방식 계산"
      badge="금융"
      icon={<Landmark className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={copyText}
    >
      <div className="space-y-4">
        {/* 대출 원금 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="loanPrincipal">대출 원금</Label>
            {Number(principal) > 0 && (
              <span className="text-xs text-muted-foreground">{formatKoreanUnit(Number(principal))}</span>
            )}
          </div>
          <Input
            id="loanPrincipal"
            type="number"
            placeholder="예: 50000000"
            suffixNode="원"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
          <div className="flex gap-1.5 pt-1 flex-wrap">
            <Button variant="outline" size="xs" onClick={() => addPrincipal(10000000)}>
              +1천만
            </Button>
            <Button variant="outline" size="xs" onClick={() => addPrincipal(50000000)}>
              +5천만
            </Button>
            <Button variant="outline" size="xs" onClick={() => addPrincipal(100000000)}>
              +1억
            </Button>
          </div>
        </div>

        {/* 연 이자율 & 상환 기간 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="loanRate">연 이자율 (%)</Label>
            <Input
              id="loanRate"
              type="number"
              step="0.1"
              placeholder="예: 4.5"
              suffixNode="%"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="loanMonths">상환 기간 (개월)</Label>
            <Input
              id="loanMonths"
              type="number"
              placeholder="예: 24"
              suffixNode="개월"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
          </div>
        </div>

        {/* 기간 퀵 버튼 */}
        <div className="flex gap-1.5 flex-wrap">
          {[1, 2, 3, 5, 10, 20, 30].map((y) => (
            <Button
              key={y}
              variant={Number(months) === y * 12 ? "default" : "outline"}
              size="xs"
              onClick={() => setYearPreset(y)}
            >
              {y}년 ({y * 12}개월)
            </Button>
          ))}
        </div>

        {/* 결과 카드 */}
        {res.isError ? (
          <div className="p-3 text-xs text-destructive bg-destructive/10 rounded-xl">
            {res.errorMessage}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">매월 납입할 금액</span>
                  <p className="text-[11px] text-muted-foreground">{res.months}개월 동안 균등 납부</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-primary">{formatWon(res.monthlyPayment)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/10 text-xs">
                <div>
                  <span className="text-muted-foreground">총 이자액</span>
                  <p className="font-semibold text-rose-500 mt-0.5">{formatWon(res.totalInterest)}</p>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground">총 상환금액 (원금+이자)</span>
                  <p className="font-semibold text-foreground mt-0.5">{formatWon(res.totalPayment)}</p>
                </div>
              </div>
            </div>

            {/* 상환 스케줄 토글 */}
            {res.schedule.length > 0 && (
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs h-8 gap-1 text-muted-foreground justify-center"
                  onClick={() => setShowSchedule(!showSchedule)}
                >
                  {showSchedule ? (
                    <>
                      상환 일정표 접기 <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      상환 일정표 보기 (처음 12회차) <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>

                {showSchedule && (
                  <div className="mt-2 max-h-56 overflow-y-auto border border-border rounded-xl text-[11px]">
                    <table className="w-full text-center">
                      <thead className="bg-muted/50 text-muted-foreground sticky top-0 border-b border-border">
                        <tr>
                          <th className="py-1.5 px-2">회차</th>
                          <th className="py-1.5 px-2">월 상환액</th>
                          <th className="py-1.5 px-2">납입원금</th>
                          <th className="py-1.5 px-2">이자</th>
                          <th className="py-1.5 px-2">대출잔액</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {res.schedule.slice(0, 24).map((row) => (
                          <tr key={row.month} className="hover:bg-muted/20">
                            <td className="py-1.5 px-2">{row.month}회</td>
                            <td className="py-1.5 px-2 font-medium">{formatWon(row.monthlyPayment)}</td>
                            <td className="py-1.5 px-2">{formatWon(row.principalPayment)}</td>
                            <td className="py-1.5 px-2 text-rose-500">{formatWon(row.interestPayment)}</td>
                            <td className="py-1.5 px-2 text-muted-foreground">{formatWon(row.remainingPrincipal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {res.schedule.length > 24 && (
                      <div className="p-2 text-center text-muted-foreground bg-muted/20">
                        (전체 {res.schedule.length}회차 중 24회차까지 표시되었습니다)
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
