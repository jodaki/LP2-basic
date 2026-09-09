import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as packLabel, c as PACKS, g as num, p as useWorkshop, r as PageTitle, u as PRODUCTS, v as pct } from "./router-BUaE4XGK.mjs";
import { n as Input, r as Select, t as Field } from "./input-CHwMk_IU.mjs";
import { r as DataTable, t as AddForm } from "./journal-KWw6p0QH.mjs";
import { _ as wasteKg, u as packCount } from "./kpis-CvtxtOcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/production-DTLlcq3q.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { production, employees, addProduction, remove, settings } = useWorkshop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "تولید و بسته‌بندی",
			hint: "ضایعات، درصد و تعداد بسته خودکار محاسبه می‌شود. وزن بسته: ۰.۴ / ۰.۹ / ۱۰ کیلو."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AddForm, {
			title: "ثبت تولید",
			onSubmit: (e) => {
				const f = new FormData(e.currentTarget);
				addProduction({
					date: String(f.get("date") || settings.today),
					product: String(f.get("product")),
					inputKg: Number(f.get("inputKg")),
					cleanKg: Number(f.get("cleanKg")),
					packKg: Number(f.get("packKg")),
					operator: String(f.get("operator")),
					note: String(f.get("note") || "")
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "تاریخ شمسی",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "date",
						defaultValue: settings.today,
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "محصول",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "product",
						children: PRODUCTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: p }, p))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "مقدار ورودی (کیلو)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "inputKg",
						type: "number",
						step: "0.1",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "مقدار پاک‌شده (کیلو)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "cleanKg",
						type: "number",
						step: "0.1",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "وزن بسته",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "packKg",
						children: PACKS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: p,
							children: packLabel(p)
						}, p))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "اپراتور",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "operator",
						children: employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: e.name }, e.id))
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
					key: "p",
					label: "محصول"
				},
				{
					key: "i",
					label: "ورودی"
				},
				{
					key: "c",
					label: "پاک‌شده"
				},
				{
					key: "w",
					label: "ضایعات"
				},
				{
					key: "pct",
					label: "درصد"
				},
				{
					key: "pk",
					label: "بسته"
				},
				{
					key: "n",
					label: "تعداد"
				},
				{
					key: "o",
					label: "اپراتور"
				}
			],
			rows: production.map((p) => ({
				id: p.id,
				onDelete: () => remove("production", p.id),
				cells: [
					p.date,
					p.product,
					num(p.inputKg, 1),
					num(p.cleanKg, 1),
					num(wasteKg(p), 1),
					pct(p.inputKg ? wasteKg(p) / p.inputKg : 0),
					packLabel(p.packKg),
					packCount(p),
					p.operator
				]
			}))
		})
	] });
}
//#endregion
export { Page as component };
