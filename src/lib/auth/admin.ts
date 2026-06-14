import { fetchMemberRolesByBot } from "@/lib/auth/discord";
import { summarizeRoles } from "@/lib/auth/roles";
import { AUTH_ENABLED, getSession } from "@/lib/auth/session";

export const SNOWFLAKE_RE = /^\d{17,20}$/;

export type AdminCheck =
  | { ok: true; userId: string; username: string }
  | { ok: false; status: number; error: string };

/**
 * Gate for the Director admin panel and its API routes. Beyond reading the
 * sealed session, this re-verifies the caller's roles LIVE against Discord so a
 * stale cookie can never retain admin after a role is removed.
 */
export async function requireAdmin(): Promise<AdminCheck> {
  if (!AUTH_ENABLED) return { ok: false, status: 404, error: "not_found" };

  const session = await getSession();
  if (!session.user) return { ok: false, status: 401, error: "not_signed_in" };

  const roles = await fetchMemberRolesByBot(session.user.id);
  if (roles === null) return { ok: false, status: 503, error: "discord_unavailable" };

  const { isAdmin } = summarizeRoles(roles);
  if (!isAdmin) return { ok: false, status: 403, error: "not_admin" };

  return { ok: true, userId: session.user.id, username: session.user.username };
}
