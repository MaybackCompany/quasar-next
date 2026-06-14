import Link from "next/link";
import { SiteNav } from "@/components/fqs/site-nav";

export default function NotFound() {
  return (
    <div className="fqs">
      <SiteNav />
      <main className="wrap" style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 60px)", padding: "64px 28px" }}>
        <section style={{ maxWidth: 560, textAlign: "center" }}>
          <div className="eyebrow" style={{ color: "var(--accent-strong)" }}>404</div>
          <h1 className="fqs-h" style={{ marginTop: 12, fontSize: "clamp(34px, 5vw, 52px)" }}>
            Page not found
          </h1>
          <p style={{ margin: "16px auto 0", maxWidth: 440, color: "var(--fg-2)" }}>
            The page you were looking for does not exist or has moved.
          </p>
          <div style={{ marginTop: 28 }}>
            <Link className="btn btn-primary" href="/">
              Return home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
