namespace AlbaApi.Presentation.DTOs.Admissions;

// ── Full detail — returned by POST /api/admissions and GET /api/admin/admissions/{id} ──

public class ApplicationResponseDto
{
    public int                       Id                 { get; set; }
    public string                    ReferenceNumber    { get; set; } = string.Empty;

    // Child
    public string                    ChildFirstName     { get; set; } = string.Empty;
    public string                    ChildLastName      { get; set; } = string.Empty;
    public DateOnly                  DateOfBirth        { get; set; }
    public string                    ApplyingForGrade   { get; set; } = string.Empty;
    public string?                   PreviousSchool     { get; set; }

    // Parent
    public string                    ParentFirstName    { get; set; } = string.Empty;
    public string                    ParentLastName     { get; set; } = string.Empty;
    public string                    ParentEmail        { get; set; } = string.Empty;
    public string                    ParentPhone        { get; set; } = string.Empty;
    public string?                   ParentIdNumber     { get; set; }
    public string?                   ParentRelationship { get; set; }

    // Admin / Status
    public string                    Status             { get; set; } = string.Empty;
    public string?                   AdminNotes         { get; set; }
    public DateTime                  SubmittedAt        { get; set; }
    public DateTime?                 ReviewedAt         { get; set; }
    public string?                   ReviewedBy         { get; set; }

    // Documents
    public List<DocumentResponseDto> Documents          { get; set; } = [];
}

// ── Slim list row — returned by GET /api/admin/admissions ────────────────────
// Omits document payloads to keep the list response fast.

public class ApplicationSummaryDto
{
    public int      Id               { get; set; }
    public string   ReferenceNumber  { get; set; } = string.Empty;
    public string   ChildFullName    { get; set; } = string.Empty;   // FirstName + " " + LastName
    public string   ApplyingForGrade { get; set; } = string.Empty;
    public string   ParentEmail      { get; set; } = string.Empty;
    public string   ParentPhone      { get; set; } = string.Empty;
    public string   Status           { get; set; } = string.Empty;
    public int      DocumentCount    { get; set; }
    public DateTime SubmittedAt      { get; set; }
}

// ── Document row — nested inside ApplicationResponseDto ──────────────────────

public class DocumentResponseDto
{
    public int      Id               { get; set; }
    public string   DocumentType     { get; set; } = string.Empty;
    public string   OriginalFileName { get; set; } = string.Empty;
    public string   ContentType      { get; set; } = string.Empty;
    public long     FileSizeBytes    { get; set; }

    /// <summary>
    /// Stream URL the frontend uses to download/preview the file.
    /// Format: /api/admissions/{applicationId}/documents/{documentId}
    /// </summary>
    public string   DownloadUrl      { get; set; } = string.Empty;

    public DateTime UploadedAt       { get; set; }
}

// ── Stats — returned by GET /api/admin/admissions/stats ─────────────────────

public class AdmissionsStatsDto
{
    public int Total     { get; set; }
    public int Pending   { get; set; }
    public int Reviewing { get; set; }
    public int Approved  { get; set; }
    public int Rejected  { get; set; }
}
