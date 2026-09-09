import { createFileRoute } from "@tanstack/react-router";
import { PageTitle } from "@/components/shell";
import { Panel } from "@/components/journal";
import { num, packLabel, pct, toman } from "@/lib/format";
import { PACKS, PRODUCTS, useWorkshop } from "@/lib/store";
import { productCostTable, rawWac } from "@/lib/costing";

export const Route = createFileRoute("/costs")({ component: Page });

function Page() {
  const store = useWorkshop();
  const rows = productCostTable(PRODUCTS, PACKS, {
    settings: store.settings,
    purchases: store.purchases,
    production: store.production,
    sales: store.sales,
  });
  return (
    <div>
      <PageTitle
        title="بهای تمام‌شده محصول"
        hint="ماده اولیه با میانگین موزون + بسته + تولید + سربار. خرید مواد سود را کم نمی‌کند؛ فقط موجودی را زیاد می‌کند."
      />
      <Panel className="mb-5">
        <h3 className="mb-3 text-sm font-semibold">میانگین موزون مواد اولیه</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => {
            const w = rawWac(p, store.purchases);
            return (
              <div key={p} className="flex justify-between rounded-[var(--radius-sm)] bg-muted px-3 py-2 text-sm">
                <span>{p}</span>
                <span className="tabular-nums">{w.qty ? toman(w.avg) : "—"} /کیلو</span>
              </div>
            );
          })}
        </div>
      </Panel>
      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                {[
                  "محصول",
                  "سایز",
                  "ماده (کیلو)",
                  "نرخ ماده",
                  "هزینه ماده",
                  "بسته",
                  "تولید",
                  "سربار",
                  "بهای بسته",
                  "بهای کیلو",
                  "فروش",
                  "سود",
                  "حاشیه",
                ].map((h) => (
                  <th key={h} className="px-3 py-3 text-right font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.product + r.packKg} className={i % 2 ? "bg-muted/60" : ""}>
                  <td className="px-3 py-2">{r.product}</td>
                  <td className="px-3 py-2">{packLabel(r.packKg)}</td>
                  <td className="px-3 py-2">{num(r.rawKg, 2)}</td>
                  <td className="px-3 py-2">{toman(r.rawAvg)}</td>
                  <td className="px-3 py-2">{toman(r.material)}</td>
                  <td className="px-3 py-2">{toman(r.packing)}</td>
                  <td className="px-3 py-2">{toman(r.production)}</td>
                  <td className="px-3 py-2">{toman(r.overhead)}</td>
                  <td className="px-3 py-2 font-medium">{toman(r.cogsPack)}</td>
                  <td className="px-3 py-2">{toman(r.cogsKg)}</td>
                  <td className="px-3 py-2">{r.salePrice ? toman(r.salePrice) : "—"}</td>
                  <td className="px-3 py-2">{r.salePrice ? toman(r.profit) : "—"}</td>
                  <td className="px-3 py-2">{r.salePrice ? pct(r.margin) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
