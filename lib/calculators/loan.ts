export interface LoanScheduleRow {
  month: number;
  monthlyPayment: number;
  principalPayment: number;
  interestPayment: number;
  remainingPrincipal: number;
}

export interface LoanResult {
  principal: number;
  annualInterestRate: number;
  months: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: LoanScheduleRow[];
  isError?: boolean;
  errorMessage?: string;
}

export function calculateLoanEqualPayment(
  principal: number,
  annualInterestRate: number,
  months: number
): LoanResult {
  if (isNaN(principal) || isNaN(annualInterestRate) || isNaN(months) || principal <= 0 || months <= 0) {
    return {
      principal: 0,
      annualInterestRate: 0,
      months: 0,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      schedule: [],
      isError: true,
      errorMessage: "대출 원금과 기간을 0보다 큰 값으로 입력해주세요.",
    };
  }

  // 이자율이 0%인 경우
  if (annualInterestRate === 0) {
    const monthlyPayment = Math.round(principal / months);
    const totalPayment = monthlyPayment * months;
    const schedule: LoanScheduleRow[] = [];
    let balance = principal;

    for (let i = 1; i <= months; i++) {
      const pPay = i === months ? balance : monthlyPayment;
      balance = Math.max(0, balance - pPay);
      schedule.push({
        month: i,
        monthlyPayment: pPay,
        principalPayment: pPay,
        interestPayment: 0,
        remainingPrincipal: balance,
      });
    }

    return {
      principal,
      annualInterestRate,
      months,
      monthlyPayment,
      totalPayment,
      totalInterest: 0,
      schedule,
    };
  }

  const monthlyRate = (annualInterestRate / 100) / 12;
  const rateFactor = Math.pow(1 + monthlyRate, months);
  const rawPmt = (principal * monthlyRate * rateFactor) / (rateFactor - 1);
  const monthlyPayment = Math.round(rawPmt);

  let currentBalance = principal;
  let totalInterest = 0;
  const schedule: LoanScheduleRow[] = [];

  for (let m = 1; m <= months; m++) {
    const interestPart = Math.round(currentBalance * monthlyRate);
    let principalPart = monthlyPayment - interestPart;

    if (m === months) {
      principalPart = currentBalance;
    }

    currentBalance = Math.max(0, currentBalance - principalPart);
    totalInterest += interestPart;

    schedule.push({
      month: m,
      monthlyPayment: principalPart + interestPart,
      principalPayment: principalPart,
      interestPayment: interestPart,
      remainingPrincipal: currentBalance,
    });
  }

  const totalPayment = principal + totalInterest;

  return {
    principal,
    annualInterestRate,
    months,
    monthlyPayment,
    totalPayment,
    totalInterest,
    schedule,
  };
}
