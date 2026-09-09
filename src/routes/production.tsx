import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { num, packLabel, pct } from "@/lib/format";
import { packCount, wasteKg } from "@/lib/kpis";
import { PACKS, PRODUCTS, useWorkshop } from "@/lib/store";

export const Route = createFileRoute("/production")({ component: Page });

function Page() {
  const { production, employees, addProduction, remove, settings } = useWorkshop();
  return (
    <div>
      <PageTitle title="تولید و بسته‌بندی" hint="ضایعات، درصد و تعداد بسته خودکار محاسبه می‌شود. وزن بسته: ۰.۴ / ۰.۹ / ۱۰ کیلو." />
      <AddForm
        title="ثبت تولید"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          addProduction({
            date: String(f.get("date") || settings.today),
            product: String(f.get("product")),
            inputKg: Number(f.get("inputKg")),
            cleanKg: Number(f.get("cleanKg")),
            packKg: Number(f.get("packKg")),
            operator: String(f.get("operator")),
            note: String(f.get("note") || ""),
          });
        }}
      >
        <Field label="تاریخ شمسی">
          <Input name="date" defaultValue={settings.today} required />
        </Field>
        <Field label="محصول">
          <Select name="product">{PRODUCTS.map((p) => <option key={p}>{p}</option>)}</Select>
        </Field>
        <Field label="مقدار ورودی (کیلو)">
          <Input name="inputKg" type="number" step="0.1" required />
        </Field>
        <Field label="مقدار پاک‌شده (کیلو)">
          <Input name="cleanKg" type="number" step="0.1" required />
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
        <Field label="اپراتور">
          <Select name="operator">{employees.map((e) => <option key={e.id}>{e.name}</option>)}</Select>
        </Field>
        <Field label="توضیحات">
          <Input name="note" />
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "d", label: "تاریخ" },
          { key: "p", label: "محصول" },
          { key: "i", label: "ورودی" },
          { key: "c", label: "پاک‌شده" },
          { key: "w", label: "ضایعات" },
          { key: "pct", label: "درصد" },
          { key: "pk", label: "بسته" },
          { key: "n", label: "تعداد" },
          { key: "o", label: "اپراتور" },
        ]}
        rows={production.map((p) => ({
          id: p.id,
          onDelete: () => remove("production", p.id),
          cells: [
            p.date,
            p.product,
            num(p.inputKg, 1),
            num(p.cleanKg, 1),
            num(wasteKg(p), 1),
            pct(p.inputKg ? wasteKg(p) / p.inputKg : 0),
            packLabel(p.packKg),
            packCount(p),
            p.operator,
          ],
        }))}
      />
    </div>
  );
}
