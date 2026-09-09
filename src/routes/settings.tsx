import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { PageTitle } from "@/components/shell";
import { Panel } from "@/components/journal";
import { MONTHS } from "@/lib/format";
import { formatKpi } from "@/lib/kpis";
import { useWorkshop } from "@/lib/store";

export const Route = createFileRoute("/settings")({ component: Page });

function Page() {
  const { settings, setSettings, kpiDefs, setKpiDef, resetSample } = useWorkshop();
  return (
    <div>
      <PageTitle
        title="تنظیمات و اهداف"
        hint="این اعداد چراغ داشبورد را عوض می‌کنند. سلول‌های هدف را با واقعیت کارگاه خودتان تنظیم کنید."
        actions={
          <Button variant="secondary" onClick={() => resetSample()}>
            بازگشت به داده نمونه
          </Button>
        }
      />
      <Panel className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="نام کارگاه">
          <Input value={settings.workshop} onChange={(e) => setSettings({ workshop: e.target.value })} />
        </Field>
        <Field label="سال جاری">
          <Input
            type="number"
            value={settings.year}
            onChange={(e) => setSettings({ year: Number(e.target.value) })}
          />
        </Field>
        <Field label="ماه جاری">
          <Input
            type="number"
            min={1}
            max={12}
            value={settings.month}
            onChange={(e) => setSettings({ month: Number(e.target.value) })}
          />
        </Field>
        <p className="self-end text-sm text-fg-muted">{MONTHS[settings.month - 1] ?? ""}</p>
        <Field label="تاریخ امروز (شمسی)">
          <Input value={settings.today} onChange={(e) => setSettings({ today: e.target.value })} />
        </Field>
        <Field label="آستانه مشتری A (تومان)">
          <Input type="number" value={settings.abcA} onChange={(e) => setSettings({ abcA: Number(e.target.value) })} />
        </Field>
        <Field label="آستانه مشتری B (تومان)">
          <Input type="number" value={settings.abcB} onChange={(e) => setSettings({ abcB: Number(e.target.value) })} />
        </Field>
        <Field label="حداقل موجودی مواد (کیلو)">
          <Input type="number" value={settings.minRaw} onChange={(e) => setSettings({ minRaw: Number(e.target.value) })} />
        </Field>
        <Field label="حداقل موجودی محصول (کیلو)">
          <Input type="number" value={settings.minFin} onChange={(e) => setSettings({ minFin: Number(e.target.value) })} />
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
                          setKpiDef(k.key, { green: k.unit === "درصد" ? n / 100 : n });
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
                          setKpiDef(k.key, { yellow: k.unit === "درصد" ? n / 100 : n });
                        }}
                      />
                    )}
                  </td>
                  <td className="px-3 py-2 text-fg-muted">
                    {k.direction === "higher" ? "بالاتر بهتر" : k.direction === "lower" ? "پایین‌تر بهتر" : "اطلاعاتی"}
                  </td>
                  <td className="px-3 py-2">{k.unit === "درصد" ? "٪ (عدد را بدون درصد بنویسید)" : k.unit}</td>
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
