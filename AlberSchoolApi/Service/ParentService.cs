using AutoMapper;
using Contracts.Repositories;
using DTOs.User;
using Entities.Models.User;
using Service.Contracts;

namespace Service;

public class ParentService : IParentService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public ParentService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<Parent?> GetByUserIdAsync(int userId, bool trackChanges)
    {
        return await _repositoryManager.ParentRepository.GetByUserIdAsync(userId, trackChanges);
    }

    public async Task<IEnumerable<ChildDto>> GetChildrenAsync(int parentId)
    {
        var children = await _repositoryManager.ParentRepository.GetChildrenAsync(parentId);
        return _mapper.Map<IEnumerable<ChildDto>>(children);
    }
}
