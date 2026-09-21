using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RigForge.GCommon.Extensions;
using RigForge.Services.Contracts;

using static RigForge.GCommon.Models.BuildValidation;
using static RigForge.GCommon.Models.UserValidation;

namespace RigForge.Controllers;

[ApiController]
[Route("api/builds/{buildId:guid}/like")]
[Authorize]
public class LikesController : ControllerBase
{
    private readonly ILikeService likeService;
    private readonly ILogger<LikesController> logger;

    public LikesController(
        ILikeService likeService,
        ILogger<LikesController> logger)
    {
        this.likeService = likeService;
        this.logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Like(Guid buildId)
    {
        Guid? userId = User.GetUserId();

        if (userId == null)
        {
            this.logger.LogWarning("Token accepted but carries no usable subject claim.");

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        bool liked = await this.likeService.LikeAsync(buildId, userId.Value);

        if (!liked)
        {
            return NotFound(new { message = BuildNotFoundMessage });
        }

        return Ok();
    }

    [HttpDelete]
    public async Task<IActionResult> Unlike(Guid buildId)
    {
        Guid? userId = User.GetUserId();

        if (userId == null)
        {
            this.logger.LogWarning("Token accepted but carries no usable subject claim.");

            return Unauthorized(new { message = InvalidTokenMessage });
        }

        bool unliked = await this.likeService.UnlikeAsync(buildId, userId.Value);

        if (!unliked)
        {
            return NotFound(new { message = BuildNotFoundMessage });
        }

        return Ok();
    }
}
