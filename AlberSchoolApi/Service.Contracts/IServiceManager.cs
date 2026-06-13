using DTOs.Grade;
using DTOs.Academics;
using DTOs.Content;
using DTOs.User;
using Entities.Models.User;

namespace Service.Contracts;

public interface IServiceManager : IDisposable
{
    IStudentService StudentService { get; }
    ITeacherService TeacherService { get; }
    IParentService ParentService { get; }
    IGradeService GradeService { get; }
    IAttendanceService AttendanceService { get; }
    IFeeService FeeService { get; }
    IPaymentService PaymentService { get; }
    IAdmissionsService AdmissionsService { get; }
    IBlogPostService BlogPostService { get; }
    IEventService EventService { get; }
    IGalleryImageService GalleryImageService { get; }
    ITheAlberDifferenceService AlberDifferenceService { get; }
    IClassService ClassService { get; }
    ISubjectService SubjectService { get; }
    IAssignmentService AssignmentService { get; }
    ITimetableEntryService TimetableEntryService { get; }
    IAuthenticationService AuthenticationService { get; }
    IContentService ContentService { get; }
    IFileUploadService FileUploadService { get; }
}
