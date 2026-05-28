using AlberSchoolApi.Domain.Entities.Common;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Domain.Entities.Transport;

public class Vehicle : BaseEntity
{
    public string RegistrationNo { get; set; } = string.Empty;
    public string? Model { get; set; }
    public int? Capacity { get; set; }
    public VehicleStatus Status { get; set; } = VehicleStatus.Active;
    public DateOnly? InsuranceExpiry { get; set; }
    public DateOnly? LastServiceDate { get; set; }

    public ICollection<TransportRoute> Routes { get; set; } = [];
}
