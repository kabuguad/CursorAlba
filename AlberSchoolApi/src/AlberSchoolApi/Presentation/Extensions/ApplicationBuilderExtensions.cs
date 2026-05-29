using AlberSchoolApi.Presentation.Middleware;

namespace AlberSchoolApi.Presentation.Extensions;

public static class ApplicationBuilderExtensions
{
    /// <summary>
    /// Register all custom middleware in the correct pipeline order.
    /// Call this after routing but before authentication.
    /// </summary>
    public static WebApplication UseAlberMiddleware(this WebApplication app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
        app.UseMiddleware<MaintenanceModeMiddleware>();
        return app;
    }

    /// <summary>Enable Swagger UI (only in non-production by default).</summary>
    public static WebApplication UseAlberSwagger(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Alber School API v1");
            c.RoutePrefix = "swagger";
            c.DocumentTitle = "Alber School API";
        });
        return app;
    }
}
