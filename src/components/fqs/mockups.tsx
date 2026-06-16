import type { CSSProperties, ReactNode } from "react";

// In-app visual mockups for lessons: a window-chrome frame, a database-style
// result grid, and color swatches. On-brand (design tokens), no external images.

function dot(color: string): CSSProperties {
  return { width: 11, height: 11, borderRadius: "50%", background: color, display: "inline-block" };
}

interface MockupProps {
  /** App/window label shown in the title bar, e.g. "HeidiSQL" or "txAdmin · Live Console". */
  app?: string;
  children?: ReactNode;
}

/** A window-chrome frame to make a sketch look like a real app panel. */
export function Mockup({ app, children }: MockupProps): ReactNode {
  return (
    <figure
      style={{
        margin: "20px 0",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        overflow: "hidden",
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          borderBottom: "1px solid var(--hairline)",
          background: "var(--surface-2)",
        }}
      >
        <span aria-hidden="true" style={{ display: "flex", gap: 6 }}>
          <i style={dot("#ff5f57")} />
          <i style={dot("#febc2e")} />
          <i style={dot("#28c840")} />
        </span>
        {app ? (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>{app}</span>
        ) : null}
      </div>
      <div style={{ padding: 14, fontSize: 13.5, color: "var(--fg-2)" }}>{children}</div>
    </figure>
  );
}

function cell(isHead: boolean): CSSProperties {
  return {
    border: "1px solid var(--hairline-soft)",
    padding: "6px 10px",
    textAlign: "left",
    whiteSpace: "nowrap",
    background: isHead ? "var(--surface-2)" : "transparent",
    color: isHead ? "var(--fg)" : "var(--fg-2)",
    fontWeight: isHead ? 600 : 400,
  };
}

interface MockTableProps {
  /** Column headers. */
  head: string[];
  /** Rows of cell values. */
  rows: Array<Array<string | number>>;
  caption?: string;
}

/** A database-style result grid, for HeidiSQL / query-result mockups. */
export function MockTable({ head, rows, caption }: MockTableProps): ReactNode {
  return (
    <div style={{ overflowX: "auto", margin: "4px 0" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontFamily: "var(--font-mono)", fontSize: 12.5 }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} style={cell(true)}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} style={cell(false)}>
                  {String(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {caption ? <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>{caption}</div> : null}
    </div>
  );
}

interface SwatchProps {
  /** Color chips with hex + optional label, for UI reskin before/after. */
  colors: Array<{ hex: string; label?: string }>;
}

/** Color swatches for reskin lessons. */
export function Swatch({ colors }: SwatchProps): ReactNode {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "14px 0" }}>
      {colors.map((c) => (
        <span
          key={c.hex + (c.label ?? "")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "1px solid var(--hairline)",
            borderRadius: 8,
            padding: "6px 10px",
          }}
        >
          <span
            aria-hidden="true"
            style={{ width: 18, height: 18, borderRadius: 5, background: c.hex, border: "1px solid var(--hairline-soft)" }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-2)" }}>
            {c.label ? c.label + " " : ""}
            {c.hex}
          </span>
        </span>
      ))}
    </div>
  );
}
