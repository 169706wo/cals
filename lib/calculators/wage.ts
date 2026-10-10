export const MINIMUM_WAGE_2025 = 10030;
export const MINIMUM_WAGE_2026 = 10320;

export type TaxOption = "none" | "freelancer3_3" | "insurance9_4";

export interface WageResult {
  hourlyWage: number;
  weeklyHours: number;
  basePay: number;               // 기본 주급
  holidayAllowance: number;      // 주휴수당
  weeklyTotalPay: number;        // 주휴수당 포함/미포함 총 주급
  isHolidayAllowanceEligible: boolean; // 주휴수당 발생 요건 충족 여부 (15시간 이상)
  includeHolidayAllowance: boolean;   // 주휴수당 적용 여부
  monthlyEstimatedPay: number;   // 월 예상 급여 (주급 * 4.345주)
  deductionAmount: number;       // 공제액 (세금/보험)
  netMonthlyPay: number;         // 실 수령액
  taxOption: TaxOption;
  isError?: boolean;
  errorMessage?: string;
}

export function calculateWage(
  hourlyWage: number,
  weeklyHours: number,
  taxOption: TaxOption = "none",
  includeHolidayAllowance: boolean = true
): WageResult {
  if (isNaN(hourlyWage) || isNaN(weeklyHours) || hourlyWage < 0 || weeklyHours < 0) {
    return {
      hourlyWage: 0,
      weeklyHours: 0,
      basePay: 0,
      holidayAllowance: 0,
      weeklyTotalPay: 0,
      isHolidayAllowanceEligible: false,
      includeHolidayAllowance,
      monthlyEstimatedPay: 0,
      deductionAmount: 0,
      netMonthlyPay: 0,
      taxOption,
      isError: true,
      errorMessage: "시급과 근무 시간을 올바르게 입력해주세요.",
    };
  }

  const basePay = Math.round(hourlyWage * weeklyHours);
  const isHolidayAllowanceEligible = weeklyHours >= 15;

  let holidayAllowance = 0;
  if (isHolidayAllowanceEligible && includeHolidayAllowance) {
    holidayAllowance = Math.round((Math.min(weeklyHours, 40) / 40) * 8 * hourlyWage);
  }

  const weeklyTotalPay = basePay + holidayAllowance;
  // 월 평균 주수: 365 / 7 / 12 = 4.3452...
  const monthlyEstimatedPay = Math.round(weeklyTotalPay * 4.345);

  let deductionRate = 0;
  if (taxOption === "freelancer3_3") {
    deductionRate = 0.033;
  } else if (taxOption === "insurance9_4") {
    deductionRate = 0.094;
  }

  const deductionAmount = Math.round(monthlyEstimatedPay * deductionRate);
  const netMonthlyPay = monthlyEstimatedPay - deductionAmount;

  return {
    hourlyWage,
    weeklyHours,
    basePay,
    holidayAllowance,
    weeklyTotalPay,
    isHolidayAllowanceEligible,
    includeHolidayAllowance,
    monthlyEstimatedPay,
    deductionAmount,
    netMonthlyPay,
    taxOption,
  };
}
