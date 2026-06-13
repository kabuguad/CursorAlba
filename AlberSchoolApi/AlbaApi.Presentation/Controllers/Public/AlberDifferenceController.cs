using DTOs.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Public;

[ApiController]
[Route("api/alber-difference")]
[EnableRateLimiting("public")]
public class AlberDifferenceController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var differences = await service.AlberDifferenceService.GetAllAsync(false);
        return Ok(differences);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var difference = await service.AlberDifferenceService.GetByIdAsync(id, false);
        return Ok(difference);
    }
}