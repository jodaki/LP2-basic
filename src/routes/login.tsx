import { useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { usernameToEmail } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (isPending) {
    return (
      <main className="grid min-h-dvh place-items-center bg-bg text-fg">
        <p className="text-sm text-fg-muted">در حال بررسی نشست…</p>
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data, error: err } = await authClient.signIn.email({
        email: usernameToEmail(username),
        password,
        callbackURL: "/",
      });
      if (err) throw new Error(err.message ?? "ورود ناموفق");
      const token = data && "token" in data ? (data as { token?: string }).token : undefined;
      if (token) {
        try {
          window.sessionStorage.setItem("grok-auth.bearer-token", token);
        } catch {
          /* ignore */
        }
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "نام کاربری یا رمز عبور نادرست است");
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-bg p-6 text-fg">
      <div className="w-full max-w-sm rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-sm">
        <p className="text-[11px] font-medium tracking-wide text-fg-muted">کارگاه بسته‌بندی حبوبات</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">ورود به سامانه پلدختر</h1>
        <p className="mt-2 text-sm text-fg-muted">هر کس فقط کار خودش را می‌بیند. ثبت‌ها تا تأیید مدیر در موجودی اثر نمی‌گذارند.</p>

        <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
          <Field label="نام کاربری">
            <Input
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              dir="ltr"
            />
          </Field>
          <Field label="رمز عبور">
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          {error ? <p className="text-sm text-bad">{error}</p> : null}
          <Button type="submit" disabled={busy || !authEnabled}>
            {busy ? "در حال ورود…" : "ورود"}
          </Button>
        </form>

        {authEnabled ? (
          <div className="mt-5 border-t border-border pt-4">
            <p className="mb-2 text-xs text-fg-subtle">ورود مدیر با حساب گوگل یا ایکس</p>
            <div className="grid gap-2">
              {GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                  className="h-11 w-full rounded-[var(--radius-sm)] border border-border text-sm hover:bg-muted"
                >
                  ادامه با {p.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-fg-subtle">ورود فعلاً غیرفعال است.</p>
        )}
      </div>
    </main>
  );
}
