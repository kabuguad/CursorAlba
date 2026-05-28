namespace AlberSchoolApi.Domain.Entities.System;

/// <summary>
/// Singleton configuration row — always exactly one record (Id = 1).
/// Enforced via CHECK (Id = 1) in EF configuration.
/// </summary>
public class SystemSettings
{
    public int Id { get; set; } = 1;
    public string SchoolName { get; set; } = string.Empty;
    public string? SchoolMotto { get; set; }
    public int? Founded { get; set; }
    public string? County { get; set; }
    public string? Town { get; set; }
    public string? Address { get; set; }
    public string? PoBox { get; set; }
    public string? Phone { get; set; }
    public string? SecondaryPhone { get; set; }
    public string? Email { get; set; }
    public string? AdmissionsEmail { get; set; }
    public string? Website { get; set; }
    public string? WhatsApp { get; set; }
    public string? GoogleMapsUrl { get; set; }
    public string? OfficeHours { get; set; }
    public string? Logo { get; set; }
    public string? PrimaryColor { get; set; }
    public int? CurrentAcademicYearId { get; set; }
    public int? CurrentTermId { get; set; }
    public string? SmtpHost { get; set; }
    public int SmtpPort { get; set; } = 587;
    public string? SmtpUser { get; set; }
    /// <summary>Stored encrypted — never expose in API responses.</summary>
    public string? SmtpPasswordEncrypted { get; set; }
    public bool SmtpEnabled { get; set; } = false;
    public bool MaintenanceMode { get; set; } = false;
    public string? MaintenanceMessage { get; set; }
    public DateTime? LastBackupAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? UpdatedBy { get; set; }

    public Academic.AcademicYear? CurrentAcademicYear { get; set; }
    public Academic.Term? CurrentTerm { get; set; }
    public Identity.User? UpdatedByUser { get; set; }
}
