using AlberSchoolApi.Domain.Entities.Finance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AlberSchoolApi.Infrastructure.Data.Configurations;

public class FeeStructureConfiguration : IEntityTypeConfiguration<FeeStructure>
{
    public void Configure(EntityTypeBuilder<FeeStructure> b)
    {
        b.ToTable("FeeStructures");
        b.HasKey(f => f.Id);
        b.Property(f => f.GradeLevel).HasMaxLength(50).IsRequired();
        b.Property(f => f.Tuition).HasColumnType("decimal(10,2)");
        b.Property(f => f.Transport).HasColumnType("decimal(10,2)");
        b.Property(f => f.Activities).HasColumnType("decimal(10,2)");
        b.Property(f => f.Boarding).HasColumnType("decimal(10,2)");
        b.Property(f => f.Meals).HasColumnType("decimal(10,2)");
        b.Property(f => f.CreatedAt).HasDefaultValueSql("NOW()");
        b.HasIndex(f => new { f.TermId, f.GradeLevel }).IsUnique();
        b.HasOne(f => f.Term).WithMany(t => t.FeeStructures).HasForeignKey(f => f.TermId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> b)
    {
        b.ToTable("Invoices");
        b.HasKey(i => i.Id);
        b.Property(i => i.InvoiceNo).HasMaxLength(30).IsRequired();
        b.HasIndex(i => i.InvoiceNo).IsUnique();
        b.Property(i => i.TotalAmount).HasColumnType("decimal(10,2)");
        b.Property(i => i.PaidAmount).HasColumnType("decimal(10,2)");
        b.Property(i => i.DiscountAmount).HasColumnType("decimal(10,2)");
        b.Property(i => i.DiscountReason).HasMaxLength(500);
        b.Property(i => i.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(i => i.CreatedAt).HasDefaultValueSql("NOW()");
        b.Ignore(i => i.Balance);
        b.HasOne(i => i.Student).WithMany(s => s.Invoices).HasForeignKey(i => i.StudentId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(i => i.Term).WithMany(t => t.Invoices).HasForeignKey(i => i.TermId).OnDelete(DeleteBehavior.Restrict);
    }
}

public class InvoiceLineItemConfiguration : IEntityTypeConfiguration<InvoiceLineItem>
{
    public void Configure(EntityTypeBuilder<InvoiceLineItem> b)
    {
        b.ToTable("InvoiceLineItems");
        b.HasKey(li => li.Id);
        b.Property(li => li.Description).HasMaxLength(500).IsRequired();
        b.Property(li => li.Amount).HasColumnType("decimal(10,2)");
        b.HasOne(li => li.Invoice).WithMany(i => i.LineItems).HasForeignKey(li => li.InvoiceId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> b)
    {
        b.ToTable("Payments");
        b.HasKey(p => p.Id);
        b.Property(p => p.Reference).HasMaxLength(100).IsRequired();
        b.HasIndex(p => p.Reference).IsUnique();
        b.Property(p => p.Amount).HasColumnType("decimal(10,2)");
        b.Property(p => p.Method).HasConversion<string>().HasMaxLength(30);
        b.Property(p => p.Description).HasMaxLength(500);
        b.Property(p => p.ParentName).HasMaxLength(200);
        b.Property(p => p.Phone).HasMaxLength(50);
        b.Property(p => p.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(p => p.CreatedAt).HasDefaultValueSql("NOW()");
        b.HasOne(p => p.Student).WithMany(s => s.Payments).HasForeignKey(p => p.StudentId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(p => p.Invoice).WithMany(i => i.Payments).HasForeignKey(p => p.InvoiceId).OnDelete(DeleteBehavior.SetNull);
        b.HasOne(p => p.Term).WithMany(t => t.Payments).HasForeignKey(p => p.TermId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(p => p.Recorder).WithMany().HasForeignKey(p => p.RecordedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

public class ScholarshipConfiguration : IEntityTypeConfiguration<Scholarship>
{
    public void Configure(EntityTypeBuilder<Scholarship> b)
    {
        b.ToTable("Scholarships");
        b.HasKey(s => s.Id);
        b.Property(s => s.Type).HasConversion<string>().HasMaxLength(20);
        b.Property(s => s.Value).HasColumnType("decimal(10,2)");
        b.Property(s => s.Reason).HasMaxLength(500);
        b.Property(s => s.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(s => s.CreatedAt).HasDefaultValueSql("NOW()");
        b.HasOne(s => s.Student).WithMany(st => st.Scholarships).HasForeignKey(s => s.StudentId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(s => s.StartTerm).WithMany().HasForeignKey(s => s.StartTermId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(s => s.EndTerm).WithMany().HasForeignKey(s => s.EndTermId).OnDelete(DeleteBehavior.Restrict);
        b.HasOne(s => s.ApprovedByUser).WithMany().HasForeignKey(s => s.ApprovedBy).OnDelete(DeleteBehavior.SetNull);
    }
}

public class ExpenseCategoryConfiguration : IEntityTypeConfiguration<ExpenseCategory>
{
    public void Configure(EntityTypeBuilder<ExpenseCategory> b)
    {
        b.ToTable("ExpenseCategories");
        b.HasKey(c => c.Id);
        b.Property(c => c.Name).HasMaxLength(100).IsRequired();
        b.HasIndex(c => c.Name).IsUnique();
        b.Property(c => c.Description).HasMaxLength(500);
    }
}

public class ExpenseConfiguration : IEntityTypeConfiguration<Expense>
{
    public void Configure(EntityTypeBuilder<Expense> b)
    {
        b.ToTable("Expenses");
        b.HasKey(e => e.Id);
        b.Property(e => e.Description).HasMaxLength(500).IsRequired();
        b.Property(e => e.Amount).HasColumnType("decimal(10,2)");
        b.Property(e => e.Payee).HasMaxLength(300);
        b.Property(e => e.ReceiptNo).HasMaxLength(100);
        b.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
        b.HasOne(e => e.Category).WithMany(c => c.Expenses).HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.SetNull);
        b.HasOne(e => e.ApprovedByUser).WithMany().HasForeignKey(e => e.ApprovedBy).OnDelete(DeleteBehavior.SetNull);
        b.HasOne(e => e.SubmittedByUser).WithMany().HasForeignKey(e => e.SubmittedBy).OnDelete(DeleteBehavior.SetNull);
    }
}
