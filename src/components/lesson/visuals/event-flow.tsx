"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

// Client <-> server event-flow diagram. Teaches the FiveM trust boundary:
// who triggers, which way the event crosses the network wall, and that the
// server is where you validate. Motion is opacity-only (chevrons light in
// sequence toward the receiver) and is disabled under prefers-reduced-motion.

interface EventFlowProps {
  /** Which way the event crosses the wall. */
  direction?: "toServer" | "toClient";
  /** The event name, e.g. "qu_bank:deposit". */
  event: string;
  /** Optional payload label shown in the call, e.g. "amount". */
  payload?: string;
  /** Caption under the diagram. */
  note?: string;
  /** Show the "validate here" shield on the server. Defaults on for toServer. */
  validate?: boolean;
}

const CHEVRONS = 5;

function panelStyle(active: boolean): CSSProperties {
  return {
    flex: "0 0 132px",
    border: `1px solid ${active ? "var(--accent-line)" : "var(--hairline)"}`,
    borderRadius: 10,
    padding: "12px 10px",
    background: active ? "var(--accent-soft)" : "var(--surface-2)",
    textAlign: "center",
  };
}

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  letterSpacing: "0.14em",
  color: "var(--muted)",
};

export function EventFlow({
  direction = "toServer",
  event,
  payload,
  note,
  validate = direction === "toServer",
}: EventFlowProps) {
  const reduce = useReducedMotion();
  const toServer = direction === "toServer";
  const triggerCall = toServer
    ? `TriggerServerEvent('${event}'${payload ? `, ${payload}` : ""})`
    : `TriggerClientEvent('${event}', target${payload ? `, ${payload}` : ""})`;

  const client = (
    <div style={panelStyle(!toServer)}>
      <div style={labelStyle}>CLIENT</div>
      <div style={{ fontSize: 12.5, color: "var(--fg-2)", marginTop: 4 }}>the player&apos;s game</div>
    </div>
  );
  const server = (
    <div style={panelStyle(toServer)}>
      <div style={labelStyle}>SERVER</div>
      <div style={{ fontSize: 12.5, color: "var(--fg-2)", marginTop: 4 }}>
        {validate ? "validate here" : "the host"}
      </div>
      {validate ? (
        <div style={{ marginTop: 6, fontSize: 10.5, fontFamily: "var(--font-mono)", color: "var(--accent-strong)" }}>
          ✓ trust boundary
        </div>
      ) : null}
    </div>
  );

  return (
    <figure
      style={{
        margin: "22px 0",
        border: "1px solid var(--hairline)",
        borderRadius: 12,
        background: "var(--surface)",
        padding: 16,
      }}
    >
      <div
        aria-hidden="true"
        style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-strong)", marginBottom: 12 }}
      >
        {triggerCall}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {toServer ? client : server}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            padding: "0 8px",
            position: "relative",
          }}
        >
          {Array.from({ length: CHEVRONS }).map((_, i) => {
            // sequence index counts from the sender side
            const order = toServer ? i : CHEVRONS - 1 - i;
            return (
              <motion.span
                key={i}
                aria-hidden="true"
                initial={false}
                animate={reduce ? { opacity: 0.45 } : { opacity: [0.18, 1, 0.18] }}
                transition={
                  reduce
                    ? {}
                    : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: order * 0.16, repeatDelay: 0.4 }
                }
                style={{
                  color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 16,
                  lineHeight: 1,
                  transform: toServer ? "none" : "scaleX(-1)",
                }}
              >
                ›
              </motion.span>
            );
          })}
          <div
            style={{
              position: "absolute",
              top: -14,
              left: "50%",
              transform: "translateX(-50%)",
              ...labelStyle,
              fontSize: 9,
            }}
          >
            network
          </div>
        </div>
        {toServer ? server : client}
      </div>
      {note ? (
        <figcaption style={{ marginTop: 12, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>{note}</figcaption>
      ) : null}
    </figure>
  );
}
