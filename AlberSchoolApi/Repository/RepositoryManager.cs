using Contracts.Repositories;
using Repository;
using Entities.Models.Academics;

namespace Repository;

public class RepositoryManager : IRepositoryManager
{
    private readonly RepositoryContext _context;
    private readonly Lazy<IStudentRepository> _studentRepository;
    private readonly Lazy<ITeacherRepository> _teacherRepository;
    private readonly Lazy<IParentRepository> _parentRepository;
    private readonly Lazy<IClassRepository> _classRepository;
    private readonly Lazy<ISubjectRepository> _subjectRepository;
    private readonly Lazy<IGradeRepository> _gradeRepository;
    private readonly Lazy<IAttendanceRepository> _attendanceRepository;
    private readonly Lazy<ITimetableRepository> _timetableRepository;
    private readonly Lazy<IAssignmentRepository> _assignmentRepository;
    private readonly Lazy<IFeeRepository> _feeRepository;
    private readonly Lazy<IStudentFeeRepository> _studentFeeRepository;
    private readonly Lazy<IPaymentRepository> _paymentRepository;
    private readonly Lazy<IApplicationRepository> _applicationRepository;
    private readonly Lazy<IInquiryRepository> _inquiryRepository;
    private readonly Lazy<IBlogPostRepository> _blogPostRepository;
    private readonly Lazy<IEventRepository> _eventRepository;
    private readonly Lazy<IGalleryImageRepository> _galleryImageRepository;
    private readonly Lazy<ISiteSettingRepository> _siteSettingRepository;
    private readonly Lazy<IProgramLevelRepository> _programLevelRepository;
    private readonly Lazy<IPublicFeeRowRepository> _publicFeeRowRepository;
    private readonly Lazy<ITheAlberDifferenceRepository> _alberDifferenceRepository;
    private bool _disposed;

    public RepositoryManager(RepositoryContext context)
    {
        _context = context;
        _studentRepository = new Lazy<IStudentRepository>(() => new StudentRepository(_context));
        _teacherRepository = new Lazy<ITeacherRepository>(() => new TeacherRepository(_context));
        _parentRepository = new Lazy<IParentRepository>(() => new ParentRepository(_context));
        _classRepository = new Lazy<IClassRepository>(() => new ClassRepository(_context));
        _subjectRepository = new Lazy<ISubjectRepository>(() => new SubjectRepository(_context));
        _gradeRepository = new Lazy<IGradeRepository>(() => new GradeRepository(_context));
        _attendanceRepository = new Lazy<IAttendanceRepository>(() => new AttendanceRepository(_context));
        _timetableRepository = new Lazy<ITimetableRepository>(() => new TimetableRepository(_context));
        _assignmentRepository = new Lazy<IAssignmentRepository>(() => new AssignmentRepository(_context));
        _feeRepository = new Lazy<IFeeRepository>(() => new FeeRepository(_context));
        _studentFeeRepository = new Lazy<IStudentFeeRepository>(() => new StudentFeeRepository(_context));
        _paymentRepository = new Lazy<IPaymentRepository>(() => new PaymentRepository(_context));
        _applicationRepository = new Lazy<IApplicationRepository>(() => new ApplicationRepository(_context));
        _inquiryRepository = new Lazy<IInquiryRepository>(() => new InquiryRepository(_context));
        _blogPostRepository = new Lazy<IBlogPostRepository>(() => new BlogPostRepository(_context));
        _eventRepository = new Lazy<IEventRepository>(() => new EventRepository(_context));
        _galleryImageRepository = new Lazy<IGalleryImageRepository>(() => new GalleryImageRepository(_context));
        _siteSettingRepository = new Lazy<ISiteSettingRepository>(() => new SiteSettingRepository(_context));
        _programLevelRepository = new Lazy<IProgramLevelRepository>(() => new ProgramLevelRepository(_context));
        _publicFeeRowRepository = new Lazy<IPublicFeeRowRepository>(() => new PublicFeeRowRepository(_context));
        _alberDifferenceRepository = new Lazy<ITheAlberDifferenceRepository>(() => new TheAlberDifferenceRepository(_context));
    }

    public IStudentRepository StudentRepository => _studentRepository.Value;
    public ITeacherRepository TeacherRepository => _teacherRepository.Value;
    public IParentRepository ParentRepository => _parentRepository.Value;
    public IClassRepository ClassRepository => _classRepository.Value;
    public ISubjectRepository SubjectRepository => _subjectRepository.Value;
    public IGradeRepository GradeRepository => _gradeRepository.Value;
    public IAttendanceRepository AttendanceRepository => _attendanceRepository.Value;
    public ITimetableRepository TimetableRepository => _timetableRepository.Value;
    public IAssignmentRepository AssignmentRepository => _assignmentRepository.Value;
    public IFeeRepository FeeRepository => _feeRepository.Value;
    public IStudentFeeRepository StudentFeeRepository => _studentFeeRepository.Value;
    public IPaymentRepository PaymentRepository => _paymentRepository.Value;
    public IApplicationRepository ApplicationRepository => _applicationRepository.Value;
    public IInquiryRepository InquiryRepository => _inquiryRepository.Value;
    public IBlogPostRepository BlogPostRepository => _blogPostRepository.Value;
    public IEventRepository EventRepository => _eventRepository.Value;
    public IGalleryImageRepository GalleryImageRepository => _galleryImageRepository.Value;
    public ISiteSettingRepository SiteSettingRepository => _siteSettingRepository.Value;
    public IProgramLevelRepository ProgramLevelRepository => _programLevelRepository.Value;
    public IPublicFeeRowRepository PublicFeeRowRepository => _publicFeeRowRepository.Value;
    public ITheAlberDifferenceRepository AlberDifferenceRepository => _alberDifferenceRepository.Value;

    public async Task SaveAsync() => await _context.SaveChangesAsync();
    public void Update<T>(T entity) where T : class => _context.Set<T>().Update(entity);
    public void Delete<T>(T entity) where T : class => _context.Set<T>().Remove(entity);

    public void Dispose()
    {
        if (_disposed) return;
        _context.Dispose();
        _disposed = true;
    }
}
