using Entities.Models.Finance;

namespace Contracts.Repositories;

public interface IFeeRepository : IRepositoryBase<FeeStructure>
{
    Task<IEnumerable<FeeStructure>> GetByClassAsync(int classId, bool trackChanges);
    Task<IEnumerable<StudentFee>> GetByStudentAsync(int studentId, bool trackChanges);
}
