using System.Security.Claims;
using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.CMS;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.CMS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/cms")]
public class CmsController : ControllerBase
{
    private readonly IContentPageRepository _pages;
    private readonly IBlogPostRepository _blog;
    private readonly IEventRepository _events;
    private readonly IGalleryRepository _gallery;
    private readonly IMediaAssetRepository _media;
    private readonly IBaseRepository<Testimonial> _testimonials;
    private readonly IBaseRepository<VirtualTourSpot> _tourSpots;

    public CmsController(IContentPageRepository pages, IBlogPostRepository blog, IEventRepository events,
        IGalleryRepository gallery, IMediaAssetRepository media,
        IBaseRepository<Testimonial> testimonials, IBaseRepository<VirtualTourSpot> tourSpots)
    {
        _pages = pages; _blog = blog; _events = events;
        _gallery = gallery; _media = media; _testimonials = testimonials; _tourSpots = tourSpots;
    }

    // ── Content Pages ─────────────────────────────────────────────────────

    [HttpGet("pages/{slug}")]
    public async Task<ActionResult<ApiResponse<ContentPageDto>>> GetPage(string slug, CancellationToken ct)
    {
        var page = await _pages.GetWithSectionsAsync(slug, ct);
        if (page is null) return NotFound(ApiResponse<ContentPageDto>.Fail("Page not found."));
        return Ok(ApiResponse<ContentPageDto>.Ok(MapPageDto(page)));
    }

    [HttpPut("pages/{slug}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<ContentPageDto>>> UpdatePage(string slug, [FromBody] UpdatePageRequest req, CancellationToken ct)
    {
        var page = await _pages.GetWithSectionsAsync(slug, ct);
        if (page is null) return NotFound(ApiResponse<ContentPageDto>.Fail("Page not found."));

        page.Title = req.Title; page.MetaDescription = req.MetaDescription; page.HeroImageUrl = req.HeroImageUrl;
        page.HeroTitle = req.HeroTitle; page.HeroSubtitle = req.HeroSubtitle; page.Body = req.Body;
        page.IsPublished = req.IsPublished; page.UpdatedAt = DateTime.UtcNow;
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdStr, out var userId)) page.LastEditedBy = userId;

        page.Sections.Clear();
        var sections = req.Sections.Select(s => new ContentSection
        {
            SectionKey = s.SectionKey, Title = s.Title, Body = s.Body, ImageUrl = s.ImageUrl,
            SortOrder = s.SortOrder, Metadata = s.Metadata
        }).ToList();
        foreach (var section in sections) page.Sections.Add(section);

        await _pages.UpdateAsync(page, ct);
        await _pages.SaveChangesAsync(ct);
        return Ok(ApiResponse<ContentPageDto>.Ok(MapPageDto(page), "Page updated."));
    }

    // ── Blog ──────────────────────────────────────────────────────────────

    [HttpGet("blog")]
    public async Task<ActionResult<ApiResponse<PagedResult<BlogPostListDto>>>> GetBlog(
        [FromQuery] string? category, [FromQuery] string? search,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 10, CancellationToken ct = default)
    {
        var result = await _blog.GetPublishedAsync(category, search, page, pageSize, ct);
        return Ok(ApiResponse<PagedResult<BlogPostListDto>>.Ok(new PagedResult<BlogPostListDto>
        {
            Items = result.Items.Select(p => new BlogPostListDto(p.Id, p.Slug, p.Title, p.Excerpt, p.FeaturedImageUrl, p.Author?.Name, p.Category, p.PublishedAt, p.ViewCount)),
            TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize
        }));
    }

    [HttpGet("blog/{slug}")]
    public async Task<ActionResult<ApiResponse<BlogPostDetailDto>>> GetPost(string slug, CancellationToken ct)
    {
        var post = await _blog.GetBySlugAsync(slug, ct);
        if (post is null || !post.IsPublished) return NotFound(ApiResponse<BlogPostDetailDto>.Fail("Post not found."));
        await _blog.IncrementViewCountAsync(post.Id, ct);
        return Ok(ApiResponse<BlogPostDetailDto>.Ok(new BlogPostDetailDto(post.Id, post.Slug, post.Title, post.Excerpt, post.Body, post.FeaturedImageUrl, post.Author?.Name, post.Category, post.Tags, post.IsPublished, post.PublishedAt, post.ViewCount)));
    }

    [HttpPost("blog")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<BlogPostListDto>>> CreatePost([FromBody] CreatePostRequest req, CancellationToken ct)
    {
        if (await _blog.ExistsAsync(p => p.Slug == req.Slug, ct))
            return Conflict(ApiResponse<BlogPostListDto>.Fail("A post with this slug already exists."));
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdStr, out var userId);
        var post = new BlogPost { Slug = req.Slug, Title = req.Title, Excerpt = req.Excerpt, Body = req.Body, FeaturedImageUrl = req.FeaturedImageUrl, Category = req.Category, Tags = req.Tags, IsPublished = req.IsPublished, AuthorId = userId, PublishedAt = req.IsPublished ? DateTime.UtcNow : null };
        await _blog.AddAsync(post, ct);
        await _blog.SaveChangesAsync(ct);
        return Ok(ApiResponse<BlogPostListDto>.Ok(new BlogPostListDto(post.Id, post.Slug, post.Title, post.Excerpt, post.FeaturedImageUrl, null, post.Category, post.PublishedAt, 0), "Post created."));
    }

    [HttpPut("blog/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpdatePost(int id, [FromBody] UpdatePostRequest req, CancellationToken ct)
    {
        var post = await _blog.GetByIdAsync(id, ct);
        if (post is null) return NotFound(ApiResponse.Fail("Post not found."));
        post.Title = req.Title; post.Excerpt = req.Excerpt; post.Body = req.Body; post.FeaturedImageUrl = req.FeaturedImageUrl; post.Category = req.Category; post.Tags = req.Tags;
        if (!post.IsPublished && req.IsPublished) post.PublishedAt = DateTime.UtcNow;
        post.IsPublished = req.IsPublished; post.UpdatedAt = DateTime.UtcNow;
        await _blog.UpdateAsync(post, ct);
        await _blog.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Post updated."));
    }

    [HttpDelete("blog/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> DeletePost(int id, CancellationToken ct)
    {
        var post = await _blog.GetByIdAsync(id, ct);
        if (post is null) return NotFound(ApiResponse.Fail("Post not found."));
        await _blog.DeleteAsync(post, ct);
        await _blog.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Post deleted."));
    }

    // ── Events ────────────────────────────────────────────────────────────

    [HttpGet("events")]
    public async Task<ActionResult<ApiResponse<PagedResult<EventDto>>>> GetEvents(
        [FromQuery] string? category, [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10, CancellationToken ct = default)
    {
        var result = await _events.GetUpcomingAsync(category, page, pageSize, ct);
        return Ok(ApiResponse<PagedResult<EventDto>>.Ok(new PagedResult<EventDto>
        {
            Items = result.Items.Select(e => new EventDto(e.Id, e.Title, e.Description, e.ImageUrl, e.StartDate, e.EndDate, e.Location, e.Category, e.IsPublished)),
            TotalCount = result.TotalCount, Page = result.Page, PageSize = result.PageSize
        }));
    }

    [HttpPost("events")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<EventDto>>> CreateEvent([FromBody] CreateEventRequest req, CancellationToken ct)
    {
        var userIdStr = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int.TryParse(userIdStr, out var userId);
        var ev = new Event { Title = req.Title, Description = req.Description, ImageUrl = req.ImageUrl, StartDate = req.StartDate, EndDate = req.EndDate, Location = req.Location, Category = req.Category, IsPublished = req.IsPublished, CreatedBy = userId };
        await _events.AddAsync(ev, ct);
        await _events.SaveChangesAsync(ct);
        return Ok(ApiResponse<EventDto>.Ok(new EventDto(ev.Id, ev.Title, ev.Description, ev.ImageUrl, ev.StartDate, ev.EndDate, ev.Location, ev.Category, ev.IsPublished), "Event created."));
    }

    [HttpPut("events/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> UpdateEvent(int id, [FromBody] UpdateEventRequest req, CancellationToken ct)
    {
        var ev = await _events.GetByIdAsync(id, ct);
        if (ev is null) return NotFound(ApiResponse.Fail("Event not found."));
        ev.Title = req.Title; ev.Description = req.Description; ev.ImageUrl = req.ImageUrl;
        ev.StartDate = req.StartDate; ev.EndDate = req.EndDate; ev.Location = req.Location;
        ev.Category = req.Category; ev.IsPublished = req.IsPublished;
        await _events.UpdateAsync(ev, ct);
        await _events.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Event updated."));
    }

    [HttpDelete("events/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> DeleteEvent(int id, CancellationToken ct)
    {
        var ev = await _events.GetByIdAsync(id, ct);
        if (ev is null) return NotFound(ApiResponse.Fail("Event not found."));
        await _events.DeleteAsync(ev, ct);
        await _events.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Event deleted."));
    }

    // ── Gallery ───────────────────────────────────────────────────────────

    [HttpGet("gallery")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AlbumListDto>>>> GetGallery([FromQuery] string? category, CancellationToken ct)
    {
        var albums = await _gallery.GetPublishedAsync(category, ct);
        return Ok(ApiResponse<IEnumerable<AlbumListDto>>.Ok(albums.Select(a => new AlbumListDto(a.Id, a.Title, a.CoverImageUrl, a.Category, a.Images.Count, a.IsPublished))));
    }

    [HttpGet("gallery/{id:int}")]
    public async Task<ActionResult<ApiResponse<AlbumDetailDto>>> GetAlbum(int id, CancellationToken ct)
    {
        var album = await _gallery.GetWithImagesAsync(id, ct);
        if (album is null) return NotFound(ApiResponse<AlbumDetailDto>.Fail("Album not found."));
        return Ok(ApiResponse<AlbumDetailDto>.Ok(new AlbumDetailDto(album.Id, album.Title, album.Description, album.CoverImageUrl, album.Category, album.IsPublished, album.Images.Select(i => new GalleryImageDto(i.Id, i.Url, i.ThumbnailUrl, i.Caption, i.SortOrder)))));
    }

    [HttpPost("gallery")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<AlbumListDto>>> CreateAlbum([FromBody] CreateAlbumRequest req, CancellationToken ct)
    {
        var album = new GalleryAlbum { Title = req.Title, Description = req.Description, Category = req.Category };
        await _gallery.AddAsync(album, ct);
        await _gallery.SaveChangesAsync(ct);
        return Ok(ApiResponse<AlbumListDto>.Ok(new AlbumListDto(album.Id, album.Title, album.CoverImageUrl, album.Category, 0, album.IsPublished), "Album created."));
    }

    // ── Testimonials ──────────────────────────────────────────────────────

    [HttpGet("testimonials")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TestimonialDto>>>> GetTestimonials(CancellationToken ct)
    {
        var items = await _testimonials.FindAsync(t => t.IsPublished, ct);
        return Ok(ApiResponse<IEnumerable<TestimonialDto>>.Ok(items.OrderBy(t => t.SortOrder).Select(t => new TestimonialDto(t.Id, t.Name, t.Role, t.Quote, t.AvatarUrl, t.IsPublished, t.SortOrder))));
    }

    [HttpPost("testimonials")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> CreateTestimonial([FromBody] CreateTestimonialRequest req, CancellationToken ct)
    {
        var t = new Testimonial { Name = req.Name, Role = req.Role, Quote = req.Quote, AvatarUrl = req.AvatarUrl, SortOrder = req.SortOrder };
        await _testimonials.AddAsync(t, ct);
        await _testimonials.SaveChangesAsync(ct);
        return Ok(ApiResponse<TestimonialDto>.Ok(new TestimonialDto(t.Id, t.Name, t.Role, t.Quote, t.AvatarUrl, t.IsPublished, t.SortOrder), "Testimonial created."));
    }

    [HttpDelete("testimonials/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse>> DeleteTestimonial(int id, CancellationToken ct)
    {
        var t = await _testimonials.GetByIdAsync(id, ct);
        if (t is null) return NotFound(ApiResponse.Fail("Testimonial not found."));
        await _testimonials.DeleteAsync(t, ct);
        await _testimonials.SaveChangesAsync(ct);
        return Ok(ApiResponse.Ok("Testimonial deleted."));
    }

    // ── Virtual Tour ──────────────────────────────────────────────────────

    [HttpGet("virtual-tour")]
    public async Task<ActionResult<ApiResponse<IEnumerable<VirtualTourSpotDto>>>> GetTour(CancellationToken ct)
    {
        var spots = await _tourSpots.FindAsync(s => s.IsPublished, ct);
        return Ok(ApiResponse<IEnumerable<VirtualTourSpotDto>>.Ok(spots.OrderBy(s => s.SortOrder).Select(s => new VirtualTourSpotDto(s.Id, s.Name, s.PanoramaUrl, s.Description, s.SortOrder, s.IsPublished))));
    }

    [HttpPut("virtual-tour/{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<VirtualTourSpotDto>>> UpdateSpot(int id, [FromBody] UpdateVirtualTourSpotRequest req, CancellationToken ct)
    {
        var spot = await _tourSpots.GetByIdAsync(id, ct);
        if (spot is null) return NotFound(ApiResponse<VirtualTourSpotDto>.Fail("Tour spot not found."));
        spot.Name = req.Name; spot.PanoramaUrl = req.PanoramaUrl; spot.Description = req.Description; spot.SortOrder = req.SortOrder; spot.IsPublished = req.IsPublished;
        await _tourSpots.UpdateAsync(spot, ct);
        await _tourSpots.SaveChangesAsync(ct);
        return Ok(ApiResponse<VirtualTourSpotDto>.Ok(new VirtualTourSpotDto(spot.Id, spot.Name, spot.PanoramaUrl, spot.Description, spot.SortOrder, spot.IsPublished), "Tour spot updated."));
    }

    private static ContentPageDto MapPageDto(ContentPage p) => new(
        p.Id, p.Slug, p.Title, p.MetaDescription, p.HeroImageUrl, p.HeroTitle, p.HeroSubtitle,
        p.Body, p.IsPublished, p.UpdatedAt,
        p.Sections.Select(s => new ContentSectionDto(s.Id, s.SectionKey, s.Title, s.Body, s.ImageUrl, s.SortOrder, s.Metadata)));
}
