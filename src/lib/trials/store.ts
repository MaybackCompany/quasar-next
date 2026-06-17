import type { AccessTier } from "@/lib/auth/roles";

// Time-limited trial access store.
//
// This app is a giveaway/trial distribution of the guide (the real paying
// customers live on the main site), so every access-holder here is a trial.
// We track each member + their expiry in a tiny KV store so the Director can
// set windows and the gate can lock + upsell when a window runs out.
//
// Backed by the Upstash REST API (the same env Vercel KV provisions:
// KV_REST_API_URL + KV_REST_API_TOKEN). We talk to it with fetch only, so this
// module is safe in BOTH the edge proxy/middleware and node route handlers.
// If the env is missing the whole layer no-ops: getMember returns null, the
// gate behaves exactly as before (role = access, no expiry), nothing 500s.

export type TrialStatus = "active" | "expired" | "revoked";

export interface TrialMember {
  /** Discord user id (snowflake). */
  id: string;
  username: string;
  avatar: string | null;
  /** Highest access tier held, for display. */
  tier: AccessTier | null;
  /** The grantable access role to pull when the window ends. */
  roleId: string | null;
  firstSeenAt: number;
  /** Epoch ms; null means no clock (permanent). */
  expiresAt: number | null;
  status: TrialStatus;
  /** "auto" = default clock on first visit, "manual" = a Director set it. */
  source: "auto" | "manual";
  updatedAt: number;
}

const KV_URL = process.env.KV_REST_API_URL?.replace(/\/$/, "");
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

/** True only when a KV backend is configured. Everything degrades to no-op otherwise. */
export const TRIAL_KV_ENABLED = Boolean(KV_URL && KV_TOKEN);

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Default trial length applied on first authorized visit (env-overridable). */
export const TRIAL_DEFAULT_DAYS = (() => {
  const n = Number(process.env.TRIAL_DEFAULT_DAYS);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 7;
})();

const INDEX_KEY = "trial:index";
const memberKey = (id: string) => `trial:member:${id}`;

/** Run a single Redis command over the Upstash REST API. Returns null on any
 * failure or when KV is not configured, so callers never throw. */
async function redis<T = unknown>(command: (string | number)[]): Promise<T | null> {
  if (!TRIAL_KV_ENABLED) return null;
  try {
    const res = await fetch(KV_URL as string, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: T; error?: string };
    if (data.error) return null;
    return (data.result ?? null) as T | null;
  } catch {
    return null;
  }
}

export async function getMember(id: string): Promise<TrialMember | null> {
  const raw = await redis<string | null>(["GET", memberKey(id)]);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as TrialMember;
  } catch {
    return null;
  }
}

export async function putMember(member: TrialMember): Promise<boolean> {
  if (!TRIAL_KV_ENABLED) return false;
  const ok = await redis(["SET", memberKey(member.id), JSON.stringify(member)]);
  await redis(["SADD", INDEX_KEY, member.id]);
  return ok !== null;
}

export async function deleteMember(id: string): Promise<void> {
  await redis(["DEL", memberKey(id)]);
  await redis(["SREM", INDEX_KEY, id]);
}

export async function listMembers(): Promise<TrialMember[]> {
  const ids = (await redis<string[]>(["SMEMBERS", INDEX_KEY])) ?? [];
  if (!ids.length) return [];
  const raws = (await redis<(string | null)[]>(["MGET", ...ids.map(memberKey)])) ?? [];
  const out: TrialMember[] = [];
  for (const raw of raws) {
    if (!raw) continue;
    try {
      out.push(JSON.parse(raw) as TrialMember);
    } catch {
      // skip a corrupt row rather than fail the whole list
    }
  }
  return out;
}

/** Is this member currently locked out (window elapsed, expired, or revoked)? */
export function isExpired(member: TrialMember | null | undefined, now = Date.now()): boolean {
  if (!member) return false;
  if (member.status === "revoked" || member.status === "expired") return true;
  if (member.expiresAt !== null && now >= member.expiresAt) return true;
  return false;
}

/** Whole days remaining (ceil), or null for a permanent window. */
export function daysLeft(member: TrialMember, now = Date.now()): number | null {
  if (member.expiresAt === null) return null;
  return Math.ceil((member.expiresAt - now) / DAY_MS);
}

interface AccessInput {
  id: string;
  username: string;
  avatar: string | null;
  tier: AccessTier | null;
  roleId: string | null;
}

/** Create the member record on first authorized visit with the default clock.
 * Idempotent: returns the existing record if already registered. */
export async function registerOnAccess(input: AccessInput): Promise<TrialMember | null> {
  if (!TRIAL_KV_ENABLED) return null;
  const existing = await getMember(input.id);
  if (existing) return existing;

  const now = Date.now();
  const member: TrialMember = {
    id: input.id,
    username: input.username,
    avatar: input.avatar,
    tier: input.tier,
    roleId: input.roleId,
    firstSeenAt: now,
    expiresAt: now + TRIAL_DEFAULT_DAYS * DAY_MS,
    status: "active",
    source: "auto",
    updatedAt: now,
  };
  await putMember(member);
  return member;
}

/** Director sets/replaces a member's window. expiresAt null = permanent. */
export async function setMemberWindow(id: string, expiresAt: number | null): Promise<TrialMember | null> {
  const member = await getMember(id);
  if (!member) return null;
  const next: TrialMember = {
    ...member,
    expiresAt,
    status: "active",
    source: "manual",
    updatedAt: Date.now(),
  };
  await putMember(next);
  return next;
}

/** Flip a member to a terminal status after the role has been (or will be) pulled. */
export async function markStatus(id: string, status: TrialStatus): Promise<TrialMember | null> {
  const member = await getMember(id);
  if (!member) return null;
  const next: TrialMember = { ...member, status, updatedAt: Date.now() };
  await putMember(next);
  return next;
}
