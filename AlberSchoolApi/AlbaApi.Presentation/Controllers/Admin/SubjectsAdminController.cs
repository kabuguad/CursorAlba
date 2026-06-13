using DTOs.Academics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/subjects")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class SubjectsAdminController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public SubjectsAdminController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? classId)
    {
        var subjects = await _serviceManager.SubjectService.GetAllSubjectsAsync(false, classId);
        return Ok(subjects);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpsertSubjectDto dto)
    {
        var subjectDto = await _serviceManager.SubjectService.CreateSubjectAsync(dto);
        return StatusCode(201, subjectDto);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpsertSubjectDto dto)
    {
        await _serviceManager.SubjectService.UpdateSubjectAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _serviceManager.SubjectService.DeleteSubjectAsync(id);
        return NoContent();
    }
}