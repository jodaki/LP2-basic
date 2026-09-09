import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { pct, toman } from "@/lib/format";
import { REGIONS, useWorkshop } from "@/lib/store";

export const Route = createFileRoute("/visits")({ component: Page });

function Page() {
  const { visits, addVisit, remove, settings } = useWorkshop();
  return (
    <div>
      <PageTitle title="گزارش ویزیتور" hint="درصد انجام ویزیت و نرخ تبدیل خودکار است. هر روز یک ردیف از روی فرم کاغذی." />
      <AddForm
        title="ثبت روز ویزیت"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          addVisit({
            date: String(f.get("date") || settings.today),
            region: String(f.get("region")),
            planned: Number(f.get("planned")),
            visited: Number(f.get("visited")),
            orders: Number(f.get("orders") || 0),
            orderAmount: Number(f.get("orderAmount") || 0),
            newCustomers: Number(f.get("newCustomers") || 0),
            collected: Number(f.get("collected") || 0),
            km: Number(f.get("km") || 0),
            fuel: Number(f.get("fuel") || 0),
            note: String(f.get("note") || ""),
          });
        }}
      >
        <Field label="تاریخ">
          <Input name="date" defaultValue={settings.today} />
        </Field>
        <Field label="منطقه">
          <Select name="region">{REGIONS.map((r) => <option key={r}>{r}</option>)}</Select>
        </Field>
        <Field label="برنامه‌ریزی‌شده">
          <Input name="planned" type="number" required />
        </Field>
        <Field label="ویزیت‌شده">
          <Input name="visited" type="number" required />
        </Field>
        <Field label="سفارش">
          <Input name="orders" type="number" defaultValue={0} />
        </Field>
        <Field label="مبلغ سفارش">
          <Input name="orderAmount" type="number" defaultValue={0} />
        </Field>
        <Field label="مشتری جدید">
          <Input name="newCustomers" type="number" defaultValue={0} />
        </Field>
        <Field label="وصول">
          <Input name="collected" type="number" defaultValue={0} />
        </Field>
        <Field label="کیلومتر">
          <Input name="km" type="number" defaultValue={0} />
        </Field>
        <Field label="سوخت">
          <Input name="fuel" type="number" defaultValue={0} />
        </Field>
        <Field label="توضیحات">
          <Input name="note" />
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "d", label: "تاریخ" },
          { key: "r", label: "منطقه" },
          { key: "p", label: "برنامه / انجام" },
          { key: "v", label: "% ویزیت" },
          { key: "c", label: "تبدیل" },
          { key: "o", label: "مبلغ سفارش" },
          { key: "col", label: "وصول" },
          { key: "f", label: "سوخت" },
        ]}
        rows={visits.map((v) => ({
          id: v.id,
          onDelete: () => remove("visits", v.id),
          cells: [
            v.date,
            v.region,
            `${v.visited} از ${v.planned}`,
            pct(v.planned ? v.visited / v.planned : 0),
            pct(v.visited ? v.orders / v.visited : 0),
            toman(v.orderAmount),
            toman(v.collected),
            toman(v.fuel),
          ],
        }))}
      />
    </div>
  );
}
