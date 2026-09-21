using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using RigForge.Data;
using RigForge.Dtos.Builds;
using RigForge.Dtos.Common;
using RigForge.GCommon.Enums;
using RigForge.GCommon.Exceptions;
using RigForge.Models;
using RigForge.Services.Contracts;

using static RigForge.GCommon.Models.BuildValidation;

namespace RigForge.Services;

public class BuildService : IBuildService
{
    private readonly AppDbContext dbContext;
    private readonly IImageStorageService imageStorageService;

    public BuildService(
        AppDbContext dbContext,
        IImageStorageService imageStorageService)
    {
        this.dbContext = dbContext;
        this.imageStorageService = imageStorageService;
    }

    public async Task<PagedResponseDto<BuildListItemDto>> GetAllAsync(
        BuildQueryDto query,
        Guid? currentUserId)
    {
        IQueryable<Build> builds = this.dbContext
            .Builds
            .AsNoTracking()
            .Include(o => o.Owner);

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            string search = query.Search.Trim();

            builds = builds.Where(b => b.Title.Contains(search)
                || b.Cpu.Contains(search)
                || b.Gpu.Contains(search));
        }

        if (query.Purpose != null)
        {
            Purpose purpose = query.Purpose.Value;

            builds = builds.Where(b => b.Purpose == purpose);
        }

        if (query.MinPrice != null)
        {
            decimal minPrice = query.MinPrice.Value;

            builds = builds.Where(b => b.PriceEur >= minPrice);
        }

        if (query.MaxPrice != null)
        {
            decimal maxPrice = query.MaxPrice.Value;

            builds = builds.Where(b => b.PriceEur <= maxPrice);
        }

        int totalCount = await builds.CountAsync();

        List<BuildListItemDto> items = await ApplySort(builds, query.Sort)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(ToListItemDto(currentUserId))
            .ToListAsync();

        return new PagedResponseDto<BuildListItemDto>
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize)
        };
    }

    public async Task<PagedResponseDto<BuildListItemDto>?> GetByOwnerAsync(
        Guid ownerId,
        PaginationQueryDto query,
        Guid? currentUserId)
    {
        bool ownerExists = await this.dbContext.Users
            .AnyAsync(u => u.Id == ownerId);

        if (!ownerExists)
        {
            return null;
        }

        IQueryable<Build> builds = this.dbContext.Builds
            .AsNoTracking()
            .Where(b => b.OwnerId == ownerId);

        int totalCount = await builds.CountAsync();

        List<BuildListItemDto> items = await ApplySort(builds, BuildSort.Newest)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(ToListItemDto(currentUserId))
            .ToListAsync();

        return new PagedResponseDto<BuildListItemDto>
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize)
        };
    }

    public async Task<BuildDetailsDto?> GetByIdAsync(Guid id, Guid? currentUserId)
    {
        return await this.dbContext.Builds
            .AsNoTracking()
            .Where(b => b.Id == id)
            .Select(ToDetailsDto(currentUserId))
            .FirstOrDefaultAsync();
    }

    public async Task<Guid?> GetOwnerIdAsync(Guid id)
    {
        return await this.dbContext.Builds
            .AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => (Guid?)b.OwnerId)
            .FirstOrDefaultAsync();
    }

    public async Task CreateAsync(BuildCreateRequestDto request, Guid ownerId)
    {

        string? imageUrl = await this.imageStorageService
            .SaveAsync(request.Image);

        if (imageUrl == null)
        {
            throw new FileCreationException(InvalidImageMessage);
        }
        
        Build build = new Build
        {
            ImageUrl = imageUrl,
            OwnerId = ownerId,
            CreatedAt = DateTime.UtcNow
        };

        MapRequest(request, build);
        
        await this.dbContext.Builds.AddAsync(build);

        await this.dbContext.SaveChangesAsync();
            
    }

    public async Task<bool> UpdateAsync(Guid id, BuildUpdateRequestDto request)
    {
        Build? build = await this.dbContext.Builds
            .FirstOrDefaultAsync(b => b.Id == id);

        if (build == null)
        {
            return false;
        }

        string previousImageUrl = build.ImageUrl;
        string? newImageUrl = null;

        if (request.Image != null)
        {
            newImageUrl = await this.imageStorageService
                .SaveAsync(request.Image);

            if (newImageUrl == null)
            {
                throw new FileCreationException(InvalidImageMessage);
            }

            build.ImageUrl = newImageUrl;
        }

        MapRequest(request, build);

        build.UpdatedAt = DateTime.UtcNow;

        try
        {
            await this.dbContext.SaveChangesAsync();
        }
        catch
        {
            if (newImageUrl != null)
            {
                this.imageStorageService.Delete(newImageUrl);
            }

            throw;
        }

        if (newImageUrl != null)
        {
            this.imageStorageService.Delete(previousImageUrl);
        }

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        Build? build = await this.dbContext.Builds
            .FirstOrDefaultAsync(b => b.Id == id);

        if (build == null)
        {
            return false;
        }

        string imageUrl = build.ImageUrl;

        this.dbContext.Builds.Remove(build);

        await this.dbContext.SaveChangesAsync();

        this.imageStorageService.Delete(imageUrl);

        return true;
    }

    private static void MapRequest(BuildRequestDto request, Build build)
    {
        build.Title = request.Title;
        build.Purpose = request.Purpose;
        build.Cpu = request.Cpu;
        build.Gpu = request.Gpu;
        build.Ram = request.Ram;
        build.Storage = request.Storage;
        build.Psu = request.Psu;
        build.PriceEur = Math.Round(request.PriceEur, PriceScale, MidpointRounding.AwayFromZero);
        build.Description = request.Description;
    }

    private static IQueryable<Build> ApplySort(IQueryable<Build> builds, BuildSort sort)
    {
        return sort switch
        {
            BuildSort.Oldest => builds
                .OrderBy(b => b.CreatedAt)
                .ThenBy(b => b.Id),

            BuildSort.MostLiked => builds
                .OrderByDescending(b => b.Likes.Count)
                .ThenByDescending(b => b.CreatedAt)
                .ThenBy(b => b.Id),

            BuildSort.PriceAscending => builds
                .OrderBy(b => b.PriceEur)
                .ThenByDescending(b => b.CreatedAt)
                .ThenBy(b => b.Id),

            BuildSort.PriceDescending => builds
                .OrderByDescending(b => b.PriceEur)
                .ThenByDescending(b => b.CreatedAt)
                .ThenBy(b => b.Id),

            _ => builds
                .OrderByDescending(b => b.CreatedAt)
                .ThenBy(b => b.Id)
        };
    }

    private static Expression<Func<Build, BuildListItemDto>> ToListItemDto(Guid? currentUserId)
    {
        return b => new BuildListItemDto
        {
            Id = b.Id,
            Title = b.Title,
            Purpose = b.Purpose,
            ImageUrl = b.ImageUrl,
            Cpu = b.Cpu,
            Gpu = b.Gpu,
            Ram = b.Ram,
            Storage = b.Storage,
            Psu = b.Psu,
            PriceEur = b.PriceEur,
            Owner = new UserSummaryDto
            {
                Id = b.Owner.Id,
                Username = b.Owner.UserName!
            },
            LikesCount = b.Likes.Count,
            CommentsCount = b.Comments.Count,
            IsLikedByCurrentUser = currentUserId != null
                && b.Likes.Any(l => l.UserId == currentUserId),
            CreatedAt = b.CreatedAt
        };
    }

    private static Expression<Func<Build, BuildDetailsDto>> ToDetailsDto(Guid? currentUserId)
    {
        return b => new BuildDetailsDto
        {
            Id = b.Id,
            Title = b.Title,
            Purpose = b.Purpose,
            ImageUrl = b.ImageUrl,
            Cpu = b.Cpu,
            Gpu = b.Gpu,
            Ram = b.Ram,
            Storage = b.Storage,
            Psu = b.Psu,
            PriceEur = b.PriceEur,
            Description = b.Description,
            Owner = new UserSummaryDto
            {
                Id = b.Owner.Id,
                Username = b.Owner.UserName!
            },
            LikesCount = b.Likes.Count,
            CommentsCount = b.Comments.Count,
            IsLikedByCurrentUser = currentUserId != null
                && b.Likes.Any(l => l.UserId == currentUserId),
            CreatedAt = b.CreatedAt,
            UpdatedAt = b.UpdatedAt
        };
    }
}
