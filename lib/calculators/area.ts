import { roundTo } from "../formatters";

export const SQM_PER_PYUNG = 3.305785;

export type AreaConvertType = "sqmToPyung" | "pyungToSqm";

export interface AreaResult {
  inputValue: number;
  convertType: AreaConvertType;
  outputValue: number;
  sqm: number;
  pyung: number;
  isError?: boolean;
}

export function convertArea(value: number, convertType: AreaConvertType): AreaResult {
  if (isNaN(value) || value < 0) {
    return {
      inputValue: 0,
      convertType,
      outputValue: 0,
      sqm: 0,
      pyung: 0,
      isError: true,
    };
  }

  let sqm = 0;
  let pyung = 0;
  let outputValue = 0;

  if (convertType === "sqmToPyung") {
    sqm = value;
    pyung = roundTo(value / SQM_PER_PYUNG, 2);
    outputValue = pyung;
  } else {
    pyung = value;
    sqm = roundTo(value * SQM_PER_PYUNG, 2);
    outputValue = sqm;
  }

  return {
    inputValue: value,
    convertType,
    outputValue,
    sqm,
    pyung,
  };
}

export const POPULAR_AREA_PRESETS = [
  { label: "59㎡ (전용 18평 / 25평형)", sqm: 59 },
  { label: "74㎡ (전용 22평 / 30평형)", sqm: 74 },
  { label: "84㎡ (전용 25평 / 34평형)", sqm: 84 },
  { label: "102㎡ (전용 31평 / 40평형)", sqm: 102 },
  { label: "114㎡ (전용 35평 / 45평형)", sqm: 114 },
];
