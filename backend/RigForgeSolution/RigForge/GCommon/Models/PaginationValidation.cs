namespace RigForge.GCommon.Models;

public static class PaginationValidation
{
    public const int DefaultPage = 1;
    public const int PageMin = 1;
    public const int PageMax = 100000;
    public const string PageMessage = "Page must be a positive number.";

    public const int DefaultPageSize = 12;
    public const int PageSizeMin = 1;
    public const int PageSizeMax = 50;
    public const string PageSizeMessage = "Page size must be between 1 and 50.";
}
