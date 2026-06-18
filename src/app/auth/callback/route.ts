import { NextResponse, type NextRequest } from "next/server";

import {
  exchangeCodeForToken,
  fetchDiscordUser,
  getAvatarUrl,
  getOAuthRedirectUri,
  getRequestOrigin,
  resolveMemberAccess,
} from "@/lib/auth/discord";
import { authErrorResponse } from "@/lib/auth/responses";
import { AUTH_ENABLED, getMissingAuthEnv, getSession, safeReturnTo } from "@/lib/auth/session";
import { registerOnAccess } from "@/lib/trials/store";
import { PRICING_URL } from "@/lib/links";

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
    session.matchedRoleId = access.matchedRoleId;
    session.inGuild = access.inGuild;

    // Giveaway/trial members get registered with the default clock on first
    // authorized visit. Directors are exempt (never tracked, never expire).
    // No-ops without a KV backend, so this never blocks the login redirect.
    if (access.authorized && !access.isAdmin) {
      await registerOnAccess({
        id: discordUser.id,
        username: session.user.username,
        avatar: session.user.avatar,
        tier: access.matchedRole,
        roleId: access.matchedRoleId,
      });
    }

    const returnTo = safeReturnTo(session.returnTo);
    delete session.returnTo;
    await session.save();

    return NextResponse.redirect(
      access.authorized ? new URL(returnTo, getRequestOrigin(request)) : new URL(PRICING_URL),
    );
  } catch (err) {
    const message =
      err instanceof Error && err.message.startsWith("token_exchange_failed_400")
        ? "Discord rejected the sign-in code. Check that the callback URL in the Discord app matches this site URL."
        : "Could not complete Discord sign-in.";
    return authErrorResponse(message, 500);
  }
}
