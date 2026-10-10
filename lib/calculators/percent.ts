import { roundTo } from "../formatters";

export interface PercentCalculationResult {
  value: number;
  formatted: string;
  description: string;
  isError?: boolean;
}

/**
 * 1. 기준값의 percent%는 얼마인가?
 * result = baseValue * (percent / 100)
 */
export function calculatePercentOfValue(baseValue: number, percent: number): PercentCalculationResult {
  if (isNaN(baseValue) || isNaN(percent)) {
    return { value: 0, formatted: "0", description: "입력값을 확인해주세요." };
  }
  const result = roundTo(baseValue * (percent / 100), 2);
  return {
    value: result,
    formatted: result.toLocaleString("ko-KR", { maximumFractionDigits: 2 }),
    description: `${baseValue.toLocaleString()}의 ${percent}%는 ${result.toLocaleString()}입니다.`,
  };
}

/**
 * 2. 일부값(percent)은 기준값(baseValue)의 몇 %인가?
 * result = (percent / baseValue) * 100
 */
export function calculateValueOfPercent(baseValue: number, partValue: number): PercentCalculationResult {
  if (isNaN(baseValue) || isNaN(partValue) || baseValue === 0) {
    return {
      value: 0,
      formatted: "0%",
      description: baseValue === 0 ? "기준값은 0이 될 수 없습니다." : "입력값을 확인해주세요.",
      isError: baseValue === 0,
    };
  }
  const result = roundTo((partValue / baseValue) * 100, 2);
  return {
    value: result,
    formatted: `${result.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%`,
    description: `${partValue.toLocaleString()}은(는) ${baseValue.toLocaleString()}의 ${result}%입니다.`,
  };
}

/**
 * 3. 기준값에서 targetValue로 변하면 몇 % 증감했는가?
 * result = ((targetValue - baseValue) / baseValue) * 100
 */
export function calculatePercentChange(baseValue: number, targetValue: number): PercentCalculationResult {
  if (isNaN(baseValue) || isNaN(targetValue) || baseValue === 0) {
    return {
      value: 0,
      formatted: "0%",
      description: baseValue === 0 ? "기준값은 0이 될 수 없습니다." : "입력값을 확인해주세요.",
      isError: baseValue === 0,
    };
  }
  const change = targetValue - baseValue;
  const result = roundTo((change / baseValue) * 100, 2);
  const typeStr = result > 0 ? "증가" : result < 0 ? "감소" : "변동 없음";
  const absResult = Math.abs(result);
  return {
    value: result,
    formatted: `${result > 0 ? "+" : ""}${result.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}%`,
    description: `${baseValue.toLocaleString()}에서 ${targetValue.toLocaleString()}(으)로 ${absResult}% ${typeStr}했습니다.`,
  };
}
