using RigForge.GCommon.Extensions;
using RigForge.Services.Contracts;

namespace RigForge.Services;

public class ImageStorageService : IImageStorageService
{
    private readonly IWebHostEnvironment environment;
    private readonly ILogger<ImageStorageService> logger;

    public ImageStorageService(
        IWebHostEnvironment environment,
        ILogger<ImageStorageService> logger)
    {
        this.environment = environment;
        this.logger = logger;
    }

    public async Task<string?> SaveAsync(IFormFile file)
    {
        string webRootPath = this.GetWebRootPath();

        if (!Directory.Exists(webRootPath))
        {
            Directory.CreateDirectory(webRootPath);
        }

        if (file.FileName.Split('.').Length != 2)
        {
            return null;
        }

        string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        string fileName = $"{Guid.NewGuid()}{extension}";
        string filePath = Path.Combine(webRootPath, fileName);

        await using (FileStream stream = new FileStream(filePath, FileMode.CreateNew))
        {
            await file.CopyToAsync(stream);
        }

        string imageUrl = $"/{fileName}";

        this.logger.LogInformation(
            "Saved image {ImageUrl} ({Length} bytes).", imageUrl, file.Length);

        return imageUrl;
    }

    public void Delete(string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl) || !imageUrl.StartsWith('/'))
        {
            return;
        }

        string webRootPath = this.GetWebRootPath();
        string filePath = Path.GetFullPath(
            Path.Combine(webRootPath, ToSystemPath(imageUrl.TrimStart('/'))));

        if (!filePath.StartsWith(
                webRootPath + Path.DirectorySeparatorChar,
                StringComparison.OrdinalIgnoreCase))
        {
            this.logger.LogWarning(
                "Refused to delete {ImageUrl}: it resolves outside the web root.", imageUrl);

            return;
        }

        try
        {
            if (!File.Exists(filePath))
            {
                return;
            }

            File.Delete(filePath);

            this.logger.LogInformation("Deleted image {ImageUrl}.", imageUrl);
        }
        catch (Exception exception) when (exception is IOException or UnauthorizedAccessException)
        {
            this.logger.LogWarning(exception, "Could not delete image {ImageUrl}.", imageUrl);
        }
    }

    private string GetWebRootPath()
    {
        return Path.TrimEndingDirectorySeparator(
            Path.GetFullPath(this.environment.GetWebRootPath()));
    }

    private static string ToSystemPath(string path)
    {
        return path.Replace('/', Path.DirectorySeparatorChar);
    }
}
