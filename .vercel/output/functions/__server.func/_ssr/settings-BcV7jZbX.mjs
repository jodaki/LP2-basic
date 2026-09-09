import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as MONTHS, p as useWorkshop, r as PageTitle } from "./router-BUaE4XGK.mjs";
import { n as Input, t as Field } from "./input-CHwMk_IU.mjs";
import { i as Panel, n as Button } from "./journal-KWw6p0QH.mjs";
import { o as formatKpi } from "./kpis-CvtxtOcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BcV7jZbX.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { settings, setSettings, kpiDefs, setKpiDef, resetSample } = useWorkshop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "تنظیمات و اهداف",
			hint: "این اعداد چراغ داشبورد را عوض می‌کنند. سلول‌های هدف را با واقعیت کارگاه خودتان تنظیم کنید.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => resetSample(),
				children: "بازگشت به داده نمونه"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "نام کارگاه",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: settings.workshop,
						onChange: (e) => setSettings({ workshop: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "سال جاری",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: settings.year,
						onChange: (e) => setSettings({ year: Number(e.target.value) })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ماه جاری",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						min: 1,
						max: 12,
						value: settings.month,
						onChange: (e) => setSettings({ month: Number(e.target.value) })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "self-end text-sm text-fg-muted",
					children: MONTHS[settings.month - 1] ?? ""
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "تاریخ امروز (شمسی)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: settings.today,
						onChange: (e) => setSettings({ today: e.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "آستانه مشتری A (تومان)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: settings.abcA,
						onChange: (e) => setSettings({ abcA: Number(e.target.value) })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "آستانه مشتری B (تومان)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: settings.abcB,
						onChange: (e) => setSettings({ abcB: Number(e.target.value) })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "حداقل موجودی مواد (کیلو)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: settings.minRaw,
						onChange: (e) => setSettings({ minRaw: Number(e.target.value) })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "حداقل موجودی محصول (کیلو)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: settings.minFin,
						onChange: (e) => setSettings({ minFin: Number(e.target.value) })
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"شاخص",
							"هدف مطلوب",
							"آستانه بررسی",
							"جهت",
							"واحد"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-right font-medium",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: kpiDefs.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: i % 2 ? "bg-muted/60" : "",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: k.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: k.green == null ? "—" : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "h-9",
									defaultValue: k.unit === "درصد" ? String(k.green * 100) : String(k.green),
									onBlur: (e) => {
										const n = Number(e.target.value);
										setKpiDef(k.key, { green: k.unit === "درصد" ? n / 100 : n });
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: k.yellow == null ? "—" : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "h-9",
									defaultValue: k.unit === "درصد" ? String(k.yellow * 100) : String(k.yellow),
									onBlur: (e) => {
										const n = Number(e.target.value);
										setKpiDef(k.key, { yellow: k.unit === "درصد" ? n / 100 : n });
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-fg-muted",
								children: k.direction === "higher" ? "بالاتر بهتر" : k.direction === "lower" ? "پایین‌تر بهتر" : "اطلاعاتی"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2",
								children: k.unit === "درصد" ? "٪ (عدد را بدون درصد بنویسید)" : k.unit
							})
						]
					}, k.key)) })]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-xs text-fg-subtle",
			children: [
				"تاریخ را با اعداد انگلیسی بنویسید: 1405/06/18. هدف فروش ماه الان ",
				formatKpi(kpiDefs.find((k) => k.key === "sales_month")?.green ?? 0, "تومان"),
				" تومان است."
			]
		})
	] });
}
//#endregion
export { Page as component };
