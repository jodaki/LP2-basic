import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
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
  BadgeCheck,
  Calculator,
  Hammer,
} from "lucide-react";
import { MONTHS } from "@/lib/format";
import { useWorkshop } from "@/lib/store";
import { cn } from "@/lib/utils";
import { navFor } from "@/lib/access";
import { UserButton } from "@/lib/auth/gates";
import { useSessionProfile } from "@/lib/session";
import { pendingItems } from "@/lib/workshop-data";

const ICONS: Record<string, typeof LayoutDashboard> = {
  "/": LayoutDashboard,
  "/work": Hammer,
  "/approvals": BadgeCheck,
  "/purchases": ShoppingCart,
  "/inventory": Warehouse,
  "/production": Factory,
  "/sales": Package,
  "/customers": Users,
  "/visits": Truck,
  "/expenses": Wallet,
  "/suppliers": ClipboardList,
  "/costs": Calculator,
  "/employees": UserCircle,
  "/forms": Printer,
  "/guide": BookOpen,
  "/settings": Settings,
};

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const settings = useWorkshop((s) => s.settings);
  const { profile, unread, notifications, markRead } = useSessionProfile();
  const pendingCount = pendingItems(useWorkshop()).length;
  const nav = navFor(profile.role);
  const [openNotes, setOpenNotes] = useState(false);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="no-print fixed inset-y-0 right-0 z-20 hidden w-60 border-l border-border bg-surface md:flex md:flex-col">
        <div className="border-b border-border px-5 py-5">
          <p className="text-[11px] font-medium tracking-wide text-fg-muted">کارگاه بسته‌بندی حبوبات</p>
          <h1 className="mt-1 font-display text-lg font-semibold leading-snug">پلدختر</h1>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {nav.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = ICONS[item.to] ?? LayoutDashboard;
            const badge = item.to === "/approvals" ? pendingCount : 0;
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
                <span className="flex-1">{item.label}</span>
                {badge > 0 ? (
                  <span className="grid min-w-5 place-items-center rounded-full bg-bad px-1.5 text-[10px] text-white">
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border px-3 py-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            {profile.role === "admin" ? (
              <button
                type="button"
                onClick={() => {
                  setOpenNotes((v) => !v);
                  void markRead();
                }}
                className="relative grid size-10 place-items-center rounded-[var(--radius-sm)] hover:bg-muted"
                aria-label="اعلان‌ها"
              >
                <Bell className="size-4" />
                {unread > 0 ? (
                  <span className="absolute left-1 top-1 size-2 rounded-full bg-bad" />
                ) : null}
              </button>
            ) : (
              <span />
            )}
          </div>
          {openNotes ? (
            <ul className="mb-2 max-h-48 overflow-y-auto text-xs">
              {notifications.length === 0 ? (
                <li className="px-1 py-2 text-fg-subtle">اعلان تازه‌ای نیست.</li>
              ) : (
                notifications.slice(0, 8).map((n) => (
                  <li key={n.id} className="border-b border-border py-2">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-fg-muted">{n.body}</p>
                  </li>
                ))
              )}
            </ul>
          ) : null}
          <div className="text-[11px] text-fg-muted">
            <UserButton />
          </div>
          <p className="mt-2 text-[11px] text-fg-subtle">
            دوره گزارش: {MONTHS[settings.month - 1]} {settings.year}
          </p>
        </div>
      </aside>

      <div className="md:pr-60">
        <header className="no-print sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-[11px] text-fg-muted">حبوبات پلدختر</p>
              <p className="text-sm font-semibold">سامانه مدیریت کارگاه</p>
            </div>
            <UserButton />
          </div>
          <div className="flex gap-1 overflow-x-auto px-2 pb-2">
            {nav.map((item) => {
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
                  {item.to === "/approvals" && pendingCount > 0 ? ` (${pendingCount})` : ""}
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
