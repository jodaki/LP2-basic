import type { Production, Purchase, Sale } from "./types";

export function inMonth(date: string, year: number, month: number) {
  const mm = String(month).padStart(2, "0");
  return date.startsWith(`${year}/${mm}`);
}

export function saleFinal(s: Sale) {
  return s.qty * s.unitPrice - (s.discount || 0);
}
export function saleWeight(s: Sale) {
  return s.qty * s.packKg;
}
export function saleRemain(s: Sale) {
  return saleFinal(s) - (s.collected || 0);
}
export function purchaseTotal(p: Purchase) {
  return p.kg * p.price + (p.freight || 0);
}
export function wasteKg(p: Production) {
  return Math.max(0, p.inputKg - p.cleanKg);
}
export function packCount(p: Production) {
  if (!p.packKg) return 0;
  return Math.floor(p.cleanKg / p.packKg);
}
export function yieldPct(p: Production) {
  return p.inputKg ? p.cleanKg / p.inputKg : 0;
}
