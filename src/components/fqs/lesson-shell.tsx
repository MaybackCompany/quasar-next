"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FreshBadge } from "@/components/fqs/fresh-badge";
import { LessonAiCopy } from "@/components/fqs/ai-copy";

export interface ShellLesson {
  slug: string;
  title: string;
  bonus?: boolean;
}
export interface ShellModule {
  num: string;
  title: string;
  lessons: ShellLesson[];
}
export interface ShellNav {
  slug: string;
  title: string;
}
export interface TocItem {
  href: string;
  label: string;
}

interface LessonShellProps {
  slug: string;
  trackId: string;
  trackLetter: string;
  trackTitle: string;
  modules: ShellModule[];
  moduleNum: string;
  moduleTitle: string;
  prev: ShellNav | null;
  next: ShellNav | null;
  toc: TocItem[];
  aiBody?: string;
  children: ReactNode;
}

const PROG_KEY = "fqs-progress";
const EDITORIAL_GUIDES: Record<string, { label: string; time: string }> = {
  "fivem-2026-orientation": { label: "FiveM server guide", time: "25 min read" },
  "tebex-store-growth": { label: "Tebex growth guide", time: "30 min read" },
};
function readProgress(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(PROG_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function showToast(msg: string) {
  let el = document.getElementById("fqs-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "fqs-toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  const node = el as HTMLElement & { _t?: ReturnType<typeof setTimeout> };
  clearTimeout(node._t);
  node._t = setTimeout(() => el!.classList.remove("show"), 1800);
}

export function LessonShell(props: LessonShellProps) {
  const { slug, trackId, trackLetter, trackTitle, modules, moduleTitle, prev, next, toc } = props;
  const router = useRouter();
  const [prog, setProg] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState<string>("top");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProg(readProgress());
  }, [slug]);

  const setDone = useCallback(
    (s: string, val: boolean) => {
      setProg((p) => {
        const nextP = { ...p, [s]: val };
        if (!val) delete nextP[s];
        try {
          localStorage.setItem(PROG_KEY, JSON.stringify(nextP));
        } catch {
          /* ignore */
        }
        return nextP;
      });
    },
    [],
  );

  // read-progress bar + TOC scroll-spy
  useEffect(() => {
    const ids = toc.map((t) => t.href.replace(/^#/, ""));
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
      let current = "top";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) current = id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc, slug]);

  const total = modules.reduce((n, m) => n + m.lessons.length, 0);
  const done = modules.reduce((n, m) => n + m.lessons.filter((l) => prog[l.slug]).length, 0);
  const isDone = !!prog[slug];
  const editorialGuide = EDITORIAL_GUIDES[slug];

  const markAndNext = () => {
    setDone(slug, true);
    showToast("Lesson complete ✓");
    if (next) router.push("/lessons/" + next.slug);
    else router.push("/track/" + trackId);
  };

  const goToc = (href: string) => {
    const el = document.getElementById(href.replace(/^#/, ""));
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90 });
    else window.scrollTo({ top: 0 });
  };

  if (editorialGuide) {
    return (
      <main className="editorial-guide-shell">
        <div className="read-progress editorial-guide-progress" ref={barRef} aria-hidden="true" />
        <header className="editorial-guide-topbar">
          <Link href="/" className="editorial-guide-brand">
            <span className="editorial-guide-mark">QU</span>
            <span>Quasar University</span>
          </Link>
          <span className="editorial-guide-tag">{editorialGuide.label}</span>
        </header>

        <div className="editorial-guide-wrap">
          <div className="editorial-guide-meta">
            <Link href={`/track/${trackId}`}>Track {trackLetter}: {trackTitle}</Link>
            <span>{editorialGuide.time}</span>
            <FreshBadge compact />
          </div>

          <article className="prose editorial-guide-prose">{props.children}</article>

          <section className="editorial-guide-tools" aria-label="Lesson tools">
            <LessonAiCopy slug={slug} body={props.aiBody} />
            <div className="editorial-guide-complete">
              <button className="btn btn-primary btn-big" onClick={markAndNext}>
                {isDone ? "Completed ✓ - go to next" : "Mark complete and continue"}
              </button>
              {isDone ? (
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setDone(slug, false);
                    showToast("Marked incomplete");
                  }}
                >
                  Undo
                </button>
              ) : null}
            </div>
          </section>

          <div className="pn-cards editorial-guide-nav">
            {prev ? (
              <Link className="pn-card" href={`/lessons/${prev.slug}`}>
                <div className="pk">← PREVIOUS</div>
                <div className="pt">{prev.title}</div>
              </Link>
            ) : <span />}
            {next ? (
              <Link className="pn-card next" href={`/lessons/${next.slug}`}>
                <div className="pk">NEXT →</div>
                <div className="pt">{next.title}</div>
              </Link>
            ) : <span />}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div className="read-progress" ref={barRef} aria-hidden="true" />
      <div className="lesson-grid">
        {/* sticky roadmap */}
        <nav className="side" aria-label="Track roadmap">
          <div className="side-progress">
            <Link href={"/track/" + trackId} className="eyebrow" style={{ color: "var(--fg-2)" }}>
              TRACK {trackLetter} · {trackTitle.toUpperCase()}
            </Link>
            <div className="sp-bar">
              <div className="sp-fill" style={{ width: (total ? (done / total) * 100 : 0) + "%" }} />
            </div>
            <div className="sp-txt" style={{ marginTop: 5 }}>
              {done} / {total} complete
            </div>
          </div>
          {modules.map((m, mi) => (
            <div key={m.num}>
              <div className="side-mod">
                <span>
                  {String(mi + 1).padStart(2, "0")} · {m.title}
                </span>
                <span className="mc">
                  {m.lessons.filter((l) => prog[l.slug]).length}/{m.lessons.length}
                </span>
              </div>
              {m.lessons.map((l) => (
                <Link
                  key={l.slug}
                  className={"side-lesson" + (l.slug === slug ? " current" : "")}
                  href={"/lessons/" + l.slug}
                  aria-current={l.slug === slug ? "page" : undefined}
                >
                  <span className={"tick" + (prog[l.slug] ? " on" : "")}>✓</span>
                  <span style={{ flex: 1 }}>{l.title}</span>
                  {l.bonus ? <span className="lock">BONUS</span> : null}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* content */}
        <div style={{ minWidth: 0 }}>
          <div
            className="eyebrow"
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 16 }}
          >
            <span>TRACK {trackLetter}</span>
            <span className="sep">·</span>
            <span>{moduleTitle.toUpperCase()}</span>
            <span className="sep">·</span>
            <FreshBadge />
          </div>

          <LessonAiCopy slug={slug} body={props.aiBody} />

          <article className="prose">{props.children}</article>

          <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 40, flexWrap: "wrap" }}>
            <button className="btn btn-primary btn-big" onClick={markAndNext}>
              {isDone ? "Completed ✓ — go to next" : "Mark complete & next →"}
            </button>
            {isDone ? (
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setDone(slug, false);
                  showToast("Marked incomplete");
                }}
              >
                Undo
              </button>
            ) : null}
          </div>

          <div className="pn-cards">
            {prev ? (
              <Link className="pn-card" href={"/lessons/" + prev.slug}>
                <div className="pk">← PREVIOUS</div>
                <div className="pt">{prev.title}</div>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link className="pn-card next" href={"/lessons/" + next.slug}>
                <div className="pk">NEXT →</div>
                <div className="pt">{next.title}</div>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>

        {/* TOC */}
        <nav className="side" aria-label="On this page">
          <div className="toc-head">ON THIS PAGE</div>
          {toc.map((t) => (
            <button
              key={t.href}
              className={"toc-item" + (activeId === t.href.replace(/^#/, "") ? " active" : "")}
              onClick={() => goToc(t.href)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
