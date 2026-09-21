namespace RigForge.GCommon.Models;

public static class CommentValidation
{
    public const int TextMinLength = 3;
    public const int TextMaxLength = 300;
    public const string TextMessage = "Comment must be between 3 and 300 characters.";

    public const string CommentNotFoundMessage = "Comment not found.";
    public const string CommentForbiddenMessage = "You can only change your own comments.";
}
