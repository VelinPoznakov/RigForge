using RigForge.Dtos.Builds;
using RigForge.Dtos.Common;

namespace RigForge.Services.Contracts;

public interface IBuildService
{
    Task<PagedResponseDto<BuildListItemDto>> GetAllAsync(BuildQueryDto query, Guid? currentUserId);

    Task<PagedResponseDto<BuildListItemDto>?> GetByOwnerAsync(
        Guid ownerId,
        PaginationQueryDto query,
        Guid? currentUserId);

    Task<BuildDetailsDto?> GetByIdAsync(Guid id, Guid? currentUserId);

    Task<Guid?> GetOwnerIdAsync(Guid id);

    Task CreateAsync(BuildCreateRequestDto request, Guid ownerId);

    Task<bool> UpdateAsync(Guid id, BuildUpdateRequestDto request);

    Task<bool> DeleteAsync(Guid id);
}
