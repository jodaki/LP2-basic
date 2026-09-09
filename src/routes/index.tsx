import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Bar, BarChart, XAxis, YAxis } from "recharts";
import { StatusBadge } from "@/components/ui/badge";
import { PageTitle } from "@/components/shell";
import { Panel } from "@/components/journal";
import { MONTHS, num, pct, toman } from "@/lib/format";
import { computeKpis, formatKpi, inMonth, saleFinal, saleRemain, wasteKg } from "@/lib/kpis";
import { PRODUCTS, useWorkshop } from "@/lib/store";
import type { StatusLight } from "@/lib/types";
import { cn } from "@/lib/utils";
import { canSeeFinance, canSeeReceivables } from "@/lib/access";
import { useSessionProfile } from "@/lib/session";
import {
  countAlert,
  customerProfit,
  isPosted,
  monthGrossNet,
  productProfit,
  rawStockQty,
  stockLight,
  supplierScore100,
  wasteByReason,
} from "@/lib/costing";
import { pendingItems } from "@/lib/workshop-data";

export const Route = createFileRoute("/")({ component: Dashboard });

const PIE = ["#2F4A32", "#4F6F52", "#7C8C5A", "#A3B18A", "#B7A48B", "#8A6D4A", "#5C4A32"];

function Dashboard() {
  const store = useWorkshop();
  const { profile } = useSessionProfile();
  const finance = canSeeFinance(profile.role);
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

  const visible = kpis.filter((k) => {
    if (!finance && (k.key === "gross_profit" || k.key === "net_profit" || k.key === "expenses")) return false;
    if (!canSeeReceivables(profile.role) && (k.key === "receivables" || k.key === "collected")) return false;
    if (profile.role === "purchasing" && ["visit_rate", "conversion", "production", "waste"].includes(k.key)) return false;
    if (profile.role === "production" && ["receivables", "collected", "visit_rate", "conversion", "purchases"].includes(k.key)) return false;
    if (profile.role === "warehouse" && ["visit_rate", "conversion", "gross_profit", "net_profit"].includes(k.key)) return false;
    if (profile.role === "sales" && ["purchases", "accept_rate", "waste", "production"].includes(k.key)) return false;
    return true;
  });

  const critical = visible.filter((k) => k.light === "critical");
  const watch = visible.filter((k) => k.light === "watch");
  const banner: StatusLight = critical.length ? "critical" : watch.length ? "watch" : "ok";
  const pending = pendingItems(store);
  const bannerText =
    pending.length && profile.role === "admin"
      ? `${pending.length} درخواست تأیید مانده — ${critical.length ? `${critical.length} شاخص بحرانی` : "بعد از تأیید، شاخص‌ها به‌روز می‌شوند"}`
      : banner === "critical"
        ? `${critical.length} شاخص بحرانی — امروز اقدام کنید`
        : banner === "watch"
          ? `${watch.length} شاخص نیاز به بررسی دارد`
          : "همه شاخص‌های مهم مطلوب‌اند. کارگاه روی روال است.";

  const pieData = PRODUCTS.map((p) => ({
    name: p,
    value: store.sales
      .filter((s) => isPosted(s) && s.product === p && inMonth(s.date, store.settings.year, store.settings.month))
      .reduce((a, s) => a + saleFinal(s), 0),
  })).filter((d) => d.value > 0);

  const barData = PRODUCTS.map((p) => ({
    name: p.replace("لوبیا ", ""),
    kg: store.production
      .filter((x) => isPosted(x) && x.product === p && inMonth(x.date, store.settings.year, store.settings.month))
      .reduce((a, x) => a + x.cleanKg, 0),
  }));

  const costInput = {
    settings: store.settings,
    purchases: store.purchases,
    production: store.production,
    sales: store.sales,
  };
  const pnl = monthGrossNet(store.sales, store.expenses, costInput, store.settings.year, store.settings.month);
  const prodProf = productProfit(store.sales, costInput);
  const custProf = customerProfit(store.sales, costInput);
  const waste = wasteByReason(store.production);
  const rankedSup = [...store.suppliers]
    .map((s) => ({ name: s.name, ...supplierScore100(s, store.purchases) }))
    .sort((a, b) => b.score - a.score);
  const todaySales = store.sales.filter((s) => isPosted(s) && s.date === store.settings.today).reduce((a, s) => a + saleFinal(s), 0);
  const todayProd = store.production.filter((p) => isPosted(p) && p.date === store.settings.today);
  const todayWaste = todayProd.reduce((a, p) => a + wasteKg(p), 0);
  const todayIn = todayProd.reduce((a, p) => a + p.inputKg, 0);
  const rawTotal = PRODUCTS.reduce((a, p) => a + rawStockQty(p, store.purchases, store.production, store.moves), 0);
  const buySoon = PRODUCTS.filter((p) => {
    const q = rawStockQty(p, store.purchases, store.production, store.moves);
    return stockLight(q, store.settings.minRaw / PRODUCTS.length, store.settings.reorderRaw / PRODUCTS.length) !== "ok";
  });
  const visitMonth = store.visits.filter((v) => isPosted(v) && inMonth(v.date, store.settings.year, store.settings.month));
  const visitPerf = visitMonth.reduce((a, v) => a + v.orderAmount, 0);
  const visitRate = (() => {
    const pl = visitMonth.reduce((a, v) => a + v.planned, 0);
    const vis = visitMonth.reduce((a, v) => a + v.visited, 0);
    return pl ? vis / pl : 0;
  })();
  const recv = store.sales.filter(isPosted).reduce((a, s) => a + Math.max(0, saleRemain(s)), 0);
  const countAlerts = store.counts.filter((c) => !c.voided && countAlert(c, store.settings.countVariancePct));
  const topProblem =
    critical[0]?.name ??
    (pending.length ? "درخواست‌های تأیید نشده" : watch[0]?.name ?? (countAlerts.length ? "مغایرت شمارش موجودی" : "مشکل باز مهمی نیست"));
  const owner =
    topProblem.includes("ویزیت") || topProblem.includes("سفارش") || topProblem.includes("فروش")
      ? "ویزیتور"
      : topProblem.includes("ضایعات") || topProblem.includes("تولید")
        ? "مسئول تولید"
        : topProblem.includes("موجودی") || topProblem.includes("مواد")
          ? "مسئول انبار / خرید"
          : topProblem.includes("تأیید")
            ? "مدیر کل"
            : "مدیر کل";
  const prevOpen = store.audit.find((a) => a.action === "review" && a.summary === "تأیید");

  const answers = [
    { q: "امروز چقدر فروختیم؟", a: toman(todaySales) },
    { q: "چقدر واقعاً سود کردیم؟", a: finance ? `${toman(pnl.net)} خالص · ${toman(pnl.gross)} ناخالص` : "فقط مدیر" },
    { q: "کدام محصول سود بیشتری دارد؟", a: finance && prodProf[0] ? `${prodProf[0].product} — ${toman(prodProf[0].profit)}` : "—" },
    { q: "چقدر از مشتریان طلب داریم؟", a: toman(recv) },
    { q: "موجودی مواد اولیه چقدر است؟", a: `${num(rawTotal, 1)} کیلو` },
    { q: "چه زمانی باید خرید کنیم؟", a: buySoon.length ? `الان: ${buySoon.join("، ")}` : "الان ضروری نیست" },
    { q: "کدام تأمین‌کننده بهتر است؟", a: rankedSup[0] ? `${rankedSup[0].name} — ${num(rankedSup[0].score, 0)} از ۱۰۰` : "—" },
    { q: "امروز چقدر تولید کردیم؟", a: `${num(todayProd.reduce((a, p) => a + p.cleanKg, 0), 1)} کیلو سالم` },
    { q: "چند درصد تولید ضایعات داشته؟", a: pct(todayIn ? todayWaste / todayIn : 0) },
    { q: "چرا ضایعات ایجاد شده؟", a: waste[0] ? `${waste[0].reason} (${num(waste[0].kg, 1)} کیلو)` : "ضایعات معناداری نیست" },
    { q: "ویزیتور چقدر عملکرد داشته؟", a: `${pct(visitRate)} انجام · ${toman(visitPerf)} سفارش ماه` },
    { q: "الان مهم‌ترین مشکل کارگاه چیست؟", a: topProblem },
    { q: "مسئول حل آن چه کسی است؟", a: owner },
    { q: "آیا مشکل قبلی حل شده؟", a: prevOpen ? `آخرین تأیید: ${prevOpen.summary} — ${prevOpen.userName}` : "هنوز اقدام اصلاحی ثبت نشده" },
  ];

  return (
    <div>
      <PageTitle
        title="داشبورد ۱۰ دقیقه‌ای"
        hint={`${store.settings.workshop} — ${MONTHS[store.settings.month - 1]} ${store.settings.year} — امروز ${store.settings.today}`}
      />

      <div
        className={cn(
          "mb-5 rounded-[var(--radius-lg)] px-4 py-4 text-center text-base font-semibold",
          banner === "critical" && "bg-bad-bg text-bad",
          banner === "watch" && "bg-warn-bg text-warn",
          banner === "ok" && pending.length === 0 && "bg-ok-bg text-ok",
          pending.length > 0 && profile.role === "admin" && "bg-warn-bg text-warn",
        )}
      >
        {bannerText}
        {profile.role === "admin" && pending.length > 0 ? (
          <Link to="/approvals" className="mt-2 block text-sm underline">
            مشاهده درخواست‌ها
          </Link>
        ) : null}
      </div>

      <p className="mb-5 text-sm text-fg-muted">
        مدیریت بر اساس استثنا: چراغ سبز یعنی دخالت لازم نیست. ثبت → محاسبه خودکار → KPI → اقدام.
      </p>

      {(critical.length > 0 || watch.length > 0) && (
        <Panel className="mb-5">
          <h3 className="mb-3 text-sm font-semibold">اقدامات اصلاحی باز</h3>
          <ul className="grid gap-2">
            {[...critical, ...watch].map((k) => (
              <li key={k.key} className="flex flex-col gap-1 rounded-[var(--radius-sm)] bg-muted px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm">
                  {k.name}: {formatKpi(k.value, k.unit)}
                </span>
                <span className="text-xs text-fg-muted">{k.action}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((k) => (
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

      {finance ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Panel>
            <h3 className="mb-3 text-sm font-semibold">سود هر محصول</h3>
            <ul className="grid gap-2 text-sm">
              {prodProf.slice(0, 6).map((p) => (
                <li key={p.product} className="flex justify-between">
                  <span>{p.product}</span>
                  <span className="tabular-nums">{toman(p.profit)}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h3 className="mb-3 text-sm font-semibold">سود هر مشتری</h3>
            <ul className="grid gap-2 text-sm">
              {custProf.slice(0, 6).map((p) => (
                <li key={p.customer} className="flex justify-between">
                  <span>{p.customer}</span>
                  <span className="tabular-nums">{toman(p.profit)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      ) : null}

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

      {finance ? (
        <Panel className="mt-6">
          <h3 className="mb-3 text-sm font-semibold">پاسخ سامانه به ۱۴ سؤال مدیر</h3>
          <ol className="grid gap-2">
            {answers.map((x, i) => (
              <li key={x.q} className="grid gap-1 rounded-[var(--radius-sm)] bg-muted px-3 py-2 sm:grid-cols-[1.2fr_1fr]">
                <span className="text-sm text-fg-muted">
                  {i + 1}. {x.q}
                </span>
                <span className="text-sm font-medium">{x.a}</span>
              </li>
            ))}
          </ol>
        </Panel>
      ) : (
        <Panel className="mt-6">
          <p className="text-sm text-fg-muted">اطلاعات مالی و سود فقط برای مدیر کل نمایش داده می‌شود.</p>
        </Panel>
      )}
    </div>
  );
}
