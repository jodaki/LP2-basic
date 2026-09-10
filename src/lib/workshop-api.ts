import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  applyMutation,
  normalizeDoc,
  sampleDoc,
  WorkshopError,
  type WorkshopMutation,
} from "@/lib/workshop-data";
import type { AccessRole, SessionProfile, WorkshopDoc } from "@/lib/types";
import { usernameToEmail } from "@/lib/access";

const STATE_ID = "main";

async function sqlClient() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

async function loadDoc() {
  const sql = await sqlClient();
  const rows = await sql<{ payload: unknown; version: number }>`
    select payload, version from workshop_state where id = ${STATE_ID}
  `;
  if (!rows[0]) {
    const fresh = sampleDoc();
    await sql.query("insert into workshop_state (id, payload, version, updated_by) values ($1, $2::jsonb, 1, $3)", [
      STATE_ID,
      JSON.stringify(fresh),
      "system",
    ]);
    return { doc: fresh, version: 1 };
  }
  const payload = typeof rows[0].payload === "string" ? JSON.parse(rows[0].payload) : rows[0].payload;
  return { doc: normalizeDoc(payload as WorkshopDoc), version: Number(rows[0].version) || 1 };
}

async function saveDoc(doc: WorkshopDoc, userId: string, version: number) {
  const sql = await sqlClient();
  const next = version + 1;
  const rows = await sql.query(
    "update workshop_state set payload = $1::jsonb, version = $2, updated_at = now(), updated_by = $3 where id = $4 and version = $5 returning version",
    [JSON.stringify(doc), next, userId, STATE_ID, version],
  );
  if (!rows[0]) {
    throw new WorkshopError("اطلاعات همزمان توسط کاربر دیگری تغییر کرده است. صفحه را تازه کنید و دوباره تلاش کنید.", 409);
  }
  return Number((rows[0] as { version: number }).version) || next;
}

async function getProfile(userId: string): Promise<SessionProfile | null> {
  const sql = await sqlClient();
  const rows = await sql<{
    user_id: string;
    username: string;
    display_name: string;
    role: AccessRole;
    employee_id: string | null;
    active: boolean;
  }>`select user_id, username, display_name, role, employee_id, active from profiles where user_id = ${userId}`;
  const r = rows[0];
  if (!r) return null;
  return {
    userId: r.user_id,
    username: r.username,
    displayName: r.display_name,
    role: r.role,
    employeeId: r.employee_id ?? undefined,
    active: r.active,
  };
}

async function lookupUser(userId: string) {
  const sql = await sqlClient();
  const rows = await sql<{ name: string; email: string }>`
    select "name", "email" from "user" where id = ${userId}
  `;
  return rows[0] ?? null;
}

async function bootstrapAdmin(userId: string): Promise<SessionProfile> {
  const sql = await sqlClient();
  const existing = await sql<{ user_id: string }>`select user_id from profiles limit 1`;
  const u = await lookupUser(userId);
  const displayName = u?.name || "مدیر کارگاه";
  const username = (u?.email?.split("@")[0] || "admin").toLowerCase().replace(/[^a-z0-9._-]/g, "") || "admin";
  if (existing.length) {
    return {
      userId,
      username,
      displayName,
      role: "operator",
      active: false,
      needsInvite: true,
    };
  }
  await sql`
    insert into profiles (user_id, username, display_name, role, active)
    values (${userId}, ${username}, ${displayName}, ${"admin"}, true)
  `;
  return { userId, username, displayName, role: "admin", active: true };
}

async function notifyAdmins(note: {
  title: string;
  body: string;
  href: string;
  recordId: string;
  kind: string;
}) {
  const sql = await sqlClient();
  const admins = await sql<{ user_id: string }>`select user_id from profiles where role = ${"admin"} and active = true`;
  for (const a of admins) {
    const id = crypto.randomUUID();
    await sql`
      insert into notifications (id, user_id, title, body, kind, href, record_id, read)
      values (${id}, ${a.user_id}, ${note.title}, ${note.body}, ${note.kind}, ${note.href}, ${note.recordId}, false)
    `;
  }
}

async function writeAuditRow(docLast: WorkshopDoc["audit"][number]) {
  const sql = await sqlClient();
  await sql`
    insert into audit_log (id, user_id, user_name, action, collection, record_id, summary)
    values (${docLast.id}, ${docLast.userId}, ${docLast.userName}, ${docLast.action}, ${docLast.collection}, ${docLast.recordId}, ${docLast.summary})
  `;
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    let profile = await getProfile(context.userId);
    if (!profile) profile = await bootstrapAdmin(context.userId);
    return profile;
  });

export const loadWorkshopState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = (await getProfile(context.userId)) ?? (await bootstrapAdmin(context.userId));
    if (!profile.active) throw new WorkshopError("حساب شما هنوز فعال نشده. از مدیر بخواهید دسترسی بدهد.", 403);
    const { doc } = await loadDoc();
    return doc;
  });

export const runWorkshopMutation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: WorkshopMutation) => d)
  .handler(async ({ context, data }) => {
    let profile = await getProfile(context.userId);
    if (!profile) profile = await bootstrapAdmin(context.userId);
    if (!profile.active) throw new WorkshopError("حساب غیرفعال است", 403);
    const { doc, version } = await loadDoc();
    const result = applyMutation(doc, data, profile);
    await saveDoc(result.doc, context.userId, version);
    if (result.notifyAdmins) await notifyAdmins(result.notifyAdmins);
    if (result.doc.audit[0]) {
      try {
        await writeAuditRow(result.doc.audit[0]);
      } catch {
        /* ignore duplicate */
      }
    }
    return result.doc;
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await sqlClient();
    return sql<{
      id: string;
      title: string;
      body: string;
      kind: string;
      href: string | null;
      record_id: string | null;
      read: boolean;
      created_at: string;
    }>`
      select id, title, body, kind, href, record_id, read, created_at
      from notifications
      where user_id = ${context.userId}
      order by created_at desc
      limit 40
    `;
  });

export const markNotificationsRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await sqlClient();
    await sql`update notifications set read = true where user_id = ${context.userId}`;
    return { ok: true };
  });

export const createEmployeeLogin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { employeeId: string; username: string; password: string; name: string; role: AccessRole }) => d)
  .handler(async ({ context, data }) => {
    const profile = await getProfile(context.userId);
    if (!profile || profile.role !== "admin") throw new WorkshopError("فقط مدیر می‌تواند حساب بسازد", 403);
    const username = data.username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
      throw new WorkshopError("نام کاربری باید لاتین، ۳ تا ۳۲ حرف باشد");
    }
    if (data.password.length < 8) throw new WorkshopError("رمز عبور حداقل ۸ کاراکتر");
    const email = usernameToEmail(username);
    const sql = await sqlClient();
    const taken = await sql<{ user_id: string }>`select user_id from profiles where username = ${username}`;
    if (taken.length) throw new WorkshopError("این نام کاربری قبلاً ثبت شده");

    const { auth } = await import("@/lib/auth/server");
    let newUserId: string | undefined;
    try {
      const { getRequest } = await import("@tanstack/react-start/server");
      const request = getRequest();
      const headers = new Headers();
      const origin = request?.headers.get("origin") ?? request?.headers.get("referer") ?? "http://127.0.0.1:8080";
      headers.set("origin", origin.split("/").slice(0, 3).join("/"));
      const created = await auth.api.signUpEmail({
        body: { email, password: data.password, name: data.name },
        headers,
      });
      newUserId = created.user?.id;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "ساخت حساب ناموفق بود";
      throw new WorkshopError(msg.includes("exists") ? "این نام کاربری قبلاً در سیستم ورود ثبت شده" : msg);
    }
    if (!newUserId) throw new WorkshopError("ساخت حساب ناموفق بود");

    await sql`
      insert into profiles (user_id, username, display_name, role, employee_id, active)
      values (${newUserId}, ${username}, ${data.name}, ${data.role}, ${data.employeeId}, true)
    `;

    const { doc, version } = await loadDoc();
    const result = applyMutation(
      doc,
      {
        type: "patchEmployee",
        id: data.employeeId,
        patch: { username, userId: newUserId, hasLogin: true, accessRole: data.role },
      },
      profile,
    );
    await saveDoc(result.doc, context.userId, version);
    return { userId: newUserId, username, doc: result.doc };
  });

export const listAudit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const profile = await getProfile(context.userId);
    if (!profile || profile.role !== "admin") throw new WorkshopError("فقط مدیر", 403);
    const sql = await sqlClient();
    return sql<{
      id: string;
      at: string;
      user_name: string;
      action: string;
      collection: string;
      summary: string;
    }>`
      select id, at, user_name, action, collection, summary
      from audit_log
      order by at desc
      limit 80
    `;
  });
