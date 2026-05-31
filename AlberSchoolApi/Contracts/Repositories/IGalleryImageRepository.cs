using Entities.Models.Content;

namespace Contracts.Repositories;

public interface IGalleryImageRepository : IRepositoryBase<GalleryImage>
{
    Task<IEnumerable<GalleryImage>> GetPublicAsync(bool trackChanges);
}
