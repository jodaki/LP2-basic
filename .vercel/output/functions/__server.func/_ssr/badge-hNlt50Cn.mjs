import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as cn } from "./router-BUaE4XGK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-hNlt50Cn.js
var import_jsx_runtime = require_jsx_runtime();
var map = {
	ok: {
		label: "مطلوب",
		className: "bg-ok-bg text-ok"
	},
	watch: {
		label: "نیاز به بررسی",
		className: "bg-warn-bg text-warn"
	},
	critical: {
		label: "بحرانی",
		className: "bg-bad-bg text-bad"
	},
	info: {
		label: "اطلاعاتی",
		className: "bg-muted text-fg-muted"
	}
};
function StatusBadge({ light }) {
	const m = map[light];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium", m.className),
		children: m.label
	});
}
//#endregion
export { StatusBadge as t };
