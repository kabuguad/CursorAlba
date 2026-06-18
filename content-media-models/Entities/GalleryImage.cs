using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Content;

/// <summary>
/// Represents a single image entry in the school's public photo gallery.
/// </summary>
public class GalleryImage
{
    [Key]
    public int Id { get; set; }

    /// <summary>Direct URL to the hosted image (CDN, Azure Blob, Cloudinary, etc.).</summary>
    [Required, MaxLength(2048)]
    public string Url { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Caption { get; set; }

    /// <summary>
    /// Filter category. Suggested values: Campus · Classrooms · Sports · Arts · Events · Students.
    /// </summary>
    [MaxLength(100)]
    public string? Category { get; set; }

    /// <summary>Manual sort position — lower numbers appear first.</summary>
    public int SortOrder { get; set; } = 0;

    /// <summary>When false, the image is hidden from the public gallery.</summary>
    public bool IsPublic { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
