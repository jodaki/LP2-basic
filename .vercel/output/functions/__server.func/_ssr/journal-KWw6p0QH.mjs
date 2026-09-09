import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Trash2 } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { m as cn } from "./router-BUaE4XGK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/journal-KWw6p0QH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-[opacity,transform,background-color] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
			ghost: "hover:bg-muted text-fg",
			danger: "bg-bad text-white hover:opacity-90",
			outline: "border border-border bg-surface text-fg hover:bg-muted"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
function Panel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: cn("rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-5", className),
		children
	});
}
function AddForm({ title, onSubmit, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "mb-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-4 text-sm font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			onSubmit: (e) => {
				e.preventDefault();
				onSubmit(e);
				e.currentTarget.reset();
			},
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full sm:w-auto",
					children: "ثبت"
				})
			})]
		})]
	});
}
function DataTable({ columns, rows }) {
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-8 text-center text-sm text-fg-muted",
		children: "هنوز ردیفی ثبت نشده."
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		className: "overflow-hidden p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: cn("px-3 py-3 text-right font-medium", c.className),
						children: c.label
					}, c.key)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "w-12 px-2" })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: i % 2 ? "bg-muted/60" : "bg-surface",
					children: [r.cells.map((cell, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-3 py-2.5 align-middle",
						children: cell
					}, idx)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-2",
						children: r.onDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: r.onDelete,
							className: "grid size-9 place-items-center rounded-[var(--radius-sm)] text-fg-subtle hover:bg-bad-bg hover:text-bad",
							"aria-label": "حذف",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						}) : null
					})]
				}, r.id)) })]
			})
		})
	});
}
//#endregion
export { Panel as i, Button as n, DataTable as r, AddForm as t };
