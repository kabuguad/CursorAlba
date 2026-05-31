using Contracts.Repositories;
using Entities.Models.User;
using LoggerService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Repository;
using Service;
using Service.Contracts;
using Service.Contracts.Authentication;
using System.Security.Claims;
using System.Text;

namespace AlbaApi.Extensions;

public static partial class ServiceExtensions
{
    public static WebApplicationBuilder ConfigureCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllOrigins", p =>
            {
                p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
            });

            options.AddPolicy("AllowedOrigins", p =>
            {
                var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
                if (allowedOrigins != null && allowedOrigins.Any())
                {
                    var cleanedOrigins = allowedOrigins.Select(o => o.TrimEnd('/')).ToArray();
                    p.WithOrigins(cleanedOrigins);
                }
                else
                {
                    p.AllowAnyOrigin();
                }
                p.WithHeaders("accept", "content-type", "authorization");
                p.WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
            });
        });
        return builder;
    }

    public static void ConfigureLoggerService(this IServiceCollection services)
        => services.AddSingleton<ILoggerManager, LoggerManager>();

    public static void ConfigureRepositoryManager(this IServiceCollection services)
        => services.AddScoped<IRepositoryManager, RepositoryManager>();

    public static void ConfigureServiceManager(this IServiceCollection services)
        => services.AddScoped<IServiceManager, ServiceManager>();

    public static void ConfigureSqlContext(this IServiceCollection services, IConfiguration configuration)
        => services.AddDbContext<Repository.RepositoryContext>(opt =>
            opt.UseSqlite(configuration.GetConnectionString("sqlConnection")));

    public static void ConfigureRateLimitingOptions(this IServiceCollection services)
    {
        services.AddRateLimiter(opt =>
        {
            opt.GlobalLimiter = System.Threading.RateLimiting.PartitionedRateLimiter.Create<HttpContext, string>(
                _ => System.Threading.RateLimiting.RateLimitPartition.GetNoLimiter("global"));

            opt.AddPolicy("contact", ctx =>
            {
                var ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(partitionKey: ip, factory: _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
                { AutoReplenishment = true, PermitLimit = 5, Window = System.TimeSpan.FromMinutes(1), QueueLimit = 0 });
            });

            opt.AddPolicy("api", ctx =>
            {
                var userId = ctx.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "anonymous";
                return System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(partitionKey: userId, factory: _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
                { AutoReplenishment = true, PermitLimit = 120, Window = System.TimeSpan.FromMinutes(1), QueueLimit = 10 });
            });

            opt.AddPolicy("auth", ctx =>
            {
                var ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(partitionKey: ip, factory: _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
                { AutoReplenishment = true, PermitLimit = 10, Window = System.TimeSpan.FromMinutes(1), QueueLimit = 2 });
            });

            opt.AddPolicy("public", ctx =>
            {
                var ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(partitionKey: ip, factory: _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
                { AutoReplenishment = true, PermitLimit = 200, Window = System.TimeSpan.FromMinutes(1), QueueLimit = 10 });
            });

            opt.AddPolicy("write", ctx =>
            {
                var ip = ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown";
                return System.Threading.RateLimiting.RateLimitPartition.GetFixedWindowLimiter(partitionKey: ip, factory: _ => new System.Threading.RateLimiting.FixedWindowRateLimiterOptions
                { AutoReplenishment = true, PermitLimit = 30, Window = System.TimeSpan.FromMinutes(1), QueueLimit = 5 });
            });

            opt.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            opt.OnRejected = async (context, token) =>
            {
                if (!context.Lease.TryGetMetadata(System.Threading.RateLimiting.MetadataName.RetryAfter, out var retryAfter))
                    retryAfter = System.TimeSpan.FromSeconds(60);
                await context.HttpContext.Response.WriteAsync(
                    $"Too many requests. Try again after {retryAfter.TotalSeconds:.0f} seconds.", token);
            };
        });
    }

    public static void ConfigureIdentity(this IServiceCollection services)
    {
        services.AddIdentity<ApplicationUser, IdentityRole<int>>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 10;
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedEmail = false;
        })
         .AddEntityFrameworkStores<RepositoryContext>()
         .AddDefaultTokenProviders();
    }

    public static void ConfigureJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<Service.JwtSettings>(configuration.GetSection("JwtSettings"));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            var jwtSettings = configuration.GetSection("JwtSettings");
            var secretKey = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? "default_secret_key_change_in_production_12345");

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["ValidIssuer"] ?? "AlbaApi",
                ValidAudience = jwtSettings["ValidAudience"] ?? "AlbaApiClient",
                IssuerSigningKey = new SymmetricSecurityKey(secretKey),
                RoleClaimType = ClaimTypes.Role
            };

            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var authHeader = context.Request.Headers["Authorization"].ToString();
                    if (!string.IsNullOrEmpty(authHeader) && !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                    {
                        context.Token = authHeader;
                    }
                    return System.Threading.Tasks.Task.CompletedTask;
                }
            };
        });
    }
}
