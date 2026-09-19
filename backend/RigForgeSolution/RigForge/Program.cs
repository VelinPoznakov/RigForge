using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RigForge.Data;
using RigForge.GCommon.Configuration;
using RigForge.GCommon.Constants;
using RigForge.GCommon.Exceptions;
using RigForge.Models;
using RigForge.Services;
using RigForge.Services.Contracts;

using static RigForge.GCommon.Models.UserValidation;

namespace RigForge;

public class Program
{
    public static async Task Main(string[] args)
    {
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

        if (string.IsNullOrWhiteSpace(jwtOptions.Key))
        {
            throw new JwtConfigurationNotFound("JWT signing key not found");
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

        builder.Services.AddControllers();

        builder.Services.AddOpenApi();

        WebApplication app = builder.Build();

        using (IServiceScope scope = app.Services.CreateScope())
        {
            IIdentitySeeder seeder = scope.ServiceProvider
                .GetRequiredService<IIdentitySeeder>();

            await seeder.SeedAsync();
        }

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        await app.RunAsync();
    }
}
