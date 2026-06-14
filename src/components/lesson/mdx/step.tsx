import { ArrowRight } from "lucide-react";

interface StepGroupProps {
  children: React.ReactNode;
}

/** Ordered container for the numbered step-by-step walkthrough. */
export function StepGroup({ children }: StepGroupProps) {
  return <ol className="my-9 list-none p-0">{children}</ol>;
}

interface StepProps {
  num: number | string;
  title?: string;
  /** The observable result of finishing this step (rendered as a chip). */
  outcome?: string;
  children: React.ReactNode;
}

/**
 * One step in the walkthrough: a numbered navy badge connected by a hairline
 * timeline, a clear action title, an optional outcome chip, then the body.
 */
export function Step({ num, title, outcome, children }: StepProps) {
  return (
    <li className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 [&:last-child_.step-line]:hidden">
      <div className="flex flex-col items-center">
        <span className="z-10 flex size-9 items-center justify-center rounded-full bg-primary text-[0.82rem] font-bold tabular-nums text-primary-foreground shadow-sm">
          {num}
        </span>
        <span className="step-line mt-2 w-px flex-1 bg-separator" aria-hidden />
      </div>
      <div className="min-w-0 pb-9 pt-1">
        {title && (
          <h3 className="!mt-0 !mb-0 text-[1.15rem] font-semibold leading-snug tracking-tight text-foreground">
            {title}
          </h3>
        )}
        {outcome && (
          <p className="!mt-2 !mb-0 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-[0.76rem] font-medium text-brand-hi">
            <ArrowRight className="size-3.5 shrink-0" aria-hidden />
            {outcome}
          </p>
        )}
        <div className="mt-3.5 space-y-4 text-[0.975rem] leading-relaxed [&>*:first-child]:mt-0">
          {children}
        </div>
      </div>
    </li>
  );
}
