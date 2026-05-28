using System.Security.Claims;
using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.System;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/system")]
public class SystemController : ControllerBase
{
    private readonly ISystemSettingsRepository _settings;
    private readonly ISocialLinkRepository _socialLinks;
    private readonly IAuditLogRepository _audit;
    private readonly INotificationRepository _notifications;

    public SystemController(ISystemSettingsRepository settings, ISocialLinkRepository socialLinks, IAuditLogRepository audit, INotificationRepository notifications)
    {
        _settings = settings; _socialLinks = socialLinks; _audit = audit; _notifications = notifications;
    }

    // ── Settings ──────────────────────────────────────────────────────────

    /// <summary>Get current system settings (public — for website to consume school info).</summary>
    [HttpGet("settings")]
    public async Task<ActionResult<ApiResponse<SystemSettingsDto>>> GetSettings(CancellationToken ct)
    {
        var s = await _settings.GetAsync(ct);
        return Ok(ApiResponse<SystemSettingsDto>.Ok(MapToDto(s)));
    }

    [HttpPut("settings")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<SystemSettingsDto>>> UpdateSettings([FromBody] UpdateSettingsRequest req, CancellationToken ct)
    {
        var s = await _settings.GetAsync(ct);
        s.SchoolName = req.SchoolName; s.SchoolMotto = req.SchoolMotto; s.Founded = req.Founded;
        s.County = req.County; s.Town = req.Town; s.Address = req.Address; s.PoBox = req.PoBox;
        s.Phone = req.Phone; s.SecondaryPhone = req.SecondaryPhone; s.Email = req.Email;
        s.AdmissionsEmail = req.AdmissionsEmail; s.Website = req.Website; s.WhatsApp = req.WhatsApp;
        s.GoogleMapsUrl = req.GoogleMapsUrl; s.OfficeHours = req.OfficeHours;
        s.Logo = req.Logo; s.PrimaryColor = req.PrimaryColor;
        s.CurrentAcademicYearId = req.CurrentAcademicYearId; s.CurrentTermId = req.CurrentTermId;
        s.SmtpEnabled = req.SmtpEnabled; s.MaintenanceMode = req.MaintenanceMode;
        s.MaintenanceMessage = req.MaintenanceMessage;

        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdStr, out var userId)) s.UpdatedBy = userId;

        await _settings.UpdateAsync(s, ct);
        return Ok(ApiResponse<SystemSettingsDto>.Ok(MapToDto(s), "Settings updated."));
    }

    // ── Social Links ──────────────────────────────────────────────────────

    [HttpGet("social-links")]
    public async Task<ActionResult<ApiResponse<IEnumerable<SocialLinkDto>>>> GetSocialLinks(CancellationToken ct)
    {
        var links = await _socialLinks.GetActiveOrderedAsync(ct);
        return Ok(ApiResponse<IEnumerable<SocialLinkDto>>.Ok(links.Select(l => new SocialLinkDto(l.Id, l.Platform, l.Url, l.IsActive, l.SortOrder))));
    }

    [HttpPut("social-links")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpsertSocialLinks([FromBody] UpsertSocialLinksRequest req, CancellationToken ct)
    {
        var all = await _socialLinks.GetAllAsync(ct);
        await _socialLinks.DeleteRangeAsync(all, ct);
        await _socialLinks.SaveChangesAsync(ct);
        foreach (var link in req.Links)
            await _socialLinks.AddAsync(new SocialLink { Platform = link.Platform, Url = link.Url, IsActive = link.IsActive, SortOrder = link.SortOrder }, ct);
        await _socialLinks.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Social links updated."));
    }

    // ── Notifications ─────────────────────────────────────────────────────

    [HttpGet("notifications")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<IEnumerable<NotificationDto>>>> GetNotifications([FromQuery] bool unreadOnly = false, CancellationToken ct = default)
    {
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();
        var items = await _notifications.GetByUserAsync(userId, unreadOnly, ct);
        return Ok(ApiResponse<IEnumerable<NotificationDto>>.Ok(items.Select(n => new NotificationDto(n.Id, n.Title, n.Body, n.Type, n.IsRead, n.CreatedAt))));
    }

    [HttpPost("notifications/mark-all-read")]
    [Authorize]
    public async Task<ActionResult<ApiResponse>> MarkAllRead(CancellationToken ct)
    {
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();
        await _notifications.MarkAllReadAsync(userId, ct);
        return Ok(ApiResponse.Ok("All notifications marked as read."));
    }

    // ── Audit Logs ────────────────────────────────────────────────────────

    [HttpGet("audit-logs")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<PagedResult<AuditLogDto>>>> GetAuditLogs(
        [FromQuery] string? search, [FromQuery] string? resource, [FromQuery] string? action,
        [FromQuery] DateTime? from, [FromQuery] DateTime? to,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 50, CancellationToken ct = default)
    {
        var result = await _audit.SearchAsync(search, resource, action, from, to, page, pageSize, ct);
        var dtos = result.Items.Select(a => new AuditLogDto(a.Id, a.UserName, a.UserRole, a.Action.ToString(), a.Resource, a.ResourceId, a.Details, a.IpAddress, a.Timestamp));
        return Ok(ApiResponse<PagedResult<AuditLogDto>>.Ok(new PagedResult<AuditLogDto> { Items = dtos, TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize }));
    }

    // ── Health ────────────────────────────────────────────────────────────

    [HttpGet("health")]
    public async Task<ActionResult<ApiResponse<SystemHealthDto>>> Health(CancellationToken ct)
    {
        var s = await _settings.GetAsync(ct);
        return Ok(ApiResponse<SystemHealthDto>.Ok(new SystemHealthDto("Healthy", s.MaintenanceMode, s.LastBackupAt, 0)));
    }

    private static SystemSettingsDto MapToDto(SystemSettings s) => new(
        s.SchoolName, s.SchoolMotto, s.Founded, s.County, s.Town, s.Address, s.PoBox,
        s.Phone, s.SecondaryPhone, s.Email, s.AdmissionsEmail, s.Website, s.WhatsApp,
        s.GoogleMapsUrl, s.OfficeHours, s.Logo, s.PrimaryColor,
        s.CurrentAcademicYearId, s.CurrentTermId, s.SmtpEnabled, s.MaintenanceMode,
        s.MaintenanceMessage, s.LastBackupAt);
}
