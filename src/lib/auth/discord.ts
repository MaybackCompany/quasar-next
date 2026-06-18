import type { NextRequest } from "next/server";

import { summarizeRoles } from "@/lib/auth/roles";
import { getRequestOrigin } from "@/lib/origin";

export { getRequestOrigin };

interface DiscordTokenResponse {
  access_token: string;
}

interface DiscordUserResponse {
  id: string;
  username: string;
  global_name?: string | null;
  avatar?: string | null;
}

interface DiscordMemberResponse {
  roles?: string[];
}

export function getOAuthRedirectUri(request: NextRequest): string {
  return `${getRequestOrigin(request)}/auth/callback`;
}

export function getAuthorizeUrl(redirectUri: string, state: string): string {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) throw new Error("missing_discord_client_id");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds.members.read",
    state,
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<DiscordTokenResponse> {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("missing_discord_oauth_env");

  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(`token_exchange_failed_${response.status}`);
  }

  return (await response.json()) as DiscordTokenResponse;
}

export async function fetchDiscordUser(accessToken: string): Promise<DiscordUserResponse> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`user_fetch_failed_${response.status}`);
  }

  return (await response.json()) as DiscordUserResponse;
}

async function fetchRolesWithOAuth(accessToken: string, guildId: string): Promise<string[] | null> {
  const response = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch(() => null);

  if (!response?.ok) return null;

  const member = (await response.json()) as DiscordMemberResponse;
  return Array.isArray(member.roles) ? member.roles : [];
}

async function fetchRolesWithBot(userId: string, guildId: string): Promise<string[] | null> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return null;

  const response = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userId}`, {
    headers: { Authorization: `Bot ${botToken}` },
  }).catch(() => null);

  if (!response?.ok) return null;

  const member = (await response.json()) as DiscordMemberResponse;
  return Array.isArray(member.roles) ? member.roles : [];
}

export async function resolveMemberAccess(accessToken: string, userId: string) {
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) throw new Error("missing_discord_guild_id");

  const oauthRoles = await fetchRolesWithOAuth(accessToken, guildId);
  const botRoles = oauthRoles ?? (await fetchRolesWithBot(userId, guildId));
  const roles = botRoles ?? [];
  const inGuild = oauthRoles !== null || botRoles !== null;

  const { authorized, isAdmin, tier, matchedRoleId } = summarizeRoles(roles);
  return { authorized, isAdmin, matchedRole: tier, matchedRoleId, inGuild };
}

export function getAvatarUrl(user: DiscordUserResponse): string | null {
  if (!user.avatar) return null;
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
}

const DISCORD_API = "https://discord.com/api";

/** Fetch a member's current role IDs using the bot token (admin lookups). */
export async function fetchMemberRolesByBot(userId: string): Promise<string[] | null> {
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) return null;
  return fetchRolesWithBot(userId, guildId);
}

/** Add or remove a single role on a guild member via the bot. Requires the bot
 * to have Manage Roles and to sit above the target role in the hierarchy. */
export async function setGuildMemberRole(
  userId: string,
  roleId: string,
  add: boolean,
): Promise<{ ok: boolean; status: number }> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!botToken || !guildId) return { ok: false, status: 0 };

  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
    method: add ? "PUT" : "DELETE",
    headers: { Authorization: `Bot ${botToken}`, "Content-Type": "application/json" },
  }).catch(() => null);

  if (!res) return { ok: false, status: 0 };
  return { ok: res.ok, status: res.status };
}
