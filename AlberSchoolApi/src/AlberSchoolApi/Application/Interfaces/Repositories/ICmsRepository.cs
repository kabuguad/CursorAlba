using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Domain.Entities.CMS;

namespace AlberSchoolApi.Application.Interfaces.Repositories;

public interface IContentPageRepository : IBaseRepository<ContentPage>
{
    Task<ContentPage?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<ContentPage?> GetWithSectionsAsync(string slug, CancellationToken ct = default);
}

public interface IBlogPostRepository : IBaseRepository<BlogPost>
{
    Task<BlogPost?> GetBySlugAsync(string slug, CancellationToken ct = default);
    Task<PagedResult<BlogPost>> GetPublishedAsync(string? category, string? search, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<BlogPost>> GetAllAdminAsync(string? search, bool? isPublished, int page, int pageSize, CancellationToken ct = default);
    Task IncrementViewCountAsync(int id, CancellationToken ct = default);
}

public interface IEventRepository : IBaseRepository<Event>
{
    Task<PagedResult<Event>> GetUpcomingAsync(string? category, int page, int pageSize, CancellationToken ct = default);
    Task<PagedResult<Event>> GetAllAdminAsync(string? search, int page, int pageSize, CancellationToken ct = default);
}

public interface IGalleryRepository : IBaseRepository<GalleryAlbum>
{
    Task<GalleryAlbum?> GetWithImagesAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<GalleryAlbum>> GetPublishedAsync(string? category, CancellationToken ct = default);
}

public interface IMediaAssetRepository : IBaseRepository<MediaAsset>
{
    Task<PagedResult<MediaAsset>> SearchAsync(string? search, string? category, int page, int pageSize, CancellationToken ct = default);
}
