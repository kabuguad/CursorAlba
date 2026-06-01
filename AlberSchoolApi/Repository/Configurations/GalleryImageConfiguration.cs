using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configurations;

public class GalleryImageConfiguration : IEntityTypeConfiguration<GalleryImage>
{
    public void Configure(EntityTypeBuilder<GalleryImage> builder)
    {
        var gallerySeeds = new[]
        {
            "alber-campus1","alber-class1","alber-sports1","alber-arts1","alber-events1","alber-students1",
            "alber-campus2","alber-class2","alber-sports2","alber-arts2","alber-events2","alber-students2"
        };
        var galleryCategories = new[] { "Campus","Classrooms","Sports","Arts","Events","Students" };

        var galleryImages = Enumerable.Range(0, 40).Select(i => new GalleryImage
        {
            Id = i + 1,
            Url = $"https://picsum.photos/seed/{gallerySeeds[i % gallerySeeds.Length]}-{i}/800/600",
            Category = galleryCategories[i % galleryCategories.Length],
            Caption = $"Alber School {galleryCategories[i % galleryCategories.Length]} {i + 1}",
            SortOrder = i + 1,
            IsPublic = true
        }).ToArray();

        builder.HasData(galleryImages);
    }
}