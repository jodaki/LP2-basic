import { createFileRoute, Link } from "@tanstack/react-router";
import { PageTitle } from "@/components/shell";
import { Panel } from "@/components/journal";
import { useSessionProfile } from "@/lib/session";
import { useWorkshop } from "@/lib/store";
import { pendingItems } from "@/lib/workshop-data";

export const Route = createFileRoute("/work")({ component: Page });

function Page() {
  const { profile } = useSessionProfile();
  const store = useWorkshop();
  const mine = pendingItems(store).filter((p) => p.who === profile.displayName);
  const links =
    profile.role === "operator" || profile.role === "production"
      ? [{ to: "/production", label: "فرم تولید و پاک‌کردن", hint: "ورودی، محصول سالم، ضایعات و علت" }]
      : profile.role === "warehouse"
        ? [{ to: "/inventory", label: "فرم انبار و شمارش", hint: "ورود، خروج و شمارش فیزیکی" }]
        : [{ to: "/", label: "داشبورد", hint: "بازگشت" }];

  return (
    <div>
      <PageTitle
        title={`کار من — ${profile.displayName}`}
        hint="فقط همین فرم‌ها در دسترس شماست. بعد از ثبت، مدیر باید تأیید کند تا موجودی عوض شود."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 hover:bg-muted"
          >
            <h3 className="font-semibold">{l.label}</h3>
            <p className="mt-1 text-sm text-fg-muted">{l.hint}</p>
          </Link>
        ))}
      </div>
      <Panel className="mt-5">
        <h3 className="mb-2 text-sm font-semibold">وضعیت ثبت‌های من</h3>
        {mine.length === 0 ? (
          <p className="text-sm text-fg-muted">مورد معلقی از طرف شما نیست.</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {mine.map((m) => (
              <li key={m.id} className="rounded-[var(--radius-sm)] bg-warn-bg px-3 py-2 text-warn">
                {m.title} — {m.approvalStatus === "revision" ? "مدیر اصلاح خواسته" : "منتظر تأیید مدیر"}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
