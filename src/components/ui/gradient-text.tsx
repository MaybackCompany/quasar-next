import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Static teal brand gradient text (replaces Magic UI AuroraText). No animation
 * — calmer, reduced-motion-safe, and on the clean docs aesthetic.
 */
export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-brand via-brand-hi to-brand bg-clip-text text-transparent",
        className,
      )}
    >
      {children}
    </span>
  );
}
