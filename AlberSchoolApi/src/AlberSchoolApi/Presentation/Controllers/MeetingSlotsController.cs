using System.Security.Claims;
using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Communications;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Academic;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/meetings")]
[Authorize]
public class MeetingSlotsController : ControllerBase
{
    private readonly IMeetingSlotRepository _slots;

    public MeetingSlotsController(IMeetingSlotRepository slots) => _slots = slots;

    /// <summary>Get meeting slots for a given teacher (open/upcoming).</summary>
    [HttpGet("available/{teacherId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<MeetingSlotDto>>>> GetAvailable(int teacherId, CancellationToken ct)
    {
        var slots = await _slots.GetAvailableAsync(teacherId, ct);
        return Ok(ApiResponse<IEnumerable<MeetingSlotDto>>.Ok(slots.Select(MapDto)));
    }

    /// <summary>Get all slots for a teacher (admin / teacher view).</summary>
    [HttpGet("teacher/{teacherId:int}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<MeetingSlotDto>>>> GetByTeacher(
        int teacherId, [FromQuery] DateOnly? from, [FromQuery] DateOnly? to, CancellationToken ct)
    {
        var slots = await _slots.GetByTeacherAsync(teacherId, from, to, ct);
        return Ok(ApiResponse<IEnumerable<MeetingSlotDto>>.Ok(slots.Select(MapDto)));
    }

    /// <summary>Create a new available meeting slot (teachers only).</summary>
    [HttpPost("{teacherId:int}")]
    public async Task<ActionResult<ApiResponse<MeetingSlotDto>>> Create(int teacherId, [FromBody] CreateMeetingSlotRequest req, CancellationToken ct)
    {
        if (await _slots.HasOverlapAsync(teacherId, req.MeetingDate, req.StartTime, req.EndTime, ct: ct))
            return Conflict(ApiResponse<MeetingSlotDto>.Fail("A slot already exists at that time."));
        var slot = new MeetingSlot { TeacherId = teacherId, MeetingDate = req.MeetingDate, StartTime = req.StartTime, EndTime = req.EndTime, Notes = req.Notes };
        await _slots.AddAsync(slot, ct);
        await _slots.SaveChangesAsync(ct);
        return Ok(ApiResponse<MeetingSlotDto>.Ok(MapDto(slot), "Meeting slot created."));
    }

    /// <summary>Book an available slot.</summary>
    [HttpPatch("{id:int}/book")]
    public async Task<ActionResult<ApiResponse<MeetingSlotDto>>> Book(int id, [FromBody] BookMeetingSlotRequest req, CancellationToken ct)
    {
        var slot = await _slots.GetByIdAsync(id, ct);
        if (slot is null) return NotFound(ApiResponse<MeetingSlotDto>.Fail("Slot not found."));
        if (slot.Status != MeetingSlotStatus.Available)
            return Conflict(ApiResponse<MeetingSlotDto>.Fail("This slot is not available."));

        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdStr, out var userId);

        slot.Status = MeetingSlotStatus.Booked;
        slot.BookedByUserId = userId;
        slot.StudentId = req.StudentId;
        slot.Notes = req.Notes ?? slot.Notes;

        await _slots.UpdateAsync(slot, ct);
        await _slots.SaveChangesAsync(ct);
        return Ok(ApiResponse<MeetingSlotDto>.Ok(MapDto(slot), "Slot booked."));
    }

    /// <summary>Cancel a booked slot.</summary>
    [HttpPatch("{id:int}/cancel")]
    public async Task<ActionResult<ApiResponse>> Cancel(int id, CancellationToken ct)
    {
        var slot = await _slots.GetByIdAsync(id, ct);
        if (slot is null) return NotFound(ApiResponse.Fail("Slot not found."));
        slot.Status = MeetingSlotStatus.Cancelled;
        slot.BookedByUserId = null;
        slot.StudentId = null;
        await _slots.UpdateAsync(slot, ct);
        await _slots.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Slot cancelled."));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> Delete(int id, CancellationToken ct)
    {
        var slot = await _slots.GetByIdAsync(id, ct);
        if (slot is null) return NotFound(ApiResponse.Fail("Slot not found."));
        await _slots.DeleteAsync(slot, ct);
        await _slots.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Slot deleted."));
    }

    private static MeetingSlotDto MapDto(MeetingSlot m) => new(
        m.Id, m.TeacherId,
        m.Teacher != null ? $"{m.Teacher.FirstName} {m.Teacher.LastName}" : "",
        m.MeetingDate, m.StartTime, m.EndTime, m.Status,
        m.BookedByUser?.Name, m.Student != null ? $"{m.Student.FirstName} {m.Student.LastName}" : null,
        m.Notes);
}
