using Entities.Models.Finance;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configurations;

public class StudentFeeConfiguration : IEntityTypeConfiguration<StudentFee>
{
    public void Configure(EntityTypeBuilder<StudentFee> builder)
    {
        builder.Property(f => f.AmountDue).HasPrecision(18, 2);
        builder.Property(f => f.AmountPaid).HasPrecision(18, 2);
    }
}