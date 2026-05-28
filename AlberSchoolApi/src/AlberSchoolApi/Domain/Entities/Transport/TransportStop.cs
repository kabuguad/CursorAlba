using AlberSchoolApi.Domain.Entities.Common;

namespace AlberSchoolApi.Domain.Entities.Transport;

public class TransportStop : BaseEntity
{
    public int RouteId { get; set; }
    public string Name { get; set; } = string.Empty;
    public TimeOnly? ArrivalTime { get; set; }
    public int SortOrder { get; set; } = 0;

    public TransportRoute Route { get; set; } = null!;
}
