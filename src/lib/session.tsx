import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { canOpen, homeFor, ROLE_LABEL } from "@/lib/access";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useWorkshop } from "@/lib/store";
import {
  getMyProfile,
  listNotifications,
  loadWorkshopState,
  markNotificationsRead,
  runWorkshopMutation,
} from "@/lib/workshop-api";
import type { AccessRole, AppNotification, SessionProfile } from "@/lib/types";
import type { WorkshopMutation } from "@/lib/workshop-data";
import { autoApprove } from "@/lib/access";

type SessionCtx = {
  profile: SessionProfile;
  notifications: AppNotification[];
  unread: number;
  mutate: (m: WorkshopMutation, ok?: string) => Promise<void>;
  refreshNotes: () => Promise<void>;
  markRead: () => Promise<void>;
};

const Ctx = createContext<SessionCtx | null>(null);

export function useSessionProfile() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSessionProfile outside provider");
  return ctx;
}

export function useActorRole(): AccessRole {
  return useSessionProfile().profile.role;
}

function errMessage(err: unknown) {
  if (err && typeof err === "object" && "message" in err && typeof (err as Error).message === "string") {
    const m = (err as Error).message;
    if (m === "Unauthorized") return "نشست شما منقضی شده. دوباره وارد شوید.";
    return m;
  }
  return "خطا در ذخیره اطلاعات";
}

export function WorkshopSessionProvider({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const hydrate = useWorkshop((s) => s.hydrate);
  const [profile, setProfile] = useState<SessionProfile | null>(null);
  const [notes, setNotes] = useState<AppNotification[]>([]);
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function refreshNotes() {
    try {
      const rows = await listNotifications();
      setNotes(
        rows.map((r) => ({
          id: r.id,
          userId: user?.id ?? "",
          title: r.title,
          body: r.body,
          kind: r.kind,
          href: r.href ?? undefined,
          recordId: r.record_id ?? undefined,
          read: r.read,
          createdAt: r.created_at,
        })),
      );
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const p = await getMyProfile();
        if (cancelled) return;
        setProfile(p);
        if (!p.active) {
          setBlocked("حساب شما هنوز توسط مدیر فعال نشده است.");
          setReady(true);
          return;
        }
        const doc = await loadWorkshopState();
        if (cancelled) return;
        hydrate(doc);
        await refreshNotes();
      } catch (err) {
        if (!cancelled) setBlocked(errMessage(err));
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isPending]);

  const mutate = async (m: WorkshopMutation, ok?: string) => {
    try {
      const doc = await runWorkshopMutation({ data: m });
      hydrate(doc);
      const pending = profile && autoApprove(profile.role) === "pending" && m.type.startsWith("add");
      toast.success(ok ?? (pending ? "ثبت شد و منتظر تأیید مدیر است" : "ثبت شد"));
      if (pending) void refreshNotes();
    } catch (err) {
      toast.error(errMessage(err));
      throw err;
    }
  };

  const value = useMemo<SessionCtx | null>(() => {
    if (!profile) return null;
    return {
      profile,
      notifications: notes,
      unread: notes.filter((n) => !n.read).length,
      mutate,
      refreshNotes,
      markRead: async () => {
        await markNotificationsRead();
        setNotes((n) => n.map((x) => ({ ...x, read: true })));
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, notes]);

  if (isPending || !ready) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg text-fg">
        <p className="text-sm text-fg-muted">در حال ورود به سامانه کارگاه…</p>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (blocked || !profile) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center text-fg">
        <div className="max-w-md rounded-[var(--radius-lg)] border border-border bg-surface p-6">
          <h1 className="font-display text-xl font-semibold">دسترسی فعال نیست</h1>
          <p className="mt-2 text-sm text-fg-muted">{blocked ?? "پروفایل پیدا نشد."}</p>
        </div>
      </div>
    );
  }
  if (!canOpen(profile.role, pathname)) {
    return <Navigate to={homeFor(profile.role)} />;
  }
  if (!value) return null;
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function RoleHint() {
  const { profile } = useSessionProfile();
  return (
    <span className="text-xs text-fg-muted">
      {profile.displayName} · {ROLE_LABEL[profile.role]}
    </span>
  );
}
