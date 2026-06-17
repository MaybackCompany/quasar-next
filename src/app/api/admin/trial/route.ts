import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin, SNOWFLAKE_RE } from "@/lib/auth/admin";
import { setGuildMemberRole } from "@/lib/auth/discord";
import { DAY_MS, getMember, markStatus, setMemberWindow } from "@/lib/trials/store";

export const dynamic = "force-dynamic";

interface TrialBody {
  userId?: unknown;
  action?: unknown;
  days?: unknown;
  dateIso?: unknown;
}

const MAX_DAYS = 3650; // 10 years; just a sanity ceiling

/** Director-only: set / extend / clear a member's window, or revoke now. */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  let body: TrialBody;
  try {
    body = (await request.json()) as TrialBody;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  const action = typeof body.action === "string" ? body.action : "";
  if (!SNOWFLAKE_RE.test(userId)) {
    return NextResponse.json({ error: "invalid_user_id" }, { status: 400 });
  }

  const member = await getMember(userId);
  if (!member) {
    return NextResponse.json({ error: "member_not_tracked" }, { status: 404 });
  }

  if (action === "setDays") {
    const days = Number(body.days);
    if (!Number.isFinite(days) || days <= 0 || days > MAX_DAYS) {
      return NextResponse.json({ error: "invalid_days" }, { status: 400 });
    }
    const next = await setMemberWindow(userId, Date.now() + Math.floor(days) * DAY_MS);
    console.info(`[admin] ${admin.username} set ${Math.floor(days)}d window -> ${userId}`);
    return NextResponse.json({ ok: true, member: next });
  }

  if (action === "setDate") {
    const t = Date.parse(String(body.dateIso));
    if (!Number.isFinite(t)) {
      return NextResponse.json({ error: "invalid_date" }, { status: 400 });
    }
    const next = await setMemberWindow(userId, t);
    console.info(`[admin] ${admin.username} set window date -> ${userId}`);
    return NextResponse.json({ ok: true, member: next });
  }

  if (action === "clear") {
    const next = await setMemberWindow(userId, null);
    console.info(`[admin] ${admin.username} cleared window (permanent) -> ${userId}`);
    return NextResponse.json({ ok: true, member: next });
  }

  if (action === "revoke") {
    if (member.roleId) await setGuildMemberRole(userId, member.roleId, false);
    const next = await markStatus(userId, "revoked");
    console.info(`[admin] ${admin.username} revoked access -> ${userId}`);
    return NextResponse.json({ ok: true, member: next });
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 });
}
