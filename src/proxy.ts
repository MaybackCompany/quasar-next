import { unsealData } from "iron-session";
import { NextResponse, type NextProxy, type NextRequest, type ProxyConfig } from "next/server";

import type { AuthSession } from "@/lib/auth/session";

const accessMode = (process.env.ACCESS_MODE || "public").trim().toLowerCase();
const authEnabled = accessMode === "discord";
const sessionCookieName = "qu.sid";
const sessionPassword = process.env.SESSION_SECRET || "public-mode-placeholder-session-secret-32";

// Members-only model: the marketing layer and the track OUTLINES are public so
// prospects can see what they'd buy. Every lesson, cheatsheet, and reference hub
// requires an allowed Discord role (Builder / Elite / Enterprise / member).
const PUBLIC_PREFIXES = ["/auth/", "/_next/", "/api/me", "/track"];
const PUBLIC_PATHS = new Set([
  "/",
  "/pricing",
  "/toolbox",
  "/paywall",
  "/favicon.ico",
  "/headlogo.png",
  "/robots.txt",
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

  const session = await readSession(request);

  if (!session?.user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", returnToFromRequest(request));
    return NextResponse.redirect(loginUrl);
  }

  if (!session.authorized) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  return NextResponse.next();
};

export const config: ProxyConfig = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
