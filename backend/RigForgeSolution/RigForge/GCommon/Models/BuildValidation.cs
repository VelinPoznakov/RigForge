namespace RigForge.GCommon.Models;

public static class BuildValidation
{
    public const int TitleMinLength = 5;
    public const int TitleMaxLength = 60;
    public const string TitleMessage = "Title must be between 5 and 60 characters.";

    public const string PurposeMessage = "Choose what this build is for.";

    public const int ImageUrlMaxLength = 500;
    public const string ImageUrlPattern = @"^https://";
    public const string ImageUrlMessage = "Image URL must start with https://";

    public const int ImageMaxSizeBytes = 5 * 1024 * 1024;
    public const long ImageRequestSizeLimit = 6 * 1024 * 1024;
    public const string ImageRequiredMessage = "Upload an image of the build.";
    public const string ImageMessage = "Image must be a JPG, PNG or WEBP file up to 5 MB.";
    public const string InvalidImageMessage = "Invalid image file.";

    public const int ComponentMinLength = 2;
    public const int ComponentMaxLength = 60;
    public const string ComponentMessage = "This field is required.";

    public const int PsuMinLength = 2;
    public const int PsuMaxLength = 60;
    public const string PsuMessage = "This field is required.";

    public const int PricePrecision = 10;
    public const int PriceScale = 2;
    public const decimal PriceMin = 1m;
    public const decimal PriceMax = 100000m;
    public const string PriceMinText = "1";
    public const string PriceMaxText = "100000";
    public const string PriceMessage = "Price must be between 1 and 100 000 €.";

    public const int DescriptionMinLength = 20;
    public const int DescriptionMaxLength = 800;
    public const string DescriptionMessage = "Description must be at least 20 characters.";
    public const string DescriptionMaxMessage = "Description must be at most 800 characters.";

    public const int SearchMaxLength = 60;
    public const string SearchMessage = "Search must be at most 60 characters.";

    public const string SortMessage = "Choose a valid sort order.";

    public const string BuildNotFoundMessage = "Build not found.";
    public const string BuildForbiddenMessage = "You can only change your own builds.";
}
