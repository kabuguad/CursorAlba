namespace AlberSchoolApi.Domain.Enums;

public enum UserRole
{
    Admin,
    Teacher,
    Parent,
    Student
}

public enum UserStatus
{
    Active,
    Inactive,
    Suspended
}

public enum AuditAction
{
    Create,
    Update,
    Delete,
    Login,
    Logout,
    Export,
    View
}
