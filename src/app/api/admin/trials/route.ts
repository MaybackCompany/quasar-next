import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/auth/admin";
import { daysLeft, isExpired, listMembers, TRIAL_KV_ENABLED, type TrialMember } from "@/lib/trials/store";

export const dynamic = "force-dynamic";

/** Director-only: every tracked trial member, soonest-to-expire first. */
export async function GET(): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }
  if (!TRIAL_KV_ENABLED) {
    return NextResponse.json({ ok: true, kvEnabled: false, members: [] });
  }

  const members = await listMembers();
  const now = Date.now();

  const terminalRank = (m: TrialMember) => (m.status === "expired" || m.status === "revoked" ? 1 : 0);

  const rows = members
    .map((m) => ({
      id: m.id,
      username: m.username,
      avatar: m.avatar,
      tier: m.tier,
      status: m.status,
      source: m.source,
      firstSeenAt: m.firstSeenAt,
      expiresAt: m.expiresAt,
      daysLeft: daysLeft(m, now),
      expired: isExpired(m, now),
    }))
    .sort((a, b) => {
      const ra = terminalRank(a as unknown as TrialMember);
      const rb = terminalRank(b as unknown as TrialMember);
      if (ra !== rb) return ra - rb;
      return (a.expiresAt ?? Number.POSITIVE_INFINITY) - (b.expiresAt ?? Number.POSITIVE_INFINITY);
    });

  return NextResponse.json({ ok: true, kvEnabled: true, members: rows });
}
