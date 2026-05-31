using Contracts.Repositories;
using Entities.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using StudentEntity = Entities.Models.User.Student;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/students")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireAdmin")]
public class StudentsAdminController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromServices] IRepositoryManager repo)
    {
        var students = await repo.StudentRepository
            .FindAll(false)
            .Include(s => s.User)
            .Include(s => s.Class)
            .Include(s => s.Parent).ThenInclude(p => p!.User)
            .ToListAsync();

        return Ok(students.Select(s => MapStudent(s)));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, [FromServices] IRepositoryManager repo)
    {
        var student = await repo.StudentRepository
            .FindByCondition(s => s.Id == id, false)
            .Include(s => s.User)
            .Include(s => s.Class)
            .Include(s => s.Parent).ThenInclude(p => p!.User)
            .FirstOrDefaultAsync();
        if (student == null) return NotFound();
        return Ok(MapStudent(student));
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateStudentDto dto,
        [FromServices] UserManager<ApplicationUser> userManager,
        [FromServices] IRepositoryManager repo)
    {
        var user = new ApplicationUser
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            UserName = dto.Email,
            EmailConfirmed = true,
        };
        var result = await userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        await userManager.AddToRoleAsync(user, "Student");

        var student = new StudentEntity
        {
            UserId = user.Id,
            ClassId = dto.ClassId,
            ParentId = dto.ParentId,
            DateOfBirth = dto.DateOfBirth.HasValue ? dto.DateOfBirth.Value.ToUniversalTime() : null,
            Gender = dto.Gender,
            Address = dto.Address,
        };
        repo.StudentRepository.Create(student);
        await repo.SaveAsync();

        var created = await repo.StudentRepository
            .FindByCondition(s => s.Id == student.Id, false)
            .Include(s => s.User)
            .Include(s => s.Class)
            .FirstOrDefaultAsync();

        return StatusCode(201, MapStudent(created!));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id,
        [FromBody] UpdateStudentDto dto,
        [FromServices] IRepositoryManager repo,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var student = await repo.StudentRepository
            .FindByCondition(s => s.Id == id, true)
            .Include(s => s.User)
            .FirstOrDefaultAsync();

        if (student == null) return NotFound();

        if (student.User != null)
        {
            student.User.FirstName = dto.FirstName;
            student.User.LastName = dto.LastName;
            if (dto.Email != student.User.Email)
            {
                student.User.Email = dto.Email;
                student.User.UserName = dto.Email;
            }
            await userManager.UpdateAsync(student.User);
        }

        student.ClassId = dto.ClassId;
        student.ParentId = dto.ParentId;
        if (dto.DateOfBirth.HasValue) student.DateOfBirth = dto.DateOfBirth.Value.ToUniversalTime();
        student.Gender = dto.Gender;
        student.Address = dto.Address;
        student.UpdatedAt = DateTime.UtcNow;

        repo.Update(student);
        await repo.SaveAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id,
        [FromServices] IRepositoryManager repo,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var student = await repo.StudentRepository
            .FindByCondition(s => s.Id == id, true)
            .Include(s => s.User)
            .FirstOrDefaultAsync();

        if (student == null) return NotFound();

        repo.StudentRepository.Delete(student);
        await repo.SaveAsync();

        if (student.User != null)
            await userManager.DeleteAsync(student.User);

        return NoContent();
    }

    private static object MapStudent(StudentEntity s) => new
    {
        id = s.Id.ToString(),
        userId = s.UserId,
        firstName = s.User?.FirstName ?? "",
        lastName = s.User?.LastName ?? "",
        email = s.User?.Email ?? "",
        classId = s.ClassId,
        className = s.Class?.Name ?? "",
        classSection = s.Class?.Section ?? "",
        parentId = s.ParentId,
        parentName = s.Parent?.User?.FullName ?? "",
        dateOfBirth = s.DateOfBirth?.ToString("yyyy-MM-dd"),
        gender = s.Gender,
        address = s.Address,
    };
}

public record CreateStudentDto(
    string FirstName, string LastName, string Email, string Password,
    int ClassId, int? ParentId, DateTime? DateOfBirth, string? Gender, string? Address);

public record UpdateStudentDto(
    string FirstName, string LastName, string Email,
    int ClassId, int? ParentId, DateTime? DateOfBirth, string? Gender, string? Address);
