using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Content;

// ── Request DTOs ──────────────────────────────────────────────────────────────

/// <summary>Payload for POST /api/blog</summary>
public class CreateBlogPostDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300, ErrorMessage = "Title must be 300 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Content is required.")]
    public string Content { get; set; } = string.Empty;

    [MaxLength(600, ErrorMessage = "Summary must be 600 characters or fewer.")]
    public string? Summary { get; set; }

    [MaxLength(2048)]
    [Url(ErrorMessage = "Cover image must be a valid URL.")]
    public string? CoverImageUrl { get; set; }

    public bool IsPublished { get; set; } = false;
}

/// <summary>Payload for PUT /api/blog/{id}</summary>
public class UpdateBlogPostDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Content is required.")]
    public string Content { get; set; } = string.Empty;

    [MaxLength(600)]
    public string? Summary { get; set; }

    [MaxLength(2048)]
    [Url(ErrorMessage = "Cover image must be a valid URL.")]
    public string? CoverImageUrl { get; set; }

    public bool IsPublished { get; set; }
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/blog and GET /api/blog/{id}</summary>
public class BlogPostResponseDto
{
    public int      Id            { get; set; }
    public string   Title         { get; set; } = string.Empty;
    public string   Slug          { get; set; } = string.Empty;
    public string   Content       { get; set; } = string.Empty;
    public string?  Summary       { get; set; }
    public string?  CoverImageUrl { get; set; }
    public string?  AuthorId      { get; set; }
    public bool     IsPublished   { get; set; }
    public DateTime? PublishedAt  { get; set; }
    public int      ViewCount     { get; set; }
    public DateTime CreatedAt     { get; set; }
    public DateTime UpdatedAt     { get; set; }
}
