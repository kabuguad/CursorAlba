namespace AlberSchoolApi.Domain.Entities.Common;

/// <summary>
/// Base entity — all tables with IDENTITY PK derive from this.
/// </summary>
public abstract class BaseEntity
{
    public int Id { get; set; }
}

/// <summary>
/// Adds auditable timestamps and soft-delete support.
/// </summary>
public abstract class AuditableEntity : BaseEntity
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
}
