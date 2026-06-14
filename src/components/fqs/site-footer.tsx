import Link from "next/link";

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
          FIVEM SCHOOL <span className="sep">·</span> FREE TO READ <span className="sep">·</span> VERIFIED JUNE 2026
        </span>
        <span style={{ display: "flex", gap: 18, fontSize: 13.5, color: "var(--muted)" }}>
          <Link href="/cheatsheets">Cheatsheets</Link>
          <Link href="/pricing">Pricing</Link>
        </span>
      </div>
    </footer>
  );
}
