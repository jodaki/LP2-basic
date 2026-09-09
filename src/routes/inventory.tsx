import { createFileRoute } from "@tanstack/react-router";
import { StatusBadge } from "@/components/ui/badge";
import { Field, Input, Select } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable, Panel } from "@/components/journal";
import { num, packLabel } from "@/lib/format";
import { finStock, lightOf, packStock, rawStock } from "@/lib/kpis";
import { PACKS, PRODUCTS, useWorkshop } from "@/lib/store";
import type { KpiDef } from "@/lib/types";

export const Route = createFileRoute("/inventory")({ component: Page });

const rawDef = (min: number): KpiDef => ({
  key: "raw",
  name: "",
  green: min,
  yellow: min * 0.4,
  direction: "higher",
  unit: "کیلوگرم",
  actionRed: "",
  actionYellow: "",
});

function Page() {
  const { purchases, production, sales, moves, addMove, remove, settings } = useWorkshop();
  const perRawMin = settings.minRaw / PRODUCTS.length;
  const perFinMin = settings.minFin / PRODUCTS.length;

  return (
    <div>
      <PageTitle
        title="موجودی"
        hint="خرید و فروش را اینجا دوباره ننویسید. خلاصه خودکار است. فقط شمارش و ضایعات انبار را پایین بزنید."
      />
      <Panel className="mb-5 overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                {["نوع", "محصول", "موجودی", "حداقل", "وضعیت"].map((h) => (
                  <th key={h} className="px-3 py-3 text-right font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p, i) => {
                const v = rawStock(p, purchases, production, moves);
                const light = lightOf(v, rawDef(perRawMin));
                return (
                  <tr key={"r" + p} className={i % 2 ? "bg-muted/60" : ""}>
                    <td className="px-3 py-2">مواد اولیه</td>
                    <td className="px-3 py-2">{p}</td>
                    <td className="px-3 py-2 tabular-nums">{num(v, 1)} کیلو</td>
                    <td className="px-3 py-2">{num(perRawMin, 0)}</td>
                    <td className="px-3 py-2">
                      <StatusBadge light={light} />
                    </td>
                  </tr>
                );
              })}
              {PRODUCTS.map((p, i) => {
                const v = finStock(p, production, sales, moves);
                const light = lightOf(v, rawDef(perFinMin));
                return (
                  <tr key={"f" + p} className={i % 2 ? "bg-muted/60" : ""}>
                    <td className="px-3 py-2">محصول نهایی</td>
                    <td className="px-3 py-2">{p}</td>
                    <td className="px-3 py-2 tabular-nums">{num(v, 1)} کیلو</td>
                    <td className="px-3 py-2">{num(perFinMin, 0)}</td>
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
              const n = packStock(p, pk, production, sales);
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
        title="حرکت دستی انبار (شمارش / ضایعات / اصلاح)"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          addMove({
            date: String(f.get("date") || settings.today),
            kind: String(f.get("kind")),
            product: String(f.get("product")),
            inn: Number(f.get("inn") || 0),
            out: Number(f.get("out") || 0),
            unit: "کیلوگرم",
            loc: String(f.get("loc") || ""),
            reason: String(f.get("reason") || ""),
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
        ]}
        rows={moves.map((m) => ({
          id: m.id,
          onDelete: () => remove("moves", m.id),
          cells: [m.date, m.kind, m.product, num(m.inn, 1), num(m.out, 1), m.reason],
        }))}
      />
    </div>
  );
}
