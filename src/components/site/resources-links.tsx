import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  Code2,
  GraduationCap,
  Layers,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@heroui/react";

import { Reveal } from "@/components/ui/reveal";

interface ResourceLink {
  label: string;
  href: string;
  note?: string;
}

interface ResourceGroup {
  title: string;
  blurb: string;
  Icon: LucideIcon;
  links: ReadonlyArray<ResourceLink>;
}

const GROUPS: ReadonlyArray<ResourceGroup> = [
  {
    title: "Official FiveM",
    blurb: "The source of truth. Bookmark all of these.",
    Icon: BookOpen,
    links: [
      { label: "FiveM Docs", href: "https://docs.fivem.net/", note: "everything" },
      { label: "Scripting Manual", href: "https://docs.fivem.net/docs/scripting-manual/" },
      { label: "Native Reference", href: "https://docs.fivem.net/natives/", note: "searchable API" },
      { label: "Lua Runtime", href: "https://docs.fivem.net/docs/scripting-reference/runtimes/lua/" },
      { label: "NUI Development", href: "https://docs.fivem.net/docs/scripting-manual/nui-development/" },
      { label: "Game References", href: "https://docs.fivem.net/docs/game-references/" },
    ],
  },
  {
    title: "ox / Community",
    blurb: "The libraries most modern resources are built on.",
    Icon: Boxes,
    links: [
      { label: "coxdocs.dev", href: "https://coxdocs.dev/", note: "all ox docs" },
      { label: "ox_lib", href: "https://coxdocs.dev/ox_lib" },
      { label: "ox_target", href: "https://coxdocs.dev/ox_target" },
      { label: "ox_inventory", href: "https://coxdocs.dev/ox_inventory" },
      { label: "oxmysql", href: "https://coxdocs.dev/oxmysql" },
      { label: "communityox (GitHub)", href: "https://github.com/communityox" },
    ],
  },
  {
    title: "Frameworks",
    blurb: "Player object, jobs, money, metadata.",
    Icon: Layers,
    links: [
      { label: "Qbox Docs", href: "https://docs.qbox.re/" },
      { label: "qbx_core (GitHub)", href: "https://github.com/Qbox-project/qbx_core" },
      { label: "QBCore Docs", href: "https://docs.qbcore.org/" },
      { label: "ESX (GitHub)", href: "https://github.com/esx-framework" },
    ],
  },
  {
    title: "Lua language",
    blurb: "The language under every script.",
    Icon: Code2,
    links: [
      { label: "Lua 5.4 Reference", href: "https://www.lua.org/manual/5.4/" },
      { label: "Programming in Lua", href: "https://www.lua.org/pil/contents.html", note: "free book" },
    ],
  },
  {
    title: "Tools",
    blurb: "What you install to build and run a server.",
    Icon: Wrench,
    links: [
      { label: "txAdmin", href: "https://txadm.in/" },
      { label: "VS Code", href: "https://code.visualstudio.com/" },
      { label: "HeidiSQL", href: "https://www.heidisql.com/" },
      { label: "DBeaver", href: "https://dbeaver.io/" },
    ],
  },
  {
    title: "Community & guides",
    blurb: "Where to ask, search, and find more tutorials.",
    Icon: GraduationCap,
    links: [
      { label: "Cfx.re Forum", href: "https://forum.cfx.re/" },
      { label: "FiveM Cookbook", href: "https://cookbook.fivem.net/", note: "tutorials" },
      { label: "r/FiveM", href: "https://www.reddit.com/r/FiveM/" },
    ],
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-brand-hi">
      {children}
    </span>
  );
}

function GroupCard({ group, index }: { group: ResourceGroup; index: number }) {
  const Icon = group.Icon;
  return (
    <Reveal delay={0.1 + index * 0.06} className="h-full">
      <Card className="flex h-full flex-col rounded-3xl border border-separator bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-brand-soft text-brand-hi">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="text-lg font-semibold tracking-tight text-foreground">{group.title}</h3>
          </div>
          <p className="mb-4 text-[0.85rem] leading-relaxed text-ink-2">{group.blurb}</p>
          <ul className="mt-auto flex flex-col gap-1.5 border-t border-separator pt-4">
            {group.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center gap-1.5 rounded-lg px-1 py-1 text-[0.9rem] text-ink-2 transition-colors hover:text-brand-hi focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <ArrowUpRight className="size-3.5 shrink-0 text-ink-3 transition-colors group-hover/link:text-brand-hi" aria-hidden />
                  <span className="font-medium">{link.label}</span>
                  {link.note && <span className="text-[0.78rem] text-ink-3">· {link.note}</span>}
                </a>
              </li>
            ))}
          </ul>
      </Card>
    </Reveal>
  );
}

export function ResourcesLinks() {
  return (
    <section id="resources-links" className="border-t border-separator bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="text-center">
          <Eyebrow>Resources &amp; links</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything to go deeper, in one place.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-2">
            Official docs, the libraries real servers use, frameworks, the Lua language, and the tools you install.
            Open these as you work through the lessons.
          </p>
        </div>
        <div className="mt-12 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((group, index) => (
            <GroupCard key={group.title} group={group} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
