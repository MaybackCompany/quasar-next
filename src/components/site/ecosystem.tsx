import {
  Boxes,
  Car,
  CheckCircle2,
  Code2,
  MonitorPlay,
  PersonStanding,
  Radio,
  Terminal as TerminalIcon,
  Network,
  Server,
  type LucideIcon,
} from "lucide-react";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-brand-hi">
      {children}
    </span>
  );
}

const INNER: ReadonlyArray<{ label: string; Icon: LucideIcon }> = [
  { label: "Natives", Icon: Code2 },
  { label: "Entities", Icon: Boxes },
  { label: "Events", Icon: Radio },
];

const OUTER: ReadonlyArray<{ label: string; Icon: LucideIcon }> = [
  { label: "Peds", Icon: PersonStanding },
  { label: "Vehicles", Icon: Car },
  { label: "NUI", Icon: MonitorPlay },
];

interface Checkpoint {
  title: string;
  detail: string;
  Icon: LucideIcon;
}

const CHECKPOINTS: ReadonlyArray<Checkpoint> = [
  { title: "Server boots", detail: "txAdmin up, FXServer listening", Icon: Server },
  { title: "qu_hello started", detail: "ensure qu_hello → resource running", Icon: TerminalIcon },
  { title: "First proof printed", detail: "Hello, Los Santos! in the console", Icon: Code2 },
  { title: "Event round-trips", detail: "client → server → client fires", Icon: Network },
  { title: "Ped spawns", detail: "RequestModel, then CreatePed next to you", Icon: PersonStanding },
];

function CheckpointRow({ title, detail, Icon }: Checkpoint) {
  return (
    <figure className="flex w-full items-center gap-3 rounded-2xl border border-separator bg-card px-4 py-3">
      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-hi">
        <Icon className="size-4.5" aria-hidden />
      </span>
      <figcaption className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-[0.8rem] text-ink-2">{detail}</p>
      </figcaption>
      <CheckCircle2 className="size-4.5 shrink-0 text-emerald-500" aria-hidden />
    </figure>
  );
}

export function Ecosystem() {
  return (
    <section className="border-t border-separator">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <Eyebrow>The surface you&apos;ll master</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            One game world. Six APIs you touch every day.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-2">
            The FiveM path circles the same core: natives, entities, events, peds, vehicles, and NUI.
            Here is what your very first session actually unlocks.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          {/* Game-world APIs you touch every day */}
          <div className="rounded-3xl border border-separator bg-card p-6">
            <span className="inline-flex items-center rounded-2xl border border-brand/30 bg-brand-soft px-3 py-1.5 font-mono text-[0.7rem] font-semibold uppercase tracking-wide text-brand-hi">
              FiveM core
            </span>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[...INNER, ...OUTER].map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-separator bg-background/40 px-3 py-4 text-center"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-brand-soft text-brand-hi">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-[0.82rem] font-medium text-ink-2">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* First-session checkpoints */}
          <div>
            <p className="mb-3 font-mono text-[0.66rem] font-semibold uppercase tracking-wider text-ink-3">
              Your first session · checkpoints
            </p>
            <div className="flex flex-col gap-3">
              {CHECKPOINTS.map((c) => (
                <CheckpointRow key={c.title} {...c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
