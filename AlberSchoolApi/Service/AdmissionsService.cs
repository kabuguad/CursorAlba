using AutoMapper;
using Contracts.Repositories;
using DTOs.Admissions;
using Entities.Models.Admissions;
using Entities.Exceptions;
using Microsoft.EntityFrameworkCore;
using Service.Contracts;

namespace Service;

public class AdmissionsService : IAdmissionsService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public AdmissionsService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ApplicationDto>> GetAllApplicationsAsync(bool trackChanges)
    {
        var applications = await _repositoryManager.ApplicationRepository
            .FindAll(trackChanges)
            .Include(a => a.ApplyingForClass)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return _mapper.Map<IEnumerable<ApplicationDto>>(applications);
    }

    public async Task<ApplicationDto> GetApplicationByIdAsync(int id, bool trackChanges)
    {
        var application = await _repositoryManager.ApplicationRepository
            .FindByCondition(a => a.Id == id, trackChanges)
            .Include(a => a.ApplyingForClass)
            .FirstOrDefaultAsync();

        if (application == null)
            return null;

        return _mapper.Map<ApplicationDto>(application);
    }

    public async Task<ApplicationDto> CreateApplicationAsync(CreateApplicationDto dto)
    {
        var application = _mapper.Map<Application>(dto);
        // Ensure DateOfBirth is set via resolver (already handled by mapping)
        application.Status = "Pending";
        _repositoryManager.ApplicationRepository.Create(application);
        await _repositoryManager.SaveAsync();

        var createdApp = await _repositoryManager.ApplicationRepository
            .FindByCondition(a => a.Id == application.Id, false)
            .Include(a => a.ApplyingForClass)
            .FirstOrDefaultAsync();

        return _mapper.Map<ApplicationDto>(createdApp!);
    }

    public async Task<ApplicationDto> UpdateApplicationStatusAsync(int id, UpdateStatusDto dto)
    {
        var application = await _repositoryManager.ApplicationRepository
            .FindByCondition(a => a.Id == id, true)
            .FirstOrDefaultAsync();

        if (application == null)
            throw new NotFoundException($"Application with id {id} not found");

        application.Status = dto.Status;
        application.ReviewNotes = dto.Notes;
        application.ReviewedAt = DateTime.UtcNow;

        _repositoryManager.Update(application);
        await _repositoryManager.SaveAsync();

        return _mapper.Map<ApplicationDto>(application);
    }

    public async Task DeleteApplicationAsync(int id)
    {
        var application = await _repositoryManager.ApplicationRepository
            .FindByCondition(a => a.Id == id, true)
            .FirstOrDefaultAsync();

        if (application == null)
            throw new NotFoundException($"Application with id {id} not found");

        _repositoryManager.ApplicationRepository.Delete(application);
        await _repositoryManager.SaveAsync();
    }

    public async Task<IEnumerable<ApplicationDto>> GetPendingApplicationsAsync(bool trackChanges)
    {
        var applications = await _repositoryManager.ApplicationRepository.GetPendingAsync(trackChanges);
        return _mapper.Map<IEnumerable<ApplicationDto>>(applications);
    }

    // Existing methods (kept for backward compatibility)
    public async Task<Application> SubmitApplicationAsync(Application application)
    {
        application.Status = "Pending";
        _repositoryManager.ApplicationRepository.Create(application);
        await _repositoryManager.SaveAsync();
        return application;
    }

    public async Task<IEnumerable<Application>> GetPendingApplicationsEntityAsync(bool trackChanges)
    {
        return await _repositoryManager.ApplicationRepository.GetPendingAsync(trackChanges);
    }

    public async Task UpdateApplicationStatusAsync(int id, string status, string? notes)
    {
        var application = await _repositoryManager.ApplicationRepository
            .FindByCondition(a => a.Id == id, true)
            .FirstOrDefaultAsync();

        if (application == null)
            throw new NotFoundException($"Application with id {id} not found.");

        application.Status = status;
        application.ReviewNotes = notes;
        application.ReviewedAt = DateTime.UtcNow;
        _repositoryManager.Update(application);
        await _repositoryManager.SaveAsync();
    }

    public async Task<Inquiry> SubmitInquiryAsync(Inquiry inquiry)
    {
        inquiry.Status = "New";
        _repositoryManager.InquiryRepository.Create(inquiry);
        await _repositoryManager.SaveAsync();
        return inquiry;
    }

        public async Task<IEnumerable<Inquiry>> GetNewInquiriesAsync(bool trackChanges)
        {
            return await _repositoryManager.InquiryRepository.GetNewAsync(trackChanges);
        }

        // Inquiry management methods
        public async Task<IEnumerable<InquiryDto>> GetAllInquiriesAsync(bool trackChanges)
        {
            var inquiries = await _repositoryManager.InquiryRepository
                .FindAll(trackChanges)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
            return _mapper.Map<IEnumerable<InquiryDto>>(inquiries);
        }

        public async Task<InquiryDto> RespondToInquiryAsync(int id, RespondDto dto)
        {
            var inquiry = await _repositoryManager.InquiryRepository
                .FindByCondition(i => i.Id == id, true)
                .FirstOrDefaultAsync();

            if (inquiry == null)
                throw new NotFoundException($"Inquiry with id {id} not found");

            inquiry.Response = dto.Response;
            inquiry.Status = "Responded";
            inquiry.UpdatedAt = DateTime.UtcNow;

            _repositoryManager.Update(inquiry);
            await _repositoryManager.SaveAsync();

            return _mapper.Map<InquiryDto>(inquiry);
        }

        public async Task DeleteInquiryAsync(int id)
        {
            var inquiry = await _repositoryManager.InquiryRepository
                .FindByCondition(i => i.Id == id, true)
                .FirstOrDefaultAsync();

            if (inquiry == null)
                throw new NotFoundException($"Inquiry with id {id} not found");

            _repositoryManager.InquiryRepository.Delete(inquiry);
            await _repositoryManager.SaveAsync();
        }
}