using DTOs.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/alber-difference")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class AlberDifferenceAdminController(IServiceManager service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var differences = await service.AlberDifferenceService.GetAllAsync(false);
        return Ok(differences);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var difference = await service.AlberDifferenceService.GetByIdAsync(id, false);
        return Ok(difference);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TheAlberDifferenceCreateDto dto)
    {
        var created = await service.AlberDifferenceService.CreateAsync(dto);
        return StatusCode(201, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TheAlberDifferenceUpdateDto dto)
    {
        await service.AlberDifferenceService.UpdateAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await service.AlberDifferenceService.DeleteAsync(id);
        return NoContent();
    }
}