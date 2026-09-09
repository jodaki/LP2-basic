import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Field, Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/shell";
import { AddForm, DataTable, Panel } from "@/components/journal";
import { pct, toman } from "@/lib/format";
import { inMonth, saleFinal } from "@/lib/kpis";
import { useWorkshop } from "@/lib/store";
import { ACCESS_ROLES, inferAccessRole, ROLE_LABEL } from "@/lib/access";
import { useSessionProfile } from "@/lib/session";
import { isPosted } from "@/lib/costing";
import type { AccessRole, Employee } from "@/lib/types";
import { createEmployeeLogin } from "@/lib/workshop-api";

export const Route = createFileRoute("/employees")({ component: Page });

function Page() {
  const { employees, sales, settings, hydrate } = useWorkshop();
  const { mutate } = useSessionProfile();
  const [loginFor, setLoginFor] = useState<Employee | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AccessRole>("operator");
  const [busy, setBusy] = useState(false);

  return (
    <div>
      <PageTitle
        title="کارکنان و دسترسی"
        hint="برای هر نیرو نام کاربری و رمز بسازید. کارگر ساده فقط فرم کار خودش را می‌بیند و ثبت‌هایش منتظر تأیید شما می‌ماند."
      />
      <AddForm
        title="افزودن نیرو"
        onSubmit={(e) => {
          const f = new FormData(e.currentTarget);
          const job = String(f.get("role"));
          void mutate({
            type: "addEmployee",
            row: {
              name: String(f.get("name")),
              role: job,
              accessRole: (String(f.get("accessRole")) as AccessRole) || inferAccessRole(job),
              duties: String(f.get("duties") || ""),
              salary: Number(f.get("salary") || 0),
              commissionRate: Number(f.get("commissionRate") || 0) / 100,
              start: String(f.get("start") || settings.today),
              status: "فعال",
              note: String(f.get("note") || ""),
            },
          });
        }}
      >
        <Field label="نام">
          <Input name="name" required />
        </Field>
        <Field label="سمت شغلی">
          <Select name="role">
            <option>مدیر/مالک</option>
            <option>مسئول انبار</option>
            <option>نیروی تولید</option>
            <option>ویزیتور</option>
            <option>کمک تولید</option>
            <option>حسابدار</option>
            <option>خرید</option>
          </Select>
        </Field>
        <Field label="نقش دسترسی">
          <Select name="accessRole">
            {ACCESS_ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="وظایف">
          <Input name="duties" />
        </Field>
        <Field label="حقوق ثابت">
          <Input name="salary" type="number" />
        </Field>
        <Field label="پورسانت (٪)">
          <Input name="commissionRate" type="number" step="0.1" defaultValue={0} />
        </Field>
        <Field label="شروع">
          <Input name="start" defaultValue={settings.today} />
        </Field>
      </AddForm>

      {loginFor ? (
        <Panel className="mb-5">
          <h3 className="mb-3 text-sm font-semibold">حساب ورود برای {loginFor.name}</h3>
          <form
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                const res = await createEmployeeLogin({
                  data: {
                    employeeId: loginFor.id,
                    username,
                    password,
                    name: loginFor.name,
                    role,
                  },
                });
                hydrate(res.doc);
                toast.success(`حساب ${res.username} ساخته شد`);
                setLoginFor(null);
                setUsername("");
                setPassword("");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "ساخت حساب ناموفق");
              } finally {
                setBusy(false);
              }
            }}
          >
            <Field label="نام کاربری (لاتین)">
              <Input dir="ltr" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Field>
            <Field label="رمز عبور (حداقل ۸)">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Field>
            <Field label="نقش سیستم">
              <Select value={role} onChange={(e) => setRole(e.target.value as AccessRole)}>
                {ACCESS_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? "…" : "ساخت حساب"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setLoginFor(null)}>
                انصراف
              </Button>
            </div>
          </form>
          <p className="mt-2 text-xs text-fg-subtle">کارمند با همین نام کاربری و رمز از صفحه ورود وارد می‌شود.</p>
        </Panel>
      ) : null}

      <DataTable
        columns={[
          { key: "n", label: "نام" },
          { key: "r", label: "سمت" },
          { key: "a", label: "نقش سیستم" },
          { key: "u", label: "نام کاربری" },
          { key: "s", label: "حقوق" },
          { key: "c", label: "پورسانت ماه" },
          { key: "l", label: "حساب" },
        ]}
        rows={employees.map((e) => {
          const sold = sales
            .filter((s) => isPosted(s) && s.seller === e.name && inMonth(s.date, settings.year, settings.month))
            .reduce((a, s) => a + saleFinal(s), 0);
          const comm = sold * (e.commissionRate || 0);
          return {
            id: e.id,
            cells: [
              e.name,
              e.role,
              ROLE_LABEL[e.accessRole] ?? e.accessRole,
              e.username || "—",
              toman(e.salary),
              toman(comm),
              e.hasLogin ? (
                "فعال"
              ) : (
                <button
                  type="button"
                  className="text-sm text-primary underline"
                  onClick={() => {
                    setLoginFor(e);
                    setRole(e.accessRole);
                    setUsername("");
                    setPassword("");
                  }}
                >
                  تعریف ورود
                </button>
              ),
            ],
          };
        })}
      />
    </div>
  );
}
