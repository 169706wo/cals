import { roundTo } from "../formatters";

export interface DiscountResult {
  originalPrice: number;
  discountRate: number;
  discountAmount: number;
  finalPrice: number;
  isError?: boolean;
  errorMessage?: string;
}

export function calculateDiscount(originalPrice: number, discountRate: number): DiscountResult {
  if (isNaN(originalPrice) || isNaN(discountRate)) {
    return {
      originalPrice: 0,
      discountRate: 0,
      discountAmount: 0,
      finalPrice: 0,
      isError: true,
      errorMessage: "가격을 입력해주세요.",
    };
  }

  if (originalPrice < 0) {
    return {
      originalPrice: 0,
      discountRate: 0,
      discountAmount: 0,
      finalPrice: 0,
      isError: true,
      errorMessage: "원가는 0원 이상이어야 합니다.",
    };
  }

  if (discountRate < 0 || discountRate > 100) {
    return {
      originalPrice,
      discountRate,
      discountAmount: 0,
      finalPrice: originalPrice,
      isError: true,
      errorMessage: "할인율은 0%에서 100% 사이여야 합니다.",
    };
  }

  const discountAmount = Math.round(originalPrice * (discountRate / 100));
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  return {
    originalPrice,
    discountRate,
    discountAmount,
    finalPrice,
  };
}
