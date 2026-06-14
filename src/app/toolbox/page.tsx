import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/fqs/site-nav";
import { SiteFooter } from "@/components/fqs/site-footer";

export const metadata: Metadata = {
  title: "Toolbox · Resources & Links · FiveM School",
  description:
    "Every tool, doc, and resource worth bookmarking, sorted for server owners, developers, and mappers, with a note on what each one is actually for.",
};

interface ToolItem {
  label: string;
  href: string;
  use: string;
}
interface ToolGroup {
  title: string;
  items: ToolItem[];
}
interface Audience {
  id: string;
  letter: string;
  title: string;
  blurb: string;
  groups: ToolGroup[];
}

const AUDIENCES: Audience[] = [
  {
    id: "server-owners",
    letter: "A",
    title: "Server owners",
    blurb: "Host it, run it, secure it, and make money. Everything you reach for that is not writing code.",
    groups: [
      {
        title: "Hosting & infrastructure",
        items: [
          { label: "Goodleaf", href: "/server/goodleaf-hosting", use: "FiveM-optimized hosting with pre-configured txAdmin and one-click setup. Quasar partner." },
          { label: "Zap-Hosting", href: "https://zap-hosting.com", use: "Budget, instant FiveM deployment. Beginner-friendly for a first server." },
          { label: "Hetzner", href: "https://hetzner.com", use: "Best price/performance in the EU. A dedicated box for 64+ slots once you grow." },
          { label: "OVHcloud", href: "https://ovhcloud.com", use: "Enterprise dedicated servers and anti-DDoS for high player counts." },
          { label: "HostHavoc", href: "https://hosthavoc.com", use: "Game-focused hosting with FiveM support and DDoS protection." },
        ],
      },
      {
        title: "Run & manage",
        items: [
          { label: "txAdmin", href: "https://docs.fivem.net/docs/resources/txAdmin/", use: "The panel that ships in FXServer: deploy, monitor, auto-restart, and the built-in profiler." },
          { label: "FiveM artifacts", href: "https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/", use: "The server builds. Use the Recommended channel; keep them fresh (see the artifact SOP lesson)." },
          { label: "Cfx.re Portal", href: "https://portal.cfx.re/", use: "Generate your free server license key. This replaced the old Keymaster." },
          { label: "Cfx.re memberships", href: "https://portal.cfx.re/", use: "Paid tiers for extra slots, OneSync options, and early access." },
          { label: "MariaDB", href: "https://mariadb.org/download/", use: "The database engine your server stores everything in. Prefer it over MySQL." },
          { label: "HeidiSQL", href: "https://www.heidisql.com/download.php", use: "Free visual client to browse, edit, and back up your database." },
        ],
      },
      {
        title: "Security",
        items: [
          { label: "Server commands + ACE permissions", href: "https://docs.fivem.net/docs/server-manual/server-commands/", use: "Resource permissions (ACE), admin access, and the security-relevant server commands." },
          { label: "Backdoor awareness", href: "https://forum.cfx.re/", use: "Read before installing unknown scripts: known backdoor and obfuscation patterns." },
        ],
      },
      {
        title: "Monetization",
        items: [
          { label: "Tebex docs", href: "https://docs.tebex.io/", use: "Store setup, webhooks, in-game purchases, and integrations." },
          { label: "Tebex", href: "https://www.tebex.io/", use: "The monetization platform: storefront, payments, and payouts." },
        ],
      },
    ],
  },
  {
    id: "developers",
    letter: "B",
    title: "Developers",
    blurb: "Write, debug, and ship scripts. Docs, libraries, the tools you install, and the repos worth reading.",
    groups: [
      {
        title: "Official references",
        items: [
          { label: "FiveM docs", href: "https://docs.fivem.net/", use: "The source of truth for scripting, server, and networking." },
          { label: "Scripting manual", href: "https://docs.fivem.net/docs/scripting-manual/introduction/", use: "Resource lifecycle, runtimes, performance, and security patterns." },
          { label: "Native reference", href: "https://docs.fivem.net/natives/", use: "Every GTA V / FiveM function, with the CLIENT/SERVER badge." },
          { label: "cfxnatives.dev", href: "https://cfxnatives.dev/", use: "Faster, searchable native index (community, not official Cfx.re)." },
          { label: "Events reference", href: "https://docs.fivem.net/docs/scripting-reference/events/", use: "Built-in events like playerConnecting and resourceStarted." },
          { label: "Lua 5.4 manual", href: "https://www.lua.org/manual/5.4/", use: "The language under every script. FiveM runs Lua 5.4." },
          { label: "MDN Web Docs", href: "https://developer.mozilla.org/", use: "HTML/CSS/JS reference for building NUI interfaces." },
        ],
      },
      {
        title: "Frameworks & libraries",
        items: [
          { label: "Qbox docs", href: "https://docs.qbox.re/", use: "The actively maintained, ox-native QBCore successor. Start here for new builds." },
          { label: "qbx_core (GitHub)", href: "https://github.com/Qbox-project/qbx_core", use: "Read the architecture: how a modern core is structured." },
          { label: "QBCore", href: "https://github.com/qbcore-framework", use: "The largest legacy ecosystem. Study its resources for patterns." },
          { label: "ESX docs", href: "https://docs.esx-framework.org/", use: "The largest script catalog, strong in the EU. Actively maintained." },
          { label: "Overextended docs", href: "https://overextended.dev/", use: "ox_lib, ox_inventory, ox_target, oxmysql: the 2026 standard libraries." },
          { label: "ox_lib (GitHub)", href: "https://github.com/overextended/ox_lib", use: "Reference implementation of modern FiveM utility patterns." },
        ],
      },
      {
        title: "NUI frameworks",
        items: [
          { label: "React NUI boilerplate", href: "https://github.com/project-error/fivem-react-boilerplate-lua", use: "Battle-tested React + Lua NUI boilerplate from project-error." },
          { label: "fivem-ui-lib (Jax)", href: "https://github.com/Jax-Danger/fivem-ui-lib", use: "Simplifies NUI to Lua messaging with .send() and .on()." },
        ],
      },
      {
        title: "Tooling",
        items: [
          { label: "VS Code", href: "https://code.visualstudio.com/", use: "The editor. Pair with the Lua + Cfx Lua extensions (see the VS Code lesson)." },
          { label: "Lua (sumneko)", href: "https://marketplace.visualstudio.com/items?itemName=sumneko.lua", use: "Autocomplete and live error checking for Lua." },
          { label: "Cfx Lua IntelliSense", href: "https://marketplace.visualstudio.com/items?itemName=overextended.cfxlua-vscode", use: "Adds FiveM native definitions to the Lua server." },
          { label: "vehicleDebug", href: "https://github.com/kerminal/vehicleDebug", use: "Tweak vehicle handling live in-game." },
        ],
      },
      {
        title: "Study these repos",
        items: [
          { label: "QuasarUni UI/UX course", href: "https://github.com/PhyreDevelopment/QuasarUni-UI-UX-Course", use: "RED's UI/UX course materials, all sessions." },
        ],
      },
      {
        title: "AI dev tools",
        items: [
          { label: "Claude", href: "https://claude.ai", use: "Lua/JS/SQL debugging, script planning, config analysis, F8 error explanation." },
          { label: "GitHub Copilot", href: "https://github.com/features/copilot", use: "In-editor Lua/JS autocomplete and boilerplate." },
          { label: "ElevenLabs", href: "https://elevenlabs.io", use: "AI voiceovers for trailers, NPC dialogue, and radio stations." },
          { label: "Higgsfield AI", href: "https://higgsfield.ai", use: "Generate server trailers and short clips for marketing." },
        ],
      },
    ],
  },
  {
    id: "mappers",
    letter: "C",
    title: "Mappers",
    blurb: "Build custom interiors and map mods. Tools only here; pair them with the MLO and map optimization lesson.",
    groups: [
      {
        title: "Mapping toolchain",
        items: [
          { label: "Blender", href: "https://www.blender.org/", use: "The free 3D editor where you model and assemble maps." },
          { label: "Sollumz", href: "https://github.com/Sollumz/Sollumz", use: "Blender addon to create and export GTA V maps (.ymap, .ytyp, .ydr)." },
          { label: "CodeWalker", href: "https://github.com/dexyfex/CodeWalker", use: "The premier 3D map viewer and editor for GTA V. Place props and check collisions." },
          { label: "OpenIV", href: "https://openiv.com/", use: "Browse and extract original GTA V files to reference or reuse." },
        ],
      },
    ],
  },
];

function faviconFor(href: string): string | null {
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(href).hostname}&sz=64`;
  } catch {
    return null;
  }
}

function ToolCard({ item }: { item: ToolItem }) {
  const favicon = faviconFor(item.href);
  return (
    <li style={{ margin: 0 }}>
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          border: "1px solid var(--hairline)",
          borderRadius: 10,
          padding: "12px 14px",
          background: "var(--surface)",
          textDecoration: "none",
          height: "100%",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={18}
              height={18}
              style={{ flex: "none", borderRadius: 4, display: "block", background: "var(--surface-2)" }}
            />
          ) : null}
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--fg)", fontFamily: "var(--font-head)", fontSize: 14.5, minWidth: 0 }}>
            {item.label}
            <ArrowUpRight size={13} style={{ color: "var(--muted)", flex: "none" }} />
          </span>
        </span>
        <span style={{ display: "block", fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginTop: 5 }}>{item.use}</span>
      </a>
    </li>
  );
}

export default function ToolboxPage() {
  return (
    <div className="fqs">
      <SiteNav />
      <main className="wrap" style={{ paddingTop: 56, paddingBottom: 80 }}>
        <div style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>
            TOOLBOX · RESOURCES & LINKS
          </div>
          <h1 className="fqs-h" style={{ fontSize: "clamp(30px, 4.5vw, 44px)" }}>
            Every tool worth bookmarking, and what it's for.
          </h1>
          <p style={{ fontSize: 17, color: "var(--fg-2)", margin: "16px 0 0" }}>
            Sorted for how you actually work: running a server, writing scripts, or building maps. Each link has
            a one-line note on what it does so you are not guessing.
          </p>
        </div>

        {AUDIENCES.map((aud) => (
          <section key={aud.id} id={aud.id} style={{ marginTop: 48 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span className="tc-letter" aria-hidden="true">
                {aud.letter}
              </span>
              <div>
                <h2 className="fqs-h" style={{ fontSize: 24, color: "var(--fg)" }}>
                  {aud.title}
                </h2>
                <p style={{ fontSize: 14.5, color: "var(--muted)", margin: "2px 0 0", maxWidth: "70ch" }}>{aud.blurb}</p>
              </div>
            </div>

            {aud.groups.map((g) => (
              <div key={g.title} style={{ marginTop: 24 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>
                  {g.title}
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 10,
                  }}
                >
                  {g.items.map((item) => (
                    <ToolCard key={item.href + item.label} item={item} />
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}

        <SiteFooter />
      </main>
    </div>
  );
}
