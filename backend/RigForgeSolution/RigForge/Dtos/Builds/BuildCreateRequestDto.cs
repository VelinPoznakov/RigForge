using System.ComponentModel.DataAnnotations;
using RigForge.GCommon.Attributes;

using static RigForge.GCommon.Models.BuildValidation;

namespace RigForge.Dtos.Builds;

public class BuildCreateRequestDto : BuildRequestDto
{
    [Required(ErrorMessage = ImageRequiredMessage)]
    [ImageFile(ImageMaxSizeBytes, ErrorMessage = ImageMessage)]
    public IFormFile Image { get; set; } = null!;
}
