using RigForge.Dtos.Common;

namespace RigForge.Dtos.Comments;

public class CommentDto
{
    public Guid Id { get; set; }

    public Guid BuildId { get; set; }

    public string Text { get; set; } = null!;

    public UserSummaryDto Author { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
