import {
  Lightbulb,
  Info,
  TriangleAlert,
  OctagonAlert,
  Gamepad2,
  Sparkles,
  Eye,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type CalloutVariant = "tip" | "info" | "warn" | "danger" | "fivem" | "pro" | "gotcha";

interface VariantStyle {
  color: string;
  icon: LucideIcon;
  label: string;
}

/**
 * Restrained, intentional palette - four colour families (teal / amber / red /
 * neutral) so callouts read as a calm system, not a rainbow. Each variant keeps
 * a distinct icon + label for meaning without relying on colour alone.
 */
const VARIANTS: Record<CalloutVariant, VariantStyle> = {
  tip: { color: "var(--brand-hi)", icon: Lightbulb, label: "Tip" },
  fivem: { color: "var(--brand)", icon: Gamepad2, label: "FiveM" },
  info: { color: "var(--ink-3)", icon: Info, label: "Note" },
  warn: { color: "var(--brand-2)", icon: TriangleAlert, label: "Watch out" },
  gotcha: { color: "var(--brand-2)", icon: Eye, label: "Gotcha" },
  pro: { color: "var(--brand-2)", icon: Sparkles, label: "Pro" },
  danger: { color: "oklch(0.62 0.21 25)", icon: OctagonAlert, label: "Danger" },
};

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Callout({ variant = "info", title, children, className }: CalloutProps) {
  const v = VARIANTS[variant] ?? VARIANTS.info;
  const Icon = v.icon;

  return (
    <aside
      role="note"
      className={cn(
        "my-7 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3.5 gap-y-1 rounded-r-xl border-l-[3px] py-4 pl-4 pr-5",
        className,
      )}
      style={{
        borderColor: v.color,
        background: `color-mix(in oklab, ${v.color} 8%, var(--background))`,
      }}
    >
      <span
        className="mt-0.5 inline-flex size-5 items-center justify-center"
        style={{ color: v.color }}
        aria-hidden
      >
        <Icon className="size-[1.05rem]" strokeWidth={2.25} />
      </span>
      <p
        className="self-center font-mono text-[0.66rem] font-semibold uppercase tracking-[0.13em]"
        style={{ color: v.color }}
      >
        {title ?? v.label}
      </p>
      <div className="col-start-2 text-[0.95rem] leading-relaxed text-foreground/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&>p]:my-2">
        {children}
      </div>
    </aside>
  );
}
