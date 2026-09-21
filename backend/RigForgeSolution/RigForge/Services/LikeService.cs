using Microsoft.EntityFrameworkCore;
using RigForge.Data;
using RigForge.Models;
using RigForge.Services.Contracts;

namespace RigForge.Services;

public class LikeService : ILikeService
{
    private readonly AppDbContext dbContext;

    public LikeService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<bool> LikeAsync(Guid buildId, Guid userId)
    {
        bool buildExists = await this.dbContext.Builds
            .AnyAsync(b => b.Id == buildId);

        if (!buildExists)
        {
            return false;
        }

        if (await this.IsLikedAsync(buildId, userId))
        {
            return true;
        }

        BuildLike like = new BuildLike
        {
            BuildId = buildId,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        await this.dbContext.BuildLikes.AddAsync(like);

        try
        {
            await this.dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            this.dbContext.Entry(like).State = EntityState.Detached;

            if (!await this.IsLikedAsync(buildId, userId))
            {
                throw;
            }
        }

        return true;
    }

    public async Task<bool> UnlikeAsync(Guid buildId, Guid userId)
    {
        bool buildExists = await this.dbContext.Builds
            .AnyAsync(b => b.Id == buildId);

        if (!buildExists)
        {
            return false;
        }

        BuildLike? like = await this.dbContext.BuildLikes
            .FirstOrDefaultAsync(l => l.BuildId == buildId && l.UserId == userId);

        if (like == null)
        {
            return true;
        }

        this.dbContext.BuildLikes.Remove(like);

        try
        {
            await this.dbContext.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            this.dbContext.Entry(like).State = EntityState.Detached;
        }

        return true;
    }

    private async Task<bool> IsLikedAsync(Guid buildId, Guid userId)
    {
        return await this.dbContext.BuildLikes
            .AnyAsync(l => l.BuildId == buildId && l.UserId == userId);
    }
}
