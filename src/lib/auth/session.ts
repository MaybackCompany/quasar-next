import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

import type { AccessTier } from "@/lib/auth/roles";

export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
}

export interface AuthSession {
  user?: DiscordUser;
  authorized?: boolean;
  isAdmin?: boolean;
  matchedRole?: AccessTier | null;
  /** Role id behind matchedRole — the role the trial system pulls on expiry. */
  matchedRoleId?: string | null;
  inGuild?: boolean;
  oauthState?: string;
  oauthRedirectUri?: string;
  returnTo?: string;
}

const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

export const ACCESS_MODE = (process.env.ACCESS_MODE || "public").trim().toLowerCase();
export const AUTH_ENABLED = ACCESS_MODE === "discord";
export const SESSION_COOKIE_NAME = "qu.sid";

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "public-mode-placeholder-session-secret-32",
  cookieName: SESSION_COOKIE_NAME,
  cookieOptions: {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  },
};

export async function getSession() {
  return getIronSession<AuthSession>(await cookies(), sessionOptions);
}

export function safeReturnTo(url: string | null | undefined): string {
  if (!url || url.length > 512) return "/";
  if (!url.startsWith("/")) return "/";
  if (url.startsWith("//") || url.startsWith("/\\")) return "/";
  if (url.startsWith("/auth/")) return "/";
  return url;
}

// Allowed roles live in the code catalog (src/lib/auth/roles.ts), so the only
// runtime config the gate needs is the Discord app + bot secrets below.
export function getMissingAuthEnv(): string[] {
  if (!AUTH_ENABLED) return [];

  // Login + role gating run on OAuth (guilds.members.read scope), so these four
  // are the hard requirement. DISCORD_BOT_TOKEN is only needed for the Director
  // admin panel's grant/revoke and the role-read fallback, so it is intentionally
  // NOT required here — the login wall works without it.
  const required = [
    "SESSION_SECRET",
    "DISCORD_CLIENT_ID",
    "DISCORD_CLIENT_SECRET",
    "DISCORD_GUILD_ID",
  ];
  return required.filter((key) => !process.env[key]);
}
