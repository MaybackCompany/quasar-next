import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface LinkCardProps {
  href: string;
  title: string;
  desc?: string;
  eyebrow?: string;
}

/** A card linking to a guide/lesson — FiveM School design. */
export function LinkCard({ href, title, desc, eyebrow }: LinkCardProps) {
  return (
    <Link className="track-card" style={{ padding: 22 }} href={href}>
      {eyebrow ? (
        <div className="eyebrow" style={{ marginBottom: 6 }}>
          {eyebrow}
        </div>
      ) : null}
      <h3 className="fqs-h" style={{ fontSize: 17, margin: 0 }}>
        {title}
      </h3>
      {desc ? <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "6px 0 0", flex: 1 }}>{desc}</p> : null}
      <div className="tc-foot" style={{ marginTop: 16, paddingTop: 12 }}>
        <span className="tc-count">Reference</span>
        <span className="tc-go">
          Open <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

/** Responsive grid wrapper for LinkCard. */
export function LinkCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
        margin: "24px 0",
      }}
    >
      {children}
    </div>
  );
}
