import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { num, pct, toman } from "@/lib/format";
import { CITIES, PRODUCTS, QUALITY, useWorkshop } from "@/lib/store";
import { supplierScore100 } from "@/lib/costing";
import { useSessionProfile } from "@/lib/session";

export const Route = createFileRoute("/suppliers")({ component: Page });

function Page() {
  const { suppliers, purchases } = useWorkshop();
  const { mutate, profile } = useSessionProfile();
  const ranked = [...suppliers]
    .map((s) => ({ s, ...supplierScore100(s, purchases) }))
    .sort((a, b) => b.score - a.score);
  return (
    <div>
      <PageTitle
        title="تأمین‌کنندگان"
        hint="امتیاز از ۱۰۰ بر اساس کیفیت بار، قیمت، تحویل و درصد قبول QC محاسبه می‌شود. بهترین تأمین‌کننده بالای فهرست است."
      />
      <AddForm
        title="تأمین‌کننده جدید"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          void mutate({
            type: "addSupplier",
            row: {
              name: String(f.get("name")),
              phone: String(f.get("phone") || ""),
              city: String(f.get("city")),
              product: String(f.get("product")),
              price: Number(f.get("price") || 0),
              quality: String(f.get("quality")),
              payTerms: String(f.get("payTerms") || ""),
              days: Number(f.get("days") || 0),
              scorePrice: Number(f.get("scorePrice") || 7),
              scoreQuality: Number(f.get("scoreQuality") || 7),
              scoreDelivery: Number(f.get("scoreDelivery") || 7),
              scoreStability: Number(f.get("scoreStability") || 7),
              scorePay: Number(f.get("scorePay") || 7),
              status: "فعال",
              note: String(f.get("note") || ""),
            },
          });
        }}
      >
        <Field label="نام">
          <Input name="name" required />
        </Field>
        <Field label="تلفن">
          <Input name="phone" />
        </Field>
        <Field label="شهر">
          <Select name="city">{CITIES.map((c) => <option key={c}>{c}</option>)}</Select>
        </Field>
        <Field label="محصول">
          <Select name="product">{PRODUCTS.map((p) => <option key={p}>{p}</option>)}</Select>
        </Field>
        <Field label="قیمت شاخص">
          <Input name="price" type="number" />
        </Field>
        <Field label="کیفیت">
          <Select name="quality">{QUALITY.map((q) => <option key={q}>{q}</option>)}</Select>
        </Field>
        <Field label="شرایط پرداخت">
          <Input name="payTerms" />
        </Field>
        <Field label="زمان تحویل (روز)">
          <Input name="days" type="number" />
        </Field>
        <Field label="امتیاز قیمت ۱–۱۰">
          <Input name="scorePrice" type="number" min={1} max={10} defaultValue={7} />
        </Field>
        <Field label="امتیاز کیفیت ۱–۱۰">
          <Input name="scoreQuality" type="number" min={1} max={10} defaultValue={7} />
        </Field>
        <Field label="امتیاز تحویل ۱–۱۰">
          <Input name="scoreDelivery" type="number" min={1} max={10} defaultValue={7} />
        </Field>
        <Field label="امتیاز ثبات ۱–۱۰">
          <Input name="scoreStability" type="number" min={1} max={10} defaultValue={7} />
        </Field>
        <Field label="امتیاز پرداخت ۱–۱۰">
          <Input name="scorePay" type="number" min={1} max={10} defaultValue={7} />
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "n", label: "نام" },
          { key: "c", label: "شهر" },
          { key: "p", label: "محصول" },
          { key: "pr", label: "قیمت" },
          { key: "sc", label: "امتیاز /۱۰۰" },
          { key: "ac", label: "نرخ قبول" },
          { key: "s", label: "وضعیت" },
        ]}
        rows={ranked.map(({ s, score, acceptRate }) => ({
          id: s.id,
          onCancel: profile.role === "admin" ? () => void mutate({ type: "void", collection: "suppliers", id: s.id }, "حذف شد") : undefined,
          cells: [
            s.name,
            s.city,
            s.product,
            s.price ? toman(s.price) : "—",
            num(score, 0),
            pct(acceptRate),
            s.status,
          ],
        }))}
      />
    </div>
  );
}
