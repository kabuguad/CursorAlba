using System.Security.Claims;
using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Communications;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Communications;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/announcements")]
[Authorize]
public class AnnouncementsController : ControllerBase
{
    private readonly IAnnouncementRepository _repo;

    public AnnouncementsController(IAnnouncementRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<AnnouncementListDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] AnnouncementStatus? status,
        [FromQuery] AnnouncementPriority? priority, [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _repo.SearchAdminAsync(search, status, priority, page, pageSize, ct);
        var dtos = result.Items.Select(MapToListDto);
        return Ok(ApiResponse<PagedResult<AnnouncementListDto>>.Ok(new PagedResult<AnnouncementListDto> { Items = dtos, TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize }));
    }

    [HttpGet("feed")]
    public async Task<ActionResult<ApiResponse<PagedResult<AnnouncementListDto>>>> GetFeed(
        [FromQuery] string? grade, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var roleStr = User.FindFirst(ClaimTypes.Role)?.Value ?? "student";
        if (!Enum.TryParse<UserRole>(roleStr, true, out var role)) role = UserRole.Student;
        var result = await _repo.GetForRoleAsync(role, grade, page, pageSize, ct);
        return Ok(ApiResponse<PagedResult<AnnouncementListDto>>.Ok(new PagedResult<AnnouncementListDto> { Items = result.Items.Select(MapToListDto), TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize }));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<AnnouncementDetailDto>>> GetById(int id, CancellationToken ct)
    {
        var a = await _repo.GetWithTargetsAsync(id, ct);
        if (a is null) return NotFound(ApiResponse<AnnouncementDetailDto>.Fail("Announcement not found."));
        await _repo.IncrementReadCountAsync(id, ct);
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdStr, out var userId))
            await _repo.MarkReadByUserAsync(id, userId, ct);
        return Ok(ApiResponse<AnnouncementDetailDto>.Ok(new AnnouncementDetailDto(a.Id, a.Title, a.Body, a.Priority, a.Status, a.PublishAt, a.ExpiresAt, a.Author.Name, a.CreatedAt, a.ReadCount, a.TargetRoles.Select(tr => tr.Role), a.TargetGrades.Select(tg => tg.Grade))));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<AnnouncementDetailDto>>> Create([FromBody] CreateAnnouncementRequest req, CancellationToken ct)
    {
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdStr, out var userId);

        var announcement = new Announcement
        {
            Title = req.Title,
            Body = req.Body,
            Priority = req.Priority,
            Status = req.Status,
            PublishAt = req.PublishAt,
            ExpiresAt = req.ExpiresAt,
            CreatedBy = userId
        };
        foreach (var role in req.TargetRoles) announcement.TargetRoles.Add(new AnnouncementTargetRole { Role = role });
        foreach (var grade in req.TargetGrades) announcement.TargetGrades.Add(new AnnouncementTargetGrade { Grade = grade });

        await _repo.AddAsync(announcement, ct);
        await _repo.SaveChangesAsync(ct);
        return Ok(ApiResponse<AnnouncementDetailDto>.Ok(new AnnouncementDetailDto(announcement.Id, announcement.Title, announcement.Body, announcement.Priority, announcement.Status, announcement.PublishAt, announcement.ExpiresAt, "", announcement.CreatedAt, 0, req.TargetRoles, req.TargetGrades), "Announcement created."));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Update(int id, [FromBody] UpdateAnnouncementRequest req, CancellationToken ct)
    {
        var a = await _repo.GetWithTargetsAsync(id, ct);
        if (a is null) return NotFound(ApiResponse.Fail("Announcement not found."));

        a.Title = req.Title; a.Body = req.Body; a.Priority = req.Priority; a.Status = req.Status; a.ExpiresAt = req.ExpiresAt; a.UpdatedAt = DateTime.UtcNow;
        a.TargetRoles.Clear(); foreach (var r in req.TargetRoles) a.TargetRoles.Add(new AnnouncementTargetRole { Role = r });
        a.TargetGrades.Clear(); foreach (var g in req.TargetGrades) a.TargetGrades.Add(new AnnouncementTargetGrade { Grade = g });
        await _repo.UpdateAsync(a, ct);
        await _repo.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Announcement updated."));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Delete(int id, CancellationToken ct)
    {
        var a = await _repo.GetByIdAsync(id, ct);
        if (a is null) return NotFound(ApiResponse.Fail("Announcement not found."));
        await _repo.DeleteAsync(a, ct);
        await _repo.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Announcement deleted."));
    }

    private static AnnouncementListDto MapToListDto(Announcement a) =>
        new(a.Id, a.Title, a.Priority, a.Status, a.Author?.Name ?? "System", a.CreatedAt, a.ExpiresAt, a.ReadCount, a.TargetRoles.Select(tr => tr.Role));
}
