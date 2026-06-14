# Cloud Design — Master Redesign Prompt: FiveM School (Quasar Academy)

> Paste this whole document into Cloud Design as the system/context before redesigning **any** surface of this site — landing, track pages, the lesson template, cheatsheets, the paywall/pricing surface, and navigation. It is the single source of truth for brand, audience, the lesson anatomy, verified facts, and the design system. Per-page briefs (§6) override general rules for that page only.

---

## 0. The mission

FiveM School is a **free-to-read, beginner-first lessons website** that teaches people to run a FiveM server, write Lua/FiveM resources, and build the game world — on the visual bar of Linear, Vercel docs, and boot.dev. The product is **a learner who ships** (a server that boots, a script that runs, a feature that works), not "content consumed." The redesign must keep the site's genuinely strong editorial bones and fix what blocks learning.

Two lenses on every screen:
1. **10-second test** — a stranger can tell what this is, who it's for, and where to start.
2. **Lost-beginner test** — someone who just learned what a loop is always knows their next action and can *see and copy every command* a lesson tells them to run.

The site already does a lot right (see §5.4 "keep"). This is a **refinement + targeted-fix** redesign, not a teardown.

> **Content prerequisite (read first).** A corrected audit (`FIVEM-SCHOOL-AUDIT.md`) found that the live lesson source (`src/content/lessons/*.mdx`) currently renders **placeholder stubs** for ~10 lessons — generic "Step 1..5" titles and `proof check` code blocks — because the `html→mdx` converter dropped the real step bodies (the real content exists upstream in `clase-*`). **Redesigning a stub lesson ships nothing.** The lesson-template work in §5.4 assumes real content is present. The converter must be fixed (or the stubs authored) **before or alongside** the redesign. Track C and the Track-B pure-code lessons have real content today; Track A (7/8) and several Track-B capstones do not.

---

## 1. Audience

People who have done *a little* code (know variable / function / loop) but don't know Lua or FiveM. Three goal tracks, pick one:
- **Track A — Run a server** (server owners): install, txAdmin, server.cfg, dependencies, ship.
- **Track B — Write scripts** (developers): Lua core → resources → events → SQL → real features. *(The flagship: ~35 lessons, the strongest content.)*
- **Track C — Build the game world**: entities, vehicles, inventories, NUI/world.

Absolute beginners are routed to **Track B, Step 1**. Keep that nudge — make it more prominent (it's currently easy to miss).

Voice: expert, direct, encouraging, never condescending. Show, don't lecture. No hype, no em dashes or emoji in UI copy.

---

## 2. The #1 fixed bug the redesign must not reintroduce

Code blocks tagged `text`/`bash` (folder names, `ensure`/`restart` commands, `server.cfg` lines) were rendering **invisible — near-black text on the dark code panel** because the MDX `code` mapping routed non-`language-*` blocks through the inline-pill `text-foreground` style. ~5 of 7 blocks on the first lesson were blank. **Fixed** (mdx-components: treat any code with a `data-language` attr as a fenced block). Any redesign of the code-block component must guarantee **every** block — tokenized or plain — renders in the panel's light foreground, and that the panel hugs its content height (no tall empty boxes). Code is the dominant teaching element; if it's not legible, nothing else matters.

---

## 3. Verified facts pack (June 2026) — bake in; never reintroduce the stale versions

The content was fact-checked against the live 2026 FiveM ecosystem. Track B is already current; Tracks A/C have stale spots. Use these:

**Correct ✅**
- License keys: **Cfx.re Portal (portal.cfx.re)**, required even for local test servers. (Not "Keymaster.")
- **txAdmin ships bundled in FXServer**; runs on `localhost:40120` on first boot. Use the **"Recommended" (green)** artifact channel, not the top-of-list "Latest".
- **Lua 5.4 is the only runtime** (Lua 5.3 removed June 2025). **Do not add `lua54 'yes'`** — it's deprecated and ignored. (Track B teaches this correctly — propagate it everywhere.)
- **2026 framework reality:** ESX Legacy (`esx_core`, `getSharedObject`) = largest catalog, beginner-friendly. **Qbox** (`qbx_core`, direct exports, ox stack) = the **actively maintained successor** and a **one-click txAdmin recipe** — a fine beginner pick. **QBCore** (`qb-core`, `GetCoreObject`) = still works, large catalog, but development has largely stalled. → **Stop telling beginners "pick QBCore, avoid Qbox"** (Track A does this — it's backwards for 2026). Frame: ESX or Qbox for new servers; QBCore is legacy-but-usable.
- **txAdmin data path (2026):** `txData/<profile>/` with logs split into `logs/admin/`, `logs/fxserver/`, `logs/server/` (not `server-data/.txAdmin/data/...` / a single `fxserver.log`). Keep the "path can move — search for it" fallback.
- **ox stack is the default:** `ox_lib` (install via the **release zip**, `@ox_lib/init.lua` shared_script), `ox_inventory`, `ox_target`, `oxmysql` (parameterized `?`, `.await` variants, `mysql_connection_string` + `mysql_slow_query_warning`). Docs: **overextended.dev** (coxdocs.dev redirects there as of 2026).
- **ox_lib callback signature:** `lib.callback.register(name, cb)` — **no `false` arg**. Client: `lib.callback(name, false, cb, ...)` / `lib.callback.await(name, false, ...)` (there `false` is the throttle). Server: `lib.callback(name, playerId, cb, ...)`. Server notify: `TriggerClientEvent('ox_lib:notify', source, data)`.
- **resmon** is a **client F8** tool (`resmon true`); server profiling = `profiler` / txAdmin. Server main thread ~20 TPS; OneSync scope ~424m; `SetRoutingBucketEntityLockdownMode` takes **string** modes `'strict'|'relaxed'|'inactive'` (no numeric 0/1).
- **`SetNuiFocus(hasKeyboardFocus, hasCursor)`** — arg1 = keyboard/input, arg2 = cursor. (Track C's nui-advanced has it backwards — fix.)
- **`sv_enforceGameBuild`**: don't pin a stale 2024 build (3258); use a current build or a `<latest-tested-build>` placeholder with a pointer to the live build list so it can't silently rot.

**Outdated/wrong ❌ (purge):** "Keymaster", "install txAdmin separately", `lua54 'yes'` as a fix, "QBCore for beginners / avoid Qbox", dated `.txAdmin/data` paths, `SetNuiFocus(cursor, input)`, pinned old game build 3258, `lib.callback.register(name, false, …)`, fabricated benchmark tables presented as measured (relabel as illustrative).

**Freshness is the product moat.** Competitors' #1 weakness is silently-stale tutorials. Add a per-lesson **"Verified 2026 · Lua 5.4 · ox_lib 3.x"** badge + a last-verified date (render from lesson frontmatter). This is the single biggest trust differentiator.

---

## 4. Design system

### 4.1 Keep the current language (it has equity — refine, don't replace)
Editorial-minimal, **light-first with strong dark mode**, monochrome + a single **teal/cyan accent (~#0fb6c4)**. Geometric/grotesk sans for headings (heavy, tight, large editorial H1), **monospace for eyebrows/metadata labels** (TRACK B, MODULE 01 · LESSON 01, YOU'LL BUILD/TIME/YOU NEED). Generous whitespace, ~720px reading column, 1px hairline dividers, **no gradients, no default shadows**. Dark editor-style code panels. This reads premium (Linear/Vercel-docs tier) — preserve the discipline.

### 4.2 Foundations
- OKLCH tokens; 60/30/10 (neutral-dominant, teal reserved for primary action + active state). Full light/dark parity. **Devs read in dark — dark mode must be first-class.**
- Motion: transform/opacity only, **≤200ms**, no `transition-all`, respect `prefers-reduced-motion`.
- Code panels: light foreground on dark panel **for every block** (§2), syntax highlighting for all languages used (lua, bash, sql, js, yaml, html), panel height hugs content, **one-click copy**, and a **meaningful language/file label** ("server.cfg", "fxmanifest.lua", "console / F8", "folder") instead of the generic "text".

### 4.3 Anti-slop (auto-reject)
Purple gradients; blur abuse; drop-shadow soup; >200ms or `transition-all`; centered-everything; monotonous identical-card stacks; generic AI hero; em dashes/emoji in copy; default Tailwind palette; **any illegible code block**.

---

## 5. Per-surface briefs

### 5.1 Landing (`/`)
- Keep the **three-track cards** (icon, "pick if", "you finish with", step count, CTA) — a beginner self-routes in seconds. Keep the "new to all of this → Track B, Step 1" nudge but **promote it to the dominant primary CTA**; make the three track cards the secondary "choose your goal" layer (today three equal "Start at step 1" pills compete — no clear primary).
- Add one **beginner-reassurance line** in the subhead: "Never written Lua? You only need to have seen a variable and a function before. Start at Track B, Step 1."
- Keep the "covers your whole FiveM stack" tag cloud (Lua, fxmanifest, ox_lib, ox_target, Qbox, ESX, oxmysql, txAdmin, OneSync…) — current, credible 2026 signaling.

### 5.2 Navigation
Align top-nav to the three advertised tracks. Today nav (Roadmap, Server, Resources, Templates, Discord) exposes only "Server" — "Write scripts" and "Build the game world" have no entry, so the IA the landing teaches isn't in the nav. Use a **Roadmap dropdown grouping all three tracks** (Server / Scripts / Game World), or three explicit entries.

### 5.3 Track pages
Per-track overview: the track's outcome, who it's for, the module → lesson map with progress, and an unambiguous "Step 1" entry. Show each lesson's time estimate and freshness badge.

### 5.4 Lesson template (the core surface — keep its structure, fix the gaps)
**Keep (these are doing real pedagogical work):**
- The meta definition-list (YOU'LL BUILD / TIME / YOU NEED / YOU'LL LEARN, mono labels, hairline rows) — outcome-first, time-boxed, prereq-explicit.
- The **"BEFORE YOU START" readiness checklist** with checkboxes.
- The **"EXPECTED OUTPUT" callout** (left accent bar + mono) — the best implementation-teaching element on the site. **Expand it to every consequential step.**
- Numbered build-step structure (dark badges on a left rule, each with an "outcome" arrow-pill).
- The three-column layout (roadmap sidebar + content + "On this page" TOC), prev/next cards, Shiki highlighting.

**Add / fix:**
- **Every code block legible** (§2) with a meaningful label and a copy button. Tag shell blocks as `bash`, config as its filename.
- **`runs on: CLIENT / SERVER / SHARED` badge** on every FiveM code block, and a **reused client↔server diagram component** wherever events/natives cross the boundary (the #1 beginner confusion).
- **Per-lesson freshness badge** (§3) + prerequisite chips that link to the required prior lessons (by slug, not hardcoded "Lesson 19" numbers, which drift).
- **Visible per-lesson completion** (checkmarks driven by the checklist/exercise, persisted in localStorage) + a **"Mark complete & next"** button. Today progress is decorative.
- **"Common failures" as a 3-column table:** *exact console error string* | *cause* | *one-line fix* (e.g. `attempt to index a nil value (global 'QBCore')`). The literal text is what learners Ctrl-F — this is the most under-served, highest-retention feature, and no competitor does it well.
- For **pure-Lua lessons** (Track B basics), an embedded **runnable Lua sandbox** (a Wasmoon/Lua-5.4-WASM client island — the repo already ships `public/assets/lab/wasmoon.js`). FiveM-native lessons can't run in-browser — pair those with the "Expected console output" block instead.
- **Copy-paste correctness:** no `...` placeholders; include the `fxmanifest.lua` alongside any multi-file example so the resource starts on first try.

### 5.5 Cheatsheets (`/cheatsheets`)
Remove the **duplicated** "Pick the topic, open the lesson." heading+paragraph (renders twice). Keep the card grid.

### 5.6 Paywall / pricing (`/paywall`)
**Currently broken** — `/paywall` resolves to the home page; there is no real pricing/upgrade surface. Design an actual paywall/pricing page (free lessons as the funnel → paid tier), or intentionally redirect to a real pricing surface and fix any links pointing at `/paywall`. If lessons are gated, show a **lock indicator** on members-only lessons in the sidebar.

### 5.7 Remove the stray FAB
A dark circular "N" FAB floats bottom-left on every page with no label, overlapping the lesson reading column. Give it a clear purpose + aria-label and move it out of the reading column, or remove it.

---

## 6. Pre-launch checklist (Cloud Design self-check)
- [ ] Every code block — lua, bash, sql, plain — is legible (light on dark), labeled, copyable, height-hugging.
- [ ] Landing passes the 10-second test; one dominant primary CTA; beginner-reassurance line present; "new here → Track B Step 1" prominent.
- [ ] Nav reflects the three tracks.
- [ ] Lesson template keeps the meta list, readiness checklist, expected-output, numbered steps; adds CLIENT/SERVER badges, freshness badge, slug-based prereq links, persisted completion, and the error-string failures table.
- [ ] Light + dark parity; dark mode first-class; OKLCH; 60/30/10; motion ≤200ms; no anti-slop patterns.
- [ ] Every technical claim matches §3; freshness badges render; no `lua54 'yes'`, no "avoid Qbox", no Keymaster.
- [ ] `/cheatsheets` duplicate removed; `/paywall` is a real surface; stray FAB resolved.
- [ ] Mobile: single column, large copy buttons, sticky lesson/next control (mobile is already strong — keep it).

---

*End of master prompt. Refine the existing editorial system, fix §2/§3/§5 issues, and pass §6 before delivery.*
