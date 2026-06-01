using Entities.Models.Academics;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configurations;

public class SubjectConfiguration : IEntityTypeConfiguration<Subject>
{
    public void Configure(EntityTypeBuilder<Subject> builder)
    {
        builder.HasData(
            new Subject { Id = 1, Name = "Mathematics", Code = "MATH", ClassId = 1 },
            new Subject { Id = 2, Name = "English", Code = "ENG", ClassId = 1 },
            new Subject { Id = 3, Name = "Science", Code = "SCI", ClassId = 1 },
            new Subject { Id = 4, Name = "History", Code = "HIST", ClassId = 1 },
            new Subject { Id = 5, Name = "Physical Education", Code = "PE", ClassId = 1 }
        );
    }
}