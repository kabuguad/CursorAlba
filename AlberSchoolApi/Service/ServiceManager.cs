using System.Collections.Concurrent;
using AutoMapper;
using Contracts;
using Contracts.Repositories;
using LoggerService;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Service;
using Service.Contracts;
using Service.Contracts.Authentication;

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
    private readonly Lazy<ITheAlberDifferenceService> _alberDifferenceService;
    private readonly Lazy<IClassService> _classService;
    private readonly Lazy<ISubjectService> _subjectService;
    private readonly Lazy<IAssignmentService> _assignmentService;
    private readonly Lazy<ITimetableEntryService> _timetableEntryService;
    private readonly Lazy<IAuthenticationService> _authenticationService;
    private readonly Lazy<IContentService> _contentService;
    private readonly Lazy<IFileUploadService> _fileUploadService;
    private bool _disposed;

    public ServiceManager(
        IRepositoryManager repositoryManager,
        ILoggerManager logger,
        IMapper mapper,
        IWebHostEnvironment env,
        UserManager<Entities.Models.User.ApplicationUser> userManager,
        RoleManager<IdentityRole<int>> roleManager,
        ITokenService tokenService,
        SignInManager<Entities.Models.User.ApplicationUser> signInManager)
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
        _alberDifferenceService = new Lazy<ITheAlberDifferenceService>(() => new TheAlberDifferenceService(repositoryManager, mapper));
        _classService = new Lazy<IClassService>(() => new ClassService(repositoryManager, mapper));
        _subjectService = new Lazy<ISubjectService>(() => new SubjectService(repositoryManager, mapper));
        _assignmentService = new Lazy<IAssignmentService>(() => new AssignmentService(repositoryManager, mapper));
        _timetableEntryService = new Lazy<ITimetableEntryService>(() => new TimetableEntryService(repositoryManager, mapper));
        _authenticationService = new Lazy<IAuthenticationService>(() => new AuthenticationService(
            repositoryManager, logger, mapper, userManager, roleManager, tokenService, signInManager));
        _contentService = new Lazy<IContentService>(() => new ContentService(repositoryManager, mapper));
        _fileUploadService = new Lazy<IFileUploadService>(() => new FileUploadService(env));
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
    public ITheAlberDifferenceService AlberDifferenceService => _alberDifferenceService.Value;
    public IClassService ClassService => _classService.Value;
    public ISubjectService SubjectService => _subjectService.Value;
    public IAssignmentService AssignmentService => _assignmentService.Value;
    public ITimetableEntryService TimetableEntryService => _timetableEntryService.Value;
    public IAuthenticationService AuthenticationService => _authenticationService.Value;
    public IContentService ContentService => _contentService.Value;
    public IFileUploadService FileUploadService => _fileUploadService.Value;

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
    }
}
