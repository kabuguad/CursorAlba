using DTOs.Blog;
using Entities.Models.Content;

namespace Service.Contracts;

public interface IBlogPostService
{
    Task<IEnumerable<BlogPostDto>> GetPublishedAsync(bool trackChanges);
    Task<BlogPostDto?> GetBySlugAsync(string slug, bool trackChanges);
    Task<BlogPostDto> CreateAsync(BlogPost blogPost);
    Task UpdateAsync(int id, BlogPost blogPost);
    Task DeleteAsync(int id);
}
