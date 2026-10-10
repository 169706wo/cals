import { roundTo } from "../formatters";

export type BmiCategory = "저체중" | "정상" | "과체중" | "비만";

export interface BmiResult {
  bmiScore: number;
  category: BmiCategory;
  categoryColor: string;
  categoryBg: string;
  normalWeightMin: number;
  normalWeightMax: number;
  weightDifference: number; // 정상 상한/하한 대비 차이
  isError?: boolean;
  errorMessage?: string;
}

export function calculateBmi(heightCm: number, weightKg: number): BmiResult {
  if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
    return {
      bmiScore: 0,
      category: "정상",
      categoryColor: "text-muted-foreground",
      categoryBg: "bg-muted",
      normalWeightMin: 0,
      normalWeightMax: 0,
      weightDifference: 0,
      isError: true,
      errorMessage: "신장과 체중을 0보다 큰 값으로 입력해주세요.",
    };
  }

  const heightInMeters = heightCm / 100;
  const rawBmi = weightKg / (heightInMeters * heightInMeters);
  const bmiScore = roundTo(rawBmi, 1);

  let category: BmiCategory = "정상";
  let categoryColor = "text-emerald-600 dark:text-emerald-400";
  let categoryBg = "bg-emerald-500/10 border-emerald-500/30";

  if (bmiScore < 18.5) {
    category = "저체중";
    categoryColor = "text-sky-600 dark:text-sky-400";
    categoryBg = "bg-sky-500/10 border-sky-500/30";
  } else if (bmiScore < 23) {
    category = "정상";
    categoryColor = "text-emerald-600 dark:text-emerald-400";
    categoryBg = "bg-emerald-500/10 border-emerald-500/30";
  } else if (bmiScore < 25) {
    category = "과체중";
    categoryColor = "text-amber-600 dark:text-amber-400";
    categoryBg = "bg-amber-500/10 border-amber-500/30";
  } else {
    category = "비만";
    categoryColor = "text-rose-600 dark:text-rose-400";
    categoryBg = "bg-rose-500/10 border-rose-500/30";
  }

  const normalWeightMin = roundTo(18.5 * (heightInMeters * heightInMeters), 1);
  const normalWeightMax = roundTo(22.9 * (heightInMeters * heightInMeters), 1);

  let weightDifference = 0;
  if (weightKg < normalWeightMin) {
    weightDifference = roundTo(weightKg - normalWeightMin, 1);
  } else if (weightKg > normalWeightMax) {
    weightDifference = roundTo(weightKg - normalWeightMax, 1);
  }

  return {
    bmiScore,
    category,
    categoryColor,
    categoryBg,
    normalWeightMin,
    normalWeightMax,
    weightDifference,
  };
}
