using System.ComponentModel.DataAnnotations;

using static RigForge.GCommon.Models.UserValidation;

namespace RigForge.Dtos.Auth;

public class LoginRequestDto
{
    [Required(ErrorMessage = EmailRequiredMessage)]
    [EmailAddress(ErrorMessage = EmailInvalidMessage)]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = PasswordMessage)]
    public string Password { get; set; } = null!;
}
