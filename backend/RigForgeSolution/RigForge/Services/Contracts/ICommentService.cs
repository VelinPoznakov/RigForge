using RigForge.Dtos.Comments;
using RigForge.Dtos.Common;

namespace RigForge.Services.Contracts;

public interface ICommentService
{
    Task<PagedResponseDto<CommentDto>?> GetByBuildIdAsync(Guid buildId, PaginationQueryDto query);

    Task<Guid?> CreateAsync(Guid buildId, CommentRequestDto request, Guid authorId);

    Task<Guid?> GetAuthorIdAsync(Guid id);

    Task<bool> UpdateAsync(Guid id, CommentRequestDto request);

    Task<bool> DeleteAsync(Guid id);
}
