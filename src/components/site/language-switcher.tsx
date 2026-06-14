export function LanguageSwitcher() {
  return (
    <button
      type="button"
      className="hidden h-9 rounded-full border border-separator bg-background px-3 text-xs font-semibold text-ink-2 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex sm:items-center"
      title="Language switching is currently pinned to English."
      aria-label="Language: English"
    >
      EN
    </button>
  );
}

// TODO: Wire the legacy assets/i18n dictionaries into next-intl or a typed locale loader.
