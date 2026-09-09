import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as useWorkshop, r as PageTitle, v as pct, y as toman } from "./router-BUaE4XGK.mjs";
import { n as Input, r as Select, t as Field } from "./input-CHwMk_IU.mjs";
import { r as DataTable, t as AddForm } from "./journal-KWw6p0QH.mjs";
import { m as saleFinal, s as inMonth } from "./kpis-CvtxtOcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employees-D7nzSd9Z.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { employees, sales, addEmployee, remove, settings } = useWorkshop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "کارکنان",
			hint: "جا برای رشد تا ۲۰ نفر. پورسانت ماه از فروش همان فروشنده × نرخ پورسانت."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AddForm, {
			title: "افزودن نیرو",
			onSubmit: (e) => {
				const f = new FormData(e.currentTarget);
				addEmployee({
					name: String(f.get("name")),
					role: String(f.get("role")),
					duties: String(f.get("duties") || ""),
					salary: Number(f.get("salary") || 0),
					commissionRate: Number(f.get("commissionRate") || 0) / 100,
					start: String(f.get("start") || settings.today),
					status: "فعال",
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
					label: "سمت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "role",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "مدیر/مالک" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "مسئول انبار" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "نیروی تولید" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ویزیتور" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "کمک تولید" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "حسابدار" })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "وظایف",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "duties" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "حقوق ثابت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "salary",
						type: "number"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "پورسانت (٪)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "commissionRate",
						type: "number",
						step: "0.1",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "شروع",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "start",
						defaultValue: settings.today
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
					key: "r",
					label: "سمت"
				},
				{
					key: "d",
					label: "وظایف"
				},
				{
					key: "s",
					label: "حقوق"
				},
				{
					key: "c",
					label: "نرخ پورسانت"
				},
				{
					key: "cm",
					label: "پورسانت ماه"
				},
				{
					key: "t",
					label: "جمع ماه"
				}
			],
			rows: employees.map((e) => {
				const comm = sales.filter((s) => s.seller === e.name && inMonth(s.date, settings.year, settings.month)).reduce((a, s) => a + saleFinal(s), 0) * (e.commissionRate || 0);
				return {
					id: e.id,
					onDelete: () => remove("employees", e.id),
					cells: [
						e.name,
						e.role,
						e.duties,
						toman(e.salary),
						pct(e.commissionRate || 0),
						toman(comm),
						toman(e.salary + comm)
					]
				};
			})
		})
	] });
}
//#endregion
export { Page as component };
