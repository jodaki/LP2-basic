import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { num, toman } from "@/lib/format";
import { APPROVAL, CITIES, PRODUCTS, QUALITY, useWorkshop } from "@/lib/store";

export const Route = createFileRoute("/suppliers")({ component: Page });

function avg(s: { scorePrice: number; scoreQuality: number; scoreDelivery: number; scoreStability: number; scorePay: number }) {
  return (s.scorePrice + s.scoreQuality + s.scoreDelivery + s.scoreStability + s.scorePay) / 5;
}

function Page() {
  const { suppliers, addSupplier, remove } = useWorkshop();
  return (
    <div>
      <PageTitle title="تأمین‌کنندگان" hint="امتیاز کل میانگین پنج معیار ۱ تا ۱۰ است. از همین فهرست در خرید نام انتخاب می‌شود." />
      <AddForm
        title="تأمین‌کننده جدید"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          addSupplier({
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
            status: String(f.get("status")),
            note: String(f.get("note") || ""),
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
        <Field label="امتیاز قیمت">
          <Input name="scorePrice" type="number" min={1} max={10} defaultValue={7} />
        </Field>
        <Field label="امتیاز کیفیت">
          <Input name="scoreQuality" type="number" min={1} max={10} defaultValue={7} />
        </Field>
        <Field label="امتیاز تحویل">
          <Input name="scoreDelivery" type="number" min={1} max={10} defaultValue={7} />
        </Field>
        <Field label="امتیاز ثبات">
          <Input name="scoreStability" type="number" min={1} max={10} defaultValue={7} />
        </Field>
        <Field label="امتیاز پرداخت">
          <Input name="scorePay" type="number" min={1} max={10} defaultValue={7} />
        </Field>
        <Field label="وضعیت">
          <Select name="status">{APPROVAL.map((a) => <option key={a}>{a}</option>)}</Select>
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "n", label: "نام" },
          { key: "c", label: "شهر" },
          { key: "p", label: "محصول" },
          { key: "pr", label: "قیمت" },
          { key: "q", label: "کیفیت" },
          { key: "a", label: "امتیاز کل" },
          { key: "s", label: "وضعیت" },
        ]}
        rows={suppliers.map((s) => ({
          id: s.id,
          onDelete: () => remove("suppliers", s.id),
          cells: [s.name, s.city, s.product, s.price ? toman(s.price) : "—", s.quality, num(avg(s), 1), s.status],
        }))}
      />
    </div>
  );
}
