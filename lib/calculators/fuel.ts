import { roundTo } from "../formatters";

export interface FuelResult {
  distance: number;
  fuelEfficiency: number;
  fuelPrice: number;
  isRoundTrip: boolean;
  actualDistance: number;
  requiredFuel: number; // 필요 연료량 (L)
  totalCost: number;    // 총 유류비 (원)
  costPerKm: number;    // 1km당 비용
  isError?: boolean;
  errorMessage?: string;
}

export const FUEL_PRESETS = [
  { label: "휘발유", price: 1680 },
  { label: "경유", price: 1540 },
  { label: "LPG", price: 980 },
  { label: "고급휘발유", price: 1950 },
];

export function calculateFuelCost(
  distance: number,
  fuelEfficiency: number,
  fuelPrice: number,
  isRoundTrip: boolean = false
): FuelResult {
  if (isNaN(distance) || isNaN(fuelEfficiency) || isNaN(fuelPrice) || distance <= 0 || fuelEfficiency <= 0 || fuelPrice <= 0) {
    return {
      distance: 0,
      fuelEfficiency: 0,
      fuelPrice: 0,
      isRoundTrip,
      actualDistance: 0,
      requiredFuel: 0,
      totalCost: 0,
      costPerKm: 0,
      isError: true,
      errorMessage: fuelEfficiency <= 0 ? "차량 연비는 0보다 커야 합니다." : "이동 거리와 유가를 올바르게 입력해주세요.",
    };
  }

  const actualDistance = isRoundTrip ? distance * 2 : distance;
  const rawRequiredFuel = actualDistance / fuelEfficiency;
  const requiredFuel = roundTo(rawRequiredFuel, 2);
  const totalCost = Math.round(rawRequiredFuel * fuelPrice);
  const costPerKm = roundTo(totalCost / actualDistance, 1);

  return {
    distance,
    fuelEfficiency,
    fuelPrice,
    isRoundTrip,
    actualDistance,
    requiredFuel,
    totalCost,
    costPerKm,
  };
}
