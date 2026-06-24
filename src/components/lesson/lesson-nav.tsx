import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Lesson, Module, Path } from "@/lib/curriculum";

interface LessonNavProps {
  activeSlug: string;
  module: Module;
  path: Path | null;
  prev: Lesson | null;
  next: Lesson | null;
}

/** Shared lesson navigation body - used by the desktop sidebar and the mobile drawer. */
export function LessonNav({ activeSlug, module, path, prev, next }: LessonNavProps) {
  const total = module.lessons.length;
  const index = module.lessons.findIndex((l) => l.slug === activeSlug);
  const position = index >= 0 ? index + 1 : null;

  return (
    <>
      <a
        href="/#tracks"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-hi transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Roadmap
      </a>

      <div className="mt-5 border-t border-separator pt-4">
        {path && (
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
            {path.flag}
          </p>
        )}
        <h2 className="mt-1 text-base font-semibold leading-snug text-foreground">{module.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">{module.desc}</p>
        {position && (
          <div className="mt-3.5">
            <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
              Lesson {position} of {total}
            </p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-300"
                style={{ width: `${(position / total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <nav aria-label="Module lessons" className="mt-5">
        <ol className="space-y-1">
          {module.lessons.map((lesson) => {
            const active = lesson.slug === activeSlug;
            return (
              <li key={lesson.slug}>
                <a
                  href={`/lessons/${lesson.slug}`}
                  aria-current={active ? "page" : undefined}
                  className="grid grid-cols-[minmax(2.25rem,auto)_1fr] gap-3 rounded-lg border-l-2 border-transparent px-3 py-2 text-sm text-ink-2 transition-colors hover:bg-secondary hover:text-foreground aria-[current=page]:border-brand aria-[current=page]:bg-brand-soft aria-[current=page]:text-foreground"
                >
                  <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-wide text-ink-3">
                    {lesson.num}
                  </span>
                  <span className="min-w-0 leading-snug">{lesson.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-5 grid gap-2 border-t border-separator pt-4">
        <LessonNavLink direction="prev" lesson={prev} />
        <LessonNavLink direction="next" lesson={next} />
      </div>
    </>
  );
}

function LessonNavLink({ direction, lesson }: { direction: "prev" | "next"; lesson: Lesson | null }) {
  if (!lesson) {
    return (
      <span className="rounded-lg border border-separator px-3 py-2 text-sm text-ink-3">
        {direction === "prev" ? "No previous lesson" : "No next lesson"}
      </span>
    );
  }

  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;

  return (
    <a
      href={`/lessons/${lesson.slug}`}
      className="group flex items-center justify-between gap-3 rounded-lg border border-separator px-3 py-2 text-sm text-ink-2 transition-colors hover:border-brand hover:text-foreground"
    >
      {direction === "prev" && <Icon className="size-4 shrink-0 text-ink-3 transition-colors group-hover:text-brand-hi" />}
      <span className={direction === "next" ? "text-right" : undefined}>
        <span className="block font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ink-3">
          {direction === "prev" ? "Previous" : "Next"}
        </span>
        <span className="line-clamp-2">{lesson.title}</span>
      </span>
      {direction === "next" && <Icon className="size-4 shrink-0 text-ink-3 transition-colors group-hover:text-brand-hi" />}
    </a>
  );
}
