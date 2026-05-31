using Entities.Models.Admissions;

namespace Service.Contracts;

public interface IAdmissionsService
{
    Task<Application> SubmitApplicationAsync(Application application);
    Task<IEnumerable<Application>> GetPendingApplicationsAsync(bool trackChanges);
    Task UpdateApplicationStatusAsync(int id, string status, string? notes);
    Task<Inquiry> SubmitInquiryAsync(Inquiry inquiry);
    Task<IEnumerable<Inquiry>> GetNewInquiriesAsync(bool trackChanges);
}
