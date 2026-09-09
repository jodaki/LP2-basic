import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as cn } from "./router-BUaE4XGK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-CHwMk_IU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("flex h-11 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-fg placeholder:text-fg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
	...props
}));
Input.displayName = "Input";
var Select = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
	ref,
	className: cn("flex h-11 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
	...props,
	children
}));
Select.displayName = "Select";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("flex min-h-20 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
	...props
}));
Textarea.displayName = "Textarea";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "grid gap-1.5 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium text-fg-muted",
			children: label
		}), children]
	});
}
//#endregion
export { Input as n, Select as r, Field as t };
