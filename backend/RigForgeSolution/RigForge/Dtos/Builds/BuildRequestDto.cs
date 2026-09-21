using System.ComponentModel.DataAnnotations;
using RigForge.Models;

using static RigForge.GCommon.Models.BuildValidation;

namespace RigForge.Dtos.Builds;

public abstract class BuildRequestDto
{
    [Required(ErrorMessage = TitleMessage)]
    [MinLength(TitleMinLength, ErrorMessage = TitleMessage)]
    [MaxLength(TitleMaxLength, ErrorMessage = TitleMessage)]
    public string Title { get; set; } = null!;

    [EnumDataType(typeof(Purpose), ErrorMessage = PurposeMessage)]
    public Purpose Purpose { get; set; }

    [Required(ErrorMessage = ComponentMessage)]
    [MinLength(ComponentMinLength, ErrorMessage = ComponentMessage)]
    [MaxLength(ComponentMaxLength, ErrorMessage = ComponentMessage)]
    public string Cpu { get; set; } = null!;

    [Required(ErrorMessage = ComponentMessage)]
    [MinLength(ComponentMinLength, ErrorMessage = ComponentMessage)]
    [MaxLength(ComponentMaxLength, ErrorMessage = ComponentMessage)]
    public string Gpu { get; set; } = null!;

    [Required(ErrorMessage = ComponentMessage)]
    [MinLength(ComponentMinLength, ErrorMessage = ComponentMessage)]
    [MaxLength(ComponentMaxLength, ErrorMessage = ComponentMessage)]
    public string Ram { get; set; } = null!;

    [Required(ErrorMessage = ComponentMessage)]
    [MinLength(ComponentMinLength, ErrorMessage = ComponentMessage)]
    [MaxLength(ComponentMaxLength, ErrorMessage = ComponentMessage)]
    public string Storage { get; set; } = null!;

    [Required(ErrorMessage = PsuMessage)]
    [MinLength(PsuMinLength, ErrorMessage = PsuMessage)]
    [MaxLength(PsuMaxLength, ErrorMessage = PsuMessage)]
    public string Psu { get; set; } = null!;

    [Range(typeof(decimal), PriceMinText, PriceMaxText, ErrorMessage = PriceMessage)]
    public decimal PriceEur { get; set; }

    [Required(ErrorMessage = DescriptionMessage)]
    [MinLength(DescriptionMinLength, ErrorMessage = DescriptionMessage)]
    [MaxLength(DescriptionMaxLength, ErrorMessage = DescriptionMaxMessage)]
    public string Description { get; set; } = null!;
}
