using Microsoft.AspNetCore.Mvc;
using RigForge.Dtos.Builds;
using RigForge.Dtos.Common;
using RigForge.GCommon.Extensions;
using RigForge.Services.Contracts;

using static RigForge.GCommon.Models.UserValidation;

namespace RigForge.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IBuildService buildService;

    public UsersController(IBuildService buildService)
    {
        this.buildService = buildService;
    }

    [HttpGet("{id:guid}/builds")]
    public async Task<IActionResult> GetBuilds(Guid id, [FromQuery] PaginationQueryDto query)
    {
        PagedResponseDto<BuildListItemDto>? builds = await this.buildService
            .GetByOwnerAsync(id, query, User.GetUserId());

        if (builds == null)
        {
            return NotFound(new { message = UserNotFoundMessage });
        }

        return Ok(builds);
    }
}
