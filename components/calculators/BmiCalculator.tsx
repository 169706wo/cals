"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { calculateBmi } from "@/lib/calculators/bmi";

export function BmiCalculator() {
  const [height, setHeight] = useState<string>("175");
  const [weight, setWeight] = useState<string>("68");

  const res = calculateBmi(Number(height), Number(weight));

  const handleReset = () => {
    setHeight("");
    setWeight("");
  };

  const copyText = !res.isError
    ? `[BMI 계산 결과] 신장: ${height}cm, 체중: ${weight}kg => BMI: ${res.bmiScore} (${res.category}), 정상체중 범위: ${res.normalWeightMin}kg ~ ${res.normalWeightMax}kg`
    : "";

  // BMI 15 ~ 35 사이 비율 계산 (게이지 바용)
  const gaugePercent = Math.min(100, Math.max(0, ((res.bmiScore - 15) / (35 - 15)) * 100));

  return (
    <CalculatorCard
      id="bmi"
      title="비만도 (BMI) 계산기"
      description="신장과 체중을 기반으로 체질량지수 및 정상 체중 범위 산출"
      badge="건강"
      icon={<Activity className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={copyText}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="height">신장 (키)</Label>
            <Input
              id="height"
              type="number"
              placeholder="예: 175"
              suffixNode="cm"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="weight">체중 (몸무게)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="예: 68"
              suffixNode="kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
        </div>

        {res.isError ? (
          <div className="p-3 text-xs text-muted-foreground bg-muted/40 rounded-xl">
            {res.errorMessage || "신장과 체중을 입력하시면 결과가 표시됩니다."}
          </div>
        ) : (
          <div className="space-y-3">
            {/* 결과 카드 */}
            <div className={`p-4 rounded-xl border ${res.categoryBg} flex items-center justify-between`}>
              <div>
                <span className="text-xs text-muted-foreground">나의 체질량지수 (BMI)</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-foreground">{res.bmiScore}</span>
                  <span className={`text-base font-semibold ${res.categoryColor}`}>{res.category}</span>
                </div>
              </div>
              <div className="text-right text-xs space-y-1 text-muted-foreground">
                <div>
                  적정 체중: <span className="font-semibold text-foreground">{res.normalWeightMin}kg ~ {res.normalWeightMax}kg</span>
                </div>
                {res.weightDifference !== 0 && (
                  <div>
                    {res.weightDifference > 0 ? (
                      <span className="text-rose-500 font-medium">정상 상한보다 +{res.weightDifference}kg</span>
                    ) : (
                      <span className="text-sky-500 font-medium">정상 하한보다 {res.weightDifference}kg</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 게이지 바 */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
                <div className="h-full bg-sky-400 w-[17.5%]" title="저체중 (<18.5)" />
                <div className="h-full bg-emerald-400 w-[22.5%]" title="정상 (18.5~22.9)" />
                <div className="h-full bg-amber-400 w-[10%]" title="과체중 (23~24.9)" />
                <div className="h-full bg-rose-400 flex-1" title="비만 (≥25)" />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>저체중 (~18.5)</span>
                <span>정상 (~23)</span>
                <span>과체중 (~25)</span>
                <span>비만 (25~)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
