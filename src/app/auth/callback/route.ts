import { NextResponse, type NextRequest } from "next/server";

import {
  exchangeCodeForToken,
  fetchDiscordUser,
  getAvatarUrl,
  getOAuthRedirectUri,
  resolveMemberAccess,
} from "@/lib/auth/discord";
import { authErrorResponse } from "@/lib/auth/responses";
import { AUTH_ENABLED, getMissingAuthEnv, getSession, safeReturnTo } from "@/lib/auth/session";

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!AUTH_ENABLED) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const missing = getMissingAuthEnv();
  if (missing.length > 0) {
    return authErrorResponse(`Discord sign-in is not configured. Missing: ${missing.join(", ")}.`, 500);
  }

  const error = request.nextUrl.searchParams.get("error");
  if (error) {
    return authErrorResponse(error.slice(0, 200));
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const session = await getSession();

  if (!code || !state || state !== session.oauthState) {
    return authErrorResponse("Invalid OAuth state.");
  }

  const redirectUri = session.oauthRedirectUri || getOAuthRedirectUri(request);
  delete session.oauthState;
  delete session.oauthRedirectUri;

  try {
    const tokens = await exchangeCodeForToken(code, redirectUri);
    const discordUser = await fetchDiscordUser(tokens.access_token);
    const access = await resolveMemberAccess(tokens.access_token, discordUser.id);

    session.user = {
      id: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      avatar: getAvatarUrl(discordUser),
    };
    session.authorized = access.authorized;
    session.isAdmin = access.isAdmin;
    session.matchedRole = access.matchedRole;
    session.inGuild = access.inGuild;

    const returnTo = safeReturnTo(session.returnTo);
    delete session.returnTo;
    await session.save();

    return NextResponse.redirect(new URL(access.authorized ? returnTo : "/pricing", request.url));
  } catch (err) {
    const message =
      err instanceof Error && err.message.startsWith("token_exchange_failed_400")
        ? "Discord rejected the sign-in code. Check that the callback URL in the Discord app matches this site URL."
        : "Could not complete Discord sign-in.";
    return authErrorResponse(message, 500);
  }
}
