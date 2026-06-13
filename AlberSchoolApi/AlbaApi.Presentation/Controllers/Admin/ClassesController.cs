using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/classes")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class ClassesController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public ClassesController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllClasses()
    {
        var classes = await _serviceManager.ClassService.GetAllClassesAsync(false);
        return Ok(classes);
    }

    [HttpPost]
    public async Task<IActionResult> CreateClass([FromBody] UpsertClassDto dto)
    {
        var classDto = await _serviceManager.ClassService.CreateClassAsync(dto);
        return StatusCode(201, classDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateClass(int id, [FromBody] UpsertClassDto dto)
    {
        await _serviceManager.ClassService.UpdateClassAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteClass(int id)
    {
        await _serviceManager.ClassService.DeleteClassAsync(id);
        return NoContent();
    }
}