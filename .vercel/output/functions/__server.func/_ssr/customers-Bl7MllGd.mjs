import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as CITIES, m as cn, o as CUST_TYPES, p as useWorkshop, r as PageTitle, y as toman } from "./router-BUaE4XGK.mjs";
import { n as Input, r as Select, t as Field } from "./input-CHwMk_IU.mjs";
import { r as DataTable, t as AddForm } from "./journal-KWw6p0QH.mjs";
import { a as firstPurchase, c as lastPurchase, r as customerTotal, t as abcClass } from "./kpis-CvtxtOcE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-Bl7MllGd.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { customers, sales, addCustomer, remove, settings } = useWorkshop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "دفتر مشتریان",
			hint: "دسته A / B / C از مجموع خرید و آستانه‌های تنظیمات به‌صورت خودکار است."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AddForm, {
			title: "مشتری جدید",
			onSubmit: (e) => {
				const f = new FormData(e.currentTarget);
				addCustomer({
					name: String(f.get("name")),
					phone: String(f.get("phone") || ""),
					city: String(f.get("city")),
					address: String(f.get("address") || ""),
					type: String(f.get("type")),
					lastVisit: String(f.get("lastVisit") || settings.today),
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
					label: "آدرس",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "address" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "نوع",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						name: "type",
						children: CUST_TYPES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "آخرین ویزیت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "lastVisit",
						defaultValue: settings.today
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "وضعیت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "status",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "فعال" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "بالقوه" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "غیرفعال" })
						]
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
					key: "n",
					label: "نام"
				},
				{
					key: "p",
					label: "تلفن"
				},
				{
					key: "c",
					label: "شهر"
				},
				{
					key: "t",
					label: "نوع"
				},
				{
					key: "f",
					label: "اولین خرید"
				},
				{
					key: "l",
					label: "آخرین خرید"
				},
				{
					key: "s",
					label: "مجموع خرید"
				},
				{
					key: "a",
					label: "دسته"
				},
				{
					key: "st",
					label: "وضعیت"
				}
			],
			rows: customers.map((c) => {
				const total = customerTotal(c.name, sales);
				const abc = abcClass(total, settings);
				return {
					id: c.id,
					onDelete: () => remove("customers", c.id),
					cells: [
						c.name,
						c.phone,
						c.city,
						c.type,
						firstPurchase(c.name, sales) || "—",
						lastPurchase(c.name, sales) || "—",
						toman(total),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold", abc === "A" && "bg-ok-bg text-ok", abc === "B" && "bg-warn-bg text-warn", abc === "C" && "bg-muted text-fg-muted"),
							children: abc
						}, "abc"),
						c.status
					]
				};
			})
		})
	] });
}
//#endregion
export { Page as component };
