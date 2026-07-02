namespace Entities.Models.Admissions;

/// <summary>
/// Stored as a string in the database (not an int) so the SQLite browser
/// shows "Pending" rather than 0 — no lookup table required.
/// </summary>
public enum ApplicationStatus
{
    Pending   = 0,
    Reviewing = 1,
    Approved  = 2,
    Rejected  = 3,
}
