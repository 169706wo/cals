"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Percent, ArrowRight } from "lucide-react";
import {
  calculatePercentOfValue,
  calculateValueOfPercent,
  calculatePercentChange,
} from "@/lib/calculators/percent";

export function PercentCalculator() {
  // Mode 1: baseValue의 percent%
  const [m1Base, setM1Base] = useState<string>("100000");
  const [m1Percent, setM1Percent] = useState<string>("15");

  // Mode 2: percentValue가 baseValue의 몇 %인가
  const [m2Base, setM2Base] = useState<string>("50000");
  const [m2Part, setM2Part] = useState<string>("12500");

  // Mode 3: baseValue에서 targetValue로 변하면 몇 % 증감
  const [m3Base, setM3Base] = useState<string>("20000");
  const [m3Target, setM3Target] = useState<string>("26000");

  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);

  const res1 = calculatePercentOfValue(Number(m1Base), Number(m1Percent));
  const res2 = calculateValueOfPercent(Number(m2Base), Number(m2Part));
  const res3 = calculatePercentChange(Number(m3Base), Number(m3Target));

  const handleReset = () => {
    if (activeTab === 1) {
      setM1Base("");
      setM1Percent("");
    } else if (activeTab === 2) {
      setM2Base("");
      setM2Part("");
    } else {
      setM3Base("");
      setM3Target("");
    }
  };

  const getCopyText = () => {
    if (activeTab === 1) return res1.description;
    if (activeTab === 2) return res2.description;
    return res3.description;
  };

  return (
    <CalculatorCard
      id="percent"
      title="퍼센트(%) 계산기"
      description="비율 계산, 일부값 비율, 증감률 계산 등 3가지 모드 지원"
      badge="필수"
      icon={<Percent className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={getCopyText()}
    >
      <div className="space-y-4">
        {/* 모드 선택 탭 */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveTab(1)}
            className={`py-1.5 rounded-lg transition-colors ${
              activeTab === 1
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            1. 비율 계산
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`py-1.5 rounded-lg transition-colors ${
              activeTab === 2
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            2. 일부값 비율
          </button>
          <button
            onClick={() => setActiveTab(3)}
            className={`py-1.5 rounded-lg transition-colors ${
              activeTab === 3
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            3. 증감률 계산
          </button>
        </div>

        {/* 모드 1: 기준값의 X%는 얼마인가? */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m1Base">기준값 (전체값)</Label>
                <Input
                  id="m1Base"
                  type="number"
                  placeholder="예: 100000"
                  value={m1Base}
                  onChange={(e) => setM1Base(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m1Percent">퍼센트 (%)</Label>
                <Input
                  id="m1Percent"
                  type="number"
                  placeholder="예: 15"
                  suffixNode="%"
                  value={m1Percent}
                  onChange={(e) => setM1Percent(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">계산 결과</span>
              <div className="text-right">
                <span className="text-xl font-bold text-primary">{res1.formatted}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{res1.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* 모드 2: 일부값은 기준값의 몇 %인가? */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m2Base">기준값 (전체값)</Label>
                <Input
                  id="m2Base"
                  type="number"
                  placeholder="예: 50000"
                  value={m2Base}
                  onChange={(e) => setM2Base(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m2Part">일부값</Label>
                <Input
                  id="m2Part"
                  type="number"
                  placeholder="예: 12500"
                  value={m2Part}
                  onChange={(e) => setM2Part(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">계산 결과</span>
              <div className="text-right">
                <span className={`text-xl font-bold ${res2.isError ? "text-destructive" : "text-primary"}`}>
                  {res2.formatted}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{res2.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* 모드 3: 기준값에서 X로 변하면 몇 % 증감? */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m3Base">이전 값 (기준값)</Label>
                <Input
                  id="m3Base"
                  type="number"
                  placeholder="예: 20000"
                  value={m3Base}
                  onChange={(e) => setM3Base(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m3Target">변경 값</Label>
                <Input
                  id="m3Target"
                  type="number"
                  placeholder="예: 26000"
                  value={m3Target}
                  onChange={(e) => setM3Target(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">증감률 결과</span>
              <div className="text-right">
                <span
                  className={`text-xl font-bold ${
                    res3.value > 0
                      ? "text-rose-600 dark:text-rose-400"
                      : res3.value < 0
                      ? "text-sky-600 dark:text-sky-400"
                      : "text-foreground"
                  }`}
                >
                  {res3.formatted}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{res3.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
