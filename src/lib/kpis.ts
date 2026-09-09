import {
  finStockQty,
  isPosted,
  isStockPurchase,
  monthGrossNet,
  rawStockQty,
  packStockQty,
} from "./costing";
import { inMonth, packCount, purchaseTotal, saleFinal, saleRemain, saleWeight, wasteKg } from "./kpis-core";
import type {
  Customer,
  Expense,
  InvMove,
  KpiDef,
  Production,
  Purchase,
  Sale,
  Settings,
  StatusLight,
  Visit,
} from "./types";

export {
  inMonth,
  packCount,
  purchaseTotal,
  saleFinal,
  saleRemain,
  saleWeight,
  wasteKg,
  yieldPct,
} from "./kpis-core";

export function abcClass(total: number, settings: Settings) {
  if (total >= settings.abcA) return "A";
  if (total >= settings.abcB) return "B";
  return "C";
}

export function firstPurchase(name: string, sales: Sale[]) {
  const dates = sales.filter((s) => isPosted(s) && s.customer === name).map((s) => s.date).sort();
  return dates[0] ?? "";
}
export function lastPurchase(name: string, sales: Sale[]) {
  const dates = sales.filter((s) => isPosted(s) && s.customer === name).map((s) => s.date).sort();
  return dates[dates.length - 1] ?? "";
}
export function customerTotal(name: string, sales: Sale[]) {
  return sales.filter((s) => isPosted(s) && s.customer === name).reduce((a, s) => a + saleFinal(s), 0);
}

export function rawStock(product: string, purchases: Purchase[], production: Production[], moves: InvMove[]) {
  return rawStockQty(product, purchases, production, moves);
}

export function finStock(product: string, production: Production[], sales: Sale[], moves: InvMove[]) {
  return finStockQty(product, production, sales, moves);
}

export function packStock(product: string, packKg: number, production: Production[], sales: Sale[]) {
  return packStockQty(product, packKg, production, sales);
}

export function lightOf(value: number, def: KpiDef): StatusLight {
  if (def.direction === "info" || def.green == null || def.yellow == null) return "info";
  if (def.direction === "higher") {
    if (value >= def.green) return "ok";
    if (value >= def.yellow) return "watch";
    return "critical";
  }
  if (value <= def.green) return "ok";
  if (value <= def.yellow) return "watch";
  return "critical";
}

export type KpiResult = {
  key: string;
  name: string;
  value: number;
  unit: string;
  target: number | null;
  light: StatusLight;
  action: string;
};

export function computeKpis(input: {
  settings: Settings;
  purchases: Purchase[];
  production: Production[];
  sales: Sale[];
  customers: Customer[];
  visits: Visit[];
  expenses: Expense[];
  moves: InvMove[];
  kpiDefs: KpiDef[];
  products: string[];
}): KpiResult[] {
  const { settings, purchases, production, sales, customers, visits, expenses, moves, kpiDefs, products } = input;
  const y = settings.year;
  const m = settings.month;
  const postedSales = sales.filter(isPosted);
  const postedPurch = purchases.filter(isStockPurchase);
  const postedProd = production.filter(isPosted);
  const postedExp = expenses.filter(isPosted);
  const postedVis = visits.filter(isPosted);
  const monthSales = postedSales.filter((s) => inMonth(s.date, y, m));
  const monthPurch = postedPurch.filter((p) => inMonth(p.date, y, m));
  const monthProd = postedProd.filter((p) => inMonth(p.date, y, m));
  const monthExp = postedExp.filter((e) => inMonth(e.date, y, m));
  const monthVis = postedVis.filter((v) => inMonth(v.date, y, m));

  const salesDay = postedSales.filter((s) => s.date === settings.today).reduce((a, s) => a + saleFinal(s), 0);
  const pnl = monthGrossNet(sales, expenses, { settings, purchases, production, sales }, y, m);
  const purchasesMonth = monthPurch.reduce((a, p) => a + purchaseTotal(p), 0);
  const expensesMonth = monthExp.filter((e) => e.type !== "بسته‌بندی").reduce((a, e) => a + e.amount, 0);
  const raw = products.reduce((a, p) => a + rawStock(p, purchases, production, moves), 0);
  const fin = products.reduce((a, p) => a + finStock(p, production, sales, moves), 0);
  const prodKg = monthProd.reduce((a, p) => a + p.cleanKg, 0);
  const inKg = monthProd.reduce((a, p) => a + p.inputKg, 0);
  const waste = inKg ? monthProd.reduce((a, p) => a + wasteKg(p), 0) / inKg : 0;
  const orders = monthSales.length;
  const newCust = customers.filter((c) => inMonth(firstPurchase(c.name, sales), y, m)).length;
  const collected = monthSales.reduce((a, s) => a + (s.collected || 0), 0);
  const receivables = postedSales.reduce((a, s) => a + Math.max(0, saleRemain(s)), 0);
  const planned = monthVis.reduce((a, v) => a + v.planned, 0);
  const visited = monthVis.reduce((a, v) => a + v.visited, 0);
  const visOrders = monthVis.reduce((a, v) => a + v.orders, 0);
  const visitRate = planned ? visited / planned : 0;
  const conversion = visited ? visOrders / visited : 0;
  const monthAllPurch = purchases.filter((p) => !p.voided && inMonth(p.date, y, m));
  const accepted = monthAllPurch.filter((p) => p.qcResult === "قبول").length;
  const acceptRate = monthAllPurch.length ? accepted / monthAllPurch.length : 0;

  const values: Record<string, number> = {
    sales_day: salesDay,
    sales_month: pnl.revenue,
    gross_profit: pnl.gross,
    net_profit: pnl.net,
    purchases: purchasesMonth,
    raw_stock: raw,
    fin_stock: fin,
    production: prodKg,
    waste,
    orders,
    new_cust: newCust,
    collected,
    receivables,
    expenses: expensesMonth,
    visit_rate: visitRate,
    conversion,
    accept_rate: acceptRate,
  };

  const defs = kpiDefs.some((d) => d.key === "net_profit")
    ? kpiDefs
    : [
        ...kpiDefs.slice(0, 3),
        {
          key: "net_profit",
          name: "سود خالص",
          green: 8_000_000,
          yellow: 1_000_000,
          direction: "higher" as const,
          unit: "تومان",
          actionRed: "سود خالص منفی یا ناچیز است. بهای تمام‌شده و هزینه‌های عملیاتی را بازبینی کنید.",
          actionYellow: "سود خالص نازک شده؛ سربار و ضایعات را چک کنید.",
        },
        ...kpiDefs.slice(3),
      ];

  return defs.map((d) => {
    const value = values[d.key] ?? 0;
    const light = lightOf(value, d);
    const action = light === "critical" ? d.actionRed : light === "watch" ? d.actionYellow : "";
    return {
      key: d.key,
      name: d.name,
      value,
      unit: d.unit,
      target: d.green,
      light,
      action,
    };
  });
}

export function formatKpi(value: number, unit: string) {
  if (unit === "تومان") return new Intl.NumberFormat("fa-IR").format(Math.round(value));
  if (unit === "درصد") return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(value * 100) + "٪";
  if (unit === "کیلوگرم") return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(value);
  return new Intl.NumberFormat("fa-IR").format(value);
}
