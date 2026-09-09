import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as packLabel, c as PACKS, g as num, p as useWorkshop, r as PageTitle, u as PRODUCTS } from "./router-BUaE4XGK.mjs";
import { n as Input, r as Select, t as Field } from "./input-CHwMk_IU.mjs";
import { i as Panel, r as DataTable, t as AddForm } from "./journal-KWw6p0QH.mjs";
import { d as packStock, i as finStock, l as lightOf, p as rawStock } from "./kpis-CvtxtOcE.mjs";
import { t as StatusBadge } from "./badge-hNlt50Cn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-kK11l8KN.js
var import_jsx_runtime = require_jsx_runtime();
var rawDef = (min) => ({
	key: "raw",
	name: "",
	green: min,
	yellow: min * .4,
	direction: "higher",
	unit: "کیلوگرم",
	actionRed: "",
	actionYellow: ""
});
function Page() {
	const { purchases, production, sales, moves, addMove, remove, settings } = useWorkshop();
	const perRawMin = settings.minRaw / PRODUCTS.length;
	const perFinMin = settings.minFin / PRODUCTS.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "موجودی",
			hint: "خرید و فروش را اینجا دوباره ننویسید. خلاصه خودکار است. فقط شمارش و ضایعات انبار را پایین بزنید."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			className: "mb-5 overflow-hidden p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
							"نوع",
							"محصول",
							"موجودی",
							"حداقل",
							"وضعیت"
						].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-right font-medium",
							children: h
						}, h)) })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [PRODUCTS.map((p, i) => {
						const v = rawStock(p, purchases, production, moves);
						const light = lightOf(v, rawDef(perRawMin));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: i % 2 ? "bg-muted/60" : "",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: "مواد اولیه"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: p
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 tabular-nums",
									children: [num(v, 1), " کیلو"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: num(perRawMin, 0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { light })
								})
							]
						}, "r" + p);
					}), PRODUCTS.map((p, i) => {
						const v = finStock(p, production, sales, moves);
						const light = lightOf(v, rawDef(perFinMin));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: i % 2 ? "bg-muted/60" : "",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: "محصول نهایی"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: p
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-3 py-2 tabular-nums",
									children: [num(v, 1), " کیلو"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: num(perFinMin, 0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { light })
								})
							]
						}, "f" + p);
					})] })]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 text-sm font-semibold",
				children: "مانده بسته"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: PRODUCTS.flatMap((p) => PACKS.map((pk) => {
					const n = packStock(p, pk, production, sales);
					if (n === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between rounded-[var(--radius-sm)] bg-muted px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							p,
							" ",
							packLabel(pk)
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: [n, " بسته"]
						})]
					}, p + pk);
				}))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AddForm, {
			title: "حرکت دستی انبار (شمارش / ضایعات / اصلاح)",
			onSubmit: (e) => {
				const f = new FormData(e.currentTarget);
				addMove({
					date: String(f.get("date") || settings.today),
					kind: String(f.get("kind")),
					product: String(f.get("product")),
					inn: Number(f.get("inn") || 0),
					out: Number(f.get("out") || 0),
					unit: "کیلوگرم",
					loc: String(f.get("loc") || ""),
					reason: String(f.get("reason") || "")
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
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						name: "kind",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "مواد اولیه" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "محصول نهایی" })]
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
					label: "ورود",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "inn",
						type: "number",
						step: "0.1",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "خروج",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						name: "out",
						type: "number",
						step: "0.1",
						defaultValue: 0
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "محل / علت",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { name: "reason" })
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
					key: "k",
					label: "نوع"
				},
				{
					key: "p",
					label: "محصول"
				},
				{
					key: "i",
					label: "ورود"
				},
				{
					key: "o",
					label: "خروج"
				},
				{
					key: "r",
					label: "علت"
				}
			],
			rows: moves.map((m) => ({
				id: m.id,
				onDelete: () => remove("moves", m.id),
				cells: [
					m.date,
					m.kind,
					m.product,
					num(m.inn, 1),
					num(m.out, 1),
					m.reason
				]
			}))
		})
	] });
}
//#endregion
export { Page as component };
