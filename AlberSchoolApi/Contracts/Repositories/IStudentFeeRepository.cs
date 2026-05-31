using Entities.Models.Finance;

namespace Contracts.Repositories;

public interface IStudentFeeRepository : IRepositoryBase<StudentFee>
{
    Task<IEnumerable<StudentFee>> GetByStudentAsync(int studentId, bool trackChanges);
    Task<StudentFee?> GetByIdAsync(int id, bool trackChanges);
}
