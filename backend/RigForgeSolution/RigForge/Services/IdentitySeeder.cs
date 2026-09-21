using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using RigForge.GCommon.Configuration;
using RigForge.GCommon.Constants;
using RigForge.Models;
using RigForge.Services.Contracts;

namespace RigForge.Services;

public class IdentitySeeder : IIdentitySeeder
{
    private readonly RoleManager<IdentityRole<Guid>> roleManager;
    private readonly UserManager<User> userManager;
    private readonly AdminOptions adminOptions;
    private readonly ILogger<IdentitySeeder> logger;

    public IdentitySeeder(
        RoleManager<IdentityRole<Guid>> roleManager,
        UserManager<User> userManager,
        IOptions<AdminOptions> adminOptions,
        ILogger<IdentitySeeder> logger)
    {
        this.roleManager = roleManager;
        this.userManager = userManager;
        this.adminOptions = adminOptions.Value;
        this.logger = logger;
    }

    public async Task SeedAsync()
    {
        await this.SeedRolesAsync();

        await this.SeedAdminAsync();
    }

    private async Task SeedRolesAsync()
    {
        foreach (string role in ApplicationRoles.All)
        {
            if (await this.roleManager.RoleExistsAsync(role))
            {
                continue;
            }

            IdentityResult result = await this.roleManager
                .CreateAsync(new IdentityRole<Guid>(role));

            if (result.Succeeded)
            {
                this.logger.LogInformation("Seeded role {Role}.", role);
            }
            else
            {
                this.logger.LogError(
                    "Failed to seed role {Role}: {ErrorCodes}",
                    role,
                    string.Join(", ", result.Errors.Select(error => error.Code)));
            }
        }
    }

    private async Task SeedAdminAsync()
    {
        if (string.IsNullOrWhiteSpace(this.adminOptions.Email)
            || string.IsNullOrWhiteSpace(this.adminOptions.Username)
            || string.IsNullOrWhiteSpace(this.adminOptions.Password))
        {
            this.logger.LogWarning(
                "Admin account not seeded: the {Section} configuration section is incomplete.",
                ConfigurationSections.Admin);

            return;
        }

        string email = this.adminOptions.Email.ToLowerInvariant();

        User? admin = await this.userManager.FindByEmailAsync(email);

        if (admin == null)
        {
            admin = new User
            {
                Email = email,
                UserName = this.adminOptions.Username
            };

            IdentityResult createResult = await this.userManager
                .CreateAsync(admin, this.adminOptions.Password);

            if (!createResult.Succeeded)
            {
                this.logger.LogError(
                    "Failed to seed the admin account: {ErrorCodes}",
                    string.Join(", ", createResult.Errors.Select(error => error.Code)));

                return;
            }

            this.logger.LogInformation("Seeded admin account {UserId}.", admin.Id);
        }

        if (await this.userManager.IsInRoleAsync(admin, ApplicationRoles.Admin))
        {
            return;
        }

        IdentityResult roleResult = await this.userManager
            .AddToRoleAsync(admin, ApplicationRoles.Admin);

        if (roleResult.Succeeded)
        {
            this.logger.LogInformation(
                "Granted {Role} to admin account {UserId}.",
                ApplicationRoles.Admin,
                admin.Id);
        }
        else
        {
            this.logger.LogError(
                "Failed to grant {Role} to admin account {UserId}: {ErrorCodes}",
                ApplicationRoles.Admin,
                admin.Id,
                string.Join(", ", roleResult.Errors.Select(error => error.Code)));
        }
    }
}
