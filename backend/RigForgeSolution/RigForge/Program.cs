using System.Globalization;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using RigForge.Data;
using RigForge.GCommon.Configuration;
using RigForge.GCommon.Constants;
using RigForge.GCommon.Converters;
using RigForge.GCommon.Exceptions;
using RigForge.GCommon.Extensions;
using RigForge.GCommon.ModelBinding;
using RigForge.GCommon.OpenApi;
using RigForge.Models;
using RigForge.Services;
using RigForge.Services.Contracts;

using static RigForge.GCommon.Models.UserValidation;

namespace RigForge;

public class Program
{
    public static async Task Main(string[] args)
    {
        CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
        CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        string? connectionString = builder
            .Configuration
            .GetConnectionString("Database")
            ?? throw new ConnectionStringNotFound("Database connection string not found");

        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(connectionString));

        IConfigurationSection jwtSection = builder
            .Configuration
            .GetSection(ConfigurationSections.Jwt);

        JwtOptions jwtOptions = jwtSection.Get<JwtOptions>()
            ?? throw new JwtConfigurationNotFound("JWT configuration section not found");

        if (string.IsNullOrWhiteSpace(jwtOptions.Issuer))
        {
            throw new JwtConfigurationNotFound("JWT issuer not found");
        }

        if (string.IsNullOrWhiteSpace(jwtOptions.Audience))
        {
            throw new JwtConfigurationNotFound("JWT audience not found");
        }

        if (string.IsNullOrWhiteSpace(jwtOptions.Key))
        {
            throw new JwtConfigurationNotFound("JWT signing key not found");
        }

        if (Encoding.UTF8.GetByteCount(jwtOptions.Key) < JwtOptions.KeyMinBytes)
        {
            throw new JwtConfigurationNotFound(
                $"JWT signing key must be at least {JwtOptions.KeyMinBytes} bytes");
        }

        if (jwtOptions.AccessTokenMinutes <= 0)
        {
            throw new JwtConfigurationNotFound(
                "JWT access token lifetime must be greater than zero");
        }

        builder.Services.Configure<JwtOptions>(jwtSection);

        builder.Services.AddScoped<ITokenService, TokenService>();

        builder.Services
            .AddIdentityCore<User>(options =>
            {
                options.Password.RequiredLength = PasswordMinLength;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders();

        builder.Services.Configure<IdentityOptions>(
            builder.Configuration.GetSection(ConfigurationSections.Identity));

        builder.Services.Configure<AdminOptions>(
            builder.Configuration.GetSection(ConfigurationSections.Admin));

        builder.Services.AddScoped<IIdentitySeeder, IdentitySeeder>();

        builder.Services.AddScoped<IImageStorageService, ImageStorageService>();

        builder.Services.AddScoped<IBuildService, BuildService>();

        builder.Services.AddScoped<ICommentService, CommentService>();

        builder.Services.AddScoped<ILikeService, LikeService>();

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtOptions.Issuer,

                    ValidateAudience = true,
                    ValidAudience = jwtOptions.Audience,

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtOptions.Key)),

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,

                    NameClaimType = JwtClaimNames.Username,
                    RoleClaimType = JwtClaimNames.Role
                };
            });

        builder.Services.AddAuthorization();

        string[] corsOrigins = builder
            .Configuration
            .GetSection(ConfigurationSections.CorsOrigins)
            .Get<string[]>()
            ?? Array.Empty<string>();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy(CorsPolicies.Frontend, policy =>
            {
                policy
                    .WithOrigins(corsOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        builder.Services
            .AddControllers(options =>
            {
                options.ModelMetadataDetailsProviders.Add(new EnumBindingMessageProvider());
            })
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.Converters.Add(new UtcDateTimeJsonConverter());
            });

        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

        builder.Services.AddProblemDetails();

        builder.Services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer<BearerSecurityDocumentTransformer>();
            options.AddOperationTransformer<BearerSecurityOperationTransformer>();
        });

        builder.Services.AddHealthChecks();

        WebApplication app = builder.Build();

        using (IServiceScope scope = app.Services.CreateScope())
        {
            IIdentitySeeder seeder = scope.ServiceProvider
                .GetRequiredService<IIdentitySeeder>();

            await seeder.SeedAsync();
        }

        if (!app.Environment.IsDevelopment())
        {
            app.UseExceptionHandler();
        }

        app.UseStatusCodePages();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();

            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint(OpenApiSettings.DocumentUrl, OpenApiSettings.Title);
            });
        }

        app.UseHttpsRedirection();

        app.UseCors(CorsPolicies.Frontend);

        string webRootPath = app.Environment.GetWebRootPath();

        Directory.CreateDirectory(webRootPath);

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(webRootPath)
        });

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.MapHealthChecks(HealthCheckRoutes.Health);

        await app.RunAsync();
    }
}
