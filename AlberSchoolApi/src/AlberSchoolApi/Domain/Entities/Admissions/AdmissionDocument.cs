using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Admissions;

public class AdmissionDocument : BaseEntity
{
    public int ApplicationId { get; set; }
    public string? Name { get; set; }
    public string Url { get; set; } = string.Empty;
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    public AdmissionApplication Application { get; set; } = null!;
}
