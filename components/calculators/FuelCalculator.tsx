"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Fuel, ArrowRightLeft } from "lucide-react";
import { calculateFuelCost, FUEL_PRESETS } from "@/lib/calculators/fuel";
import { formatWon, formatNumber } from "@/lib/formatters";

export function FuelCalculator() {
  const [distance, setDistance] = useState<string>("150");
  const [efficiency, setEfficiency] = useState<string>("12.5");
  const [price, setPrice] = useState<string>("1680");
  const [isRoundTrip, setIsRoundTrip] = useState<boolean>(false);

  const res = calculateFuelCost(
    Number(distance),
    Number(efficiency),
    Number(price),
    isRoundTrip
  );

  const handleReset = () => {
    setDistance("150");
    setEfficiency("12.5");
    setPrice("1680");
    setIsRoundTrip(false);
  };

  const copyText = !res.isError
    ? `[유류비 계산 결과]\n주행거리: ${res.actualDistance}km (${isRoundTrip ? "왕복" : "편도"})\n연비: ${res.fuelEfficiency}km/L / 유가: ${formatWon(res.fuelPrice)}/L\n예상 필요 연료: ${res.requiredFuel}L\n예상 총 유류비: ${formatWon(res.totalCost)} (1km당 약 ${formatWon(res.costPerKm)})`
    : "";

  return (
    <CalculatorCard
      id="fuel"
      title="유류비 (자동차 주유비) 계산기"
      description="주행 거리와 차량 연비, 유가를 기반으로 예상 주유비 산출"
      badge="차량"
      icon={<Fuel className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={copyText}
    >
      <div className="space-y-4">
        {/* 주행거리 & 왕복 토글 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="fuelDistance">이동 거리</Label>
            <Button
              variant={isRoundTrip ? "default" : "outline"}
              size="xs"
              onClick={() => setIsRoundTrip(!isRoundTrip)}
              className="text-xs h-7 gap-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              {isRoundTrip ? "왕복 (x2)" : "편도"}
            </Button>
          </div>
          <Input
            id="fuelDistance"
            type="number"
            placeholder="예: 150"
            suffixNode="km"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          {isRoundTrip && Number(distance) > 0 && (
            <p className="text-[11px] text-muted-foreground">
              왕복 적용 실 주행거리: <span className="font-semibold text-foreground">{Number(distance) * 2}km</span>
            </p>
          )}
        </div>

        {/* 연비 및 유가 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="fuelEfficiency">차량 연비</Label>
            <Input
              id="fuelEfficiency"
              type="number"
              step="0.1"
              placeholder="예: 12.5"
              suffixNode="km/L"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fuelPrice">현재 유가</Label>
            <Input
              id="fuelPrice"
              type="number"
              placeholder="예: 1680"
              suffixNode="원/L"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* 유가 프리셋 */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-muted-foreground">유종별 평균 유가 프리셋</span>
          <div className="flex gap-1.5 flex-wrap">
            {FUEL_PRESETS.map((p) => (
              <Button
                key={p.label}
                variant={Number(price) === p.price ? "default" : "outline"}
                size="xs"
                onClick={() => setPrice(String(p.price))}
              >
                {p.label} ({formatNumber(p.price)}원)
              </Button>
            ))}
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
                <span className="text-xs text-muted-foreground">예상 총 유류비</span>
                <p className="text-[11px] text-muted-foreground">
                  필요 연료: 약 {res.requiredFuel}L
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{formatWon(res.totalCost)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-primary/10 flex items-center justify-between text-xs text-muted-foreground">
              <span>총 주행: {res.actualDistance}km</span>
              <span>1km당 약 {formatWon(res.costPerKm)}</span>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
