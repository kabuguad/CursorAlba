using AutoMapper;
using Contracts.Repositories;
using DTOs.Blog;
using Microsoft.EntityFrameworkCore;
using Entities.Exceptions;
using Entities.Models.Content;
using Service.Contracts;

namespace Service;

public class BlogPostService : IBlogPostService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public BlogPostService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<BlogPostDto>> GetPublishedAsync(bool trackChanges)
    {
        var posts = await _repositoryManager.BlogPostRepository.GetPublishedAsync(trackChanges);
        return _mapper.Map<IEnumerable<BlogPostDto>>(posts);
    }

    public async Task<IEnumerable<BlogPostDto>> GetAllAsync(bool trackChanges)
    {
        var posts = await _repositoryManager.BlogPostRepository
            .FindByCondition(b => !b.IsDeleted, trackChanges)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
        return _mapper.Map<IEnumerable<BlogPostDto>>(posts);
    }

    public async Task<BlogPostDto?> GetByIdAsync(int id, bool trackChanges)
    {
        var post = await _repositoryManager.BlogPostRepository
            .FindByCondition(b => b.Id == id && !b.IsDeleted, trackChanges)
            .FirstOrDefaultAsync();
        if (post == null) return null;
        return _mapper.Map<BlogPostDto>(post);
    }

    public async Task<BlogPostDto?> GetBySlugAsync(string slug, bool trackChanges)
    {
        var post = await _repositoryManager.BlogPostRepository.GetBySlugAsync(slug, trackChanges);
        if (post == null) return null;

        if (!post.IsDeleted && trackChanges == false)
            post.ViewCount++;

        return _mapper.Map<BlogPostDto>(post);
    }

    public async Task<BlogPostDto> CreateAsync(BlogPost blogPost)
    {
        _repositoryManager.BlogPostRepository.Create(blogPost);
        await _repositoryManager.SaveAsync();
        return _mapper.Map<BlogPostDto>(blogPost);
    }

    public async Task UpdateAsync(int id, BlogPost blogPost)
    {
        var existing = await _repositoryManager.BlogPostRepository
            .FindByCondition(b => b.Id == id, true)
            .FirstOrDefaultAsync();

        if (existing == null)
            throw new NotFoundException($"BlogPost with id {id} not found.");

        existing.Title = blogPost.Title;
        existing.Slug = blogPost.Slug;
        existing.Content = blogPost.Content;
        existing.Summary = blogPost.Summary;
        existing.CoverImageUrl = blogPost.CoverImageUrl;
        existing.IsPublished = blogPost.IsPublished;

        _repositoryManager.Update(existing);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var post = await _repositoryManager.BlogPostRepository
            .FindByCondition(b => b.Id == id, true)
            .FirstOrDefaultAsync();

        if (post == null)
            throw new NotFoundException($"BlogPost with id {id} not found.");

        post.IsDeleted = true;
        post.DeletedAt = DateTime.UtcNow;
        _repositoryManager.Update(post);
        await _repositoryManager.SaveAsync();
    }
}

