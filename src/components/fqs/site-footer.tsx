import Link from "next/link";

import { DISCORD_INVITE, COACH_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--hairline)", marginTop: 72, paddingTop: 28, paddingBottom: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "baseline",
        }}
      >
        <span className="eyebrow">
          FIVEM SCHOOL <span className="sep">·</span> MEMBERS ONLY <span className="sep">·</span> VERIFIED JUNE 2026
        </span>
        <span style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 13.5, color: "var(--muted)" }}>
          <Link href="/cheatsheets">Cheatsheets</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/tutorials">Tutorials</Link>
          <Link href="/mapping">Mapping</Link>
          <Link href="/reviews">Reviews</Link>
          <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">Discord</a>
          <a href={COACH_URL} target="_blank" rel="noopener noreferrer">Membership</a>
        </span>
      </div>
      <p style={{ marginTop: 14, fontSize: 12.5, color: "var(--muted)", maxWidth: "70ch", lineHeight: 1.6 }}>
        Included with Builder, Elite, and Enterprise memberships on{" "}
        <a href={COACH_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-strong)", fontWeight: 600 }}>
          fivemcoach.com
        </a>{" "}
        by Quasar Store.
      </p>
    </footer>
  );
}
