using AlberSchoolApi.Domain.Enums;

namespace AlberSchoolApi.Application.DTOs.Finance;

// ── Fee Structures ────────────────────────────────────────────────────────

public record FeeStructureDto(int Id, int TermId, string TermName, string GradeLevel, decimal Tuition, decimal Transport, decimal Activities, decimal Boarding, decimal Meals, decimal Total);
public record UpsertFeeStructureRequest(int TermId, string GradeLevel, decimal Tuition, decimal Transport = 0, decimal Activities = 0, decimal Boarding = 0, decimal Meals = 0);

// ── Invoices ──────────────────────────────────────────────────────────────

public record InvoiceListDto(int Id, string InvoiceNo, int StudentId, string StudentName, string AdmNo, int TermId, string TermName, decimal TotalAmount, decimal PaidAmount, decimal Balance, InvoiceStatus Status, DateOnly DueDate);
public record InvoiceDetailDto(int Id, string InvoiceNo, int StudentId, string StudentName, string AdmNo, int TermId, string TermName, DateOnly IssuedDate, DateOnly DueDate, decimal TotalAmount, decimal PaidAmount, decimal DiscountAmount, string? DiscountReason, decimal Balance, InvoiceStatus Status, IEnumerable<LineItemDto> LineItems);
public record LineItemDto(int Id, string Description, decimal Amount, int SortOrder);
public record GenerateInvoicesRequest(int TermId, IEnumerable<int>? StudentIds);
public record ApplyDiscountRequest(decimal DiscountAmount, string Reason);

// ── Payments ──────────────────────────────────────────────────────────────

public record PaymentListDto(int Id, string Reference, int StudentId, string StudentName, string AdmNo, decimal Amount, PaymentMethod Method, PaymentStatus Status, DateOnly PaymentDate, string? ParentName);
public record PaymentDetailDto(int Id, string Reference, int StudentId, string StudentName, int? InvoiceId, string? InvoiceNo, int TermId, string TermName, decimal Amount, PaymentMethod Method, string? Description, string? ParentName, string? Phone, PaymentStatus Status, DateOnly PaymentDate);
public record RecordPaymentRequest(int StudentId, int? InvoiceId, int TermId, decimal Amount, PaymentMethod Method, string? Description, string? ParentName, string? Phone, DateOnly PaymentDate, string? Reference);

// ── Scholarships ──────────────────────────────────────────────────────────

public record ScholarshipDto(int Id, int StudentId, string StudentName, ScholarshipType Type, decimal Value, string? Reason, int StartTermId, string StartTermName, int? EndTermId, string? EndTermName, ScholarshipStatus Status, string? ApprovedByName, DateTime CreatedAt);
public record CreateScholarshipRequest(int StudentId, ScholarshipType Type, decimal Value, string? Reason, int StartTermId, int? EndTermId);

// ── Expenses ──────────────────────────────────────────────────────────────

public record ExpenseDto(int Id, int? CategoryId, string? CategoryName, string Description, decimal Amount, string? Payee, string? ReceiptNo, DateOnly ExpenseDate, ExpenseStatus Status, string? ApprovedByName, DateTime CreatedAt);
public record CreateExpenseRequest(int? CategoryId, string Description, decimal Amount, string? Payee, string? ReceiptNo, DateOnly ExpenseDate);
public record ReviewExpenseRequest(ExpenseStatus Status);

// ── Finance Summary ───────────────────────────────────────────────────────

public record FinanceSummaryDto(decimal TotalCollected, decimal TotalOutstanding, decimal TotalExpenses, decimal NetBalance, int PaidInvoices, int UnpaidInvoices, int OverdueInvoices);
