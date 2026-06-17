import { FileCode2, Folder as FolderIcon, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-brand-hi">
      {children}
    </span>
  );
}

interface TreeRow {
  depth: number;
  icon: LucideIcon;
  label: string;
}

const TREE: ReadonlyArray<TreeRow> = [
  { depth: 0, icon: FolderIcon, label: "qu_hello" },
  { depth: 1, icon: FileCode2, label: "fxmanifest.lua" },
  { depth: 1, icon: FolderIcon, label: "client" },
  { depth: 2, icon: FileCode2, label: "main.lua" },
  { depth: 1, icon: FolderIcon, label: "server" },
  { depth: 2, icon: FileCode2, label: "main.lua" },
  { depth: 1, icon: FolderIcon, label: "shared" },
  { depth: 2, icon: FileCode2, label: "config.lua" },
];

interface ConsoleLine {
  text: string;
  tone?: "ok" | "brand" | "muted";
}

const CONSOLE: ReadonlyArray<ConsoleLine> = [
  { text: "> ensure qu_hello" },
  { text: "✔ Resource qu_hello started.", tone: "ok" },
  { text: "[script:qu_hello] Hello, Los Santos!", tone: "brand" },
  { text: "shared → server → client loaded in order.", tone: "muted" },
  { text: "Proof printed. Lesson passed.", tone: "muted" },
];

const TONE: Record<NonNullable<ConsoleLine["tone"]>, string> = {
  ok: "text-emerald-400",
  brand: "text-[#3dc9e7]",
  muted: "text-slate-400",
};

export function WorkWith() {
  return (
    <section className="border-t border-separator bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <Eyebrow>Real artifacts · not slides</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What you&apos;ll actually work with.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-2">
            A real resource folder and a real server console. Every lesson ends with output you can see.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-2">
          {/* Resource structure */}
          <div className="rounded-3xl border border-separator bg-card p-5">
            <p className="mb-3 font-mono text-[0.66rem] font-semibold uppercase tracking-wider text-ink-3">
              resources/qu_hello
            </p>
            <div className="font-mono text-sm">
              {TREE.map(({ depth, icon: Icon, label }, i) => (
                <div
                  key={`${i}-${depth}-${label}`}
                  className="flex items-center gap-2 py-1.5 text-ink-2"
                  style={{ paddingLeft: `${depth * 18}px` }}
                >
                  <Icon className="size-4 shrink-0 text-brand-hi" aria-hidden />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Console proof */}
          <div className="rounded-3xl border border-separator bg-[#0c1a1f] p-5 font-mono text-[0.82rem] leading-relaxed text-[#cfe7ea]">
            <div className="mb-4 flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </div>
            {CONSOLE.map((line) => (
              <p key={line.text} className={cn("py-0.5", line.tone && TONE[line.tone])}>
                {line.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
