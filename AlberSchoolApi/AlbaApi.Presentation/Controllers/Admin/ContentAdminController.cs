using DTOs.Content;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/content")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireAdmin")]
public class ContentAdminController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public ContentAdminController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    // ── Site Settings (Home + About) ────────────────────────────────────────
    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _serviceManager.ContentService.GetAllSettingsAsync(false);
        return Ok(settings);
    }

    [HttpPut("settings")]
    public async Task<IActionResult> UpsertSettings([FromBody] List<SettingDto> dtos)
    {
        await _serviceManager.ContentService.UpdateSettingsAsync(dtos);
        return NoContent();
    }

    // ── Program Levels ──────────────────────────────────────────────────────
    [HttpGet("program-levels")]
    public async Task<IActionResult> GetProgramLevels()
    {
        var levels = await _serviceManager.ContentService.GetAllProgramLevelsAsync(false);
        return Ok(levels);
    }

    [HttpPost("program-levels")]
    public async Task<IActionResult> CreateProgramLevel([FromBody] UpsertProgramLevelDto dto)
    {
        var levelDto = await _serviceManager.ContentService.CreateProgramLevelAsync(dto);
        return StatusCode(201, levelDto);
    }

    [HttpPut("program-levels/{id:int}")]
    public async Task<IActionResult> UpdateProgramLevel(int id, [FromBody] UpsertProgramLevelDto dto)
    {
        await _serviceManager.ContentService.UpdateProgramLevelAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("program-levels/{id:int}")]
    public async Task<IActionResult> DeleteProgramLevel(int id)
    {
        await _serviceManager.ContentService.DeleteProgramLevelAsync(id);
        return NoContent();
    }

    // ── Public Fee Rows ─────────────────────────────────────────────────────
    [HttpGet("public-fees")]
    public async Task<IActionResult> GetPublicFees()
    {
        var rows = await _serviceManager.ContentService.GetAllPublicFeeRowsAsync(false);
        return Ok(rows);
    }

    [HttpPost("public-fees")]
    public async Task<IActionResult> CreatePublicFeeRow([FromBody] UpsertPublicFeeRowDto dto)
    {
        var rowDto = await _serviceManager.ContentService.CreatePublicFeeRowAsync(dto);
        return StatusCode(201, rowDto);
    }

    [HttpPut("public-fees/{id:int}")]
    public async Task<IActionResult> UpdatePublicFeeRow(int id, [FromBody] UpsertPublicFeeRowDto dto)
    {
        await _serviceManager.ContentService.UpdatePublicFeeRowAsync(id, dto);
        return NoContent();
    }

    [HttpDelete("public-fees/{id:int}")]
    public async Task<IActionResult> DeletePublicFeeRow(int id)
    {
        await _serviceManager.ContentService.DeletePublicFeeRowAsync(id);
        return NoContent();
    }
}