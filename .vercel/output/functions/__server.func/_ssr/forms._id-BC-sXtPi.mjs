import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route, u as PRODUCTS } from "./router-BUaE4XGK.mjs";
import { t as FORMS } from "./forms-vDtA7q8c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forms._id-BC-sXtPi.js
var import_jsx_runtime = require_jsx_runtime();
function Line({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-11 items-stretch border border-black",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-44 shrink-0 bg-neutral-100 px-2 py-2 text-center text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" })]
	});
}
function Checks({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "border border-black px-3 py-2 text-sm",
		children: items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "ml-4",
			children: ["□ ", x]
		}, x))
	});
}
function Sign({ a, b }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 grid grid-cols-2 border border-black",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-20 border-l border-black p-3 text-sm",
			children: a
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-20 p-3 text-sm",
			children: b
		})]
	});
}
function Sheet({ title, code, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "print-page mx-auto max-w-[210mm] bg-white p-6 text-black shadow-sm print:shadow-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-2 border-black",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "bg-neutral-100 py-2 text-center text-sm font-semibold",
						children: "کارگاه بسته‌بندی حبوبات پلدختر"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "py-3 text-center text-xl font-bold",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-t border-black px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["کد: ", code] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تاریخ: ____ / ____ / ________" })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid gap-2",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-xs text-neutral-600",
				children: "با خودکار پر شود. هر داده فقط یک‌بار بعداً در Excel ثبت گردد."
			})
		]
	});
}
function FormBody({ id }) {
	if (id === "receive") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "فرم دریافت مواد اولیه",
		code: "F-01",
		children: [
			[
				"نام تأمین‌کننده",
				"نوع حبوبات",
				"وزن (کیلوگرم)",
				"ضایعات / ناخالصی",
				"شماره خودرو",
				"توضیحات"
			].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: l }, l)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checks, { items: [
				"عالی",
				"خوب",
				"متوسط",
				"ضعیف"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checks, { items: [
				"قابل قبول",
				"مشروط",
				"رد"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sign, {
				a: "تأیید مسئول انبار + امضا",
				b: "تأیید مدیر + امضا"
			})
		]
	});
	if (id === "production") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "گزارش تولید روزانه",
		code: "F-02",
		children: [
			[
				"محصول",
				"مقدار ورودی (کیلو)",
				"مقدار پاک‌شده (کیلو)",
				"مقدار ضایعات (کیلو)",
				"تعداد بسته",
				"نام اپراتور",
				"ساعت شروع / پایان"
			].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: l }, l)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checks, { items: [
				"۴۰۰ گرم",
				"۹۰۰ گرم",
				"۱۰ کیلوگرم"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sign, {
				a: "امضای اپراتور",
				b: "امضای مسئول انبار"
			})
		]
	});
	if (id === "dispatch") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "تحویل محصول به پخش",
		code: "F-03",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: "نام ویزیتور" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: "مقصد / مسیر" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse border border-black text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
					"ردیف",
					"محصول",
					"وزن بسته",
					"تعداد",
					"وزن کل"
				].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "border border-black bg-neutral-100 py-2",
					children: h
				}, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "h-9 border border-black text-center",
					children: i + 1
				}), Array.from({ length: 4 }, (_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black" }, j))] }, i)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sign, {
				a: "تحویل‌دهنده انبار",
				b: "تحویل‌گیرنده ویزیتور"
			})
		]
	});
	if (id === "visit") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "گزارش روزانه ویزیتور",
		code: "F-04",
		children: [[
			"منطقه / مسیر",
			"ویزیت برنامه‌ریزی‌شده",
			"ویزیت انجام‌شده",
			"مشتریان جدید",
			"تعداد سفارش",
			"مبلغ فروش",
			"مبلغ وصول‌شده",
			"کیلومتر",
			"هزینه سوخت",
			"مشکلات"
		].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: l }, l)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sign, {
			a: "امضای ویزیتور",
			b: "تأیید مدیر"
		})]
	});
	if (id === "exit") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "خروج کالا",
		code: "F-05",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: "نام مشتری" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: "شهر / آدرس" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse border border-black text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
					"ردیف",
					"محصول",
					"تعداد",
					"مقدار",
					"مبلغ"
				].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "border border-black bg-neutral-100 py-2",
					children: h
				}, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Array.from({ length: 7 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "h-9 border border-black text-center",
					children: i + 1
				}), Array.from({ length: 4 }, (_, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black" }, j))] }, i)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checks, { items: [
				"وصول کامل",
				"بخشی",
				"نسیه"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sign, {
				a: "تحویل‌دهنده",
				b: "تحویل‌گیرنده مشتری"
			})
		]
	});
	if (id === "count") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "شمارش موجودی",
		code: "F-06",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full border-collapse border border-black text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
				"محصول",
				"نوع",
				"ثبت سیستم",
				"واقعی",
				"اختلاف",
				"علت"
			].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
				className: "border border-black bg-neutral-100 py-1.5",
				children: h
			}, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [...PRODUCTS.map((p) => [p, "مواد اولیه"]), ...PRODUCTS.map((p) => [p, "محصول نهایی"])].map(([p, k], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "h-8 border border-black px-1 text-center",
					children: p
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "border border-black text-center",
					children: k
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black" })
			] }, i)) })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sign, {
			a: "تأیید مسئول انبار",
			b: "تأیید مدیر"
		})]
	});
	if (id === "expense") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "ثبت هزینه",
		code: "F-07",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checks, { items: [
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
			] }),
			[
				"مبلغ به عدد",
				"مبلغ به حروف",
				"پرداخت‌کننده",
				"شرح"
			].map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: l }, l)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checks, { items: [
				"نقد",
				"کارت",
				"چک",
				"نسیه"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sign, {
				a: "امضای پرداخت‌کننده",
				b: "تأیید مدیر"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		title: "ارزیابی تأمین‌کننده",
		code: "F-08",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: "نام تأمین‌کننده" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, { label: "محصول" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse border border-black text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
					"معیار",
					"امتیاز ۱ تا ۱۰",
					"توضیح"
				].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "border border-black bg-neutral-100 py-2",
					children: h
				}, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
					"قیمت",
					"کیفیت",
					"تحویل به‌موقع",
					"ثبات تأمین",
					"شرایط پرداخت"
				].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "h-11 border border-black text-center",
						children: c
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "border border-black" })
				] }, c)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checks, { items: [
				"ادامه همکاری",
				"تذکر",
				"قطع همکاری"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sign, {
				a: "میانگین را در برگه تأمین‌کنندگان وارد کنید",
				b: "امضای مدیر"
			})
		]
	});
}
function Page() {
	const { id } = Route.useParams();
	const meta = FORMS.find((f) => f.id === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "no-print mb-4 flex flex-wrap items-center justify-between gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/forms",
			className: "text-sm text-fg-muted hover:text-fg",
			children: "بازگشت به فهرست فرم‌ها"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-fg-muted",
				children: meta?.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => window.print(),
				className: "h-11 rounded-[var(--radius-sm)] bg-primary px-4 text-sm text-primary-foreground",
				children: "چاپ این فرم"
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormBody, { id })] });
}
//#endregion
export { Page as component };
