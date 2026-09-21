namespace RigForge.Dtos.Builds;

public class BuildDetailsDto : BuildListItemDto
{
    public string Description { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }
}
