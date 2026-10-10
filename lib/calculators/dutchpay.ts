export type DutchpayRoundMode = "exact" | "floor10" | "ceil10" | "floor100" | "ceil100" | "floor1000" | "ceil1000";

export interface DutchpayResult {
  totalAmount: number;
  peopleCount: number;
  amountPerPerson: number;
  totalCollected: number;
  difference: number; // 잔여금/부족금 (+면 주최자가 남는 돈 가짐, -면 주최자가 더 냄)
  isError?: boolean;
  errorMessage?: string;
}

export function calculateDutchpay(
  totalAmount: number,
  peopleCount: number,
  roundMode: DutchpayRoundMode = "ceil100"
): DutchpayResult {
  if (isNaN(totalAmount) || totalAmount < 0) {
    return {
      totalAmount: 0,
      peopleCount: 1,
      amountPerPerson: 0,
      totalCollected: 0,
      difference: 0,
      isError: true,
      errorMessage: "총 금액을 올바르게 입력해주세요.",
    };
  }

  if (isNaN(peopleCount) || peopleCount <= 1) {
    return {
      totalAmount,
      peopleCount: Math.max(1, peopleCount || 1),
      amountPerPerson: totalAmount,
      totalCollected: totalAmount,
      difference: 0,
    };
  }

  const exactPerPerson = totalAmount / peopleCount;
  let amountPerPerson = Math.round(exactPerPerson);

  switch (roundMode) {
    case "exact":
      amountPerPerson = Math.round(exactPerPerson);
      break;
    case "floor10":
      amountPerPerson = Math.floor(exactPerPerson / 10) * 10;
      break;
    case "ceil10":
      amountPerPerson = Math.ceil(exactPerPerson / 10) * 10;
      break;
    case "floor100":
      amountPerPerson = Math.floor(exactPerPerson / 100) * 100;
      break;
    case "ceil100":
      amountPerPerson = Math.ceil(exactPerPerson / 100) * 100;
      break;
    case "floor1000":
      amountPerPerson = Math.floor(exactPerPerson / 1000) * 1000;
      break;
    case "ceil1000":
      amountPerPerson = Math.ceil(exactPerPerson / 1000) * 1000;
      break;
  }

  const totalCollected = amountPerPerson * peopleCount;
  const difference = totalCollected - totalAmount;

  return {
    totalAmount,
    peopleCount,
    amountPerPerson,
    totalCollected,
    difference,
  };
}
