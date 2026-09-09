import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as CITIES, d as QUALITY, g as num, i as APPROVAL, p as useWorkshop, r as PageTitle, u as PRODUCTS, y as toman } from "./router-BUaE4XGK.mjs";
import { n as Input, r as Select, t as Field } from "./input-CHwMk_IU.mjs";
import { r as DataTable, t as AddForm } from "./journal-KWw6p0QH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suppliers-CbdlNreh.js
var import_jsx_runtime = require_jsx_runtime();
function avg(s) {
	return (s.scorePrice + s.scoreQuality + s.scoreDelivery + s.scoreStability + s.scorePay) / 5;
}
function Page() {
	const { suppliers, addSupplier, remove } = useWorkshop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "تأمین‌کنندگان",
			hint: "امتیاز کل میانگین پنج معیار ۱ تا ۱۰ است. از همین فهرست در خرید نام انتخاب می‌شود."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AddForm, {
			title: "تأمین‌کننده جدید",
			onSubmit: (e) => {
				const f = new FormData(e.currentTarget);
				addSupplier({
					name: String(f.get("name")),
					phone: String(f.get("phone") || ""),
					city: String(f.get("city")),
					product: String(f.get("product")),
					price: Number(f.get("price") || 0),
					quality: String(f.get("quality")),
					payTerms: String(f.get("payTerms") || ""),
					days: Number(f.get("days") || 0),
					scorePrice: Number(f.get("scorePrice") || 7),
					scoreQuality: Number(f.get("scoreQuality") || 7),
					scoreDelivery: Number(f.get("scoreDelivery") || 7),
					scoreStability: Number(f.get("scoreStability") || 7),
					scorePay: Number(f.get("scorePay") || 7),
					status: String(f.get("status")),
					note: String(f.get("note") || "")
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "نام",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "name",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "تلفن",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "phone" })
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
					label: "قیمت شاخص",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "price",
						type: "number"
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
					label: "شرایط پرداخت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "payTerms" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "زمان تحویل (روز)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "days",
						type: "number"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "امتیاز قیمت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "scorePrice",
						type: "number",
						min: 1,
						max: 10,
						defaultValue: 7
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "امتیاز کیفیت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "scoreQuality",
						type: "number",
						min: 1,
						max: 10,
						defaultValue: 7
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "امتیاز تحویل",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "scoreDelivery",
						type: "number",
						min: 1,
						max: 10,
						defaultValue: 7
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "امتیاز ثبات",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "scoreStability",
						type: "number",
						min: 1,
						max: 10,
						defaultValue: 7
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "امتیاز پرداخت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "scorePay",
						type: "number",
						min: 1,
						max: 10,
						defaultValue: 7
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "وضعیت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "status",
						children: APPROVAL.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: a }, a))
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			columns: [
				{
					key: "n",
					label: "نام"
				},
				{
					key: "c",
					label: "شهر"
				},
				{
					key: "p",
					label: "محصول"
				},
				{
					key: "pr",
					label: "قیمت"
				},
				{
					key: "q",
					label: "کیفیت"
				},
				{
					key: "a",
					label: "امتیاز کل"
				},
				{
					key: "s",
					label: "وضعیت"
				}
			],
			rows: suppliers.map((s) => ({
				id: s.id,
				onDelete: () => remove("suppliers", s.id),
				cells: [
					s.name,
					s.city,
					s.product,
					s.price ? toman(s.price) : "—",
					s.quality,
					num(avg(s), 1),
					s.status
				]
			}))
		})
	] });
}
//#endregion
export { Page as component };
