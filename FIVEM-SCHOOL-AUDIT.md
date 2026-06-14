# FiveM School — Deep Audit (2026-06-11, corrected)

Two audit passes were run. The **first read the legacy `content/lessons/*.html`** (the converter's input) and was misleading. **This corrected version audits the LIVE rendered source — `src/content/lessons/*.mdx`** — which is what users actually see. Findings ranked by customer-acquisition impact (free-lessons → paid funnel: the content *is* the marketing).

---

## TL;DR (the headline changed)

- **The live site serves placeholder-stub lessons.** The `html→mdx` converter (`scripts/html-to-mdx.mjs`) is **dropping the real step bodies** and emitting generic `"Step 1".."Step 5"` titles with code blocks that literally say `proof check`, plus broken recaps ("Make the the setup folder"). Evidence for `install-fivem-client`: content-tags by layer = **87** (original `clase-00`) → **72** (stage-1 html) → **5 `proof check` stubs** (live `.mdx`). The real content exists upstream; the converter guts it.
- **Impact by track (live `.mdx`):** Track A practicality **2/10** (7 of 8 lessons are stubs), Track B **4.5/10** (good pure-code lessons, but `debug-class`/`github-desktop` are stubs and the banking/CRUD capstones don't implement what they promise), Track C **6/10** (8 of 9 sound; `handling-basics` is a stub).
- **The good news from the first pass still holds:** the stale-fact bugs it flagged (SetNuiFocus order, `lib.callback.register` signature, `enforceGameBuild 3258`, dated txAdmin paths, fabricated benchmarks) are **genuinely absent from the live `.mdx`** — those were legacy-`.html` artifacts. Live technical accuracy is mostly good where content exists.
- **The #1 fix is the converter, not authoring.** Repair `html-to-mdx.mjs`'s step extraction and re-run → real content returns to ~10 lessons at once. (Caveat: a re-run regenerates all 56 `.mdx`; see §Converter.)
- **Already fixed this session:** the invisible-code-block P0 (`mdx-components.tsx`), the `artifacts-txadmin` Qbox framing, and the duplicated `/cheatsheets` intro.

---

## Corrected scores (live `.mdx`)

| Track | Accuracy | Practicality | Visual | Note |
|---|---|---|---|---|
| A — Run a server | 5.5 | **2** | 4 | 7/8 lessons are stubs; only `convars-server-cfg` is complete |
| B — Write scripts | 6.5 | **4.5** | 6 | Pure-code lessons solid; stubs + capstones that don't deliver |
| C — Build the game world | 7.5 | **6** | 6.5 | Strongest track; only `handling-basics` is a stub |

*(The first pass scored A=7, B=9, C=5.5 off the legacy `.html` — disregard those.)*

---

## The converter bug (fix this first)

`scripts/html-to-mdx.mjs` converts `content/lessons/<slug>.html` → `src/content/lessons/<slug>.mdx` (committed, rendered). For a chunk of lessons it emits a **generic StepGroup stub** — `<Step num={N} title="Step N" outcome="The setup moves one checkpoint forward.">` with a `proof check` code block — instead of extracting the real steps/commands/expected-output that exist in the source HTML. It also generates nonsensical Recaps that bolt an `fxmanifest.lua/ensure` mental model onto setup/Git/ops lessons where it doesn't apply, and duplicates one generic `dbtest` SQL snippet across the banking/CRUD lessons.

**Confirmed stub lessons (live):** Track A — `install-fivem-client`, `tools-and-database`, `artifacts-txadmin`, `server-cfg`, `txadmin-tour`, `connect-restart`, `shipping` (all but `convars-server-cfg`). Track B — `debug-class`, `github-desktop`; plus `mini-banking-capstone`, `server-only-banking-audit`, `oxmysql-crud`, `jobs-framework` ship generic snippets that don't implement their stated outcome. Track C — `handling-basics`.

**Recommendation:** fix the converter's step/recap/code extraction and re-run, OR (if the converter is to be retired) author the stub lessons directly in `.mdx`. Either way this is the gate before any redesign — a beautiful redesign of stub lessons ships nothing. **Caveat:** re-running the converter regenerates all 56 `.mdx`, which would revert the 3 hand-fixes already applied and could alter the good lessons — so fix-and-diff carefully, or port fixes into the converter.

---

## Other confirmed issues in the live `.mdx` (real, present)

**Bugs (correctness):**
- `persistence.mdx` — `INSERT … ON DUPLICATE KEY UPDATE` against a table whose only key is `id AUTO_INCREMENT PRIMARY KEY` **never fires the UPDATE** (no UNIQUE on `name`), so every 30s flush appends a duplicate row instead of updating the wallet. Also missing the `playerDropped`/`onResourceStop` save it promises (crash-safety claim is false). *Fact-checked: wrong.*
- `vehicles-garages.mdx` — `/storecar` never despawns the entity and `/takecar` always spawns a new one (entity leak); passes a bare string `'sultan'` to `CreateVehicleServerSetter` where a `joaat()` hash is required (sibling lesson does it right).
- `callbacks.mdx` — describes the 2nd arg of `lib.callback.await(name, false)` as "no-timeout"; it's actually an event-throttle delay (false = no throttle). The real timeout is the `ox:callbackTimeout` convar. *Fact-checked: wrong (doc wording).*
- `first-line-of-lua.mdx` — hero says the resource "prints when it starts" but the code only prints on a command; a beginner who restarts sees nothing.

**Promise-vs-delivery (content):** `mini-banking-capstone`, `server-only-banking-audit`, `oxmysql-crud`, `jobs-framework` all promise specific builds (a `/bank`, an audit-log table, full CRUD, a payroll loop) but ship a generic `dbtest` insert/single/update snippet. (Same root cause as the converter stubs.)

**Structure/navigation:** pervasive breadcrumb + lesson-number drift vs `curriculum.ts` (e.g. `natives-toolbox` crumb "Lesson 11" vs curriculum 13; `jobs-framework` breadcrumb is literally `/`; several B7/C lessons read "Track 2 · Pro Path"). In-body "see Lesson N" references drift too — use slug-based links.

**Minor:** `convars-server-cfg` `restricted=true` command footgun (silent access-denied in-game); `two-worlds`/`client-server-shared` near-duplicate demos with placeholder ExpectedOutput; `variables-numbers-strings`/`functions` reference a `qu_hello` resource not built until Lesson 07.

**Fact-checks that PASSED (live content is correct):** Qbox = maintained ox-native QBCore successor; txAdmin `:40120` + green status; `set`/`setr`/`sets` semantics; `fxmanifest` `cerulean`/`gta5`/`lua54`; `RegisterCommand` restricted ACE; Discord webhook `204`; `dependency` vs `dependencies`; `SetPlayerRoutingBucket`; ox_target `addBoxZone` schema; `CreateObject` arg order; `prop_boxpile_07d` valid; ox_inventory `Search`/`AddItem`.

---

## What's genuinely strong — keep

- **Track B pure-code lessons** (Lua basics, natives, exports, promises, OOP, perf/resmon, OneSync, anti-cheat, http-webhooks, debugging): technically current and runnable.
- **Track C entity/vehicle lessons** (ox-target, spawning-entities-safely, cleanup-discipline): handle-vs-netId teaching and cleanup discipline are better than most paid courses.
- `convars-server-cfg` — the one complete Track A lesson; correct and well-built.
- **Lesson template** (meta definition-list, BEFORE-YOU-START checklist, EXPECTED OUTPUT callout, numbered steps, three-column layout, Shiki) — strong scaffolding; the problem is the converter not filling it, not the template.
- **Visual language:** restrained editorial monochrome + teal accent, premium tier, strong mobile.

---

## Priority order (by customer-acquisition impact)

1. **[FIXED] Invisible code blocks** — was sitewide; learners couldn't see commands.
2. **Fix the converter (or author the stubs)** — the live site serves broken lessons; this is the single biggest acquisition + trust problem. ~10 lessons affected.
3. **`persistence` SQL bug + `vehicles-garages` leak** — real correctness bugs in otherwise-complete lessons.
4. **Breadcrumb/number drift** — generate from `curriculum.ts`; cheap, removes a "this site is sloppy" signal.
5. **Landing primary-CTA + beginner reassurance**, `/paywall` real surface — top-of-funnel (see `CLOUD-DESIGN-PROMPT.md`).
6. Minor copy/duplicate cleanups.

---

*Full agent output (both passes, every finding + source URL) is in the workflow transcripts. This file + `CLOUD-DESIGN-PROMPT.md` are the actionable summary. The corrected MDX-layer findings here supersede the first pass.*
