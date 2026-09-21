using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RigForge.Dtos.Builds;
using RigForge.Dtos.Common;
using RigForge.GCommon.Constants;
using RigForge.GCommon.Exceptions;
using RigForge.GCommon.Extensions;
using RigForge.Services.Contracts;

using static RigForge.GCommon.Constants.ErrorMessages;
using static RigForge.GCommon.Models.BuildValidation;
using static RigForge.GCommon.Models.UserValidation;

namespace RigForge.Controllers;

[ApiController]
[Route("api/builds")]
public class BuildsController : ControllerBase
{
    private readonly IBuildService buildService;
    private readonly ILogger<BuildsController> logger;

    public BuildsController(
        IBuildService buildService,
        ILogger<BuildsController> logger)
    {
        this.buildService = buildService;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] BuildQueryDto query)
    {
        PagedResponseDto<BuildListItemDto> builds = await this.buildService
            .GetAllAsync(query, User.GetUserId());

        return Ok(builds);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        BuildDetailsDto? build = await this.buildService
            .GetByIdAsync(id, User.GetUserId());

        if (build == null)
        {
            return NotFound(new { message = BuildNotFoundMessage });
        }

        return Ok(build);
    }

    [HttpPost]
    [Authorize]
    [RequestSizeLimit(ImageRequestSizeLimit)]
    [Consumes(MediaTypeNames.Multipart.FormData)]
    public async Task<IActionResult> Create([FromForm] BuildCreateRequestDto request)
    {
        Guid? userId = User.GetUserId();

        if (userId == null)
        {
            this.logger.LogWarning("Token accepted but carries no usable subject claim.");

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        try
        {
            await this.buildService.CreateAsync(request, userId.Value);
        }
        catch (FileCreationException e)
        {
            return BadRequest(new { message = e.Message });
        }
        catch (Exception e)
        {
            this.logger.LogError(e, "An unexpected error occurred while creating a build for user {UserId}.", userId.Value);

            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = UnexpectedErrorMessage });
        }
        return StatusCode(201);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [RequestSizeLimit(ImageRequestSizeLimit)]
    [Consumes(MediaTypeNames.Multipart.FormData)]
    public async Task<IActionResult> Update(Guid id, [FromForm] BuildUpdateRequestDto request)
    {
        Guid? userId = User.GetUserId();

        if (userId == null)
        {
            this.logger.LogWarning("Token accepted but carries no usable subject claim.");

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        Guid? ownerId = await this.buildService.GetOwnerIdAsync(id);

        if (ownerId == null)
        {
            return NotFound(new { message = BuildNotFoundMessage });
        }

        if (ownerId.Value != userId.Value)
        {
            this.logger.LogWarning(
                "User {UserId} tried to edit build {BuildId} owned by {OwnerId}.",
                userId.Value,
                id,
                ownerId.Value);

            return StatusCode(StatusCodes.Status403Forbidden, new { message = BuildForbiddenMessage });
        }

        bool updated;

        try
        {
            updated = await this.buildService.UpdateAsync(id, request);
        }
        catch (FileCreationException e)
        {
            return BadRequest(new { message = e.Message });
        }
        catch (Exception e)
        {
            this.logger.LogError(e, "An unexpected error occurred while updating build {BuildId} for user {UserId}.", id, userId.Value);

            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = UnexpectedErrorMessage });
        }

        if (!updated)
        {
            return NotFound(new { message = BuildNotFoundMessage });
        }

        this.logger.LogInformation("User {UserId} updated build {BuildId}.", userId.Value, id);

        return Ok();
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        Guid? userId = User.GetUserId();

        if (userId == null)
        {
            this.logger.LogWarning("Token accepted but carries no usable subject claim.");

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        Guid? ownerId = await this.buildService.GetOwnerIdAsync(id);

        if (ownerId == null)
        {
            return NotFound(new { message = BuildNotFoundMessage });
        }

        bool isAdmin = User.IsInRole(ApplicationRoles.Admin);

        if (ownerId.Value != userId.Value && !isAdmin)
        {
            this.logger.LogWarning(
                "User {UserId} tried to delete build {BuildId} owned by {OwnerId}.",
                userId.Value,
                id,
                ownerId.Value);

            return StatusCode(StatusCodes.Status403Forbidden, new { message = BuildForbiddenMessage });
        }

        bool deleted = await this.buildService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new { message = BuildNotFoundMessage });
        }

        if (ownerId.Value != userId.Value)
        {
            this.logger.LogInformation(
                "Admin {UserId} deleted build {BuildId} owned by {OwnerId}.",
                userId.Value,
                id,
                ownerId.Value);
        }
        else
        {
            this.logger.LogInformation("User {UserId} deleted build {BuildId}.", userId.Value, id);
        }

        return Ok();
    }
}
