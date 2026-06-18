import { unsealData } from "iron-session";
import { NextResponse, type NextProxy, type NextRequest, type ProxyConfig } from "next/server";

import type { AuthSession } from "@/lib/auth/session";
import { getMember, isExpired, registerOnAccess } from "@/lib/trials/store";
import { PRICING_URL } from "@/lib/links";
import { getRequestOrigin } from "@/lib/origin";

const accessMode = (process.env.ACCESS_MODE || "public").trim().toLowerCase();
const authEnabled = accessMode === "discord";
const sessionCookieName = "qu.sid";
const sessionPassword = process.env.SESSION_SECRET || "public-mode-placeholder-session-secret-32";

// Members-only model: the marketing layer and the track OUTLINES are public so
// prospects can see what they'd buy. Every lesson, cheatsheet, and reference hub
// requires an allowed Discord role (Builder / Elite / Enterprise / member).
// Pricing is not in this app; gated-out non-members go to the marketing site.
// /api/cron is public to the proxy because Vercel Cron calls it with no session
// cookie; it secures itself with CRON_SECRET. /expired is the trial win-back
// offer screen, so it must be reachable by a locked-out (or de-roled) member.
const PUBLIC_PREFIXES = ["/auth/", "/_next/", "/api/me", "/api/cron", "/track", "/blog"];
const PUBLIC_PATHS = new Set([
  "/",
  "/toolbox",
  "/paywall",
  "/expired",
  "/favicon.ico",
  "/headlogo.png",
  "/robots.txt",
  "/sitemap.xml",
  "/sitemap",
]);
const STATIC_FILE_RE = /\.(?:avif|css|gif|ico|jpeg|jpg|js|json|map|png|svg|txt|webp|woff2?|ttf)$/i;

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  return STATIC_FILE_RE.test(pathname);
}

function returnToFromRequest(request: NextRequest): string {
  const value = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/";
  if (value.startsWith("/auth/")) return "/";
  return value.length > 512 ? "/" : value;
}

async function readSession(request: NextRequest): Promise<AuthSession | null> {
  const cookie = request.cookies.get(sessionCookieName)?.value;
  if (!cookie) return null;

  try {
    return await unsealData<AuthSession>(cookie, { password: sessionPassword });
  } catch {
    return null;
  }
}

export const proxy: NextProxy = async (request: NextRequest): Promise<NextResponse> => {
  if (!authEnabled || isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const origin = getRequestOrigin(request);
  const session = await readSession(request);

  if (!session?.user) {
    const loginUrl = new URL("/auth/login", origin);
    loginUrl.searchParams.set("returnTo", returnToFromRequest(request));
    return NextResponse.redirect(loginUrl);
  }

  // Directors are never part of the trial system — never tracked, never locked out.
  if (session.isAdmin) {
    return NextResponse.next();
  }

  // Trial-expiry layer. getMember no-ops to null without a KV backend, so a
  // site with no KV configured falls straight through to the role-only gate.
  const member = await getMember(session.user.id);

  if (!session.authorized) {
    // Someone we've seen before but who no longer holds the role (their trial
    // role was pulled) gets the win-back offer; a true stranger goes to pricing.
    return NextResponse.redirect(member ? new URL("/expired", origin) : new URL(PRICING_URL));
  }

  // Authorized but the window has elapsed (or was expired/revoked) → upsell screen.
  if (isExpired(member)) {
    return NextResponse.redirect(new URL("/expired", origin));
  }

  // Authorized + active but not yet tracked (their cookie predates this deploy,
  // or KV was just turned on): lazily start their default clock.
  if (!member) {
    await registerOnAccess({
      id: session.user.id,
      username: session.user.username,
      avatar: session.user.avatar,
      tier: session.matchedRole ?? null,
      roleId: session.matchedRoleId ?? null,
    });
  }

  return NextResponse.next();
};

export const config: ProxyConfig = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
