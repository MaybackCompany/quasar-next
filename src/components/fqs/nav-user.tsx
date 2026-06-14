"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, Shield } from "lucide-react";

interface MeResponse {
  enabled?: boolean;
  signed_in?: boolean;
  is_admin?: boolean;
  matched_role?: string | null;
  user?: { id: string; username: string; avatar: string | null };
}

export function NavUser() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((d) => {
        if (alive) setMe(d);
      })
      .catch(() => {
        if (alive) setMe({ enabled: false });
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const onDoc = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, []);

  // Gating off, or still loading: render nothing so the nav stays clean.
  if (!me || !me.enabled) return null;

  if (!me.signed_in || !me.user) {
    return (
      <a className="nav-link hide-m" href="/auth/login">
        Sign in
      </a>
    );
  }

  const { username, avatar } = me.user;
  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="dropdown" ref={ref}>
      <button
        className="nav-user-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={`Account menu for ${username}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "3px 6px 3px 3px",
          borderRadius: 999,
          border: "1px solid var(--hairline)",
          background: "var(--surface)",
          cursor: "pointer",
          color: "var(--fg)",
        }}
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            width={26}
            height={26}
            style={{ borderRadius: 999, display: "block" }}
          />
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: 26,
              height: 26,
              borderRadius: 999,
              background: "var(--accent)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
            }}
          >
            {initial}
          </span>
        )}
        <span className="hide-m" style={{ fontSize: 13.5, fontWeight: 600, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {username}
        </span>
      </button>
      {open ? (
        <div className="dropdown-menu" role="menu" style={{ right: 0, left: "auto", minWidth: 180 }}>
          {me.is_admin ? (
            <Link className="dropdown-item" href="/admin" role="menuitem" onClick={() => setOpen(false)}>
              <span className="di-letter" aria-hidden="true">
                <Shield size={14} />
              </span>
              <span>
                <span className="di-title">Director admin</span>
                <div className="di-sub">Grant course access</div>
              </span>
            </Link>
          ) : null}
          <a className="dropdown-item" href="/auth/logout" role="menuitem">
            <span className="di-letter" aria-hidden="true">
              <LogOut size={14} />
            </span>
            <span>
              <span className="di-title">Sign out</span>
              <div className="di-sub">{me.matched_role ? `Tier: ${me.matched_role}` : "End session"}</div>
            </span>
          </a>
        </div>
      ) : null}
    </div>
  );
}
