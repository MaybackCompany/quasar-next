import { NextResponse, type NextRequest } from "next/server";

import { AUTH_ENABLED, getSession } from "@/lib/auth/session";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (AUTH_ENABLED) {
    const session = await getSession();
    session.destroy();
  }

  return NextResponse.redirect(new URL("/", request.url));
}
