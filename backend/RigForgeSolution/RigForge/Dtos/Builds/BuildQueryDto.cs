using System.ComponentModel.DataAnnotations;
using RigForge.Dtos.Common;
using RigForge.GCommon.Enums;
using RigForge.Models;

using static RigForge.GCommon.Models.BuildValidation;

namespace RigForge.Dtos.Builds;

public class BuildQueryDto : PaginationQueryDto
{
    [MaxLength(SearchMaxLength, ErrorMessage = SearchMessage)]
    public string? Search { get; set; }

    [EnumDataType(typeof(Purpose), ErrorMessage = PurposeMessage)]
    public Purpose? Purpose { get; set; }

    [EnumDataType(typeof(BuildSort), ErrorMessage = SortMessage)]
    public BuildSort Sort { get; set; } = BuildSort.Newest;

    [Range(typeof(decimal), PriceMinText, PriceMaxText, ErrorMessage = PriceMessage)]
    public decimal? MinPrice { get; set; }

    [Range(typeof(decimal), PriceMinText, PriceMaxText, ErrorMessage = PriceMessage)]
    public decimal? MaxPrice { get; set; }
}
