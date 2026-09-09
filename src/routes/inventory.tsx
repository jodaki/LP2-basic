import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge, ApprovalChip } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable, Panel } from "@/components/journal";
import { num, packLabel, toman } from "@/lib/format";
import { PACKS, PRODUCTS, useWorkshop } from "@/lib/store";
import { countAlert, countVariance, finStockQty, packStockQty, rawStockQty, rawWac, stockLight } from "@/lib/costing";
import { useSessionProfile } from "@/lib/session";
import { canSeeFinance } from "@/lib/access";

export const Route = createFileRoute("/inventory")({ component: Page });

function Page() {
  const store = useWorkshop();
  const { purchases, production, sales, moves, counts, settings } = store;
  const { mutate, profile } = useSessionProfile();
  const perRawMin = settings.minRaw / PRODUCTS.length;
  const perFinMin = settings.minFin / PRODUCTS.length;
  const perRawRe = settings.reorderRaw / PRODUCTS.length;
  const perFinRe = settings.reorderFin / PRODUCTS.length;

  return (
    <div>
      <PageTitle
        title="موجودی"
        hint="دو انبار جدا: مواد اولیه و محصول نهایی. میانگین موزون از خریدهای تأییدشده است. شمارش فیزیکی مغایرت را نشان می‌دهد."
      />
      <Panel className="mb-5 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                {["نوع", "محصول", "مقدار", "میانگین موزون", "ارزش", "حداقل", "نقطه سفارش", "وضعیت"].map((h) => (
                  <th key={h} className="px-3 py-3 text-right font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p, i) => {
                const v = rawStockQty(p, purchases, production, moves);
                const avg = rawWac(p, purchases).avg;
                const light = stockLight(v, perRawMin, perRawRe);
                return (
                  <tr key={"r" + p} className={i % 2 ? "bg-muted/60" : ""}>
                    <td className="px-3 py-2">مواد اولیه</td>
                    <td className="px-3 py-2">{p}</td>
                    <td className="px-3 py-2 tabular-nums">{num(v, 1)} کیلو</td>
                    <td className="px-3 py-2">{canSeeFinance(profile.role) ? toman(avg) : "—"}</td>
                    <td className="px-3 py-2">{canSeeFinance(profile.role) ? toman(v * avg) : "—"}</td>
                    <td className="px-3 py-2">{num(perRawMin, 0)}</td>
                    <td className="px-3 py-2">{num(perRawRe, 0)}</td>
                    <td className="px-3 py-2">
                      <StatusBadge light={light} />
                    </td>
                  </tr>
                );
              })}
              {PRODUCTS.map((p, i) => {
                const v = finStockQty(p, production, sales, moves);
                const light = stockLight(v, perFinMin, perFinRe);
                return (
                  <tr key={"f" + p} className={i % 2 ? "bg-muted/60" : ""}>
                    <td className="px-3 py-2">محصول نهایی</td>
                    <td className="px-3 py-2">{p}</td>
                    <td className="px-3 py-2 tabular-nums">{num(v, 1)} کیلو</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">—</td>
                    <td className="px-3 py-2">{num(perFinMin, 0)}</td>
                    <td className="px-3 py-2">{num(perFinRe, 0)}</td>
                    <td className="px-3 py-2">
                      <StatusBadge light={light} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="mb-5">
        <h3 className="mb-3 text-sm font-semibold">مانده بسته</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.flatMap((p) =>
            PACKS.map((pk) => {
              const n = packStockQty(p, pk, production, sales);
              if (n === 0) return null;
              return (
                <div key={p + pk} className="flex justify-between rounded-[var(--radius-sm)] bg-muted px-3 py-2 text-sm">
                  <span>
                    {p} {packLabel(pk)}
                  </span>
                  <span className="tabular-nums">{n} بسته</span>
                </div>
              );
            }),
          )}
        </div>
      </Panel>

      <AddForm
        title="شمارش فیزیکی"
        submitLabel="ثبت شمارش برای تأیید"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          const product = String(f.get("product"));
          const kind = String(f.get("kind"));
          const systemQty =
            kind === "مواد اولیه"
              ? rawStockQty(product, purchases, production, moves)
              : finStockQty(product, production, sales, moves);
          void mutate({
            type: "addCount",
            row: {
              date: String(f.get("date") || settings.today),
              kind,
              product,
              systemQty,
              actualQty: Number(f.get("actualQty")),
              note: String(f.get("note") || ""),
            },
          });
        }}
      >
        <Field label="تاریخ">
          <Input name="date" defaultValue={settings.today} />
        </Field>
        <Field label="نوع">
          <Select name="kind">
            <option>مواد اولیه</option>
            <option>محصول نهایی</option>
          </Select>
        </Field>
        <Field label="محصول">
          <Select name="product">{PRODUCTS.map((p) => <option key={p}>{p}</option>)}</Select>
        </Field>
        <Field label="مقدار واقعی (کیلو)">
          <Input name="actualQty" type="number" step="0.1" required />
        </Field>
        <Field label="توضیح مغایرت">
          <Input name="note" />
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "d", label: "تاریخ" },
          { key: "k", label: "نوع" },
          { key: "p", label: "محصول" },
          { key: "s", label: "سیستم" },
          { key: "a", label: "واقعی" },
          { key: "v", label: "مغایرت" },
          { key: "al", label: "هشدار" },
          { key: "st", label: "تأیید" },
        ]}
        rows={counts.map((c) => {
          const v = countVariance(c);
          const alert = countAlert(c, settings.countVariancePct);
          return {
            id: c.id,
            muted: c.voided,
            onCancel: c.voided ? undefined : () => void mutate({ type: "void", collection: "counts", id: c.id }, "لغو شد"),
            cells: [
              c.date,
              c.kind,
              c.product,
              num(c.systemQty, 1),
              num(c.actualQty, 1),
              num(v, 1),
              alert ? "بالاتر از حد" : "قابل قبول",
              <ApprovalChip key="a" status={c.approvalStatus} voided={c.voided} />,
            ],
          };
        })}
      />

      <AddForm
        title="حرکت دستی انبار (ضایعات / اصلاح)"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          void mutate({
            type: "addMove",
            row: {
              date: String(f.get("date") || settings.today),
              kind: String(f.get("kind")),
              product: String(f.get("product")),
              inn: Number(f.get("inn") || 0),
              out: Number(f.get("out") || 0),
              unit: "کیلوگرم",
              loc: String(f.get("loc") || ""),
              reason: String(f.get("reason") || ""),
            },
          });
        }}
      >
        <Field label="تاریخ">
          <Input name="date" defaultValue={settings.today} />
        </Field>
        <Field label="نوع">
          <Select name="kind">
            <option>مواد اولیه</option>
            <option>محصول نهایی</option>
          </Select>
        </Field>
        <Field label="محصول">
          <Select name="product">{PRODUCTS.map((p) => <option key={p}>{p}</option>)}</Select>
        </Field>
        <Field label="ورود">
          <Input name="inn" type="number" step="0.1" defaultValue={0} />
        </Field>
        <Field label="خروج">
          <Input name="out" type="number" step="0.1" defaultValue={0} />
        </Field>
        <Field label="محل / علت">
          <Input name="reason" />
        </Field>
      </AddForm>
      <DataTable
        columns={[
          { key: "d", label: "تاریخ" },
          { key: "k", label: "نوع" },
          { key: "p", label: "محصول" },
          { key: "i", label: "ورود" },
          { key: "o", label: "خروج" },
          { key: "r", label: "علت" },
          { key: "st", label: "تأیید" },
        ]}
        rows={moves.map((m) => ({
          id: m.id,
          muted: m.voided,
          onCancel: m.voided ? undefined : () => void mutate({ type: "void", collection: "moves", id: m.id }, "لغو شد"),
          cells: [
            m.date,
            m.kind,
            m.product,
            num(m.inn, 1),
            num(m.out, 1),
            m.reason,
            <ApprovalChip key="a" status={m.approvalStatus} voided={m.voided} />,
          ],
        }))}
      />
    </div>
  );
}
