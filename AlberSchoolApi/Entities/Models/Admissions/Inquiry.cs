using Entities.Models.Shared;

namespace Entities.Models.Admissions;

public class Inquiry : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "New";
    public string? Response { get; set; }
}