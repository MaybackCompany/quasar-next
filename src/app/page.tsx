import Link from "next/link";
import { PATHS, STATS } from "@/lib/curriculum";
import { CtaCursor } from "@/components/fqs/cta-cursor";
import { SiteNav } from "@/components/fqs/site-nav";
import { FreshBadge } from "@/components/fqs/fresh-badge";
import { SiteFooter } from "@/components/fqs/site-footer";
import { BookAudit } from "@/components/fqs/book-audit";

const TRACK_LETTER: Record<string, string> = { server: "A", scripts: "B", gameworld: "C" };

const STACK = [
  "Lua 5.4", "fxmanifest", "ox_lib", "ox_target", "ox_inventory", "oxmysql",
  "Qbox", "ESX", "txAdmin", "OneSync", "NUI", "anti-cheat",
];

const FEATURED_GUIDES = [
  {
    eyebrow: "SERVER OWNER",
    title: "Build your first FiveM server",
    description: "Plan the stack, install the foundation, configure txAdmin, understand server.cfg, and add resources safely.",
    href: "/lessons/artifacts-txadmin",
    meta: "20 verified chapters",
  },
  {
    eyebrow: "SCRIPT SELLER",
    title: "Build and grow a Tebex store",
    description: "Set up packages, prove compatibility, test delivery, structure offers, publish videos, and measure growth.",
    href: "/lessons/shipping",
    meta: "14 verified chapters",
  },
] as const;

function TrackCard({ id }: { id: string }) {
  const t = PATHS.find((p) => p.id === id)!;
  const count = t.modules.reduce((n, m) => n + m.lessons.length, 0);
  return (
    <Link className="track-card" href={"/track/" + t.id}>
      <span className="tc-letter">{TRACK_LETTER[t.id]}</span>
      <h3 className="fqs-h">{t.title}</h3>
      <p style={{ fontSize: 14, color: "var(--muted)", margin: "2px 0 0" }}>{t.desc}</p>
      <div className="tc-kv">
        <div>
          <div className="k">PICK THIS IF</div>
          <div className="v">{t.startIf}</div>
        </div>
        <div>
          <div className="k">YOU FINISH WITH</div>
          <div className="v">{t.firstProof}</div>
        </div>
      </div>
      <div className="tc-foot">
        <span className="tc-count">{count} lessons</span>
        <span className="tc-go">
          Open track <CtaCursor />
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="fqs">
      <SiteNav active="tracks" />
      <main>
        {/* Hero */}
        <section className="wrap" style={{ padding: "76px 28px 60px" }}>
          <div className="hero-grid">
            <div>
              <div
                className="eyebrow"
                style={{ marginBottom: 18, display: "inline-flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}
              >
                FOR FIVEMCOACH MEMBERS <span className="sep">·</span> BEGINNER-FIRST <span className="sep">·</span> <FreshBadge compact />
              </div>
              <h1 className="fqs-h" style={{ fontSize: "clamp(40px, 6.4vw, 74px)", fontWeight: 700 }}>
                Learn FiveM by shipping, not by watching.
              </h1>
              <p style={{ fontSize: 19, color: "var(--fg-2)", margin: "22px 0 8px", maxWidth: 560 }}>
                Run a server, write Lua resources, and build the game world. Every lesson ends with something that
                actually boots, runs, or works.
              </p>
              <p style={{ fontSize: 15.5, color: "var(--muted)", margin: "0 0 30px", maxWidth: 540 }}>
                Never written Lua? You only need to have seen a variable and a function before. Start at Track B, Step 1.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
                <Link className="btn btn-primary btn-big" href="/lessons/first-line-of-lua">
                  New here? Start Track B, Step 1 <CtaCursor />
                </Link>
                <a className="btn btn-ghost btn-big" href="#tracks">
                  I know my goal - pick a track
                </a>
              </div>
              <div className="hero-proof">
                <span className="pseg">Built by the team behind</span>
                <span className="pseg"><b>60,000+</b> scripts sold</span>
                <span className="pdot" aria-hidden />
                <span className="pseg"><b>6</b> Tebex Legends Awards</span>
              </div>
            </div>
            <div className="boot-wrap" aria-hidden>
              <div className="boot-card">
                <div className="boot-head">
                  <span className="boot-dot r" /><span className="boot-dot y" /><span className="boot-dot g" />
                  <span className="boot-title">FXServer console</span>
                </div>
                <div className="boot-body">
                  <span className="ln mut"># this is how your first lesson ends</span>
                  <span className="ln"><span className="mut">&gt;</span> ensure qbx_core</span>
                  <span className="ln"><span className="mut">&gt;</span> ensure ox_inventory</span>
                  <span className="ln ok">Server license key authentication succeeded.</span>
                  <span className="ln">Server is now listening on 0.0.0.0:30120</span>
                  <span className="ln ok">[OK] 1 player connected<span className="boot-cursor" /></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proof: real scale, stated plainly. Not metric cards. */}
        <section className="wrap" style={{ padding: "0 28px 8px" }} aria-label="What the school covers">
          <div className="stat-row">
            {STATS.map((s) => (
              <div key={s.label} className="stat">
                <span className="sv">{s.value}</span>
                <span className="sl">{s.label}</span>
              </div>
            ))}
            <div className="stat">
              <span className="sv">2026</span>
              <span className="sl">re-verified ecosystem</span>
            </div>
          </div>
        </section>

        <section className="wrap" style={{ padding: "52px 28px" }} aria-labelledby="featured-guides-heading">
          <h2 id="featured-guides-heading" className="fqs-h" style={{ fontSize: 30, marginBottom: 10 }}>
            Two guided starting points.
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 24, maxWidth: 640 }}>
            Open the guide that matches what you are trying to ship. Both use the same lesson design, progress tools,
            navigation, videos, and verified references as the rest of the school.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {FEATURED_GUIDES.map((guide) => (
              <Link key={guide.href} className="track-card" href={guide.href}>
                <span className="eyebrow" style={{ color: "var(--accent-strong)" }}>{guide.eyebrow}</span>
                <h3 className="fqs-h">{guide.title}</h3>
                <p style={{ fontSize: 14, color: "var(--muted)", margin: "2px 0 0" }}>{guide.description}</p>
                <div className="tc-foot">
                  <span className="tc-count">{guide.meta}</span>
                  <span className="tc-go">
                    Open guide <CtaCursor />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <hr className="hairline" />

        {/* Tracks */}
        <section id="tracks" className="wrap" style={{ padding: "64px 28px" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>CHOOSE YOUR GOAL</div>
          <h2 className="fqs-h" style={{ fontSize: 30, marginBottom: 26 }}>
            Three tracks. Pick one outcome.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {PATHS.map((t) => (
              <TrackCard key={t.id} id={t.id} />
            ))}
          </div>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 18 }}>
            Not sure?{" "}
            <Link href="/lessons/first-line-of-lua" style={{ color: "var(--accent-strong)", fontWeight: 600 }}>
              Track B, Step 1
            </Link>{" "}
            assumes the least and teaches the skills the other two lean on.
          </p>
        </section>
        <hr className="hairline" />

        {/* Method + stack */}
        <section className="wrap" style={{ padding: "72px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>WHY IT WORKS</div>
              <h2 className="fqs-h" style={{ fontSize: 26, marginBottom: 18 }}>
                Built for the lost beginner.
              </h2>
              <dl className="meta-list" style={{ margin: 0 }}>
                <div className="meta-row">
                  <dt>SHIP EVERY LESSON</dt>
                  <dd>Each lesson states what you&apos;ll build, how long it takes, and what you need - before you start.</dd>
                </div>
                <div className="meta-row">
                  <dt>EXACT ERRORS</dt>
                  <dd>Every lesson lists the literal console errors you&apos;ll hit, what causes them, and the one-line fix.</dd>
                </div>
                <div className="meta-row">
                  <dt>VERIFIED 2026</dt>
                  <dd>Every command re-tested against the live ecosystem. No Keymaster, no lua54 flags, no stale advice.</dd>
                </div>
                <div className="meta-row">
                  <dt>BRING YOUR AI</dt>
                  <dd>One click copies a whole lesson as structured context, so your AI assistant tutors you with current facts.</dd>
                </div>
              </dl>
            </div>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>COVERS YOUR WHOLE STACK</div>
              <h2 className="fqs-h" style={{ fontSize: 26, marginBottom: 18 }}>
                The 2026 FiveM stack, current.
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {STACK.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: 14.5, color: "var(--muted)", marginTop: 18 }}>
                Tutorials rot. Ours carry a per-lesson verification date, so when the ecosystem moves, the badge tells you.
              </p>
            </div>
          </div>

          {/* Done-with-you upsell: lessons come with membership, the audit is the fast path. */}
          <div
            style={{
              marginTop: 64,
              padding: 34,
              border: "1px solid var(--accent-line)",
              borderRadius: 16,
              background: "var(--accent-soft)",
            }}
          >
            <div className="eyebrow" style={{ color: "var(--accent-strong)", marginBottom: 8 }}>
              WANT IT DONE WITH YOU
            </div>
            <h2 className="fqs-h" style={{ fontSize: 25, margin: "0 0 10px" }}>
              Skip the trial and error. Get your next step from someone who has shipped.
            </h2>
            <p style={{ fontSize: 15.5, color: "var(--fg-2)", margin: "0 0 18px", maxWidth: "64ch", lineHeight: 1.6 }}>
              The lessons come with your FiveMCoach membership. But if your server is stuck, or you just want the
              fastest path from zero to live, book a free one on one FiveM audit. A senior builder looks at your setup
              and tells you the exact next thing to fix. It comes from the team behind 60,000+ scripts sold and 6 Tebex
              Legends Awards.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <BookAudit className="btn btn-primary">Book your free FiveM audit</BookAudit>
              <a className="btn btn-ghost" href="/track/scripts" target="_blank" rel="noopener noreferrer">
                See membership plans
              </a>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "12px 0 0" }}>
              Free, one on one, no card. Worst case, you leave with a plan.
            </p>
          </div>

          <SiteFooter />
        </section>
      </main>
    </div>
  );
}
