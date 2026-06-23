"use client";

import { motion, useReducedMotion } from "motion/react";
import { Lottie } from "./lottie";

// State replication over time: the server sets a value, and OneSync / state
// bags propagate it to each client in turn. Timing is the lesson here, so the
// clients light up in sequence. Defaults to a coded (Framer) sequence; pass a
// `src` to render a designed .lottie instead. Reduced-motion shows the synced
// end-state with no animation.

interface StateSyncProps {
  /** Number of client nodes. */
  clients?: number;
  /** The state being replicated, e.g. "weather = rain". */
  state?: string;
  /** Optional path to a designed .lottie asset (in /public) to use instead. */
  src?: string;
  note?: string;
}

const nodeBox = (accent: boolean): React.CSSProperties => ({
  border: `1px solid ${accent ? "var(--accent-line)" : "var(--hairline)"}`,
  borderRadius: 9,
  background: accent ? "var(--accent-soft)" : "var(--surface-2)",
  padding: "8px 10px",
  textAlign: "center",
  minWidth: 78,
});

const label: React.CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--muted)" };

export function StateSync({ clients = 3, state = "weather = rain", src, note }: StateSyncProps) {
  const reduce = useReducedMotion();
  const ids = Array.from({ length: clients });

  return (
    <figure style={{ margin: "22px 0", border: "1px solid var(--hairline)", borderRadius: 12, background: "var(--surface)", padding: 16 }}>
      {src ? (
        <Lottie src={src} />
      ) : (
        <div>
          {/* server */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <motion.div
              initial={false}
              animate={reduce ? { opacity: 1 } : { opacity: [1, 1, 1], scale: [1, 1.04, 1] }}
              transition={reduce ? {} : { duration: 2.4, repeat: Infinity, ease: "easeInOut", times: [0, 0.1, 0.25] }}
              style={nodeBox(true)}
            >
              <div style={label}>SERVER</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-strong)", marginTop: 3 }}>{state}</div>
            </motion.div>
          </div>
          <div aria-hidden="true" style={{ textAlign: "center", color: "var(--hairline)", fontSize: 14, lineHeight: 1 }}>│</div>
          {/* clients */}
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 8, flexWrap: "wrap" }}>
            {ids.map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={reduce ? { opacity: 1 } : { opacity: [0.5, 1, 1, 0.5], scale: [1, 1.05, 1, 1] }}
                transition={
                  reduce ? {} : { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 + i * 0.22, times: [0, 0.12, 0.7, 1] }
                }
                style={nodeBox(false)}
              >
                <div style={label}>CLIENT {i + 1}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-2)", marginTop: 3 }}>{state}</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <figcaption style={{ marginTop: 12, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
        {note ?? "The server owns the value; OneSync replicates it to each client in turn. Clients never set it directly."}
      </figcaption>
    </figure>
  );
}
