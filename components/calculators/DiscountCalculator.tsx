"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { calculateDiscount } from "@/lib/calculators/discount";
import { formatWon, formatKoreanUnit } from "@/lib/formatters";

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState<string>("89000");
  const [discountRate, setDiscountRate] = useState<string>("25");

  const res = calculateDiscount(Number(originalPrice), Number(discountRate));

  const handleReset = () => {
    setOriginalPrice("");
    setDiscountRate("");
  };

  const setPresetRate = (rate: number) => {
    setDiscountRate(String(rate));
  };

  const addPrice = (amount: number) => {
    const current = Number(originalPrice) || 0;
    setOriginalPrice(String(current + amount));
  };

  const copyText = !res.isError
    ? `[할인 계산 결과] 원가: ${formatWon(res.originalPrice)} / 할인율: ${res.discountRate}% => 할인금액: -${formatWon(res.discountAmount)}, 최종 결제액: ${formatWon(res.finalPrice)}`
    : "";

  return (
    <CalculatorCard
      id="discount"
      title="할인율 및 최종 결제액 계산기"
      description="원가와 할인율(%)을 입력하여 할인액과 최종 결제 금액을 계산"
      badge="쇼핑"
      icon={<Tag className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={copyText}
    >
      <div className="space-y-4">
        {/* 원가 입력 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="originalPrice">원가 (정상가)</Label>
            {Number(originalPrice) > 0 && (
              <span className="text-xs text-muted-foreground">{formatKoreanUnit(Number(originalPrice))}</span>
            )}
          </div>
          <Input
            id="originalPrice"
            type="number"
            placeholder="예: 89000"
            suffixNode="원"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
          <div className="flex gap-1.5 pt-1">
            <Button variant="outline" size="xs" onClick={() => addPrice(10000)}>
              +1만
            </Button>
            <Button variant="outline" size="xs" onClick={() => addPrice(50000)}>
              +5만
            </Button>
            <Button variant="outline" size="xs" onClick={() => addPrice(100000)}>
              +10만
            </Button>
          </div>
        </div>

        {/* 할인율 입력 */}
        <div className="space-y-1.5">
          <Label htmlFor="discountRate">할인율 (%)</Label>
          <Input
            id="discountRate"
            type="number"
            placeholder="예: 25"
            suffixNode="%"
            value={discountRate}
            onChange={(e) => setDiscountRate(e.target.value)}
          />
          <div className="flex gap-1.5 pt-1 flex-wrap">
            {[10, 15, 20, 30, 50, 70].map((rate) => (
              <Button
                key={rate}
                variant={Number(discountRate) === rate ? "default" : "outline"}
                size="xs"
                onClick={() => setPresetRate(rate)}
              >
                {rate}%
              </Button>
            ))}
          </div>
        </div>

        {/* 결과 영역 */}
        {res.isError ? (
          <div className="p-3 text-xs text-destructive bg-destructive/10 rounded-xl">
            {res.errorMessage}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>할인 금액</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                -{formatWon(res.discountAmount)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-primary/10">
              <div>
                <span className="text-xs font-medium text-foreground">최종 결제 금액</span>
                <p className="text-[11px] text-muted-foreground">{res.discountRate}% 할인 적용</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{formatWon(res.finalPrice)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
