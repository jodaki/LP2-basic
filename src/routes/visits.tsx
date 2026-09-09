import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { ApprovalChip } from "@/components/ui/badge";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { pct, toman } from "@/lib/format";
import { REGIONS, useWorkshop } from "@/lib/store";
import { useSessionProfile } from "@/lib/session";

export const Route = createFileRoute("/visits")({ component: Page });

function Page() {
  const { visits, employees, settings } = useWorkshop();
  const { mutate, profile } = useSessionProfile();
  const visitors = employees.filter((e) => e.accessRole === "sales" || /ویزیت|فروش/.test(e.role));
  return (
    <div>
      <PageTitle title="گزارش ویزیتور" hint="اگر سفارش داشته باشد تا تأیید مدیر روی عملکرد و فروش اثر نمی‌گذارد." />
      <AddForm
        title="ثبت روز ویزیت"
        submitLabel={profile.role === "admin" ? "ثبت و تأیید" : "ارسال برای تأیید مدیر"}
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          void mutate({
            type: "addVisit",
            row: {
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
              visitor: String(f.get("visitor") || profile.displayName),
              note: String(f.get("note") || ""),
            },
          });
        }}
      >
        <Field label="تاریخ">
          <Input name="date" defaultValue={settings.today} />
        </Field>
        <Field label="منطقه">
          <Select name="region">{REGIONS.map((r) => <option key={r}>{r}</option>)}</Select>
        </Field>
        <Field label="ویزیتور">
          <Select name="visitor">
            {(visitors.length ? visitors : employees).map((e) => (
              <option key={e.id}>{e.name}</option>
            ))}
          </Select>
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
          { key: "who", label: "ویزیتور" },
          { key: "p", label: "برنامه / انجام" },
          { key: "v", label: "% ویزیت" },
          { key: "c", label: "تبدیل" },
          { key: "o", label: "مبلغ سفارش" },
          { key: "col", label: "وصول" },
          { key: "st", label: "تأیید" },
        ]}
        rows={visits.map((v) => ({
          id: v.id,
          muted: v.voided,
          onCancel: v.voided ? undefined : () => void mutate({ type: "void", collection: "visits", id: v.id }, "لغو شد"),
          cells: [
            v.date,
            v.region,
            v.visitor || "—",
            `${v.visited} از ${v.planned}`,
            pct(v.planned ? v.visited / v.planned : 0),
            pct(v.visited ? v.orders / v.visited : 0),
            toman(v.orderAmount),
            toman(v.collected),
            <ApprovalChip key="a" status={v.approvalStatus} voided={v.voided} />,
          ],
        }))}
      />
    </div>
  );
}
