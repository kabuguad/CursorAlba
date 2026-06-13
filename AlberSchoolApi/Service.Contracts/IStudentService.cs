using DTOs.Finance;
using DTOs.Student;
using DTOs.User;
using Entities.Models.User;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Service.Contracts
{
    public interface IStudentService
    {
        Task<IEnumerable<StudentDto>> GetAllStudentsAsync(bool trackChanges);
        Task<StudentDto?> GetStudentByIdAsync(int id, bool trackChanges);
        Task<StudentDto> CreateStudentAsync(int userId, StudentCreateDto dto);
        Task UpdateStudentAsync(int id, StudentUpdateDto dto);
        Task DeleteStudentAsync(int id);
        // Existing methods from original StudentService (renamed)
        Task<Student?> GetByUserIdAsync(int userId, bool trackChanges);
        Task<Student?> GetWithDetailsAsync(int id, bool trackChanges);
        Task<IEnumerable<UserResponseDto>> GetAllStudentUsersAsync(bool trackChanges);
        Task<IEnumerable<InvoiceResponseDto>> GetMyInvoicesAsync(int userId, bool trackChanges);
        // New method
        Task<IEnumerable<StudentDto>> GetStudentsByClassIdAsync(int classId, bool trackChanges);
    }
}