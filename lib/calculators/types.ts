export type CalculatorCategory = "all" | "finance" | "life" | "health_work";

export interface CalculatorMeta {
  id: string;
  name: string;
  shortDesc: string;
  category: "finance" | "life" | "health_work";
  badge?: string;
  keywords: string[];
}
