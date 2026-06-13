using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configurations;

public class TheAlberDifferenceConfiguration : IEntityTypeConfiguration<TheAlberDifference>
{
    public void Configure(EntityTypeBuilder<TheAlberDifference> builder)
    {
    }
}