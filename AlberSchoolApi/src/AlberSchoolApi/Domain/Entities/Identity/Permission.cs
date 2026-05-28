using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Identity;

public class Permission : BaseEntity
{
    /// <summary>e.g. "manage_students", "view_reports"</summary>
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? PermissionGroup { get; set; }

    public ICollection<UserPermission> UserPermissions { get; set; } = [];
}
