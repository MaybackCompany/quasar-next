import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

import { getAuthorizeUrl, getOAuthRedirectUri } from "@/lib/auth/discord";
import { authErrorResponse } from "@/lib/auth/responses";
import { AUTH_ENABLED, getMissingAuthEnv, getSession, safeReturnTo } from "@/lib/auth/session";
import { getRequestOrigin } from "@/lib/origin";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!AUTH_ENABLED) {
    return NextResponse.redirect(new URL("/", getRequestOrigin(request)));
  }

  const missing = getMissingAuthEnv();
  if (missing.length > 0) {
    return authErrorResponse(`Discord sign-in is not configured. Missing: ${missing.join(", ")}.`, 500);
  }

  const session = await getSession();
  const state = randomBytes(24).toString("base64url");
  const redirectUri = getOAuthRedirectUri(request);
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get("returnTo"));

  session.oauthState = state;
  session.oauthRedirectUri = redirectUri;
  session.returnTo = returnTo;
  await session.save();

  return NextResponse.redirect(getAuthorizeUrl(redirectUri, state));
}
