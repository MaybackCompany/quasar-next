# Quasar School — Track A (Server-Owner) Audit
_Phase 1 of the dummy-proof + accuracy pass. 27 live lessons, adversarially verified. Date: 2026-06-24._

## Verdict summary

| Verdict | Count |
|---|---|
| accurate | 8 |
| minor-fixes | 15 |
| needs-rewrite | 4 |
| broken | 0 |
| **Total** | **27** |

**Needs-rewrite (4):** `artifacts-txadmin`, `qbcore-txadmin-first-server`, `first-fivem-server`, `artifact-update-sop`. All four fail for the same reason: they teach the green "recommended" build and/or pin-at-first-install, the exact pattern the locked artifact policy bans.

**Strongest lessons:** `server-security-baseline`, `installing-managing-scripts`, `fivem-error-catalog`, `deferrals-connection-queue`, `organize-server-folders`, `install-fivem-client`.

## Systemic issues (patterns across many lessons)

### 1. Artifact-policy violations (highest priority)
**Pattern:** lessons steer first-install readers to the green "recommended/optional" build (which lags behind) and tell them the top "Latest" build is unstable, and/or frame pinning a build as a first-install step. Locked policy is the opposite: install the LATEST build at the TOP of `runtime.fivem.net/artifacts/fivem/build_server_windows/master/` (Linux: `build_proot_linux/master/`); drop to the previous build only if a fresh one breaks; pinning is a later production-ops practice once live.

**Affected slugs:**
- `artifacts-txadmin` — title "Install pinned artifacts", Step 1 "pick from the Recommended (green) channel ... do not grab Latest"; pin/rollback file at first install; Recap and Prereq restate it. (whole lesson)
- `qbcore-txadmin-first-server` — line 39, "Download the latest recommended build (green label, not the top Latest which may be unstable)". Critically inverts the artifact layout. (verified real, high)
- `first-fivem-server` — Step 1, line 28, "Download the Recommended build (green label, NOT the top Latest)". (verified real, high)
- `artifact-update-sop` — built end-to-end on Recommended: Step 1 note `Channel: Recommended`; Step 3 "Swap in the Recommended build" (line 47-48); Common-failures "Always use the Recommended (green) channel. Latest can be unstable" (line 85); Recap "Update on Recommended". (3 verdicts verified real, high)
- `shipping` — Common-failures "txAdmin will not open" fix says "Use the Recommended (green) artifact channel". (policy conflict)
- `player-permissions-frameworks` — Common-failures line 295, "Update to the current Recommended build from runtime.fivem.net". (verified real, high)
- `fivem-2026-orientation` — Step 3 / Section 3 introduce pin-the-build + rollback-record at the planning/first-install stage; never gives the canonical artifact URLs.

**Fix:** rewrite every artifact instruction to "latest build at the top of the list, fall back to the previous build only if it breaks". Strip "Recommended channel" framing. Move all pin/rollback guidance to a dedicated post-launch lesson.

### 2. `licensekey:` prefix bug
**Pattern:** lessons show the config value with a literal `licensekey:` prefix. A real Cfx.re key is pasted verbatim and already begins with `cfxk_`; the correct line is `sv_licenseKey "cfxk_..."`. The prefixed form is malformed and the server rejects the license.

**Affected slugs:**
- `server-cfg` — line 300 Common-failures row, `sv_licenseKey "licensekey:cfxk_..."`. (verified real, high; contradicts the lesson's own line 50)
- `qbcore-txadmin-first-server` — line 53, "Copy the license key — it starts with `licensekey:`".
- `first-fivem-server` — Step 2, line 44, "The key looks like: `licensekey:cfxk_xxxx`".

**Fix:** show `sv_licenseKey "cfxk_..."` with no prefix everywhere.

### 3. Stray XAMPP troubleshooting tables
**Pattern:** a "Common failures" table tells the reader to open the XAMPP Control Panel / edit XAMPP `my.ini`, but the lesson actually installed standalone MariaDB as a Windows service. There is no XAMPP control panel, green light, or `my.ini` on their machine, so the fix is unactionable.

**Affected slugs:**
- `tools-and-database` — lines 220-226, XAMPP table contradicting the Step 5 MariaDB-service install. (verified real, high)
- `artifacts-txadmin` — line 200, "Check XAMPP MySQL is started (green)" against a MariaDB/HeidiSQL stack.
- `qbcore-txadmin-first-server` — teaches XAMPP + phpMyAdmin as the DB path with no "why a database" explanation (a different, but XAMPP-flavored, inconsistency).

**Fix:** delete the XAMPP tables; the correct MariaDB-service fixes already exist in each lesson's `<FailureList>` (start the MariaDB Windows service; stop the conflicting service for a port-3306 clash).

### 4. OneSync framed as legacy/optional
**Pattern:** `onesync on` is the modern default and is required for >32 slots (up to 2048). Lessons either warn readers away from "set onesync on" lines, omit OneSync from the cfg, or use muddled slot-threshold wording, leaving beginners thinking the modern setting is outdated.

**Affected slugs:**
- `fivem-2026-orientation` — "Do not copy old `set onesync on` lines"; OneSync only in the dependency map, never defined.
- `ddos-proxy-networking-basics` — "32-plus slots need OneSync, and above 64 you must run onesync on" implies a phantom 33-64 band.
- `first-fivem-server` / `shipping` — `onesync on` appears in cfg with zero explanation.

**Fix:** state once, plainly: the vanilla ceiling is 32 slots; to go above it enable `onesync on`, which is the modern default (supports up to 2048). Only `onesync legacy/off` is legacy.

### 5. Undefined jargon on first use
**Pattern:** load-bearing terms are used before any inline plain-English definition. Aggregated most-common offenders across the 27 lessons:

| Term | Lessons (sample) |
|---|---|
| OneSync | fivem-2026-orientation, qbcore-txadmin-first-server, first-fivem-server |
| recipe / txAdmin recipe | fivem-2026-orientation, qbcore-txadmin-first-server |
| ACE / principal / object | fivem-2026-orientation, server-cfg, server-cfg-annotated, txadmin-tour, convars-server-cfg, server-security-baseline, shipping, anti-cheat-evaluation-matrix |
| ensure | server-cfg, txadmin-tour, server-security-baseline |
| convar | tools-and-database, server-cfg-annotated, fivem-error-catalog, server-security-baseline, voice-setup-troubleshooting, discord-community-ops-kit |
| exports | organize-server-folders, install-a-script-walkthrough, installing-managing-scripts, fivem-error-catalog |
| VPS | installing-managing-scripts, server-security-baseline |
| escrow / escrowed | fivem-2026-orientation, installing-managing-scripts |
| F8 console | fivem-2026-orientation, convars-server-cfg |
| fxmanifest.lua / cerulean | server-cfg, install-a-script-walkthrough |

**Fix:** a course-wide "define on first use" pass with a shared one-line gloss for each term.

### 6. Duplicate/contradictory troubleshooting blocks
**Pattern:** many lessons carry both a `<FailureList>` and a separate markdown "Common failures" table that overlap and sometimes contradict each other; the markdown table is consistently the lower-quality, error-carrying one. Affected: `install-fivem-client`, `tools-and-database`, `connect-restart`, `organize-server-folders`, `server-cfg-annotated`, `fivem-error-catalog`, `deferrals-connection-queue`, `player-permissions-frameworks`, `anti-cheat-evaluation-matrix`, `voice-setup-troubleshooting`, `clothing-eup-asset-policy`, `discord-community-ops-kit`, `database-backup-migration-sop`.
**Fix:** keep one block per lesson (the `<FailureList>`), fold in any unique rows, delete the redundant table.

### 7. ` ```bash ` fences on FiveM console commands
**Pattern:** in-game F8 / txAdmin Live Console / FXServer commands (`status`, `restart chat`, `connect 127.0.0.1:30120`) are fenced as ` ```bash ` instead of ` ```text `, mislabeling them as shell commands. Affected: `artifacts-txadmin` (lines 139-147), `txadmin-tour`.
**Fix:** use ` ```text ` (or a console label) for console input.

## Keymaster vs portal.cfx.re — NEEDS A DECISION

The auditors split on the canonical home for `sv_licenseKey`. Several lessons currently call Keymaster "obsolete" or assert `keymaster.fivem.net` "was retired on 1 December 2025 and no longer works", routing readers exclusively to `portal.cfx.re`.

**Position A (most auditors):** the long-standing canonical key generator is `keymaster.fivem.net`, still live and still referenced by official docs and community guides. Calling it "obsolete" risks misleading beginners who land on it; both should be named as the same Cfx.re system.

**Position B (one web-verified verdict on `server-cfg-annotated`):** Cfx.re publicly announced a Keymaster-to-Portal migration dated 1 December 2025, and `portal.cfx.re` is now the current home for license keys; the lesson reflects the newer reality (the "no longer works" phrasing is just slightly too absolute, since keymaster still serves a sign-in/redirect page).

This is a factual fork the course owner must resolve before the rewrite, because the lessons must speak with one voice. The audit does not pick a side; it flags it for an owner decision.

## Per-lesson findings

| Lesson (slug) | Verdict | Proof? | Top issues (terse) |
|---|---|---|---|
| fivem-2026-orientation | minor-fixes | Yes | Pin/rollback at first install; OneSync framed as old; missing artifact URLs |
| install-fivem-client | accurate | Yes | Unsupported "4-10 GB" cache cite vs own "5 GB" check; duplicate troubleshooting |
| tools-and-database | minor-fixes | Yes | Stray XAMPP table vs MariaDB-service install (real, high); Keymaster framing |
| artifacts-txadmin | needs-rewrite | Yes | "Recommended (green) channel" + pin-at-first-install throughout; XAMPP row |
| qbcore-txadmin-first-server | needs-rewrite | Yes | Green build called stable / top called unstable (real, critical); `licensekey:` prefix |
| server-cfg | minor-fixes | Yes | `licensekey:` prefix in failures row (real, high); unverified "lua54 deprecated"; ensure undefined |
| txadmin-tour | minor-fixes | Yes | Claims nonexistent `rconlog` resource provides built-in `status` (real, high); dense Step 6 |
| connect-restart | minor-fixes | Yes | nui-storage cache misdirection for stale code; duplicate troubleshooting |
| organize-server-folders | accurate | Yes | Overstated "first one wins" on dup names; duplicate failure sections |
| server-cfg-annotated | minor-fixes | Yes | "sets for secrets" + sv_hostname-as-setr both wrong (real, critical); keymaster retired claim |
| install-a-script-walkthrough | accurate | Yes | exports/framework/convar undefined; imprecise manifest-format date |
| fivem-error-catalog | accurate | Yes | Duplicate troubleshooting table; native/export/event/convar undefined |
| installing-managing-scripts | accurate | Yes | escrow/VPS/exports undefined; some repetition |
| first-fivem-server | needs-rewrite | Yes | Green "Recommended" at first install (real, high); false "browser list" promise (real, high); `licensekey:` prefix |
| convars-server-cfg | minor-fixes | Yes | "lua54 deprecated" flagged but verified FALSE (lesson is correct); key-rotation URL nit |
| shipping | minor-fixes | Yes | "Recommended green channel" in failures fix; portal vs keymaster; mysqldump/mariadb-dump mismatch |
| deferrals-connection-queue | accurate | Yes | Duplicate troubleshooting table; soft timing numbers; deferral/yield undefined |
| player-permissions-frameworks | minor-fixes | Yes | "Update to Recommended build" (real, high); off-topic Discord/roles.ts rows; license-vs-fivem id drift |
| server-security-baseline | accurate | Yes | convar/rotate/ensure undefined; red-flag code abstract for non-coders |
| ddos-proxy-networking-basics | minor-fixes | Yes | Dated/absolute lua54 claim; muddled OneSync slot thresholds; dense network section |
| artifact-update-sop | needs-rewrite | Yes | Entire SOP built on green "Recommended"; "Latest is risky exception" (3 verdicts real, high) |
| anti-cheat-evaluation-matrix | minor-fixes | Yes | Duplicate failure sections; ACE dropped only in final table; no worked example |
| incident-log-runbook | minor-fixes | Yes | Mis-cased sv_maxClients example; link-rot-prone GitHub ref; one dense paragraph |
| voice-setup-troubleshooting | minor-fixes | Yes | Self-contradicts: tells default users to find separate Mumble server on its own port (real, high); F11 default unverified |
| clothing-eup-asset-policy | minor-fixes | Yes | Failures table says list stream assets in `files {}` + fix overrides via peds.meta (both real, high, contradict body) |
| discord-community-ops-kit | minor-fixes | Yes | Proof + failures table promise welcome-bot/moderation/template never taught; runbook/webhook undefined |
| database-backup-migration-sop | minor-fixes | Yes | Broken Windows path `C:ackups\` (real, high); mariadb-dump vs mysqldump drift; duplicate failures |

Note: the `convars-server-cfg` and one `server-cfg-annotated` lua54/keymaster items were adversarially verified as FALSE positives (the lesson text is correct); they are listed for transparency and should NOT be "fixed".

## Curriculum gaps (missing topics owners actually use)

| Topic | Why it matters | Priority |
|---|---|---|
| Choosing a host vs self-hosting (VPS specs, single-thread CPU, RAM, location/latency, OVH/managed hosts) | Every owner's first real decision; FiveM is single-thread-bound so clock speed beats cores, and host location drives ping. Course teaches install but never how to pick the box. | high |
| Performance basics for owners (resmon, server thread/ms budget, txAdmin perf charts, finding the hitching resource) | resmon is the weekly diagnostic; "which script is killing my tick" is the #1 ops question. No owner-facing profiling lesson exists. | high |
| Whitelist & application systems (Discord-role whitelist, identifiers, application flow) | Near-universal on serious RP servers and tied to the deferrals/identifiers material; deferrals lesson stops short of the actual pattern owners ship. | high |
| Tebex monetization + Cfx.re Platform Server Agreement rules | Tebex is the official route and the agreement governs what you may sell; getting it wrong gets servers banned. No lesson covers store setup or legal guardrails. | high |
| Game-build pinning as a LIVE production practice (sv_enforceGameBuild, when to pin post-launch, rollback on a broken update) | Policy ALLOWS pinning once live, but pinning currently appears only as the FORBIDDEN first-install behavior. The legitimate version of this skill is missing entirely. | high |
| Staff/admin team management (txAdmin admin accounts vs in-game ACE admin, role tiers, audit/accountability) | Servers with players need scoped staff powers; the primitives are taught but never the actual staff-team workflow. | medium |
| Player growth & server discovery (cfx.re list visibility, hostname/tags/banner, Discord launch) | A technically perfect empty server is a common failure mode; course ends at a joinable server, never getting players to it. | medium |
| Worked performance/optimization example for streamed assets & heavy resources (asset budgets, streaming limits, slot vs perf tradeoffs) | Streaming/slots are touched but there's no consolidated lesson on keeping a content-heavy server performant, where growing servers first break. | low |

## Broken / structural

- **Broken curriculum links (404s):** `curriculum.ts` references two slugs with no live MDX file: `txadmin-recipe` and `server-cfg-endpoints-ports`. Both resolve to 404. Either author the lessons or remove the references.
- **Dead duplicate directory:** `src/content/lessons` (137 files) is NOT loaded by the lesson route, which reads from `content/lessons/`. Flag the duplicate dir for cleanup to avoid editing the wrong copy.

## Prioritized fix plan

### P0 — accuracy (breaks servers / wrong facts)
- **Artifact policy** — rewrite to "latest build at top of list, fall back to previous only if it breaks; pinning is post-launch only" in: `artifacts-txadmin`, `qbcore-txadmin-first-server`, `first-fivem-server`, `artifact-update-sop`, `shipping`, `player-permissions-frameworks`, `fivem-2026-orientation`.
- **`licensekey:` prefix** — change to `sv_licenseKey "cfxk_..."` (no prefix) in: `server-cfg` (line 300), `qbcore-txadmin-first-server` (line 53), `first-fivem-server` (Step 2, line 44).
- **XAMPP tables** — delete the XAMPP "Common failures" tables, keep the MariaDB-service `<FailureList>`: `tools-and-database` (220-226), `artifacts-txadmin` (200).
- **rconlog/status error** — `txadmin-tour` (line 43): `status` is a built-in FXServer command, not provided by any `rconlog` resource. Reword.
- **nui-storage cache misdirection** — `connect-restart` (line 208): stop telling readers to wipe `nui-storage` for stale server-side code; reframe to "confirm the file saved, you restarted the right resource, then reconnect".
- **Additional P0-grade factual errors surfaced by verification:** `server-cfg-annotated` "use `sets` for secrets" + sv_hostname-as-setr (publishes secrets to the public list); `voice-setup-troubleshooting` "separate Mumble server on its own port" for default internal-Mumble installs; `clothing-eup-asset-policy` failures table (`files {}` for stream assets, peds.meta override fix); `database-backup-migration-sop` broken path `C:ackups\` → `C:\backups\`.

### P1 — clarity for beginners
- Course-wide "define jargon on first use" pass (OneSync, recipe, ACE/principal/object, ensure, convar, exports, VPS, escrow, F8, fxmanifest/cerulean) with one shared gloss per term.
- Split dense walls into one-idea-per-sentence beats: `fivem-2026-orientation` (sections 13-19), `tools-and-database` (oxmysql convar block), `txadmin-tour` (Step 6), `ddos-proxy-networking-basics` (network section), `incident-log-runbook` / `database-backup-migration-sop` (Step 1/Step 4 walls).
- Dedupe troubleshooting: collapse every dual `<FailureList>` + "Common failures" table down to one block (13 lessons listed in systemic issue 6); remove off-topic rows (e.g. Discord/roles.ts in `player-permissions-frameworks`).
- ` ```bash ` → ` ```text ` on FiveM console commands: `artifacts-txadmin`, `txadmin-tour`.

### P2 — new content (separate from the rewrite)
- Author the high-priority gap topics: host vs self-hosting, owner performance/resmon, Discord-whitelist + applications, Tebex + Platform Server Agreement.
- Author a correct "pin the game build once live" production-ops lesson (`sv_enforceGameBuild` + post-launch rollback), the legitimate counterpart to the pinning the P0 rewrites strip out of first install.
