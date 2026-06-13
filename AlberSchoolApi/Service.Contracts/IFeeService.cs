using DTOs.Finance;

namespace Service.Contracts;

public interface IFeeService
{
    Task<IEnumerable<FeeStructureDto>> GetAllFeeStructuresAsync(bool trackChanges);
    Task<FeeStructureDto> GetFeeStructureByIdAsync(int id, bool trackChanges);
    Task<FeeStructureDto> CreateFeeStructureAsync(FeeStructureCreateDto dto);
    Task UpdateFeeStructureAsync(int id, FeeStructureUpdateDto dto);
    Task DeleteFeeStructureAsync(int id);
    Task<IEnumerable<InvoiceResponseDto>> GetInvoicesForStudentAsync(int studentId, bool trackChanges);
}