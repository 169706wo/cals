"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeftRight } from "lucide-react";
import {
  convertArea,
  AreaConvertType,
  POPULAR_AREA_PRESETS,
  SQM_PER_PYUNG,
} from "@/lib/calculators/area";
import { roundTo } from "@/lib/formatters";

export function AreaCalculator() {
  const [convertType, setConvertType] = useState<AreaConvertType>("sqmToPyung");
  const [val, setVal] = useState<string>("84");

  const res = convertArea(Number(val), convertType);

  const handleReset = () => {
    setVal("84");
    setConvertType("sqmToPyung");
  };

  const handleToggle = () => {
    if (convertType === "sqmToPyung") {
      setConvertType("pyungToSqm");
      setVal(String(res.pyung));
    } else {
      setConvertType("sqmToPyung");
      setVal(String(res.sqm));
    }
  };

  const setPreset = (sqm: number) => {
    setConvertType("sqmToPyung");
    setVal(String(sqm));
  };

  const copyText = !res.isError
    ? convertType === "sqmToPyung"
      ? `[면적 변환] ${res.inputValue}㎡ = 약 ${res.outputValue}평 (1평 = ${SQM_PER_PYUNG}㎡)`
      : `[면적 변환] ${res.inputValue}평 = 약 ${res.outputValue}㎡ (1평 = ${SQM_PER_PYUNG}㎡)`
    : "";

  return (
    <CalculatorCard
      id="area"
      title="부동산 면적 변환기 (평 ↔ ㎡)"
      description="제곱미터(㎡)와 평수(평)를 상호 변환하고 대표 아파트 평형 확인"
      badge="부동산"
      icon={<Home className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={copyText}
    >
      <div className="space-y-4">
        {/* 양방향 변환 토글 */}
        <div className="flex items-center justify-between">
          <Label>변환 방향</Label>
          <Button
            variant="outline"
            size="xs"
            onClick={handleToggle}
            className="text-xs h-7 gap-1"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            {convertType === "sqmToPyung" ? "㎡ → 평 변환 중" : "평 → ㎡ 변환 중"}
          </Button>
        </div>

        {/* 입력창 */}
        <div className="space-y-1.5">
          <Label htmlFor="areaValue">
            {convertType === "sqmToPyung" ? "면적 입력 (제곱미터 ㎡)" : "면적 입력 (평)"}
          </Label>
          <Input
            id="areaValue"
            type="number"
            step="0.1"
            placeholder={convertType === "sqmToPyung" ? "예: 84" : "예: 25"}
            suffixNode={convertType === "sqmToPyung" ? "㎡" : "평"}
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
        </div>

        {/* 아파트 대표 전용면적 프리셋 */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-muted-foreground">자주 찾는 아파트 전용면적</span>
          <div className="flex gap-1.5 flex-wrap">
            {POPULAR_AREA_PRESETS.map((p) => (
              <Button
                key={p.sqm}
                variant={Number(val) === p.sqm && convertType === "sqmToPyung" ? "default" : "outline"}
                size="xs"
                onClick={() => setPreset(p.sqm)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 결과 카드 */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">변환 결과</span>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              기준: 1평 = 약 {SQM_PER_PYUNG} ㎡
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary">
              {res.outputValue}
              <span className="text-base font-normal ml-1">
                {convertType === "sqmToPyung" ? "평" : "㎡"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
