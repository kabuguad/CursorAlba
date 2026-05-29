using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Transport;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/transport")]
[Authorize]
public class TransportController : ControllerBase
{
    private readonly IBaseRepository<Vehicle> _vehicles;
    private readonly IBaseRepository<TransportRoute> _routes;
    private readonly IBaseRepository<TransportStop> _stops;

    public TransportController(
        IBaseRepository<Vehicle> vehicles,
        IBaseRepository<TransportRoute> routes,
        IBaseRepository<TransportStop> stops)
    {
        _vehicles = vehicles; _routes = routes; _stops = stops;
    }

    // ── Vehicles ──────────────────────────────────────────────────────────

    [HttpGet("vehicles")]
    public async Task<ActionResult<ApiResponse<IEnumerable<object>>>> GetVehicles(CancellationToken ct)
    {
        var vehicles = await _vehicles.GetAllAsync(ct);
        return Ok(ApiResponse<IEnumerable<object>>.Ok(vehicles.Select(v => (object)new
        {
            v.Id, v.RegistrationNo, v.Model, v.Capacity, v.Status, v.InsuranceExpiry, v.LastServiceDate
        })));
    }

    [HttpPost("vehicles")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> CreateVehicle([FromBody] CreateVehicleRequest req, CancellationToken ct)
    {
        if (await _vehicles.ExistsAsync(v => v.RegistrationNo == req.RegistrationNo, ct))
            return Conflict(ApiResponse<object>.Fail("A vehicle with this registration number already exists."));
        var v = new Vehicle { RegistrationNo = req.RegistrationNo, Model = req.Model, Capacity = req.Capacity, InsuranceExpiry = req.InsuranceExpiry, LastServiceDate = req.LastServiceDate };
        await _vehicles.AddAsync(v, ct);
        await _vehicles.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(new { v.Id, v.RegistrationNo, v.Model, v.Status }, "Vehicle added."));
    }

    [HttpPatch("vehicles/{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpdateVehicleStatus(int id, [FromBody] UpdateVehicleStatusRequest req, CancellationToken ct)
    {
        var v = await _vehicles.GetByIdAsync(id, ct);
        if (v is null) return NotFound(ApiResponse.Fail("Vehicle not found."));
        v.Status = req.Status;
        await _vehicles.UpdateAsync(v, ct);
        await _vehicles.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Vehicle status updated."));
    }

    // ── Routes ────────────────────────────────────────────────────────────

    [HttpGet("routes")]
    public async Task<ActionResult<ApiResponse<IEnumerable<object>>>> GetRoutes(CancellationToken ct)
    {
        var routes = await _routes.FindAsync(r => r.IsActive, ct);
        return Ok(ApiResponse<IEnumerable<object>>.Ok(routes.Select(r => (object)new
        {
            r.Id, r.Name, r.Description, r.VehicleId, r.DriverId, r.IsActive
        })));
    }

    [HttpPost("routes")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> CreateRoute([FromBody] CreateRouteRequest req, CancellationToken ct)
    {
        var route = new TransportRoute { Name = req.Name, Description = req.Description, VehicleId = req.VehicleId, DriverId = req.DriverId };
        await _routes.AddAsync(route, ct);
        await _routes.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(new { route.Id, route.Name, route.IsActive }, "Route created."));
    }

    [HttpGet("routes/{id:int}/stops")]
    public async Task<ActionResult<ApiResponse<IEnumerable<object>>>> GetStops(int id, CancellationToken ct)
    {
        var stops = await _stops.FindAsync(s => s.RouteId == id, ct);
        return Ok(ApiResponse<IEnumerable<object>>.Ok(stops.OrderBy(s => s.SortOrder).Select(s => (object)new { s.Id, s.Name, s.ArrivalTime, s.SortOrder })));
    }

    [HttpPost("routes/{id:int}/stops")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> AddStop(int id, [FromBody] AddStopRequest req, CancellationToken ct)
    {
        if (!await _routes.ExistsAsync(r => r.Id == id, ct))
            return NotFound(ApiResponse<object>.Fail("Route not found."));
        var stop = new TransportStop { RouteId = id, Name = req.Name, ArrivalTime = req.ArrivalTime, SortOrder = req.SortOrder };
        await _stops.AddAsync(stop, ct);
        await _stops.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(new { stop.Id, stop.Name, stop.ArrivalTime, stop.SortOrder }, "Stop added."));
    }

    [HttpDelete("routes/{routeId:int}/stops/{stopId:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> DeleteStop(int routeId, int stopId, CancellationToken ct)
    {
        var stop = await _stops.FirstOrDefaultAsync(s => s.Id == stopId && s.RouteId == routeId, ct);
        if (stop is null) return NotFound(ApiResponse.Fail("Stop not found."));
        await _stops.DeleteAsync(stop, ct);
        await _stops.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Stop removed."));
    }

    // ── Request DTOs ──────────────────────────────────────────────────────

    public record CreateVehicleRequest(string RegistrationNo, string? Model, int? Capacity, DateOnly? InsuranceExpiry, DateOnly? LastServiceDate);
    public record UpdateVehicleStatusRequest(VehicleStatus Status);
    public record CreateRouteRequest(string Name, string? Description, int? VehicleId, int? DriverId);
    public record AddStopRequest(string Name, TimeOnly? ArrivalTime, int SortOrder = 0);
}
