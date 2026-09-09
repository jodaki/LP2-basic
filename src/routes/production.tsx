import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { ApprovalChip } from "@/components/ui/badge";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable, Panel } from "@/components/journal";
import { num, packLabel, pct } from "@/lib/format";
import { packCount, wasteKg, yieldPct } from "@/lib/kpis";
import { PACKS, PRODUCTS, useWorkshop } from "@/lib/store";
import { WASTE_REASONS } from "@/lib/access";
import { wasteByReason } from "@/lib/costing";
import { useSessionProfile } from "@/lib/session";

export const Route = createFileRoute("/production")({ component: Page });

function Page() {
  const { production, employees, settings } = useWorkshop();
  const { mutate, profile } = useSessionProfile();
  const mine =
    profile.role === "operator"
      ? production.filter((p) => p.submittedBy === profile.userId || p.operator === profile.displayName)
      : production;
  const reasons = wasteByReason(production);
  const ops = employees.filter((e) => e.accessRole === "production" || e.accessRole === "operator" || e.role.includes("تولید") || e.role.includes("بسته‌"));
  return (
    <div>
      <PageTitle
        title="تولید و بسته‌بندی"
        hint="بازده و درصد ضایعات خودکار است. علت ضایعات را از فهرست انتخاب کنید. تا تأیید مدیر، موجودی تغییر نمی‌کند."
      />
      <AddForm
        title="ثبت تولید"
        submitLabel={profile.role === "admin" ? "ثبت و تأیید" : "ارسال برای تأیید مدیر"}
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          void mutate({
            type: "addProduction",
            row: {
              date: String(f.get("date") || settings.today),
              product: String(f.get("product")),
              inputKg: Number(f.get("inputKg")),
              cleanKg: Number(f.get("cleanKg")),
              packKg: Number(f.get("packKg")),
              operator: String(f.get("operator")),
              wasteReason: String(f.get("wasteReason") || ""),
              startTime: String(f.get("startTime") || "08:00"),
              endTime: String(f.get("endTime") || "16:00"),
              note: String(f.get("note") || ""),
            },
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
        <Field label="محصول سالم (کیلو)">
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
          <Select name="operator">
            {(ops.length ? ops : employees).map((e) => (
              <option key={e.id}>{e.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="علت ضایعات">
          <Select name="wasteReason">
            <option value="">—</option>
            {WASTE_REASONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </Field>
        <Field label="شروع">
          <Input name="startTime" type="time" defaultValue="08:00" />
        </Field>
        <Field label="پایان">
          <Input name="endTime" type="time" defaultValue="16:00" />
        </Field>
        <Field label="توضیحات">
          <Input name="note" />
        </Field>
      </AddForm>

      {profile.role !== "operator" && reasons.length > 0 ? (
        <Panel className="mb-5">
          <h3 className="mb-3 text-sm font-semibold">بیشترین علت ضایعات</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {reasons.map((r) => (
              <li key={r.reason} className="flex justify-between rounded-[var(--radius-sm)] bg-muted px-3 py-2 text-sm">
                <span>{r.reason}</span>
                <span className="tabular-nums">{num(r.kg, 1)} کیلو · {r.count} نوبت</span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <DataTable
        columns={[
          { key: "d", label: "تاریخ" },
          { key: "p", label: "محصول" },
          { key: "i", label: "ورودی" },
          { key: "c", label: "سالم" },
          { key: "w", label: "ضایعات" },
          { key: "y", label: "بازده" },
          { key: "r", label: "علت" },
          { key: "n", label: "تعداد بسته" },
          { key: "o", label: "اپراتور" },
          { key: "st", label: "تأیید" },
        ]}
        rows={mine.map((p) => ({
          id: p.id,
          muted: p.voided,
          onCancel: p.voided ? undefined : () => void mutate({ type: "void", collection: "production", id: p.id }, "لغو شد"),
          cells: [
            p.date,
            p.product,
            num(p.inputKg, 1),
            num(p.cleanKg, 1),
            num(wasteKg(p), 1),
            pct(yieldPct(p)),
            p.wasteReason || "—",
            packCount(p),
            p.operator,
            <ApprovalChip key="a" status={p.approvalStatus} voided={p.voided} />,
          ],
        }))}
      />
    </div>
  );
}
