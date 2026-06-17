# Quasar School — VPS Deployment PRD

A complete, self-contained runbook for deploying this app to a Linux VPS and
serving it at **https://quasaracademy.dev** (or a subdomain). Written so another
engineer or AI agent can execute it end to end. Nothing here requires Vercel.

---

## 1. What this app is

- **Quasar School** — a Next.js 16 (App Router, Turbopack, React 19) FiveM
  learning site: ~98 MDX lessons, hubs/cheatsheets, a toolbox, and a blog.
- **Giveaway / trial access** — the lessons are gated by Discord role. Hand a
  user a role, they log in with Discord, and they get a time-limited trial
  (default 7 days). When the window ends, their role is pulled and they see an
  upsell screen (`/expired`) that books a free FiveM audit.
- **Director admin** (`/admin`) — grant roles and set/extend/revoke each
  member's window.
- **SEO/GEO + blog** — sitemap, robots, JSON-LD, OpenGraph, `llms.txt`.

**Stack:** Next.js 16, iron-session (Discord OAuth gate), Upstash Redis over
REST for the trial store (the `KV_REST_API_*` env, same shape Vercel KV uses),
Discord bot token for role grant/pull, Cal.com embed for the audit booking.
**There is no SQL database** — the only state store is the KV (Upstash).

Repo: `https://github.com/MaybackCompany/quasar-next` (public). The Next app is
the **repo root** of that repository (`package.json`, `next.config.ts`, and
`.vercel/project.json` are at the top level).

---

## 2. Prerequisites

- A VPS (Ubuntu 22.04+ recommended) with root/sudo.
- **Node.js 20 LTS** (or 22) and **pnpm 10** (`corepack enable && corepack prepare pnpm@10 --activate`).
- `git`, `nginx`, and `certbot` (unless TLS is terminated at Cloudflare).
- A process manager: **pm2** (`npm i -g pm2`) or a systemd unit (both shown below).
- Accounts/assets you must have ready:
  - The domain **quasaracademy.dev** on Cloudflare (DNS).
  - A **Discord application + bot** (https://discord.com/developers/applications).
  - A free **Upstash Redis** database (https://upstash.com) for the trial store.
  - The **Cal.com** booking link is already wired (`kishi/fivemaudit`); no setup needed.

---

## 3. Get the code

```bash
cd /opt   # or wherever you host apps
git clone https://github.com/MaybackCompany/quasar-next.git
cd quasar-next
pnpm install --frozen-lockfile
```

---

## 4. Environment variables

Create `/opt/quasar-next/.env.local` (or inject via systemd `Environment=`).
**Never commit this file.** `ACCESS_MODE=public` would disable the gate entirely,
so production must use `discord`.

| Variable | Required | What it is / how to get it |
|---|---|---|
| `ACCESS_MODE` | yes | Set to `discord` to enable the Discord role gate. |
| `BASE_URL` | yes | `https://quasaracademy.dev` — used to build the OAuth redirect. |
| `NEXT_PUBLIC_SITE_URL` | yes | `https://quasaracademy.dev` — canonical origin for SEO (sitemap/robots/OG/JSON-LD). |
| `SESSION_SECRET` | yes | 32+ random chars. Generate: `openssl rand -base64 32`. iron-session cookie key. |
| `DISCORD_CLIENT_ID` | yes | Discord app → OAuth2 → Client ID. |
| `DISCORD_CLIENT_SECRET` | yes | Discord app → OAuth2 → Client Secret. |
| `DISCORD_GUILD_ID` | yes | The Quasar guild ID: `1314332305233281165`. |
| `DISCORD_BOT_TOKEN` | yes | Discord app → Bot → Token. Used for the admin grant/revoke and pulling roles on expiry. |
| `KV_REST_API_URL` | for trials | Upstash Redis → REST API → `UPSTASH_REDIS_REST_URL`. |
| `KV_REST_API_TOKEN` | for trials | Upstash Redis → REST API → `UPSTASH_REDIS_REST_TOKEN`. |
| `CRON_SECRET` | for trials | Any long random string. The expiry endpoint refuses to run without it. |
| `TRIAL_DEFAULT_DAYS` | optional | Default trial length on first visit. Defaults to `7`. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | optional | e.g. `quasaracademy.dev` to enable Plausible analytics. |
| `NEXT_PUBLIC_GA_ID` | optional | e.g. `G-XXXXXXXXXX` to enable Google Analytics 4 instead/also. |
| `NODE_ENV` | yes | `production`. |

> Without `KV_REST_API_*` the site still runs, but trials never expire (role =
> permanent access). Without `CRON_SECRET` the expiry cron returns 503.
> Access/admin **role IDs are in code** (`src/lib/auth/roles.ts`), not env — do
> not set any `ROLE_*` variables.

---

## 5. Discord configuration

1. **OAuth2 → Redirects:** add exactly `https://quasaracademy.dev/auth/callback`
   (and the subdomain variant if you use one). Login fails without it.
2. **OAuth scopes** used by the app: `identify guilds.members.read` (no action
   needed; this is requested in code).
3. **Bot:** invite the bot to the guild `1314332305233281165` with the
   **Manage Roles** permission, and in Server Settings → Roles drag the **bot's
   role above** every role it will hand out (above `FiveM Starterkit` / above
   `Enterprise Member` if you grant those). If the bot's role is below them,
   grant/revoke returns HTTP 403.

---

## 6. Upstash (trial store)

1. Create a free Redis database at upstash.com (pick a region near the VPS).
2. Open the database → **REST API** tab.
3. Copy `UPSTASH_REDIS_REST_URL` → `KV_REST_API_URL` and
   `UPSTASH_REDIS_REST_TOKEN` → `KV_REST_API_TOKEN` in `.env.local`.

---

## 7. Build and run

```bash
cd /opt/quasar-next
pnpm build
```

### Option A — pm2

```bash
PORT=3000 pm2 start "pnpm start" --name quasar-school
pm2 save
pm2 startup   # follow the printed command so it survives reboot
```

### Option B — systemd (`/etc/systemd/system/quasar-school.service`)

```ini
[Unit]
Description=Quasar School (Next.js)
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/quasar-next
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/opt/quasar-next/.env.local
ExecStart=/usr/bin/pnpm start
Restart=on-failure
User=www-data

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now quasar-school
```

The app now listens on `127.0.0.1:3000`.

---

## 8. Nginx reverse proxy + TLS

`/etc/nginx/sites-available/quasaracademy.dev`:

```nginx
server {
  listen 80;
  server_name quasaracademy.dev www.quasaracademy.dev;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/quasaracademy.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d quasaracademy.dev -d www.quasaracademy.dev
```

> The app reads `X-Forwarded-Proto`/`X-Forwarded-Host` to build correct OAuth
> redirects, so the headers above matter. If you terminate TLS at Cloudflare
> instead of certbot, set Cloudflare SSL mode to **Full (strict)** and install a
> Cloudflare Origin Certificate on nginx.

---

## 9. Cloudflare DNS

In the Cloudflare dashboard for quasaracademy.dev → DNS:

- Add an **A record**: name `@` (or `guide` for a subdomain) → **the VPS public IP**.
- Proxy status: orange-cloud (proxied) is fine and adds DDoS/TLS; grey-cloud
  (DNS only) works too. If proxied, use SSL mode **Full (strict)**.

> ⚠️ Collision check: the Discord bot is reportedly also on quasaracademy.dev. If
> the apex is already serving something, deploy the guide on a subdomain
> (`guide.quasaracademy.dev`) and use that as `BASE_URL`/`NEXT_PUBLIC_SITE_URL`
> and in the Discord redirect.

---

## 10. Trial-expiry cron (replaces Vercel Cron)

`vercel.json` defines a daily cron, but **that only runs on Vercel**. On a VPS,
add a system crontab entry instead (`crontab -e`):

```cron
0 3 * * * curl -fsS -H "Authorization: Bearer YOUR_CRON_SECRET" https://quasaracademy.dev/api/cron/expire-trials >/dev/null 2>&1
```

This pulls the Discord role from any member whose window elapsed. The `/expired`
page also pulls the role the moment a locked-out member loads it, so the cron is
just the backstop.

---

## 11. Post-deploy verification checklist

- [ ] `https://quasaracademy.dev` loads over HTTPS, nav shows the Quasar logo + "Quasar School".
- [ ] `https://quasaracademy.dev/robots.txt` allows `/` and lists the sitemap.
- [ ] `https://quasaracademy.dev/sitemap.xml` returns the home, tracks, and `/blog/*` URLs.
- [ ] `https://quasaracademy.dev/llms.txt` resolves.
- [ ] A blog post (e.g. `/blog/esx-vs-qbcore-vs-qbox`) renders with content.
- [ ] Visiting a lesson while logged out redirects to Discord login.
- [ ] Logging in with a Discord account that has an access role lands you in the lesson.
- [ ] `/admin` loads for a Director-role account and lists trial members.
- [ ] Bot can grant a role: `curl -s -o /dev/null -w "%{http_code}\n" -X PUT -H "Authorization: Bot $DISCORD_BOT_TOKEN" "https://discord.com/api/v10/guilds/1314332305233281165/members/<TEST_USER_ID>/roles/1515556790119436339"` returns `204`.
- [ ] If analytics env is set, the tracker fires (network tab shows plausible.io or googletagmanager).

---

## 12. How access works (operating the trials)

There is **no email/password** — identity is Discord only.

1. The customer joins the Discord guild `1314332305233281165`.
2. Give them the **FiveM Starterkit** role (`1515556790119436339`) — either in
   Discord directly, or on the site at `/admin` → enter their Discord user ID →
   Grant → FiveM Starterkit (uses the bot).
3. They open the site → Sign in with Discord → they're in. A **7-day clock**
   auto-starts on first visit.
4. (Optional) In `/admin` → Trial members, set their exact window (7/14/30/custom
   or Permanent), or Revoke now.
5. When the window ends: their role is pulled and they see the `/expired` upsell
   (free FiveM audit via Cal.com + fivemcoach.com).

### Role IDs (public, in `src/lib/auth/roles.ts`)

| Role | ID | Grants course access |
|---|---|---|
| FiveM Starterkit | `1515556790119436339` | yes (the giveaway role) |
| Builder Member | `1316410536086339686` | yes |
| Elite Member | `1316410535348273253` | yes |
| Enterprise Member | `1473436768559829275` | yes |
| Director | `1314332600684253266` | yes + admin panel (exempt from trials) |

---

## 13. Security (do this before go-live)

- **Rotate any secret that was ever shared in chat/DM** (Discord bot token,
  client secret, Cloudflare API token). Generate fresh values and put them only
  in the VPS `.env.local` / systemd `EnvironmentFile`.
- `.env.local` is gitignored — never commit it. The bot token and session secret
  must stay server-side only.
- Keep `ACCESS_MODE=discord` in production.

---

## 14. Updating the site

```bash
cd /opt/quasar-next
git pull origin main
pnpm install --frozen-lockfile
pnpm build
pm2 restart quasar-school     # or: sudo systemctl restart quasar-school
```

---

## 15. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Login loops or "Invalid OAuth state" | Redirect URI mismatch. It must be exactly `<BASE_URL>/auth/callback` in the Discord app, and `BASE_URL` must match the live origin. |
| Grant/revoke returns 403 | Bot lacks Manage Roles, or its role is below the target role. Move the bot's role up. |
| Members never lose access | `KV_REST_API_*` not set, or the cron isn't running. Check the crontab + `CRON_SECRET`. |
| `/admin` redirects to `/` | The signed-in account lacks a Director role. |
| Build fails | Wrong Node version. Use Node 20/22 + pnpm 10. |
| Pages 404 after deploy | `pnpm build` not run, or the process is serving a stale build. Rebuild + restart. |
| Cal.com / analytics blocked | Check the CSP in `next.config.ts` includes the host; it already allows cal.com, plausible.io, and googletagmanager. |
