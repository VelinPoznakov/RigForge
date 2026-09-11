using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace RigForge.Models;

public class User : IdentityUser<Guid>
{
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Build> Builds { get; set; } = new List<Build>();

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<BuildLike> Likes { get; set; } = new List<BuildLike>();
}
