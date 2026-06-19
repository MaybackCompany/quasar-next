# FiveM Curriculum Audit — Orchestration Spec (2026)

> Revised mission prompt. Validation lens: `bot-validator`. Pre-flight gate: `grill-me`.
> Supersedes the original free-text brief. Corrects stale repo-state claims.

---

## 0. Repository Ground Truth (verified 2026-06-19)

| Claim in old brief | Reality now | Action |
|---|---|---|
| "~66 modified, uncommitted lesson files" | Working tree **clean** (`git status` = 0). | Audit the **committed diff**, not phantom files. |
| "interrupted multi-agent audit, do not revert" | Audit already **committed** (`aa7e8f6 docs: update FiveM lessons for 2026`) and **pushed**. | Re-validate `git diff main...HEAD`. |
| "FIVEM-SCHOOL-AUDIT.md is stale, must be created" | File **exists** (regenerated in audit commit). | Extend/replace with current report; do not assume blank. |
| "98 live lessons" | `src/content/lessons/*.mdx` = **98** confirmed. `src/lib/curriculum.ts` = ~100 `slug:` entries. | Reconcile curriculum to **exactly 98 published**; flag extras. |

- Repo: `MaybackCompany/quasar-next` · branch `codex/fivem-course-audit-2026` · PR [#1](https://github.com/MaybackCompany/quasar-next/pull/1) OPEN vs `main` (72 files, +1238/−975).
- Local working dir: `/Users/kishi/Documents/New project 3/quasar-next`.
- Package manager: **pnpm**. Scripts: `dev build lint test:e2e gen:ai-context prebuild`.
- Live source: `src/content/lessons/*.mdx`. Authoritative list: `src/lib/curriculum.ts`. **Ignore** legacy `content/lessons/*.html` (56 files).
- **Do not** reset/discard/force-push. **Do not** open a new PR or merge unless explicitly told. Edits land on the existing branch / update PR #1.

---

## 1. Mission

Re-validate and correct all **98** published lessons for a student with **zero** prior knowledge (no programming, FiveM, server, DB, framework, Linux, Windows-server, Git, or networking). Treat **every existing lesson AND every AI-generated edit already in the diff as untrusted** until backed by a primary source. This is a `bot-validator` pass over a bot-authored audit — do not rubber-stamp the prior agent's work.

---

## 2. Trust Standard (bot-validator)

Per-lesson trust decision required, ordered by severity (Critical → High → Medium → Low → Info):

| Dimension | Pass condition | Evidence required |
|---|---|---|
| Intent fit | Teaches the stated outcome, no scope creep | curriculum slug + lesson body |
| Beginner clarity | PASS / FIXED / FAIL — jargon defined before use | the prose itself |
| Technical accuracy | PASS / FIXED / RUNTIME-REQUIRED | primary-source link |
| Commands/APIs | Every command/native exists in official docs/source | docs.fivem.net / repo line |
| Security boundary | Client input validated server-side; no secret/SQL/perm leak | code path |
| Expected output | Produced by the shown code, or labelled "illustrative" | trace / reproduction |

Final per-lesson verdict: **accept / accept-with-follow-ups / request-changes / reject**.
Never mark `runtime-verified` for anything only read from docs → mark **RUNTIME-REQUIRED**.

---

## 3. Source Hierarchy (primary only for factual claims)

1. docs.fivem.net · portal.cfx.re · runtime.fivem.net · citizenfx GitHub
2. txAdmin GitHub/docs
3. Qbox docs + Qbox-project GitHub
4. QBCore docs + qbcore-framework GitHub
5. ESX docs + esx-framework GitHub
6. pma-voice · ox_lib · ox_inventory · ox_target · oxmysql · qs-inventory · Tebex official repos/docs
7. MariaDB · Git · GitHub · VS Code · React · Vite · Discord official docs

Reject a claim when: only source is an old tutorial / another course; command not in official docs/source; behavior depends on unspecified framework/version; lesson claims output its code never prints. Community posts may *identify* a problem but are **never** the sole factual source.

---

## 4. Known 2026 Failures to Hunt (grep gate)

| Wrong (must be gone) | Correct 2026 |
|---|---|
| `keymaster.fivem.net`, "IP type" | `portal.cfx.re` license flow |
| `getplayeridentifiers` (fake console cmd) | `GetNumPlayerIdentifiers` + `GetPlayerIdentifier` natives / txAdmin UI |
| Setup jumps to folders/binaries/git with no mental model | mental model → prep → one action → proof → explanation → recovery |
| Invented console output, fake APIs, guessed paths, unverified limits | only what the shown code prints, or label "illustrative" |
| Stale game-build / artifact confusion | current artifact vs GTA build separation |
| Old NUI callback URLs | `GetParentResourceName()` pattern; DUI file-URL vs NUI callback-URL distinction |
| `lua54` presented as required | state it as a ConVar choice |

Grep sweep must scan all 98 for each token above + placeholder/proof-check stubs.

---

## 5. Zero-Knowledge Teaching Standard (every instructional lesson)

Progression order is mandatory: **mental model → preparation → one action → observable proof → explanation → failure recovery → exercise.** Do not just add prose.

Each lesson must include: (1) plain-language purpose; (2) definitions before jargon; (3) prerequisites; (4) **exact location** of each action — Windows PowerShell / Linux shell / txAdmin Live Console / FXServer console / FiveM F8 / in-game chat / VS Code / DB client; (5) exact file/folder path; (6) copyable commands that actually exist; (7) every placeholder explained; (8) expected result the shown code produces; (9) ≥3 realistic failure modes; (10) rollback/recovery; (11) security warning when client input / credentials / SQL / permissions / webhooks / networking involved; (12) primary-source links.

---

## 6. Technical Checks (audit explicitly)

Portal license flow · artifact vs GTA build · txAdmin paths/ports/panels/recipes/console cmds · `server.cfg` ConVars/ACE principals/identifiers/load order · F8 vs server vs txAdmin console placement · QBCore/Qbox/ESX current exports, player object, jobs, money, permissions, identity, migrations · pma-voice deps + ConVars · ox ecosystem 2026 status · ox_lib callback signatures + throttle · oxmysql return values/transactions/param binding · DB uniqueness/upsert/backup/restore/migration · client↔server event security + authoritative state · OneSync entity ownership/network IDs/routing buckets/cleanup · NUI callback via `GetParentResourceName()` · DUI file-URL vs NUI callback-URL · React 19.2 / Vite 8 / Node 20.19+ or 22.12+ · complete `handling.meta` (no partial XML) · MLO/map collision/LOD/overlap/staging rollback · inventory command targets/capacity/success values/output · Tebex + Cfx platform policy · every reference URL.

---

## 7. Orchestration Model

**Disjoint file assignment — no two agents edit the same MDX.** No agent approves its own work; a separate reviewer validates commands/sources/clarity. Lead reconciles framework/version conflicts.

```
Phase 1  RECON        map 98 slugs → 98 MDX; reconcile curriculum.ts; grep-gate (§4); list reference URLs.
Phase 2  AUDIT (fan)  per-lesson: beginner clarity + technical accuracy + source check. Read-only, emits findings.
Phase 3  VERIFY (adv) independent reviewer per finding tries to REFUTE w/ primary source. ≥majority refute → drop.
Phase 4  FIX          edit MDX ONLY for confirmed findings. Validated 2026 facts only. Disjoint files.
Phase 5  REVIEW       second reviewer re-checks each edited lesson against §2 + §5. No self-approval.
Phase 6  REPORT       regenerate FIVEM-SCHOOL-AUDIT.md: 98 rows + trust decision.
Phase 7  GATE         git diff --check; 98↔98 map; grep clean; pnpm install --frozen-lockfile; pnpm build;
                      pnpm test:e2e; Playwright desktop+mobile on representative lessons/track.
```

Lint baseline has unrelated failures → record separately, do not expand scope.

---

## 8. Deliverables

1. Corrected MDX (confirmed findings only).
2. Regenerated `FIVEM-SCHOOL-AUDIT.md` — all **98** rows.
3. Findings ordered Critical → High → Medium → Low, primary-source link beside each.
4. Commands run + results. Screenshots: representative desktop + mobile.
5. List of lessons still **RUNTIME-REQUIRED** (need live FXServer/framework).
6. Final trust decision: accept / accept-with-follow-ups / request-changes / reject.

---

## 9. Acceptance Criteria (no completion unless ALL true)

- 98 lessons have explicit audit rows.
- No fabricated commands remain (grep §4 clean).
- Portal licensing current; no console/F8/chat confusion.
- Framework code states tested framework + version.
- Security examples validate client input server-side.
- Every expected output is produced by shown code or labelled illustrative.
- All routes `pnpm build` clean; browser checks pass.
- Remaining runtime-only claims disclosed.

---

## 10. Runtime Matrix (eventual, not claimable from docs)

Vanilla FXServer + txAdmin · QBCore · Qbox · ESX Legacy · ox_lib/oxmysql/ox_inventory/ox_target · pma-voice · MariaDB.
