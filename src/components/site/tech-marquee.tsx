const STACK = [
  "Lua",
  "fxmanifest",
  "client / server",
  "events",
  "callbacks",
  "ox_lib",
  "ox_target",
  "QBCore",
  "ESX",
  "Qbox",
  "oxmysql",
  "NUI",
  "entities & peds",
  "vehicles",
  "handling",
  "txAdmin",
  "server.cfg",
  "OneSync",
  "anti-cheat",
];

export function TechMarquee() {
  return (
    <section aria-label="What the course covers" className="border-b border-separator bg-secondary/30 py-10">
      <p className="mb-6 text-center font-mono text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
        Covers your whole FiveM stack
      </p>
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2.5 px-5">
        {STACK.map((t) => (
          <span
            key={t}
            className="rounded-full border border-separator bg-card px-4 py-2 text-sm font-medium text-ink-2 transition-colors hover:border-brand/60 hover:text-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}
