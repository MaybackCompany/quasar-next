interface MetaItem {
  label: string;
  value: React.ReactNode;
}

interface LessonHeroProps {
  /** e.g. "Module 03 · Lesson 10" */
  crumbs?: string;
  title: string;
  /** Metadata rows: You'll learn / Time / Prereqs / Outcome. */
  meta?: MetaItem[];
  /** The lede paragraph (supports markdown emphasis). */
  children?: React.ReactNode;
}

/** Lesson opener: breadcrumb, large title, lede, and a calm metadata grid. */
export function LessonHero({ crumbs, title, meta, children }: LessonHeroProps) {
  return (
    <header className="mb-10">
      {crumbs && (
        <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink-3">{crumbs}</p>
      )}
      <h1 className="mt-3 text-[clamp(2rem,5vw,2.75rem)] font-extrabold leading-[1.08] tracking-tight text-foreground">
        {title}
      </h1>
      {children && (
        <div className="mt-4 max-w-[60ch] text-[1.15rem] leading-relaxed text-ink-2 [&_strong]:font-semibold [&_strong]:text-foreground">
          {children}
        </div>
      )}
      {meta && meta.length > 0 && (
        <dl className="mt-8 border-t border-separator">
          {meta.map((m) => (
            <div
              key={m.label}
              className="grid grid-cols-[minmax(7rem,9rem)_minmax(0,1fr)] gap-4 border-b border-separator py-3.5 sm:gap-6"
            >
              <dt className="font-mono text-[0.66rem] font-medium uppercase leading-relaxed tracking-[0.14em] text-ink-3">
                {m.label}
              </dt>
              <dd className="max-w-[58ch] text-[0.95rem] leading-relaxed text-foreground">{m.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </header>
  );
}
