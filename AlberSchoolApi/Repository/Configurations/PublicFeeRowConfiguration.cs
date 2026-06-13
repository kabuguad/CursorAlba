using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configurations;

public class PublicFeeRowConfiguration : IEntityTypeConfiguration<PublicFeeRow>
{
    public void Configure(EntityTypeBuilder<PublicFeeRow> builder)
    {
        builder.Property(f => f.Tuition).HasPrecision(18, 2);
        builder.Property(f => f.Transport).HasPrecision(18, 2);
        builder.Property(f => f.Activities).HasPrecision(18, 2);
    }
}