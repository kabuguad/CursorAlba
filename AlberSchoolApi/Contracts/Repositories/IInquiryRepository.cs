using Entities.Models.Admissions;

namespace Contracts.Repositories;

public interface IInquiryRepository : IRepositoryBase<Inquiry>
{
    Task<IEnumerable<Inquiry>> GetNewAsync(bool trackChanges);
}
