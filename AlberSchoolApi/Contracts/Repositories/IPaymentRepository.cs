using Entities.Models.Finance;

namespace Contracts.Repositories;

public interface IPaymentRepository : IRepositoryBase<Payment>
{
    Task<IEnumerable<Payment>> GetByStudentAsync(int studentId, bool trackChanges);
}
