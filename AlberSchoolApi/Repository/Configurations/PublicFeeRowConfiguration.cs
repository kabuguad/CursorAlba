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

        builder.HasData(
            new PublicFeeRow { Id = 1, Level = "Daycare", Tuition = 85000, Transport = 18000, Activities = 12000, SortOrder = 1 },
            new PublicFeeRow { Id = 2, Level = "Primary", Tuition = 145000, Transport = 22000, Activities = 15000, SortOrder = 2 },
            new PublicFeeRow { Id = 3, Level = "Junior Secondary", Tuition = 185000, Transport = 25000, Activities = 18000, SortOrder = 3 },
            new PublicFeeRow { Id = 4, Level = "Senior / IGCSE", Tuition = 245000, Transport = 28000, Activities = 22000, SortOrder = 4 }
        );
    }
}