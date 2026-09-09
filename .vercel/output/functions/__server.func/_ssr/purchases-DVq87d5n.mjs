import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as QUALITY, g as num, i as APPROVAL, p as useWorkshop, r as PageTitle, u as PRODUCTS, y as toman } from "./router-BUaE4XGK.mjs";
import { n as Input, r as Select, t as Field } from "./input-CHwMk_IU.mjs";
import { r as DataTable, t as AddForm } from "./journal-KWw6p0QH.mjs";
import { f as purchaseTotal } from "./kpis-CvtxtOcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/purchases-DVq87d5n.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { purchases, suppliers, addPurchase, remove, settings } = useWorkshop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "خرید مواد اولیه",
			hint: "فقط بار «تأیید شده» وارد موجودی و هزینه ماه می‌شود. قیمت تمام‌شده خودکار است."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AddForm, {
			title: "ثبت خرید جدید",
			onSubmit: (e) => {
				const f = new FormData(e.currentTarget);
				addPurchase({
					date: String(f.get("date") || settings.today),
					supplier: String(f.get("supplier")),
					product: String(f.get("product")),
					kg: Number(f.get("kg")),
					price: Number(f.get("price")),
					freight: Number(f.get("freight") || 0),
					quality: String(f.get("quality")),
					status: String(f.get("status")),
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
					label: "تأمین‌کننده",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "supplier",
						required: true,
						children: suppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s.name }, s.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "نوع حبوبات",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "product",
						children: PRODUCTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: p }, p))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "مقدار (کیلو)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "kg",
						type: "number",
						step: "0.1",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "قیمت هر کیلو",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "price",
						type: "number",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "هزینه حمل",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "freight",
						type: "number",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "کیفیت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "quality",
						children: QUALITY.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: q }, q))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "وضعیت تأیید",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "status",
						children: APPROVAL.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: q }, q))
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
					key: "s",
					label: "تأمین‌کننده"
				},
				{
					key: "p",
					label: "محصول"
				},
				{
					key: "k",
					label: "کیلو"
				},
				{
					key: "pr",
					label: "قیمت"
				},
				{
					key: "t",
					label: "مبلغ + حمل"
				},
				{
					key: "q",
					label: "کیفیت"
				},
				{
					key: "st",
					label: "وضعیت"
				}
			],
			rows: purchases.map((p) => ({
				id: p.id,
				onDelete: () => remove("purchases", p.id),
				cells: [
					p.date,
					p.supplier,
					p.product,
					num(p.kg, 1),
					toman(p.price),
					toman(purchaseTotal(p)),
					p.quality,
					p.status
				]
			}))
		})
	] });
}
//#endregion
export { Page as component };
