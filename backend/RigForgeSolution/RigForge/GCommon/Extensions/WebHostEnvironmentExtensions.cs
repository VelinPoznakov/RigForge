using RigForge.GCommon.Constants;

namespace RigForge.GCommon.Extensions;

public static class WebHostEnvironmentExtensions
{
    public static string GetWebRootPath(this IWebHostEnvironment environment)
    {
        return string.IsNullOrWhiteSpace(environment.WebRootPath)
            ? Path.Combine(environment.ContentRootPath, StorageFolders.WebRoot)
            : environment.WebRootPath;
    }
}
