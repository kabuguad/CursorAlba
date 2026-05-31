using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Entities.Models.Finance;

namespace Repository;

public class PaymentRepository : RepositoryBase<Payment>, IPaymentRepository
{
    public PaymentRepository(RepositoryContext context) : base(context) { }

    public async Task<IEnumerable<Payment>> GetByStudentAsync(int studentId, bool trackChanges) =>
        await Context.Payments
            .Where(p => p.StudentFee!.StudentId == studentId)
            .Include(p => p.StudentFee)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
}
