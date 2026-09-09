import { createFileRoute } from "@tanstack/react-router";
import { Field, Input, Select } from "@/components/ui/input";
import { ApprovalChip } from "@/components/ui/badge";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable } from "@/components/journal";
import { num, toman } from "@/lib/format";
import { purchaseTotal } from "@/lib/kpis";
import { PRODUCTS, QUALITY, useWorkshop } from "@/lib/store";
import { QC_RESULTS, qualityToQc } from "@/lib/access";
import { useSessionProfile } from "@/lib/session";

export const Route = createFileRoute("/purchases")({ component: Page });

function Page() {
  const { purchases, suppliers, settings } = useWorkshop();
  const { mutate, profile } = useSessionProfile();
  return (
    <div>
      <PageTitle
        title="خرید مواد اولیه"
        hint="کنترل کیفیت هنگام دریافت بار ثبت می‌شود. فقط بار تأییدشدهٔ مدیر با نتیجه قبول وارد موجودی می‌شود — خرید هزینه نیست."
      />
      <AddForm
        title="ثبت خرید جدید"
        submitLabel={profile.role === "admin" ? "ثبت و تأیید" : "ارسال برای تأیید مدیر"}
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          const quality = String(f.get("quality"));
          void mutate({
            type: "addPurchase",
            row: {
              date: String(f.get("date") || settings.today),
              supplier: String(f.get("supplier")),
              product: String(f.get("product")),
              kg: Number(f.get("kg")),
              price: Number(f.get("price")),
              freight: Number(f.get("freight") || 0),
              quality,
              status: String(f.get("qcResult")),
              qcResult: (String(f.get("qcResult")) as "قبول" | "رد" | "مشروط") || qualityToQc(quality),
              note: String(f.get("note") || ""),
            },
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
        <Field label="کیفیت ظاهری">
          <Select name="quality">{QUALITY.map((q) => <option key={q}>{q}</option>)}</Select>
        </Field>
        <Field label="نتیجه QC">
          <Select name="qcResult">{QC_RESULTS.map((q) => <option key={q}>{q}</option>)}</Select>
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
          { key: "t", label: "مبلغ + حمل" },
          { key: "q", label: "QC" },
          { key: "st", label: "تأیید" },
        ]}
        rows={purchases.map((p) => ({
          id: p.id,
          muted: p.voided,
          onCancel: p.voided ? undefined : () => void mutate({ type: "void", collection: "purchases", id: p.id }, "لغو شد"),
          cells: [
            p.date,
            p.supplier,
            p.product,
            num(p.kg, 1),
            toman(purchaseTotal(p)),
            p.qcResult,
            <ApprovalChip key="a" status={p.approvalStatus} voided={p.voided} />,
          ],
        }))}
      />
    </div>
  );
}
