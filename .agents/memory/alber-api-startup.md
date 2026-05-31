---
name: Alber School API startup quirks
description: .NET 10 API startup issues and fixes applied during Replit migration.
---

## Key fixes applied during migration

**Why:** .NET 10 + EF Core + Identity takes ~7 seconds to start, which exceeds the Replit workflow port-check timeout.

**Fix:** Workflow uses `bash start-api.sh` with no `waitForPort` so it doesn't fail. The script does `cd AlberSchoolApi/AlbaApi && exec dotnet run --no-build --project AlbaApi.csproj`. Pre-build required before starting.

**SQLite db path:** `alber_school.db` is relative and resolves correctly only when run from the `AlberSchoolApi/AlbaApi/` directory (content root). Running the compiled DLL directly from workspace root causes "no such table" because the content root becomes `bin/Debug/net10.0/`.

**Build issues fixed:**
- `Migrations_backup/` folder excluded from compilation in AlbaApi.csproj (had SQL Server-specific migration code)
- `ContextFactory/RepositoryContextFactory.cs` changed from `UseSqlServer` → `UseSqlite`
- AutoMapper v16 breaking change: `AddAutoMapper(typeof(T).Assembly)` → `AddAutoMapper(cfg => cfg.AddProfile<T>())`
- `GlobalExceptionHandler` needs `using AlbaApi;` at top of Program.cs
- API binary run from workspace root required absolute content root; use script with `cd` instead

**How to apply:** When restarting the API, always run `dotnet build` first (or ensure the build is fresh), then the workflow auto-starts with `bash start-api.sh`.
