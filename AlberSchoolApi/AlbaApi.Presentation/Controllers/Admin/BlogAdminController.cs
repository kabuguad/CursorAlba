using Entities.Models.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/blog")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class BlogAdminController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var posts = await service.BlogPostService.GetAllAsync(false);
        return Ok(posts);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var post = await service.BlogPostService.GetByIdAsync(id, false);
        if (post == null) return NotFound();
        return Ok(post);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBlogPostDto dto)
    {
        var slug = GenerateSlug(dto.Title);
        var post = new BlogPost
        {
            Title = dto.Title,
            Slug = slug,
            Content = dto.Content,
            Summary = dto.Summary,
            CoverImageUrl = dto.CoverImageUrl,
            AuthorId = dto.Author,
            IsPublished = dto.IsPublished,
            PublishedAt = dto.IsPublished ? DateTime.UtcNow : null,
        };
        var created = await service.BlogPostService.CreateAsync(post);
        return StatusCode(201, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateBlogPostDto dto)
    {
        var slug = GenerateSlug(dto.Title);
        var post = new BlogPost
        {
            Title = dto.Title,
            Slug = slug,
            Content = dto.Content,
            Summary = dto.Summary,
            CoverImageUrl = dto.CoverImageUrl,
            AuthorId = dto.Author,
            IsPublished = dto.IsPublished,
            PublishedAt = dto.IsPublished ? DateTime.UtcNow : null,
        };
        await service.BlogPostService.UpdateAsync(id, post);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await service.BlogPostService.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("{id:int}/publish")]
    public async Task<IActionResult> TogglePublish(int id)
    {
        var post = await service.BlogPostService.GetByIdAsync(id, false);
        if (post == null) return NotFound();

        var updated = new BlogPost
        {
            Title = post.Title,
            Slug = post.Slug,
            Content = post.Content,
            Summary = post.Summary,
            CoverImageUrl = post.CoverImageUrl,
            AuthorId = post.AuthorId,
            IsPublished = !post.IsPublished,
            PublishedAt = !post.IsPublished ? DateTime.UtcNow : post.PublishedAt,
        };
        await service.BlogPostService.UpdateAsync(id, updated);
        return Ok(new { isPublished = updated.IsPublished });
    }

    private static string GenerateSlug(string title)
    {
        var slug = title.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "")
            .Replace(",", "")
            .Replace(".", "")
            .Replace("!", "")
            .Replace("?", "");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-+", "-").Trim('-');
        return $"{slug}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
    }
}

public record CreateBlogPostDto(
    string Title,
    string Content,
    string? Summary,
    string? CoverImageUrl,
    string? Author,
    bool IsPublished,
    string? Category);
