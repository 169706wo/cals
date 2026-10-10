"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CALCULATORS_LIST } from "@/lib/calculators/registry";
import { CalculatorCategory } from "@/lib/calculators/types";
import {
  Search,
  X,
  ChevronsUpDown,
  ChevronsDown,
  ChevronsUp,
  Sparkles,
} from "lucide-react";

import { PercentCalculator } from "@/components/calculators/PercentCalculator";
import { DiscountCalculator } from "@/components/calculators/DiscountCalculator";
import { DutchpayCalculator } from "@/components/calculators/DutchpayCalculator";
import { LoanCalculator } from "@/components/calculators/LoanCalculator";
import { DdayCalculator } from "@/components/calculators/DdayCalculator";
import { AreaCalculator } from "@/components/calculators/AreaCalculator";
import { FuelCalculator } from "@/components/calculators/FuelCalculator";
import { BmiCalculator } from "@/components/calculators/BmiCalculator";
import { GpaCalculator } from "@/components/calculators/GpaCalculator";
import { WageCalculator } from "@/components/calculators/WageCalculator";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // 로딩 스켈레톤 시뮬레이션 (초기 마운트 시)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const filteredCalculators = useMemo(() => {
    return CALCULATORS_LIST.filter((calc) => {
      const matchesCategory =
        selectedCategory === "all" || calc.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inName = calc.name.toLowerCase().includes(q);
      const inDesc = calc.shortDesc.toLowerCase().includes(q);
      const inKeywords = calc.keywords.some((k) => k.toLowerCase().includes(q));

      return inName || inDesc || inKeywords;
    });
  }, [selectedCategory, searchQuery]);

  const scrollToCalculator = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const categories = [
    { key: "all" as CalculatorCategory, label: "전체", count: 10 },
    { key: "finance" as CalculatorCategory, label: "금융·소비", count: 4 },
    { key: "life" as CalculatorCategory, label: "생활·편의", count: 3 },
    { key: "health_work" as CalculatorCategory, label: "건강·학업·근무", count: 3 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/20">
      {/* 배경 그레인(Grain) 텍스처 레이어 */}
      <div className="fixed inset-0 pointer-events-none grain-overlay z-0" />

      {/* 헤더 */}
      <Header />

      {/* Hero & 검색 섹션 */}
      <section className="relative z-10 border-b border-border/40 bg-gradient-to-b from-primary/5 via-muted/20 to-transparent py-12 px-4 transition-colors">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-panel text-primary text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>INU 학생 & 스마트 일상을 위한 생활형 계산기</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            INU 생활형 계산기
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            학점, 알바비, 더치페이부터 대출, BMI, 디데이까지 일상에 꼭 필요한 10가지 계산을 카드를 눌러 빠르고 간편하게 확인하세요.
          </p>

          {/* 검색창 */}
          <div className="max-w-md mx-auto relative pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-muted-foreground absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="계산기 검색 (예: 학점, 알바, 디데이, 이자, 평수)"
                className="w-full h-11 pl-11 pr-10 rounded-2xl border border-input/60 glass-panel text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 text-muted-foreground hover:text-foreground p-0.5 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 퀵 바로가기 칩 */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
            {CALCULATORS_LIST.map((calc) => (
              <button
                key={calc.id}
                onClick={() => scrollToCalculator(calc.id)}
                className="text-xs px-2.5 py-1 rounded-xl glass-panel text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all active:scale-95"
              >
                {calc.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 영역 */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6">
        {/* 카테고리 필터 바 & 상태 안내 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.key
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-102"
                    : "glass-panel text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-xs text-muted-foreground">
            <span className="text-[11px] bg-muted/40 px-2.5 py-1 rounded-lg">
              카드를 클릭하면 계산기가 펼쳐집니다
            </span>
            <span className="font-medium shrink-0">
              총 {filteredCalculators.length}개
            </span>
          </div>
        </div>

        {/* 로딩 중: Skeleton UI */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-2xl" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-7 w-12 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCalculators.length === 0 ? (
          /* 검색 결과 없음 */
          <div className="py-20 text-center space-y-3 glass-panel rounded-3xl p-8">
            <p className="text-base font-semibold text-foreground">
              검색어 &quot;{searchQuery}&quot;에 해당하는 계산기를 찾을 수 없습니다.
            </p>
            <p className="text-xs text-muted-foreground">
              다른 키워드로 검색하거나 카테고리 필터를 변경해 보세요.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-2 text-xs"
            >
              전체 목록 보기
            </Button>
          </div>
        ) : (
          /* 10가지 계산기 카드 그리드 (클릭 시 확장) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {filteredCalculators.some((c) => c.id === "percent") && <PercentCalculator />}
            {filteredCalculators.some((c) => c.id === "discount") && <DiscountCalculator />}
            {filteredCalculators.some((c) => c.id === "dutchpay") && <DutchpayCalculator />}
            {filteredCalculators.some((c) => c.id === "loan") && <LoanCalculator />}
            {filteredCalculators.some((c) => c.id === "dday") && <DdayCalculator />}
            {filteredCalculators.some((c) => c.id === "area") && <AreaCalculator />}
            {filteredCalculators.some((c) => c.id === "fuel") && <FuelCalculator />}
            {filteredCalculators.some((c) => c.id === "bmi") && <BmiCalculator />}
            {filteredCalculators.some((c) => c.id === "gpa") && <GpaCalculator />}
            {filteredCalculators.some((c) => c.id === "wage") && <WageCalculator />}
          </div>
        )}
      </main>

      {/* 하단 푸터 (Footer) */}
      <footer className="relative z-10 border-t border-border/40 py-10 text-center text-xs text-muted-foreground bg-background/50 backdrop-blur-md mt-16 transition-colors">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-foreground tracking-tight text-sm">
            INU 생활형 계산기
          </p>
          <p className="text-muted-foreground/80 text-xs">
            인천대학교 학생 및 사용자를 위해 설계된 편리한 생활형 계산기 웹 서비스입니다.
          </p>
          <p className="text-[11px] text-muted-foreground/60 pt-2 font-medium">
            Copyright INU 생활형 계산기 by Haesol
          </p>
        </div>
      </footer>
    </div>
  );
}
