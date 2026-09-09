import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { pct, toman } from "@/lib/format";
import { inMonth, saleFinal } from "@/lib/kpis";
import { useWorkshop } from "@/lib/store";

export const Route = createFileRoute("/employees")({ component: Page });

function Page() {
  const { employees, sales, addEmployee, remove, settings } = useWorkshop();
  return (
    <div>
      <PageTitle title="کارکنان" hint="جا برای رشد تا ۲۰ نفر. پورسانت ماه از فروش همان فروشنده × نرخ پورسانت." />
      <AddForm
        title="افزودن نیرو"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          addEmployee({
            name: String(f.get("name")),
            role: String(f.get("role")),
            duties: String(f.get("duties") || ""),
            salary: Number(f.get("salary") || 0),
            commissionRate: Number(f.get("commissionRate") || 0) / 100,
            start: String(f.get("start") || settings.today),
            status: "فعال",
            note: String(f.get("note") || ""),
          });
        }}
      >
        <Field label="نام">
          <Input name="name" required />
        </Field>
        <Field label="سمت">
          <Select name="role">
            <option>مدیر/مالک</option>
            <option>مسئول انبار</option>
            <option>نیروی تولید</option>
            <option>ویزیتور</option>
            <option>کمک تولید</option>
            <option>حسابدار</option>
          </Select>
        </Field>
        <Field label="وظایف">
          <Input name="duties" />
        </Field>
        <Field label="حقوق ثابت">
          <Input name="salary" type="number" />
        </Field>
        <Field label="پورسانت (٪)">
          <Input name="commissionRate" type="number" step="0.1" defaultValue={0} />
        </Field>
        <Field label="شروع">
          <Input name="start" defaultValue={settings.today} />
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "n", label: "نام" },
          { key: "r", label: "سمت" },
          { key: "d", label: "وظایف" },
          { key: "s", label: "حقوق" },
          { key: "c", label: "نرخ پورسانت" },
          { key: "cm", label: "پورسانت ماه" },
          { key: "t", label: "جمع ماه" },
        ]}
        rows={employees.map((e) => {
          const sold = sales
            .filter((s) => s.seller === e.name && inMonth(s.date, settings.year, settings.month))
            .reduce((a, s) => a + saleFinal(s), 0);
          const comm = sold * (e.commissionRate || 0);
          return {
            id: e.id,
            onDelete: () => remove("employees", e.id),
            cells: [e.name, e.role, e.duties, toman(e.salary), pct(e.commissionRate || 0), toman(comm), toman(e.salary + comm)],
          };
        })}
      />
    </div>
  );
}
