# Security

## Secrets live only in the host environment

This repo contains **no secrets** and must never contain any. The only env file
committed is `.env.example`, which holds variable **names and comments, no
values**. `.gitignore` blocks `.env*` (except the example) plus key/credential
file types.

Real secret values live **only** in the deployment host's environment:
- On the VPS: in `.env.local` on the server (gitignored) or the systemd
  `EnvironmentFile` / process env. See `DEPLOYMENT-PRD.md`.
- Never in the repo, never in git history, never in an image or client bundle.

These variables are secrets — treat their values accordingly:
`SESSION_SECRET`, `DISCORD_CLIENT_SECRET`, `DISCORD_BOT_TOKEN`,
`KV_REST_API_TOKEN`, `CRON_SECRET`. (`DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`,
`NEXT_PUBLIC_*` are not secret.)

## Rotate on exposure

If a secret is ever pasted into chat, a screenshare, a ticket, or committed by
mistake, consider it **compromised** and rotate it immediately, then update only
the host env:
- **Discord** bot token + client secret → Discord Developer Portal.
- **Cloudflare** API token → Cloudflare → My Profile → API Tokens.
- **SESSION_SECRET** → regenerate with `openssl rand -base64 32` (invalidates
  existing login cookies, which is fine).
- **KV / CRON** → rotate in the provider and update the host env.

## What is intentionally public

The lessons gate on Discord login, but the marketing pages, the blog, and the
static brand assets (`favicon.ico`, `icon-512.png`, `og.png`) are public by
design — every browser fetches them. They carry no embedded metadata and serve
read-only with `X-Content-Type-Options: nosniff`. There is nothing to "lock
down" there; the assets to protect are the secrets above.

## Reporting

Found a vulnerability? Do not open a public issue. Report it privately via the
Quasar Discord (https://discord.gg/quasaruniversity) to a Director.
