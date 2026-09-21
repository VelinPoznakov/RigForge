using System.ComponentModel.DataAnnotations;

using static RigForge.GCommon.Models.CommentValidation;

namespace RigForge.Dtos.Comments;

public class CommentRequestDto
{
    [Required(ErrorMessage = TextMessage)]
    [MinLength(TextMinLength, ErrorMessage = TextMessage)]
    [MaxLength(TextMaxLength, ErrorMessage = TextMessage)]
    public string Text { get; set; } = null!;
}
