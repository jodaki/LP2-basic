import seed from "./seed.json";
import { autoApprove, inferAccessRole, qualityToQc } from "./access";
import { uid } from "./utils";
import type {
  AccessRole,
  ApprovalStatus,
  AuditEntry,
  Customer,
  Employee,
  Expense,
  InvMove,
  KpiDef,
  PhysicalCount,
  Production,
  Purchase,
  Sale,
  SensitiveCollection,
  SessionProfile,
  Settings,
  Supplier,
  Visit,
  WorkshopDoc,
} from "./types";

export const PRODUCTS = seed.products as string[];
export const PACKS = seed.packs as number[];
export const QUALITY = seed.lists.quality as string[];
export const APPROVAL = seed.lists.approval as string[];
export const CUST_TYPES = seed.lists.custTypes as string[];
export const EXPENSE_TYPES = seed.lists.expenseTypes as string[];
export const PAY_METHODS = seed.lists.payMethods as string[];
export const CITIES = seed.lists.cities as string[];
export const REGIONS = seed.lists.regions as string[];

export const DEFAULT_SETTINGS: Settings = {
  workshop: seed.meta.workshop,
  city: seed.meta.city,
  year: seed.meta.year,
  month: seed.meta.month,
  today: seed.meta.today,
  abcA: 20_000_000,
  abcB: 5_000_000,
  minRaw: 200,
  minFin: 80,
  reorderRaw: 90,
  reorderFin: 35,
  packingCost400: 2500,
  packingCost900: 3500,
  packingCost10: 8000,
  productionCostPerKg: 3000,
  overheadPerKg: 2000,
  yieldDefault: 0.95,
  countVariancePct: 0.03,
  creditDays: 30,
};

function withIds<T>(rows: T[]): (T & { id: string })[] {
  return rows.map((r) => ({ ...r, id: uid() }));
}

function postedStamp(role: AccessRole, name: string, userId: string, today: string) {
  const status = autoApprove(role);
  return {
    approvalStatus: status,
    submittedBy: userId,
    submittedByName: name,
    submittedAt: today,
    voided: false,
  };
}

function audit(
  actor: SessionProfile,
  action: string,
  collection: string,
  recordId: string,
  summary: string,
): AuditEntry {
  return {
    id: uid(),
    at: new Date().toISOString(),
    userId: actor.userId,
    userName: actor.displayName,
    action,
    collection,
    recordId,
    summary,
  };
}

function normalizePurchase(p: Partial<Purchase> & { product: string }): Purchase {
  const qc = p.qcResult ?? qualityToQc(p.quality ?? "خوب");
  return {
    id: p.id ?? uid(),
    date: p.date ?? DEFAULT_SETTINGS.today,
    supplier: p.supplier ?? "",
    product: p.product,
    kg: Number(p.kg) || 0,
    price: Number(p.price) || 0,
    freight: Number(p.freight) || 0,
    quality: p.quality ?? "خوب",
    status: p.status ?? (qc === "رد" ? "رد شده" : qc === "مشروط" ? "در انتظار" : "تأیید شده"),
    qcResult: qc,
    note: p.note ?? "",
    approvalStatus: (p.approvalStatus as ApprovalStatus) ?? "approved",
    submittedBy: p.submittedBy ?? "seed",
    submittedByName: p.submittedByName ?? "داده نمونه",
    submittedAt: p.submittedAt ?? p.date ?? DEFAULT_SETTINGS.today,
    reviewedBy: p.reviewedBy,
    reviewedByName: p.reviewedByName,
    reviewedAt: p.reviewedAt,
    reviewNote: p.reviewNote,
    voided: p.voided ?? false,
  };
}

function normalizeProduction(p: Partial<Production> & { product: string }): Production {
  return {
    id: p.id ?? uid(),
    date: p.date ?? DEFAULT_SETTINGS.today,
    product: p.product,
    inputKg: Number(p.inputKg) || 0,
    cleanKg: Number(p.cleanKg) || 0,
    packKg: Number(p.packKg) || 0.9,
    operator: p.operator ?? "",
    wasteReason: p.wasteReason || (Number(p.inputKg) - Number(p.cleanKg) > 0 ? "سنگ و ناخالصی" : ""),
    startTime: p.startTime ?? "08:00",
    endTime: p.endTime ?? "16:00",
    note: p.note ?? "",
    approvalStatus: (p.approvalStatus as ApprovalStatus) ?? "approved",
    submittedBy: p.submittedBy ?? "seed",
    submittedByName: p.submittedByName ?? "داده نمونه",
    submittedAt: p.submittedAt ?? p.date ?? DEFAULT_SETTINGS.today,
    voided: p.voided ?? false,
  };
}

function normalizeSale(s: Partial<Sale> & { customer: string }): Sale {
  return {
    id: s.id ?? uid(),
    date: s.date ?? DEFAULT_SETTINGS.today,
    customer: s.customer,
    city: s.city ?? "",
    product: s.product ?? "",
    packKg: Number(s.packKg) || 0.9,
    qty: Number(s.qty) || 0,
    unitPrice: Number(s.unitPrice) || 0,
    discount: Number(s.discount) || 0,
    collected: Number(s.collected) || 0,
    seller: s.seller ?? "",
    creditDays: Number(s.creditDays) || DEFAULT_SETTINGS.creditDays,
    approvalStatus: (s.approvalStatus as ApprovalStatus) ?? "approved",
    submittedBy: s.submittedBy ?? "seed",
    submittedByName: s.submittedByName ?? "داده نمونه",
    submittedAt: s.submittedAt ?? s.date ?? DEFAULT_SETTINGS.today,
    voided: s.voided ?? false,
  };
}

function normalizeVisit(v: Partial<Visit>): Visit {
  return {
    id: v.id ?? uid(),
    date: v.date ?? DEFAULT_SETTINGS.today,
    region: v.region ?? "",
    planned: Number(v.planned) || 0,
    visited: Number(v.visited) || 0,
    orders: Number(v.orders) || 0,
    orderAmount: Number(v.orderAmount) || 0,
    newCustomers: Number(v.newCustomers) || 0,
    collected: Number(v.collected) || 0,
    km: Number(v.km) || 0,
    fuel: Number(v.fuel) || 0,
    visitor: v.visitor ?? "",
    note: v.note ?? "",
    approvalStatus: (v.approvalStatus as ApprovalStatus) ?? "approved",
    submittedBy: v.submittedBy ?? "seed",
    submittedByName: v.submittedByName ?? "داده نمونه",
    submittedAt: v.submittedAt ?? v.date ?? DEFAULT_SETTINGS.today,
    voided: v.voided ?? false,
  };
}

function normalizeExpense(e: Partial<Expense>): Expense {
  return {
    id: e.id ?? uid(),
    date: e.date ?? DEFAULT_SETTINGS.today,
    type: e.type ?? "متفرقه",
    amount: Number(e.amount) || 0,
    payer: e.payer ?? "",
    method: e.method ?? "نقد",
    note: e.note ?? "",
    approvalStatus: (e.approvalStatus as ApprovalStatus) ?? "approved",
    submittedBy: e.submittedBy ?? "seed",
    submittedByName: e.submittedByName ?? "داده نمونه",
    submittedAt: e.submittedAt ?? e.date ?? DEFAULT_SETTINGS.today,
    voided: e.voided ?? false,
  };
}

function normalizeMove(m: Partial<InvMove>): InvMove {
  return {
    id: m.id ?? uid(),
    date: m.date ?? DEFAULT_SETTINGS.today,
    kind: m.kind ?? "مواد اولیه",
    product: m.product ?? "",
    inn: Number(m.inn) || 0,
    out: Number(m.out) || 0,
    unit: m.unit ?? "کیلوگرم",
    loc: m.loc ?? "",
    reason: m.reason ?? "",
    approvalStatus: (m.approvalStatus as ApprovalStatus) ?? "approved",
    submittedBy: m.submittedBy ?? "seed",
    submittedByName: m.submittedByName ?? "داده نمونه",
    submittedAt: m.submittedAt ?? m.date ?? DEFAULT_SETTINGS.today,
    voided: m.voided ?? false,
  };
}

function normalizeEmployee(e: Partial<Employee> & { name: string }): Employee {
  return {
    id: e.id ?? uid(),
    name: e.name,
    role: e.role ?? "",
    accessRole: e.accessRole ?? inferAccessRole(e.role ?? ""),
    duties: e.duties ?? "",
    salary: Number(e.salary) || 0,
    commissionRate: Number(e.commissionRate) || 0,
    start: e.start ?? "",
    status: e.status ?? "فعال",
    note: e.note ?? "",
    username: e.username,
    userId: e.userId,
    hasLogin: Boolean(e.hasLogin || e.userId),
  };
}

export function sampleDoc(): WorkshopDoc {
  return {
    settings: { ...DEFAULT_SETTINGS },
    kpiDefs: seed.kpis as KpiDef[],
    purchases: withIds(seed.purchases as Omit<Purchase, "id">[]).map(normalizePurchase),
    production: withIds(seed.production as Omit<Production, "id">[]).map(normalizeProduction),
    sales: withIds(seed.sales as Omit<Sale, "id">[]).map(normalizeSale),
    customers: withIds(seed.customers as Omit<Customer, "id">[]),
    visits: withIds(seed.visits as Omit<Visit, "id">[]).map(normalizeVisit),
    expenses: withIds(seed.expenses as Omit<Expense, "id">[]).map(normalizeExpense),
    suppliers: withIds(seed.suppliers as Omit<Supplier, "id">[]),
    employees: withIds(seed.employees as Omit<Employee, "id">[]).map(normalizeEmployee),
    moves: withIds(seed.inventoryMoves as Omit<InvMove, "id">[]).map(normalizeMove),
    counts: [],
    audit: [],
  };
}

export function emptyDoc(): WorkshopDoc {
  return {
    settings: { ...DEFAULT_SETTINGS },
    kpiDefs: seed.kpis as KpiDef[],
    purchases: [],
    production: [],
    sales: [],
    customers: [],
    visits: [],
    expenses: [],
    suppliers: [],
    employees: [],
    moves: [],
    counts: [],
    audit: [],
  };
}

export function normalizeDoc(raw: Partial<WorkshopDoc> | null | undefined): WorkshopDoc {
  const base = emptyDoc();
  if (!raw) return base;
  return {
    settings: { ...DEFAULT_SETTINGS, ...(raw.settings ?? {}) },
    kpiDefs: raw.kpiDefs?.length ? raw.kpiDefs : base.kpiDefs,
    purchases: (raw.purchases ?? []).map(normalizePurchase),
    production: (raw.production ?? []).map(normalizeProduction),
    sales: (raw.sales ?? []).map(normalizeSale),
    customers: raw.customers ?? [],
    visits: (raw.visits ?? []).map(normalizeVisit),
    expenses: (raw.expenses ?? []).map(normalizeExpense),
    suppliers: raw.suppliers ?? [],
    employees: (raw.employees ?? []).map((e) => normalizeEmployee(e as Employee)),
    moves: (raw.moves ?? []).map(normalizeMove),
    counts: raw.counts ?? [],
    audit: raw.audit ?? [],
  };
}

export type WorkshopMutation =
  | { type: "addPurchase"; row: Omit<Purchase, "id" | keyof ReturnType<typeof postedStamp>> & Partial<Purchase> }
  | { type: "addProduction"; row: Omit<Production, "id" | keyof ReturnType<typeof postedStamp>> & Partial<Production> }
  | { type: "addSale"; row: Omit<Sale, "id" | keyof ReturnType<typeof postedStamp>> & Partial<Sale> }
  | { type: "addVisit"; row: Omit<Visit, "id" | keyof ReturnType<typeof postedStamp>> & Partial<Visit> }
  | { type: "addExpense"; row: Omit<Expense, "id" | keyof ReturnType<typeof postedStamp>> & Partial<Expense> }
  | { type: "addMove"; row: Omit<InvMove, "id" | keyof ReturnType<typeof postedStamp>> & Partial<InvMove> }
  | { type: "addCount"; row: Omit<PhysicalCount, "id" | keyof ReturnType<typeof postedStamp>> & Partial<PhysicalCount> }
  | { type: "addCustomer"; row: Omit<Customer, "id"> }
  | { type: "addSupplier"; row: Omit<Supplier, "id"> }
  | { type: "addEmployee"; row: Omit<Employee, "id"> }
  | { type: "patchEmployee"; id: string; patch: Partial<Employee> }
  | { type: "setSettings"; patch: Partial<Settings> }
  | { type: "setKpiDef"; key: string; patch: Partial<KpiDef> }
  | {
      type: "review";
      collection: SensitiveCollection;
      id: string;
      decision: ApprovalStatus;
      note?: string;
    }
  | { type: "void"; collection: SensitiveCollection | "customers" | "suppliers" | "employees"; id: string }
  | { type: "resetSample" };

const SENSITIVE: SensitiveCollection[] = [
  "purchases",
  "production",
  "sales",
  "visits",
  "expenses",
  "moves",
  "counts",
];

function canWriteCollection(role: AccessRole, collection: string) {
  if (role === "admin") return true;
  if (collection === "purchases" || collection === "suppliers") return role === "purchasing";
  if (collection === "production") return role === "production" || role === "operator";
  if (collection === "moves" || collection === "counts") return role === "warehouse";
  if (collection === "sales" || collection === "customers" || collection === "visits") return role === "sales";
  return false;
}

export class WorkshopError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
    this.name = "WorkshopError";
  }
}

export type MutationResult = {
  doc: WorkshopDoc;
  notifyAdmins?: { title: string; body: string; href: string; recordId: string; kind: string };
};

export function applyMutation(doc: WorkshopDoc, mutation: WorkshopMutation, actor: SessionProfile): MutationResult {
  if (!actor.active) throw new WorkshopError("حساب شما غیرفعال است", 403);
  const today = doc.settings.today;
  const stamp = postedStamp(actor.role, actor.displayName, actor.userId, today);

  const pushAudit = (next: WorkshopDoc, action: string, collection: string, recordId: string, summary: string) => {
    next.audit = [audit(actor, action, collection, recordId, summary), ...next.audit].slice(0, 400);
  };

  const pendingNote = (title: string, body: string, href: string, recordId: string): MutationResult["notifyAdmins"] =>
    stamp.approvalStatus === "pending" ? { title, body, href, recordId, kind: "approval" } : undefined;

  switch (mutation.type) {
    case "addPurchase": {
      if (!canWriteCollection(actor.role, "purchases")) throw new WorkshopError("اجازه ثبت خرید ندارید", 403);
      const row = normalizePurchase({ ...mutation.row, ...stamp, id: uid() });
      const next = { ...doc, purchases: [row, ...doc.purchases] };
      pushAudit(next, "add", "purchases", row.id, `خرید ${row.product} ${row.kg} کیلو از ${row.supplier}`);
      return {
        doc: next,
        notifyAdmins: pendingNote("خرید جدید در انتظار تأیید", `${actor.displayName}: ${row.product} — ${row.kg} کیلو`, "/approvals", row.id),
      };
    }
    case "addProduction": {
      if (!canWriteCollection(actor.role, "production")) throw new WorkshopError("اجازه ثبت تولید ندارید", 403);
      const row = normalizeProduction({ ...mutation.row, ...stamp, id: uid() });
      const next = { ...doc, production: [row, ...doc.production] };
      pushAudit(next, "add", "production", row.id, `تولید ${row.product} ${row.cleanKg} کیلو`);
      return {
        doc: next,
        notifyAdmins: pendingNote("تولید در انتظار تأیید", `${actor.displayName}: ${row.product} — ${row.cleanKg} کیلو پاک‌شده`, "/approvals", row.id),
      };
    }
    case "addSale": {
      if (!canWriteCollection(actor.role, "sales")) throw new WorkshopError("اجازه ثبت فروش ندارید", 403);
      const row = normalizeSale({ ...mutation.row, ...stamp, id: uid() });
      const next = { ...doc, sales: [row, ...doc.sales] };
      pushAudit(next, "add", "sales", row.id, `فروش به ${row.customer}`);
      return {
        doc: next,
        notifyAdmins: pendingNote("فروش در انتظار تأیید", `${actor.displayName}: ${row.customer} — ${row.product}`, "/approvals", row.id),
      };
    }
    case "addVisit": {
      if (!canWriteCollection(actor.role, "visits")) throw new WorkshopError("اجازه ثبت ویزیت ندارید", 403);
      const needsApproval = (mutation.row.orders ?? 0) > 0 || actor.role !== "admin";
      const row = normalizeVisit({
        ...mutation.row,
        ...stamp,
        approvalStatus: needsApproval ? stamp.approvalStatus : "approved",
        id: uid(),
      });
      const next = { ...doc, visits: [row, ...doc.visits] };
      pushAudit(next, "add", "visits", row.id, `ویزیت ${row.region}`);
      return {
        doc: next,
        notifyAdmins: pendingNote("گزارش ویزیت در انتظار تأیید", `${actor.displayName}: ${row.region} — ${row.orders} سفارش`, "/approvals", row.id),
      };
    }
    case "addExpense": {
      if (!canWriteCollection(actor.role, "expenses")) throw new WorkshopError("اجازه ثبت هزینه ندارید", 403);
      const row = normalizeExpense({ ...mutation.row, ...stamp, id: uid() });
      const next = { ...doc, expenses: [row, ...doc.expenses] };
      pushAudit(next, "add", "expenses", row.id, `هزینه ${row.type}`);
      return {
        doc: next,
        notifyAdmins: pendingNote("هزینه در انتظار تأیید", `${actor.displayName}: ${row.type}`, "/approvals", row.id),
      };
    }
    case "addMove": {
      if (!canWriteCollection(actor.role, "moves")) throw new WorkshopError("اجازه ثبت حرکت انبار ندارید", 403);
      const row = normalizeMove({ ...mutation.row, ...stamp, id: uid() });
      const next = { ...doc, moves: [row, ...doc.moves] };
      pushAudit(next, "add", "moves", row.id, `حرکت انبار ${row.product}`);
      return {
        doc: next,
        notifyAdmins: pendingNote("حرکت انبار در انتظار تأیید", `${actor.displayName}: ${row.kind} ${row.product}`, "/approvals", row.id),
      };
    }
    case "addCount": {
      if (!canWriteCollection(actor.role, "counts")) throw new WorkshopError("اجازه ثبت شمارش ندارید", 403);
      const row: PhysicalCount = {
        id: uid(),
        date: mutation.row.date ?? today,
        kind: mutation.row.kind ?? "مواد اولیه",
        product: mutation.row.product ?? "",
        systemQty: Number(mutation.row.systemQty) || 0,
        actualQty: Number(mutation.row.actualQty) || 0,
        note: mutation.row.note ?? "",
        ...stamp,
      };
      const next = { ...doc, counts: [row, ...doc.counts] };
      pushAudit(next, "add", "counts", row.id, `شمارش ${row.product}`);
      return {
        doc: next,
        notifyAdmins: pendingNote("شمارش موجودی در انتظار تأیید", `${actor.displayName}: ${row.product}`, "/approvals", row.id),
      };
    }
    case "addCustomer": {
      if (!canWriteCollection(actor.role, "customers")) throw new WorkshopError("اجازه ثبت مشتری ندارید", 403);
      const row = { ...mutation.row, id: uid() };
      const next = { ...doc, customers: [row, ...doc.customers] };
      pushAudit(next, "add", "customers", row.id, `مشتری ${row.name}`);
      return { doc: next };
    }
    case "addSupplier": {
      if (!canWriteCollection(actor.role, "suppliers")) throw new WorkshopError("اجازه ثبت تأمین‌کننده ندارید", 403);
      const row = { ...mutation.row, id: uid() };
      const next = { ...doc, suppliers: [row, ...doc.suppliers] };
      pushAudit(next, "add", "suppliers", row.id, `تأمین‌کننده ${row.name}`);
      return { doc: next };
    }
    case "addEmployee": {
      if (actor.role !== "admin") throw new WorkshopError("فقط مدیر می‌تواند نیرو اضافه کند", 403);
      const row = normalizeEmployee({ ...mutation.row, id: uid() });
      const next = { ...doc, employees: [row, ...doc.employees] };
      pushAudit(next, "add", "employees", row.id, `کارمند ${row.name}`);
      return { doc: next };
    }
    case "patchEmployee": {
      if (actor.role !== "admin") throw new WorkshopError("فقط مدیر می‌تواند کارمند را ویرایش کند", 403);
      const next = {
        ...doc,
        employees: doc.employees.map((e) => (e.id === mutation.id ? { ...e, ...mutation.patch } : e)),
      };
      pushAudit(next, "patch", "employees", mutation.id, "ویرایش کارمند");
      return { doc: next };
    }
    case "setSettings": {
      if (actor.role !== "admin") throw new WorkshopError("فقط مدیر تنظیمات را تغییر می‌دهد", 403);
      const next = { ...doc, settings: { ...doc.settings, ...mutation.patch } };
      pushAudit(next, "settings", "settings", "settings", "تغییر تنظیمات");
      return { doc: next };
    }
    case "setKpiDef": {
      if (actor.role !== "admin") throw new WorkshopError("فقط مدیر اهداف را تغییر می‌دهد", 403);
      const next = {
        ...doc,
        kpiDefs: doc.kpiDefs.map((k) => (k.key === mutation.key ? { ...k, ...mutation.patch } : k)),
      };
      pushAudit(next, "kpi", "kpiDefs", mutation.key, `هدف ${mutation.key}`);
      return { doc: next };
    }
    case "review": {
      if (actor.role !== "admin") throw new WorkshopError("فقط مدیر کل می‌تواند تأیید کند", 403);
      if (!SENSITIVE.includes(mutation.collection)) throw new WorkshopError("این مورد تأییدپذیر نیست");
      const list = doc[mutation.collection] as { id: string; approvalStatus: ApprovalStatus }[];
      const found = list.find((r) => r.id === mutation.id);
      if (!found) throw new WorkshopError("رکورد پیدا نشد");
      const next = {
        ...doc,
        [mutation.collection]: list.map((r) =>
          r.id === mutation.id
            ? {
                ...r,
                approvalStatus: mutation.decision,
                reviewedBy: actor.userId,
                reviewedByName: actor.displayName,
                reviewedAt: today,
                reviewNote: mutation.note ?? "",
              }
            : r,
        ),
      } as WorkshopDoc;
      const label =
        mutation.decision === "approved" ? "تأیید" : mutation.decision === "rejected" ? "رد" : "درخواست اصلاح";
      pushAudit(next, "review", mutation.collection, mutation.id, label);
      return { doc: next };
    }
    case "void": {
      const collection = mutation.collection;
      if (collection === "customers" || collection === "suppliers" || collection === "employees") {
        if (actor.role !== "admin") throw new WorkshopError("لغو این مورد فقط با مدیر است", 403);
        const next = {
          ...doc,
          [collection]: (doc[collection] as { id: string }[]).filter((r) => r.id !== mutation.id),
        } as WorkshopDoc;
        pushAudit(next, "void", collection, mutation.id, "حذف مرجع (غیرتراکنشی)");
        return { doc: next };
      }
      const list = doc[collection] as { id: string; submittedBy?: string; approvalStatus?: string; voided?: boolean }[];
      const found = list.find((r) => r.id === mutation.id);
      if (!found) throw new WorkshopError("رکورد پیدا نشد");
      const ownPending = found.submittedBy === actor.userId && found.approvalStatus === "pending";
      if (actor.role !== "admin" && !ownPending) throw new WorkshopError("اجازه لغو این رکورد را ندارید", 403);
      const next = {
        ...doc,
        [collection]: list.map((r) => (r.id === mutation.id ? { ...r, voided: true } : r)),
      } as WorkshopDoc;
      pushAudit(next, "void", collection, mutation.id, "لغو / ابطال");
      return { doc: next };
    }
    case "resetSample": {
      if (actor.role !== "admin") throw new WorkshopError("بازنشانی فقط با مدیر است", 403);
      const next = sampleDoc();
      pushAudit(next, "reset", "workshop", "all", "بازگشت به داده نمونه");
      return { doc: next };
    }
    default:
      throw new WorkshopError("عملیات نامعتبر");
  }
}

export function pendingItems(doc: WorkshopDoc) {
  const out: {
    collection: SensitiveCollection;
    id: string;
    date: string;
    title: string;
    who: string;
    note: string;
    approvalStatus: ApprovalStatus;
  }[] = [];
  const take = (collection: SensitiveCollection, title: (r: Record<string, unknown>) => string) => {
    for (const r of doc[collection] as (ApprovalLike & Record<string, unknown>)[]) {
      if (r.voided) continue;
      if (r.approvalStatus === "pending" || r.approvalStatus === "revision") {
        out.push({
          collection,
          id: r.id,
          date: String(r.date ?? r.submittedAt ?? ""),
          title: title(r),
          who: r.submittedByName,
          note: String(r.note ?? r.reviewNote ?? ""),
          approvalStatus: r.approvalStatus,
        });
      }
    }
  };
  take("purchases", (r) => `خرید ${r.product} — ${r.kg} کیلو از ${r.supplier}`);
  take("production", (r) => `تولید ${r.product} — ${r.cleanKg} کیلو`);
  take("sales", (r) => `فروش به ${r.customer} — ${r.product}`);
  take("visits", (r) => `ویزیت ${r.region} — ${r.orders} سفارش`);
  take("expenses", (r) => `هزینه ${r.type}`);
  take("moves", (r) => `حرکت انبار ${r.kind} ${r.product}`);
  take("counts", (r) => `شمارش ${r.kind} ${r.product}`);
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

type ApprovalLike = {
  id: string;
  voided?: boolean;
  approvalStatus: ApprovalStatus;
  submittedByName: string;
  submittedAt?: string;
  date?: string;
  note?: string;
  reviewNote?: string;
};

export const COLLECTION_LABEL: Record<SensitiveCollection, string> = {
  purchases: "خرید",
  production: "تولید",
  sales: "فروش",
  visits: "ویزیت",
  expenses: "هزینه",
  moves: "انبار",
  counts: "شمارش",
};
