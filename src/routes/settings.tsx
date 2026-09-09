import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { Panel } from "@/components/journal";
import { MONTHS } from "@/lib/format";
import { formatKpi } from "@/lib/kpis";
import { useWorkshop } from "@/lib/store";
import { useSessionProfile } from "@/lib/session";

export const Route = createFileRoute("/settings")({ component: Page });

function Page() {
  const { settings, kpiDefs } = useWorkshop();
  const { mutate } = useSessionProfile();
  return (
    <div>
      <PageTitle
        title="تنظیمات و اهداف"
        hint="این اعداد چراغ داشبورد، نقطه سفارش و بهای تمام‌شده را عوض می‌کنند."
        actions={
          <Button variant="secondary" onClick={() => void mutate({ type: "resetSample" }, "داده نمونه بارگذاری شد")}>
            بازگشت به داده نمونه
          </Button>
        }
      />
      <Panel className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="نام کارگاه">
          <Input defaultValue={settings.workshop} onBlur={(e) => void mutate({ type: "setSettings", patch: { workshop: e.target.value } })} />
        </Field>
        <Field label="سال جاری">
          <Input type="number" defaultValue={settings.year} onBlur={(e) => void mutate({ type: "setSettings", patch: { year: Number(e.target.value) } })} />
        </Field>
        <Field label="ماه جاری">
          <Input type="number" min={1} max={12} defaultValue={settings.month} onBlur={(e) => void mutate({ type: "setSettings", patch: { month: Number(e.target.value) } })} />
        </Field>
        <p className="self-end text-sm text-fg-muted">{MONTHS[settings.month - 1] ?? ""}</p>
        <Field label="تاریخ امروز (شمسی)">
          <Input defaultValue={settings.today} onBlur={(e) => void mutate({ type: "setSettings", patch: { today: e.target.value } })} />
        </Field>
        <Field label="حداقل موجودی مواد (کیلو)">
          <Input type="number" defaultValue={settings.minRaw} onBlur={(e) => void mutate({ type: "setSettings", patch: { minRaw: Number(e.target.value) } })} />
        </Field>
        <Field label="نقطه سفارش مواد">
          <Input type="number" defaultValue={settings.reorderRaw} onBlur={(e) => void mutate({ type: "setSettings", patch: { reorderRaw: Number(e.target.value) } })} />
        </Field>
        <Field label="حداقل موجودی محصول">
          <Input type="number" defaultValue={settings.minFin} onBlur={(e) => void mutate({ type: "setSettings", patch: { minFin: Number(e.target.value) } })} />
        </Field>
        <Field label="نقطه سفارش محصول">
          <Input type="number" defaultValue={settings.reorderFin} onBlur={(e) => void mutate({ type: "setSettings", patch: { reorderFin: Number(e.target.value) } })} />
        </Field>
        <Field label="هزینه بسته ۴۰۰ گرم">
          <Input type="number" defaultValue={settings.packingCost400} onBlur={(e) => void mutate({ type: "setSettings", patch: { packingCost400: Number(e.target.value) } })} />
        </Field>
        <Field label="هزینه بسته ۹۰۰ گرم">
          <Input type="number" defaultValue={settings.packingCost900} onBlur={(e) => void mutate({ type: "setSettings", patch: { packingCost900: Number(e.target.value) } })} />
        </Field>
        <Field label="هزینه کیسه ۱۰ کیلو">
          <Input type="number" defaultValue={settings.packingCost10} onBlur={(e) => void mutate({ type: "setSettings", patch: { packingCost10: Number(e.target.value) } })} />
        </Field>
        <Field label="هزینه تولید هر کیلو">
          <Input type="number" defaultValue={settings.productionCostPerKg} onBlur={(e) => void mutate({ type: "setSettings", patch: { productionCostPerKg: Number(e.target.value) } })} />
        </Field>
        <Field label="سربار هر کیلو">
          <Input type="number" defaultValue={settings.overheadPerKg} onBlur={(e) => void mutate({ type: "setSettings", patch: { overheadPerKg: Number(e.target.value) } })} />
        </Field>
        <Field label="بازده پیش‌فرض">
          <Input type="number" step="0.01" defaultValue={settings.yieldDefault} onBlur={(e) => void mutate({ type: "setSettings", patch: { yieldDefault: Number(e.target.value) } })} />
        </Field>
        <Field label="آستانه مغایرت شمارش">
          <Input type="number" step="0.01" defaultValue={settings.countVariancePct} onBlur={(e) => void mutate({ type: "setSettings", patch: { countVariancePct: Number(e.target.value) } })} />
        </Field>
      </Panel>

      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                {["شاخص", "هدف مطلوب", "آستانه بررسی", "جهت", "واحد"].map((h) => (
                  <th key={h} className="px-3 py-3 text-right font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {kpiDefs.map((k, i) => (
                <tr key={k.key} className={i % 2 ? "bg-muted/60" : ""}>
                  <td className="px-3 py-2">{k.name}</td>
                  <td className="px-3 py-2">
                    {k.green == null ? (
                      "—"
                    ) : (
                      <Input
                        className="h-9"
                        defaultValue={k.unit === "درصد" ? String(k.green * 100) : String(k.green)}
                        onBlur={(e) => {
                          const n = Number(e.target.value);
                          void mutate({ type: "setKpiDef", key: k.key, patch: { green: k.unit === "درصد" ? n / 100 : n } });
                        }}
                      />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {k.yellow == null ? (
                      "—"
                    ) : (
                      <Input
                        className="h-9"
                        defaultValue={k.unit === "درصد" ? String(k.yellow * 100) : String(k.yellow)}
                        onBlur={(e) => {
                          const n = Number(e.target.value);
                          void mutate({ type: "setKpiDef", key: k.key, patch: { yellow: k.unit === "درصد" ? n / 100 : n } });
                        }}
                      />
                    )}
                  </td>
                  <td className="px-3 py-2 text-fg-muted">
                    {k.direction === "higher" ? "بالاتر بهتر" : k.direction === "lower" ? "پایین‌تر بهتر" : "اطلاعاتی"}
                  </td>
                  <td className="px-3 py-2">{k.unit === "درصد" ? "٪" : k.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <p className="mt-3 text-xs text-fg-subtle">
        تاریخ را با اعداد انگلیسی بنویسید: 1405/06/18. هدف فروش ماه الان {formatKpi(kpiDefs.find((k) => k.key === "sales_month")?.green ?? 0, "تومان")} تومان است.
      </p>
    </div>
  );
}
