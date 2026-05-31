using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Public;

[ApiController]
[Route("api/events")]
[EnableRateLimiting("public")]
public class EventsController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetUpcoming()
    {
        var events = await service.EventService.GetUpcomingAsync(false);
        return Ok(events.Select(e => new
        {
            e.Id, e.Title, e.Description, e.StartDate, e.EndDate,
            e.Location, e.ImageUrl, e.EventType,
            Date = e.StartDate.ToString("yyyy-MM-dd"),
        }));
    }

    [HttpGet("all")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var events = await service.EventService.GetAllAsync(false);
        return Ok(events.Where(e => e.IsPublished).Select(e => new
        {
            e.Id, e.Title, e.Description, e.StartDate, e.EndDate,
            e.Location, e.ImageUrl, e.EventType,
            Date = e.StartDate.ToString("yyyy-MM-dd"),
            IsPast = e.StartDate < DateTime.UtcNow,
        }));
    }
}
