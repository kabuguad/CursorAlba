using Contracts.Repositories;
using DTOs.Grade;
using Entities.Models.Grade;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

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
        [FromQuery] int? subjectId,
        [FromServices] IRepositoryManager repo)
    {
        if (subjectId.HasValue)
        {
            var gradesBySub = await service.GradeService.GetGradesForClassAsync(classId, subjectId.Value, false);
            return Ok(gradesBySub);
        }

        var studentIds = repo.StudentRepository
            .FindByCondition(s => s.ClassId == classId, false)
            .Select(s => s.Id)
            .ToList();

        if (studentIds.Count == 0)
            return Ok(Array.Empty<GradeResponseDto>());

        var grades = await repo.GradeRepository
            .FindByCondition(g => studentIds.Contains(g.StudentId), false)
            .Include(g => g.Subject)
            .Include(g => g.Student).ThenInclude(s => s!.User)
            .ToListAsync();

        return Ok(grades.Select(g => new GradeResponseDto
        {
            Id = g.Id,
            StudentId = g.StudentId,
            StudentName = g.Student?.User?.FullName ?? "Unknown",
            SubjectName = g.Subject?.Name ?? "Unknown",
            Score = g.Score,
            MaxScore = g.MaxScore,
            AssessmentType = g.AssessmentType,
            AssessmentDate = g.AssessmentDate,
            Remarks = g.Remarks,
        }));
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> SaveBulkGrades(
        [FromBody] List<GradeCreateDto> grades,
        [FromServices] IRepositoryManager repo)
    {
        if (grades == null || grades.Count == 0)
            return BadRequest(new { message = "No grades provided." });

        foreach (var dto in grades)
        {
            var existing = await repo.GradeRepository
                .FindByCondition(g => g.StudentId == dto.StudentId
                    && g.SubjectId == dto.SubjectId
                    && g.AssessmentType == dto.AssessmentType, true)
                .FirstOrDefaultAsync();

            if (existing != null)
            {
                existing.Score = dto.Score;
                existing.MaxScore = dto.MaxScore;
                existing.AssessmentDate = dto.AssessmentDate;
                existing.Remarks = dto.Remarks;
            }
            else
            {
                var grade = new Grade
                {
                    StudentId = dto.StudentId,
                    SubjectId = dto.SubjectId,
                    Score = dto.Score,
                    MaxScore = dto.MaxScore,
                    AssessmentType = dto.AssessmentType,
                    AssessmentDate = dto.AssessmentDate,
                    Remarks = dto.Remarks,
                };
                repo.GradeRepository.Create(grade);
            }
        }

        await repo.SaveAsync();
        return Ok(new { saved = grades.Count });
    }
}
