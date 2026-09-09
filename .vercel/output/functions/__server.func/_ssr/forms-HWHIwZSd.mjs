import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Printer } from "../_libs/lucide-react.mjs";
import { r as PageTitle } from "./router-BUaE4XGK.mjs";
import { t as FORMS } from "./forms-vDtA7q8c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forms-HWHIwZSd.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
		title: "فرم‌های کاغذی A4",
		hint: "سیاه‌وسفید، مناسب چاپ و پر کردن با خودکار. روی کارت بزنید و از مرورگر چاپ کنید، یا کل مجموعه را از PDF دانلود کنید.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: "/files/formha-chapi-A4.pdf",
			download: true,
			className: "inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] bg-primary px-4 text-sm text-primary-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "دانلود PDF همه فرم‌ها"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: FORMS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/forms/$id",
			params: { id: f.id },
			className: "rounded-[var(--radius-lg)] border border-border bg-surface p-5 transition-colors hover:bg-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-fg-subtle",
					children: f.code
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-semibold",
					children: f.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-fg-muted",
					children: ["مسئول: ", f.who]
				})
			]
		}, f.id))
	})] });
}
//#endregion
export { Page as component };
