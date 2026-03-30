# MARTIN OS

Vite UI + Next.js API split:

- **UI**: Vite/React/Tailwind app served on **`http://localhost:3000`**
- **APIs**: Next.js App Router API routes served on **`http://localhost:3001`**
- **Proxy**: the Vite server reverse-proxies **`/api/*` → `http://next-api:3001/api/*`** so the browser always talks to **`:3000`**.

## Commands

- `docker compose up --build -d` — runs UI on **`:3000`** and API on **`:3001`**
- `docker compose logs -f vite-ui` — UI logs
- `docker compose logs -f next-api` — API logs

## Routes

- UI: `GET /` (Vite SPA)
- API: `GET /api/health` (proxied to Next API service)

## Env

Create a `.env` next to `docker-compose.yml` (or export env vars) with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_PEXELS_API_KEY=...   # optional
MARTIN_OS_PORT=3000
```

## Docs

- `docs/DATA-PRESERVATION.md` — content / persistence guidelines
