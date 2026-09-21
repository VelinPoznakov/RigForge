using System.ComponentModel.DataAnnotations;

using static RigForge.GCommon.Models.UserValidation;

namespace RigForge.Dtos.Auth;

public class RegisterRequestDto
{
    [Required(ErrorMessage = EmailRequiredMessage)]
    [EmailAddress(ErrorMessage = EmailInvalidMessage)]
    [MaxLength(EmailMaxLength, ErrorMessage = EmailInvalidMessage)]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = UsernameMessage)]
    [MinLength(UsernameMinLength, ErrorMessage = UsernameMessage)]
    [MaxLength(UsernameMaxLength, ErrorMessage = UsernameMessage)]
    [RegularExpression(UsernamePattern, ErrorMessage = UsernameMessage)]
    public string Username { get; set; } = null!;

    [Required(ErrorMessage = PasswordMessage)]
    [MinLength(PasswordMinLength, ErrorMessage = PasswordMessage)]
    [RegularExpression(PasswordPattern, ErrorMessage = PasswordMessage)]
    public string Password { get; set; } = null!;

    [Required(ErrorMessage = ConfirmPasswordMessage)]
    [Compare(nameof(Password), ErrorMessage = ConfirmPasswordMessage)]
    public string ConfirmPassword { get; set; } = null!;
}
