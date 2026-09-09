import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { ApprovalChip } from "@/components/ui/badge";
import { PageTitle } from "@/components/shell";
import { Panel } from "@/components/journal";
import { useWorkshop } from "@/lib/store";
import { COLLECTION_LABEL, pendingItems } from "@/lib/workshop-data";
import { useSessionProfile } from "@/lib/session";
import { listAudit } from "@/lib/workshop-api";

export const Route = createFileRoute("/approvals")({ component: Page });

function Page() {
  const store = useWorkshop();
  const { mutate, unread, notifications } = useSessionProfile();
  const items = pendingItems(store);
  const [note, setNote] = useState("");
  const [audit, setAudit] = useState<{ id: string; at: string; user_name: string; action: string; collection: string; summary: string }[]>([]);

  useEffect(() => {
    void listAudit()
      .then(setAudit)
      .catch(() => setAudit(store.audit.slice(0, 40).map((a) => ({ id: a.id, at: a.at, user_name: a.userName, action: a.action, collection: a.collection, summary: a.summary }))));
  }, [store.audit]);

  return (
    <div>
      <PageTitle
        title="درخواست‌های تأیید"
        hint="تا وقتی تأیید نکنید، موجودی، سود و مطالبات تغییر نمی‌کنند. رد یا اصلاح هم ثبت می‌شود."
      />
      {unread > 0 ? (
        <p className="mb-4 rounded-[var(--radius-md)] bg-warn-bg px-4 py-3 text-sm text-warn">
          {unread} اعلان خوانده‌نشده — آخرین: {notifications[0]?.title}
        </p>
      ) : null}

      {items.length === 0 ? (
        <Panel>
          <p className="py-8 text-center text-sm text-fg-muted">مورد معلقی نیست. کارگاه روی روال است.</p>
        </Panel>
      ) : (
        <div className="grid gap-3">
          {items.map((it) => (
            <Panel key={it.collection + it.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-fg-subtle">{COLLECTION_LABEL[it.collection]}</span>
                    <ApprovalChip status={it.approvalStatus} />
                  </div>
                  <h3 className="mt-1 font-semibold">{it.title}</h3>
                  <p className="mt-1 text-sm text-fg-muted">
                    {it.date} · ثبت‌کننده: {it.who}
                    {it.note ? ` · ${it.note}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      void mutate(
                        { type: "review", collection: it.collection, id: it.id, decision: "approved", note },
                        "تأیید شد",
                      )
                    }
                  >
                    <Check className="size-4" />
                    تأیید
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      void mutate(
                        { type: "review", collection: it.collection, id: it.id, decision: "revision", note: note || "لطفاً اصلاح و دوباره ثبت کنید" },
                        "درخواست اصلاح ثبت شد",
                      )
                    }
                  >
                    <Pencil className="size-4" />
                    اصلاح
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      void mutate(
                        { type: "review", collection: it.collection, id: it.id, decision: "rejected", note },
                        "رد شد",
                      )
                    }
                  >
                    <X className="size-4" />
                    رد
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
          <Field label="یادداشت مدیر (اختیاری، برای همه دکمه‌های بالا)">
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثلاً: وزن را با باسکول چک کنید" />
          </Field>
        </div>
      )}

      <h3 className="mt-8 mb-3 text-sm font-semibold">ثبت تغییرات (Audit)</h3>
      <Panel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-primary text-primary-foreground">
              <tr>
                {["زمان", "کاربر", "عمل", "بخش", "شرح"].map((h) => (
                  <th key={h} className="px-3 py-3 text-right font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {audit.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-center text-fg-muted" colSpan={5}>
                    هنوز تغییری ثبت نشده.
                  </td>
                </tr>
              ) : (
                audit.map((a, i) => (
                  <tr key={a.id} className={i % 2 ? "bg-muted/60" : ""}>
                    <td className="px-3 py-2 text-xs">{a.at.replace("T", " ").slice(0, 16)}</td>
                    <td className="px-3 py-2">{a.user_name}</td>
                    <td className="px-3 py-2">{a.action}</td>
                    <td className="px-3 py-2">{a.collection}</td>
                    <td className="px-3 py-2">{a.summary}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
