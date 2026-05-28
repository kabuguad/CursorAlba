using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Domain.Entities.Finance;
using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface IInvoiceRepository : IBaseRepository<Invoice>
{
    Task<Invoice?> GetWithLineItemsAsync(int id, CancellationToken ct = default);
    Task<Invoice?> GetByInvoiceNoAsync(string invoiceNo, CancellationToken ct = default);
    Task<PagedResult<Invoice>> SearchAsync(string? search, InvoiceStatus? status, int? termId, int page, int pageSize, CancellationToken ct = default);
    Task<IEnumerable<Invoice>> GetByStudentAsync(int studentId, CancellationToken ct = default);
    Task<string> GenerateNextInvoiceNoAsync(CancellationToken ct = default);
    Task UpdateStatusAsync(int id, InvoiceStatus status, CancellationToken ct = default);
    Task<decimal> GetTotalOutstandingAsync(int? termId = null, CancellationToken ct = default);
}

public interface IPaymentRepository : IBaseRepository<Payment>
{
    Task<Payment?> GetByReferenceAsync(string reference, CancellationToken ct = default);
    Task<PagedResult<Payment>> SearchAsync(string? search, PaymentStatus? status, int? termId, int page, int pageSize, CancellationToken ct = default);
    Task<IEnumerable<Payment>> GetByStudentAsync(int studentId, CancellationToken ct = default);
    Task<decimal> GetTotalCollectedAsync(int? termId = null, CancellationToken ct = default);
    Task<bool> ReferenceExistsAsync(string reference, CancellationToken ct = default);
}

public interface IExpenseRepository : IBaseRepository<Expense>
{
    Task<PagedResult<Expense>> SearchAsync(string? search, ExpenseStatus? status, int? categoryId, int page, int pageSize, CancellationToken ct = default);
    Task<decimal> GetTotalApprovedAsync(DateOnly? from = null, DateOnly? to = null, CancellationToken ct = default);
    Task UpdateStatusAsync(int id, ExpenseStatus status, int approvedBy, CancellationToken ct = default);
}

public interface IScholarshipRepository : IBaseRepository<Scholarship>
{
    Task<IEnumerable<Scholarship>> GetByStudentAsync(int studentId, CancellationToken ct = default);
    Task<IEnumerable<Scholarship>> GetActiveAsync(CancellationToken ct = default);
}

public interface IFeeStructureRepository : IBaseRepository<FeeStructure>
{
    Task<FeeStructure?> GetByTermAndGradeAsync(int termId, string gradeLevel, CancellationToken ct = default);
    Task<IEnumerable<FeeStructure>> GetByTermAsync(int termId, CancellationToken ct = default);
}
