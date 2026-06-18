import type { NextRequest } from "next/server";

// Canonical origin for building absolute redirect URLs. Behind the Cloudflare
// Tunnel the forwarded Host is the internal service (localhost:3002), so any
// redirect derived from request.url / the Host header would send users to
// localhost. Prefer the explicitly configured origin; fall back to forwarded
// headers only for local dev where neither env is set.
export function getRequestOrigin(request: NextRequest): string {
  const configured = (process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL)
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\/$/, "");
  if (configured) return configured;

  const proto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host")?.split(",")[0]?.trim();

  if (proto && host) {
    return `${proto}://${host}`.replace(/\/$/, "");
  }

  if (host) {
    return `${request.nextUrl.protocol}//${host}`.replace(/\/$/, "");
  }

  return request.nextUrl.origin;
}
