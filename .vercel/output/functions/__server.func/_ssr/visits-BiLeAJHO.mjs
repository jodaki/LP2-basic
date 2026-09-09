import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as REGIONS, p as useWorkshop, r as PageTitle, v as pct, y as toman } from "./router-BUaE4XGK.mjs";
import { n as Input, r as Select, t as Field } from "./input-CHwMk_IU.mjs";
import { r as DataTable, t as AddForm } from "./journal-KWw6p0QH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visits-BiLeAJHO.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { visits, addVisit, remove, settings } = useWorkshop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "گزارش ویزیتور",
			hint: "درصد انجام ویزیت و نرخ تبدیل خودکار است. هر روز یک ردیف از روی فرم کاغذی."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AddForm, {
			title: "ثبت روز ویزیت",
			onSubmit: (e) => {
				const f = new FormData(e.currentTarget);
				addVisit({
					date: String(f.get("date") || settings.today),
					region: String(f.get("region")),
					planned: Number(f.get("planned")),
					visited: Number(f.get("visited")),
					orders: Number(f.get("orders") || 0),
					orderAmount: Number(f.get("orderAmount") || 0),
					newCustomers: Number(f.get("newCustomers") || 0),
					collected: Number(f.get("collected") || 0),
					km: Number(f.get("km") || 0),
					fuel: Number(f.get("fuel") || 0),
					note: String(f.get("note") || "")
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "تاریخ",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "date",
						defaultValue: settings.today
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "منطقه",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "region",
						children: REGIONS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: r }, r))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "برنامه‌ریزی‌شده",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "planned",
						type: "number",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "ویزیت‌شده",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "visited",
						type: "number",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "سفارش",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "orders",
						type: "number",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "مبلغ سفارش",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "orderAmount",
						type: "number",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "مشتری جدید",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "newCustomers",
						type: "number",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "وصول",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "collected",
						type: "number",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "کیلومتر",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "km",
						type: "number",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "سوخت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "fuel",
						type: "number",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "توضیحات",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "note" })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				{
					key: "d",
					label: "تاریخ"
				},
				{
					key: "r",
					label: "منطقه"
				},
				{
					key: "p",
					label: "برنامه / انجام"
				},
				{
					key: "v",
					label: "% ویزیت"
				},
				{
					key: "c",
					label: "تبدیل"
				},
				{
					key: "o",
					label: "مبلغ سفارش"
				},
				{
					key: "col",
					label: "وصول"
				},
				{
					key: "f",
					label: "سوخت"
				}
			],
			rows: visits.map((v) => ({
				id: v.id,
				onDelete: () => remove("visits", v.id),
				cells: [
					v.date,
					v.region,
					`${v.visited} از ${v.planned}`,
					pct(v.planned ? v.visited / v.planned : 0),
					pct(v.visited ? v.orders / v.visited : 0),
					toman(v.orderAmount),
					toman(v.collected),
					toman(v.fuel)
				]
			}))
		})
	] });
}
//#endregion
export { Page as component };
