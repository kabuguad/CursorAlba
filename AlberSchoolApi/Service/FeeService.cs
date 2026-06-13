using AutoMapper;
using Contracts.Repositories;
using DTOs.Finance;
using Entities.Exceptions;
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

    public async Task<IEnumerable<FeeStructureDto>> GetAllFeeStructuresAsync(bool trackChanges)
    {
        var fees = await _repositoryManager.FeeRepository
            .FindAll(trackChanges)
            .Include(f => f.Class)
            .ToListAsync();
        return _mapper.Map<IEnumerable<FeeStructureDto>>(fees);
    }

    public async Task<FeeStructureDto> GetFeeStructureByIdAsync(int id, bool trackChanges)
    {
        var fee = await _repositoryManager.FeeRepository
            .FindByCondition(f => f.Id == id, trackChanges)
            .Include(f => f.Class)
            .FirstOrDefaultAsync();
        if (fee == null)
            throw new NotFoundException($"FeeStructure with id {id} not found.");
        return _mapper.Map<FeeStructureDto>(fee);
    }

    public async Task<FeeStructureDto> CreateFeeStructureAsync(FeeStructureCreateDto dto)
    {
        var fee = _mapper.Map<Entities.Models.Finance.FeeStructure>(dto);
        _repositoryManager.FeeRepository.Create(fee);
        await _repositoryManager.SaveAsync();
        return _mapper.Map<FeeStructureDto>(fee);
    }

    public async Task UpdateFeeStructureAsync(int id, FeeStructureUpdateDto dto)
    {
        var fee = await _repositoryManager.FeeRepository
            .FindByCondition(f => f.Id == id, true)
            .FirstOrDefaultAsync();
        if (fee == null)
            throw new NotFoundException($"FeeStructure with id {id} not found.");

        _mapper.Map(dto, fee);
        fee.UpdatedAt = DateTime.UtcNow;
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteFeeStructureAsync(int id)
    {
        var fee = await _repositoryManager.FeeRepository
            .FindByCondition(f => f.Id == id, true)
            .FirstOrDefaultAsync();
        if (fee == null)
            throw new NotFoundException($"FeeStructure with id {id} not found.");

        _repositoryManager.FeeRepository.Delete(fee);
        await _repositoryManager.SaveAsync();
    }

    public async Task<IEnumerable<InvoiceResponseDto>> GetInvoicesForStudentAsync(int studentId, bool trackChanges)
    {
        var studentFees = await _repositoryManager.StudentFeeRepository.GetByStudentAsync(studentId, trackChanges);
        return _mapper.Map<IEnumerable<InvoiceResponseDto>>(studentFees);
    }
}