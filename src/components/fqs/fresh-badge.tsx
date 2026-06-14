interface FreshBadgeProps {
  date?: string;
  compact?: boolean;
}

// "Verified 2026" freshness badge. Freshness is the product's trust moat.
export function FreshBadge({ date = "June 2026", compact }: FreshBadgeProps) {
  return (
    <span
      className="fresh-badge"
      title={`Every command re-tested against the live FiveM ecosystem. Last verified ${date}.`}
    >
      <span className="dot" />
      {compact ? "Verified 2026" : `Verified ${date} · Lua 5.4 · ox_lib 3.x`}
    </span>
  );
}
