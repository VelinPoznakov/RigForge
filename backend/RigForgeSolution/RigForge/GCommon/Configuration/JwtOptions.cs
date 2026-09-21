namespace RigForge.GCommon.Configuration;

public class JwtOptions
{
    public const int KeyMinBytes = 32;

    public string Issuer { get; set; } = null!;

    public string Audience { get; set; } = null!;

    public string Key { get; set; } = null!;

    public int AccessTokenMinutes { get; set; }
}
