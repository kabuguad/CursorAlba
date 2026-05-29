using AlberSchoolApi.Infrastructure.Data;
using AlberSchoolApi.Presentation.Extensions;
using Microsoft.EntityFrameworkCore;
using Serilog;

// ── Bootstrap Serilog immediately so startup errors are captured ────────────
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting Alber School API...");

    var builder = WebApplication.CreateBuilder(args);

    // ── Port configuration ────────────────────────────────────────────────────
    builder.WebHost.UseUrls("http://0.0.0.0:8080");

    // ── Serilog ──────────────────────────────────────────────────────────────
    builder.Host.UseSerilog((ctx, services, cfg) =>
        cfg.ReadFrom.Configuration(ctx.Configuration)
           .ReadFrom.Services(services)
           .Enrich.FromLogContext());

    // ── Services ──────────────────────────────────────────────────────────────
    builder.Services
        .AddDatabase(builder.Configuration)
        .AddJwtAuthentication(builder.Configuration)
        .AddCorsPolicy(builder.Configuration)
        .AddRepositories()
        .AddInfrastructureServices()
        .AddSwagger();

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();

    // ── HTTP Pipeline ─────────────────────────────────────────────────────────
    var app = builder.Build();

    // ── Database initialisation ───────────────────────────────────────────────
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        try
        {
            logger.LogInformation("Initialising database...");
            await DbSeeder.SeedAsync(db, logger);
            logger.LogInformation("Database ready.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Database initialisation failed — continuing startup.");
        }
    }

    app.UseAlberSwagger();
    app.UseAlberMiddleware();   // ExceptionMiddleware + MaintenanceModeMiddleware

    app.UseSerilogRequestLogging(opts =>
    {
        opts.MessageTemplate = "{RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    });

    app.UseCors("AlberPolicy");

    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();

    // Minimal health probe (always reachable, no auth, no maintenance gate)
    app.MapGet("/ping", () => Results.Ok(new { status = "ok", timestamp = DateTime.UtcNow }))
        .AllowAnonymous();

    app.Run();
}
catch (Exception ex) when (ex is not HostAbortedException)
{
    Log.Fatal(ex, "Alber School API terminated unexpectedly.");
}
finally
{
    Log.CloseAndFlush();
}
