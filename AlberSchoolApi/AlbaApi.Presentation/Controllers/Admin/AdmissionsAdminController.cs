using DTOs.Admissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/admissions")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class AdmissionsAdminController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public AdmissionsAdminController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var applications = await _serviceManager.AdmissionsService.GetAllApplicationsAsync(false);
        return Ok(applications);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var application = await _serviceManager.AdmissionsService.GetApplicationByIdAsync(id, false);
        if (application == null) return NotFound();
        return Ok(application);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateApplicationDto dto)
    {
        var applicationDto = await _serviceManager.AdmissionsService.CreateApplicationAsync(dto);
        return StatusCode(201, applicationDto);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id,
        [FromBody] UpdateStatusDto dto)
    {
        var applicationDto = await _serviceManager.AdmissionsService.UpdateApplicationStatusAsync(id, dto);
        return Ok(applicationDto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _serviceManager.AdmissionsService.DeleteApplicationAsync(id);
        return NoContent();
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var applications = await _serviceManager.AdmissionsService.GetAllApplicationsAsync(false);
        var total = applications.Count();
        var pending = applications.Count(a => a.status == "pending");
        var reviewing = applications.Count(a => a.status == "reviewing");
        var approved = applications.Count(a => a.status == "approved");
        var rejected = applications.Count(a => a.status == "rejected");
        return Ok(new
        {
            total,
            pending,
            reviewing,
            approved,
            rejected
        });
    }
}