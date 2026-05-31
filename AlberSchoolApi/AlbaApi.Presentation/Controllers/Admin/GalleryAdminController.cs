using Entities.Models.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/gallery")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class GalleryAdminController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var images = await service.GalleryImageService.GetAllAsync(false);
        return Ok(images);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] UpsertGalleryImageDto dto)
    {
        var image = new GalleryImage
        {
            Url = dto.Url,
            Caption = dto.Caption,
            Category = dto.Category,
            SortOrder = dto.SortOrder,
            IsPublic = dto.IsPublic,
        };
        var created = await service.GalleryImageService.AddAsync(image);
        return StatusCode(201, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertGalleryImageDto dto,
        [FromServices] Contracts.Repositories.IRepositoryManager repo)
    {
        var existing = await repo.GalleryImageRepository
            .FindByCondition(g => g.Id == id, true)
            .FirstOrDefaultAsync();
        if (existing == null) return NotFound();

        existing.Url = dto.Url;
        existing.Caption = dto.Caption;
        existing.Category = dto.Category;
        existing.SortOrder = dto.SortOrder;
        existing.IsPublic = dto.IsPublic;
        existing.UpdatedAt = DateTime.UtcNow;

        repo.Update(existing);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await service.GalleryImageService.DeleteAsync(id);
        return NoContent();
    }
}

public record UpsertGalleryImageDto(
    string Url,
    string? Caption,
    string? Category,
    int SortOrder = 0,
    bool IsPublic = true);
