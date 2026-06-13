using Entities.Models.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
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
    public async Task<IActionResult> Update(int id, [FromBody] UpsertGalleryImageDto dto)
    {
        var existingImage = new GalleryImage
        {
            Id = id,
            Url = dto.Url,
            Caption = dto.Caption,
            Category = dto.Category,
            SortOrder = dto.SortOrder,
            IsPublic = dto.IsPublic,
        };

        await service.GalleryImageService.UpdateAsync(id, existingImage);
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
