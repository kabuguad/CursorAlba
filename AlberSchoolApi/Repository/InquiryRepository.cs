using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Admissions;

namespace Repository;

public class InquiryRepository : RepositoryBase<Inquiry>, IInquiryRepository
{
    public InquiryRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<Inquiry>> GetNewAsync(bool trackChanges) =>
        await FindByCondition(i => i.Status == "New", trackChanges)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
}
