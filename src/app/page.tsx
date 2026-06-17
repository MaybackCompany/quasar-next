import Link from "next/link";
import { PATHS } from "@/lib/curriculum";
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
        <section className="wrap" style={{ padding: "84px 28px 64px" }}>
          <div style={{ maxWidth: 780 }}>
            <div
              className="eyebrow"
              style={{ marginBottom: 18, display: "inline-flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}
            >
              FREE TO READ <span className="sep">·</span> BEGINNER-FIRST <span className="sep">·</span> <FreshBadge compact />
            </div>
            <h1 className="fqs-h" style={{ fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 700 }}>
              Learn FiveM by shipping, not by watching.
            </h1>
            <p style={{ fontSize: 19, color: "var(--fg-2)", margin: "22px 0 8px", maxWidth: 640 }}>
              Run a server, write Lua resources, and build the game world. Every lesson ends with something that
              actually boots, runs, or works.
            </p>
            <p style={{ fontSize: 15.5, color: "var(--muted)", margin: "0 0 30px", maxWidth: 620 }}>
              Never written Lua? You only need to have seen a variable and a function before. Start at Track B, Step 1.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <Link className="btn btn-primary btn-big" href="/lessons/first-line-of-lua">
                New here? Start Track B, Step 1 <CtaCursor />
              </Link>
              <a className="btn btn-ghost btn-big" href="#tracks">
                I know my goal — pick a track
              </a>
            </div>
          </div>
        </section>
        <hr className="hairline" />

        {/* Tracks */}
        <section id="tracks" className="wrap" style={{ padding: "56px 28px" }}>
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
        <section className="wrap" style={{ padding: "56px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>WHY IT WORKS</div>
              <h2 className="fqs-h" style={{ fontSize: 26, marginBottom: 18 }}>
                Built for the lost beginner.
              </h2>
              <dl className="meta-list" style={{ margin: 0 }}>
                <div className="meta-row">
                  <dt>SHIP EVERY LESSON</dt>
                  <dd>Each lesson states what you&apos;ll build, how long it takes, and what you need — before you start.</dd>
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

          {/* Done-with-you upsell: reading is free, the audit is the fast path. */}
          <div
            style={{
              marginTop: 56,
              padding: 28,
              border: "1px solid var(--accent-strong)",
              borderRadius: 14,
              background: "var(--surface)",
            }}
          >
            <div className="eyebrow" style={{ color: "var(--accent-strong)", marginBottom: 8 }}>
              WANT IT DONE WITH YOU
            </div>
            <h2 className="fqs-h" style={{ fontSize: 25, margin: "0 0 10px" }}>
              Skip the trial and error. Get your next step from someone who has shipped.
            </h2>
            <p style={{ fontSize: 15.5, color: "var(--fg-2)", margin: "0 0 18px", maxWidth: "64ch", lineHeight: 1.6 }}>
              Reading is free. But if your server is stuck, or you just want the fastest path from zero to live, book
              a free one on one FiveM audit. A senior builder looks at your setup and tells you the exact next thing to
              fix. It comes from the team behind 60,000+ scripts sold and 6 Tebex Legends Awards.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <BookAudit className="btn btn-primary">Book your free FiveM audit</BookAudit>
              <a className="btn btn-ghost" href="https://fivemcoach.com/en" target="_blank" rel="noopener noreferrer">
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
