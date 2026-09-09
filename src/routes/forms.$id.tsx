import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/store";
import { FORMS } from "@/lib/forms";

export const Route = createFileRoute("/forms/$id")({ component: Page });

function Line({ label }: { label: string }) {
  return (
    <div className="flex min-h-11 items-stretch border border-black">
      <div className="w-44 shrink-0 bg-neutral-100 px-2 py-2 text-center text-sm font-medium">{label}</div>
      <div className="flex-1" />
    </div>
  );
}

function Checks({ items }: { items: string[] }) {
  return (
    <p className="border border-black px-3 py-2 text-sm">
      {items.map((x) => (
        <span key={x} className="ml-4">
          □ {x}
        </span>
      ))}
    </p>
  );
}

function Sign({ a, b }: { a: string; b: string }) {
  return (
    <div className="mt-4 grid grid-cols-2 border border-black">
      <div className="h-20 border-l border-black p-3 text-sm">{a}</div>
      <div className="h-20 p-3 text-sm">{b}</div>
    </div>
  );
}

function Sheet({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <article className="print-page mx-auto max-w-[210mm] bg-white p-6 text-black shadow-sm print:shadow-none">
      <header className="border-2 border-black">
        <p className="bg-neutral-100 py-2 text-center text-sm font-semibold">کارگاه بسته‌بندی حبوبات پلدختر</p>
        <h1 className="py-3 text-center text-xl font-bold">{title}</h1>
        <div className="flex justify-between border-t border-black px-3 py-2 text-sm">
          <span>کد: {code}</span>
          <span>تاریخ: ____ / ____ / ________</span>
        </div>
      </header>
      <div className="mt-3 grid gap-2">{children}</div>
      <p className="mt-4 text-center text-xs text-neutral-600">با خودکار پر شود. هر داده فقط یک‌بار بعداً در Excel ثبت گردد.</p>
    </article>
  );
}

function FormBody({ id }: { id: string }) {
  if (id === "receive") {
    return (
      <Sheet title="فرم دریافت مواد اولیه" code="F-01">
        {["نام تأمین‌کننده", "نوع حبوبات", "وزن (کیلوگرم)", "ضایعات / ناخالصی", "شماره خودرو", "توضیحات"].map((l) => (
          <Line key={l} label={l} />
        ))}
        <Checks items={["عالی", "خوب", "متوسط", "ضعیف"]} />
        <Checks items={["قابل قبول", "مشروط", "رد"]} />
        <Sign a="تأیید مسئول انبار + امضا" b="تأیید مدیر + امضا" />
      </Sheet>
    );
  }
  if (id === "production") {
    return (
      <Sheet title="گزارش تولید روزانه" code="F-02">
        {["محصول", "مقدار ورودی (کیلو)", "مقدار پاک‌شده (کیلو)", "مقدار ضایعات (کیلو)", "تعداد بسته", "نام اپراتور", "ساعت شروع / پایان"].map(
          (l) => (
            <Line key={l} label={l} />
          ),
        )}
        <Checks items={["۴۰۰ گرم", "۹۰۰ گرم", "۱۰ کیلوگرم"]} />
        <Sign a="امضای اپراتور" b="امضای مسئول انبار" />
      </Sheet>
    );
  }
  if (id === "dispatch") {
    return (
      <Sheet title="تحویل محصول به پخش" code="F-03">
        <Line label="نام ویزیتور" />
        <Line label="مقصد / مسیر" />
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr>
              {["ردیف", "محصول", "وزن بسته", "تعداد", "وزن کل"].map((h) => (
                <th key={h} className="border border-black bg-neutral-100 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }, (_, i) => (
              <tr key={i}>
                <td className="h-9 border border-black text-center">{i + 1}</td>
                {Array.from({ length: 4 }, (_, j) => (
                  <td key={j} className="border border-black" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Sign a="تحویل‌دهنده انبار" b="تحویل‌گیرنده ویزیتور" />
      </Sheet>
    );
  }
  if (id === "visit") {
    return (
      <Sheet title="گزارش روزانه ویزیتور" code="F-04">
        {[
          "منطقه / مسیر",
          "ویزیت برنامه‌ریزی‌شده",
          "ویزیت انجام‌شده",
          "مشتریان جدید",
          "تعداد سفارش",
          "مبلغ فروش",
          "مبلغ وصول‌شده",
          "کیلومتر",
          "هزینه سوخت",
          "مشکلات",
        ].map((l) => (
          <Line key={l} label={l} />
        ))}
        <Sign a="امضای ویزیتور" b="تأیید مدیر" />
      </Sheet>
    );
  }
  if (id === "exit") {
    return (
      <Sheet title="خروج کالا" code="F-05">
        <Line label="نام مشتری" />
        <Line label="شهر / آدرس" />
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr>
              {["ردیف", "محصول", "تعداد", "مقدار", "مبلغ"].map((h) => (
                <th key={h} className="border border-black bg-neutral-100 py-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }, (_, i) => (
              <tr key={i}>
                <td className="h-9 border border-black text-center">{i + 1}</td>
                {Array.from({ length: 4 }, (_, j) => (
                  <td key={j} className="border border-black" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Checks items={["وصول کامل", "بخشی", "نسیه"]} />
        <Sign a="تحویل‌دهنده" b="تحویل‌گیرنده مشتری" />
      </Sheet>
    );
  }
  if (id === "count") {
    return (
      <Sheet title="شمارش موجودی" code="F-06">
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr>
              {["محصول", "نوع", "ثبت سیستم", "واقعی", "اختلاف", "علت"].map((h) => (
                <th key={h} className="border border-black bg-neutral-100 py-1.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...PRODUCTS.map((p) => [p, "مواد اولیه"]), ...PRODUCTS.map((p) => [p, "محصول نهایی"])].map(
              ([p, k], i) => (
                <tr key={i}>
                  <td className="h-8 border border-black px-1 text-center">{p}</td>
                  <td className="border border-black text-center">{k}</td>
                  <td className="border border-black" />
                  <td className="border border-black" />
                  <td className="border border-black" />
                  <td className="border border-black" />
                </tr>
              ),
            )}
          </tbody>
        </table>
        <Sign a="تأیید مسئول انبار" b="تأیید مدیر" />
      </Sheet>
    );
  }
  if (id === "expense") {
    return (
      <Sheet title="ثبت هزینه" code="F-07">
        <Checks items={["حقوق", "اجاره", "برق", "گاز", "سوخت", "بسته‌بندی", "تعمیرات", "حمل", "آب", "متفرقه"]} />
        {["مبلغ به عدد", "مبلغ به حروف", "پرداخت‌کننده", "شرح"].map((l) => (
          <Line key={l} label={l} />
        ))}
        <Checks items={["نقد", "کارت", "چک", "نسیه"]} />
        <Sign a="امضای پرداخت‌کننده" b="تأیید مدیر" />
      </Sheet>
    );
  }
  return (
    <Sheet title="ارزیابی تأمین‌کننده" code="F-08">
      <Line label="نام تأمین‌کننده" />
      <Line label="محصول" />
      <table className="w-full border-collapse border border-black text-sm">
        <thead>
          <tr>
            {["معیار", "امتیاز ۱ تا ۱۰", "توضیح"].map((h) => (
              <th key={h} className="border border-black bg-neutral-100 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {["قیمت", "کیفیت", "تحویل به‌موقع", "ثبات تأمین", "شرایط پرداخت"].map((c) => (
            <tr key={c}>
              <td className="h-11 border border-black text-center">{c}</td>
              <td className="border border-black" />
              <td className="border border-black" />
            </tr>
          ))}
        </tbody>
      </table>
      <Checks items={["ادامه همکاری", "تذکر", "قطع همکاری"]} />
      <Sign a="میانگین را در برگه تأمین‌کنندگان وارد کنید" b="امضای مدیر" />
    </Sheet>
  );
}

function Page() {
  const { id } = Route.useParams();
  const meta = FORMS.find((f) => f.id === id);
  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link to="/forms" className="text-sm text-fg-muted hover:text-fg">
          بازگشت به فهرست فرم‌ها
        </Link>
        <div className="flex gap-2">
          <span className="text-sm text-fg-muted">{meta?.title}</span>
          <button
            type="button"
            onClick={() => window.print()}
            className="h-11 rounded-[var(--radius-sm)] bg-primary px-4 text-sm text-primary-foreground"
          >
            چاپ این فرم
          </button>
        </div>
      </div>
      <FormBody id={id} />
    </div>
  );
}
