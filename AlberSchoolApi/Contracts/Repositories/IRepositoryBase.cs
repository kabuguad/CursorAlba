using System.Linq;
using System.Linq.Expressions;
using Contracts.Repositories;
using Entities.Models.Finance;

namespace Contracts.Repositories;

public interface IRepositoryBase<T> where T : class
{
    IQueryable<T> FindAll(bool trackChanges);
    IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges);
    void Create(T entity);
    void Update(T entity);
    void Delete(T entity);
}

public interface IRepositoryManager : IDisposable
{
    Task SaveAsync();
    void Update<T>(T entity) where T : class;
    void Delete<T>(T entity) where T : class;
    IStudentRepository StudentRepository { get; }
    ITeacherRepository TeacherRepository { get; }
    IParentRepository ParentRepository { get; }
    IClassRepository ClassRepository { get; }
    ISubjectRepository SubjectRepository { get; }
    IGradeRepository GradeRepository { get; }
    IAttendanceRepository AttendanceRepository { get; }
    ITimetableRepository TimetableRepository { get; }
    IAssignmentRepository AssignmentRepository { get; }
    IFeeRepository FeeRepository { get; }
    IStudentFeeRepository StudentFeeRepository { get; }
    IPaymentRepository PaymentRepository { get; }
    IApplicationRepository ApplicationRepository { get; }
    IInquiryRepository InquiryRepository { get; }
    IBlogPostRepository BlogPostRepository { get; }
    IEventRepository EventRepository { get; }
    IGalleryImageRepository GalleryImageRepository { get; }
}
