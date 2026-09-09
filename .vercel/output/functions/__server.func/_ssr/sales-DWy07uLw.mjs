import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as packLabel, a as CITIES, c as PACKS, g as num, p as useWorkshop, r as PageTitle, u as PRODUCTS, y as toman } from "./router-BUaE4XGK.mjs";
import { n as Input, r as Select, t as Field } from "./input-CHwMk_IU.mjs";
import { r as DataTable, t as AddForm } from "./journal-KWw6p0QH.mjs";
import { g as saleWeight, h as saleRemain, m as saleFinal } from "./kpis-CvtxtOcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sales-DWy07uLw.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { sales, customers, employees, addSale, remove, settings } = useWorkshop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "فروش",
			hint: "مانده حساب خودکار است. وصول را همین‌جا بزنید تا مطالبات داشبورد درست بماند."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AddForm, {
			title: "ثبت فروش",
			onSubmit: (e) => {
				const f = new FormData(e.currentTarget);
				addSale({
					date: String(f.get("date") || settings.today),
					customer: String(f.get("customer")),
					city: String(f.get("city")),
					product: String(f.get("product")),
					packKg: Number(f.get("packKg")),
					qty: Number(f.get("qty")),
					unitPrice: Number(f.get("unitPrice")),
					discount: Number(f.get("discount") || 0),
					collected: Number(f.get("collected") || 0),
					seller: String(f.get("seller"))
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
					label: "مشتری",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "customer",
						children: customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c.name }, c.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "شهر",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "city",
						children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
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
					label: "تعداد",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "qty",
						type: "number",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "قیمت هر بسته",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "unitPrice",
						type: "number",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "تخفیف",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "discount",
						type: "number",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "وصول‌شده",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "collected",
						type: "number",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "فروشنده",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "seller",
						children: employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: e.name }, e.id))
					})
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
					key: "c",
					label: "مشتری"
				},
				{
					key: "p",
					label: "محصول"
				},
				{
					key: "n",
					label: "تعداد"
				},
				{
					key: "w",
					label: "وزن"
				},
				{
					key: "f",
					label: "مبلغ نهایی"
				},
				{
					key: "col",
					label: "وصول"
				},
				{
					key: "r",
					label: "مانده"
				}
			],
			rows: sales.map((s) => ({
				id: s.id,
				onDelete: () => remove("sales", s.id),
				cells: [
					s.date,
					s.customer,
					`${s.product} ${packLabel(s.packKg)}`,
					s.qty,
					num(saleWeight(s), 1),
					toman(saleFinal(s)),
					toman(s.collected),
					toman(saleRemain(s))
				]
			}))
		})
	] });
}
//#endregion
export { Page as component };
