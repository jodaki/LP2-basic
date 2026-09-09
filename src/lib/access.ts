import type { AccessRole, ApprovalStatus } from "./types";

export const ACCESS_ROLES: { id: AccessRole; label: string; hint: string }[] = [
  { id: "admin", label: "مدیر کل", hint: "دسترسی کامل + تأیید همه تراکنش‌ها" },
  { id: "purchasing", label: "خرید", hint: "خرید مواد و تأمین‌کنندگان" },
  { id: "production", label: "تولید", hint: "تولید، کنترل کیفیت، ضایعات" },
  { id: "warehouse", label: "انبار", hint: "ورود، خروج، شمارش موجودی" },
  { id: "sales", label: "فروش / ویزیتور", hint: "مشتریان، ویزیت، سفارش، وصول" },
  { id: "operator", label: "کارگر", hint: "فقط فرم کار خودش — بدون اطلاعات مالی" },
];

export const ROLE_LABEL: Record<AccessRole, string> = Object.fromEntries(
  ACCESS_ROLES.map((r) => [r.id, r.label]),
) as Record<AccessRole, string>;

export function inferAccessRole(job: string): AccessRole {
  if (/مدیر|مالک|حسابدار/.test(job)) return "admin";
  if (/انبار/.test(job)) return "warehouse";
  if (/ویزیت|فروش/.test(job)) return "sales";
  if (/خرید/.test(job)) return "purchasing";
  if (/کمک|کارگر|پاک/.test(job)) return "operator";
  if (/تولید|بسته‌/.test(job)) return "production";
  return "operator";
}

export type NavItem = {
  to: string;
  label: string;
  roles: AccessRole[];
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "داشبورد", roles: ["admin", "purchasing", "production", "warehouse", "sales"] },
  { to: "/work", label: "کار من", roles: ["operator", "production", "warehouse"] },
  { to: "/approvals", label: "درخواست‌های تأیید", roles: ["admin"] },
  { to: "/purchases", label: "خرید", roles: ["admin", "purchasing"] },
  { to: "/inventory", label: "انبار", roles: ["admin", "warehouse"] },
  { to: "/production", label: "تولید", roles: ["admin", "production", "operator"] },
  { to: "/sales", label: "فروش", roles: ["admin", "sales"] },
  { to: "/customers", label: "مشتریان", roles: ["admin", "sales"] },
  { to: "/visits", label: "ویزیتور", roles: ["admin", "sales"] },
  { to: "/expenses", label: "هزینه‌ها", roles: ["admin"] },
  { to: "/suppliers", label: "تأمین‌کنندگان", roles: ["admin", "purchasing"] },
  { to: "/costs", label: "بهای تمام‌شده", roles: ["admin"] },
  { to: "/employees", label: "کارکنان", roles: ["admin"] },
  { to: "/forms", label: "فرم‌های چاپی", roles: ["admin", "purchasing", "production", "warehouse", "sales"] },
  { to: "/guide", label: "راهنما", roles: ["admin"] },
  { to: "/settings", label: "تنظیمات", roles: ["admin"] },
];

export function navFor(role: AccessRole) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function canOpen(role: AccessRole, path: string) {
  if (path === "/login") return true;
  if (path.startsWith("/forms/")) {
    return NAV_ITEMS.find((n) => n.to === "/forms")?.roles.includes(role) ?? false;
  }
  const exact = NAV_ITEMS.find((n) => n.to === path);
  if (exact) return exact.roles.includes(role);
  return NAV_ITEMS.some((n) => n.to !== "/" && path.startsWith(n.to) && n.roles.includes(role));
}

export function homeFor(role: AccessRole) {
  if (role === "operator") return "/work";
  return "/";
}

export function canSeeFinance(role: AccessRole) {
  return role === "admin";
}

export function canSeeReceivables(role: AccessRole) {
  return role === "admin" || role === "sales";
}

export function canWrite(
  role: AccessRole,
  collection:
    | "purchases"
    | "production"
    | "sales"
    | "customers"
    | "visits"
    | "expenses"
    | "suppliers"
    | "employees"
    | "moves"
    | "counts"
    | "settings"
    | "approvals",
) {
  if (role === "admin") return true;
  switch (collection) {
    case "purchases":
    case "suppliers":
      return role === "purchasing";
    case "production":
      return role === "production" || role === "operator";
    case "moves":
    case "counts":
      return role === "warehouse";
    case "sales":
    case "customers":
    case "visits":
      return role === "sales";
    default:
      return false;
  }
}

export function autoApprove(role: AccessRole): ApprovalStatus {
  return role === "admin" ? "approved" : "pending";
}

export const APPROVAL_LABEL: Record<ApprovalStatus, string> = {
  pending: "در انتظار تأیید",
  approved: "تأیید شده",
  rejected: "رد شده",
  revision: "نیاز به اصلاح",
};

export const WASTE_REASONS = [
  "سنگ و ناخالصی",
  "دانه‌های شکسته",
  "کپک و رطوبت",
  "خطای بسته‌بندی",
  "ریخت‌وپاش خط",
  "نمونه کنترل کیفیت",
  "سایر",
];

export const QC_RESULTS: Qc[] = ["قبول", "رد", "مشروط"];
type Qc = "قبول" | "رد" | "مشروط";

export function qualityToQc(quality: string): Qc {
  if (quality === "ضعیف") return "رد";
  if (quality === "متوسط") return "مشروط";
  return "قبول";
}

export const USERNAME_DOMAIN = "@poldokhtar.ir";

export function usernameToEmail(username: string) {
  const clean = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  return `${clean}${USERNAME_DOMAIN}`;
}

export function emailToUsername(email: string | null | undefined) {
  if (!email) return "";
  if (email.endsWith(USERNAME_DOMAIN)) return email.slice(0, -USERNAME_DOMAIN.length);
  return email.split("@")[0] ?? email;
}
