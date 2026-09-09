import { i as __toESM } from "../_runtime.mjs";
import { _ as createRootRoute, b as require_jsx_runtime, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link, y as useRouter, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as BookOpen, a as TriangleAlert, c as Settings, d as LayoutDashboard, f as Factory, g as CircleUser, h as ClipboardList, i as Truck, l as Printer, n as Wallet, r as Users, s as ShoppingCart, t as Warehouse, u as Package } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BUaE4XGK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function toman(n) {
	if (!Number.isFinite(n)) return "—";
	return new Intl.NumberFormat("fa-IR").format(Math.round(n)) + " تومان";
}
function num(n, digits = 0) {
	if (!Number.isFinite(n)) return "—";
	return new Intl.NumberFormat("fa-IR", {
		maximumFractionDigits: digits,
		minimumFractionDigits: digits
	}).format(n);
}
function kg(n) {
	return num(n, 1) + " کیلو";
}
function pct(n) {
	if (!Number.isFinite(n)) return "—";
	return num(n * 100, 1) + "٪";
}
function packLabel(packKg) {
	if (packKg === .4) return "۴۰۰ گرم";
	if (packKg === .9) return "۹۰۰ گرم";
	if (packKg === 10) return "۱۰ کیلو";
	return kg(packKg);
}
var MONTHS = [
	"فروردین",
	"اردیبهشت",
	"خرداد",
	"تیر",
	"مرداد",
	"شهریور",
	"مهر",
	"آبان",
	"آذر",
	"دی",
	"بهمن",
	"اسفند"
];
var seed_default = {
	meta: {
		"workshop": "کارگاه بسته‌بندی حبوبات پلدختر",
		"city": "پلدختر",
		"year": 1405,
		"month": 6,
		"today": "1405/06/18",
		"currency": "تومان"
	},
	products: [
		"لوبیا چیتی",
		"لوبیا قرمز",
		"لوبیا سفید",
		"عدس",
		"نخود",
		"لپه",
		"ماش"
	],
	packs: [
		.4,
		.9,
		10
	],
	purchases: [
		{
			"date": "1405/04/18",
			"supplier": "موجودی اول دوره",
			"product": "لوبیا چیتی",
			"kg": 180,
			"price": 9e4,
			"freight": 0,
			"quality": "خوب",
			"status": "تأیید شده",
			"note": "موجودی ابتدای کار"
		},
		{
			"date": "1405/04/18",
			"supplier": "موجودی اول دوره",
			"product": "عدس",
			"kg": 80,
			"price": 74e3,
			"freight": 0,
			"quality": "خوب",
			"status": "تأیید شده",
			"note": "موجودی ابتدای کار"
		},
		{
			"date": "1405/04/18",
			"supplier": "موجودی اول دوره",
			"product": "نخود",
			"kg": 90,
			"price": 66e3,
			"freight": 0,
			"quality": "خوب",
			"status": "تأیید شده",
			"note": "موجودی ابتدای کار"
		},
		{
			"date": "1405/05/20",
			"supplier": "کشاورز بروجرد",
			"product": "لوبیا قرمز",
			"kg": 120,
			"price": 84e3,
			"freight": 18e5,
			"quality": "خوب",
			"status": "تأیید شده",
			"note": ""
		},
		{
			"date": "1405/06/02",
			"supplier": "کشاورز بروجرد",
			"product": "لوبیا چیتی",
			"kg": 400,
			"price": 92e3,
			"freight": 25e5,
			"quality": "عالی",
			"status": "تأیید شده",
			"note": "بار تازه"
		},
		{
			"date": "1405/06/04",
			"supplier": "اتحادیه نخود کوهدشت",
			"product": "نخود",
			"kg": 300,
			"price": 68e3,
			"freight": 16e5,
			"quality": "خوب",
			"status": "تأیید شده",
			"note": ""
		},
		{
			"date": "1405/06/07",
			"supplier": "بازرگانی حبوبات خرم‌آباد",
			"product": "عدس",
			"kg": 250,
			"price": 76e3,
			"freight": 14e5,
			"quality": "خوب",
			"status": "تأیید شده",
			"note": ""
		},
		{
			"date": "1405/06/08",
			"supplier": "تأمین عدس دزفول",
			"product": "عدس",
			"kg": 100,
			"price": 79e3,
			"freight": 9e5,
			"quality": "ضعیف",
			"status": "رد شده",
			"note": "ناخالصی زیاد — برگشت"
		},
		{
			"date": "1405/06/10",
			"supplier": "کشاورز بروجرد",
			"product": "لوبیا قرمز",
			"kg": 200,
			"price": 85e3,
			"freight": 15e5,
			"quality": "خوب",
			"status": "تأیید شده",
			"note": ""
		},
		{
			"date": "1405/06/14",
			"supplier": "تأمین عدس دزفول",
			"product": "لپه",
			"kg": 150,
			"price": 8e4,
			"freight": 11e5,
			"quality": "متوسط",
			"status": "تأیید شده",
			"note": "با کمی نخاله"
		},
		{
			"date": "1405/06/16",
			"supplier": "کشت و صنعت لرستان",
			"product": "لوبیا سفید",
			"kg": 180,
			"price": 9e4,
			"freight": 13e5,
			"quality": "عالی",
			"status": "تأیید شده",
			"note": ""
		},
		{
			"date": "1405/06/17",
			"supplier": "اتحادیه نخود کوهدشت",
			"product": "ماش",
			"kg": 80,
			"price": 72e3,
			"freight": 7e5,
			"quality": "خوب",
			"status": "در انتظار",
			"note": "هنوز کنترل کیفیت نشده"
		}
	],
	production: [
		{
			"date": "1405/05/22",
			"product": "لوبیا چیتی",
			"inputKg": 80,
			"cleanKg": 77.2,
			"packKg": .9,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/05/25",
			"product": "عدس",
			"inputKg": 40,
			"cleanKg": 38.4,
			"packKg": .4,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/06/03",
			"product": "لوبیا چیتی",
			"inputKg": 120,
			"cleanKg": 116.4,
			"packKg": .4,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/06/03",
			"product": "لوبیا چیتی",
			"inputKg": 80,
			"cleanKg": 77.6,
			"packKg": .9,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/06/05",
			"product": "نخود",
			"inputKg": 100,
			"cleanKg": 96.5,
			"packKg": .9,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/06/05",
			"product": "نخود",
			"inputKg": 60,
			"cleanKg": 58.2,
			"packKg": .4,
			"operator": "پدر مدیر",
			"note": "کمک تولید"
		},
		{
			"date": "1405/06/08",
			"product": "عدس",
			"inputKg": 90,
			"cleanKg": 86.4,
			"packKg": .4,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/06/09",
			"product": "عدس",
			"inputKg": 70,
			"cleanKg": 64,
			"packKg": .9,
			"operator": "مسئول بسته‌بندی",
			"note": "ضایعات بالاتر از معمول"
		},
		{
			"date": "1405/06/11",
			"product": "لوبیا قرمز",
			"inputKg": 80,
			"cleanKg": 77.2,
			"packKg": .4,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/06/12",
			"product": "لوبیا قرمز",
			"inputKg": 70,
			"cleanKg": 67.5,
			"packKg": .9,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/06/13",
			"product": "لوبیا چیتی",
			"inputKg": 100,
			"cleanKg": 97,
			"packKg": 10,
			"operator": "پدر مدیر",
			"note": "بسته ۱۰ کیلویی عمده"
		},
		{
			"date": "1405/06/15",
			"product": "لپه",
			"inputKg": 80,
			"cleanKg": 76.8,
			"packKg": .9,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/06/16",
			"product": "لوبیا سفید",
			"inputKg": 90,
			"cleanKg": 87.3,
			"packKg": .4,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		},
		{
			"date": "1405/06/17",
			"product": "نخود",
			"inputKg": 50,
			"cleanKg": 48.5,
			"packKg": 10,
			"operator": "پدر مدیر",
			"note": ""
		},
		{
			"date": "1405/06/18",
			"product": "لوبیا چیتی",
			"inputKg": 60,
			"cleanKg": 57.6,
			"packKg": .9,
			"operator": "مسئول بسته‌بندی",
			"note": ""
		}
	],
	sales: [
		{
			"date": "1405/05/26",
			"customer": "سوپرمارکت رضایی",
			"city": "پلدختر",
			"product": "لوبیا چیتی",
			"packKg": .9,
			"qty": 40,
			"unitPrice": 98e3,
			"discount": 0,
			"collected": 392e4,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/05/28",
			"customer": "خواربار محمدی",
			"city": "پلدختر",
			"product": "عدس",
			"packKg": .4,
			"qty": 50,
			"unitPrice": 42e3,
			"discount": 0,
			"collected": 21e5,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/04",
			"customer": "سوپرمارکت رضایی",
			"city": "پلدختر",
			"product": "لوبیا چیتی",
			"packKg": .4,
			"qty": 80,
			"unitPrice": 46e3,
			"discount": 8e4,
			"collected": 36e5,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/04",
			"customer": "سوپرمارکت رضایی",
			"city": "پلدختر",
			"product": "نخود",
			"packKg": .9,
			"qty": 30,
			"unitPrice": 82e3,
			"discount": 0,
			"collected": 246e4,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/05",
			"customer": "فروشگاه رفاه خرم‌آباد",
			"city": "خرم‌آباد",
			"product": "لوبیا چیتی",
			"packKg": 10,
			"qty": 8,
			"unitPrice": 98e4,
			"discount": 0,
			"collected": 784e4,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/06",
			"customer": "خواربار محمدی",
			"city": "پلدختر",
			"product": "عدس",
			"packKg": .4,
			"qty": 60,
			"unitPrice": 43e3,
			"discount": 0,
			"collected": 258e4,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/07",
			"customer": "عمده‌فروشی حسینی",
			"city": "کوهدشت",
			"product": "نخود",
			"packKg": 10,
			"qty": 6,
			"unitPrice": 72e4,
			"discount": 2e5,
			"collected": 25e5,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/08",
			"customer": "مغازه میدان",
			"city": "پلدختر",
			"product": "لوبیا قرمز",
			"packKg": .4,
			"qty": 40,
			"unitPrice": 44e3,
			"discount": 0,
			"collected": 176e4,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/09",
			"customer": "رستوران زاگرس",
			"city": "خرم‌آباد",
			"product": "عدس",
			"packKg": .9,
			"qty": 25,
			"unitPrice": 88e3,
			"discount": 0,
			"collected": 0,
			"seller": "مدیر کارگاه"
		},
		{
			"date": "1405/06/10",
			"customer": "سوپر ستاره معمولان",
			"city": "معمولان",
			"product": "لوبیا چیتی",
			"packKg": .9,
			"qty": 35,
			"unitPrice": 1e5,
			"discount": 5e4,
			"collected": 2e6,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/11",
			"customer": "تعاونی مصرف فرهنگیان",
			"city": "پلدختر",
			"product": "لپه",
			"packKg": .9,
			"qty": 20,
			"unitPrice": 92e3,
			"discount": 0,
			"collected": 184e4,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/12",
			"customer": "خواربار احمدی رومشکان",
			"city": "رومشکان",
			"product": "لوبیا قرمز",
			"packKg": .9,
			"qty": 28,
			"unitPrice": 96e3,
			"discount": 0,
			"collected": 15e5,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/13",
			"customer": "عمده‌فروشی حسینی",
			"city": "کوهدشت",
			"product": "لوبیا چیتی",
			"packKg": 10,
			"qty": 5,
			"unitPrice": 99e4,
			"discount": 0,
			"collected": 0,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/14",
			"customer": "سوپرمارکت رضایی",
			"city": "پلدختر",
			"product": "لوبیا سفید",
			"packKg": .4,
			"qty": 45,
			"unitPrice": 47e3,
			"discount": 0,
			"collected": 2115e3,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/15",
			"customer": "فروشگاه رفاه خرم‌آباد",
			"city": "خرم‌آباد",
			"product": "نخود",
			"packKg": .9,
			"qty": 40,
			"unitPrice": 84e3,
			"discount": 1e5,
			"collected": 2e6,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/16",
			"customer": "پخش مواد غذایی کرمی",
			"city": "اندیمشک",
			"product": "لوبیا چیتی",
			"packKg": .9,
			"qty": 50,
			"unitPrice": 99e3,
			"discount": 0,
			"collected": 3e6,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/17",
			"customer": "مغازه میدان",
			"city": "پلدختر",
			"product": "عدس",
			"packKg": .4,
			"qty": 35,
			"unitPrice": 43e3,
			"discount": 0,
			"collected": 1505e3,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/18",
			"customer": "سوپر ستاره معمولان",
			"city": "معمولان",
			"product": "لپه",
			"packKg": .9,
			"qty": 18,
			"unitPrice": 93e3,
			"discount": 0,
			"collected": 0,
			"seller": "ویزیتور پخش"
		},
		{
			"date": "1405/06/18",
			"customer": "خواربار محمدی",
			"city": "پلدختر",
			"product": "ماش",
			"packKg": .4,
			"qty": 20,
			"unitPrice": 4e4,
			"discount": 0,
			"collected": 8e5,
			"seller": "ویزیتور پخش"
		}
	],
	customers: [
		{
			"name": "سوپرمارکت رضایی",
			"phone": "0916-111-2201",
			"city": "پلدختر",
			"address": "خیابان امام، پلاک ۱۲",
			"type": "سوپرمارکت",
			"lastVisit": "1405/06/04",
			"status": "فعال",
			"note": "مشتری ثابت هفتگی"
		},
		{
			"name": "خواربار محمدی",
			"phone": "0916-222-3302",
			"city": "پلدختر",
			"address": "بازار روز، دهنه ۳",
			"type": "خرده‌فروش",
			"lastVisit": "1405/06/17",
			"status": "فعال",
			"note": ""
		},
		{
			"name": "فروشگاه رفاه خرم‌آباد",
			"phone": "0916-333-4403",
			"city": "خرم‌آباد",
			"address": "بلوار شریعتی",
			"type": "سوپرمارکت",
			"lastVisit": "1405/06/15",
			"status": "فعال",
			"note": "سفارش عمده"
		},
		{
			"name": "عمده‌فروشی حسینی",
			"phone": "0916-444-5504",
			"city": "کوهدشت",
			"address": "جاده پلدختر",
			"type": "عمده‌فروش",
			"lastVisit": "1405/06/13",
			"status": "فعال",
			"note": "پرداخت نسیه — پیگیری وصول"
		},
		{
			"name": "مغازه میدان",
			"phone": "0916-555-6605",
			"city": "پلدختر",
			"address": "میدان مرکزی",
			"type": "خرده‌فروش",
			"lastVisit": "1405/06/17",
			"status": "فعال",
			"note": ""
		},
		{
			"name": "رستوران زاگرس",
			"phone": "0916-666-7706",
			"city": "خرم‌آباد",
			"address": "بلوار ولایت",
			"type": "رستوران",
			"lastVisit": "1405/06/09",
			"status": "فعال",
			"note": "مشتری جدید — هنوز وصول نشده"
		},
		{
			"name": "سوپر ستاره معمولان",
			"phone": "0916-777-8807",
			"city": "معمولان",
			"address": "خیابان اصلی",
			"type": "سوپرمارکت",
			"lastVisit": "1405/06/18",
			"status": "فعال",
			"note": "مشتری جدید"
		},
		{
			"name": "تعاونی مصرف فرهنگیان",
			"phone": "0916-888-9908",
			"city": "پلدختر",
			"address": "نزدیک آموزش و پرورش",
			"type": "خرده‌فروش",
			"lastVisit": "1405/06/11",
			"status": "فعال",
			"note": ""
		},
		{
			"name": "خواربار احمدی رومشکان",
			"phone": "0916-999-1010",
			"city": "رومشکان",
			"address": "بازار رومشکان",
			"type": "خرده‌فروش",
			"lastVisit": "1405/06/12",
			"status": "فعال",
			"note": "مشتری جدید"
		},
		{
			"name": "پخش مواد غذایی کرمی",
			"phone": "0916-101-1212",
			"city": "اندیمشک",
			"address": "جاده اندیمشک",
			"type": "عمده‌فروش",
			"lastVisit": "1405/06/16",
			"status": "فعال",
			"note": "مسیر جدید ویزیت"
		},
		{
			"name": "سوپر امید کوهدشت",
			"phone": "0916-131-1414",
			"city": "کوهدشت",
			"address": "فلکه مرکزی",
			"type": "سوپرمارکت",
			"lastVisit": "1405/05/10",
			"status": "بالقوه",
			"note": "ویزیت شده، هنوز خرید نکرده"
		},
		{
			"name": "خواربار روستایی چم مهر",
			"phone": "0916-151-1616",
			"city": "پلدختر",
			"address": "چم مهر",
			"type": "خرده‌فروش",
			"lastVisit": "",
			"status": "بالقوه",
			"note": "در برنامه ویزیت هفته بعد"
		}
	],
	visits: [
		{
			"date": "1405/06/04",
			"region": "پلدختر شهر",
			"planned": 8,
			"visited": 7,
			"orders": 3,
			"orderAmount": 714e4,
			"newCustomers": 0,
			"collected": 606e4,
			"km": 42,
			"fuel": 42e4,
			"note": ""
		},
		{
			"date": "1405/06/05",
			"region": "خرم‌آباد",
			"planned": 6,
			"visited": 5,
			"orders": 1,
			"orderAmount": 784e4,
			"newCustomers": 0,
			"collected": 784e4,
			"km": 118,
			"fuel": 11e5,
			"note": ""
		},
		{
			"date": "1405/06/07",
			"region": "کوهدشت",
			"planned": 7,
			"visited": 6,
			"orders": 1,
			"orderAmount": 412e4,
			"newCustomers": 0,
			"collected": 25e5,
			"km": 95,
			"fuel": 9e5,
			"note": "یکی از مشتری‌ها نبود"
		},
		{
			"date": "1405/06/08",
			"region": "پلدختر شهر",
			"planned": 6,
			"visited": 6,
			"orders": 2,
			"orderAmount": 176e4,
			"newCustomers": 0,
			"collected": 176e4,
			"km": 38,
			"fuel": 38e4,
			"note": ""
		},
		{
			"date": "1405/06/09",
			"region": "خرم‌آباد",
			"planned": 5,
			"visited": 4,
			"orders": 1,
			"orderAmount": 22e5,
			"newCustomers": 1,
			"collected": 0,
			"km": 120,
			"fuel": 115e4,
			"note": "رستوران زاگرس مشتری جدید"
		},
		{
			"date": "1405/06/10",
			"region": "معمولان",
			"planned": 5,
			"visited": 4,
			"orders": 1,
			"orderAmount": 345e4,
			"newCustomers": 1,
			"collected": 2e6,
			"km": 55,
			"fuel": 52e4,
			"note": ""
		},
		{
			"date": "1405/06/11",
			"region": "پلدختر شهر",
			"planned": 6,
			"visited": 5,
			"orders": 1,
			"orderAmount": 184e4,
			"newCustomers": 0,
			"collected": 184e4,
			"km": 40,
			"fuel": 4e5,
			"note": ""
		},
		{
			"date": "1405/06/12",
			"region": "رومشکان",
			"planned": 5,
			"visited": 3,
			"orders": 1,
			"orderAmount": 2688e3,
			"newCustomers": 1,
			"collected": 15e5,
			"km": 70,
			"fuel": 68e4,
			"note": "جاده خراب — ۳ ویزیت جا ماند"
		},
		{
			"date": "1405/06/13",
			"region": "کوهدشت",
			"planned": 6,
			"visited": 5,
			"orders": 1,
			"orderAmount": 495e4,
			"newCustomers": 0,
			"collected": 0,
			"km": 98,
			"fuel": 94e4,
			"note": "عمده‌فروشی نسیه گرفت"
		},
		{
			"date": "1405/06/14",
			"region": "پلدختر شهر",
			"planned": 5,
			"visited": 5,
			"orders": 1,
			"orderAmount": 2115e3,
			"newCustomers": 0,
			"collected": 2115e3,
			"km": 35,
			"fuel": 35e4,
			"note": ""
		},
		{
			"date": "1405/06/15",
			"region": "خرم‌آباد",
			"planned": 6,
			"visited": 5,
			"orders": 1,
			"orderAmount": 326e4,
			"newCustomers": 0,
			"collected": 2e6,
			"km": 122,
			"fuel": 118e4,
			"note": ""
		},
		{
			"date": "1405/06/16",
			"region": "اندیمشک",
			"planned": 4,
			"visited": 3,
			"orders": 1,
			"orderAmount": 495e4,
			"newCustomers": 1,
			"collected": 3e6,
			"km": 145,
			"fuel": 14e5,
			"note": "مسیر جدید"
		},
		{
			"date": "1405/06/17",
			"region": "پلدختر شهر",
			"planned": 7,
			"visited": 6,
			"orders": 2,
			"orderAmount": 2305e3,
			"newCustomers": 0,
			"collected": 2305e3,
			"km": 44,
			"fuel": 44e4,
			"note": ""
		},
		{
			"date": "1405/06/18",
			"region": "معمولان",
			"planned": 5,
			"visited": 4,
			"orders": 1,
			"orderAmount": 1674e3,
			"newCustomers": 0,
			"collected": 8e5,
			"km": 58,
			"fuel": 55e4,
			"note": ""
		}
	],
	expenses: [
		{
			"date": "1405/06/01",
			"type": "اجاره",
			"amount": 4e6,
			"payer": "مدیر کارگاه",
			"method": "نقد",
			"note": "اجاره سوله شهریور"
		},
		{
			"date": "1405/06/01",
			"type": "حقوق",
			"amount": 18e6,
			"payer": "مدیر کارگاه",
			"method": "نقد",
			"note": "حقوق مدیر"
		},
		{
			"date": "1405/06/01",
			"type": "حقوق",
			"amount": 8e6,
			"payer": "مدیر کارگاه",
			"method": "نقد",
			"note": "حقوق مسئول انبار"
		},
		{
			"date": "1405/06/01",
			"type": "حقوق",
			"amount": 9e6,
			"payer": "مدیر کارگاه",
			"method": "نقد",
			"note": "حقوق بسته‌بندی"
		},
		{
			"date": "1405/06/01",
			"type": "حقوق",
			"amount": 1e7,
			"payer": "مدیر کارگاه",
			"method": "نقد",
			"note": "حقوق ویزیتور — بدون پورسانت"
		},
		{
			"date": "1405/06/05",
			"type": "برق",
			"amount": 18e5,
			"payer": "پدر مدیر",
			"method": "کارت",
			"note": "قبض برق"
		},
		{
			"date": "1405/06/08",
			"type": "بسته‌بندی",
			"amount": 32e5,
			"payer": "مدیر کارگاه",
			"method": "نقد",
			"note": "نایلون و کارتن"
		},
		{
			"date": "1405/06/12",
			"type": "تعمیرات",
			"amount": 75e4,
			"payer": "پدر مدیر",
			"method": "نقد",
			"note": "تنظیم ترازو"
		},
		{
			"date": "1405/06/15",
			"type": "گاز",
			"amount": 6e5,
			"payer": "پدر مدیر",
			"method": "کارت",
			"note": ""
		},
		{
			"date": "1405/06/16",
			"type": "سوخت",
			"amount": 14e5,
			"payer": "ویزیتور پخش",
			"method": "نقد",
			"note": "باک ماشین پخش"
		},
		{
			"date": "1405/06/18",
			"type": "آب",
			"amount": 25e4,
			"payer": "پدر مدیر",
			"method": "کارت",
			"note": ""
		}
	],
	suppliers: [
		{
			"name": "کشاورز بروجرد",
			"phone": "0916-200-1111",
			"city": "بروجرد",
			"product": "لوبیا چیتی",
			"price": 92e3,
			"quality": "عالی",
			"payTerms": "نقد",
			"days": 2,
			"scorePrice": 8,
			"scoreQuality": 9,
			"scoreDelivery": 9,
			"scoreStability": 8,
			"scorePay": 7,
			"status": "تأیید شده",
			"note": "تأمین‌کننده اصلی لوبیا"
		},
		{
			"name": "اتحادیه نخود کوهدشت",
			"phone": "0916-200-2222",
			"city": "کوهدشت",
			"product": "نخود",
			"price": 68e3,
			"quality": "خوب",
			"payTerms": "چک ۱۰ روزه",
			"days": 3,
			"scorePrice": 9,
			"scoreQuality": 8,
			"scoreDelivery": 8,
			"scoreStability": 8,
			"scorePay": 8,
			"status": "تأیید شده",
			"note": ""
		},
		{
			"name": "بازرگانی حبوبات خرم‌آباد",
			"phone": "0916-200-3333",
			"city": "خرم‌آباد",
			"product": "عدس",
			"price": 76e3,
			"quality": "خوب",
			"payTerms": "نقد",
			"days": 1,
			"scorePrice": 7,
			"scoreQuality": 8,
			"scoreDelivery": 9,
			"scoreStability": 7,
			"scorePay": 7,
			"status": "تأیید شده",
			"note": ""
		},
		{
			"name": "تأمین عدس دزفول",
			"phone": "0916-200-4444",
			"city": "دزفول",
			"product": "عدس",
			"price": 79e3,
			"quality": "متوسط",
			"payTerms": "نقد",
			"days": 4,
			"scorePrice": 6,
			"scoreQuality": 5,
			"scoreDelivery": 6,
			"scoreStability": 5,
			"scorePay": 6,
			"status": "در انتظار",
			"note": "یک بار رد شده"
		},
		{
			"name": "کشت و صنعت لرستان",
			"phone": "0916-200-5555",
			"city": "خرم‌آباد",
			"product": "لوبیا سفید",
			"price": 9e4,
			"quality": "عالی",
			"payTerms": "چک ۲۰ روزه",
			"days": 5,
			"scorePrice": 7,
			"scoreQuality": 9,
			"scoreDelivery": 7,
			"scoreStability": 8,
			"scorePay": 9,
			"status": "تأیید شده",
			"note": ""
		},
		{
			"name": "موجودی اول دوره",
			"phone": "—",
			"city": "پلدختر",
			"product": "همه",
			"price": 0,
			"quality": "خوب",
			"payTerms": "—",
			"days": 0,
			"scorePrice": 8,
			"scoreQuality": 8,
			"scoreDelivery": 8,
			"scoreStability": 8,
			"scorePay": 8,
			"status": "تأیید شده",
			"note": "ردیف سیستمی — حذف نشود"
		}
	],
	employees: [
		{
			"name": "مدیر کارگاه",
			"role": "مدیر/مالک",
			"duties": "خرید، فروش، مالی، تصمیم‌گیری و کنترل سیستم",
			"salary": 18e6,
			"commissionRate": 0,
			"start": "1403/01/01",
			"status": "فعال",
			"note": "مالک کارگاه"
		},
		{
			"name": "پدر مدیر",
			"role": "مسئول انبار",
			"duties": "کارهای سبک، کنترل انبار و کمک به تولید",
			"salary": 8e6,
			"commissionRate": 0,
			"start": "1403/01/01",
			"status": "فعال",
			"note": ""
		},
		{
			"name": "مسئول بسته‌بندی",
			"role": "نیروی تولید",
			"duties": "پاک‌کنی و بسته‌بندی",
			"salary": 9e6,
			"commissionRate": 0,
			"start": "1404/02/15",
			"status": "فعال",
			"note": "نیروی خانم"
		},
		{
			"name": "ویزیتور پخش",
			"role": "ویزیتور",
			"duties": "ویزیت، فروش و پخش با ماشین شرکت",
			"salary": 1e7,
			"commissionRate": .02,
			"start": "1404/03/01",
			"status": "فعال",
			"note": "نیروی آقا — پورسانت ۲٪ روی فروش وصول‌شده"
		}
	],
	inventoryMoves: [{
		"date": "1405/06/09",
		"kind": "مواد اولیه",
		"product": "عدس",
		"inn": 0,
		"out": 2.5,
		"unit": "کیلوگرم",
		"loc": "سالن تولید",
		"reason": "نمونه کنترل کیفیت"
	}, {
		"date": "1405/06/13",
		"kind": "محصول نهایی",
		"product": "لوبیا چیتی",
		"inn": 0,
		"out": 1,
		"unit": "کیلوگرم",
		"loc": "انبار محصول نهایی",
		"reason": "پارگی بسته — ضایعات"
	}],
	kpis: [
		{
			"key": "sales_day",
			"name": "فروش روزانه",
			"green": 3e6,
			"yellow": 15e5,
			"direction": "higher",
			"unit": "تومان",
			"actionRed": "امروز فروش ضعیف است. با ویزیتور تماس بگیرید و مسیر را چک کنید.",
			"actionYellow": "فروش امروز کمتر از هدف است؛ اگر قبل از ظهر است نگران نباشید."
		},
		{
			"key": "sales_month",
			"name": "فروش ماهانه",
			"green": 8e7,
			"yellow": 5e7,
			"direction": "higher",
			"unit": "تومان",
			"actionRed": "فروش ماه از کف فاصله گرفته. برنامه ویزیت و تخفیف هدفمند بگذارید.",
			"actionYellow": "فروش ماه زیر هدف است. تا پایان ماه روی مشتری‌های A تمرکز کنید."
		},
		{
			"key": "gross_profit",
			"name": "سود ناخالص",
			"green": 15e6,
			"yellow": 3e6,
			"direction": "higher",
			"unit": "تومان",
			"actionRed": "سود ناکافی است. قیمت خرید یا فروش یا هزینه‌ها را بازبینی کنید.",
			"actionYellow": "سود نازک شده؛ میانگین قیمت خرید را با ماه قبل مقایسه کنید."
		},
		{
			"key": "purchases",
			"name": "خرید مواد اولیه",
			"green": null,
			"yellow": null,
			"direction": "info",
			"unit": "تومان",
			"actionRed": "",
			"actionYellow": ""
		},
		{
			"key": "raw_stock",
			"name": "موجودی مواد اولیه",
			"green": 200,
			"yellow": 80,
			"direction": "higher",
			"unit": "کیلوگرم",
			"actionRed": "مواد اولیه رو به اتمام است. امروز خرید هماهنگ کنید.",
			"actionYellow": "موجودی مواد کم است؛ تأمین‌کننده را خبر کنید."
		},
		{
			"key": "fin_stock",
			"name": "موجودی محصول نهایی",
			"green": 80,
			"yellow": 30,
			"direction": "higher",
			"unit": "کیلوگرم",
			"actionRed": "محصول آماده کم است. خط تولید را اولویت بدهید.",
			"actionYellow": "موجودی محصول در حال کاهش است."
		},
		{
			"key": "production",
			"name": "مقدار تولید",
			"green": 700,
			"yellow": 350,
			"direction": "higher",
			"unit": "کیلوگرم",
			"actionRed": "تولید این ماه کم است. برنامه پاک‌کنی و بسته‌بندی را ببینید.",
			"actionYellow": "تولید زیر هدف ماه است."
		},
		{
			"key": "waste",
			"name": "درصد ضایعات",
			"green": .03,
			"yellow": .06,
			"direction": "lower",
			"unit": "درصد",
			"actionRed": "ضایعات بحرانی است. کیفیت خرید و کار پاک‌کنی را همان امروز بررسی کنید.",
			"actionYellow": "ضایعات بالاتر از حد مطلوب است؛ بار مشکوک را جدا کنید."
		},
		{
			"key": "orders",
			"name": "تعداد سفارش‌ها",
			"green": 15,
			"yellow": 8,
			"direction": "higher",
			"unit": "عدد",
			"actionRed": "سفارش کم است. ویزیتور باید مسیرهای خوابیده را بیدار کند.",
			"actionYellow": "تعداد سفارش زیر هدف است."
		},
		{
			"key": "new_cust",
			"name": "مشتریان جدید",
			"green": 3,
			"yellow": 1,
			"direction": "higher",
			"unit": "نفر",
			"actionRed": "مشتری جدید جذب نشده. یک نیم‌روز را به مشتری‌یابی اختصاص دهید.",
			"actionYellow": "جذب مشتری جدید کند است."
		},
		{
			"key": "collected",
			"name": "مبلغ وصول‌شده",
			"green": 5e7,
			"yellow": 3e7,
			"direction": "higher",
			"unit": "تومان",
			"actionRed": "وصول ضعیف است. مطالبات مشتری‌های A را امروز پیگیری کنید.",
			"actionYellow": "وصول کمتر از هدف است."
		},
		{
			"key": "receivables",
			"name": "مطالبات",
			"green": 12e6,
			"yellow": 25e6,
			"direction": "lower",
			"unit": "تومان",
			"actionRed": "مطالبات بالاست. تا وصول نشود سفارش نسیه جدید ندهید.",
			"actionYellow": "مطالبات در حال رشد است؛ موعدها را چک کنید."
		},
		{
			"key": "expenses",
			"name": "هزینه‌ها",
			"green": 25e6,
			"yellow": 45e6,
			"direction": "lower",
			"unit": "تومان",
			"actionRed": "هزینه از سقف گذشته. خرید غیرضروری را متوقف کنید.",
			"actionYellow": "هزینه‌ها در حال عبور از هدف است."
		},
		{
			"key": "visit_rate",
			"name": "درصد انجام ویزیت",
			"green": .8,
			"yellow": .6,
			"direction": "higher",
			"unit": "درصد",
			"actionRed": "ویزیت‌ها طبق برنامه نیست. علت جا ماندن مسیر را بپرسید.",
			"actionYellow": "بخشی از ویزیت‌ها انجام نشده."
		},
		{
			"key": "conversion",
			"name": "نرخ تبدیل ویزیت به سفارش",
			"green": .4,
			"yellow": .25,
			"direction": "higher",
			"unit": "درصد",
			"actionRed": "ویزیت به فروش تبدیل نمی‌شود. قیمت، موجودی یا کیفیت را بررسی کنید.",
			"actionYellow": "نرخ تبدیل پایین است."
		},
		{
			"key": "accept_rate",
			"name": "درصد بارهای قبول‌شده",
			"green": .9,
			"yellow": .75,
			"direction": "higher",
			"unit": "درصد",
			"actionRed": "بارهای زیادی رد می‌شود. تأمین‌کننده را عوض یا تذکر دهید.",
			"actionYellow": "کیفیت خرید نوسان دارد."
		}
	],
	lists: {
		"quality": [
			"عالی",
			"خوب",
			"متوسط",
			"ضعیف"
		],
		"approval": [
			"تأیید شده",
			"در انتظار",
			"رد شده"
		],
		"custTypes": [
			"عمده‌فروش",
			"خرده‌فروش",
			"سوپرمارکت",
			"رستوران",
			"مصرف‌کننده"
		],
		"expenseTypes": [
			"حقوق",
			"اجاره",
			"برق",
			"گاز",
			"سوخت",
			"بسته‌بندی",
			"تعمیرات",
			"حمل",
			"آب",
			"متفرقه"
		],
		"payMethods": [
			"نقد",
			"کارت",
			"چک",
			"نسیه"
		],
		"cities": [
			"پلدختر",
			"خرم‌آباد",
			"کوهدشت",
			"رومشکان",
			"معمولان",
			"اندیمشک",
			"دزفول",
			"بروجرد"
		],
		"regions": [
			"پلدختر شهر",
			"پلدختر روستا",
			"خرم‌آباد",
			"کوهدشت",
			"رومشکان",
			"معمولان"
		]
	}
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return crypto.randomUUID();
}
var lists = seed_default.lists;
var PRODUCTS = seed_default.products;
var PACKS = seed_default.packs;
var QUALITY = lists.quality;
var APPROVAL = lists.approval;
var CUST_TYPES = lists.custTypes;
var EXPENSE_TYPES = lists.expenseTypes;
var PAY_METHODS = lists.payMethods;
var CITIES = lists.cities;
var REGIONS = lists.regions;
function withIds(rows) {
	return rows.map((r) => ({
		...r,
		id: uid()
	}));
}
var initialSettings = {
	workshop: seed_default.meta.workshop,
	city: seed_default.meta.city,
	year: seed_default.meta.year,
	month: seed_default.meta.month,
	today: seed_default.meta.today,
	abcA: 2e7,
	abcB: 5e6,
	minRaw: 200,
	minFin: 80
};
function sample() {
	return {
		settings: { ...initialSettings },
		kpiDefs: seed_default.kpis,
		purchases: withIds(seed_default.purchases),
		production: withIds(seed_default.production),
		sales: withIds(seed_default.sales),
		customers: withIds(seed_default.customers),
		visits: withIds(seed_default.visits),
		expenses: withIds(seed_default.expenses),
		suppliers: withIds(seed_default.suppliers),
		employees: withIds(seed_default.employees),
		moves: withIds(seed_default.inventoryMoves)
	};
}
var useWorkshop = create()(persist((set) => ({
	...sample(),
	setSettings: (p) => set((s) => ({ settings: {
		...s.settings,
		...p
	} })),
	setKpiDef: (key, patch) => set((s) => ({ kpiDefs: s.kpiDefs.map((k) => k.key === key ? {
		...k,
		...patch
	} : k) })),
	addPurchase: (row) => set((s) => ({ purchases: [{
		id: uid(),
		...row
	}, ...s.purchases] })),
	addProduction: (row) => set((s) => ({ production: [{
		id: uid(),
		...row
	}, ...s.production] })),
	addSale: (row) => set((s) => ({ sales: [{
		id: uid(),
		...row
	}, ...s.sales] })),
	addCustomer: (row) => set((s) => ({ customers: [{
		id: uid(),
		...row
	}, ...s.customers] })),
	addVisit: (row) => set((s) => ({ visits: [{
		id: uid(),
		...row
	}, ...s.visits] })),
	addExpense: (row) => set((s) => ({ expenses: [{
		id: uid(),
		...row
	}, ...s.expenses] })),
	addSupplier: (row) => set((s) => ({ suppliers: [{
		id: uid(),
		...row
	}, ...s.suppliers] })),
	addEmployee: (row) => set((s) => ({ employees: [{
		id: uid(),
		...row
	}, ...s.employees] })),
	addMove: (row) => set((s) => ({ moves: [{
		id: uid(),
		...row
	}, ...s.moves] })),
	remove: (collection, id) => set((s) => ({ [collection]: s[collection].filter((r) => r.id !== id) })),
	resetSample: () => set(sample())
}), { name: "poldokhtar-workshop-v1" }));
var NAV = [
	{
		to: "/",
		label: "داشبورد",
		icon: LayoutDashboard
	},
	{
		to: "/purchases",
		label: "خرید",
		icon: ShoppingCart
	},
	{
		to: "/inventory",
		label: "انبار",
		icon: Warehouse
	},
	{
		to: "/production",
		label: "تولید",
		icon: Factory
	},
	{
		to: "/sales",
		label: "فروش",
		icon: Package
	},
	{
		to: "/customers",
		label: "مشتریان",
		icon: Users
	},
	{
		to: "/visits",
		label: "ویزیتور",
		icon: Truck
	},
	{
		to: "/expenses",
		label: "هزینه‌ها",
		icon: Wallet
	},
	{
		to: "/suppliers",
		label: "تأمین‌کنندگان",
		icon: ClipboardList
	},
	{
		to: "/employees",
		label: "کارکنان",
		icon: CircleUser
	},
	{
		to: "/forms",
		label: "فرم‌های چاپی",
		icon: Printer
	},
	{
		to: "/guide",
		label: "راهنما",
		icon: BookOpen
	},
	{
		to: "/settings",
		label: "تنظیمات",
		icon: Settings
	}
];
function Shell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const settings = useWorkshop((s) => s.settings);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "no-print fixed inset-y-0 right-0 z-20 hidden w-60 border-l border-border bg-surface md:flex md:flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-5 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-wide text-fg-muted",
						children: "کارگاه بسته‌بندی حبوبات"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-lg font-semibold leading-snug",
						children: "پلدختر"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 overflow-y-auto px-2 py-3",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("mb-0.5 flex h-11 items-center gap-2.5 rounded-[var(--radius-sm)] px-3 text-sm transition-colors duration-[var(--motion-quick)]", active ? "bg-primary text-primary-foreground" : "text-fg-muted hover:bg-muted hover:text-fg"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4 shrink-0",
								strokeWidth: 1.75
							}), item.label]
						}, item.to);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-4 py-3 text-xs text-fg-muted",
					children: [
						"دوره گزارش: ",
						MONTHS[settings.month - 1],
						" ",
						settings.year
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:pr-60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "no-print sticky top-0 z-10 border-b border-border bg-surface/90 backdrop-blur md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between px-4 py-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-fg-muted",
						children: "حبوبات پلدختر"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "سامانه مدیریت کارگاه"
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 overflow-x-auto px-2 pb-2",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: cn("h-9 shrink-0 rounded-full px-3 text-xs leading-9", active ? "bg-primary text-primary-foreground" : "bg-muted text-fg-muted"),
							children: item.label
						}, item.to);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-6xl px-4 py-6 sm:px-6",
				children
			})]
		})]
	});
}
function PageTitle({ title, hint, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl font-semibold tracking-tight",
			children: title
		}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-2xl text-sm text-fg-muted",
			children: hint
		}) : null] }), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: actions
		}) : null]
	});
}
var styles_default = "/assets/styles-B5ACtMwg.css";
var APP_NAME = "سامانه کارگاه پلدختر";
var Route$14 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#2F4A32"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fa",
		dir: "rtl",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$13 = () => import("./routes-yzVP8mAB.mjs");
var Route$13 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./customers-Bl7MllGd.mjs");
var Route$12 = createFileRoute("/customers")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./employees-D7nzSd9Z.mjs");
var Route$11 = createFileRoute("/employees")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./expenses-CSHHgCiO.mjs");
var Route$10 = createFileRoute("/expenses")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./forms-HWHIwZSd.mjs");
var Route$9 = createFileRoute("/forms")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./guide-D2q4gZ4A.mjs");
var Route$8 = createFileRoute("/guide")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./inventory-kK11l8KN.mjs");
var Route$7 = createFileRoute("/inventory")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./production-DTLlcq3q.mjs");
var Route$6 = createFileRoute("/production")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./purchases-DVq87d5n.mjs");
var Route$5 = createFileRoute("/purchases")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./sales-DWy07uLw.mjs");
var Route$4 = createFileRoute("/sales")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./settings-BcV7jZbX.mjs");
var Route$3 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./suppliers-CbdlNreh.mjs");
var Route$2 = createFileRoute("/suppliers")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./visits-BiLeAJHO.mjs");
var Route$1 = createFileRoute("/visits")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./forms._id-BC-sXtPi.mjs");
var Route = createFileRoute("/forms/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var CustomersRoute = Route$12.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => Route$14
});
var EmployeesRoute = Route$11.update({
	id: "/employees",
	path: "/employees",
	getParentRoute: () => Route$14
});
var ExpensesRoute = Route$10.update({
	id: "/expenses",
	path: "/expenses",
	getParentRoute: () => Route$14
});
var FormsRoute = Route$9.update({
	id: "/forms",
	path: "/forms",
	getParentRoute: () => Route$14
});
var GuideRoute = Route$8.update({
	id: "/guide",
	path: "/guide",
	getParentRoute: () => Route$14
});
var InventoryRoute = Route$7.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => Route$14
});
var ProductionRoute = Route$6.update({
	id: "/production",
	path: "/production",
	getParentRoute: () => Route$14
});
var PurchasesRoute = Route$5.update({
	id: "/purchases",
	path: "/purchases",
	getParentRoute: () => Route$14
});
var SalesRoute = Route$4.update({
	id: "/sales",
	path: "/sales",
	getParentRoute: () => Route$14
});
var SettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$14
});
var SuppliersRoute = Route$2.update({
	id: "/suppliers",
	path: "/suppliers",
	getParentRoute: () => Route$14
});
var VisitsRoute = Route$1.update({
	id: "/visits",
	path: "/visits",
	getParentRoute: () => Route$14
});
var FormsRouteChildren = { FormsIdRoute: Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => FormsRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	CustomersRoute,
	EmployeesRoute,
	ExpensesRoute,
	FormsRoute: FormsRoute._addFileChildren(FormsRouteChildren),
	GuideRoute,
	InventoryRoute,
	ProductionRoute,
	PurchasesRoute,
	SalesRoute,
	SettingsRoute,
	SuppliersRoute,
	VisitsRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { packLabel as _, CITIES as a, PACKS as c, QUALITY as d, REGIONS as f, num as g, MONTHS as h, APPROVAL as i, PAY_METHODS as l, cn as m, Route as n, CUST_TYPES as o, useWorkshop as p, PageTitle as r, EXPENSE_TYPES as s, router_exports as t, PRODUCTS as u, pct as v, toman as y };
