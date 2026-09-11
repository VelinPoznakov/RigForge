using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static RigForge.GCommon.Models.CommentValidation;

namespace RigForge.Models;

public class Comment
{
    [Key]
    public Guid Id { get; set; }

    public Guid BuildId { get; set; }

    [ForeignKey(nameof(BuildId))]
    public virtual Build Build { get; set; } = null!;

    public Guid AuthorId { get; set; }

    [ForeignKey(nameof(AuthorId))]
    public virtual User Author { get; set; } = null!;

    [Required]
    [MaxLength(TextMaxLength)]
    public string Text { get; set; } = null!;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
