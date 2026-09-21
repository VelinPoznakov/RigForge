using System.ComponentModel.DataAnnotations;

using static RigForge.GCommon.Models.PaginationValidation;

namespace RigForge.Dtos.Common;

public class PaginationQueryDto
{
    [Range(PageMin, PageMax, ErrorMessage = PageMessage)]
    public int Page { get; set; } = DefaultPage;

    [Range(PageSizeMin, PageSizeMax, ErrorMessage = PageSizeMessage)]
    public int PageSize { get; set; } = DefaultPageSize;
}
