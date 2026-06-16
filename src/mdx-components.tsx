import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";
import { Pre } from "@/components/lesson/mdx/code-block";
import { LessonChecklist } from "@/components/fqs/lesson-checklist";
import { LuaSandbox } from "@/components/fqs/lua-sandbox";
import { TechLinks, TechLink, faviconUrl } from "@/components/fqs/tech-links";
import { Mockup, MockTable, Swatch } from "@/components/fqs/mockups";
import { LessonVideo } from "@/components/fqs/lesson-video";
import { YouTubeVideo } from "@/components/fqs/youtube-video";
// Components used by hub pages (cheatsheets/server/...) that aren't restyled here yet.
import { LinkCard, LinkCardGrid, Quiz, Vocab, LevelUp, Explain, Chip } from "@/components/lesson/mdx";

/**
 * Global MDX map — FiveM School design system.
 * Base elements + lesson components render with the design's CSS classes
 * (.codeblock, .step, .callout, .meta-list, .failures, .chip ...).
 * Lesson bodies are authored in MDX; styling lives here and in design-system.css.
 */

interface MetaItem {
  label: string;
  value: ReactNode;
}

function LessonHero({
  crumbs,
  title,
  meta,
  children,
}: {
  crumbs?: string;
  title: string;
  meta?: MetaItem[];
  children?: ReactNode;
}) {
  return (
    <header>
      {crumbs ? (
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          {crumbs}
        </div>
      ) : null}
      <h1 className="fqs-h" style={{ fontSize: "clamp(30px, 4.5vw, 44px)" }}>
        {title}
      </h1>
      {children ? (
        <div
          style={{ fontSize: 17, color: "var(--fg-2)", margin: "16px 0 0", maxWidth: "60ch" }}
          className="lesson-hero-intro"
        >
          {children}
        </div>
      ) : null}
      {meta && meta.length ? (
        <dl className="meta-list">
          {meta.map((m) => (
            <div className="meta-row" key={m.label}>
              <dt>{m.label}</dt>
              <dd>{m.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  );
}

function Prereq({ items }: { items: string[] }) {
  return <LessonChecklist items={items} />;
}

function Callout({ title, children }: { variant?: string; title?: string; children?: ReactNode }) {
  return (
    <aside className="callout note">
      <span className="bar" />
      <div className="body">
        {title ? <div className="label">{title}</div> : null}
        {children}
      </div>
    </aside>
  );
}

function StepGroup({ children }: { children?: ReactNode }) {
  return <div className="stepgroup">{children}</div>;
}

function Step({
  num,
  title,
  outcome,
  children,
}: {
  num?: number | string;
  title: string;
  outcome?: string;
  children?: ReactNode;
}) {
  return (
    <section className="step">
      <span className="step-num" aria-hidden="true">
        {num}
      </span>
      <div style={{ minWidth: 0 }}>
        <h3 className="fqs-h">{title}</h3>
        {outcome ? <div className="outcome-pill">{outcome}</div> : null}
        {children}
      </div>
    </section>
  );
}

function ExpectedOutput({ label, children }: { label?: string; children?: ReactNode }) {
  return (
    <aside className="callout expected">
      <span className="bar" />
      <div className="body">
        <div className="label">{label || "EXPECTED OUTPUT"}</div>
        <pre>{children}</pre>
      </div>
    </aside>
  );
}

function FailureList({ items }: { items: { symptom: string; fix: string }[] }) {
  return (
    <table className="failures">
      <thead>
        <tr>
          <th style={{ width: "42%" }}>Symptom</th>
          <th>Fix</th>
        </tr>
      </thead>
      <tbody>
        {items.map((f, i) => (
          <tr key={i}>
            <td className="err">
              <code>{f.symptom}</code>
            </td>
            <td>{f.fix}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Recap({ items }: { items: string[] }) {
  return (
    <ul className="prose" style={{ margin: "12px 0", paddingLeft: 22 }}>
      {items.map((it, i) => (
        <li key={i} style={{ color: "var(--fg-2)" }}>
          {it}
        </li>
      ))}
    </ul>
  );
}

function Exercise({ children }: { children?: ReactNode }) {
  return (
    <aside className="callout note">
      <span className="bar" />
      <div className="body">
        <div className="label">TRY IT YOURSELF</div>
        {children}
      </div>
    </aside>
  );
}

function Refs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>
        REFERENCES
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {items.map((r) => (
          <a
            key={r.href}
            className="chip"
            href={r.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
          >
            <img
              src={faviconUrl(r.href, 32)}
              alt=""
              width={15}
              height={15}
              loading="lazy"
              style={{ display: "block", borderRadius: 3, objectFit: "contain" }}
            />
            {r.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
}

function Checkpoint({ question, children }: { question: string; children: ReactNode }) {
  return (
    <details className="fqs-details" style={{ margin: "18px 0" }}>
      <summary
        style={{
          cursor: "pointer",
          listStyle: "none",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontWeight: 600,
          color: "var(--fg)",
        }}
      >
        <span className="tick on" aria-hidden="true">
          ✓
        </span>
        {question}
      </summary>
      <div style={{ marginTop: 10, color: "var(--fg-2)", borderTop: "1px solid var(--hairline-soft)", paddingTop: 10 }}>
        {children}
      </div>
    </details>
  );
}

function Cheatsheet({ title, rows }: { title?: string; rows: ReadonlyArray<{ cmd: string; desc: ReactNode }> }) {
  return (
    <section style={{ margin: "26px 0", border: "1px solid var(--hairline)", borderRadius: 10, overflow: "hidden" }}>
      <div className="eyebrow" style={{ padding: "10px 16px", borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}>
        {title ?? "Cheat sheet"}
      </div>
      <dl style={{ margin: 0 }}>
        {rows.map((r) => (
          <div
            key={r.cmd}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 15rem) minmax(0, 1fr)",
              gap: 16,
              padding: "10px 16px",
              borderTop: "1px solid var(--hairline-soft)",
            }}
          >
            <dt>
              <code className="inline">{r.cmd}</code>
            </dt>
            <dd style={{ margin: 0, color: "var(--fg-2)", fontSize: 14.5 }}>{r.desc}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const components: MDXComponents = {
  h2: ({ className, ...p }) => (
    <h2
      className="fqs-h"
      style={{ marginTop: 48, marginBottom: 14, fontSize: 26, scrollMarginTop: 90, color: "var(--fg)" }}
      {...p}
    />
  ),
  h3: ({ className, ...p }) => (
    <h3 className="fqs-h" style={{ marginTop: 30, marginBottom: 10, fontSize: 20, scrollMarginTop: 90, color: "var(--fg)" }} {...p} />
  ),
  h4: ({ className, ...p }) => (
    <h4 className="fqs-h" style={{ marginTop: 22, marginBottom: 8, fontSize: 16, color: "var(--fg)" }} {...p} />
  ),
  p: ({ className, ...p }) => <p style={{ margin: "14px 0", color: "var(--fg-2)" }} {...p} />,
  ul: ({ className, ...p }) => <ul style={{ margin: "12px 0", paddingLeft: 22, color: "var(--fg-2)" }} {...p} />,
  ol: ({ className, ...p }) => <ol style={{ margin: "12px 0", paddingLeft: 22, color: "var(--fg-2)" }} {...p} />,
  li: ({ className, ...p }) => <li style={{ margin: "5px 0" }} {...p} />,
  a: ({ className, ...p }) => (
    <a style={{ color: "var(--accent-strong)", fontWeight: 600, textDecoration: "none" }} {...p} />
  ),
  strong: ({ className, ...p }) => <strong style={{ color: "var(--fg)", fontWeight: 600 }} {...p} />,
  hr: () => <hr className="hairline" style={{ margin: "40px 0" }} />,
  blockquote: ({ className, ...p }) => (
    <blockquote
      style={{ margin: "20px 0", borderLeft: "3px solid var(--hairline)", paddingLeft: 16, fontStyle: "italic", color: "var(--fg-2)" }}
      {...p}
    />
  ),
  // Inline code vs fenced blocks. rehype-pretty-code sets data-language on fenced
  // blocks (incl. plaintext); those go to Pre, not the inline pill.
  code: ({ className, children, ...p }) => {
    const isFenced =
      (typeof className === "string" && className.includes("language-")) || "data-language" in p;
    if (isFenced) {
      return (
        <code className={className} {...p}>
          {children}
        </code>
      );
    }
    return (
      <code className="inline" {...p}>
        {children}
      </code>
    );
  },
  pre: Pre,

  // Lesson components (design-styled)
  LessonHero,
  Prereq,
  Callout,
  StepGroup,
  Step,
  ExpectedOutput,
  FailureList,
  Recap,
  Exercise,
  Refs,
  Sandbox: LuaSandbox,
  TechLinks,
  TechLink,
  Mockup,
  MockTable,
  Swatch,
  LessonVideo,
  YouTube: YouTubeVideo,

  // Hub components (kept functional; restyle pending)
  LinkCard,
  LinkCardGrid,
  Checkpoint,
  Cheatsheet,
  Quiz,
  Vocab,
  LevelUp,
  Explain,
  Chip,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
