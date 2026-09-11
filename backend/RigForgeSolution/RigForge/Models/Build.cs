using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

using static RigForge.GCommon.Models.BuildValidation;

namespace RigForge.Models;

public class Build
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(TitleMaxLength)]
    public string Title { get; set; } = null!;

    [Required]
    public Purpose Purpose { get; set; }

    [Required]
    [MaxLength(ImageUrlMaxLength)]
    public string ImageUrl { get; set; } = null!;

    [Required]
    [MaxLength(ComponentMaxLength)]
    public string Cpu { get; set; } = null!;

    [Required]
    [MaxLength(ComponentMaxLength)]
    public string Gpu { get; set; } = null!;

    [Required]
    [MaxLength(ComponentMaxLength)]
    public string Ram { get; set; } = null!;

    [Required]
    [MaxLength(ComponentMaxLength)]
    public string Storage { get; set; } = null!;

    [Required]
    [MaxLength(PsuMaxLength)]
    public string Psu { get; set; } = null!;

    [Precision(PricePrecision, PriceScale)]
    public decimal PriceEur { get; set; }

    [Required]
    [MaxLength(DescriptionMaxLength)]
    public string Description { get; set; } = null!;

    public Guid OwnerId { get; set; }

    [ForeignKey(nameof(OwnerId))]
    public virtual User Owner { get; set; } = null!;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<BuildLike> Likes { get; set; } = new List<BuildLike>();
}
