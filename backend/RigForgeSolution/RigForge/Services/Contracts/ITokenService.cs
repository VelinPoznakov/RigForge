using RigForge.Models;

namespace RigForge.Services.Contracts;

public interface ITokenService
{
    string GenerateAccessToken(User user, IEnumerable<string> roles);
}
