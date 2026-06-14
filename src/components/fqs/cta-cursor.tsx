/**
 * Minimalist click-cursor that replaces the old "→" on CTAs. The press
 * animation fires on the parent .btn:hover (pure CSS, see design-system.css).
 */
export function CtaCursor() {
  return (
    <span className="cta-cursor" aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 2.5 L5 18 L9 14.2 L11.6 19.6 L13.6 18.7 L11 13.4 L16.4 13.4 Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
