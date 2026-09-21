using RigForge.Dtos.Common;
using RigForge.Models;

namespace RigForge.Dtos.Builds;

public class BuildListItemDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = null!;

    public Purpose Purpose { get; set; }

    public string ImageUrl { get; set; } = null!;

    public string Cpu { get; set; } = null!;

    public string Gpu { get; set; } = null!;

    public string Ram { get; set; } = null!;

    public string Storage { get; set; } = null!;

    public string Psu { get; set; } = null!;

    public decimal PriceEur { get; set; }

    public UserSummaryDto Owner { get; set; } = null!;

    public int LikesCount { get; set; }

    public int CommentsCount { get; set; }

    public bool IsLikedByCurrentUser { get; set; }

    public DateTime CreatedAt { get; set; }
}
