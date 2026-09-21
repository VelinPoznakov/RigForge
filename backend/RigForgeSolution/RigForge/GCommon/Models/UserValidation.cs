namespace RigForge.GCommon.Models;

public static class UserValidation
{
    public const int EmailMaxLength = 120;
    public const string EmailRequiredMessage = "Enter a valid email address.";
    public const string EmailInvalidMessage = "Enter a valid email address.";
    public const string EmailTakenMessage = "That email is already registered.";

    public const int UsernameMinLength = 3;
    public const int UsernameMaxLength = 20;
    public const string UsernamePattern = @"^[a-zA-Z0-9._-]+$";
    public const string UsernameMessage = "Username must be 3–20 characters.";
    public const string UsernameTakenMessage = "That username is already taken.";

    public const int PasswordMinLength = 6;
    public const string PasswordPattern = @"^(?=.*\d).{6,}$";
    public const string PasswordMessage = "Password must be at least 6 characters and contain a number.";

    public const string ConfirmPasswordMessage = "Passwords do not match.";

    public const string InvalidCredentialsMessage = "Invalid email or password.";
    public const string InvalidTokenMessage = "Your session is no longer valid.";
    public const string AccountLockedMessage = "Too many failed attempts. Try again in a few minutes.";

    public const string UserNotFoundMessage = "User not found.";
}
