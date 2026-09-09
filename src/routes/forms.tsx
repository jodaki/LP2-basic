import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { PageTitle } from "@/components/shell";
import { FORMS } from "@/lib/forms";

export const Route = createFileRoute("/forms")({ component: Page });

function Page() {
  return (
    <div>
      <PageTitle
        title="فرم‌های کاغذی A4"
        hint="سیاه‌وسفید، مناسب چاپ و پر کردن با خودکار. روی کارت بزنید و از مرورگر چاپ کنید، یا کل مجموعه را از PDF دانلود کنید."
        actions={
          <a
            href="/files/formha-chapi-A4.pdf"
            download
            className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] bg-primary px-4 text-sm text-primary-foreground"
          >
            <Printer className="size-4" />
            دانلود PDF همه فرم‌ها
          </a>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {FORMS.map((f) => (
          <Link
            key={f.id}
            to="/forms/$id"
            params={{ id: f.id }}
            className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 transition-colors hover:bg-muted"
          >
            <p className="text-xs text-fg-subtle">{f.code}</p>
            <h3 className="mt-1 font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-fg-muted">مسئول: {f.who}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
