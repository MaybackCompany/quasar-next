"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

// A txAdmin / FXServer console you step through: starting -> error -> fix ->
// running. Teaches the read-the-log reflex by letting the learner advance the
// console one state at a time and see what each line means.

type LineKind = "out" | "err" | "ok" | "cmd";
interface ConsoleLine {
  text: string;
  kind?: LineKind;
}
interface ConsoleStep {
  label: string;
  lines: ConsoleLine[];
}
interface ConsoleStepsProps {
  app?: string;
  steps: ConsoleStep[];
}

const KIND_COLOR: Record<LineKind, string> = {
  out: "var(--fg-2)",
  err: "var(--danger, #d9534f)",
  ok: "var(--accent-strong)",
  cmd: "var(--muted)",
};

const dot = (color: string): CSSProperties => ({ width: 11, height: 11, borderRadius: "50%", background: color, display: "inline-block" });

export function ConsoleSteps({ app = "txAdmin · Live Console", steps }: ConsoleStepsProps) {
  const [i, setI] = useState(0);
  const step = steps[Math.min(i, steps.length - 1)];

  return (
    <figure style={{ margin: "22px 0", border: "1px solid var(--hairline)", borderRadius: 10, overflow: "hidden", background: "var(--surface)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
        <span aria-hidden="true" style={{ display: "flex", gap: 6 }}>
          <i style={dot("#ff5f57")} />
          <i style={dot("#febc2e")} />
          <i style={dot("#28c840")} />
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>{app}</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-strong)" }}>{step.label}</span>
      </div>
      <div style={{ padding: 14, fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, minHeight: 96, background: "var(--surface)" }}>
        {step.lines.map((l, k) => (
          <div key={k} style={{ color: KIND_COLOR[l.kind ?? "out"], whiteSpace: "pre-wrap" }}>
            {l.kind === "cmd" ? "> " : ""}
            {l.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderTop: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
        <button type="button" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} className="btn btn-ghost" style={{ fontSize: 12, padding: "4px 12px", opacity: i === 0 ? 0.4 : 1 }}>
          Back
        </button>
        <button type="button" onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))} disabled={i >= steps.length - 1} className="btn btn-primary" style={{ fontSize: 12, padding: "4px 12px", opacity: i >= steps.length - 1 ? 0.4 : 1 }}>
          Next step
        </button>
        <span style={{ marginLeft: "auto", display: "flex", gap: 5 }} aria-hidden="true">
          {steps.map((_, k) => (
            <i key={k} style={{ width: 7, height: 7, borderRadius: "50%", background: k === i ? "var(--accent)" : "var(--hairline)" }} />
          ))}
        </span>
      </div>
    </figure>
  );
}
