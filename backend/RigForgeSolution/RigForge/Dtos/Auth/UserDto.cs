namespace RigForge.Dtos.Auth;

public class UserDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string Username { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public IReadOnlyCollection<string> Roles { get; set; } = Array.Empty<string>();
}
