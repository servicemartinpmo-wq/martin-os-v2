# MARTIN OS

Next.js 14 app with a **tri-native dashboard** at **`/`**: **PMO-Ops** (host) with **Tech-Ops** and **Miidle** as native plugins—sidebar navigation, system explanation first, preferences, lock screens, and Miidle media (Pexels + fallbacks).

## Commands

- `npm run dev` — Next.js dev server at **http://localhost:3000** or **http://127.0.0.1:3000** (keep this terminal open while you use the app)
- `npm run build` / `npm run start` — production on **127.0.0.1** only (fine on your laptop)
- `npm run start:host` — production on **0.0.0.0:3000** — **use this on a VPS** so the public internet can reach the app
- `npm run vps:deploy` — on the server: `npm ci` + `npm run build` + `start:host` (uses `.env.production` if you created it)
- `npm run docker:up` / `docker:down` / `docker:logs` — Docker Compose (needs root `.env` with same `NEXT_PUBLIC_*` keys for build)
- `npm run lint`

## On your VPS (what you actually run)

**Option A — one command (Node on the server):**

```bash
cd /path/to/martin-os && git pull && npm run vps:deploy
```

(Optional first time: `cp .env.example .env.production` and add Supabase keys.)

**Option B — Docker:** put keys in a `.env` file next to `docker-compose.yml`, then `npm run docker:up`.

**Option C — survive reboots:** after a successful build, `sudo bash scripts/vps-install-service.sh` then `sudo systemctl start martin-os`.

## “This site can’t be reached” / connection refused (local)

The dev server must be **running**. In VS Code, open a terminal **inside the `martin-os` folder**, run `npm run dev`, wait until you see **“Ready”**, then open **http://localhost:3000**. If you stop the terminal or close VS Code, the site stops — run `npm run dev` again.

## If the site does not load at all

1. **On the server**, after `npm run build`, you must run **`npm run start:host`**, not `npm run start`. The default `start` binds to localhost only, so Cloudflare/your browser will never see it.
2. From your laptop: `curl -sS http://YOUR_SERVER_IP:3000/api/health` — you should get JSON `{"ok":true,"service":"martin-os",...}`. If **connection refused**, open the host firewall for port **3000** (e.g. `ufw allow 3000/tcp`) or put nginx/Caddy on 80/443 and proxy to `127.0.0.1:3000`.
3. **Cloudflare DNS**: A/AAAA record must point to the VPS IP. If you use the orange-cloud proxy, set SSL mode to **Full** (not “Flexible”) when the origin speaks HTTPS, or proxy to **http://origin-ip:3000** with correct origin rules.
4. **Do not** upload only the `public/` folder or a static “export” unless you use a host that officially supports this Next.js app — Martin OS needs `next start` (Node) or an approved adapter.

## Env

See `.env.example` (`NEXT_PUBLIC_PEXELS_API_KEY`, optional Supabase).

## Docs

- `docs/DATA-PRESERVATION.md` — content / persistence guidelines
