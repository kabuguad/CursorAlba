using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Admissions;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Admissions;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/admissions")]
public class AdmissionsController : ControllerBase
{
    private readonly IAdmissionsRepository _repo;

    public AdmissionsController(IAdmissionsRepository repo) => _repo = repo;

    /// <summary>Submit a new admission application (public — no auth required).</summary>
    [HttpPost("apply")]
    public async Task<ActionResult<ApiResponse<AdmissionListDto>>> Apply([FromBody] SubmitApplicationRequest req, CancellationToken ct)
    {
        var applicationNo = await _repo.GenerateNextApplicationNoAsync(ct);
        var application = new AdmissionApplication
        {
            ApplicationNo = applicationNo,
            ChildFirstName = req.ChildFirstName,
            ChildLastName = req.ChildLastName,
            DateOfBirth = req.DateOfBirth,
            Gender = req.Gender,
            ApplyingForGrade = req.ApplyingForGrade,
            PreviousSchool = req.PreviousSchool,
            ParentFirstName = req.ParentFirstName,
            ParentLastName = req.ParentLastName,
            ParentEmail = req.ParentEmail,
            ParentPhone = req.ParentPhone,
            Address = req.Address
        };
        await _repo.AddAsync(application, ct);
        await _repo.SaveChangesAsync(ct);
        return Ok(ApiResponse<AdmissionListDto>.Ok(new AdmissionListDto(application.Id, application.ApplicationNo, application.ChildFirstName, application.ChildLastName, application.ApplyingForGrade, application.ParentEmail, application.ParentPhone, application.Status, application.SubmittedAt), "Application submitted successfully."));
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<PagedResult<AdmissionListDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] AdmissionStatus? status,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _repo.SearchAsync(search, status, page, pageSize, ct);
        var dtos = result.Items.Select(a => new AdmissionListDto(a.Id, a.ApplicationNo, a.ChildFirstName, a.ChildLastName, a.ApplyingForGrade, a.ParentEmail, a.ParentPhone, a.Status, a.SubmittedAt));
        return Ok(ApiResponse<PagedResult<AdmissionListDto>>.Ok(new PagedResult<AdmissionListDto> { Items = dtos, TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize }));
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<AdmissionDetailDto>>> GetById(int id, CancellationToken ct)
    {
        var app = await _repo.GetWithDocumentsAsync(id, ct);
        if (app is null) return NotFound(ApiResponse<AdmissionDetailDto>.Fail("Application not found."));
        return Ok(ApiResponse<AdmissionDetailDto>.Ok(MapToDetailDto(app)));
    }

    [HttpPatch("{id:int}/review")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Review(int id, [FromBody] ReviewApplicationRequest req, CancellationToken ct)
    {
        if (!await _repo.ExistsAsync(a => a.Id == id, ct))
            return NotFound(ApiResponse.Fail("Application not found."));
        await _repo.UpdateStatusAsync(id, req.Status, req.AssignedTo, req.Notes, ct);
        return Ok(ApiResponse.Ok($"Application status updated to {req.Status}."));
    }

    [HttpGet("stats")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<Dictionary<AdmissionStatus, int>>>> GetStats(CancellationToken ct)
    {
        var stats = await _repo.GetCountsByStatusAsync(ct);
        return Ok(ApiResponse<Dictionary<AdmissionStatus, int>>.Ok(stats));
    }

    private static AdmissionDetailDto MapToDetailDto(AdmissionApplication a) => new(
        a.Id, a.ApplicationNo, a.ChildFirstName, a.ChildLastName, a.DateOfBirth, a.Gender,
        a.ApplyingForGrade, a.PreviousSchool, a.ParentFirstName, a.ParentLastName, a.ParentEmail,
        a.ParentPhone, a.Address, a.Status, a.AssignedToUser?.Name, a.Notes,
        a.SubmittedAt, a.ReviewedAt, a.LinkedStudentId,
        a.Documents.Select(d => new DocumentDto(d.Id, d.Name, d.Url, d.UploadedAt)));
}
