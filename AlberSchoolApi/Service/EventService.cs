using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Contracts.Repositories;
using Entities.Exceptions;
using Entities.Models.Content;
using Service.Contracts;

namespace Service;

public class EventService : IEventService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public EventService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<Event>> GetUpcomingAsync(bool trackChanges)
    {
        return await _repositoryManager.EventRepository.GetUpcomingAsync(trackChanges);
    }

    public async Task<IEnumerable<Event>> GetAllAsync(bool trackChanges)
    {
        return await _repositoryManager.EventRepository.FindAll(trackChanges)
            .OrderByDescending(e => e.StartDate)
            .ToListAsync();
    }

    public async Task<Event> CreateAsync(Event ev)
    {
        _repositoryManager.EventRepository.Create(ev);
        await _repositoryManager.SaveAsync();
        return ev;
    }

    public async Task UpdateAsync(int id, Event ev)
    {
        var existing = await _repositoryManager.EventRepository
            .FindByCondition(e => e.Id == id, true)
            .FirstOrDefaultAsync();

        if (existing == null)
            throw new NotFoundException($"Event with id {id} not found.");

        existing.Title = ev.Title;
        existing.Description = ev.Description;
        existing.StartDate = ev.StartDate;
        existing.EndDate = ev.EndDate;
        existing.Location = ev.Location;
        existing.ImageUrl = ev.ImageUrl;
        existing.IsPublished = ev.IsPublished;
        existing.EventType = ev.EventType;

        _repositoryManager.Update(existing);
        await _repositoryManager.SaveAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var ev = await _repositoryManager.EventRepository
            .FindByCondition(e => e.Id == id, true)
            .FirstOrDefaultAsync();

        if (ev == null)
            throw new NotFoundException($"Event with id {id} not found.");

        _repositoryManager.EventRepository.Delete(ev);
        await _repositoryManager.SaveAsync();
    }
}


