using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RigForge.GCommon.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        string? value = principal.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return Guid.TryParse(value, out Guid userId)
            ? userId
            : null;
    }
}
