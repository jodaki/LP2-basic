export function toman(n: number) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("fa-IR").format(Math.round(n)) + " تومان";
}

export function num(n: number, digits = 0) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}

export function kg(n: number) {
  return num(n, 1) + " کیلو";
}

export function pct(n: number) {
  if (!Number.isFinite(n)) return "—";
  return num(n * 100, 1) + "٪";
}

export function packLabel(packKg: number) {
  if (packKg === 0.4) return "۴۰۰ گرم";
  if (packKg === 0.9) return "۹۰۰ گرم";
  if (packKg === 10) return "۱۰ کیلو";
  return kg(packKg);
}

export const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
