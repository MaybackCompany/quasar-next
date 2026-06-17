import type { Metadata } from "next";

import { SiteNav } from "@/components/fqs/site-nav";
import { BookAudit } from "@/components/fqs/book-audit";
import { setGuildMemberRole } from "@/lib/auth/discord";
import { getSession } from "@/lib/auth/session";
import { getMember, isExpired, markStatus } from "@/lib/trials/store";
import { PRICING_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Your access has ended · FiveM School",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ExpiredPage() {
  // When a locked-out member lands here, pull their access role on the spot
  // (the daily cron is only the backstop) and mark the row terminal, once.
  const session = await getSession();
  if (session.user) {
    const member = await getMember(session.user.id);
    if (member && isExpired(member) && member.status !== "expired" && member.status !== "revoked") {
      if (member.roleId) await setGuildMemberRole(member.id, member.roleId, false);
      await markStatus(member.id, "expired");
    }
  }

  return (
    <div className="fqs">
      <SiteNav />
      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 96 }}>
        <div style={{ maxWidth: 680 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            YOUR GUIDE ACCESS HAS ENDED
          </div>
          <h1 className="fqs-h" style={{ fontSize: "clamp(30px, 5vw, 46px)", lineHeight: 1.08 }}>
            Don&apos;t stop right where it finally clicks.
          </h1>
          <p style={{ fontSize: 17, color: "var(--fg-2)", margin: "18px 0 0", lineHeight: 1.6, maxWidth: "60ch" }}>
            Your trial of the FiveM build guide is up. You have already seen how the pieces fit together: the
            server, the framework, the scripts, the database. The hard part is the gap between understanding it
            and having a server that is actually live, stable, and earning. That gap is where most people quit.
            You do not have to.
          </p>

          <div
            className="track-card"
            style={{ marginTop: 32, padding: 24, maxWidth: 560, borderColor: "var(--accent-strong)" }}
          >
            <div className="eyebrow" style={{ marginBottom: 8, color: "var(--accent-strong)" }}>
              YOUR NEXT STEP IS FREE
            </div>
            <h2 className="fqs-h" style={{ fontSize: 22, margin: "0 0 12px" }}>
              Get a free FiveM audit. One on one. No pitch.
            </h2>
            <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
              {[
                "A senior builder reviews your server (or your plan) and tells you the one thing to fix first.",
                "You leave with a clear, ordered build plan instead of forty open tabs and a half-broken server.",
                "It comes from the team behind 60,000+ scripts sold and 6 Tebex Legends Awards.",
              ].map((line) => (
                <li
                  key={line}
                  style={{ display: "flex", gap: 10, fontSize: 15, color: "var(--fg)", lineHeight: 1.5 }}
                >
                  <span aria-hidden="true" style={{ color: "var(--accent-strong)", fontWeight: 700 }}>
                    +
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <BookAudit className="btn btn-primary" >Book your free FiveM audit</BookAudit>

            <p style={{ fontSize: 13, color: "var(--muted)", margin: "12px 0 0", lineHeight: 1.5 }}>
              Free, one on one, no card, no pitch. Worst case, you walk away with a plan. Only a handful of audit
              slots open each week.
            </p>
          </div>

          <p style={{ fontSize: 15, color: "var(--fg-2)", margin: "28px 0 0" }}>
            Prefer to keep the whole library and lock in a membership?{" "}
            <a
              href={PRICING_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent-strong)", fontWeight: 600 }}
            >
              See the plans at fivemcoach.com
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
