"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuizOption {
  label: string;
  correct?: boolean;
}

interface QuizProps {
  question: string;
  options: ReadonlyArray<QuizOption>;
  /** Explanation revealed after answering. */
  children?: React.ReactNode;
}

/** Interactive single-answer check. Reveals correct/incorrect + explanation on pick. */
export function Quiz({ question, options, children }: QuizProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;

  return (
    <section className="my-8 rounded-2xl border border-separator bg-card/60 p-5">
      <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
        Quick check
      </p>
      <p className="mt-1.5 font-medium leading-snug text-foreground">{question}</p>

      <ul className="mt-4 space-y-2">
        {options.map((opt, i) => {
          const isPicked = picked === i;
          const revealCorrect = answered && opt.correct;
          const revealWrong = answered && isPicked && !opt.correct;
          return (
            <li key={opt.label}>
              <button
                type="button"
                onClick={() => !answered && setPicked(i)}
                disabled={answered}
                aria-pressed={isPicked}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl border px-4 py-2.5 text-left text-[0.95rem] transition-colors",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  !answered && "border-separator hover:border-brand/60 hover:bg-secondary",
                  revealCorrect && "border-emerald-500/60 bg-emerald-500/10 text-foreground",
                  revealWrong && "border-red-500/60 bg-red-500/10 text-foreground",
                  answered && !revealCorrect && !revealWrong && "border-separator opacity-55",
                )}
              >
                <span className="flex-1">{opt.label}</span>
                {revealCorrect && <Check className="size-4 shrink-0 text-emerald-500" aria-hidden />}
                {revealWrong && <X className="size-4 shrink-0 text-red-500" aria-hidden />}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && children && (
        <div className="mt-4 border-t border-separator pt-3 text-[0.92rem] leading-relaxed text-ink-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {children}
        </div>
      )}
    </section>
  );
}
