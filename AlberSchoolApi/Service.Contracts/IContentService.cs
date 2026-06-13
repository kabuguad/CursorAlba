using DTOs.Content;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IContentService
    {
        // Site Settings
        Task<IEnumerable<SettingDto>> GetAllSettingsAsync(bool trackChanges);
        Task UpdateSettingsAsync(IEnumerable<SettingDto> dtos);

        // Program Levels
        Task<IEnumerable<ProgramLevelDto>> GetAllProgramLevelsAsync(bool trackChanges);
        Task<ProgramLevelDto?> GetProgramLevelByIdAsync(int id, bool trackChanges);
        Task<ProgramLevelDto> CreateProgramLevelAsync(UpsertProgramLevelDto dto);
        Task UpdateProgramLevelAsync(int id, UpsertProgramLevelDto dto);
        Task DeleteProgramLevelAsync(int id);

        // Public Fee Rows
        Task<IEnumerable<PublicFeeRowDto>> GetAllPublicFeeRowsAsync(bool trackChanges);
        Task<PublicFeeRowDto?> GetPublicFeeRowByIdAsync(int id, bool trackChanges);
        Task<PublicFeeRowDto> CreatePublicFeeRowAsync(UpsertPublicFeeRowDto dto);
        Task UpdatePublicFeeRowAsync(int id, UpsertPublicFeeRowDto dto);
        Task DeletePublicFeeRowAsync(int id);
    }
}