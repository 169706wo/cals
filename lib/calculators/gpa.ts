import { roundTo } from "../formatters";

export type CourseType = "major" | "general";

export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  type: CourseType; // 전공 | 교양
}

export const GRADE_POINTS_4_5: Record<string, number | null> = {
  "A+": 4.5,
  "A0": 4.0,
  "B+": 3.5,
  "B0": 3.0,
  "C+": 2.5,
  "C0": 2.0,
  "D+": 1.5,
  "D0": 1.0,
  "F": 0.0,
  "P": null, // Pass (평점 산출 제외)
  "NP": null, // Non-Pass (평점 산출 제외)
};

export const GRADE_POINTS_4_3: Record<string, number | null> = {
  "A+": 4.3,
  "A0": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B0": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C0": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D0": 1.0,
  "D-": 0.7,
  "F": 0.0,
  "P": null,
  "NP": null,
};

export interface GpaResult {
  gpa: number;                  // 전체 평점 평균
  majorGpa: number;             // 전공 평점 평균
  totalAppliedCredits: number;  // 전체 총 신청 학점
  totalGpaCredits: number;      // 전체 평점 계산 대상 학점
  totalAcquiredCredits: number; // 전체 총 취득 학점 (F, NP 제외)
  majorAppliedCredits: number;  // 전공 신청 학점
  majorGpaCredits: number;      // 전공 평점 계산 대상 학점
  majorAcquiredCredits: number; // 전공 취득 학점
  generalAcquiredCredits: number;// 교양 취득 학점
  hasMajorCourses: boolean;     // 전공 과목 존재 여부
  maxScale: number;
}

export function calculateGpa(
  courses: Course[],
  scale: 4.5 | 4.3 = 4.5
): GpaResult {
  const gradeMap = scale === 4.5 ? GRADE_POINTS_4_5 : GRADE_POINTS_4_3;

  let totalGradePoints = 0;
  let totalAppliedCredits = 0;
  let totalGpaCredits = 0;
  let totalAcquiredCredits = 0;

  let majorGradePoints = 0;
  let majorAppliedCredits = 0;
  let majorGpaCredits = 0;
  let majorAcquiredCredits = 0;

  let generalAcquiredCredits = 0;

  for (const course of courses) {
    const credits = Number(course.credits) || 0;
    if (credits <= 0) continue;

    const isMajor = course.type === "major";
    totalAppliedCredits += credits;
    if (isMajor) {
      majorAppliedCredits += credits;
    }

    const point = gradeMap[course.grade];
    if (point !== undefined && point !== null) {
      // 일반 성적 과목
      totalGradePoints += credits * point;
      totalGpaCredits += credits;
      if (point > 0) {
        totalAcquiredCredits += credits;
        if (isMajor) {
          majorAcquiredCredits += credits;
        } else {
          generalAcquiredCredits += credits;
        }
      }

      if (isMajor) {
        majorGradePoints += credits * point;
        majorGpaCredits += credits;
      }
    } else if (course.grade === "P") {
      // Pass 과목은 학점 취득으로 인정
      totalAcquiredCredits += credits;
      if (isMajor) {
        majorAcquiredCredits += credits;
      } else {
        generalAcquiredCredits += credits;
      }
    }
  }

  const gpa = totalGpaCredits > 0 ? roundTo(totalGradePoints / totalGpaCredits, 2) : 0;
  const majorGpa = majorGpaCredits > 0 ? roundTo(majorGradePoints / majorGpaCredits, 2) : 0;

  return {
    gpa,
    majorGpa,
    totalAppliedCredits,
    totalGpaCredits,
    totalAcquiredCredits,
    majorAppliedCredits,
    majorGpaCredits,
    majorAcquiredCredits,
    generalAcquiredCredits,
    hasMajorCourses: majorGpaCredits > 0 || majorAppliedCredits > 0,
    maxScale: scale,
  };
}
