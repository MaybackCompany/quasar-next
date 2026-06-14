import { ArrowUpRight } from "lucide-react";

// Registry of FiveM / dev tools — brand-colored logo tile + name + blurb + official link.
// Add to this map to expose a new `id` to <TechLinks ids={[...]} /> in any lesson.
interface Tech {
  name: string;
  mark: string; // short monogram shown in the colored tile
  color: string; // brand color (tile background)
  href: string;
  blurb: string;
  linkLabel?: string;
}

const TECH: Record<string, Tech> = {
  fivem: { name: "FiveM", mark: "Fx", color: "#f40552", href: "https://fivem.net/", blurb: "The GTA V multiplayer platform your server runs on.", linkLabel: "fivem.net" },
  "fivem-docs": { name: "FiveM Docs", mark: "Fx", color: "#f40552", href: "https://docs.fivem.net/docs/", blurb: "Official scripting manual and server reference.", linkLabel: "docs.fivem.net" },
  natives: { name: "FiveM Natives", mark: "{}", color: "#c2185b", href: "https://docs.fivem.net/natives/", blurb: "The GTA V / FiveM function reference (search by name, check the CLIENT/SERVER badge).", linkLabel: "docs.fivem.net/natives" },
  cfxnatives: { name: "cfxnatives.dev", mark: "{}", color: "#7b1fa2", href: "https://cfxnatives.dev/", blurb: "A faster, searchable index of the same natives.", linkLabel: "cfxnatives.dev" },
  lua: { name: "Lua 5.4", mark: "Lua", color: "#000080", href: "https://www.lua.org/manual/5.4/", blurb: "The language your resources are written in. FiveM runs Lua 5.4.", linkLabel: "lua.org/manual/5.4" },
  qbcore: { name: "QBCore", mark: "QB", color: "#1f6feb", href: "https://docs.qbcore.org/qbcore-documentation/guides/windows-installation", blurb: "Legacy framework with a large ready-made catalog. Development has largely stalled.", linkLabel: "docs.qbcore.org" },
  esx: { name: "ESX Legacy", mark: "ESX", color: "#e0a82e", href: "https://docs.esx-framework.org/", blurb: "The largest script ecosystem, especially in the EU. Actively maintained.", linkLabel: "docs.esx-framework.org" },
  qbox: { name: "Qbox", mark: "Qbox", color: "#6c5ce7", href: "https://docs.qbox.re/", blurb: "The actively maintained, ox-native QBCore successor. A one-click txAdmin recipe.", linkLabel: "docs.qbox.re" },
  ox: { name: "Overextended (ox)", mark: "ox", color: "#16a34a", href: "https://overextended.dev/", blurb: "The 2026 standard libraries: ox_lib, ox_inventory, ox_target, oxmysql. Community-maintained, not official Cfx.re.", linkLabel: "overextended.dev" },
  oxmysql: { name: "oxmysql", mark: "ox", color: "#15803d", href: "https://overextended.dev/oxmysql", blurb: "The database connector every modern resource uses. Parameterized queries. Replaces mysql-async/ghmattimysql.", linkLabel: "overextended.dev/oxmysql" },
  "ox_lib": { name: "ox_lib", mark: "ox", color: "#16a34a", href: "https://overextended.dev/ox_lib", blurb: "The core UI, callback, and utility library nearly every modern resource depends on.", linkLabel: "overextended.dev/ox_lib" },
  "ox_inventory": { name: "ox_inventory", mark: "ox", color: "#16a34a", href: "https://overextended.dev/ox_inventory", blurb: "Slot-based inventory with metadata. Depends on oxmysql and ox_lib.", linkLabel: "overextended.dev/ox_inventory" },
  "ox_target": { name: "ox_target", mark: "ox", color: "#16a34a", href: "https://overextended.dev/ox_target", blurb: "Eye and zone targeting to interact with entities, players, and zones.", linkLabel: "overextended.dev/ox_target" },
  txadmin: { name: "txAdmin", mark: "tx", color: "#0ea5b7", href: "https://docs.fivem.net/docs/resources/txAdmin/", blurb: "The web panel that ships inside FXServer for running your server.", linkLabel: "docs.fivem.net/txAdmin" },
  cfxportal: { name: "Cfx.re Portal", mark: "Cfx", color: "#f40552", href: "https://portal.cfx.re/", blurb: "Where you generate your free server license key (replaced the old Keymaster).", linkLabel: "portal.cfx.re" },
  mariadb: { name: "MariaDB", mark: "M", color: "#003545", href: "https://mariadb.org/download/", blurb: "The database engine your server stores data in. Free, open source.", linkLabel: "mariadb.org/download" },
  heidisql: { name: "HeidiSQL", mark: "H", color: "#2d8a3e", href: "https://www.heidisql.com/download.php", blurb: "A free visual client for browsing and editing your MariaDB database.", linkLabel: "heidisql.com" },
  vscode: { name: "VS Code", mark: "VS", color: "#0078d4", href: "https://code.visualstudio.com/", blurb: "The free code editor most FiveM developers use.", linkLabel: "code.visualstudio.com" },
  "vscode-luals": { name: "Lua (sumneko)", mark: "Lua", color: "#000080", href: "https://marketplace.visualstudio.com/items?itemName=sumneko.lua", blurb: "The Lua language server: autocomplete and live error checks. Extension id sumneko.lua.", linkLabel: "marketplace · sumneko.lua" },
  "vscode-cfxlua": { name: "Cfx Lua IntelliSense", mark: "Cfx", color: "#16a34a", href: "https://marketplace.visualstudio.com/items?itemName=overextended.cfxlua-vscode", blurb: "Adds FiveM native definitions to the Lua server. Community, not official Cfx.re.", linkLabel: "marketplace · cfxlua-vscode" },
  visualstudio: { name: "Visual Studio", mark: "Vis", color: "#5c2d91", href: "https://visualstudio.microsoft.com/", blurb: "The full IDE for C#/.NET, not the lightweight editor. Most Lua/FiveM work uses VS Code.", linkLabel: "visualstudio.microsoft.com" },
  git: { name: "Git", mark: "git", color: "#f05032", href: "https://git-scm.com/", blurb: "The version-control system under GitHub. Clone, commit, pull, roll back.", linkLabel: "git-scm.com" },
  github: { name: "GitHub", mark: "GH", color: "#24292e", href: "https://github.com/", blurb: "Hosts your code and its history so you can roll back and deploy safely.", linkLabel: "github.com" },
  "github-desktop": { name: "GitHub Desktop", mark: "GH", color: "#6e40c9", href: "https://desktop.github.com/", blurb: "Use Git without the terminal: commit, push, and pull with buttons.", linkLabel: "desktop.github.com" },
  nodejs: { name: "Node.js", mark: "Js", color: "#5fa04e", href: "https://nodejs.org/", blurb: "JavaScript runtime for NUI builds and JS server scripts. FiveM defaults to Node 16; opt into 22 with node_version.", linkLabel: "nodejs.org" },
  "7zip": { name: "7-Zip", mark: "7z", color: "#1f2937", href: "https://www.7-zip.org/", blurb: "Free archiver for the .7z files FXServer artifacts ship in.", linkLabel: "7-zip.org" },
  winrar: { name: "WinRAR", mark: "WR", color: "#7b1fa2", href: "https://www.win-rar.com/", blurb: "Alternative archiver for .7z and .zip artifacts.", linkLabel: "win-rar.com" },
  winscp: { name: "WinSCP", mark: "SCP", color: "#2f7d32", href: "https://winscp.net/", blurb: "Free Windows SFTP/SCP client for moving files to a VPS.", linkLabel: "winscp.net" },
  mysql: { name: "MySQL", mark: "My", color: "#00758f", href: "https://www.mysql.com/", blurb: "Alternative DB engine. Prefer MariaDB: many FiveM scripts hit MySQL 8 compatibility issues.", linkLabel: "mysql.com" },
  tebex: { name: "Tebex", mark: "Tbx", color: "#41c4c3", href: "https://www.tebex.io/", blurb: "The official monetization platform for FiveM stores and server perks.", linkLabel: "tebex.io" },
  discord: { name: "Discord", mark: "Dc", color: "#5865f2", href: "https://discord.com/", blurb: "Where your community, support, and staff operations live.", linkLabel: "discord.com" },
};

function Tile({ t }: { t: Tech }) {
  return (
    <a
      className="tech-card"
      href={t.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        border: "1px solid var(--hairline)",
        borderRadius: 10,
        padding: 16,
        background: "var(--surface)",
        textDecoration: "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flex: "none",
          width: 40,
          height: 40,
          borderRadius: 9,
          background: t.color,
          color: "#fff",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: t.mark.length > 2 ? 11 : 14,
          letterSpacing: t.mark.length > 2 ? "0.02em" : "0",
        }}
      >
        {t.mark}
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "var(--fg)", fontFamily: "var(--font-head)" }}>
          {t.name}
          <ArrowUpRight size={13} style={{ color: "var(--muted)" }} />
        </span>
        <span style={{ display: "block", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5, marginTop: 3 }}>{t.blurb}</span>
        <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--accent-strong)", marginTop: 6 }}>
          {t.linkLabel ?? t.href}
        </span>
      </span>
    </a>
  );
}

/** Grid of tech cards by id. Usage in MDX: <TechLinks ids={["qbcore","esx","qbox"]} /> */
export function TechLinks({ ids }: { ids: string[] }) {
  const items = ids.map((id) => TECH[id]).filter(Boolean) as Tech[];
  if (!items.length) return null;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
        margin: "20px 0",
      }}
    >
      {items.map((t) => (
        <Tile key={t.name} t={t} />
      ))}
    </div>
  );
}

/** Single inline tech card. Usage: <TechLink id="mariadb" /> */
export function TechLink({ id }: { id: string }) {
  const t = TECH[id];
  if (!t) return null;
  return <div style={{ margin: "16px 0", maxWidth: 460 }}>{<Tile t={t} />}</div>;
}
