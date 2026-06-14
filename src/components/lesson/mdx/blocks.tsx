import {
  ArrowUpRight,
  Check,
  CircleCheckBig,
  Dumbbell,
  Rocket,
  SquareCheckBig,
  Terminal,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* ── shared section label ─────────────────────────────────────────── */
function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-3", className)}>
      {children}
    </p>
  );
}

/* ── Prereq: "Before you start" checklist ─────────────────────────── */
export function Prereq({ items }: { items: ReadonlyArray<string> }) {
  return (
    <section className="my-8 rounded-2xl border border-separator bg-card/60 p-5">
      <SectionLabel className="mb-3.5">Before you start</SectionLabel>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-ink-2">
            <SquareCheckBig className="mt-0.5 size-4 shrink-0 text-brand-hi" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Vocab: term → definition, hairline rows ──────────────────────── */
export function Vocab({ items }: { items: ReadonlyArray<{ term: string; def: React.ReactNode }> }) {
  return (
    <section className="my-7">
      <SectionLabel className="mb-2">Vocabulary</SectionLabel>
      <dl className="border-t border-separator">
        {items.map((it) => (
          <div
            key={it.term}
            className="grid grid-cols-[minmax(7rem,11rem)_minmax(0,1fr)] gap-4 border-b border-separator py-3"
          >
            <dt className="font-semibold text-foreground">{it.term}</dt>
            <dd className="text-[0.95rem] leading-relaxed text-ink-2">{it.def}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── Recap: outcomes you can now do ───────────────────────────────── */
export function Recap({ items }: { items: ReadonlyArray<string> }) {
  return (
    <section className="my-8 rounded-2xl border border-separator bg-card/60 p-5">
      <SectionLabel className="mb-3.5">Recap</SectionLabel>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-foreground/90">
            <Check className="mt-0.5 size-4 shrink-0 text-brand-hi" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── References / links ───────────────────────────────────────────── */
export function Refs({ items }: { items: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <section className="my-7">
      <SectionLabel className="mb-2.5">References</SectionLabel>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.href}>
            <a
              href={it.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-[0.95rem] text-brand-hi underline-offset-4 hover:underline"
            >
              <ArrowUpRight className="size-3.5 shrink-0 text-ink-3 transition-colors group-hover:text-brand-hi" aria-hidden />
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Exercise: a practice task ────────────────────────────────────── */
export function Exercise({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="my-8 rounded-2xl border border-brand/25 bg-brand-soft/40 p-5">
      <p className="mb-2 inline-flex items-center gap-2 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-brand-hi">
        <Dumbbell className="size-3.5" aria-hidden />
        {title ?? "Exercise"}
      </p>
      <div className="text-[0.975rem] leading-relaxed text-foreground/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </section>
  );
}

/* ── Checkpoint: self-check with a reveal ─────────────────────────── */
export function Checkpoint({ question, children }: { question: string; children: React.ReactNode }) {
  return (
    <details className="group my-6 rounded-xl border border-separator bg-card/60 px-5 py-4 [&[open]]:bg-card">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 font-medium text-foreground marker:hidden">
        <CircleCheckBig className="size-4 shrink-0 text-brand-hi" aria-hidden />
        {question}
        <span className="ml-auto font-mono text-[0.66rem] uppercase tracking-wide text-ink-3 group-open:hidden">
          Check
        </span>
      </summary>
      <div className="mt-3 border-t border-separator pt-3 text-[0.95rem] leading-relaxed text-ink-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </details>
  );
}

/* ── Expected output: what you should see ─────────────────────────── */
export function ExpectedOutput({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border-l-[3px] border-emerald-500/70 bg-emerald-500/[0.06] py-3 pl-4 pr-5">
      <p className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-emerald-600 dark:text-emerald-400">
        <Terminal className="size-3.5" aria-hidden />
        Expected output
      </p>
      <div className="font-mono text-[0.84rem] leading-relaxed text-foreground/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

/* ── Level up: optional deeper dive ───────────────────────────────── */
export function LevelUp({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <details className="group my-7 rounded-xl border border-brand-2/30 bg-brand-2/[0.06] px-5 py-4">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 font-medium text-foreground marker:hidden">
        <Rocket className="size-4 shrink-0 text-brand-2" aria-hidden />
        {title ?? "Level up"}
        <span className="ml-auto text-ink-3 transition-transform group-open:rotate-90" aria-hidden>
          ›
        </span>
      </summary>
      <div className="mt-3 border-t border-brand-2/20 pt-3 text-[0.95rem] leading-relaxed text-ink-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </details>
  );
}

/* ── Explain: calm expository prose wrapper ───────────────────────── */
export function Explain({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 leading-relaxed text-foreground/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      {children}
    </div>
  );
}

/* ── Chip: inline labelled token ──────────────────────────────────── */
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="mx-0.5 inline-flex items-center rounded-md border border-separator bg-secondary px-1.5 py-0.5 align-baseline font-mono text-[0.82em] text-foreground">
      {children}
    </span>
  );
}

/* ── FailureList: common mistakes to avoid ────────────────────────── */
export function FailureList({
  title,
  items,
}: {
  title?: string;
  items: ReadonlyArray<{ symptom: string; fix?: React.ReactNode }>;
}) {
  return (
    <section className="my-8 rounded-2xl border border-separator bg-card/60 p-5">
      <p className="mb-3.5 inline-flex items-center gap-2 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
        <X className="size-3.5 text-red-500" aria-hidden />
        {title ?? "Common mistakes"}
      </p>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed">
            <X className="mt-0.5 size-4 shrink-0 text-red-500/80" aria-hidden />
            <span className="text-foreground/90">
              <span className="font-medium text-foreground">{it.symptom}</span>
              {it.fix && <span className="text-ink-2"> {it.fix}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Cheatsheet: command → description reference ───────────────────── */
export function Cheatsheet({
  title,
  rows,
}: {
  title?: string;
  rows: ReadonlyArray<{ cmd: string; desc: React.ReactNode }>;
}) {
  return (
    <section className="my-7 overflow-hidden rounded-2xl border border-separator">
      <p className="border-b border-separator bg-secondary/50 px-5 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
        {title ?? "Cheat sheet"}
      </p>
      <dl className="divide-y divide-separator">
        {rows.map((r) => (
          <div key={r.cmd} className="grid grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-4 px-5 py-2.5">
            <dt>
              <code className="rounded-md border border-separator bg-secondary px-1.5 py-0.5 font-mono text-[0.82em] text-foreground">
                {r.cmd}
              </code>
            </dt>
            <dd className="text-[0.9rem] leading-relaxed text-ink-2">{r.desc}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
