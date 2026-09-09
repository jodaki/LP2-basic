import { create } from "zustand";
import { persist } from "zustand/middleware";
import seed from "./seed.json";
import { uid } from "./utils";
import type {
  Customer,
  Employee,
  Expense,
  InvMove,
  KpiDef,
  Production,
  Purchase,
  Sale,
  Settings,
  Supplier,
  Visit,
} from "./types";

const lists = seed.lists;

export const PRODUCTS = seed.products as string[];
export const PACKS = seed.packs as number[];
export const QUALITY = lists.quality;
export const APPROVAL = lists.approval;
export const CUST_TYPES = lists.custTypes;
export const EXPENSE_TYPES = lists.expenseTypes;
export const PAY_METHODS = lists.payMethods;
export const CITIES = lists.cities;
export const REGIONS = lists.regions;

function withIds<T>(rows: T[]): (T & { id: string })[] {
  return rows.map((r) => ({ ...r, id: uid() }));
}

const initialSettings: Settings = {
  workshop: seed.meta.workshop,
  city: seed.meta.city,
  year: seed.meta.year,
  month: seed.meta.month,
  today: seed.meta.today,
  abcA: 20_000_000,
  abcB: 5_000_000,
  minRaw: 200,
  minFin: 80,
};

export type WorkshopState = {
  settings: Settings;
  kpiDefs: KpiDef[];
  purchases: Purchase[];
  production: Production[];
  sales: Sale[];
  customers: Customer[];
  visits: Visit[];
  expenses: Expense[];
  suppliers: Supplier[];
  employees: Employee[];
  moves: InvMove[];
  setSettings: (p: Partial<Settings>) => void;
  setKpiDef: (key: string, patch: Partial<KpiDef>) => void;
  addPurchase: (row: Omit<Purchase, "id">) => void;
  addProduction: (row: Omit<Production, "id">) => void;
  addSale: (row: Omit<Sale, "id">) => void;
  addCustomer: (row: Omit<Customer, "id">) => void;
  addVisit: (row: Omit<Visit, "id">) => void;
  addExpense: (row: Omit<Expense, "id">) => void;
  addSupplier: (row: Omit<Supplier, "id">) => void;
  addEmployee: (row: Omit<Employee, "id">) => void;
  addMove: (row: Omit<InvMove, "id">) => void;
  remove: (collection: keyof Pick<WorkshopState, "purchases" | "production" | "sales" | "customers" | "visits" | "expenses" | "suppliers" | "employees" | "moves">, id: string) => void;
  resetSample: () => void;
};

function sample(): Pick<
  WorkshopState,
  | "settings"
  | "kpiDefs"
  | "purchases"
  | "production"
  | "sales"
  | "customers"
  | "visits"
  | "expenses"
  | "suppliers"
  | "employees"
  | "moves"
> {
  return {
    settings: { ...initialSettings },
    kpiDefs: seed.kpis as KpiDef[],
    purchases: withIds(seed.purchases as Omit<Purchase, "id">[]),
    production: withIds(seed.production as Omit<Production, "id">[]),
    sales: withIds(seed.sales as Omit<Sale, "id">[]),
    customers: withIds(seed.customers as Omit<Customer, "id">[]),
    visits: withIds(seed.visits as Omit<Visit, "id">[]),
    expenses: withIds(seed.expenses as Omit<Expense, "id">[]),
    suppliers: withIds(seed.suppliers as Omit<Supplier, "id">[]),
    employees: withIds(seed.employees as Omit<Employee, "id">[]),
    moves: withIds(seed.inventoryMoves as Omit<InvMove, "id">[]),
  };
}

export const useWorkshop = create<WorkshopState>()(
  persist(
    (set) => ({
      ...sample(),
      setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      setKpiDef: (key, patch) =>
        set((s) => ({
          kpiDefs: s.kpiDefs.map((k) => (k.key === key ? { ...k, ...patch } : k)),
        })),
      addPurchase: (row) => set((s) => ({ purchases: [{ id: uid(), ...row }, ...s.purchases] })),
      addProduction: (row) => set((s) => ({ production: [{ id: uid(), ...row }, ...s.production] })),
      addSale: (row) => set((s) => ({ sales: [{ id: uid(), ...row }, ...s.sales] })),
      addCustomer: (row) => set((s) => ({ customers: [{ id: uid(), ...row }, ...s.customers] })),
      addVisit: (row) => set((s) => ({ visits: [{ id: uid(), ...row }, ...s.visits] })),
      addExpense: (row) => set((s) => ({ expenses: [{ id: uid(), ...row }, ...s.expenses] })),
      addSupplier: (row) => set((s) => ({ suppliers: [{ id: uid(), ...row }, ...s.suppliers] })),
      addEmployee: (row) => set((s) => ({ employees: [{ id: uid(), ...row }, ...s.employees] })),
      addMove: (row) => set((s) => ({ moves: [{ id: uid(), ...row }, ...s.moves] })),
      remove: (collection, id) =>
        set((s) => ({
          [collection]: (s[collection] as { id: string }[]).filter((r) => r.id !== id),
        })),
      resetSample: () => set(sample()),
    }),
    { name: "poldokhtar-workshop-v1" },
  ),
);
