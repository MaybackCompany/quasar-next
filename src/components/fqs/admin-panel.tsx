"use client";

import { useState } from "react";

interface GrantableRole {
  id: string;
  label: string;
  tier: string;
}

interface AdminPanelProps {
  roles: GrantableRole[];
}

interface MemberState {
  authorized: boolean;
  isAdmin: boolean;
  tier: string | null;
  held: { id: string; label: string }[];
}

const ERROR_TEXT: Record<string, string> = {
  invalid_user_id: "Enter a valid Discord user ID (17 to 20 digits).",
  invalid_action: "Pick grant or revoke.",
  role_not_grantable: "That role cannot be granted here.",
  member_not_found: "No member with that ID is in the server.",
  bot_missing_permission:
    "The bot cannot manage that role. Give it Manage Roles and move its role above the membership roles.",
  bot_not_configured: "The bot token is not set yet. Add DISCORD_BOT_TOKEN on Vercel, then redeploy.",
  discord_unavailable: "Could not reach Discord. Try again in a moment.",
  discord_error: "Discord rejected the change. Check the bot's permissions and role hierarchy.",
  not_admin: "You do not have admin access.",
  not_signed_in: "Sign in again to continue.",
  bad_json: "Something went wrong sending that request.",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 9,
  border: "1px solid var(--hairline)",
  background: "var(--surface)",
  color: "var(--fg)",
  fontFamily: "var(--font-mono)",
  fontSize: 14,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 600,
  color: "var(--fg)",
  marginBottom: 6,
};

export function AdminPanel({ roles }: AdminPanelProps) {
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState(roles[0]?.id ?? "");
  const [member, setMember] = useState<MemberState | null>(null);
  const [busy, setBusy] = useState<null | "lookup" | "grant" | "revoke">(null);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const trimmed = userId.trim();
  const validId = /^\d{17,20}$/.test(trimmed);

  async function lookup() {
    if (!validId) {
      setMessage({ kind: "err", text: ERROR_TEXT.invalid_user_id });
      return;
    }
    setBusy("lookup");
    setMessage(null);
    setMember(null);
    try {
      const res = await fetch(`/api/admin/member?userId=${encodeURIComponent(trimmed)}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ kind: "err", text: ERROR_TEXT[data.error] ?? "Lookup failed." });
        return;
      }
      setMember({ authorized: data.authorized, isAdmin: data.isAdmin, tier: data.tier, held: data.held ?? [] });
    } catch {
      setMessage({ kind: "err", text: "Network error during lookup." });
    } finally {
      setBusy(null);
    }
  }

  async function mutate(action: "grant" | "revoke") {
    if (!validId) {
      setMessage({ kind: "err", text: ERROR_TEXT.invalid_user_id });
      return;
    }
    setBusy(action);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: trimmed, roleId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ kind: "err", text: ERROR_TEXT[data.error] ?? "The change failed." });
        return;
      }
      setMessage({
        kind: "ok",
        text:
          action === "grant"
            ? `Granted ${data.roleLabel} to ${trimmed}. They now have course access.`
            : `Revoked ${data.roleLabel} from ${trimmed}.`,
      });
      await lookup();
    } catch {
      setMessage({ kind: "err", text: "Network error during the change." });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="track-card" style={{ marginTop: 28, maxWidth: 560 }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="admin-user-id" style={labelStyle}>
          Discord user ID
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            id="admin-user-id"
            style={inputStyle}
            inputMode="numeric"
            placeholder="e.g. 1515556790119436339"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button
            className="btn btn-ghost"
            onClick={lookup}
            disabled={busy !== null || !validId}
            style={{ whiteSpace: "nowrap" }}
          >
            {busy === "lookup" ? "..." : "Look up"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0 0" }}>
          Enable Developer Mode in Discord, then right-click a user and Copy User ID.
        </p>
      </div>

      {member ? (
        <div
          style={{
            margin: "0 0 16px",
            padding: "12px 14px",
            border: "1px solid var(--hairline)",
            borderRadius: 9,
            background: "var(--surface-2)",
            fontSize: 13.5,
            color: "var(--fg-2)",
          }}
        >
          <div>
            Access: <strong style={{ color: member.authorized ? "var(--accent-strong)" : "var(--fg)" }}>{member.authorized ? "yes" : "no"}</strong>
            {member.tier ? ` · tier: ${member.tier}` : ""}
            {member.isAdmin ? " · director" : ""}
          </div>
          <div style={{ marginTop: 4 }}>
            Membership roles held: {member.held.length ? member.held.map((h) => h.label).join(", ") : "none"}
          </div>
        </div>
      ) : null}

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="admin-role" style={labelStyle}>
          Membership role
        </label>
        <select id="admin-role" style={inputStyle} value={roleId} onChange={(e) => setRoleId(e.target.value)}>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary" onClick={() => mutate("grant")} disabled={busy !== null || !validId}>
          {busy === "grant" ? "Granting..." : "Grant access"}
        </button>
        <button className="btn btn-ghost" onClick={() => mutate("revoke")} disabled={busy !== null || !validId}>
          {busy === "revoke" ? "Revoking..." : "Revoke"}
        </button>
      </div>

      {message ? (
        <p
          role="status"
          style={{
            marginTop: 16,
            fontSize: 13.5,
            color: message.kind === "ok" ? "var(--accent-strong)" : "var(--err, #ef4444)",
          }}
        >
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
