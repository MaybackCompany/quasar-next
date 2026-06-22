export interface Lesson {
  num: string;
  title: string;
  blurb: string;
  slug: string;
  tag: string;
  bonus?: boolean;
}

export interface Module {
  num: string;
  title: string;
  desc: string;
  lessons: Lesson[];
}

export interface Path {
  id: "server" | "scripts" | "gameworld";
  flag: string;
  title: string;
  desc: string;
  startIf: string;
  firstProof: string;
  modules: Module[];
}

export interface LessonLookupEntry {
  lesson: Lesson;
  module: Module;
  path: Path | null;
  prev: Lesson | null;
  next: Lesson | null;
  index: number;
}

// Three goal tracks. Each lesson lives in exactly one track, ordered so each
// step only depends on steps before it. Pick a goal, start at step 1.
export const PATHS: Path[] = [
  {
    id: "server",
    flag: "Track A",
    title: "Run a server",
    desc: "You want to host and operate a FiveM server. Install it, stand up txAdmin, wire dependencies, keep secrets safe, and ship a launch.",
    startIf: "You want to own and run a server.",
    firstProof: "Players connect to your server.",
    modules: [
      {
        num: "A1",
        title: "Server setup from zero",
        desc: "Install the client and tools, stand up txAdmin, wire dependencies, and learn the restart loop.",
        lessons: [
          { num: "00", title: "Plan your first FiveM server", blurb: "Choose a hosting route, map the stack and dependencies, and define the first playable test before installing anything.", slug: "fivem-2026-orientation", tag: "Planning" },
          { num: "01", title: "Install the FiveM client", blurb: "Get FiveM installed and launching.", slug: "install-fivem-client", tag: "Setup" },
          { num: "02", title: "Install tools and database", blurb: "Editor, MySQL, and the tools every resource needs.", slug: "tools-and-database", tag: "Setup" },
          { num: "03", title: "Artifacts, txAdmin, recipe", blurb: "Download artifacts, open txAdmin, deploy a base recipe.", slug: "artifacts-txadmin", tag: "Setup" },
          { num: "Bonus", title: "QBCore + txAdmin: complete server setup", blurb: "XAMPP MySQL, artifacts, txAdmin recipe, HeidiSQL — every step for a framework server.", slug: "qbcore-txadmin-first-server", tag: "Setup", bonus: true },
          { num: "04", title: "server.cfg and dependencies", blurb: "ensure resources in the right order, wire dependencies.", slug: "server-cfg", tag: "Setup" },
          { num: "05", title: "The txAdmin tour", blurb: "Players, resources, console: the panels you live in.", slug: "txadmin-tour", tag: "Setup" },
          { num: "06", title: "Connect, restart, read console", blurb: "F8 console, direct connect, ensure vs restart.", slug: "connect-restart", tag: "Setup" },
          { num: "07", title: "Organize your server: folders and resources", blurb: "server vs server-data, [category] folders, and why load order follows folders.", slug: "organize-server-folders", tag: "Setup" },
          { num: "08", title: "A complete server.cfg, annotated", blurb: "A production server.cfg top to bottom, every line and section explained.", slug: "server-cfg-annotated", tag: "Setup" },
          { num: "09", title: "Install any script: the method", blurb: "Read the deps, install them first, import the SQL, ensure in order, restart.", slug: "install-a-script-walkthrough", tag: "Setup" },
          { num: "Bonus", title: "Install any FiveM resource (checklist)", blurb: "The systematic method: read README, check deps, place folder, configure, restart, test.", slug: "install-fivem-resource", tag: "Setup", bonus: true },
          { num: "10", title: "Reading and fixing common errors", blurb: "The console errors every beginner hits: what each means and the fix.", slug: "fivem-error-catalog", tag: "Debugging" },
          { num: "11", title: "Installing and managing scripts", blurb: "Drop in a downloaded or bought script, load it in order, refresh and test.", slug: "installing-managing-scripts", tag: "Setup" },
          { num: "Bonus", title: "How to make your first FiveM server", blurb: "The five-step minimal path: artifacts, license, server.cfg, start, join. No framework.", slug: "first-fivem-server", tag: "Setup", bonus: true },
        ],
      },
      {
        num: "A2",
        title: "Operate and ship",
        desc: "Run the server safely day to day: keep secrets out of the repo and pass a pre-launch checklist before real players arrive.",
        lessons: [
          { num: "08", title: "ConVars and secrets", blurb: "Keep webhook URLs and keys out of the repo with GetConvar.", slug: "convars-server-cfg", tag: "Security" },
          { num: "09", title: "Shipping: launch checklist", blurb: "Production server.cfg and the pre-launch sweep.", slug: "shipping", tag: "Ops" },
          { num: "10", title: "The connection flow: deferrals and queue", blurb: "playerConnecting, deferral cards, and gating who gets in.", slug: "deferrals-connection-queue", tag: "Ops", bonus: true },
          { num: "11", title: "Giving players permissions (ESX, QBCore, Qbox)", blurb: "ACE groups, add_principal, and admin/jobs in each framework.", slug: "player-permissions-frameworks", tag: "Permissions", bonus: true },
        ],
      },
      {
        num: "A3",
        title: "Operate, secure, and grow",
        desc: "Run the server like a pro: lock down security, survive attacks and updates, handle incidents, and grow the community. Reference deep-dives you return to.",
        lessons: [
          { num: "01", title: "Server security baseline", blurb: "Permissions, secrets, resource trust, webhook hygiene.", slug: "server-security-baseline", tag: "Security", bonus: true },
          { num: "02", title: "DDoS, proxy, and networking basics", blurb: "Why nobody can join, why it lags, what protection does.", slug: "ddos-proxy-networking-basics", tag: "Networking", bonus: true },
          { num: "03", title: "Artifact update SOP", blurb: "Pin, back up, update, test, roll back. Beat the support clock.", slug: "artifact-update-sop", tag: "Ops", bonus: true },
          { num: "04", title: "Choosing an anti-cheat", blurb: "Evaluate options without snake oil. Authority comes first.", slug: "anti-cheat-evaluation-matrix", tag: "Security", bonus: true },
          { num: "05", title: "Incident log runbook", blurb: "Capture, reproduce, classify, fix, record. No panic edits.", slug: "incident-log-runbook", tag: "Ops", bonus: true },
          { num: "06", title: "Voice setup and troubleshooting", blurb: "Proximity voice working, and the blockers that break it.", slug: "voice-setup-troubleshooting", tag: "Voice", bonus: true },
          { num: "07", title: "Clothing, EUP, and asset policy", blurb: "Add packs without tanking performance or licensing trouble.", slug: "clothing-eup-asset-policy", tag: "Assets", bonus: true },
          { num: "08", title: "Discord community ops kit", blurb: "Channels, roles, tickets, escalation, announcements.", slug: "discord-community-ops-kit", tag: "Community", bonus: true },
          { num: "09", title: "Database backups and migrations", blurb: "Dump, store off-box, migrate safely, and test the restore.", slug: "database-backup-migration-sop", tag: "Data", bonus: true },
        ],
      },
    ],
  },
  {
    id: "scripts",
    flag: "Track B",
    title: "Write scripts",
    desc: "You want to code. Start with the Lua language, build a resource, learn how the client and server talk, save data, then ship real features and production patterns.",
    startIf: "You are new to code, or you know a little Lua.",
    firstProof: "A console line your own resource prints.",
    modules: [
      {
        num: "B1",
        title: "Lua basics",
        desc: "The language first. Variables, conditionals, loops, functions, tables. No FiveM yet.",
        lessons: [
          { num: "Primer", title: "Debug class for beginners", blurb: "What nil, missing exports, and SQL errors actually mean. Optional, useful again later.", slug: "debug-class", tag: "Debugging", bonus: true },
          { num: "01", title: "Your first line of Lua", blurb: "Print to the server console. Variables, strings, the most-used function in Lua.", slug: "first-line-of-lua", tag: "Lua core" },
          { num: "Asset", title: "Your first asset: a command in the game", blurb: "Build a /bananas command that prints to the F8 console in-game. Client vs server, your first real resource.", slug: "first-asset-banana-command", tag: "Lua core" },
          { num: "02", title: "Variables, numbers, strings", blurb: "Store, change, combine. The three data types you use 95% of the time.", slug: "variables-numbers-strings", tag: "Lua core" },
          { num: "03", title: "If, else, elseif", blurb: "Conditions, comparison operators, and nil vs false.", slug: "if-else-elseif", tag: "Lua core" },
          { num: "04", title: "Loops: for, while, when to stop", blurb: "Repeat actions and why a loop without Wait freezes the server.", slug: "loops", tag: "Lua core" },
          { num: "05", title: "Functions", blurb: "Reuse logic instead of copy-paste. Arguments and return values.", slug: "functions", tag: "Lua core" },
          { num: "06", title: "Tables", blurb: "Arrays, dictionaries, nesting. Lua's everything structure.", slug: "tables", tag: "Lua core" },
          { num: "Bonus", title: "Choosing a runtime: Lua, JS, or C#", blurb: "Why Lua is the default, and when JavaScript or C# fit instead.", slug: "csharp-js-runtimes", tag: "Runtimes", bonus: true },
        ],
      },
      {
        num: "B2",
        title: "Your first resource",
        desc: "A resource is just a folder. Set up your editor, learn fxmanifest, the client/server/shared split, the dev loop, and how to deploy with Git.",
        lessons: [
          { num: "Setup", title: "Set up VS Code for FiveM", blurb: "Editor, Lua language server, and Cfx native autocomplete.", slug: "vscode-fivem-setup", tag: "Tooling" },
          { num: "07", title: "Anatomy of a resource", blurb: "fxmanifest.lua line by line.", slug: "anatomy-of-a-resource", tag: "Skeleton" },
          { num: "08", title: "Client, server, shared", blurb: "Why the split exists and the one rule you never break.", slug: "client-server-shared", tag: "Skeleton" },
          { num: "09", title: "Start, restart, stop: the dev loop", blurb: "ensure vs restart, reading the console as feedback.", slug: "dev-loop", tag: "Workflow" },
          { num: "10", title: "Version control with GitHub Desktop", blurb: "Git without a terminal. The safety net every pro uses.", slug: "github-desktop", tag: "Tooling", bonus: true },
          { num: "Deploy", title: "Localhost to VPS with Git", blurb: "Code on your PC, push, pull on the VPS, restart, with a rollback path.", slug: "git-localhost-to-vps", tag: "Workflow", bonus: true },
          { num: "Config", title: "Reading and editing a script's config.lua", blurb: "The Config table, what most scripts expose, and safe edits vs core logic.", slug: "script-config-files", tag: "Config", bonus: true },
        ],
      },
      {
        num: "B3",
        title: "Core concepts",
        desc: "Where code runs, how safe loops work, how natives are found, and why the server stays in charge.",
        lessons: [
          { num: "11", title: "Two worlds, one resource", blurb: "Client vs server. They cannot read each other's variables.", slug: "two-worlds", tag: "Mental model" },
          { num: "12", title: "CreateThread and Wait", blurb: "Background loops without freezing the server.", slug: "createthread-and-wait", tag: "Threading", bonus: true },
          { num: "13", title: "FiveM natives: the toolbox", blurb: "What a native is and how to find one in the docs.", slug: "natives-toolbox", tag: "Natives" },
          { num: "14", title: "Trust and authority", blurb: "The server must stay in charge, or cheaters win.", slug: "trust-and-authority", tag: "Security" },
        ],
      },
      {
        num: "B4",
        title: "Talking to the game",
        desc: "How code talks inside one side, across the network, and waits for an answer.",
        lessons: [
          { num: "15", title: "TriggerEvent: same-side", blurb: "A one-line pattern that keeps code clean.", slug: "trigger-event", tag: "Events" },
          { num: "16", title: "TriggerServer and TriggerClientEvent", blurb: "Crossing the wall, plus the source variable.", slug: "trigger-server-client-event", tag: "Events" },
          { num: "Bonus", title: "Latent events", blurb: "Streaming big payloads without overflow.", slug: "latent-events", tag: "Events", bonus: true },
          { num: "Bonus", title: "Cancelling events", blurb: "Stop an event before other handlers see it.", slug: "cancelling-events", tag: "Events", bonus: true },
          { num: "17", title: "ox_lib: notifications and UI", blurb: "Notifications, inputs, progress bars, and context menus.", slug: "ox-lib-notifications-ui", tag: "ox_lib" },
          { num: "Project", title: "Player survey form with ox_lib", blurb: "A /survey command that draws a free NUI form, then re-validates every answer server-side.", slug: "survey-command", tag: "ox_lib", bonus: true },
          { num: "18", title: "Callbacks", blurb: "Ask and wait for an answer with lib.callback.", slug: "callbacks", tag: "Callbacks" },
          { num: "Bonus", title: "State bags", blurb: "Shared state without events.", slug: "state-bags", tag: "State", bonus: true },
          { num: "Bonus", title: "Built-in resources: chat, spawnmanager, baseevents", blurb: "The stock resources every server runs and their hooks.", slug: "built-in-resources-chat-spawnmanager-baseevents", tag: "Built-ins", bonus: true },
        ],
      },
      {
        num: "B5",
        title: "Data that survives a restart",
        desc: "Talk to MySQL safely with oxmysql, then keep player data without smashing the database.",
        lessons: [
          { num: "19", title: "SQL from zero: oxmysql", blurb: "Parameterized queries, remember data safely.", slug: "sql-from-zero", tag: "SQL" },
          { num: "20", title: "Database with oxmysql (CRUD)", blurb: "CRUD without footguns, prepared statements, transactions.", slug: "oxmysql-crud", tag: "SQL" },
          { num: "21", title: "Persistence: cache and write-back", blurb: "Survive restarts without smashing the DB.", slug: "persistence", tag: "SQL" },
          { num: "Bonus", title: "Persistence without a database: the KVS", blurb: "SetResourceKvp/GetResourceKvp for small state with no SQL.", slug: "kvs-no-database-persistence", tag: "SQL", bonus: true },
          { num: "22", title: "HeidiSQL hands-on", blurb: "Navigate HeidiSQL, run a table, import a script's SQL, and see a script's writes land.", slug: "heidisql-hands-on", tag: "SQL" },
        ],
      },
      {
        num: "B6",
        title: "Build real features",
        desc: "Use frameworks, then build commands, menus, an economy, and a job system end to end.",
        lessons: [
          { num: "22", title: "Frameworks: QBCore, ESX and Qbox", blurb: "Player objects, money, jobs, shared patterns.", slug: "frameworks", tag: "Frameworks" },
          { num: "23", title: "/heal command: your first build", blurb: "Plan before coding. A command with a cooldown.", slug: "heal-command", tag: "Build" },
          { num: "24", title: "Teleport menu with ox_lib", blurb: "Locations, permission checks, cooldowns.", slug: "teleport-menu", tag: "Build" },
          { num: "25", title: "Mini banking capstone", blurb: "Balance checks, server validation, safe writes.", slug: "mini-banking-capstone", tag: "Capstone" },
          { num: "26", title: "Server-only banking and audit", blurb: "Persist balances, audit-log every transaction.", slug: "server-only-banking-audit", tag: "Capstone" },
          { num: "27", title: "Jobs framework", blurb: "Clock-in, grades, a payroll loop that never double-pays.", slug: "jobs-framework", tag: "Gameplay" },
          { num: "Bridge", title: "How scripts talk to frameworks", blurb: "Get the player object, money, and job in ESX, QBCore, and Qbox side by side.", slug: "how-scripts-talk-to-frameworks", tag: "Frameworks", bonus: true },
          { num: "Project", title: "Player-to-player trade system", blurb: "Build a server-authoritative trade with ox_inventory: ownership + proximity checks, both-confirm, anti-dupe lock.", slug: "trade-system", tag: "Build", bonus: true },
        ],
      },
      {
        num: "B7",
        title: "Production patterns",
        desc: "The systems real servers need: webhooks, exports, async, OOP, performance, networking, anti-cheat, and disciplined debugging.",
        lessons: [
          { num: "28", title: "HTTP requests and webhooks", blurb: "PerformHttpRequest, Discord webhooks, JSON.", slug: "http-webhooks", tag: "HTTP" },
          { num: "29", title: "Exports across resources", blurb: "exports(name, fn), server vs client.", slug: "exports", tag: "Architecture" },
          { num: "30", title: "Promises and async", blurb: "promise.new, resolve, Citizen.Await.", slug: "promises", tag: "Async" },
          { num: "31", title: "OOP via metatables", blurb: "setmetatable, __index, the class pattern.", slug: "oop-metatables", tag: "Lua" },
          { num: "32", title: "Performance and profiling", blurb: "resmon, threads, the 0.5ms hot path.", slug: "performance-resmon", tag: "Performance" },
          { num: "33", title: "OneSync and routing buckets", blurb: "Cull distance, instancing, population.", slug: "network-onesync", tag: "Networking" },
          { num: "34", title: "Anti-cheat patterns", blurb: "Server-authority, rate limits, integrity.", slug: "anti-cheat", tag: "Security" },
          { num: "35", title: "Debugging like a developer", blurb: "Structured logging, pcall, the stop-and-collect checklist.", slug: "debugging-like-a-developer", tag: "Debug" },
          { num: "Bonus", title: "Voice scripting: proximity, channels, radio", blurb: "The mumble natives that build voice features, beyond config.", slug: "voice-scripting-natives", tag: "Voice", bonus: true },
        ],
      },
      {
        num: "B8",
        title: "Ship, sell, and maintain",
        desc: "Turn working code into a product: support, versioning, code review, UI quality, safe logging, licensing, and store compliance. Reference deep-dives.",
        lessons: [
          { num: "01", title: "Paid script support workflow", blurb: "Intake template, reproduction, triage, fix-and-release.", slug: "paid-script-support-workflow", tag: "Product", bonus: true },
          { num: "02", title: "Release notes and semantic versioning", blurb: "MAJOR.MINOR.PATCH, changelogs, tagged releases.", slug: "script-release-notes-semver", tag: "Product", bonus: true },
          { num: "03", title: "Production code review checklist", blurb: "Security, performance, correctness, on every change.", slug: "fivem-code-review-checklist", tag: "Quality", bonus: true },
          { num: "04", title: "NUI accessibility and performance", blurb: "Focus traps, resolution scaling, render cost, readability.", slug: "nui-accessibility-performance", tag: "NUI", bonus: true },
          { num: "05", title: "Webhooks and privacy", blurb: "Server-side only, redact data, rate-limit, split by severity.", slug: "webhooks-privacy-and-redaction", tag: "Security", bonus: true },
          { num: "06", title: "Resource licensing and escrow", blurb: "Open vs escrowed, buyer editing rights, protect your core.", slug: "resource-licensing-escrow", tag: "Business", bonus: true },
          { num: "07", title: "Build and grow a trustworthy Tebex store", blurb: "Store setup, package pages, test delivery, offers, growth tools, and a measured launch plan.", slug: "tebex-store-growth", tag: "Business", bonus: true },
          { num: "08", title: "Tebex compliance and refunds", blurb: "Refund policy, chargebacks, records, platform rules.", slug: "tebex-compliance-refunds", tag: "Business", bonus: true },
        ],
      },
      {
        num: "B9",
        title: "Migrations and identity",
        desc: "The big structural changes real servers face: player identity, swapping inventories, and moving frameworks without losing data.",
        lessons: [
          { num: "01", title: "Multi-character and identity systems", blurb: "License vs character id, and why everything keys off it.", slug: "multicharacter-identity-systems", tag: "Frameworks", bonus: true },
          { num: "02", title: "Inventory migration: QB, ESX, ox", blurb: "Move to ox_inventory without losing player items.", slug: "inventory-migration-qb-esx-ox", tag: "Migration", bonus: true },
          { num: "03", title: "QBCore to Qbox migration", blurb: "The ox stack, the bridge, and a staged cutover.", slug: "qbcore-to-qbox-migration", tag: "Migration", bonus: true },
        ],
      },
      {
        num: "B10",
        title: "Deep dives",
        desc: "Advanced techniques every serious FiveM developer needs: performance tuning, profiling, server hardening, State Bags, multi-threading, NUI from scratch, C# resources, OneSync adaptation, and routing buckets.",
        lessons: [
          { num: "01", title: "Improve your resource performance", blurb: "Distance checks, throttled loops, Wait tuning, and verifying your fix with resmon.", slug: "resource-performance-tune", tag: "Performance", bonus: true },
          { num: "02", title: "Use the profiler to find slow scripts", blurb: "Capture client and server profiles, read flame graphs, pinpoint the hot function.", slug: "profiler-command", tag: "Debugging", bonus: true },
          { num: "03", title: "Protect your server from common cheaters", blurb: "ConVars and ACE permissions that block explosions, ped spam, sound attacks, and teleporting.", slug: "server-hardening", tag: "Security", bonus: true },
          { num: "04", title: "How to use State Bags", blurb: "Set, get, and react to State Bag changes — share data between resources without events.", slug: "state-bags-patterns", tag: "State", bonus: true },
          { num: "05", title: "Multi-threading for advanced scripts", blurb: "Offload heavy computation to separate threads, use Citizen.SetTimeout for deferred work.", slug: "multithreading-patterns", tag: "Performance", bonus: true },
          { num: "06", title: "Create a basic FiveM script from zero", blurb: "The minimum files, a thread, a chat command, and a key-press detector.", slug: "first-resource-skeleton", tag: "Scripting", bonus: true },
          { num: "07", title: "Use NUI: create UI with HTML, CSS, and JS", blurb: "A full NUI overlay with two-way Lua↔JS messaging, SetNuiFocus, and NUICallback.", slug: "nui-html-css-js", tag: "NUI", bonus: true },
          { num: "08", title: "Setting up C# for FiveM resources", blurb: "When C# beats Lua, the .NET project setup, BaseScript lifecycle, and calling natives from C#.", slug: "csharp-resource-setup", tag: "Scripting", bonus: true },
          { num: "09", title: "Adapt your scripts to OneSync", blurb: "Entity ownership checks, scoped events, and the patterns that changed with OneSync.", slug: "onesync-migration", tag: "Networking", bonus: true },
          { num: "10", title: "How to use Routing Buckets", blurb: "Instanced worlds: assign players to buckets, lock them down, and return to default.", slug: "routing-buckets-patterns", tag: "Networking", bonus: true },
          { num: "11", title: "Build a FiveM carpack from scratch", blurb: "Full carpack structure: data/, stream/, audio/, handling, spawn codes, fxmanifest integration.", slug: "carpack-from-scratch", tag: "Assets", bonus: true },
          { num: "12", title: "Build FiveM UIs faster with fivem-ui-lib", blurb: "NUI simplified: .send() and .on() for Lua↔JS, built-in notifications, no boilerplate.", slug: "fivem-ui-lib", tag: "NUI", bonus: true },
          { num: "13", title: "Change vehicle handling like a pro", blurb: "Tune mass, traction, suspension, and top speed. Test in real-time with vehicleDebug.", slug: "vehicle-handling-tuning", tag: "Handling", bonus: true },
          { num: "14", title: "QBCore and txAdmin — your first server", blurb: "XAMPP MySQL, artifacts, txAdmin recipe, HeidiSQL — the complete beginner server path.", slug: "qbcore-txadmin-first-server", tag: "Setup", bonus: true },
          { num: "15", title: "Introduction to GitHub for FiveM developers", blurb: "Create a repo, commit, push, clone — the daily Git workflow every developer needs.", slug: "github-for-fivem", tag: "Workflow", bonus: true },
          { num: "16", title: "What is SQL? Your first queries", blurb: "SELECT, INSERT, UPDATE, DELETE — the four commands behind every database interaction.", slug: "sql-first-queries", tag: "SQL", bonus: true },
          { num: "17", title: "How to make your first FiveM server", blurb: "The five-step minimal path: artifacts, license, server.cfg, start, join. No framework needed.", slug: "first-fivem-server", tag: "Setup", bonus: true },
          { num: "18", title: "Understanding and fixing FiveM errors", blurb: "The debugging method: read the error, find the file and line, diagnose, fix one thing, test.", slug: "fivem-error-method", tag: "Debugging", bonus: true },
          { num: "19", title: "Add Discord rich presence to your server", blurb: "Show player count, server name, and custom art in Discord with a Join button.", slug: "discord-rich-presence", tag: "Integration", bonus: true },
          { num: "20", title: "Add-on vehicles: the complete process", blurb: "Every file type, every data_file line, spawn code — the definitive add-on vehicle guide.", slug: "addon-vehicles-detailed", tag: "Assets", bonus: true },
          { num: "21", title: "Map an interior and stream it in FiveM", blurb: "CodeWalker MLO creation, export YMAP/YTYP, fxmanifest streaming, and collision fixes.", slug: "map-interior-stream", tag: "Assets", bonus: true },
          { num: "22", title: "Stream add-on weapons and custom loadouts", blurb: "Weapon .yft/.ytd/, weapons.meta, GiveWeaponToPed, and inventory integration.", slug: "addon-weapons", tag: "Assets", bonus: true },
          { num: "23", title: "Stream add-on peds and custom characters", blurb: "Ped streaming, CreatePed, scenarios, guard tasks, and relationship groups.", slug: "addon-peds", tag: "Assets", bonus: true },
          { num: "24", title: "Custom loading screen with music", blurb: "Branded loading screen with logo, background, progress bar, rotating tips, and background music.", slug: "custom-loading-screen", tag: "NUI", bonus: true },
          { num: "25", title: "Install any FiveM resource correctly", blurb: "The checklist method: read README, check deps, place folder, configure, restart, test.", slug: "install-fivem-resource", tag: "Server Ops", bonus: true },
          { num: "26", title: "FiveM ACE permissions and principals", blurb: "Player → Group → Permissions: the complete ACE system from principals to wildcards.", slug: "ace-permissions", tag: "Permissions", bonus: true },
          { num: "27", title: "How to set up a FiveM server on Linux", blurb: "Ubuntu VPS from zero: artifacts, server.cfg, screen, firewall, and the modern stack.", slug: "linux-server-setup", tag: "Setup", bonus: true },
          { num: "28", title: "Using JSON in FiveM", blurb: "json.encode/decode, SaveResourceFile, LoadResourceFile, and multi-player data patterns.", slug: "json-in-fivem", tag: "Data", bonus: true },
          { num: "29", title: "Databases, oxmysql, and SQL importing", blurb: "MariaDB → oxmysql → FiveM chain, connection strings, .sql files, and the database workflow.", slug: "databases-oxmysql", tag: "SQL", bonus: true },
          { num: "30", title: "State Bags: what they are and why they matter", blurb: "Player/Entity/Global State Bags, replication, change handlers — modern shared state.", slug: "state-bags-deep", tag: "State", bonus: true },
        ],
      },
    ],
  },
  {
    id: "gameworld",
    flag: "Track C",
    title: "Build the game world",
    desc: "Make things happen in the world: interact with props and peds, spawn and clean up entities, build vehicle and inventory systems, and render in-game UI with NUI and React.",
    startIf: "You can write a resource and handle events (finish Track B basics first).",
    firstProof: "A spawned, customised, cleaned-up entity.",
    modules: [
      {
        num: "C1",
        title: "Interact and entities",
        desc: "Target props and peds, spawn entities safely, and clean up every handle you create.",
        lessons: [
          { num: "01", title: "ox_target: interact with anything", blurb: "Eye targeting on props, peds, vehicles.", slug: "ox-target-interactions", tag: "ox_target" },
          { num: "02", title: "Spawning entities safely", blurb: "Model loading, handles, a registry for objects, props, peds.", slug: "spawning-entities-safely", tag: "Entities" },
          { num: "03", title: "Cleanup discipline", blurb: "Delete on stop, drop, and timeout. No leaks.", slug: "cleanup-discipline", tag: "Cleanup" },
          { num: "Bonus", title: "Reading player input: controls and keys", blurb: "Control IDs, IsControlJustPressed, disabling keys, RegisterKeyMapping.", slug: "controls-and-input", tag: "Input", bonus: true },
          { num: "Bonus", title: "Blips, markers, and checkpoints", blurb: "Map icons, world markers, and standing-in-it detection.", slug: "blips-markers-checkpoints", tag: "World", bonus: true },
        ],
      },
      {
        num: "C2",
        title: "Vehicles and items",
        desc: "Spawn and modify vehicles, edit handling safely, build a garage, and shape an inventory.",
        lessons: [
          { num: "04", title: "Vehicles: spawn, modify, store", blurb: "Spawn patterns, network ownership, cleanup on timeout.", slug: "vehicles-spawn-modify-store", tag: "Vehicles" },
          { num: "05", title: "Handling basics and safe edits", blurb: "handling.meta with a Git revert path.", slug: "handling-basics", tag: "Handling" },
          { num: "06", title: "Vehicles and garages", blurb: "Plate as key, the spawn-store-retrieve loop.", slug: "vehicles-garages", tag: "Gameplay" },
          { num: "07", title: "Inventories", blurb: "Stack, weight, slot. The ox_inventory shape.", slug: "inventories", tag: "Gameplay" },
          { num: "08", title: "Creating items for ox and qs inventory", blurb: "data/items.lua, the icon, AddItem, and the qs-inventory equivalent.", slug: "creating-items-ox-qs-inventory", tag: "Items" },
        ],
      },
      {
        num: "C3",
        title: "Interfaces (NUI)",
        desc: "Render HTML UI inside the game, then scale it with a React and Vite setup.",
        lessons: [
          { num: "08", title: "NUI from scratch", blurb: "A Chromium overlay with two-way messages.", slug: "nui-from-scratch", tag: "NUI" },
          { num: "09", title: "NUI advanced: React and Vite", blurb: "SetNuiFocus, callbacks, the production React setup.", slug: "nui-advanced", tag: "NUI" },
          { num: "Bonus", title: "DUI: render HTML on 3D surfaces", blurb: "Paint a live webpage onto a prop or screen with CreateDui.", slug: "dui-3d-surfaces", tag: "NUI", bonus: true },
          { num: "Bonus", title: "Reskin a script's UI colors", blurb: "Change NUI colors safely: find the CSS, edit values not structure, refresh.", slug: "reskin-script-ui-colors", tag: "NUI", bonus: true },
        ],
      },
      {
        num: "C4",
        title: "World assets and optimization",
        desc: "Custom interiors and map mods make a server unique and crash it if done wrong. Add heavy streamed assets without melting frames.",
        lessons: [
          { num: "01", title: "MLO and map optimization", blurb: "Collisions, LODs, asset weight, and a QA pass under load.", slug: "mlo-map-optimization", tag: "Assets", bonus: true },
        ],
      },
    ],
  },
];

const LESSONS_WITH_CONTEXT = PATHS.flatMap((path) =>
  path.modules.flatMap((module) => module.lessons.map((lesson) => ({ path, module, lesson }))),
);
const BONUS_LESSONS = LESSONS_WITH_CONTEXT.filter(({ lesson }) => lesson.bonus);
const CORE_LESSONS = LESSONS_WITH_CONTEXT.filter(({ lesson }) => !lesson.bonus);

export const STATS = [
  { value: PATHS.length, label: "learning tracks" },
  { value: CORE_LESSONS.length, label: "core lessons" },
  { value: BONUS_LESSONS.length, label: "bonus deep-dives" },
  { value: 7, label: "project templates" },
] as const;

const LESSON_GROUPS: Array<{ path: Path | null; module: Module }> = PATHS.flatMap((path) =>
  path.modules.map((module) => ({ path, module })),
);

export const ORDERED_LESSONS: Lesson[] = LESSON_GROUPS.flatMap(({ module }) => module.lessons);

export const LESSON_LOOKUP: Record<string, LessonLookupEntry> = LESSON_GROUPS.reduce(
  (lookup, group) => {
    group.module.lessons.forEach((lesson) => {
      const index = ORDERED_LESSONS.findIndex((orderedLesson) => orderedLesson.slug === lesson.slug);
      lookup[lesson.slug] = {
        lesson,
        module: group.module,
        path: group.path,
        prev: ORDERED_LESSONS[index - 1] ?? null,
        next: ORDERED_LESSONS[index + 1] ?? null,
        index,
      };
    });

    return lookup;
  },
  {} as Record<string, LessonLookupEntry>,
);

export function getLessonLookup(slug: string): LessonLookupEntry | null {
  return LESSON_LOOKUP[slug] ?? null;
}
