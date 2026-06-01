using Entities.Models.Academics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configurations;

public class ClassConfiguration : IEntityTypeConfiguration<Class>
{
    public void Configure(EntityTypeBuilder<Class> builder)
    {
        builder.HasData(
            new Class { Id = 1, Name = "Grade 10", Section = "A", Description = "Grade 10 Section A" },
            new Class { Id = 2, Name = "Grade 9", Section = "B", Description = "Grade 9 Section B" }
        );
    }
}