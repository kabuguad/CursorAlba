# Alber School — School Management System

A comprehensive school management platform for Alber School, Kutus, Kirinyaga County, Kenya. Provides separate portals for Admins, Teachers, Parents, and Students.

## Architecture

- **Frontend:** React 19 + TypeScript + Vite (port 5000), Tailwind CSS v4 (glassmorphism), TanStack Query, React Router v7, Framer Motion, Recharts
- **Backend:** .NET 10 ASP.NET Core Web API (port 8080), SQLite via Entity Framework Core, JWT authentication, ASP.NET Core Identity
- **Database:** SQLite (`AlberSchoolApi/AlbaApi/alber_school.db`) — auto-seeded on first run

## Running the Project

Both workflows start automatically:
- **Start application** — Vite dev server on port 5000 (the web preview)
- **Start API** — .NET API via `bash start-api.sh` on port 8080 (no waitForPort — .NET takes ~7s to start)

The Vite server proxies all `/api/*` requests to the backend on port 8080.

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
- `vite.config.ts` — proxies `/api` to localhost:8080

## Important Notes

- The `Migrations_backup/` folder is excluded from compilation (old SQL Server migrations — replaced with EnsureCreatedAsync + SQLite)
- AutoMapper v16 uses `cfg.AddProfile<T>()` syntax (breaking change from v12)
- The API workflow does NOT use `waitForPort` because .NET startup takes ~7s which exceeds the workflow timeout

## User Preferences

- Keep the existing clean architecture structure (Entities, Repository, Service, Presentation projects)
