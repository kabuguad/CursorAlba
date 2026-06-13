using DTOs.User;
using Entities.Models.User;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IParentService
    {
        Task<Parent?> GetByUserIdAsync(int userId, bool trackChanges);
        Task<IEnumerable<ChildDto>> GetChildrenAsync(int parentId);
    }
}