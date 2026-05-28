using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Academic;

public class AssessmentScheme : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public bool IsDefault { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<AssessmentBand> Bands { get; set; } = [];
}

public class AssessmentBand : BaseEntity
{
    public int SchemeId { get; set; }
    public string Label { get; set; } = string.Empty;
    public decimal MinScore { get; set; }
    public decimal MaxScore { get; set; }
    public int? Points { get; set; }
    public int SortOrder { get; set; } = 0;

    public AssessmentScheme Scheme { get; set; } = null!;
}
