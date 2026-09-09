export type StatusLight = "ok" | "watch" | "critical" | "info";

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
  note: string;
};

export type Production = {
  id: string;
  date: string;
  product: string;
  inputKg: number;
  cleanKg: number;
  packKg: number;
  operator: string;
  note: string;
};

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
};

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
  note: string;
};

export type Expense = {
  id: string;
  date: string;
  type: string;
  amount: number;
  payer: string;
  method: string;
  note: string;
};

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
  duties: string;
  salary: number;
  commissionRate: number;
  start: string;
  status: string;
  note: string;
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
};
