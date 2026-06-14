import { NextResponse } from "next/server";

import { AUTH_ENABLED, getSession } from "@/lib/auth/session";

export async function GET(): Promise<NextResponse> {
  if (!AUTH_ENABLED) {
    return NextResponse.json(
      { enabled: false },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const session = await getSession();
  const user = session.user;

  if (!user) {
    return NextResponse.json(
      { enabled: true, signed_in: false },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  }

  return NextResponse.json(
    {
      enabled: true,
      signed_in: true,
      user,
      authorized: Boolean(session.authorized),
      is_admin: Boolean(session.isAdmin),
      matched_role: session.matchedRole || null,
      in_guild: Boolean(session.inGuild),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
