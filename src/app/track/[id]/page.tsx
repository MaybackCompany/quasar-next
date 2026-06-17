import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PATHS } from "@/lib/curriculum";
import { SiteNav } from "@/components/fqs/site-nav";
import { FreshBadge } from "@/components/fqs/fresh-badge";
import { SiteFooter } from "@/components/fqs/site-footer";
import { ModuleAiCopy } from "@/components/fqs/ai-copy";

const TRACK_LETTER: Record<string, string> = { server: "A", scripts: "B", gameworld: "C" };

export function generateStaticParams() {
  return PATHS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = PATHS.find((p) => p.id === id);
  if (!t) return { title: "Track not found · Quasar School" };
  return { title: `${t.title} · Track ${TRACK_LETTER[t.id]} · Quasar School`, description: t.desc };
}

export default async function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = PATHS.find((p) => p.id === id);
  if (!t) notFound();

  const letter = TRACK_LETTER[t.id];
  const count = t.modules.reduce((n, m) => n + m.lessons.length, 0);
  const firstSlug = t.modules[0]?.lessons[0]?.slug;

  return (
    <div className="fqs">
      <SiteNav active="tracks" />
      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ maxWidth: 780 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            TRACK {letter} <span className="sep">·</span> {count} LESSONS <span className="sep">·</span>{" "}
            <FreshBadge compact />
          </div>
          <h1 className="fqs-h" style={{ fontSize: "clamp(34px, 5vw, 52px)" }}>
            {t.title}
          </h1>
          <p style={{ fontSize: 18, color: "var(--fg-2)", margin: "18px 0 6px" }}>{t.desc}</p>
          <p style={{ fontSize: 15, color: "var(--muted)", margin: "0 0 26px" }}>
            <strong style={{ color: "var(--fg-2)" }}>For:</strong> {t.startIf}
            <strong style={{ color: "var(--fg-2)", marginLeft: 8 }}>You finish with:</strong> {t.firstProof}
          </p>
          {firstSlug ? (
            <Link className="btn btn-primary" href={"/lessons/" + firstSlug}>
              Start at Step 1 <ArrowRight size={16} />
            </Link>
          ) : null}
        </div>

        <div style={{ maxWidth: 780, marginTop: 50 }}>
          {t.modules.map((m, mi) => (
            <section key={m.num} style={{ marginBottom: 36 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--hairline)",
                  paddingBottom: 10,
                  marginBottom: 6,
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <h2 className="fqs-h" style={{ fontSize: 20 }}>
                  <span className="eyebrow" style={{ marginRight: 12 }}>
                    MODULE {String(mi + 1).padStart(2, "0")}
                  </span>
                  {m.title}
                </h2>
                <ModuleAiCopy trackId={t.id} moduleNum={m.num} />
              </div>
              {m.lessons.map((l, li) => (
                <Link key={l.slug} className="lesson-row" href={"/lessons/" + l.slug}>
                  <span className="lr-num">{String(li + 1).padStart(2, "0")}</span>
                  <span className="lr-title">
                    {l.title}
                    {l.bonus ? <span className="lock">BONUS</span> : null}
                  </span>
                  <span className="lr-time">{l.tag}</span>
                  <span className="tick" aria-hidden="true">
                    ✓
                  </span>
                </Link>
              ))}
            </section>
          ))}
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
