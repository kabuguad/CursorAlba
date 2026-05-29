using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.CMS;
using AlberSchoolApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AlberSchoolApi.Infrastructure.Repositories;

public class ContentPageRepository : BaseRepository<ContentPage>, IContentPageRepository
{
    public ContentPageRepository(AppDbContext db) : base(db) { }
    public async Task<ContentPage?> GetBySlugAsync(string slug, CancellationToken ct = default) => await _set.FirstOrDefaultAsync(p => p.Slug == slug, ct);
    public async Task<ContentPage?> GetWithSectionsAsync(string slug, CancellationToken ct = default) => await _set.Include(p => p.Sections.OrderBy(s => s.SortOrder)).FirstOrDefaultAsync(p => p.Slug == slug, ct);
}

public class BlogPostRepository : BaseRepository<BlogPost>, IBlogPostRepository
{
    public BlogPostRepository(AppDbContext db) : base(db) { }
    public async Task<BlogPost?> GetBySlugAsync(string slug, CancellationToken ct = default) => await _set.Include(p => p.Author).FirstOrDefaultAsync(p => p.Slug == slug, ct);
    public async Task<PagedResult<BlogPost>> GetPublishedAsync(string? category, string? search, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Include(p => p.Author).Where(p => p.IsPublished);
        if (!string.IsNullOrWhiteSpace(category)) q = q.Where(p => p.Category == category);
        if (!string.IsNullOrWhiteSpace(search)) q = q.Where(p => p.Title.Contains(search) || p.Excerpt != null && p.Excerpt.Contains(search));
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(p => p.PublishedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<BlogPost> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }
    public async Task<PagedResult<BlogPost>> GetAllAdminAsync(string? search, bool? isPublished, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Include(p => p.Author).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) q = q.Where(p => p.Title.Contains(search));
        if (isPublished.HasValue) q = q.Where(p => p.IsPublished == isPublished.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(p => p.CreatedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<BlogPost> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }
    public async Task IncrementViewCountAsync(int id, CancellationToken ct = default)
    {
        await _set.Where(p => p.Id == id).ExecuteUpdateAsync(s => s.SetProperty(p => p.ViewCount, p => p.ViewCount + 1), ct);
    }
}

public class EventRepository : BaseRepository<Event>, IEventRepository
{
    public EventRepository(AppDbContext db) : base(db) { }
    public async Task<PagedResult<Event>> GetUpcomingAsync(string? category, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Where(e => e.IsPublished && e.StartDate >= DateTime.UtcNow);
        if (!string.IsNullOrWhiteSpace(category)) q = q.Where(e => e.Category == category);
        var total = await q.CountAsync(ct);
        var items = await q.OrderBy(e => e.StartDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Event> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }
    public async Task<PagedResult<Event>> GetAllAdminAsync(string? search, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) q = q.Where(e => e.Title.Contains(search));
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(e => e.StartDate).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Event> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }
}

public class GalleryRepository : BaseRepository<GalleryAlbum>, IGalleryRepository
{
    public GalleryRepository(AppDbContext db) : base(db) { }
    public async Task<GalleryAlbum?> GetWithImagesAsync(int id, CancellationToken ct = default) => await _set.Include(a => a.Images.OrderBy(i => i.SortOrder)).FirstOrDefaultAsync(a => a.Id == id, ct);
    public async Task<IEnumerable<GalleryAlbum>> GetPublishedAsync(string? category, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().Where(a => a.IsPublished);
        if (!string.IsNullOrWhiteSpace(category)) q = q.Where(a => a.Category == category);
        return await q.OrderBy(a => a.SortOrder).ToListAsync(ct);
    }
}

public class MediaAssetRepository : BaseRepository<MediaAsset>, IMediaAssetRepository
{
    public MediaAssetRepository(AppDbContext db) : base(db) { }
    public async Task<PagedResult<MediaAsset>> SearchAsync(string? search, string? category, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) q = q.Where(m => m.Name.Contains(search));
        if (!string.IsNullOrWhiteSpace(category)) q = q.Where(m => m.Category == category);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(m => m.UploadedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<MediaAsset> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }
}

public class AdmissionsRepository : BaseRepository<Domain.Entities.Admissions.AdmissionApplication>, IAdmissionsRepository
{
    public AdmissionsRepository(AppDbContext db) : base(db) { }
    public async Task<Domain.Entities.Admissions.AdmissionApplication?> GetByApplicationNoAsync(string applicationNo, CancellationToken ct = default) => await _set.FirstOrDefaultAsync(a => a.ApplicationNo == applicationNo, ct);
    public async Task<Domain.Entities.Admissions.AdmissionApplication?> GetWithDocumentsAsync(int id, CancellationToken ct = default) => await _set.Include(a => a.Documents).Include(a => a.AssignedToUser).Include(a => a.LinkedStudent).FirstOrDefaultAsync(a => a.Id == id, ct);
    public async Task<PagedResult<Domain.Entities.Admissions.AdmissionApplication>> SearchAsync(string? search, Domain.Enums.AdmissionStatus? status, int page, int pageSize, CancellationToken ct = default)
    {
        var q = _set.AsNoTracking().AsQueryable();
        if (!string.IsNullOrWhiteSpace(search)) q = q.Where(a => a.ChildFirstName.Contains(search) || a.ChildLastName.Contains(search) || a.ApplicationNo.Contains(search) || a.ParentEmail.Contains(search));
        if (status.HasValue) q = q.Where(a => a.Status == status.Value);
        var total = await q.CountAsync(ct);
        var items = await q.OrderByDescending(a => a.SubmittedAt).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return new PagedResult<Domain.Entities.Admissions.AdmissionApplication> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
    }
    public async Task<string> GenerateNextApplicationNoAsync(CancellationToken ct = default)
    {
        var year = DateTime.UtcNow.Year.ToString()[2..];
        var count = await _set.CountAsync(ct) + 1;
        return $"APP{year}{count:D4}";
    }
    public async Task UpdateStatusAsync(int id, Domain.Enums.AdmissionStatus status, int? reviewedBy = null, string? notes = null, CancellationToken ct = default)
    {
        await _set.Where(a => a.Id == id).ExecuteUpdateAsync(s => s
            .SetProperty(a => a.Status, status)
            .SetProperty(a => a.Notes, a => notes ?? a.Notes)
            .SetProperty(a => a.ReviewedAt, DateTime.UtcNow)
            .SetProperty(a => a.AssignedTo, a => reviewedBy ?? a.AssignedTo), ct);
    }
    public async Task<Dictionary<Domain.Enums.AdmissionStatus, int>> GetCountsByStatusAsync(CancellationToken ct = default) => await _set.GroupBy(a => a.Status).ToDictionaryAsync(g => g.Key, g => g.Count(), ct);
}
