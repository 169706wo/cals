"use client";

import React, { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, Trash2, BookOpen } from "lucide-react";
import {
  calculateGpa,
  Course,
  CourseType,
  GRADE_POINTS_4_5,
  GRADE_POINTS_4_3,
} from "@/lib/calculators/gpa";

const DEFAULT_COURSES: Course[] = [
  { id: "1", name: "자료구조", credits: 3, grade: "A+", type: "major" },
  { id: "2", name: "알고리즘", credits: 3, grade: "A0", type: "major" },
  { id: "3", name: "컴퓨터네트워크", credits: 3, grade: "B+", type: "major" },
  { id: "4", name: "운영체제", credits: 3, grade: "B0", type: "major" },
  { id: "5", name: "실용영어", credits: 2, grade: "P", type: "general" },
];

export function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [scale, setScale] = useState<4.5 | 4.3>(4.5);

  const res = calculateGpa(courses, scale);

  const handleAddCourse = (type: CourseType = "major") => {
    const newId = String(Date.now());
    setCourses((prev) => [
      ...prev,
      { id: newId, name: "", credits: 3, grade: "A+", type },
    ]);
  };

  const handleRemoveCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleReset = () => {
    setCourses([
      { id: "1", name: "", credits: 3, grade: "A+", type: "major" },
      { id: "2", name: "", credits: 3, grade: "A0", type: "general" },
    ]);
  };

  const gradeOptions = scale === 4.5 ? Object.keys(GRADE_POINTS_4_5) : Object.keys(GRADE_POINTS_4_3);

  const copyText = `[대학 학점 계산 결과]\n전체 평점: ${res.gpa.toFixed(2)} / ${res.maxScale} (취득: ${res.totalAcquiredCredits}학점)\n전공 평점: ${
    res.hasMajorCourses ? `${res.majorGpa.toFixed(2)} / ${res.maxScale} (전공 취득: ${res.majorAcquiredCredits}학점)` : "전공 과목 없음"
  }\n(총 신청: ${res.totalAppliedCredits}학점, 교양 취득: ${res.generalAcquiredCredits}학점)`;

  return (
    <CalculatorCard
      id="gpa"
      title="대학 학점 (GPA) 계산기"
      description="과목별 전공/교양 구분과 성적을 바탕으로 전체 및 전공 평점 동시 산출"
      badge="대학생"
      icon={<GraduationCap className="w-5 h-5" />}
      onReset={handleReset}
      resultToCopy={copyText}
    >
      <div className="space-y-4">
        {/* 상단 옵션 바: 만점 기준 */}
        <div className="flex items-center justify-between">
          <Label>만점 기준</Label>
          <div className="inline-flex rounded-lg border border-border p-0.5 bg-muted/40 text-xs">
            <button
              onClick={() => setScale(4.5)}
              className={`px-3 py-1 rounded-md transition-colors ${
                scale === 4.5
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              4.5 만점
            </button>
            <button
              onClick={() => setScale(4.3)}
              className={`px-3 py-1 rounded-md transition-colors ${
                scale === 4.3
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              4.3 만점
            </button>
          </div>
        </div>

        {/* 과목 리스트 헤더 설명 */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span>과목명</span>
          <div className="flex items-center gap-6 pr-8">
            <span>이수구분</span>
            <span>학점</span>
            <span>성적</span>
          </div>
        </div>

        {/* 과목 리스트 */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {courses.map((course, idx) => (
            <div key={course.id} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={`과목명 ${idx + 1}`}
                className="flex-1 text-xs h-9"
                value={course.name}
                onChange={(e) => handleUpdateCourse(course.id, "name", e.target.value)}
              />

              {/* 전공 / 교양 구분 선택 */}
              <div className="w-20 shrink-0">
                <select
                  aria-label="이수구분"
                  className={`w-full h-9 rounded-xl border px-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                    course.type === "major"
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted/50 border-input text-muted-foreground"
                  }`}
                  value={course.type}
                  onChange={(e) => handleUpdateCourse(course.id, "type", e.target.value as CourseType)}
                >
                  <option value="major">전공</option>
                  <option value="general">교양</option>
                </select>
              </div>

              {/* 학점 선택 */}
              <div className="w-18 shrink-0">
                <select
                  aria-label="학점"
                  className="w-full h-9 rounded-xl border border-input bg-background/50 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  value={course.credits}
                  onChange={(e) => handleUpdateCourse(course.id, "credits", Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((c) => (
                    <option key={c} value={c}>
                      {c}학점
                    </option>
                  ))}
                </select>
              </div>

              {/* 성적 선택 */}
              <div className="w-20 shrink-0">
                <select
                  aria-label="성적"
                  className="w-full h-9 rounded-xl border border-input bg-background/50 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  value={course.grade}
                  onChange={(e) => handleUpdateCourse(course.id, "grade", e.target.value)}
                >
                  {gradeOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => handleRemoveCourse(course.id)}
                disabled={courses.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* 과목 추가 버튼 */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddCourse("major")}
            className="flex-1 text-xs h-8 gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> 전공 과목 추가
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleAddCourse("general")}
            className="flex-1 text-xs h-8 gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> 교양 과목 추가
          </Button>
        </div>

        {/* 결과 카드: 전체 평점 및 전공 평점 동시 출력 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* 1. 전체 성적 */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">전체 평점</span>
              <span className="text-[11px] text-muted-foreground">
                취득 {res.totalAcquiredCredits}학점 / 신청 {res.totalAppliedCredits}학점
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-primary">{res.gpa.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground">/ {res.maxScale}</span>
            </div>
          </div>

          {/* 2. 전공 성적 */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> 전공 평점
              </span>
              <span className="text-[11px] text-muted-foreground">
                전공 취득 {res.majorAcquiredCredits}학점
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              {res.hasMajorCourses ? (
                <>
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {res.majorGpa.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {res.maxScale}</span>
                </>
              ) : (
                <span className="text-base text-muted-foreground font-medium mt-1">
                  전공 과목 없음
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
