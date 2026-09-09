export type StatusLight = "ok" | "watch" | "critical" | "info";

export type AccessRole =
  | "admin"
  | "purchasing"
  | "production"
  | "warehouse"
  | "sales"
  | "operator";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "revision";

export type QcResult = "قبول" | "رد" | "مشروط";

export type ApprovalFields = {
  approvalStatus: ApprovalStatus;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  reviewNote?: string;
  voided?: boolean;
};

export type Purchase = {
  id: string;
  date: string;
  supplier: string;
  product: string;
  kg: number;
  price: number;
  freight: number;
  quality: string;
  status: string;
  qcResult: QcResult;
  note: string;
} & ApprovalFields;

export type Production = {
  id: string;
  date: string;
  product: string;
  inputKg: number;
  cleanKg: number;
  packKg: number;
  operator: string;
  wasteReason: string;
  startTime: string;
  endTime: string;
  note: string;
} & ApprovalFields;

export type Sale = {
  id: string;
  date: string;
  customer: string;
  city: string;
  product: string;
  packKg: number;
  qty: number;
  unitPrice: number;
  discount: number;
  collected: number;
  seller: string;
  creditDays: number;
} & ApprovalFields;

export type Customer = {
  id: string;
  name: string;
  phone: string;
  city: string;
  address: string;
  type: string;
  lastVisit: string;
  status: string;
  note: string;
};

export type Visit = {
  id: string;
  date: string;
  region: string;
  planned: number;
  visited: number;
  orders: number;
  orderAmount: number;
  newCustomers: number;
  collected: number;
  km: number;
  fuel: number;
  visitor: string;
  note: string;
} & ApprovalFields;

export type Expense = {
  id: string;
  date: string;
  type: string;
  amount: number;
  payer: string;
  method: string;
  note: string;
} & ApprovalFields;

export type Supplier = {
  id: string;
  name: string;
  phone: string;
  city: string;
  product: string;
  price: number;
  quality: string;
  payTerms: string;
  days: number;
  scorePrice: number;
  scoreQuality: number;
  scoreDelivery: number;
  scoreStability: number;
  scorePay: number;
  status: string;
  note: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  accessRole: AccessRole;
  duties: string;
  salary: number;
  commissionRate: number;
  start: string;
  status: string;
  note: string;
  username?: string;
  userId?: string;
  hasLogin?: boolean;
};

export type InvMove = {
  id: string;
  date: string;
  kind: string;
  product: string;
  inn: number;
  out: number;
  unit: string;
  loc: string;
  reason: string;
} & ApprovalFields;

export type PhysicalCount = {
  id: string;
  date: string;
  kind: string;
  product: string;
  systemQty: number;
  actualQty: number;
  note: string;
} & ApprovalFields;

export type AuditEntry = {
  id: string;
  at: string;
  userId: string;
  userName: string;
  action: string;
  collection: string;
  recordId: string;
  summary: string;
};

export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  kind: string;
  href?: string;
  recordId?: string;
  read: boolean;
  createdAt: string;
};

export type KpiDef = {
  key: string;
  name: string;
  green: number | null;
  yellow: number | null;
  direction: "higher" | "lower" | "info";
  unit: string;
  actionRed: string;
  actionYellow: string;
};

export type Settings = {
  workshop: string;
  city: string;
  year: number;
  month: number;
  today: string;
  abcA: number;
  abcB: number;
  minRaw: number;
  minFin: number;
  reorderRaw: number;
  reorderFin: number;
  packingCost400: number;
  packingCost900: number;
  packingCost10: number;
  productionCostPerKg: number;
  overheadPerKg: number;
  yieldDefault: number;
  countVariancePct: number;
  creditDays: number;
};

export type SessionProfile = {
  userId: string;
  username: string;
  displayName: string;
  role: AccessRole;
  employeeId?: string;
  active: boolean;
  needsInvite?: boolean;
};

export type WorkshopDoc = {
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
  counts: PhysicalCount[];
  audit: AuditEntry[];
};

export type SensitiveCollection =
  | "purchases"
  | "production"
  | "sales"
  | "visits"
  | "expenses"
  | "moves"
  | "counts";
