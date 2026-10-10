export interface DdayResult {
  targetDate: string;
  currentDate: string;
  diffInDays: number;
  ddayText: string;
  relativeDescription: string;
  isToday: boolean;
  isFuture: boolean;
  isPast: boolean;
}

export function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function calculateDday(targetDateStr: string, currentDateStr?: string): DdayResult {
  const now = new Date();
  const baseDateStr = currentDateStr || formatDateString(now);
  
  const targetDate = parseDateOnly(targetDateStr);
  const baseDate = parseDateOnly(baseDateStr);

  const diffInMs = targetDate.getTime() - baseDate.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  let ddayText = "";
  let relativeDescription = "";
  const isToday = diffInDays === 0;
  const isFuture = diffInDays > 0;
  const isPast = diffInDays < 0;

  if (isToday) {
    ddayText = "D-Day";
    relativeDescription = "오늘입니다!";
  } else if (isFuture) {
    ddayText = `D-${diffInDays}`;
    relativeDescription = `${diffInDays}일 남았습니다.`;
  } else {
    ddayText = `D+${Math.abs(diffInDays)}`;
    relativeDescription = `${Math.abs(diffInDays)}일 지났습니다.`;
  }

  return {
    targetDate: targetDateStr,
    currentDate: baseDateStr,
    diffInDays,
    ddayText,
    relativeDescription,
    isToday,
    isFuture,
    isPast,
  };
}

/**
 * 기준일로부터 n일 후/전 날짜 계산
 */
export function calculateDateOffset(baseDateStr: string, offsetDays: number): string {
  const baseDate = parseDateOnly(baseDateStr);
  const result = new Date(baseDate.getTime() + offsetDays * 24 * 60 * 60 * 1000);
  return formatDateString(result);
}
