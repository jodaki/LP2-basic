import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { num, packLabel, toman } from "@/lib/format";
import { saleFinal, saleRemain, saleWeight } from "@/lib/kpis";
import { CITIES, PACKS, PRODUCTS, useWorkshop } from "@/lib/store";

export const Route = createFileRoute("/sales")({ component: Page });

function Page() {
  const { sales, customers, employees, addSale, remove, settings } = useWorkshop();
  return (
    <div>
      <PageTitle title="فروش" hint="مانده حساب خودکار است. وصول را همین‌جا بزنید تا مطالبات داشبورد درست بماند." />
      <AddForm
        title="ثبت فروش"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          addSale({
            date: String(f.get("date") || settings.today),
            customer: String(f.get("customer")),
            city: String(f.get("city")),
            product: String(f.get("product")),
            packKg: Number(f.get("packKg")),
            qty: Number(f.get("qty")),
            unitPrice: Number(f.get("unitPrice")),
            discount: Number(f.get("discount") || 0),
            collected: Number(f.get("collected") || 0),
            seller: String(f.get("seller")),
          });
        }}
      >
        <Field label="تاریخ شمسی">
          <Input name="date" defaultValue={settings.today} required />
        </Field>
        <Field label="مشتری">
          <Select name="customer">{customers.map((c) => <option key={c.id}>{c.name}</option>)}</Select>
        </Field>
        <Field label="شهر">
          <Select name="city">{CITIES.map((c) => <option key={c}>{c}</option>)}</Select>
        </Field>
        <Field label="محصول">
          <Select name="product">{PRODUCTS.map((p) => <option key={p}>{p}</option>)}</Select>
        </Field>
        <Field label="وزن بسته">
          <Select name="packKg">
            {PACKS.map((p) => (
              <option key={p} value={p}>
                {packLabel(p)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="تعداد">
          <Input name="qty" type="number" required />
        </Field>
        <Field label="قیمت هر بسته">
          <Input name="unitPrice" type="number" required />
        </Field>
        <Field label="تخفیف">
          <Input name="discount" type="number" defaultValue={0} />
        </Field>
        <Field label="وصول‌شده">
          <Input name="collected" type="number" defaultValue={0} />
        </Field>
        <Field label="فروشنده">
          <Select name="seller">{employees.map((e) => <option key={e.id}>{e.name}</option>)}</Select>
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "d", label: "تاریخ" },
          { key: "c", label: "مشتری" },
          { key: "p", label: "محصول" },
          { key: "n", label: "تعداد" },
          { key: "w", label: "وزن" },
          { key: "f", label: "مبلغ نهایی" },
          { key: "col", label: "وصول" },
          { key: "r", label: "مانده" },
        ]}
        rows={sales.map((s) => ({
          id: s.id,
          onDelete: () => remove("sales", s.id),
          cells: [
            s.date,
            s.customer,
            `${s.product} ${packLabel(s.packKg)}`,
            s.qty,
            num(saleWeight(s), 1),
            toman(saleFinal(s)),
            toman(s.collected),
            toman(saleRemain(s)),
          ],
        }))}
      />
    </div>
  );
}
