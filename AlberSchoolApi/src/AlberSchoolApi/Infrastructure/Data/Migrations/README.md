# EF Core Migrations — Alber School API

## First-time setup

Ensure your connection string in `appsettings.Development.json` points to an accessible SQL Server instance,
then run the following from the repo root (or the `AlberSchoolApi/` directory):

```bash
# 1. Add the initial migration
dotnet ef migrations add InitialCreate \
  --project src/AlberSchoolApi/AlberSchoolApi.csproj \
  --output-dir Infrastructure/Data/Migrations

# 2. Apply to the database
dotnet ef database update \
  --project src/AlberSchoolApi/AlberSchoolApi.csproj
```

## Subsequent schema changes

```bash
dotnet ef migrations add <MigrationName> \
  --project src/AlberSchoolApi/AlberSchoolApi.csproj \
  --output-dir Infrastructure/Data/Migrations

dotnet ef database update \
  --project src/AlberSchoolApi/AlberSchoolApi.csproj
```

## Roll back one migration

```bash
dotnet ef database update <PreviousMigrationName> \
  --project src/AlberSchoolApi/AlberSchoolApi.csproj
```

## Seed data

After `database update`, run the seed script to populate:
- SystemSettings (singleton row with school info)
- Default Permissions (all permission codes)
- First Admin user

```bash
dotnet run --project src/AlberSchoolApi/AlberSchoolApi.csproj -- --seed
```

*(The `--seed` flag is handled in `Program.cs` and calls `DbSeeder.SeedAsync`.)*
