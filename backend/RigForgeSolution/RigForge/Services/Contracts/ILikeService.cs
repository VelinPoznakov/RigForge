namespace RigForge.Services.Contracts;

public interface ILikeService
{
    Task<bool> LikeAsync(Guid buildId, Guid userId);

    Task<bool> UnlikeAsync(Guid buildId, Guid userId);
}
