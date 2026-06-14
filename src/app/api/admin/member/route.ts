import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin, SNOWFLAKE_RE } from "@/lib/auth/admin";
import { fetchMemberRolesByBot } from "@/lib/auth/discord";
import { getGrantableRoles, summarizeRoles } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

/** Look up a member's current access state so the Director sees what they hold. */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const userId = (request.nextUrl.searchParams.get("userId") || "").trim();
  if (!SNOWFLAKE_RE.test(userId)) {
    return NextResponse.json({ error: "invalid_user_id" }, { status: 400 });
  }

  const roles = await fetchMemberRolesByBot(userId);
  if (roles === null) {
    return NextResponse.json({ error: "member_not_found" }, { status: 404 });
  }

  const { authorized, isAdmin, tier } = summarizeRoles(roles);
  const held = getGrantableRoles()
    .filter((r) => roles.includes(r.id))
    .map((r) => ({ id: r.id, label: r.label }));

  return NextResponse.json({ ok: true, userId, authorized, isAdmin, tier, held });
}
