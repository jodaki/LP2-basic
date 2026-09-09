import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { ApprovalChip } from "@/components/ui/badge";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable, Panel } from "@/components/journal";
import { num, packLabel, toman } from "@/lib/format";
import { saleFinal, saleRemain, saleWeight } from "@/lib/kpis";
import { CITIES, PACKS, PRODUCTS, useWorkshop } from "@/lib/store";
import { isPosted } from "@/lib/costing";
import { canSeeReceivables } from "@/lib/access";
import { useSessionProfile } from "@/lib/session";

export const Route = createFileRoute("/sales")({ component: Page });

function Page() {
  const { sales, customers, employees, settings } = useWorkshop();
  const { mutate, profile } = useSessionProfile();
  const posted = sales.filter(isPosted);
  const remain = posted.reduce((a, s) => a + Math.max(0, saleRemain(s)), 0);
  const overdue = posted
    .filter((s) => saleRemain(s) > 0 && s.date < settings.today.slice(0, 7))
    .reduce((a, s) => a + saleRemain(s), 0);
  const byCust = Object.entries(
    posted.reduce<Record<string, number>>((acc, s) => {
      acc[s.customer] = (acc[s.customer] ?? 0) + Math.max(0, saleRemain(s));
      return acc;
    }, {}),
  )
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <PageTitle title="فروش" hint="مانده مطالبات خودکار است. تا تأیید مدیر، موجودی محصول و سود تغییر نمی‌کند." />
      {canSeeReceivables(profile.role) ? (
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <Panel>
            <p className="text-xs text-fg-muted">کل مطالبات</p>
            <p className="mt-1 font-display text-xl font-semibold">{toman(remain)}</p>
          </Panel>
          <Panel>
            <p className="text-xs text-fg-muted">معوق / ماه‌های قبل</p>
            <p className="mt-1 font-display text-xl font-semibold">{toman(overdue)}</p>
          </Panel>
          <Panel>
            <p className="text-xs text-fg-muted">بزرگ‌ترین بدهکار</p>
            <p className="mt-1 font-display text-lg font-semibold">
              {byCust[0] ? `${byCust[0][0]} — ${toman(byCust[0][1])}` : "—"}
            </p>
          </Panel>
        </div>
      ) : null}
      <AddForm
        title="ثبت فروش"
        submitLabel={profile.role === "admin" ? "ثبت و تأیید" : "ارسال برای تأیید مدیر"}
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          void mutate({
            type: "addSale",
            row: {
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
              creditDays: Number(f.get("creditDays") || settings.creditDays),
            },
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
        <Field label="مهلت نسیه (روز)">
          <Input name="creditDays" type="number" defaultValue={settings.creditDays} />
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
          { key: "st", label: "تأیید" },
        ]}
        rows={sales.map((s) => ({
          id: s.id,
          muted: s.voided,
          onCancel: s.voided ? undefined : () => void mutate({ type: "void", collection: "sales", id: s.id }, "لغو شد"),
          cells: [
            s.date,
            s.customer,
            `${s.product} ${packLabel(s.packKg)}`,
            s.qty,
            num(saleWeight(s), 1),
            toman(saleFinal(s)),
            toman(s.collected),
            toman(saleRemain(s)),
            <ApprovalChip key="a" status={s.approvalStatus} voided={s.voided} />,
          ],
        }))}
      />
    </div>
  );
}
