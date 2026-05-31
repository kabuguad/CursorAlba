using DTOs.Finance;
using Entities.Models.Finance;

namespace Service.Contracts;

public interface IFeeService
{
    Task<IEnumerable<FeeStructure>> GetFeesForClassAsync(int classId, bool trackChanges);
    Task<IEnumerable<InvoiceResponseDto>> GetInvoicesForStudentAsync(int studentId, bool trackChanges);
    Task<StudentFee> CreateFeeAsync(FeeStructure feeStructure);
}
