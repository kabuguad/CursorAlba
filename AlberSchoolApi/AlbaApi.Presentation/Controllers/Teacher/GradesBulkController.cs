using DTOs.Grade;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/grades")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireTeacher")]
public class GradesBulkController(IServiceManager service) : ControllerBase
{
    [HttpGet("class/{classId:int}")]
    public async Task<IActionResult> GetClassGrades(
        int classId,
        [FromQuery] int? subjectId)
    {
        if (subjectId.HasValue)
        {
            var gradesBySub = await service.GradeService.GetGradesForClassAsync(classId, subjectId.Value, false);
            return Ok(gradesBySub);
        }

        var grades = await service.GradeService.GetGradesForClassAsync(classId, false);
        return Ok(grades);
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> SaveBulkGrades(
        [FromBody] List<GradeCreateDto> grades)
    {
        if (grades == null || grades.Count == 0)
            return BadRequest(new { message = "No grades provided." });

        foreach (var dto in grades)
        {
            await service.GradeService.UpsertGradeAsync(dto);
        }

        return Ok(new { saved = grades.Count });
    }
}
