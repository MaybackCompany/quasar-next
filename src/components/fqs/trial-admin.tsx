"use client";

import { useCallback, useEffect, useState } from "react";

interface TrialRow {
  id: string;
  username: string;
  avatar: string | null;
  tier: string | null;
  status: "active" | "expired" | "revoked";
  source: "auto" | "manual";
  firstSeenAt: number;
  expiresAt: number | null;
  daysLeft: number | null;
  expired: boolean;
}

const PRESETS = [7, 14, 30] as const;

function statusColor(row: TrialRow): string {
  if (row.status === "revoked") return "var(--err, #ef4444)";
  if (row.expired) return "var(--muted)";
  if (row.daysLeft !== null && row.daysLeft <= 2) return "#f59e0b";
  return "var(--accent-strong)";
}

function statusLabel(row: TrialRow): string {
  if (row.status === "revoked") return "revoked";
  if (row.expired) return "expired";
  if (row.daysLeft === null) return "permanent";
  return `${row.daysLeft}d left`;
}

export function TrialAdmin() {
  const [rows, setRows] = useState<TrialRow[]>([]);
  const [kvEnabled, setKvEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [custom, setCustom] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/trials", { headers: { Accept: "application/json" } });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not load members.");
        return;
      }
      setKvEnabled(Boolean(data.kvEnabled));
      setRows(Array.isArray(data.members) ? data.members : []);
    } catch {
      setError("Network error loading members.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(userId: string, action: string, extra?: Record<string, unknown>) {
    setBusyId(userId);
    setError(null);
    try {
      const res = await fetch("/api/admin/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "The change failed.");
        return;
      }
      await load();
    } catch {
      setError("Network error during the change.");
    } finally {
      setBusyId(null);
    }
  }

  const labelStyle: React.CSSProperties = { fontSize: 12.5, color: "var(--muted)" };

  return (
    <div className="track-card" style={{ marginTop: 24, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 className="fqs-h" style={{ fontSize: 20, margin: 0 }}>
          Trial members
        </h2>
        <button className="btn btn-ghost" onClick={() => void load()} disabled={loading}>
          {loading ? "..." : "Refresh"}
        </button>
      </div>

      {!kvEnabled ? (
        <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>
          The trial store is not configured yet. Add a Vercel KV (Upstash) integration and set{" "}
          <code>KV_REST_API_URL</code> and <code>KV_REST_API_TOKEN</code> on Vercel, then redeploy. Members appear
          here automatically the first time they open the guide.
        </p>
      ) : rows.length === 0 && !loading ? (
        <p style={{ fontSize: 13.5, color: "var(--muted)" }}>
          No trial members yet. Anyone with an access role is added here the first time they open the guide, with a
          7-day clock you can change below.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {rows.map((row) => (
            <div
              key={row.id}
              style={{
                border: "1px solid var(--hairline)",
                borderRadius: 10,
                padding: "12px 14px",
                background: "var(--surface-2)",
                opacity: row.status === "revoked" || row.expired ? 0.72 : 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                {row.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={row.avatar} alt="" width={28} height={28} style={{ borderRadius: "50%" }} />
                ) : (
                  <span
                    aria-hidden="true"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "var(--hairline)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      color: "var(--muted)",
                    }}
                  >
                    {row.username.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <span style={{ fontWeight: 600, color: "var(--fg)" }}>{row.username}</span>
                {row.tier ? <span style={labelStyle}>· {row.tier}</span> : null}
                <span style={{ ...labelStyle, fontFamily: "var(--font-mono)" }}>{row.id}</span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: statusColor(row),
                  }}
                >
                  {statusLabel(row)}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                {PRESETS.map((d) => (
                  <button
                    key={d}
                    className="btn btn-ghost"
                    style={{ padding: "5px 10px", fontSize: 13 }}
                    disabled={busyId === row.id}
                    onClick={() => void act(row.id, "setDays", { days: d })}
                  >
                    {d}d
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  placeholder="days"
                  value={custom[row.id] ?? ""}
                  onChange={(e) => setCustom((c) => ({ ...c, [row.id]: e.target.value }))}
                  style={{
                    width: 70,
                    padding: "5px 8px",
                    borderRadius: 8,
                    border: "1px solid var(--hairline)",
                    background: "var(--surface)",
                    color: "var(--fg)",
                    fontSize: 13,
                  }}
                />
                <button
                  className="btn btn-ghost"
                  style={{ padding: "5px 10px", fontSize: 13 }}
                  disabled={busyId === row.id || !custom[row.id]}
                  onClick={() => void act(row.id, "setDays", { days: Number(custom[row.id]) })}
                >
                  Set
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ padding: "5px 10px", fontSize: 13 }}
                  disabled={busyId === row.id}
                  onClick={() => void act(row.id, "clear")}
                >
                  Permanent
                </button>
                <button
                  className="btn btn-ghost"
                  style={{ padding: "5px 10px", fontSize: 13, color: "var(--err, #ef4444)", marginLeft: "auto" }}
                  disabled={busyId === row.id}
                  onClick={() => {
                    if (confirm(`Revoke access for ${row.username} now? This pulls their Discord role.`)) {
                      void act(row.id, "revoke");
                    }
                  }}
                >
                  {busyId === row.id ? "..." : "Revoke"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error ? (
        <p role="status" style={{ marginTop: 14, fontSize: 13.5, color: "var(--err, #ef4444)" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
