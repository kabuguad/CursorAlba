using AlbaApi.Presentation.ActionFilters;
using DTOs.Blog;
using Entities.Models.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Public;

[ApiController]
[Route("api/blog")]
[EnableRateLimiting("public")]
public class BlogController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var posts = await service.BlogPostService.GetPublishedAsync(false);
        return Ok(posts);
    }

    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var post = await service.BlogPostService.GetBySlugAsync(slug, false);
        if (post == null)
            return NotFound();
        return Ok(post);
    }
}
