using Entities.Models.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/events")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class EventsAdminController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var events = await service.EventService.GetAllAsync(false);
        return Ok(events.Select(e => new
        {
            e.Id, e.Title, e.Description, e.StartDate, e.EndDate,
            e.Location, e.ImageUrl, e.IsPublished, e.EventType,
            IsPast = e.StartDate < DateTime.UtcNow,
        }));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertEventDto dto)
    {
        var ev = new Event
        {
            Title = dto.Title,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate ?? dto.StartDate.AddHours(2),
            Location = dto.Location ?? string.Empty,
            ImageUrl = dto.ImageUrl,
            IsPublished = dto.IsPublished,
            EventType = dto.EventType,
        };
        var created = await service.EventService.CreateAsync(ev);
        return StatusCode(201, new
        {
            created.Id, created.Title, created.Description,
            created.StartDate, created.EndDate, created.Location,
            created.ImageUrl, created.IsPublished, created.EventType,
            IsPast = created.StartDate < DateTime.UtcNow,
        });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertEventDto dto)
    {
        var ev = new Event
        {
            Title = dto.Title,
            Description = dto.Description,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate ?? dto.StartDate.AddHours(2),
            Location = dto.Location ?? string.Empty,
            ImageUrl = dto.ImageUrl,
            IsPublished = dto.IsPublished,
            EventType = dto.EventType,
        };
        await service.EventService.UpdateAsync(id, ev);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await service.EventService.DeleteAsync(id);
        return NoContent();
    }
}

public record UpsertEventDto(
    string Title,
    string? Description,
    DateTime StartDate,
    DateTime? EndDate,
    string? Location,
    string? ImageUrl,
    bool IsPublished,
    string? EventType);
