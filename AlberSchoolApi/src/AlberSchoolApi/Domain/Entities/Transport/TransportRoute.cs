using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Transport;

public class TransportRoute : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? VehicleId { get; set; }
    public int? DriverId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Vehicle? Vehicle { get; set; }
    public People.StaffMember? Driver { get; set; }
    public ICollection<TransportStop> Stops { get; set; } = [];
    public ICollection<People.Student> Students { get; set; } = [];
}
