"use client";

import { useState, useMemo } from "react";
import type { CSSProperties } from "react";

// Interactive query runner: edit a WHERE clause and watch a mock result grid
// filter live (client-side, no DB). Connects the SQL string to the rows it
// returns before the learner touches real player data. Safe: a tiny hand
// parser for "col <op> value", never eval.

type Row = Record<string, string | number>;
interface QueryRunnerProps {
  table: string;
  columns: string[];
  rows: Row[];
  /** Initial WHERE clause, e.g. "balance > 1000". */
  initialWhere?: string;
}

const mono: CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 12.5 };
const OPS = ["!=", ">=", "<=", "=", ">", "<"] as const;

function evalWhere(rows: Row[], columns: string[], where: string): { rows: Row[]; error: string | null } {
  const clause = where.trim();
  if (!clause) return { rows, error: null };
  const op = OPS.find((o) => clause.includes(o));
  if (!op) return { rows, error: "Use a comparison: col = value, col > n, col != value." };
  const [rawCol, rawVal] = clause.split(op).map((s) => s.trim());
  const col = rawCol;
  if (!columns.includes(col)) return { rows, error: `Unknown column "${col}". Columns: ${columns.join(", ")}.` };
  const val = rawVal.replace(/^['"]|['"]$/g, "");
  const num = Number(val);
  const valIsNum = val !== "" && !Number.isNaN(num);
  const filtered = rows.filter((r) => {
    const cell = r[col];
    const cellNum = typeof cell === "number" ? cell : Number(cell);
    const numeric = valIsNum && !Number.isNaN(cellNum);
    if (numeric) {
      if (op === "=") return cellNum === num;
      if (op === "!=") return cellNum !== num;
      if (op === ">") return cellNum > num;
      if (op === "<") return cellNum < num;
      if (op === ">=") return cellNum >= num;
      if (op === "<=") return cellNum <= num;
    }
    const cs = String(cell);
    if (op === "=") return cs === val;
    if (op === "!=") return cs !== val;
    return false;
  });
  return { rows: filtered, error: null };
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
    ...mono,
  };
}

export function QueryRunner({ table, columns, rows, initialWhere = "" }: QueryRunnerProps) {
  const [where, setWhere] = useState(initialWhere);
  const { rows: out, error } = useMemo(() => evalWhere(rows, columns, where), [rows, columns, where]);

  return (
    <figure style={{ margin: "22px 0", border: "1px solid var(--hairline)", borderRadius: 12, background: "var(--surface)", padding: 16 }}>
      <label style={{ display: "block", ...mono, color: "var(--fg-2)", lineHeight: 1.8 }}>
        <span style={{ color: "var(--muted)" }}>SELECT * FROM {table}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
          <span style={{ color: "var(--accent-strong)" }}>WHERE</span>
          <input
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder="balance > 1000"
            spellCheck={false}
            aria-label="SQL WHERE clause"
            style={{ ...mono, flex: 1, minWidth: 160, padding: "6px 10px", border: "1px solid var(--hairline)", borderRadius: 7, background: "var(--surface-2)", color: "var(--fg)" }}
          />
        </span>
      </label>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>{columns.map((h) => <th key={h} style={cell(true)}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {out.map((r, i) => (
              <tr key={i}>{columns.map((c) => <td key={c} style={cell(false)}>{String(r[c])}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption style={{ marginTop: 10, fontSize: 12.5, color: error ? "var(--danger, #d9534f)" : "var(--muted)" }}>
        {error ?? `${out.length} of ${rows.length} row${rows.length === 1 ? "" : "s"} match.`}
      </figcaption>
    </figure>
  );
}
