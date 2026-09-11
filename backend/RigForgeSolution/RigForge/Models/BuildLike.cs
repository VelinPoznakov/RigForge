using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace RigForge.Models;

[PrimaryKey(nameof(BuildId), nameof(UserId))]
public class BuildLike
{
    public Guid BuildId { get; set; }

    [ForeignKey(nameof(BuildId))]
    public virtual Build Build { get; set; } = null!;

    public Guid UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
