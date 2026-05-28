namespace AlberSchoolApi.Domain.Enums;

public enum AnnouncementPriority
{
    Normal,
    High,
    Urgent
}

public enum AnnouncementStatus
{
    Draft,
    Published,
    Expired
}

public enum MeetingSlotStatus
{
    Available,
    Booked,
    Cancelled
}

public enum LeaveType
{
    Annual,
    Sick,
    Maternity,
    Emergency,
    Study
}

public enum LeaveStatus
{
    Pending,
    Approved,
    Rejected
}
