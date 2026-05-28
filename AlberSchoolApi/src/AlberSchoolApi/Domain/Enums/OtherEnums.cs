namespace AlberSchoolApi.Domain.Enums;

public enum VehicleStatus
{
    Active,
    Maintenance,
    Retired
}

public enum BorrowingStatus
{
    Active,
    Returned,
    Overdue
}

public enum BorrowerType
{
    Student,
    Staff
}

public enum AdmissionStatus
{
    Pending,
    Reviewing,
    Approved,
    Rejected
}

public enum MediaType
{
    Image,
    Document,
    Video
}

public enum LinkedProfileType
{
    Student,
    Staff
}
