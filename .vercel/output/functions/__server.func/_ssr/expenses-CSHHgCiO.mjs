import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as PAY_METHODS, p as useWorkshop, r as PageTitle, s as EXPENSE_TYPES, y as toman } from "./router-BUaE4XGK.mjs";
import { n as Input, r as Select, t as Field } from "./input-CHwMk_IU.mjs";
import { r as DataTable, t as AddForm } from "./journal-KWw6p0QH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-CSHHgCiO.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { expenses, employees, addExpense, remove, settings } = useWorkshop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "هزینه‌ها",
			hint: "حقوق را اول ماه بزنید. هر هزینه یک ردیف."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AddForm, {
			title: "ثبت هزینه",
			onSubmit: (e) => {
				const f = new FormData(e.currentTarget);
				addExpense({
					date: String(f.get("date") || settings.today),
					type: String(f.get("type")),
					amount: Number(f.get("amount")),
					payer: String(f.get("payer")),
					method: String(f.get("method")),
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
					label: "نوع",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "type",
						children: EXPENSE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "مبلغ (تومان)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "amount",
						type: "number",
						required: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "پرداخت‌کننده",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "payer",
						children: employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: e.name }, e.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "روش",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "method",
						children: PAY_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: m }, m))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "شرح",
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
					key: "t",
					label: "نوع"
				},
				{
					key: "a",
					label: "مبلغ"
				},
				{
					key: "p",
					label: "پرداخت‌کننده"
				},
				{
					key: "m",
					label: "روش"
				},
				{
					key: "n",
					label: "شرح"
				}
			],
			rows: expenses.map((e) => ({
				id: e.id,
				onDelete: () => remove("expenses", e.id),
				cells: [
					e.date,
					e.type,
					toman(e.amount),
					e.payer,
					e.method,
					e.note
				]
			}))
		})
	] });
}
//#endregion
export { Page as component };
