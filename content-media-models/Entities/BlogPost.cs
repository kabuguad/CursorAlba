using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities.Models.Content;

/// <summary>
/// Represents a school news article or blog post shown on the public /blog page.
/// </summary>
public class BlogPost
{
    [Key]
    public int Id { get; set; }

    [Required, MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    /// <summary>URL-friendly slug derived from the title. Must be unique.</summary>
    [Required, MaxLength(320)]
    public string Slug { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [MaxLength(600)]
    public string? Summary { get; set; }

    [MaxLength(2048)]
    public string? CoverImageUrl { get; set; }

    /// <summary>FK to the ASP.NET Core Identity user who authored the post.</summary>
    [MaxLength(450)]
    public string? AuthorId { get; set; }

    public bool IsPublished { get; set; } = false;

    public DateTime? PublishedAt { get; set; }

    public int ViewCount { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ── Navigation ────────────────────────────────────────────────────────────
    // Uncomment when your Identity User entity is wired up:
    // [ForeignKey(nameof(AuthorId))]
    // public ApplicationUser? Author { get; set; }
}
