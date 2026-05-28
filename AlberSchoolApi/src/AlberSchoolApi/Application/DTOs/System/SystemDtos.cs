namespace AlberSchoolApi.Application.DTOs.System;

public record SystemSettingsDto(
    string SchoolName,
    string? SchoolMotto,
    int? Founded,
    string? County,
    string? Town,
    string? Address,
    string? PoBox,
    string? Phone,
    string? SecondaryPhone,
    string? Email,
    string? AdmissionsEmail,
    string? Website,
    string? WhatsApp,
    string? GoogleMapsUrl,
    string? OfficeHours,
    string? Logo,
    string? PrimaryColor,
    int? CurrentAcademicYearId,
    int? CurrentTermId,
    bool SmtpEnabled,
    bool MaintenanceMode,
    string? MaintenanceMessage,
    DateTime? LastBackupAt
);

/// <summary>SMTP password is excluded — use a dedicated endpoint to update credentials.</summary>
public record UpdateSettingsRequest(
    string SchoolName,
    string? SchoolMotto,
    int? Founded,
    string? County,
    string? Town,
    string? Address,
    string? PoBox,
    string? Phone,
    string? SecondaryPhone,
    string? Email,
    string? AdmissionsEmail,
    string? Website,
    string? WhatsApp,
    string? GoogleMapsUrl,
    string? OfficeHours,
    string? Logo,
    string? PrimaryColor,
    int? CurrentAcademicYearId,
    int? CurrentTermId,
    bool SmtpEnabled,
    bool MaintenanceMode,
    string? MaintenanceMessage
);

public record UpdateSmtpRequest(string Host, int Port, string User, string Password);

public record SocialLinkDto(int Id, string Platform, string? Url, bool IsActive, int SortOrder);
public record UpsertSocialLinksRequest(IEnumerable<SocialLinkItem> Links);
public record SocialLinkItem(string Platform, string? Url, bool IsActive, int SortOrder);

public record NotificationDto(long Id, string Title, string? Body, string? Type, bool IsRead, DateTime CreatedAt);

public record AuditLogDto(long Id, string UserName, string? UserRole, string Action, string Resource, string? ResourceId, string? Details, string? IpAddress, DateTime Timestamp);

public record BackupResultDto(string Filename, string Size, DateTime ExportedAt, Dictionary<string, int> Counts);

public record SystemHealthDto(string Status, bool MaintenanceMode, DateTime? LastBackupAt, int TotalRecords);
