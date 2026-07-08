# Demo School — School Management System

A comprehensive school management platform for Demo School, Kutus, Kirinyaga County, Kenya. Provides separate portals for Admins, Teachers, Parents, and Students.

## Architecture

- **Frontend:** React 19 + TypeScript + Vite (port 5000), Tailwind CSS v4 (glassmorphism), TanStack Query, React Router v7, Framer Motion, Recharts
- **Backend:** .NET 10 ASP.NET Core Web API (port 8080), SQLite via Entity Framework Core, JWT authentication, ASP.NET Core Identity
- **Database:** SQLite (`AlberSchoolApi/AlbaApi/alber_school.db`) — auto-seeded on first run

## Running the Project

Both workflows start automatically:
- **Start application** — Vite dev server on port 5000 (the web preview)
- **Start API** — .NET API via `bash start-api.sh` on port 8080 (no waitForPort — .NET takes ~7s to start)

The Vite server can run in two modes (configured via `.env.local`):

| Mode | `.env.local` setting | What happens |
|------|----------------------|--------------|
| **Offline / mock** (default on Replit) | `VITE_USE_MOCK=true` | All `/api/*` requests served locally by `mock-api-plugin.ts` — no backend needed |
| **Real API** | `VITE_USE_MOCK=false` + `VITE_API_BASE=<url>` | Vite proxies `/api/*` to your backend (local .NET, ngrok tunnel, or production URL) |

To connect to the real backend locally:
```
# .env.local
VITE_USE_MOCK=false
VITE_API_BASE=https://localhost:7258        # local .NET dev server
# or
VITE_API_BASE=https://your-tunnel.ngrok-free.dev  # ngrok tunnel for Replit dev
```

## Demo Credentials

| Role    | Email                       | Password           |
|---------|-----------------------------|--------------------|
| Admin   | admin@alberschool.ke        | Admin@12345678     |
| Teacher | teacher@alberschool.ke      | Teacher@12345678   |
| Parent  | parent@alberschool.ke       | Parent@12345678    |
| Student | student@alberschool.ke      | Student@12345678   |

## Key Files

- `src/` — React frontend
- `AlberSchoolApi/AlbaApi/` — .NET API entry point (Program.cs, appsettings.json)
- `AlberSchoolApi/AlbaApi/alber_school.db` — SQLite database (auto-created + seeded on first run)
- `start-api.sh` — API startup script (cd into project dir, then dotnet run --no-build)
- `vite.config.ts` — proxies `/api` to the backend, or runs the mock plugin in offline mode
- `mock-api-plugin.ts` — Vite dev-server middleware that handles all `/api/*` routes locally (no backend needed)
- `.env.local` — set `VITE_USE_MOCK=true` for offline dev, or `VITE_API_BASE=<url>` to point at a real backend

## Important Notes

- The `Migrations_backup/` folder is excluded from compilation (old SQL Server migrations — replaced with EnsureCreatedAsync + SQLite)
- AutoMapper v16 uses `cfg.AddProfile<T>()` syntax (breaking change from v12)
- The API workflow does NOT use `waitForPort` because .NET startup takes ~7s which exceeds the workflow timeout

## Vercel Deployment

The project is ready for Vercel. Everything needed is already committed:

| File | Purpose |
|------|---------|
| `vercel.json` | Build config, SPA rewrites (all routes → `index.html`), security headers, asset caching |
| `api/[...path].js` | Vercel serverless function — proxies all `/api/*` requests to the real backend |

**Steps to deploy:**
1. Import this repo in [vercel.com](https://vercel.com) — Vercel auto-detects Vite
2. Add environment variable `VITE_API_BASE` (your .NET API URL) in Vercel's project settings
3. Deploy — the frontend is served as a static site; `/api/*` calls go through the serverless proxy

If `VITE_API_BASE` is not set, the `/api/*` serverless function returns a 503. The frontend still loads (it falls back to mock data in dev, or shows empty states in production).

## User Preferences

- Keep the existing clean architecture structure (Entities, Repository, Service, Presentation projects)
