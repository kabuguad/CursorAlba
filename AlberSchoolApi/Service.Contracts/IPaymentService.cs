using DTOs.Finance;
using Entities.Models.Finance;

namespace Service.Contracts;

public interface IPaymentService
{
    Task<IEnumerable<InvoiceResponseDto>> GetInvoicesForStudentAsync(int studentId, bool trackChanges);
    Task<Payment> MakePaymentAsync(PaymentCreateDto dto, int recordedById);
}
