"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RotateCcw, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculatorCardProps {
  id: string;
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
  onReset?: () => void;
  resultToCopy?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function CalculatorCard({
  id,
  title,
  description,
  badge,
  icon,
  onReset,
  resultToCopy,
  children,
  defaultExpanded = false,
  isExpanded: controlledExpanded,
  onToggleExpand,
}: CalculatorCardProps) {
  const [copied, setCopied] = useState(false);
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const toggleExpand = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!resultToCopy) return;
    try {
      await navigator.clipboard.writeText(resultToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("복사 실패", e);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReset) onReset();
  };

  return (
    <div
      id={id}
      className={cn(
        "glass-panel rounded-3xl transition-all duration-300 scroll-mt-24 overflow-hidden group",
        isExpanded
          ? "ring-2 ring-primary/20 shadow-xl shadow-primary/5"
          : "hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 cursor-pointer"
      )}
    >
      {/* 카드 헤더 (클릭 시 토글) */}
      <div
        onClick={(e) => toggleExpand(e)}
        className={cn(
          "p-5 flex items-start justify-between gap-3 select-none transition-colors cursor-pointer",
          isExpanded ? "bg-muted/30 border-b border-border/40 pb-4" : "hover:bg-muted/20"
        )}
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {icon && (
            <div
              className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all",
                isExpanded
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                  : "bg-muted/70 text-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              {icon}
            </div>
          )}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-foreground leading-tight tracking-tight">
                {title}
              </h3>
              {badge && (
                <Badge
                  variant={isExpanded ? "default" : "secondary"}
                  className="text-[10px] px-2 py-0.2 font-medium"
                >
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* 우측 컨트롤 / 확장 토글 버튼 */}
        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          {isExpanded ? (
            <>
              {resultToCopy && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleCopy}
                  className="text-xs h-7.5 px-2.5 gap-1 text-muted-foreground hover:text-foreground rounded-lg"
                  title="결과 텍스트 복사"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{copied ? "복사됨" : "복사"}</span>
                </Button>
              )}
              {onReset && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleReset}
                  className="h-7.5 w-7.5 rounded-lg text-muted-foreground hover:text-foreground"
                  title="입력값 초기화"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => toggleExpand(e)}
                className="h-7.5 px-2 text-xs text-muted-foreground hover:text-foreground rounded-lg gap-1 border border-border/40 hover:bg-muted"
                title="카드 접기"
              >
                <span className="text-[11px] font-medium">접기</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors font-medium py-1 px-2.5 rounded-xl bg-muted/40 group-hover:bg-primary/10 border border-border/40">
              <span className="text-[11px]">열기</span>
              <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
            </div>
          )}
        </div>
      </div>

      {/* 펼쳐졌을 때 나타나는 계산기 본문 */}
      {isExpanded && (
        <div className="p-5 pt-4 transition-all duration-300 animate-in fade-in-50 zoom-in-98">
          {children}

          {/* 하단 접기 버튼 바 */}
          <div className="mt-5 pt-3 border-t border-border/30 flex justify-end">
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => toggleExpand(e)}
              className="text-xs text-muted-foreground hover:text-foreground h-7 gap-1 px-2 rounded-lg hover:bg-muted/60"
            >
              <span>접기</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
