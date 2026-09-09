import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { num, toman } from "@/lib/format";
import { purchaseTotal } from "@/lib/kpis";
import { APPROVAL, PRODUCTS, QUALITY, useWorkshop } from "@/lib/store";

export const Route = createFileRoute("/purchases")({ component: Page });

function Page() {
  const { purchases, suppliers, addPurchase, remove, settings } = useWorkshop();
  return (
    <div>
      <PageTitle
        title="خرید مواد اولیه"
        hint="فقط بار «تأیید شده» وارد موجودی و هزینه ماه می‌شود. قیمت تمام‌شده خودکار است."
      />
      <AddForm
        title="ثبت خرید جدید"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          addPurchase({
            date: String(f.get("date") || settings.today),
            supplier: String(f.get("supplier")),
            product: String(f.get("product")),
            kg: Number(f.get("kg")),
            price: Number(f.get("price")),
            freight: Number(f.get("freight") || 0),
            quality: String(f.get("quality")),
            status: String(f.get("status")),
            note: String(f.get("note") || ""),
          });
        }}
      >
        <Field label="تاریخ شمسی">
          <Input name="date" defaultValue={settings.today} required />
        </Field>
        <Field label="تأمین‌کننده">
          <Select name="supplier" required>
            {suppliers.map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="نوع حبوبات">
          <Select name="product">{PRODUCTS.map((p) => <option key={p}>{p}</option>)}</Select>
        </Field>
        <Field label="مقدار (کیلو)">
          <Input name="kg" type="number" step="0.1" required />
        </Field>
        <Field label="قیمت هر کیلو">
          <Input name="price" type="number" required />
        </Field>
        <Field label="هزینه حمل">
          <Input name="freight" type="number" defaultValue={0} />
        </Field>
        <Field label="کیفیت">
          <Select name="quality">{QUALITY.map((q) => <option key={q}>{q}</option>)}</Select>
        </Field>
        <Field label="وضعیت تأیید">
          <Select name="status">{APPROVAL.map((q) => <option key={q}>{q}</option>)}</Select>
        </Field>
        <Field label="توضیحات">
          <Input name="note" />
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "d", label: "تاریخ" },
          { key: "s", label: "تأمین‌کننده" },
          { key: "p", label: "محصول" },
          { key: "k", label: "کیلو" },
          { key: "pr", label: "قیمت" },
          { key: "t", label: "مبلغ + حمل" },
          { key: "q", label: "کیفیت" },
          { key: "st", label: "وضعیت" },
        ]}
        rows={purchases.map((p) => ({
          id: p.id,
          onDelete: () => remove("purchases", p.id),
          cells: [
            p.date,
            p.supplier,
            p.product,
            num(p.kg, 1),
            toman(p.price),
            toman(purchaseTotal(p)),
            p.quality,
            p.status,
          ],
        }))}
      />
    </div>
  );
}
