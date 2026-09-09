import { purchaseTotal, saleFinal, saleWeight, wasteKg } from "./kpis-core";
import type {
  PhysicalCount,
  Production,
  Purchase,
  Sale,
  Settings,
  Supplier,
  InvMove,
  Expense,
} from "./types";

export function isPosted<T extends { approvalStatus?: string; voided?: boolean }>(row: T) {
  return !row.voided && row.approvalStatus === "approved";
}

export function isStockPurchase(p: Purchase) {
  return isPosted(p) && p.qcResult !== "رد";
}

export function packingCostOf(packKg: number, settings: Settings) {
  if (packKg <= 0.5) return settings.packingCost400;
  if (packKg <= 1) return settings.packingCost900;
  return settings.packingCost10;
}

export function rawWac(product: string, purchases: Purchase[]) {
  const rows = purchases.filter((p) => p.product === product && isStockPurchase(p));
  const qty = rows.reduce((a, p) => a + p.kg, 0);
  const value = rows.reduce((a, p) => a + purchaseTotal(p), 0);
  return { qty, value, avg: qty ? value / qty : 0 };
}

export function yieldOf(product: string, production: Production[], fallback: number) {
  const rows = production.filter((p) => p.product === product && isPosted(p));
  const input = rows.reduce((a, p) => a + p.inputKg, 0);
  const clean = rows.reduce((a, p) => a + p.cleanKg, 0);
  if (!input) return fallback;
  return clean / input;
}

export function rawStockQty(
  product: string,
  purchases: Purchase[],
  production: Production[],
  moves: InvMove[],
) {
  const inn =
    purchases.filter((p) => p.product === product && isStockPurchase(p)).reduce((a, p) => a + p.kg, 0) +
    moves.filter((m) => isPosted(m) && m.kind === "مواد اولیه" && m.product === product).reduce((a, m) => a + m.inn, 0);
  const out =
    production.filter((p) => isPosted(p) && p.product === product).reduce((a, p) => a + p.inputKg, 0) +
    moves.filter((m) => isPosted(m) && m.kind === "مواد اولیه" && m.product === product).reduce((a, m) => a + m.out, 0);
  return inn - out;
}

export function finStockQty(product: string, production: Production[], sales: Sale[], moves: InvMove[]) {
  const inn =
    production.filter((p) => isPosted(p) && p.product === product).reduce((a, p) => a + p.cleanKg, 0) +
    moves.filter((m) => isPosted(m) && m.kind === "محصول نهایی" && m.product === product).reduce((a, m) => a + m.inn, 0);
  const out =
    sales.filter((s) => isPosted(s) && s.product === product).reduce((a, s) => a + saleWeight(s), 0) +
    moves.filter((m) => isPosted(m) && m.kind === "محصول نهایی" && m.product === product).reduce((a, m) => a + m.out, 0);
  return inn - out;
}

export function packStockQty(
  product: string,
  packKg: number,
  production: Production[],
  sales: Sale[],
) {
  const made = production
    .filter((p) => isPosted(p) && p.product === product && p.packKg === packKg)
    .reduce((a, p) => a + (p.packKg ? Math.floor(p.cleanKg / p.packKg) : 0), 0);
  const sold = sales
    .filter((s) => isPosted(s) && s.product === product && s.packKg === packKg)
    .reduce((a, s) => a + s.qty, 0);
  return made - sold;
}

export function cogsPerKg(product: string, packKg: number, input: CostInput) {
  const y = yieldOf(product, input.production, input.settings.yieldDefault) || input.settings.yieldDefault;
  const rawAvg = rawWac(product, input.purchases).avg;
  const material = y ? rawAvg / y : rawAvg;
  const packing = packingCostOf(packKg, input.settings) / (packKg || 1);
  return material + packing + input.settings.productionCostPerKg + input.settings.overheadPerKg;
}

export function cogsPerPack(product: string, packKg: number, input: CostInput) {
  return cogsPerKg(product, packKg, input) * packKg;
}

export type CostInput = {
  settings: Settings;
  purchases: Purchase[];
  production: Production[];
  sales: Sale[];
};

export function saleCogs(s: Sale, input: CostInput) {
  return cogsPerKg(s.product, s.packKg, input) * saleWeight(s);
}

export function lastSalePrice(product: string, packKg: number, sales: Sale[]) {
  const row = sales
    .filter((s) => isPosted(s) && s.product === product && s.packKg === packKg)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  return row?.unitPrice ?? 0;
}

export type ProductCostRow = {
  product: string;
  packKg: number;
  rawKg: number;
  rawAvg: number;
  material: number;
  packing: number;
  production: number;
  overhead: number;
  cogsPack: number;
  cogsKg: number;
  salePrice: number;
  profit: number;
  margin: number;
};

export function productCostTable(products: string[], packs: number[], input: CostInput): ProductCostRow[] {
  return products.flatMap((product) =>
    packs.map((packKg) => {
      const y = yieldOf(product, input.production, input.settings.yieldDefault) || input.settings.yieldDefault;
      const rawAvg = rawWac(product, input.purchases).avg;
      const rawKg = packKg / y;
      const material = rawKg * rawAvg;
      const packing = packingCostOf(packKg, input.settings);
      const production = packKg * input.settings.productionCostPerKg;
      const overhead = packKg * input.settings.overheadPerKg;
      const cogsPack = material + packing + production + overhead;
      const salePrice = lastSalePrice(product, packKg, input.sales);
      const profit = salePrice - cogsPack;
      return {
        product,
        packKg,
        rawKg,
        rawAvg,
        material,
        packing,
        production,
        overhead,
        cogsPack,
        cogsKg: packKg ? cogsPack / packKg : 0,
        salePrice,
        profit,
        margin: salePrice ? profit / salePrice : 0,
      };
    }),
  );
}

export function monthGrossNet(
  sales: Sale[],
  expenses: Expense[],
  input: CostInput,
  year: number,
  month: number,
) {
  const mm = String(month).padStart(2, "0");
  const prefix = `${year}/${mm}`;
  const monthSales = sales.filter((s) => isPosted(s) && s.date.startsWith(prefix));
  const revenue = monthSales.reduce((a, s) => a + saleFinal(s), 0);
  const cogs = monthSales.reduce((a, s) => a + saleCogs(s, input), 0);
  const operating = expenses
    .filter((e) => isPosted(e) && e.date.startsWith(prefix) && e.type !== "بسته‌بندی")
    .reduce((a, e) => a + e.amount, 0);
  const gross = revenue - cogs;
  return { revenue, cogs, gross, operating, net: gross - operating };
}

export function stockLight(qty: number, min: number, reorder: number) {
  if (qty >= min) return "ok" as const;
  if (qty >= reorder) return "watch" as const;
  return "critical" as const;
}

export function supplierScore100(
  s: Supplier,
  purchases: Purchase[],
): { score: number; acceptRate: number; quality: number; price: number; delivery: number } {
  const rows = purchases.filter((p) => p.supplier === s.name && !p.voided);
  const accepted = rows.filter((p) => p.qcResult === "قبول" && p.approvalStatus !== "rejected").length;
  const acceptRate = rows.length ? accepted / rows.length : 0.7;
  const qMap: Record<string, number> = { عالی: 1, خوب: 0.8, متوسط: 0.5, ضعیف: 0.2 };
  const quality =
    rows.length > 0
      ? rows.reduce((a, p) => a + (qMap[p.quality] ?? 0.6), 0) / rows.length
      : (s.scoreQuality || 7) / 10;
  const avgPrice =
    rows.filter(isStockPurchase).reduce((a, p) => a + p.price, 0) /
      Math.max(1, rows.filter(isStockPurchase).length) || s.price;
  const allPrices = purchases.filter(isStockPurchase).map((p) => p.price);
  const market = allPrices.length ? allPrices.reduce((a, n) => a + n, 0) / allPrices.length : avgPrice;
  const price = market ? Math.max(0, Math.min(1, 1.4 - avgPrice / market)) : (s.scorePrice || 7) / 10;
  const delivery = Math.max(0, Math.min(1, 1 - (s.days || 3) / 20));
  const manual = (s.scorePrice + s.scoreQuality + s.scoreDelivery + s.scoreStability + s.scorePay) / 50;
  const score =
    (0.25 * quality + 0.2 * price + 0.15 * delivery + 0.25 * acceptRate + 0.15 * manual) * 100;
  return { score, acceptRate, quality, price, delivery };
}

export function wasteByReason(production: Production[]) {
  const map = new Map<string, { kg: number; count: number }>();
  for (const p of production.filter(isPosted)) {
    const reason = p.wasteReason || "نامشخص";
    const cur = map.get(reason) ?? { kg: 0, count: 0 };
    cur.kg += wasteKg(p);
    cur.count += 1;
    map.set(reason, cur);
  }
  return [...map.entries()]
    .map(([reason, v]) => ({ reason, ...v }))
    .sort((a, b) => b.kg - a.kg);
}

export function countVariance(c: PhysicalCount) {
  return c.actualQty - c.systemQty;
}

export function countAlert(c: PhysicalCount, pct: number) {
  if (!c.systemQty) return Math.abs(countVariance(c)) > 0;
  return Math.abs(countVariance(c)) / Math.abs(c.systemQty) > pct;
}

export function productProfit(sales: Sale[], input: CostInput) {
  const map = new Map<string, { revenue: number; cogs: number; qty: number }>();
  for (const s of sales.filter(isPosted)) {
    const cur = map.get(s.product) ?? { revenue: 0, cogs: 0, qty: 0 };
    cur.revenue += saleFinal(s);
    cur.cogs += saleCogs(s, input);
    cur.qty += saleWeight(s);
    map.set(s.product, cur);
  }
  return [...map.entries()]
    .map(([product, v]) => ({ product, ...v, profit: v.revenue - v.cogs }))
    .sort((a, b) => b.profit - a.profit);
}

export function customerProfit(sales: Sale[], input: CostInput) {
  const map = new Map<string, { revenue: number; cogs: number; remain: number }>();
  for (const s of sales.filter(isPosted)) {
    const cur = map.get(s.customer) ?? { revenue: 0, cogs: 0, remain: 0 };
    cur.revenue += saleFinal(s);
    cur.cogs += saleCogs(s, input);
    cur.remain += Math.max(0, saleFinal(s) - (s.collected || 0));
    map.set(s.customer, cur);
  }
  return [...map.entries()]
    .map(([customer, v]) => ({ customer, ...v, profit: v.revenue - v.cogs }))
    .sort((a, b) => b.profit - a.profit);
}
