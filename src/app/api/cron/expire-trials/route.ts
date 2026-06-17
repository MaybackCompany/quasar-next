import { NextResponse, type NextRequest } from "next/server";

import { setGuildMemberRole } from "@/lib/auth/discord";
import { isExpired, listMembers, markStatus, TRIAL_KV_ENABLED } from "@/lib/trials/store";

export const dynamic = "force-dynamic";

// Daily backstop (Vercel Cron, see vercel.json). Removes the access role from
// every member whose window has elapsed, even if they never reopen the site.
// Vercel automatically sends `Authorization: Bearer $CRON_SECRET`, so we refuse
// to run a role-pulling endpoint unless CRON_SECRET is configured and matches.
export async function GET(request: NextRequest): Promise<NextResponse> {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "cron_not_configured" }, { status: 503 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!TRIAL_KV_ENABLED) {
    return NextResponse.json({ ok: true, kv: false, scanned: 0, pulled: 0 });
  }

  const members = await listMembers();
  const now = Date.now();
  let pulled = 0;

  for (const m of members) {
    // Skip rows already in a terminal state and rows whose clock is still ticking.
    if (m.status === "expired" || m.status === "revoked") continue;
    if (!isExpired(m, now)) continue;

    if (m.roleId) {
      const res = await setGuildMemberRole(m.id, m.roleId, false);
      // 404 = the role was already gone; treat as success either way.
      if (res.ok || res.status === 404) pulled++;
    }
    await markStatus(m.id, "expired");
  }

  return NextResponse.json({ ok: true, kv: true, scanned: members.length, pulled });
}
