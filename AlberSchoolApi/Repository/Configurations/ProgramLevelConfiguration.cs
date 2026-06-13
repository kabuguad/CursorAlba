using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configurations;

public class ProgramLevelConfiguration : IEntityTypeConfiguration<ProgramLevel>
{
    public void Configure(EntityTypeBuilder<ProgramLevel> builder)
    {
    }
}