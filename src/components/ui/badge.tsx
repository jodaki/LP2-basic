import { cn } from "@/lib/utils";
import type { StatusLight } from "@/lib/types";

const map: Record<StatusLight, { label: string; className: string }> = {
  ok: { label: "مطلوب", className: "bg-ok-bg text-ok" },
  watch: { label: "نیاز به بررسی", className: "bg-warn-bg text-warn" },
  critical: { label: "بحرانی", className: "bg-bad-bg text-bad" },
  info: { label: "اطلاعاتی", className: "bg-muted text-fg-muted" },
};

export function StatusBadge({ light }: { light: StatusLight }) {
  const m = map[light];
  return (
    <span className={cn("inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium", m.className)}>
      {m.label}
    </span>
  );
}

export function Dot({ light }: { light: StatusLight }) {
  const color =
    light === "ok" ? "bg-ok" : light === "watch" ? "bg-warn" : light === "critical" ? "bg-bad" : "bg-fg-subtle";
  return <span className={cn("inline-block size-2.5 rounded-full", color)} aria-hidden />;
}
