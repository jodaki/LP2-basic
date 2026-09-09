import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  Factory,
  LayoutDashboard,
  Package,
  Printer,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  UserCircle,
  Wallet,
  Warehouse,
} from "lucide-react";
import { MONTHS } from "@/lib/format";
import { useWorkshop } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "داشبورد", icon: LayoutDashboard },
  { to: "/purchases", label: "خرید", icon: ShoppingCart },
  { to: "/inventory", label: "انبار", icon: Warehouse },
  { to: "/production", label: "تولید", icon: Factory },
  { to: "/sales", label: "فروش", icon: Package },
  { to: "/customers", label: "مشتریان", icon: Users },
  { to: "/visits", label: "ویزیتور", icon: Truck },
  { to: "/expenses", label: "هزینه‌ها", icon: Wallet },
  { to: "/suppliers", label: "تأمین‌کنندگان", icon: ClipboardList },
  { to: "/employees", label: "کارکنان", icon: UserCircle },
  { to: "/forms", label: "فرم‌های چاپی", icon: Printer },
  { to: "/guide", label: "راهنما", icon: BookOpen },
  { to: "/settings", label: "تنظیمات", icon: Settings },
];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const settings = useWorkshop((s) => s.settings);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="no-print fixed inset-y-0 right-0 z-20 hidden w-60 border-l border-border bg-surface md:flex md:flex-col">
        <div className="border-b border-border px-5 py-5">
          <p className="text-[11px] font-medium tracking-wide text-fg-muted">کارگاه بسته‌بندی حبوبات</p>
          <h1 className="mt-1 font-display text-lg font-semibold leading-snug">پلدختر</h1>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "mb-0.5 flex h-11 items-center gap-2.5 rounded-[var(--radius-sm)] px-3 text-sm transition-colors duration-[var(--motion-quick)]",
                  active ? "bg-primary text-primary-foreground" : "text-fg-muted hover:bg-muted hover:text-fg",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border px-4 py-3 text-xs text-fg-muted">
          دوره گزارش: {MONTHS[settings.month - 1]} {settings.year}
        </div>
      </aside>

      <div className="md:pr-60">
        <header className="no-print sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-[11px] text-fg-muted">حبوبات پلدختر</p>
              <p className="text-sm font-semibold">سامانه مدیریت کارگاه</p>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto px-2 pb-2">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "h-9 shrink-0 rounded-full px-3 text-xs leading-9",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-fg-muted",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

export function PageTitle({
  title,
  hint,
  actions,
}: {
  title: string;
  hint?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
        {hint ? <p className="mt-1 max-w-2xl text-sm text-fg-muted">{hint}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
