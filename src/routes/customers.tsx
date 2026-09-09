import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { toman } from "@/lib/format";
import { abcClass, customerTotal, firstPurchase, lastPurchase } from "@/lib/kpis";
import { CITIES, CUST_TYPES, useWorkshop } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/customers")({ component: Page });

function Page() {
  const { customers, sales, addCustomer, remove, settings } = useWorkshop();
  return (
    <div>
      <PageTitle title="دفتر مشتریان" hint="دسته A / B / C از مجموع خرید و آستانه‌های تنظیمات به‌صورت خودکار است." />
      <AddForm
        title="مشتری جدید"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          addCustomer({
            name: String(f.get("name")),
            phone: String(f.get("phone") || ""),
            city: String(f.get("city")),
            address: String(f.get("address") || ""),
            type: String(f.get("type")),
            lastVisit: String(f.get("lastVisit") || settings.today),
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
        <Field label="آدرس">
          <Input name="address" />
        </Field>
        <Field label="نوع">
          <Select name="type">{CUST_TYPES.map((c) => <option key={c}>{c}</option>)}</Select>
        </Field>
        <Field label="آخرین ویزیت">
          <Input name="lastVisit" defaultValue={settings.today} />
        </Field>
        <Field label="وضعیت">
          <Select name="status">
            <option>فعال</option>
            <option>بالقوه</option>
            <option>غیرفعال</option>
          </Select>
        </Field>
        <Field label="توضیحات">
          <Input name="note" />
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "n", label: "نام" },
          { key: "p", label: "تلفن" },
          { key: "c", label: "شهر" },
          { key: "t", label: "نوع" },
          { key: "f", label: "اولین خرید" },
          { key: "l", label: "آخرین خرید" },
          { key: "s", label: "مجموع خرید" },
          { key: "a", label: "دسته" },
          { key: "st", label: "وضعیت" },
        ]}
        rows={customers.map((c) => {
          const total = customerTotal(c.name, sales);
          const abc = abcClass(total, settings);
          return {
            id: c.id,
            onDelete: () => remove("customers", c.id),
            cells: [
              c.name,
              c.phone,
              c.city,
              c.type,
              firstPurchase(c.name, sales) || "—",
              lastPurchase(c.name, sales) || "—",
              toman(total),
              <span
                key="abc"
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold",
                  abc === "A" && "bg-ok-bg text-ok",
                  abc === "B" && "bg-warn-bg text-warn",
                  abc === "C" && "bg-muted text-fg-muted",
                )}
              >
                {abc}
              </span>,
              c.status,
            ],
          };
        })}
      />
    </div>
  );
}
