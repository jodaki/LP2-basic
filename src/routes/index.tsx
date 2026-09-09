import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, ExternalLink, Printer } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, XAxis, YAxis } from "recharts";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shell";
import { Panel } from "@/components/journal";
import { MONTHS, toman } from "@/lib/format";
import { computeKpis, formatKpi, inMonth, saleFinal } from "@/lib/kpis";
import { PRODUCTS, useWorkshop } from "@/lib/store";
import type { StatusLight } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Dashboard });

const PIE = ["#2F4A32", "#4F6F52", "#7C8C5A", "#A3B18A", "#B7A48B", "#8A6D4A", "#5C4A32"];

function Dashboard() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const store = useWorkshop();
  const kpis = useMemo(
    () =>
      computeKpis({
        settings: store.settings,
        purchases: store.purchases,
        production: store.production,
        sales: store.sales,
        customers: store.customers,
        visits: store.visits,
        expenses: store.expenses,
        moves: store.moves,
        kpiDefs: store.kpiDefs,
        products: PRODUCTS,
      }),
    [store],
  );

  const critical = kpis.filter((k) => k.light === "critical");
  const watch = kpis.filter((k) => k.light === "watch");
  const banner: StatusLight = critical.length ? "critical" : watch.length ? "watch" : "ok";
  const bannerText =
    banner === "critical"
      ? `${critical.length} شاخص بحرانی — امروز اقدام کنید`
      : banner === "watch"
        ? `${watch.length} شاخص نیاز به بررسی دارد`
        : "همه شاخص‌های مهم مطلوب‌اند. کارگاه روی روال است.";

  const pieData = PRODUCTS.map((p) => ({
    name: p,
    value: store.sales
      .filter((s) => s.product === p && inMonth(s.date, store.settings.year, store.settings.month))
      .reduce((a, s) => a + saleFinal(s), 0),
  })).filter((d) => d.value > 0);

  const barData = PRODUCTS.map((p) => ({
    name: p.replace("لوبیا ", ""),
    kg: store.production
      .filter((x) => x.product === p && inMonth(x.date, store.settings.year, store.settings.month))
      .reduce((a, x) => a + x.cleanKg, 0),
  }));

  if (!ready) {
    return <p className="py-20 text-center text-sm text-fg-muted">در حال آماده‌سازی داشبورد…</p>;
  }

  return (
    <div>
      <PageTitle
        title="داشبورد مدیریتی"
        hint={`${store.settings.workshop} — ${MONTHS[store.settings.month - 1]} ${store.settings.year} — امروز ${store.settings.today}`}
        actions={
          <>
            <a href="/files/workshop.xlsx" download="سامانه-مدیریت-کارگاه-حبوبات-پلدختر.xlsx">
              <Button variant="secondary">
                <Download className="size-4" />
                فایل Excel
              </Button>
            </a>
            <a href="/files/formha-chapi-A4.pdf" download>
              <Button variant="secondary">
                <Printer className="size-4" />
                فرم‌های A4
              </Button>
            </a>
          </>
        }
      />

      <div
        className={cn(
          "mb-5 rounded-[var(--radius-lg)] px-4 py-4 text-center text-base font-semibold",
          banner === "critical" && "bg-bad-bg text-bad",
          banner === "watch" && "bg-warn-bg text-warn",
          banner === "ok" && "bg-ok-bg text-ok",
        )}
      >
        {bannerText}
      </div>

      <p className="mb-5 text-sm text-fg-muted">
        چرخه کار: ثبت اطلاعات → محاسبه KPI → این صفحه → تشخیص انحراف → اقدام اصلاحی. اگر چراغی قرمز نیست، دخالت لازم نیست.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <article key={k.key} className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm text-fg-muted">{k.name}</h3>
              <StatusBadge light={k.light} />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold tabular-nums leading-none">
              {formatKpi(k.value, k.unit)}
            </p>
            <p className="mt-2 text-xs text-fg-subtle">
              {k.unit}
              {k.target != null ? ` · هدف ${formatKpi(k.target, k.unit)}` : ""}
            </p>
            {k.action ? <p className="mt-3 text-xs leading-5 text-fg">{k.action}</p> : null}
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h3 className="mb-4 text-sm font-semibold">ترکیب فروش این ماه</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE[i % PIE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => toman(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-xs text-fg-muted">
            {pieData.map((d, i) => (
              <li key={d.name} className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ background: PIE[i % PIE.length] }} />
                {d.name}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <h3 className="mb-4 text-sm font-semibold">تولید این ماه (کیلو)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="kg" fill="#2F4A32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel className="mt-4">
        <h3 className="mb-3 text-sm font-semibold">فایل‌ها روی گوگل درایو</h3>
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap">
          <a
            className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 hover:bg-muted"
            href="https://drive.google.com/drive/folders/1gwnjZUn2pP7u7EqQvHdQdX3xm5VuFy8R"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="size-4" /> پوشه اصلی
          </a>
          <a
            className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 hover:bg-muted"
            href="https://docs.google.com/spreadsheets/d/18HdPBhiZurOtNoLM2jZJWtrPXc1ynmVzlmJpC1K7ipU/edit"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="size-4" /> گوگل‌شیت (قابل ویرایش)
          </a>
          <Link to="/forms" className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 hover:bg-muted">
            <Printer className="size-4" /> چاپ فرم‌های کاغذی
          </Link>
        </div>
      </Panel>
    </div>
  );
}
