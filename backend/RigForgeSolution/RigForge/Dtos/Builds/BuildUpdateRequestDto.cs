using RigForge.GCommon.Attributes;

using static RigForge.GCommon.Models.BuildValidation;

namespace RigForge.Dtos.Builds;

public class BuildUpdateRequestDto : BuildRequestDto
{
    [ImageFile(ImageMaxSizeBytes, ErrorMessage = ImageMessage)]
    public IFormFile? Image { get; set; }
}
