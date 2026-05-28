using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Staff;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Academic;
using AlberSchoolApi.Domain.Entities.People;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/staff")]
[Authorize]
public class StaffController : ControllerBase
{
    private readonly IStaffRepository _staff;
    private readonly ILeaveRequestRepository _leaves;

    public StaffController(IStaffRepository staff, ILeaveRequestRepository leaves)
    {
        _staff = staff;
        _leaves = leaves;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedResult<StaffListDto>>>> GetAll(
        [FromQuery] string? search, [FromQuery] string? department,
        [FromQuery] StaffRole? role, [FromQuery] StaffStatus? status,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _staff.SearchAsync(search, department, role, status, page, pageSize, ct);
        var dtos = result.Items.Select(MapToListDto);
        return Ok(ApiResponse<PagedResult<StaffListDto>>.Ok(new PagedResult<StaffListDto>
        {
            Items = dtos, TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize
        }));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<StaffDetailDto>>> GetById(int id, CancellationToken ct)
    {
        var member = await _staff.GetWithSubjectsAsync(id, ct);
        if (member is null) return NotFound(ApiResponse<StaffDetailDto>.Fail("Staff member not found."));
        return Ok(ApiResponse<StaffDetailDto>.Ok(MapToDetailDto(member)));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<StaffDetailDto>>> Create([FromBody] CreateStaffRequest req, CancellationToken ct)
    {
        if (await _staff.EmailExistsAsync(req.Email, ct: ct))
            return Conflict(ApiResponse<StaffDetailDto>.Fail("Email already exists."));

        var staffNo = await _staff.GenerateNextStaffNoAsync(ct);
        var member = new StaffMember
        {
            StaffNo = staffNo,
            FirstName = req.FirstName,
            LastName = req.LastName,
            Email = req.Email.ToLower(),
            Phone = req.Phone,
            DateOfBirth = req.DateOfBirth,
            Gender = req.Gender,
            Role = req.Role,
            Department = req.Department,
            Qualification = req.Qualification,
            TscNo = req.TscNo,
            NationalId = req.NationalId,
            EmployedDate = req.EmployedDate,
            ContractType = req.ContractType,
            ContractEnd = req.ContractEnd,
            SalaryGrade = req.SalaryGrade,
            Address = req.Address
        };

        foreach (var subjectId in req.SubjectIds)
            member.StaffSubjects.Add(new StaffSubject { SubjectId = subjectId });

        await _staff.AddAsync(member, ct);
        await _staff.SaveChangesAsync(ct);

        var created = await _staff.GetWithSubjectsAsync(member.Id, ct);
        return CreatedAtAction(nameof(GetById), new { id = member.Id }, ApiResponse<StaffDetailDto>.Ok(MapToDetailDto(created!), "Staff member created."));
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<StaffDetailDto>>> Update(int id, [FromBody] UpdateStaffRequest req, CancellationToken ct)
    {
        var member = await _staff.GetWithSubjectsAsync(id, ct);
        if (member is null) return NotFound(ApiResponse<StaffDetailDto>.Fail("Staff member not found."));

        member.FirstName = req.FirstName;
        member.LastName = req.LastName;
        member.Phone = req.Phone;
        member.DateOfBirth = req.DateOfBirth;
        member.Gender = req.Gender;
        member.Photo = req.Photo;
        member.Role = req.Role;
        member.Department = req.Department;
        member.Qualification = req.Qualification;
        member.TscNo = req.TscNo;
        member.NationalId = req.NationalId;
        member.ContractType = req.ContractType;
        member.ContractEnd = req.ContractEnd;
        member.SalaryGrade = req.SalaryGrade;
        member.Status = req.Status;
        member.Address = req.Address;
        member.UpdatedAt = DateTime.UtcNow;

        member.StaffSubjects.Clear();
        foreach (var subjectId in req.SubjectIds)
            member.StaffSubjects.Add(new StaffSubject { SubjectId = subjectId });

        await _staff.UpdateAsync(member, ct);
        await _staff.SaveChangesAsync(ct);

        var updated = await _staff.GetWithSubjectsAsync(id, ct);
        return Ok(ApiResponse<StaffDetailDto>.Ok(MapToDetailDto(updated!), "Staff member updated."));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Delete(int id, CancellationToken ct)
    {
        if (!await _staff.ExistsAsync(s => s.Id == id, ct))
            return NotFound(ApiResponse.Fail("Staff member not found."));
        await _staff.SoftDeleteAsync(id, ct);
        return Ok(ApiResponse.Ok("Staff member deleted."));
    }

    // ── Leave Requests ─────────────────────────────────────────────────────

    [HttpGet("{id:int}/leave")]
    public async Task<ActionResult<ApiResponse<IEnumerable<LeaveRequestDto>>>> GetLeave(int id, CancellationToken ct)
    {
        var leaves = await _leaves.GetByStaffAsync(id, ct);
        return Ok(ApiResponse<IEnumerable<LeaveRequestDto>>.Ok(leaves.Select(l => new LeaveRequestDto(
            l.Id, l.StaffMemberId, $"{l.StaffMember?.FirstName} {l.StaffMember?.LastName}", l.Type, l.StartDate, l.EndDate, l.Reason, l.Status, l.ReviewNotes, l.SubmittedAt))));
    }

    [HttpPost("{id:int}/leave")]
    public async Task<ActionResult<ApiResponse<LeaveRequestDto>>> ApplyLeave(int id, [FromBody] CreateLeaveRequestRequest req, CancellationToken ct)
    {
        if (!await _staff.ExistsAsync(s => s.Id == id, ct))
            return NotFound(ApiResponse<LeaveRequestDto>.Fail("Staff member not found."));

        var leave = new LeaveRequest
        {
            StaffMemberId = id,
            Type = req.Type,
            StartDate = req.StartDate,
            EndDate = req.EndDate,
            Reason = req.Reason
        };
        await _leaves.AddAsync(leave, ct);
        await _leaves.SaveChangesAsync(ct);
        return Ok(ApiResponse<LeaveRequestDto>.Ok(new LeaveRequestDto(leave.Id, leave.StaffMemberId, "", leave.Type, leave.StartDate, leave.EndDate, leave.Reason, leave.Status, null, leave.SubmittedAt), "Leave request submitted."));
    }

    [HttpPatch("leave/{leaveId:int}/review")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> ReviewLeave(int leaveId, [FromBody] ReviewLeaveRequest req, CancellationToken ct)
    {
        var leave = await _leaves.GetByIdAsync(leaveId, ct);
        if (leave is null) return NotFound(ApiResponse.Fail("Leave request not found."));
        leave.Status = req.Status;
        leave.ReviewNotes = req.Notes;
        leave.ReviewedAt = DateTime.UtcNow;
        await _leaves.UpdateAsync(leave, ct);
        await _leaves.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Leave request reviewed."));
    }

    [HttpGet("leave/pending")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<IEnumerable<LeaveRequestDto>>>> GetPending(CancellationToken ct)
    {
        var pending = await _leaves.GetPendingAsync(ct);
        return Ok(ApiResponse<IEnumerable<LeaveRequestDto>>.Ok(pending.Select(l =>
            new LeaveRequestDto(l.Id, l.StaffMemberId, $"{l.StaffMember?.FirstName} {l.StaffMember?.LastName}", l.Type, l.StartDate, l.EndDate, l.Reason, l.Status, l.ReviewNotes, l.SubmittedAt))));
    }

    private static StaffListDto MapToListDto(StaffMember s) => new(s.Id, s.StaffNo, s.FirstName, s.LastName, $"{s.FirstName} {s.LastName}", s.Email, s.Phone, s.Photo, s.Role, s.Department, s.ContractType, s.Status);
    private static StaffDetailDto MapToDetailDto(StaffMember s) => new(s.Id, s.StaffNo, s.FirstName, s.LastName, s.Email, s.Phone, s.DateOfBirth, s.Gender, s.Photo, s.Role, s.Department, s.Qualification, s.TscNo, s.NationalId, s.EmployedDate, s.ContractType, s.ContractEnd, s.SalaryGrade, s.Status, s.Address, s.StaffSubjects.Select(ss => new SubjectSummaryDto(ss.Subject.Id, ss.Subject.Code, ss.Subject.Name)), s.CreatedAt);
}
