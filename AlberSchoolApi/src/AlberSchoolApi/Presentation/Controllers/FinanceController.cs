using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Finance;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Finance;
using AlberSchoolApi.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/finance")]
[Authorize]
public class FinanceController : ControllerBase
{
    private readonly IInvoiceRepository _invoices;
    private readonly IPaymentRepository _payments;
    private readonly IFeeStructureRepository _fees;
    private readonly IScholarshipRepository _scholarships;
    private readonly IExpenseRepository _expenses;

    public FinanceController(IInvoiceRepository invoices, IPaymentRepository payments, IFeeStructureRepository fees, IScholarshipRepository scholarships, IExpenseRepository expenses)
    {
        _invoices = invoices; _payments = payments; _fees = fees; _scholarships = scholarships; _expenses = expenses;
    }

    // ── Invoices ──────────────────────────────────────────────────────────

    [HttpGet("invoices")]
    public async Task<ActionResult<ApiResponse<PagedResult<InvoiceListDto>>>> GetInvoices(
        [FromQuery] string? search, [FromQuery] InvoiceStatus? status, [FromQuery] int? termId,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _invoices.SearchAsync(search, status, termId, page, pageSize, ct);
        var dtos = result.Items.Select(i => new InvoiceListDto(i.Id, i.InvoiceNo, i.StudentId, $"{i.Student.FirstName} {i.Student.LastName}", i.Student.AdmNo, i.TermId, i.Term.Name, i.TotalAmount, i.PaidAmount, i.Balance, i.Status, i.DueDate));
        return Ok(ApiResponse<PagedResult<InvoiceListDto>>.Ok(new PagedResult<InvoiceListDto> { Items = dtos, TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize }));
    }

    [HttpGet("invoices/{id:int}")]
    public async Task<ActionResult<ApiResponse<InvoiceDetailDto>>> GetInvoice(int id, CancellationToken ct)
    {
        var inv = await _invoices.GetWithLineItemsAsync(id, ct);
        if (inv is null) return NotFound(ApiResponse<InvoiceDetailDto>.Fail("Invoice not found."));
        var dto = new InvoiceDetailDto(inv.Id, inv.InvoiceNo, inv.StudentId, $"{inv.Student.FirstName} {inv.Student.LastName}", inv.Student.AdmNo, inv.TermId, inv.Term.Name, inv.IssuedDate, inv.DueDate, inv.TotalAmount, inv.PaidAmount, inv.DiscountAmount, inv.DiscountReason, inv.Balance, inv.Status, inv.LineItems.Select(li => new LineItemDto(li.Id, li.Description, li.Amount, li.SortOrder)));
        return Ok(ApiResponse<InvoiceDetailDto>.Ok(dto));
    }

    [HttpPatch("invoices/{id:int}/discount")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> ApplyDiscount(int id, [FromBody] ApplyDiscountRequest req, CancellationToken ct)
    {
        var inv = await _invoices.GetByIdAsync(id, ct);
        if (inv is null) return NotFound(ApiResponse.Fail("Invoice not found."));
        inv.DiscountAmount = req.DiscountAmount;
        inv.DiscountReason = req.Reason;
        inv.UpdatedAt = DateTime.UtcNow;
        await _invoices.UpdateAsync(inv, ct);
        await _invoices.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Discount applied."));
    }

    // ── Payments ──────────────────────────────────────────────────────────

    [HttpGet("payments")]
    public async Task<ActionResult<ApiResponse<PagedResult<PaymentListDto>>>> GetPayments(
        [FromQuery] string? search, [FromQuery] PaymentStatus? status, [FromQuery] int? termId,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var result = await _payments.SearchAsync(search, status, termId, page, pageSize, ct);
        var dtos = result.Items.Select(p => new PaymentListDto(p.Id, p.Reference, p.StudentId, $"{p.Student.FirstName} {p.Student.LastName}", p.Student.AdmNo, p.Amount, p.Method, p.Status, p.PaymentDate, p.ParentName));
        return Ok(ApiResponse<PagedResult<PaymentListDto>>.Ok(new PagedResult<PaymentListDto> { Items = dtos, TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize }));
    }

    [HttpPost("payments")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<PaymentListDto>>> RecordPayment([FromBody] RecordPaymentRequest req, CancellationToken ct)
    {
        var reference = req.Reference ?? $"PAY{DateTime.UtcNow:yyyyMMddHHmmss}{new Random().Next(1000, 9999)}";
        if (await _payments.ReferenceExistsAsync(reference, ct))
            return Conflict(ApiResponse<PaymentListDto>.Fail("Payment reference already exists."));

        var payment = new Payment
        {
            Reference = reference,
            StudentId = req.StudentId,
            InvoiceId = req.InvoiceId,
            TermId = req.TermId,
            Amount = req.Amount,
            Method = req.Method,
            Description = req.Description,
            ParentName = req.ParentName,
            Phone = req.Phone,
            PaymentDate = req.PaymentDate
        };
        await _payments.AddAsync(payment, ct);

        // Update invoice paid amount if linked
        if (req.InvoiceId.HasValue)
        {
            var inv = await _invoices.GetByIdAsync(req.InvoiceId.Value, ct);
            if (inv is not null)
            {
                inv.PaidAmount += req.Amount;
                inv.Status = inv.PaidAmount >= (inv.TotalAmount - inv.DiscountAmount) ? InvoiceStatus.Paid : InvoiceStatus.Partial;
                await _invoices.UpdateAsync(inv, ct);
            }
        }
        await _payments.SaveChangesAsync(ct);
        return Ok(ApiResponse<PaymentListDto>.Ok(new PaymentListDto(payment.Id, payment.Reference, payment.StudentId, "", "", payment.Amount, payment.Method, payment.Status, payment.PaymentDate, payment.ParentName), "Payment recorded."));
    }

    // ── Fee Structures ────────────────────────────────────────────────────

    [HttpGet("fees")]
    public async Task<ActionResult<ApiResponse<IEnumerable<FeeStructureDto>>>> GetFees([FromQuery] int termId, CancellationToken ct)
    {
        var fees = await _fees.GetByTermAsync(termId, ct);
        return Ok(ApiResponse<IEnumerable<FeeStructureDto>>.Ok(fees.Select(f => new FeeStructureDto(f.Id, f.TermId, f.Term?.Name ?? "", f.GradeLevel, f.Tuition, f.Transport, f.Activities, f.Boarding, f.Meals, f.Tuition + f.Transport + f.Activities + f.Boarding + f.Meals))));
    }

    [HttpPost("fees")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<FeeStructureDto>>> UpsertFee([FromBody] UpsertFeeStructureRequest req, CancellationToken ct)
    {
        var existing = await _fees.GetByTermAndGradeAsync(req.TermId, req.GradeLevel, ct);
        if (existing is not null)
        {
            existing.Tuition = req.Tuition; existing.Transport = req.Transport; existing.Activities = req.Activities; existing.Boarding = req.Boarding; existing.Meals = req.Meals;
            await _fees.UpdateAsync(existing, ct);
            await _fees.SaveChangesAsync(ct);
            return Ok(ApiResponse<FeeStructureDto>.Ok(new FeeStructureDto(existing.Id, existing.TermId, "", existing.GradeLevel, existing.Tuition, existing.Transport, existing.Activities, existing.Boarding, existing.Meals, existing.Tuition + existing.Transport + existing.Activities + existing.Boarding + existing.Meals)));
        }
        var fee = new FeeStructure { TermId = req.TermId, GradeLevel = req.GradeLevel, Tuition = req.Tuition, Transport = req.Transport, Activities = req.Activities, Boarding = req.Boarding, Meals = req.Meals };
        await _fees.AddAsync(fee, ct);
        await _fees.SaveChangesAsync(ct);
        return Ok(ApiResponse<FeeStructureDto>.Ok(new FeeStructureDto(fee.Id, fee.TermId, "", fee.GradeLevel, fee.Tuition, fee.Transport, fee.Activities, fee.Boarding, fee.Meals, fee.Tuition + fee.Transport + fee.Activities + fee.Boarding + fee.Meals), "Fee structure saved."));
    }

    // ── Finance Summary ───────────────────────────────────────────────────

    [HttpGet("summary")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<FinanceSummaryDto>>> GetSummary([FromQuery] int? termId, CancellationToken ct)
    {
        var collected = await _payments.GetTotalCollectedAsync(termId, ct);
        var outstanding = await _invoices.GetTotalOutstandingAsync(termId, ct);
        var expenses = await _expenses.GetTotalApprovedAsync(ct: ct);
        var paid = await _invoices.CountAsync(i => i.Status == InvoiceStatus.Paid, ct);
        var unpaid = await _invoices.CountAsync(i => i.Status == InvoiceStatus.Unpaid, ct);
        var overdue = await _invoices.CountAsync(i => i.Status == InvoiceStatus.Overdue, ct);
        return Ok(ApiResponse<FinanceSummaryDto>.Ok(new FinanceSummaryDto(collected, outstanding, expenses, collected - expenses, paid, unpaid, overdue)));
    }
}
