import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin, SNOWFLAKE_RE } from "@/lib/auth/admin";
import { setGuildMemberRole } from "@/lib/auth/discord";
import { isGrantableRoleId, roleById } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

interface GrantBody {
  userId?: unknown;
  roleId?: unknown;
  action?: unknown;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  let body: GrantBody;
  try {
    body = (await request.json()) as GrantBody;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId.trim() : "";
  const roleId = typeof body.roleId === "string" ? body.roleId.trim() : "";
  const action = body.action === "revoke" ? "revoke" : body.action === "grant" ? "grant" : "";

  if (!SNOWFLAKE_RE.test(userId)) return NextResponse.json({ error: "invalid_user_id" }, { status: 400 });
  if (!action) return NextResponse.json({ error: "invalid_action" }, { status: 400 });
  // Only roles explicitly marked grantable can be touched here - never Director.
  if (!isGrantableRoleId(roleId)) return NextResponse.json({ error: "role_not_grantable" }, { status: 400 });

  const result = await setGuildMemberRole(userId, roleId, action === "grant");
  if (!result.ok) {
    const error =
      result.status === 403
        ? "bot_missing_permission"
        : result.status === 404
          ? "member_not_found"
          : result.status === 0
            ? "bot_not_configured"
            : "discord_error";
    return NextResponse.json({ error, status: result.status }, { status: 502 });
  }

  // Server-side audit trail; the actor is the verified admin, not a client claim.
  console.info(
    `[admin] ${admin.username} (${admin.userId}) ${action} ${roleById(roleId)?.label ?? roleId} -> user ${userId}`,
  );

  return NextResponse.json({
    ok: true,
    action,
    roleId,
    roleLabel: roleById(roleId)?.label ?? roleId,
    userId,
  });
}
