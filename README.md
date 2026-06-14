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
BASE_URL=https://your-domain.example
SESSION_SECRET=at-least-32-random-characters
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_GUILD_ID=
DISCORD_BOT_TOKEN=
ROLE_PRO=
ROLE_ELITE=
ROLE_STAFF=
ACCESS_MODE=public
```

Keep secrets in Vercel environment variables. Do not expose bot tokens or session secrets to the browser.
