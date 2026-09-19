using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RigForge.Data;
using RigForge.GCommon.Configuration;
using RigForge.GCommon.Exceptions;
using RigForge.Models;

using static RigForge.GCommon.Models.UserValidation;

namespace RigForge;

public class Program
{
    public static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        string? connectionString = builder
            .Configuration
            .GetConnectionString("Database")
            ?? throw new ConnectionStringNotFound("Database connection string not found");

        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

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

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
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
                    ClockSkew = TimeSpan.Zero
                };
            });

        builder.Services.AddAuthorization();

        builder.Services.AddControllers();

        builder.Services.AddOpenApi();

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}
