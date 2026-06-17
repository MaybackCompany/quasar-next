# Quasar Academy Next app

Next.js 16 App Router migration target for Quasar Academy.

## Local commands

```bash
pnpm install
pnpm build
pnpm dev
```

Run content imports after source HTML changes:

```bash
node scripts/import-lessons.mjs
node scripts/import-hubs.mjs
```

## Vercel cutover

The repo root `vercel.json` now points Vercel at this app:

- install: `cd quasar-next && pnpm install --frozen-lockfile`
- build: `cd quasar-next && pnpm build`
- output: `quasar-next/.next`
- framework: `nextjs`

If the Vercel project uses a dashboard Root Directory setting, set it to the repo root so this `vercel.json` is applied, or set it directly to `quasar-next` and keep the same `pnpm build` command.

## Environment

`ACCESS_MODE` defaults to `public`. Set `ACCESS_MODE=discord` to enable the Discord role gate.

Required for Discord mode:

```bash
ACCESS_MODE=discord
BASE_URL=https://your-domain.example       # the live domain, e.g. https://quasaracademy.dev
SESSION_SECRET=at-least-32-random-characters
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_GUILD_ID=                          # the guild roles are checked against
DISCORD_BOT_TOKEN=                         # grant/revoke + pull-on-expiry; bot needs Manage Roles, above the membership roles
```

Access + admin role IDs live in code (`src/lib/auth/roles.ts`), not in env. Add the Discord
OAuth redirect `<BASE_URL>/auth/callback` in the Discord app's OAuth2 settings.

Time-limited trials (optional; without them the gate still works but nothing expires):

```bash
KV_REST_API_URL=          # from a Vercel KV / Upstash store
KV_REST_API_TOKEN=
CRON_SECRET=              # any long random string; the daily expiry cron refuses to run without it
# TRIAL_DEFAULT_DAYS=7    # default trial length on first visit
```

The daily role-removal cron is defined in `vercel.json` (`/api/cron/expire-trials`).

Keep secrets in Vercel environment variables. Do not expose bot tokens or session secrets to the browser.
