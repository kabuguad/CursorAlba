using DTOs.Blog;
using Entities.Models.Content;

namespace Service.Contracts;

public interface IBlogPostService
{
    Task<IEnumerable<BlogPostDto>> GetPublishedAsync(bool trackChanges);
    Task<IEnumerable<BlogPostDto>> GetAllAsync(bool trackChanges);
    Task<BlogPostDto?> GetBySlugAsync(string slug, bool trackChanges);
    Task<BlogPostDto?> GetByIdAsync(int id, bool trackChanges);
    Task<BlogPostDto> CreateAsync(BlogPost blogPost);
    Task UpdateAsync(int id, BlogPost blogPost);
    Task DeleteAsync(int id);
}
