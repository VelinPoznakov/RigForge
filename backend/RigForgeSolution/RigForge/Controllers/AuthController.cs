using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RigForge.Dtos.Auth;
using RigForge.GCommon.Constants;
using RigForge.GCommon.Extensions;
using RigForge.Models;
using RigForge.Services.Contracts;

using static RigForge.GCommon.Models.UserValidation;

namespace RigForge.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<User> userManager;
    private readonly ITokenService tokenService;
    private readonly ILogger<AuthController> logger;

    public AuthController(
        UserManager<User> userManager,
        ITokenService tokenService,
        ILogger<AuthController> logger)
    {
        this.userManager = userManager;
        this.tokenService = tokenService;
        this.logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDto request)
    {
        string email = request.Email.ToLowerInvariant();

        User? existing = await this.userManager.FindByEmailAsync(email);

        if (existing is not null)
        {
            this.logger.LogWarning(
                "Registration rejected: {Email} is already registered.", email);

            return Conflict(new { message = EmailTakenMessage });
        }

        User user = new User
        {
            Email = email,
            UserName = request.Username
        };

        IdentityResult result = await this.userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            this.logger.LogWarning(
                "Registration failed for {Email}: {ErrorCodes}",
                email,
                string.Join(", ", result.Errors.Select(error => error.Code)));

            this.AddIdentityErrors(result);

            return ValidationProblem(ModelState);
        }

        IdentityResult roleResult = await this.userManager
            .AddToRoleAsync(user, ApplicationRoles.User);

        if (!roleResult.Succeeded)
        {
            this.logger.LogError(
                "User {UserId} was created but could not be granted {Role}: {ErrorCodes}",
                user.Id,
                ApplicationRoles.User,
                string.Join(", ", roleResult.Errors.Select(error => error.Code)));
        }

        this.logger.LogInformation("User {UserId} registered.", user.Id);

        AuthResponseDto response = await this.BuildAuthResponseAsync(user);

        return StatusCode(StatusCodes.Status201Created, response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        string email = request.Email.ToLowerInvariant();

        User? user = await this.userManager.FindByEmailAsync(email);

        if (user is null)
        {
            this.logger.LogWarning("Login failed for {Email}: no such user.", email);

            return Unauthorized(new { message = InvalidCredentialsMessage });
        }

        bool passwordValid = await this.userManager.CheckPasswordAsync(user, request.Password);

        if (!passwordValid)
        {
            this.logger.LogWarning(
                "Login failed for user {UserId}: wrong password.", user.Id);

            return Unauthorized(new { message = InvalidCredentialsMessage });
        }

        this.logger.LogInformation("User {UserId} logged in.", user.Id);

        AuthResponseDto response = await this.BuildAuthResponseAsync(user);

        return Ok(response);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        Guid? userId = User.GetUserId();

        if (userId is null)
        {
            this.logger.LogWarning("Token accepted but carries no usable subject claim.");

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        User? user = await this.userManager.FindByIdAsync(userId.Value.ToString());

        if (user is null)
        {
            this.logger.LogWarning(
                "Token references user {UserId}, which no longer exists.", userId.Value);

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        IList<string> roles = await this.userManager.GetRolesAsync(user);

        return Ok(new MeResponseDto
        {
            User = MapUser(user, roles)
        });
    }

    private async Task<AuthResponseDto> BuildAuthResponseAsync(User user)
    {
        IList<string> roles = await this.userManager.GetRolesAsync(user);

        return new AuthResponseDto
        {
            Token = this.tokenService.GenerateAccessToken(user, roles),
            User = MapUser(user, roles)
        };
    }

    private void AddIdentityErrors(IdentityResult result)
    {
        foreach (IdentityError error in result.Errors)
        {
            string key = error.Code switch
            {
                string code when code.Contains("Password") => nameof(RegisterRequestDto.Password),
                string code when code.Contains("UserName") => nameof(RegisterRequestDto.Username),
                string code when code.Contains("Email") => nameof(RegisterRequestDto.Email),
                _ => string.Empty
            };

            ModelState.AddModelError(key, error.Description);
        }
    }

    private static UserDto MapUser(User user, IEnumerable<string> roles)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email!,
            Username = user.UserName!,
            CreatedAt = user.CreatedAt,
            Roles = roles.ToArray()
        };
    }
}
