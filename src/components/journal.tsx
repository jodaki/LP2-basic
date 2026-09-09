import type { FormEvent, ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-[var(--radius-xl)] border border-border bg-surface p-4 sm:p-5", className)}>
      {children}
    </section>
  );
}

export function AddForm({
  title,
  onSubmit,
  children,
}: {
  title: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
}) {
  return (
    <Panel className="mb-5">
      <h3 className="mb-4 text-sm font-semibold">{title}</h3>
      <form
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
          e.currentTarget.reset();
        }}
      >
        {children}
        <div className="flex items-end">
          <Button type="submit" className="w-full sm:w-auto">
            ثبت
          </Button>
        </div>
      </form>
    </Panel>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; className?: string }[];
  rows: { id: string; cells: ReactNode[]; onDelete?: () => void }[];
}) {
  if (!rows.length) {
    return (
      <Panel>
        <p className="py-8 text-center text-sm text-fg-muted">هنوز ردیفی ثبت نشده.</p>
      </Panel>
    );
  }
  return (
    <Panel className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className={cn("px-3 py-3 text-right font-medium", c.className)}>
                  {c.label}
                </th>
              ))}
              <th className="w-12 px-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={i % 2 ? "bg-muted/60" : "bg-surface"}>
                {r.cells.map((cell, idx) => (
                  <td key={idx} className="px-3 py-2.5 align-middle">
                    {cell}
                  </td>
                ))}
                <td className="px-2">
                  {r.onDelete ? (
                    <button
                      type="button"
                      onClick={r.onDelete}
                      className="grid size-9 place-items-center rounded-[var(--radius-sm)] text-fg-subtle hover:bg-bad-bg hover:text-bad"
                      aria-label="حذف"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
