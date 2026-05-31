using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Public;

[ApiController]
[Route("api/gallery")]
[EnableRateLimiting("public")]
public class GalleryController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetPublic()
    {
        var images = await service.GalleryImageService.GetPublicAsync(false);
        return Ok(images);
    }
}
