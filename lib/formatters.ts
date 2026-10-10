/**
 * 숫자를 한국어 콤마 표기 문자열로 변환합니다.
 */
export function formatNumber(value: number, maxDecimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return "0";
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

/**
 * 금액(원) 포맷팅
 */
export function formatWon(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "0원";
  return `${formatNumber(Math.round(value), 0)}원`;
}

/**
 * 만원, 억원 등 큰 금액 친화적 포맷
 */
export function formatKoreanUnit(value: number): string {
  if (isNaN(value) || !isFinite(value) || value === 0) return "0원";
  const abs = Math.abs(Math.round(value));
  const sign = value < 0 ? "-" : "";
  
  const eok = Math.floor(abs / 100000000);
  const man = Math.floor((abs % 100000000) / 10000);
  const won = abs % 10000;

  const parts: string[] = [];
  if (eok > 0) parts.push(`${formatNumber(eok, 0)}억`);
  if (man > 0) parts.push(`${formatNumber(man, 0)}만`);
  if (won > 0 && eok === 0) parts.push(`${formatNumber(won, 0)}`);
  
  return `${sign}${parts.join(" ")}원`;
}

/**
 * 소수점 자리수 반올림 유틸
 */
export function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
