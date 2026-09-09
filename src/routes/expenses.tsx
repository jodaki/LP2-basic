import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { toman } from "@/lib/format";
import { EXPENSE_TYPES, PAY_METHODS, useWorkshop } from "@/lib/store";

export const Route = createFileRoute("/expenses")({ component: Page });

function Page() {
  const { expenses, employees, addExpense, remove, settings } = useWorkshop();
  return (
    <div>
      <PageTitle title="هزینه‌ها" hint="حقوق را اول ماه بزنید. هر هزینه یک ردیف." />
      <AddForm
        title="ثبت هزینه"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          addExpense({
            date: String(f.get("date") || settings.today),
            type: String(f.get("type")),
            amount: Number(f.get("amount")),
            payer: String(f.get("payer")),
            method: String(f.get("method")),
            note: String(f.get("note") || ""),
          });
        }}
      >
        <Field label="تاریخ">
          <Input name="date" defaultValue={settings.today} />
        </Field>
        <Field label="نوع">
          <Select name="type">{EXPENSE_TYPES.map((t) => <option key={t}>{t}</option>)}</Select>
        </Field>
        <Field label="مبلغ (تومان)">
          <Input name="amount" type="number" required />
        </Field>
        <Field label="پرداخت‌کننده">
          <Select name="payer">{employees.map((e) => <option key={e.id}>{e.name}</option>)}</Select>
        </Field>
        <Field label="روش">
          <Select name="method">{PAY_METHODS.map((m) => <option key={m}>{m}</option>)}</Select>
        </Field>
        <Field label="شرح">
          <Input name="note" />
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "d", label: "تاریخ" },
          { key: "t", label: "نوع" },
          { key: "a", label: "مبلغ" },
          { key: "p", label: "پرداخت‌کننده" },
          { key: "m", label: "روش" },
          { key: "n", label: "شرح" },
        ]}
        rows={expenses.map((e) => ({
          id: e.id,
          onDelete: () => remove("expenses", e.id),
          cells: [e.date, e.type, toman(e.amount), e.payer, e.method, e.note],
        }))}
      />
    </div>
  );
}
