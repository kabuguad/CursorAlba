using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Finance;
using AlberSchoolApi.Domain.Enums;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

public class InvoiceRepository : BaseRepository<Invoice>, IInvoiceRepository
{
    public InvoiceRepository(AppDbContext db) : base(db) { }

    public async Task<Invoice?> GetWithLineItemsAsync(int id, CancellationToken ct = default)
        => await _set.Include(i => i.LineItems.OrderBy(li => li.SortOrder))
            .Include(i => i.Student).Include(i => i.Term)
            .FirstOrDefaultAsync(i => i.Id == id, ct);

    public async Task<Invoice?> GetByInvoiceNoAsync(string invoiceNo, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(i => i.InvoiceNo == invoiceNo, ct);

    public async Task<PagedResult<Invoice>> SearchAsync(string? search, InvoiceStatus? status, int? termId, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Include(i => i.Student).Include(i => i.Term).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(i => i.InvoiceNo.Contains(search) || i.Student.FirstName.Contains(search) || i.Student.LastName.Contains(search) || i.Student.AdmNo.Contains(search));
        if (status.HasValue) q = q.Where(i => i.Status == status.Value);
        if (termId.HasValue) q = q.Where(i => i.TermId == termId.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(i => i.IssuedDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Invoice> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task<IEnumerable<Invoice>> GetByStudentAsync(int studentId, CancellationToken ct = default)
        => await _set.AsNoTracking().Include(i => i.Term).Where(i => i.StudentId == studentId).OrderByDescending(i => i.IssuedDate).ToListAsync(ct);

    public async Task<string> GenerateNextInvoiceNoAsync(CancellationToken ct = default)
    {
        var year = DateTime.UtcNow.Year;
        var count = await _set.CountAsync(i => i.IssuedDate.Year == year, ct) + 1;
        return $"INV{year}{count:D5}";
    }

    public async Task UpdateStatusAsync(int id, InvoiceStatus status, CancellationToken ct = default)
    {
        await _set.Where(i => i.Id == id)
            .ExecuteUpdateAsync(s => s.SetProperty(i => i.Status, status).SetProperty(i => i.UpdatedAt, DateTime.UtcNow), ct);
    }

    public async Task<decimal> GetTotalOutstandingAsync(int? termId = null, CancellationToken ct = default)
    {
        var q = _set.Where(i => i.Status != InvoiceStatus.Paid);
        if (termId.HasValue) q = q.Where(i => i.TermId == termId.Value);
        return await q.SumAsync(i => i.TotalAmount - i.PaidAmount - i.DiscountAmount, ct);
    }
}

public class PaymentRepository : BaseRepository<Payment>, IPaymentRepository
{
    public PaymentRepository(AppDbContext db) : base(db) { }

    public async Task<Payment?> GetByReferenceAsync(string reference, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(p => p.Reference == reference, ct);

    public async Task<PagedResult<Payment>> SearchAsync(string? search, PaymentStatus? status, int? termId, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Include(p => p.Student).Include(p => p.Term).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(p => p.Reference.Contains(search) || p.Student.FirstName.Contains(search) || p.Student.LastName.Contains(search) || p.Student.AdmNo.Contains(search));
        if (status.HasValue) q = q.Where(p => p.Status == status.Value);
        if (termId.HasValue) q = q.Where(p => p.TermId == termId.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(p => p.PaymentDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Payment> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task<IEnumerable<Payment>> GetByStudentAsync(int studentId, CancellationToken ct = default)
        => await _set.AsNoTracking().Where(p => p.StudentId == studentId).OrderByDescending(p => p.PaymentDate).ToListAsync(ct);

    public async Task<decimal> GetTotalCollectedAsync(int? termId = null, CancellationToken ct = default)
    {
        var q = _set.Where(p => p.Status == PaymentStatus.Completed);
        if (termId.HasValue) q = q.Where(p => p.TermId == termId.Value);
        return await q.SumAsync(p => p.Amount, ct);
    }

    public async Task<bool> ReferenceExistsAsync(string reference, CancellationToken ct = default)
        => await _set.AnyAsync(p => p.Reference == reference, ct);
}

public class FeeStructureRepository : BaseRepository<FeeStructure>, IFeeStructureRepository
{
    public FeeStructureRepository(AppDbContext db) : base(db) { }

    public async Task<FeeStructure?> GetByTermAndGradeAsync(int termId, string gradeLevel, CancellationToken ct = default)
        => await _set.FirstOrDefaultAsync(f => f.TermId == termId && f.GradeLevel == gradeLevel, ct);

    public async Task<IEnumerable<FeeStructure>> GetByTermAsync(int termId, CancellationToken ct = default)
        => await _set.AsNoTracking().Where(f => f.TermId == termId).ToListAsync(ct);
}

public class ScholarshipRepository : BaseRepository<Scholarship>, IScholarshipRepository
{
    public ScholarshipRepository(AppDbContext db) : base(db) { }

    public async Task<IEnumerable<Scholarship>> GetByStudentAsync(int studentId, CancellationToken ct = default)
        => await _set.AsNoTracking().Include(s => s.StartTerm).Include(s => s.EndTerm)
            .Where(s => s.StudentId == studentId).ToListAsync(ct);

    public async Task<IEnumerable<Scholarship>> GetActiveAsync(CancellationToken ct = default)
        => await _set.AsNoTracking().Include(s => s.Student).Include(s => s.StartTerm)
            .Where(s => s.Status == ScholarshipStatus.Active).ToListAsync(ct);
}

public class ExpenseRepository : BaseRepository<Expense>, IExpenseRepository
{
    public ExpenseRepository(AppDbContext db) : base(db) { }

    public async Task<PagedResult<Expense>> SearchAsync(string? search, ExpenseStatus? status, int? categoryId, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Include(e => e.Category).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) q = q.Where(e => e.Description.Contains(search) || (e.Payee != null && e.Payee.Contains(search)));
        if (status.HasValue) q = q.Where(e => e.Status == status.Value);
        if (categoryId.HasValue) q = q.Where(e => e.CategoryId == categoryId.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(e => e.ExpenseDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Expense> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }

    public async Task<decimal> GetTotalApprovedAsync(DateOnly? from = null, DateOnly? to = null, CancellationToken ct = default)
    {
        var q = _set.Where(e => e.Status == ExpenseStatus.Approved);
        if (from.HasValue) q = q.Where(e => e.ExpenseDate >= from.Value);
        if (to.HasValue) q = q.Where(e => e.ExpenseDate <= to.Value);
        return await q.SumAsync(e => e.Amount, ct);
    }

    public async Task UpdateStatusAsync(int id, ExpenseStatus status, int approvedBy, CancellationToken ct = default)
    {
        await _set.Where(e => e.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(e => e.Status, status)
                .SetProperty(e => e.ApprovedBy, approvedBy), ct);
    }
}
