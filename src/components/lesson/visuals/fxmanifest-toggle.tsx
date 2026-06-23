"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

// Interactive fxmanifest: toggle client_script / server_script / shared_script
// lines and watch which side each file loads on. Teaches the manifest -> side
// mapping (shared loads on BOTH) that trips up every beginner.

type Side = "client" | "server" | "both";
interface ManifestLine {
  key: string;
  file: string;
  side: Side;
}

const LINES: ManifestLine[] = [
  { key: "client_script", file: "client.lua", side: "client" },
  { key: "shared_script", file: "config.lua", side: "both" },
  { key: "server_script", file: "server.lua", side: "server" },
];

const mono: CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 12.5 };

function Panel({ title, files }: { title: string; files: string[] }) {
  return (
    <div style={{ flex: 1, border: "1px solid var(--hairline)", borderRadius: 10, background: "var(--surface-2)", padding: 12, minWidth: 130 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.14em", color: "var(--muted)", marginBottom: 8 }}>
        {title}
      </div>
      {files.length === 0 ? (
        <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>nothing loads here</div>
      ) : (
        files.map((f) => (
          <div key={f} style={{ ...mono, color: "var(--fg-2)", padding: "2px 0", transition: "opacity 160ms ease" }}>
            {f}
          </div>
        ))
      )}
    </div>
  );
}

export function FxmanifestToggle() {
  const [on, setOn] = useState<Record<string, boolean>>({
    client_script: true,
    shared_script: true,
    server_script: true,
  });

  const active = LINES.filter((l) => on[l.key]);
  const clientFiles = active.filter((l) => l.side === "client" || l.side === "both").map((l) => l.file);
  const serverFiles = active.filter((l) => l.side === "server" || l.side === "both").map((l) => l.file);

  return (
    <figure style={{ margin: "22px 0", border: "1px solid var(--hairline)", borderRadius: 12, background: "var(--surface)", padding: 16 }}>
      <div style={{ ...mono, color: "var(--fg-2)", background: "var(--surface-2)", border: "1px solid var(--hairline)", borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
        <div style={{ color: "var(--muted)" }}>fx_version &apos;cerulean&apos;</div>
        <div style={{ color: "var(--muted)" }}>game &apos;gta5&apos;</div>
        {LINES.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => setOn((s) => ({ ...s, [l.key]: !s[l.key] }))}
            aria-pressed={on[l.key]}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              ...mono,
              cursor: "pointer",
              border: "none",
              background: "transparent",
              padding: "3px 0",
              color: on[l.key] ? "var(--accent-strong)" : "var(--muted)",
              opacity: on[l.key] ? 1 : 0.5,
              textDecoration: on[l.key] ? "none" : "line-through",
            }}
          >
            {l.key} &apos;{l.file}&apos;
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <Panel title="CLIENT" files={clientFiles} />
        <Panel title="SERVER" files={serverFiles} />
      </div>
      <figcaption style={{ marginTop: 12, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
        Click a manifest line to toggle it. Notice <code style={mono}>config.lua</code> is a <code style={mono}>shared_script</code>, so it loads on both sides; client and server files never cross.
      </figcaption>
    </figure>
  );
}
