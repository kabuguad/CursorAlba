using System.Text;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Infrastructure.Data;
using AlberSchoolApi.Infrastructure.Repositories;
using AlberSchoolApi.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace AlberSchoolApi.Presentation.Extensions;

public static class ServiceCollectionExtensions
{
    /// <summary>Register EF Core and the database context.</summary>
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection"),
                sql => sql.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null)));
        return services;
    }

    /// <summary>Register JWT authentication with the settings from appsettings.json.</summary>
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration config)
    {
        var key = Encoding.UTF8.GetBytes(config["JwtSettings:SecretKey"]!);
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = config["JwtSettings:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = config["JwtSettings:Audience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });
        return services;
    }

    /// <summary>Register all repository implementations for DI.</summary>
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        // Identity
        services.AddScoped<IUserRepository, UserRepository>();

        // People
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<IStaffRepository, StaffRepository>();

        // Academic
        services.AddScoped<IAcademicYearRepository, AcademicYearRepository>();
        services.AddScoped<ITermRepository, TermRepository>();
        services.AddScoped<ISchoolClassRepository, SchoolClassRepository>();
        services.AddScoped<ISubjectRepository, SubjectRepository>();
        services.AddScoped<IExamRepository, ExamRepository>();
        services.AddScoped<IStudentResultRepository, StudentResultRepository>();
        services.AddScoped<IAttendanceRepository, AttendanceRepository>();
        services.AddScoped<ILeaveRequestRepository, LeaveRequestRepository>();
        services.AddScoped<ITimetableRepository, TimetableRepository>();

        // Finance
        services.AddScoped<IInvoiceRepository, InvoiceRepository>();
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IFeeStructureRepository, FeeStructureRepository>();
        services.AddScoped<IScholarshipRepository, ScholarshipRepository>();
        services.AddScoped<IExpenseRepository, ExpenseRepository>();

        // Communications
        services.AddScoped<IAnnouncementRepository, AnnouncementRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddScoped<IMeetingSlotRepository, MeetingSlotRepository>();

        // Admissions
        services.AddScoped<IAdmissionsRepository, AdmissionsRepository>();

        // CMS
        services.AddScoped<IContentPageRepository, ContentPageRepository>();
        services.AddScoped<IBlogPostRepository, BlogPostRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<IGalleryRepository, GalleryRepository>();
        services.AddScoped<IMediaAssetRepository, MediaAssetRepository>();

        // System
        services.AddScoped<ISystemSettingsRepository, SystemSettingsRepository>();
        services.AddScoped<ISocialLinkRepository, SocialLinkRepository>();
        services.AddScoped<INotificationRepository, NotificationRepository>();
        services.AddScoped<IAuditLogRepository, AuditLogRepository>();

        return services;
    }

    /// <summary>Register infrastructure services (token, email, etc.).</summary>
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<ITokenService, TokenService>();
        return services;
    }

    /// <summary>Register Swagger / OpenAPI with JWT support.</summary>
    public static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Alber School API",
                Version = "v1",
                Description = "RESTful API for Alber School management platform",
                Contact = new OpenApiContact { Name = "Alber School", Email = "admin@alberschool.ke" }
            });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header. Enter: Bearer {token}",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                    },
                    []
                }
            });

            var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath)) c.IncludeXmlComments(xmlPath);
        });

        return services;
    }

    /// <summary>Register CORS with allowed origins from configuration.</summary>
    public static IServiceCollection AddCorsPolicy(this IServiceCollection services, IConfiguration config)
    {
        var origins = config.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
        services.AddCors(options =>
        {
            options.AddPolicy("AlberPolicy", builder =>
                builder.WithOrigins(origins)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });
        return services;
    }
}
