using Entities.Models.Content;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IGalleryImageService
    {
        Task<IEnumerable<GalleryImage>> GetPublicAsync(bool trackChanges);
        Task<IEnumerable<GalleryImage>> GetAllAsync(bool trackChanges);
        Task<GalleryImage> AddAsync(GalleryImage image);
        Task UpdateAsync(int id, GalleryImage image);
        Task DeleteAsync(int id);
    }
}
