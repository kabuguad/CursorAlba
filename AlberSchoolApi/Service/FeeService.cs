using AutoMapper;
using Contracts.Repositories;
using DTOs.Attendance;
using DTOs.Finance;
using Entities.Exceptions;
using Entities.Models.Attendance;
using Entities.Models.Finance;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class FeeService : IFeeService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public FeeService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<FeeStructure>> GetFeesForClassAsync(int classId, bool trackChanges)
    {
        return await _repositoryManager.FeeRepository.GetByClassAsync(classId, trackChanges);
    }

    public async Task<IEnumerable<InvoiceResponseDto>> GetInvoicesForStudentAsync(int studentId, bool trackChanges)
    {
        var studentFees = await _repositoryManager.StudentFeeRepository.GetByStudentAsync(studentId, trackChanges);
        return _mapper.Map<IEnumerable<InvoiceResponseDto>>(studentFees);
    }

    public async Task<StudentFee> CreateFeeAsync(FeeStructure feeStructure)
    {
        _repositoryManager.FeeRepository.Create(feeStructure);
        await _repositoryManager.SaveAsync();
        var created = await _repositoryManager.StudentFeeRepository
            .FindByCondition(sf => sf.Id == feeStructure.Id, true)
            .Include(sf => sf.FeeStructure)
            .FirstOrDefaultAsync();
        return created ?? throw new NotFoundException("StudentFee not found.");
    }
}
