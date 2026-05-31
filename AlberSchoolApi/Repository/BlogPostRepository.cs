using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Repository;
using Entities.Models.Content;

namespace Repository;

public class BlogPostRepository : RepositoryBase<BlogPost>, IBlogPostRepository
{
	public BlogPostRepository(RepositoryContext context) : base(context) { }

	public async Task<BlogPost?> GetBySlugAsync(string slug, bool trackChanges) =>
		await FindByCondition(b => b.Slug == slug && !b.IsDeleted, trackChanges)
			.FirstOrDefaultAsync();

	public async Task<IEnumerable<BlogPost>> GetPublishedAsync(bool trackChanges) =>
		await FindByCondition(b => b.IsPublished && !b.IsDeleted, trackChanges)
			.OrderByDescending(b => b.PublishedAt)
			.ToListAsync();
}
