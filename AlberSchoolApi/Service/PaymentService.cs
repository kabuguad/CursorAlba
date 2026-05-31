using AutoMapper;
using Contracts.Repositories;
using DTOs.Finance;
using Microsoft.EntityFrameworkCore;
using Entities.Exceptions;
using Entities.Models.Finance;
using Service.Contracts;

namespace Service;

public class PaymentService : IPaymentService
{
    private readonly IRepositoryManager _repositoryManager;
    private readonly IMapper _mapper;

    public PaymentService(IRepositoryManager repositoryManager, IMapper mapper)
    {
        _repositoryManager = repositoryManager;
        _mapper = mapper;
    }

    public async Task<IEnumerable<InvoiceResponseDto>> GetInvoicesForStudentAsync(int studentId, bool trackChanges)
    {
        var studentFees = await _repositoryManager.StudentFeeRepository.GetByStudentAsync(studentId, trackChanges);
        return _mapper.Map<IEnumerable<InvoiceResponseDto>>(studentFees);
    }

    public async Task<Payment> MakePaymentAsync(PaymentCreateDto dto, int recordedById)
    {
        var studentFee = await _repositoryManager.StudentFeeRepository
            .FindByCondition(sf => sf.Id == dto.StudentFeeId, true)
            .FirstOrDefaultAsync();

        if (studentFee == null)
            throw new NotFoundException($"StudentFee with id {dto.StudentFeeId} not found.");

        var payment = _mapper.Map<Payment>(dto);
        payment.PaidAt = DateTime.UtcNow;

        studentFee.AmountPaid += dto.Amount;
        studentFee.Status = studentFee.AmountPaid >= studentFee.AmountDue
            ? PaymentStatus.Paid
            : PaymentStatus.Partial;

        if (studentFee.AmountPaid > studentFee.AmountDue)
            throw new BadRequestException("Payment exceeds outstanding balance.");

        _repositoryManager.PaymentRepository.Create(payment);
        _repositoryManager.Update(studentFee);
        await _repositoryManager.SaveAsync();

        return payment;
    }
}

