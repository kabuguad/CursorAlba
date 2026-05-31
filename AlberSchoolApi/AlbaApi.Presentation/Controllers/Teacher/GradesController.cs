using AlbaApi.Presentation.ActionFilters;
using DTOs.Attendance;
using DTOs.Grade;
using Entities.Models.Attendance;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;
using System.Security.Claims;

namespace AlbaApi.Presentation.Controllers.Teacher;

[ApiController]
[Route("api/teacher/grades")]
[EnableRateLimiting("api")]
[Authorize(Policy = "RequireTeacher")]
public class GradesController(IServiceManager service) : ControllerBase
{
    [HttpPost]
    [ServiceFilter(typeof(ValidationFilterAttribute))]
    public async Task<IActionResult> CreateGrade([FromBody] GradeCreateDto dto)
    {
        var result = await service.GradeService.CreateGradeAsync(dto);
        return Ok(result);
    }

    [HttpGet("{classId:int}/{subjectId:int}")]
    public async Task<IActionResult> GetGradesForClass(int classId, int subjectId)
    {
        var grades = await service.GradeService.GetGradesForClassAsync(classId, subjectId, false);
        return Ok(grades);
    }
}
