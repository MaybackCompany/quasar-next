import {
  ArrowLeftRight,
  ArrowUpRight,
  Banknote,
  ClipboardList,
  HeartPulse,
  MapPin,
  Navigation,
  User,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@heroui/react";

import { Reveal } from "@/components/ui/reveal";

interface Template {
  title: string;
  builds: string;
  slug: string;
  tag: string;
  Icon: LucideIcon;
}

const TEMPLATES: ReadonlyArray<Template> = [
  { title: "Banking system", builds: "Deposit, withdraw, transfer, with a full NUI and server authority.", slug: "banking-system", tag: "NUI · SQL", Icon: Banknote },
  { title: "Trade system", builds: "Player-to-player item and money trade with a confirm UI.", slug: "trade-system", tag: "NUI", Icon: ArrowLeftRight },
  { title: "Configurable blips", builds: "Config-driven map blips you edit without touching logic.", slug: "configurable-blips", tag: "Config", Icon: MapPin },
  { title: "Ped system", builds: "Spawn interactive peds from commands, backed by SQL.", slug: "ped-system", tag: "SQL", Icon: User },
  { title: "NUI survey", builds: "A drop-in survey panel rendered inside the game.", slug: "nui-survey", tag: "NUI", Icon: ClipboardList },
  { title: "Teleport", builds: "Coordinate and menu teleports, the safe way.", slug: "teleport", tag: "Snippet", Icon: Navigation },
  { title: "Revive command", builds: "A standalone /revive with health, state, and cleanup.", slug: "revive-command", tag: "Snippet", Icon: HeartPulse },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-brand-hi">
      {children}
    </span>
  );
}

function TemplateCard({ template, index }: { template: Template; index: number }) {
  const Icon = template.Icon;
  return (
    <Reveal delay={0.1 + index * 0.05} className="h-full">
      <a href={`/templates/${template.slug}`} className="block h-full focus-visible:outline-none">
        <Card className="flex h-full flex-col rounded-3xl border border-separator bg-card p-6 transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-brand/60">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-brand-soft text-brand-hi">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="rounded-full border border-brand/30 bg-brand-soft px-2 py-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-wide text-brand-hi">
                {template.tag}
              </span>
            </div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{template.title}</h3>
            <p className="mt-2 flex-1 text-[0.88rem] leading-relaxed text-ink-2">{template.builds}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-hi">
              Open template <ArrowUpRight className="size-4" aria-hidden />
            </span>
        </Card>
      </a>
    </Reveal>
  );
}

export function TemplatesSnippets() {
  return (
    <section id="templates-snippets" className="border-t border-separator">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <Eyebrow>Templates &amp; snippets</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Copy-paste a working system, then make it yours.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-2">
            Full, drop-in FiveM scripts with server, client, and NUI code. Read the lesson to learn the why,
            then start from one of these to ship faster.
          </p>
        </div>
        <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((template, index) => (
            <TemplateCard key={template.slug} template={template} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
