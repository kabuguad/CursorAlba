using AutoMapper;
using Contracts.Repositories;
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

    public async Task<Application> SubmitApplicationAsync(Application application)
    {
        application.Status = "Pending";
        _repositoryManager.ApplicationRepository.Create(application);
        await _repositoryManager.SaveAsync();
        return application;
    }

    public async Task<IEnumerable<Application>> GetPendingApplicationsAsync(bool trackChanges)
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
}

