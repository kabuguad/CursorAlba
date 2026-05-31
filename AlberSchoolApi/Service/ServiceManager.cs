using System.Collections.Concurrent;
using AutoMapper;
using Contracts;
using Contracts.Repositories;
using LoggerService;
using Service.Contracts;
using Service.Contracts.Authentication;
using DTOs.User;

namespace Service;

public class ServiceManager : IServiceManager
{
    private readonly Lazy<IStudentService> _studentService;
    private readonly Lazy<ITeacherService> _teacherService;
    private readonly Lazy<IParentService> _parentService;
    private readonly Lazy<IGradeService> _gradeService;
    private readonly Lazy<IAttendanceService> _attendanceService;
    private readonly Lazy<IFeeService> _feeService;
    private readonly Lazy<IPaymentService> _paymentService;
    private readonly Lazy<IAdmissionsService> _admissionsService;
    private readonly Lazy<IBlogPostService> _blogPostService;
    private readonly Lazy<IEventService> _eventService;
    private readonly Lazy<IGalleryImageService> _galleryImageService;
    private bool _disposed;

    public ServiceManager(
        IRepositoryManager repositoryManager,
        ILoggerManager logger,
        IMapper mapper)
    {
        _studentService = new Lazy<IStudentService>(() => new StudentService(repositoryManager, mapper));
        _teacherService = new Lazy<ITeacherService>(() => new TeacherService(repositoryManager, mapper));
        _parentService = new Lazy<IParentService>(() => new ParentService(repositoryManager, mapper));
        _gradeService = new Lazy<IGradeService>(() => new GradeService(repositoryManager, mapper));
        _attendanceService = new Lazy<IAttendanceService>(() => new AttendanceService(repositoryManager, mapper));
        _feeService = new Lazy<IFeeService>(() => new FeeService(repositoryManager, mapper));
        _paymentService = new Lazy<IPaymentService>(() => new PaymentService(repositoryManager, mapper));
        _admissionsService = new Lazy<IAdmissionsService>(() => new AdmissionsService(repositoryManager, mapper));
        _blogPostService = new Lazy<IBlogPostService>(() => new BlogPostService(repositoryManager, mapper));
        _eventService = new Lazy<IEventService>(() => new EventService(repositoryManager, mapper));
        _galleryImageService = new Lazy<IGalleryImageService>(() => new GalleryImageService(repositoryManager, mapper));
    }

    public IStudentService StudentService => _studentService.Value;
    public ITeacherService TeacherService => _teacherService.Value;
    public IParentService ParentService => _parentService.Value;
    public IGradeService GradeService => _gradeService.Value;
    public IAttendanceService AttendanceService => _attendanceService.Value;
    public IFeeService FeeService => _feeService.Value;
    public IPaymentService PaymentService => _paymentService.Value;
    public IAdmissionsService AdmissionsService => _admissionsService.Value;
    public IBlogPostService BlogPostService => _blogPostService.Value;
    public IEventService EventService => _eventService.Value;
    public IGalleryImageService GalleryImageService => _galleryImageService.Value;

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
    }
}
