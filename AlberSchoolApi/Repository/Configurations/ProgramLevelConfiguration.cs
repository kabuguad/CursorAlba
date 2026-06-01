using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configurations;

public class ProgramLevelConfiguration : IEntityTypeConfiguration<ProgramLevel>
{
    public void Configure(EntityTypeBuilder<ProgramLevel> builder)
    {
        builder.HasData(
            new ProgramLevel { Id = 1, Slug = "daycare", Name = "Daycare & Early Years", Ages = "2–5 years", Description = "Nurturing foundation with play-based learning and sensory exploration.", ImageUrl = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop", SortOrder = 1 },
            new ProgramLevel { Id = 2, Slug = "primary", Name = "Primary School", Ages = "6–12 years", Description = "CBC-aligned excellence with literacy, numeracy, and creative foundations.", ImageUrl = "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&h=600&fit=crop", SortOrder = 2 },
            new ProgramLevel { Id = 3, Slug = "junior", Name = "Junior Secondary", Ages = "13–15 years", Description = "Pre-IGCSE pathways with STEM labs and leadership development.", ImageUrl = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop", SortOrder = 3 },
            new ProgramLevel { Id = 4, Slug = "senior", Name = "Senior School", Ages = "16–18 years", Description = "Cambridge IGCSE & A-Level preparation with university counseling.", ImageUrl = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop", SortOrder = 4 }
        );
    }
}