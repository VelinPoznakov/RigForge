using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using RigForge.Data;
using RigForge.Dtos.Comments;
using RigForge.Dtos.Common;
using RigForge.Models;
using RigForge.Services.Contracts;

namespace RigForge.Services;

public class CommentService : ICommentService
{
    private static readonly Expression<Func<Comment, CommentDto>> _toCommentDto = c => new CommentDto
    {
        Id = c.Id,
        BuildId = c.BuildId,
        Text = c.Text,
        Author = new UserSummaryDto
        {
            Id = c.Author.Id,
            Username = c.Author.UserName!
        },
        CreatedAt = c.CreatedAt,
        UpdatedAt = c.UpdatedAt
    };

    private readonly AppDbContext dbContext;

    public CommentService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<PagedResponseDto<CommentDto>?> GetByBuildIdAsync(
        Guid buildId,
        PaginationQueryDto query)
    {
        bool buildExists = await this.dbContext.Builds
            .AnyAsync(b => b.Id == buildId);

        if (!buildExists)
        {
            return null;
        }

        IQueryable<Comment> comments = this.dbContext.Comments
            .AsNoTracking()
            .Where(c => c.BuildId == buildId);

        int totalCount = await comments.CountAsync();

        List<CommentDto> items = await comments
            .OrderByDescending(c => c.CreatedAt)
            .ThenBy(c => c.Id)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(_toCommentDto)
            .ToListAsync();

        return new PagedResponseDto<CommentDto>
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)query.PageSize)
        };
    }

    public async Task<Guid?> CreateAsync(
        Guid buildId,
        CommentRequestDto request,
        Guid authorId)
    {
        bool buildExists = await this.dbContext.Builds
            .AnyAsync(b => b.Id == buildId);

        if (!buildExists)
        {
            return null;
        }

        Comment comment = new Comment
        {
            BuildId = buildId,
            AuthorId = authorId,
            Text = request.Text,
            CreatedAt = DateTime.UtcNow
        };

        await this.dbContext.Comments.AddAsync(comment);

        await this.dbContext.SaveChangesAsync();

        return comment.Id;
    }

    public async Task<Guid?> GetAuthorIdAsync(Guid id)
    {
        return await this.dbContext.Comments
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => (Guid?)c.AuthorId)
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateAsync(Guid id, CommentRequestDto request)
    {
        Comment? comment = await this.dbContext.Comments
            .FirstOrDefaultAsync(c => c.Id == id);

        if (comment == null)
        {
            return false;
        }

        comment.Text = request.Text;
        comment.UpdatedAt = DateTime.UtcNow;

        await this.dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        Comment? comment = await this.dbContext.Comments
            .FirstOrDefaultAsync(c => c.Id == id);

        if (comment == null)
        {
            return false;
        }

        this.dbContext.Comments.Remove(comment);

        await this.dbContext.SaveChangesAsync();

        return true;
    }
}
