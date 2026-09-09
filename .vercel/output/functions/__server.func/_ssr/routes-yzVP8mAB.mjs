import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, v as Link, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Printer, m as Download, p as ExternalLink } from "../_libs/lucide-react.mjs";
import { h as MONTHS, m as cn, p as useWorkshop, r as PageTitle, u as PRODUCTS, y as toman } from "./router-BUaE4XGK.mjs";
import { i as Panel, n as Button } from "./journal-KWw6p0QH.mjs";
import { m as saleFinal, n as computeKpis, o as formatKpi, s as inMonth } from "./kpis-CvtxtOcE.mjs";
import { t as StatusBadge } from "./badge-hNlt50Cn.mjs";
import { a as Bar, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as Pie, r as YAxis, s as Cell, t as PieChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-yzVP8mAB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PIE = [
	"#2F4A32",
	"#4F6F52",
	"#7C8C5A",
	"#A3B18A",
	"#B7A48B",
	"#8A6D4A",
	"#5C4A32"
];
function Dashboard() {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	const store = useWorkshop();
	const kpis = (0, import_react.useMemo)(() => computeKpis({
		settings: store.settings,
		purchases: store.purchases,
		production: store.production,
		sales: store.sales,
		customers: store.customers,
		visits: store.visits,
		expenses: store.expenses,
		moves: store.moves,
		kpiDefs: store.kpiDefs,
		products: PRODUCTS
	}), [store]);
	const critical = kpis.filter((k) => k.light === "critical");
	const watch = kpis.filter((k) => k.light === "watch");
	const banner = critical.length ? "critical" : watch.length ? "watch" : "ok";
	const bannerText = banner === "critical" ? `${critical.length} شاخص بحرانی — امروز اقدام کنید` : banner === "watch" ? `${watch.length} شاخص نیاز به بررسی دارد` : "همه شاخص‌های مهم مطلوب‌اند. کارگاه روی روال است.";
	const pieData = PRODUCTS.map((p) => ({
		name: p,
		value: store.sales.filter((s) => s.product === p && inMonth(s.date, store.settings.year, store.settings.month)).reduce((a, s) => a + saleFinal(s), 0)
	})).filter((d) => d.value > 0);
	const barData = PRODUCTS.map((p) => ({
		name: p.replace("لوبیا ", ""),
		kg: store.production.filter((x) => x.product === p && inMonth(x.date, store.settings.year, store.settings.month)).reduce((a, x) => a + x.cleanKg, 0)
	}));
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-20 text-center text-sm text-fg-muted",
		children: "در حال آماده‌سازی داشبورد…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "داشبورد مدیریتی",
			hint: `${store.settings.workshop} — ${MONTHS[store.settings.month - 1]} ${store.settings.year} — امروز ${store.settings.today}`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/files/workshop.xlsx",
				download: "سامانه-مدیریت-کارگاه-حبوبات-پلدختر.xlsx",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "فایل Excel"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/files/formha-chapi-A4.pdf",
				download: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "فرم‌های A4"]
				})
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mb-5 rounded-[var(--radius-lg)] px-4 py-4 text-center text-base font-semibold", banner === "critical" && "bg-bad-bg text-bad", banner === "watch" && "bg-warn-bg text-warn", banner === "ok" && "bg-ok-bg text-ok"),
			children: bannerText
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-5 text-sm text-fg-muted",
			children: "چرخه کار: ثبت اطلاعات → محاسبه KPI → این صفحه → تشخیص انحراف → اقدام اصلاحی. اگر چراغی قرمز نیست، دخالت لازم نیست."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-[var(--radius-lg)] border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm text-fg-muted",
							children: k.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { light: k.light })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-display text-2xl font-semibold tabular-nums leading-none",
						children: formatKpi(k.value, k.unit)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-fg-subtle",
						children: [k.unit, k.target != null ? ` · هدف ${formatKpi(k.target, k.unit)}` : ""]
					}),
					k.action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs leading-5 text-fg",
						children: k.action
					}) : null
				]
			}, k.key))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 text-sm font-semibold",
					children: "ترکیب فروش این ماه"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: pieData,
							dataKey: "value",
							nameKey: "name",
							innerRadius: 50,
							outerRadius: 80,
							paddingAngle: 2,
							children: pieData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE[i % PIE.length] }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => toman(v) })] })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 grid grid-cols-2 gap-1 text-xs text-fg-muted",
					children: pieData.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2 rounded-full",
							style: { background: PIE[i % PIE.length] }
						}), d.name]
					}, d.name))
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-4 text-sm font-semibold",
				children: "تولید این ماه (کیلو)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: barData,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								tick: { fontSize: 11 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: { fontSize: 11 } }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "kg",
								fill: "#2F4A32",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				})
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 text-sm font-semibold",
				children: "فایل‌ها روی گوگل درایو"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 hover:bg-muted",
						href: "https://drive.google.com/drive/folders/1gwnjZUn2pP7u7EqQvHdQdX3xm5VuFy8R",
						target: "_blank",
						rel: "noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), " پوشه اصلی"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						className: "inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 hover:bg-muted",
						href: "https://docs.google.com/spreadsheets/d/18HdPBhiZurOtNoLM2jZJWtrPXc1ynmVzlmJpC1K7ipU/edit",
						target: "_blank",
						rel: "noreferrer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), " گوگل‌شیت (قابل ویرایش)"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/forms",
						className: "inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border px-3 hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " چاپ فرم‌های کاغذی"]
					})
				]
			})]
		})
	] });
}
//#endregion
export { Dashboard as component };
