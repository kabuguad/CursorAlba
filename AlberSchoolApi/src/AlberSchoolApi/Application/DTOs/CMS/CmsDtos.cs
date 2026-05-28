namespace AlberSchoolApi.Application.DTOs.CMS;

// ── Content Pages ─────────────────────────────────────────────────────────

public record ContentPageDto(int Id, string Slug, string Title, string? MetaDescription, string? HeroImageUrl, string? HeroTitle, string? HeroSubtitle, string? Body, bool IsPublished, DateTime? UpdatedAt, IEnumerable<ContentSectionDto> Sections);
public record ContentSectionDto(int Id, string? SectionKey, string? Title, string? Body, string? ImageUrl, int SortOrder, string? Metadata);
public record UpdatePageRequest(string Title, string? MetaDescription, string? HeroImageUrl, string? HeroTitle, string? HeroSubtitle, string? Body, bool IsPublished, IEnumerable<UpdateSectionRequest> Sections);
public record UpdateSectionRequest(int? Id, string? SectionKey, string? Title, string? Body, string? ImageUrl, int SortOrder, string? Metadata);

// ── Blog ──────────────────────────────────────────────────────────────────

public record BlogPostListDto(int Id, string Slug, string Title, string? Excerpt, string? FeaturedImageUrl, string? AuthorName, string? Category, DateTime? PublishedAt, int ViewCount);
public record BlogPostDetailDto(int Id, string Slug, string Title, string? Excerpt, string? Body, string? FeaturedImageUrl, string? AuthorName, string? Category, string? Tags, bool IsPublished, DateTime? PublishedAt, int ViewCount);
public record CreatePostRequest(string Title, string Slug, string? Excerpt, string? Body, string? FeaturedImageUrl, string? Category, string? Tags, bool IsPublished);
public record UpdatePostRequest(string Title, string? Excerpt, string? Body, string? FeaturedImageUrl, string? Category, string? Tags, bool IsPublished);

// ── Events ────────────────────────────────────────────────────────────────

public record EventDto(int Id, string Title, string? Description, string? ImageUrl, DateTime StartDate, DateTime? EndDate, string? Location, string? Category, bool IsPublished);
public record CreateEventRequest(string Title, string? Description, string? ImageUrl, DateTime StartDate, DateTime? EndDate, string? Location, string? Category, bool IsPublished = true);
public record UpdateEventRequest(string Title, string? Description, string? ImageUrl, DateTime StartDate, DateTime? EndDate, string? Location, string? Category, bool IsPublished);

// ── Gallery ───────────────────────────────────────────────────────────────

public record AlbumListDto(int Id, string Title, string? CoverImageUrl, string? Category, int ImageCount, bool IsPublished);
public record AlbumDetailDto(int Id, string Title, string? Description, string? CoverImageUrl, string? Category, bool IsPublished, IEnumerable<GalleryImageDto> Images);
public record GalleryImageDto(int Id, string Url, string? ThumbnailUrl, string? Caption, int SortOrder);
public record CreateAlbumRequest(string Title, string? Description, string? Category);
public record AddImageRequest(string Url, string? ThumbnailUrl, string? Caption, int SortOrder = 0);

// ── Media ─────────────────────────────────────────────────────────────────

public record MediaAssetDto(int Id, string Name, string Url, string? ThumbnailUrl, string Type, long? SizeBytes, string? MimeType, string? Category, DateTime UploadedAt);

// ── Testimonials & Virtual Tour ───────────────────────────────────────────

public record TestimonialDto(int Id, string Name, string? Role, string Quote, string? AvatarUrl, bool IsPublished, int SortOrder);
public record CreateTestimonialRequest(string Name, string? Role, string Quote, string? AvatarUrl, int SortOrder = 0);
public record VirtualTourSpotDto(int Id, string Name, string? PanoramaUrl, string? Description, int SortOrder, bool IsPublished);
public record UpdateVirtualTourSpotRequest(string Name, string? PanoramaUrl, string? Description, int SortOrder, bool IsPublished);
