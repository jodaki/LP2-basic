import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shell";
import { Panel } from "@/components/journal";

export const Route = createFileRoute("/guide")({ component: Page });

function Page() {
  return (
    <div>
      <PageTitle
        title="راهنمای استفاده"
        hint="هدف: مدیر در کمتر از ۱۰ دقیقه بفهمد چه چیزی خوب است، چه چیزی مشکل دارد، و کجا باید دخالت کند."
        actions={
          <a href="/files/workshop.xlsx" download="سامانه-مدیریت-کارگاه-حبوبات-پلدختر.xlsx">
            <Button>
              <Download className="size-4" />
              دانلود Excel
            </Button>
          </a>
        }
      />

      <Panel className="mb-4">
        <h3 className="mb-3 font-semibold">هر کس چه چیزی را وارد می‌کند</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-fg-muted">
                <th className="pb-2 text-right font-medium">شخص</th>
                <th className="pb-2 text-right font-medium">برگه Excel / صفحه</th>
                <th className="pb-2 text-right font-medium">فرم کاغذی</th>
                <th className="pb-2 text-right font-medium">ننویسد</th>
              </tr>
            </thead>
            <tbody className="[&_td]:py-2 [&_td]:align-top">
              <tr>
                <td>مدیر / مالک</td>
                <td>خرید، تنظیمات، داشبورد</td>
                <td>تأیید خرید و هزینه</td>
                <td>فرمول‌های خاکستری</td>
              </tr>
              <tr>
                <td>پدر مدیر</td>
                <td>انبار + کمک تولید</td>
                <td>دریافت مواد، شمارش موجودی</td>
                <td>خرید و فروش تکراری</td>
              </tr>
              <tr>
                <td>نیروی بسته‌بندی</td>
                <td>تولید (یا فقط فرم کاغذی)</td>
                <td>گزارش تولید روزانه</td>
                <td>درصد ضایعات</td>
              </tr>
              <tr>
                <td>ویزیتور</td>
                <td>فروش، ویزیت، مشتریان</td>
                <td>ویزیت، خروج کالا، تحویل پخش</td>
                <td>مانده حساب</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="mb-4">
        <h3 className="mb-3 font-semibold">روال ۱۰ دقیقه‌ای مدیر</h3>
        <ol className="grid gap-2 text-sm leading-6">
          <li>۱. در تنظیمات، تاریخ امروز و اگر ماه عوض شده ماه جاری را به‌روز کنید.</li>
          <li>۲. فرم‌های کاغذی دیروز را به مسئول مربوطه بدهید تا در سامانه / Excel بزند.</li>
          <li>۳. داشبورد را باز کنید و فقط نوار رنگی بالا و چراغ‌ها را بخوانید.</li>
          <li>۴. اگر همه مطلوب است، صفحه را ببندید. لازم نیست فرم‌ها را خط‌به‌خط بخوانید.</li>
          <li>۵. زرد: تا پایان هفته زیر نظر. قرمز: متن اقدام همان ردیف را همان روز اجرا کنید.</li>
          <li>۶. چرخه: ثبت → KPI → داشبورد → انحراف → اقدام → در صورت نیاز اصلاح هدف.</li>
        </ol>
      </Panel>

      <Panel className="mb-4">
        <h3 className="mb-3 font-semibold">قوانین مهم Excel</h3>
        <ul className="grid gap-2 text-sm leading-6">
          <li>تاریخ را با اعداد انگلیسی بنویسید: 1405/06/18 نه ۱۴۰۵/۶/۱۸.</li>
          <li>سلول کرم = ورود اطلاعات. سلول خاکستری = فرمول. فرمول را پاک نکنید.</li>
          <li>رمز برگه‌های قفل‌شده خالی است؛ از Review می‌توان Unprotect کرد.</li>
          <li>وزن بسته: 0.4 = ۴۰۰ گرم، 0.9 = ۹۰۰ گرم، 10 = کیسه ۱۰ کیلویی.</li>
          <li>واحد پول همه جا تومان است.</li>
          <li>سود ناخالص = فروش ماه − خرید تأییدشده ماه − هزینه‌های ماه.</li>
          <li>داده نمونه شهریور ۱۴۰۵ داخل فایل است تا چراغ‌ها دیده شوند. قبل از کار واقعی پاک کنید یا از روی یک کپی کار کنید.</li>
        </ul>
      </Panel>

      <Panel>
        <h3 className="mb-3 font-semibold">فایل‌های گوگل درایو</h3>
        <ul className="grid gap-2 text-sm">
          <li>
            <a className="underline" href="https://drive.google.com/drive/folders/1gwnjZUn2pP7u7EqQvHdQdX3xm5VuFy8R" target="_blank" rel="noreferrer">
              پوشه سامانه مدیریت کارگاه حبوبات پلدختر
            </a>
          </li>
          <li>
            <a className="underline" href="https://docs.google.com/spreadsheets/d/18HdPBhiZurOtNoLM2jZJWtrPXc1ynmVzlmJpC1K7ipU/edit" target="_blank" rel="noreferrer">
              نسخه گوگل‌شیت (ویرایش در مرورگر)
            </a>
          </li>
          <li>
            <a className="underline" href="https://drive.google.com/file/d/1rkDRR3Wuayd4bCTvwxldkXUG6qQSwkKY/view" target="_blank" rel="noreferrer">
              فرم‌های کاغذی A4 (PDF)
            </a>
          </li>
        </ul>
      </Panel>
    </div>
  );
}
