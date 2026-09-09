import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as Download } from "../_libs/lucide-react.mjs";
import { r as PageTitle } from "./router-BUaE4XGK.mjs";
import { i as Panel, n as Button } from "./journal-KWw6p0QH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guide-D2q4gZ4A.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageTitle, {
			title: "راهنمای استفاده",
			hint: "هدف: مدیر در کمتر از ۱۰ دقیقه بفهمد چه چیزی خوب است، چه چیزی مشکل دارد، و کجا باید دخالت کند.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/files/workshop.xlsx",
				download: "سامانه-مدیریت-کارگاه-حبوبات-پلدختر.xlsx",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "دانلود Excel"] })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 font-semibold",
				children: "هر کس چه چیزی را وارد می‌کند"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-fg-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 text-right font-medium",
								children: "شخص"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 text-right font-medium",
								children: "برگه Excel / صفحه"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 text-right font-medium",
								children: "فرم کاغذی"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-2 text-right font-medium",
								children: "ننویسد"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "[&_td]:py-2 [&_td]:align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "مدیر / مالک" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "خرید، تنظیمات، داشبورد" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "تأیید خرید و هزینه" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "فرمول‌های خاکستری" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "پدر مدیر" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "انبار + کمک تولید" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "دریافت مواد، شمارش موجودی" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "خرید و فروش تکراری" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "نیروی بسته‌بندی" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "تولید (یا فقط فرم کاغذی)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "گزارش تولید روزانه" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "درصد ضایعات" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "ویزیتور" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "فروش، ویزیت، مشتریان" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "ویزیت، خروج کالا، تحویل پخش" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: "مانده حساب" })
							] })
						]
					})]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 font-semibold",
				children: "روال ۱۰ دقیقه‌ای مدیر"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "grid gap-2 text-sm leading-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "۱. در تنظیمات، تاریخ امروز و اگر ماه عوض شده ماه جاری را به‌روز کنید." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "۲. فرم‌های کاغذی دیروز را به مسئول مربوطه بدهید تا در سامانه / Excel بزند." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "۳. داشبورد را باز کنید و فقط نوار رنگی بالا و چراغ‌ها را بخوانید." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "۴. اگر همه مطلوب است، صفحه را ببندید. لازم نیست فرم‌ها را خط‌به‌خط بخوانید." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "۵. زرد: تا پایان هفته زیر نظر. قرمز: متن اقدام همان ردیف را همان روز اجرا کنید." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "۶. چرخه: ثبت → KPI → داشبورد → انحراف → اقدام → در صورت نیاز اصلاح هدف." })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 font-semibold",
				children: "قوانین مهم Excel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "grid gap-2 text-sm leading-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "تاریخ را با اعداد انگلیسی بنویسید: 1405/06/18 نه ۱۴۰۵/۶/۱۸." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "سلول کرم = ورود اطلاعات. سلول خاکستری = فرمول. فرمول را پاک نکنید." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "رمز برگه‌های قفل‌شده خالی است؛ از Review می‌توان Unprotect کرد." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "وزن بسته: 0.4 = ۴۰۰ گرم، 0.9 = ۹۰۰ گرم، 10 = کیسه ۱۰ کیلویی." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "واحد پول همه جا تومان است." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "سود ناخالص = فروش ماه − خرید تأییدشده ماه − هزینه‌های ماه." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "داده نمونه شهریور ۱۴۰۵ داخل فایل است تا چراغ‌ها دیده شوند. قبل از کار واقعی پاک کنید یا از روی یک کپی کار کنید." })
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 font-semibold",
			children: "فایل‌های گوگل درایو"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "grid gap-2 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "underline",
					href: "https://drive.google.com/drive/folders/1gwnjZUn2pP7u7EqQvHdQdX3xm5VuFy8R",
					target: "_blank",
					rel: "noreferrer",
					children: "پوشه سامانه مدیریت کارگاه حبوبات پلدختر"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "underline",
					href: "https://docs.google.com/spreadsheets/d/18HdPBhiZurOtNoLM2jZJWtrPXc1ynmVzlmJpC1K7ipU/edit",
					target: "_blank",
					rel: "noreferrer",
					children: "نسخه گوگل‌شیت (ویرایش در مرورگر)"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "underline",
					href: "https://drive.google.com/file/d/1rkDRR3Wuayd4bCTvwxldkXUG6qQSwkKY/view",
					target: "_blank",
					rel: "noreferrer",
					children: "فرم‌های کاغذی A4 (PDF)"
				}) })
			]
		})] })
	] });
}
//#endregion
export { Page as component };
