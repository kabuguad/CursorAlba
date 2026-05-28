namespace AlberSchoolApi.Domain.Enums;

public enum InvoiceStatus
{
    Unpaid,
    Partial,
    Paid,
    Overdue
}

public enum PaymentMethod
{
    MPesa,
    BankTransfer,
    Cash
}

public enum PaymentStatus
{
    Completed,
    Pending,
    Failed,
    Refunded
}

public enum ScholarshipType
{
    Percentage,
    Fixed
}

public enum ScholarshipStatus
{
    Active,
    Expired
}

public enum ExpenseStatus
{
    Pending,
    Approved,
    Rejected
}
