using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RigForge.Dtos.Comments;
using RigForge.Dtos.Common;
using RigForge.GCommon.Constants;
using RigForge.GCommon.Extensions;
using RigForge.Services.Contracts;

using static RigForge.GCommon.Models.BuildValidation;
using static RigForge.GCommon.Models.CommentValidation;
using static RigForge.GCommon.Models.UserValidation;

namespace RigForge.Controllers;

[ApiController]
[Route("api")]
public class CommentsController : ControllerBase
{
    private readonly ICommentService commentService;
    private readonly ILogger<CommentsController> logger;

    public CommentsController(
        ICommentService commentService,
        ILogger<CommentsController> logger)
    {
        this.commentService = commentService;
        this.logger = logger;
    }

    [HttpGet("builds/{buildId:guid}/comments")]
    public async Task<IActionResult> GetByBuild(Guid buildId, [FromQuery] PaginationQueryDto query)
    {
        PagedResponseDto<CommentDto>? comments = await this.commentService
            .GetByBuildIdAsync(buildId, query);

        if (comments == null)
        {
            return NotFound(new { message = BuildNotFoundMessage });
        }

        return Ok(comments);
    }

    [HttpPost("builds/{buildId:guid}/comments")]
    [Authorize]
    public async Task<IActionResult> Create(Guid buildId, CommentRequestDto request)
    {
        Guid? userId = User.GetUserId();

        if (userId == null)
        {
            this.logger.LogWarning("Token accepted but carries no usable subject claim.");

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        Guid? commentId = await this.commentService
            .CreateAsync(buildId, request, userId.Value);

        if (commentId == null)
        {
            return NotFound(new { message = BuildNotFoundMessage });
        }

        this.logger.LogInformation(
            "User {UserId} commented {CommentId} on build {BuildId}.",
            userId.Value,
            commentId.Value,
            buildId);

        return StatusCode(StatusCodes.Status201Created);
    }

    [HttpPut("comments/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, CommentRequestDto request)
    {
        Guid? userId = User.GetUserId();

        if (userId == null)
        {
            this.logger.LogWarning("Token accepted but carries no usable subject claim.");

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        Guid? authorId = await this.commentService.GetAuthorIdAsync(id);

        if (authorId == null)
        {
            return NotFound(new { message = CommentNotFoundMessage });
        }

        if (authorId.Value != userId.Value)
        {
            this.logger.LogWarning(
                "User {UserId} tried to edit comment {CommentId} written by {AuthorId}.",
                userId.Value,
                id,
                authorId.Value);

            return StatusCode(StatusCodes.Status403Forbidden, new { message = CommentForbiddenMessage });
        }

        bool updated = await this.commentService.UpdateAsync(id, request);

        if (!updated)
        {
            return NotFound(new { message = CommentNotFoundMessage });
        }

        this.logger.LogInformation("User {UserId} updated comment {CommentId}.", userId.Value, id);

        return Ok();
    }

    [HttpDelete("comments/{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        Guid? userId = User.GetUserId();

        if (userId == null)
        {
            this.logger.LogWarning("Token accepted but carries no usable subject claim.");

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        Guid? authorId = await this.commentService.GetAuthorIdAsync(id);

        if (authorId == null)
        {
            return NotFound(new { message = CommentNotFoundMessage });
        }

        bool isAdmin = User.IsInRole(ApplicationRoles.Admin);

        if (authorId.Value != userId.Value && !isAdmin)
        {
            this.logger.LogWarning(
                "User {UserId} tried to delete comment {CommentId} written by {AuthorId}.",
                userId.Value,
                id,
                authorId.Value);

            return StatusCode(StatusCodes.Status403Forbidden, new { message = CommentForbiddenMessage });
        }

        bool deleted = await this.commentService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new { message = CommentNotFoundMessage });
        }

        if (authorId.Value != userId.Value)
        {
            this.logger.LogInformation(
                "Admin {UserId} deleted comment {CommentId} written by {AuthorId}.",
                userId.Value,
                id,
                authorId.Value);
        }
        else
        {
            this.logger.LogInformation("User {UserId} deleted comment {CommentId}.", userId.Value, id);
        }

        return Ok();
    }
}
