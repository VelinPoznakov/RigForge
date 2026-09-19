using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RigForge.GCommon.Configuration;
using RigForge.GCommon.Constants;
using RigForge.Models;
using RigForge.Services.Contracts;

namespace RigForge.Services;

public class TokenService : ITokenService
{
    private readonly JwtOptions jwtOptions;

    public TokenService(IOptions<JwtOptions> jwtOptions)
    {
        this.jwtOptions = jwtOptions.Value;
    }

    public string GenerateAccessToken(User user, IEnumerable<string> roles)
    {
        DateTime issuedAt = DateTime.UtcNow;
        DateTime expiresAt = issuedAt.AddMinutes(this.jwtOptions.AccessTokenMinutes);

        List<Claim> claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            new Claim(JwtClaimNames.Username, user.UserName!),
            new Claim(
                JwtRegisteredClaimNames.Iat,
                EpochTime.GetIntDate(issuedAt).ToString(),
                ClaimValueTypes.Integer64)
        };

        foreach (string role in roles)
        {
            claims.Add(new Claim(JwtClaimNames.Role, role));
        }

        SymmetricSecurityKey signingKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(this.jwtOptions.Key));

        SigningCredentials signingCredentials = new SigningCredentials(
            signingKey, SecurityAlgorithms.HmacSha256);

        JwtSecurityToken token = new JwtSecurityToken(
            issuer: this.jwtOptions.Issuer,
            audience: this.jwtOptions.Audience,
            claims: claims,
            notBefore: issuedAt,
            expires: expiresAt,
            signingCredentials: signingCredentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
