using System.Text.Json;
using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;

namespace AlberSchoolApi.Presentation.Middleware;

/// <summary>
/// When <c>SystemSettings.MaintenanceMode</c> is true, returns 503 for all API requests
/// except health checks and admin users.
/// </summary>
public class MaintenanceModeMiddleware
{
    private readonly RequestDelegate _next;

    public MaintenanceModeMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        // Always allow health endpoint and non-API paths
        var path = context.Request.Path.Value ?? "";
        if (!path.StartsWith("/api") || path.Contains("/health") || path.Contains("/auth/login"))
        {
            await _next(context);
            return;
        }

        // Allow authenticated admins through even during maintenance
        if (context.User.IsInRole("Admin"))
        {
            await _next(context);
            return;
        }

        var settingsRepo = context.RequestServices.GetService<ISystemSettingsRepository>();
        if (settingsRepo is not null)
        {
            var settings = await settingsRepo.GetAsync();
            if (settings.MaintenanceMode)
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
                var message = settings.MaintenanceMessage ?? "The system is currently under maintenance. Please try again later.";
                await context.Response.WriteAsync(JsonSerializer.Serialize(
                    ApiResponse.Fail(message),
                    new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }));
                return;
            }
        }

        await _next(context);
    }
}
