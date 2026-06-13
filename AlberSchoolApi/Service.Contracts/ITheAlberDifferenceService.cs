using DTOs.Content;

namespace Service.Contracts;

public interface ITheAlberDifferenceService
{
    Task<IEnumerable<TheAlberDifferenceDto>> GetAllAsync(bool trackChanges);
    Task<TheAlberDifferenceDto> GetByIdAsync(int id, bool trackChanges);
    Task<TheAlberDifferenceDto> CreateAsync(TheAlberDifferenceCreateDto dto);
    Task UpdateAsync(int id, TheAlberDifferenceUpdateDto dto);
    Task DeleteAsync(int id);
}