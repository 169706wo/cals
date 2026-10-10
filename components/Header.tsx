"use client";

import React from "react";
import { Calculator } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
                INU 생활형 계산기
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                INU Smart Calc
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              인천대학교 학생과 일상을 위한 10종 스마트 계산 솔루션
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex text-xs px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground font-medium border border-border/40">
            총 10개 계산 기능
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
