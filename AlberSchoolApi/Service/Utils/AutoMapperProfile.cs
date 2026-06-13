using AutoMapper;
using DTOs.Admissions;
using DTOs.Finance;
using DTOs.Grade;
using DTOs.User;
using DTOs.Student;
using DTOs.Content;
using DTOs.Academics;
using Entities.Models.Admissions;
using Entities.Models.Finance;
using Entities.Models.Grade;
using Entities.Models.User;
using Entities.Models.Content;
using Entities.Models.Academics;

namespace Service.Utils;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<ApplicationUser, UserResponseDto>();
        CreateMap<Entities.Models.Content.BlogPost, DTOs.Blog.BlogPostDto>();
        CreateMap<UserRegistrationDto, ApplicationUser>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email));

        CreateMap<GradeCreateDto, Grade>();
        CreateMap<Grade, GradeResponseDto>()
            .ForMember(dest => dest.StudentName,
                opt => opt.MapFrom(src => src.Student != null && src.Student.User != null
                    ? src.Student.User.FullName : string.Empty))
            .ForMember(dest => dest.SubjectName,
                opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : string.Empty));

        CreateMap<StudentFee, InvoiceResponseDto>()
            .ForMember(dest => dest.StudentFeeId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.StudentName,
                opt => opt.MapFrom(src => src.Student != null && src.Student.User != null
                    ? src.Student.User.FullName : string.Empty))
            .ForMember(dest => dest.ClassName,
                opt => opt.MapFrom(src => src.Student != null && src.Student.Class != null
                    ? src.Student.Class.Name : string.Empty))
            .ForMember(dest => dest.FeeName,
                opt => opt.MapFrom(src => src.FeeStructure != null ? src.FeeStructure.Name : string.Empty))
            .ForMember(dest => dest.Status,
                opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.Balance,
                opt => opt.MapFrom(src => src.AmountDue - src.AmountPaid));

        CreateMap<Payment, PaymentDto>();

        CreateMap<Entities.Models.Content.TheAlberDifference, DTOs.Content.TheAlberDifferenceDto>();
        CreateMap<DTOs.Content.TheAlberDifferenceCreateDto, Entities.Models.Content.TheAlberDifference>();

        CreateMap<FeeStructure, FeeStructureDto>()
            .ForMember(dest => dest.ClassName,
                opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : string.Empty));
        CreateMap<FeeStructureCreateDto, FeeStructure>();
        CreateMap<FeeStructureUpdateDto, FeeStructure>();
        
        CreateMap<Class, ClassDto>();
        CreateMap<UpsertClassDto, Class>();
        
        CreateMap<SiteSetting, SettingDto>();
        CreateMap<SettingDto, SiteSetting>();
        
        CreateMap<ProgramLevel, ProgramLevelDto>();
        CreateMap<UpsertProgramLevelDto, ProgramLevel>();
        
        CreateMap<PublicFeeRow, PublicFeeRowDto>();
        CreateMap<UpsertPublicFeeRowDto, PublicFeeRow>();
        
        CreateMap<Inquiry, InquiryDto>();
        CreateMap<InquiryDto, Inquiry>();
        CreateMap<RespondDto, Inquiry>()
            .ForMember(dest => dest.Response, opt => opt.MapFrom(src => src.Response));
        
        CreateMap<Teacher, TeacherDto>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.User.FirstName ?? string.Empty))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.User.LastName ?? string.Empty))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User.Email ?? string.Empty))
            .ForMember(dest => dest.Qualification, opt => opt.MapFrom(src => src.Qualification))
            .ForMember(dest => dest.Specialization, opt => opt.MapFrom(src => src.Specialization))
            .ForMember(dest => dest.HireDate, opt => opt.MapFrom(src => src.HireDate));
        CreateMap<TeacherDto, Teacher>();
        CreateMap<TeacherCreateDto, Teacher>();
        CreateMap<TeacherUpdateDto, Teacher>();
        
        CreateMap<Subject, SubjectDto>()
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : null))
            .ForMember(dest => dest.ClassSection, opt => opt.MapFrom(src => src.Class != null ? src.Class.Section : null));
        CreateMap<SubjectDto, Subject>();
        CreateMap<UpsertSubjectDto, Subject>();
        
        CreateMap<Assignment, AssignmentDto>()
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : "Unknown"))
            .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null && src.Teacher.User != null ? src.Teacher.User.FullName : "TBA"))
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : string.Empty));
        CreateMap<AssignmentDto, Assignment>();
        CreateMap<AssignmentCreateDto, Assignment>();
        
        CreateMap<TimetableEntry, TimetableEntryDto>()
            .ForMember(dest => dest.DayOfWeek, opt => opt.MapFrom(src => src.DayOfWeek.ToString()))
            .ForMember(dest => dest.StartTime, opt => opt.MapFrom(src => src.StartTime.ToString(@"hh\:mm")))
            .ForMember(dest => dest.EndTime, opt => opt.MapFrom(src => src.EndTime.ToString(@"hh\:mm")))
            .ForMember(dest => dest.SubjectName, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Name : "Unknown"))
            .ForMember(dest => dest.SubjectCode, opt => opt.MapFrom(src => src.Subject != null ? src.Subject.Code : null))
            .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src => src.Teacher != null && src.Teacher.User != null ? src.Teacher.User.FullName : "TBA"))
            .ForMember(dest => dest.ClassId, opt => opt.MapFrom(src => src.ClassId))
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? src.Class.Name : string.Empty));
        CreateMap<TimetableEntryDto, TimetableEntry>();
        
        CreateMap<Student, ChildDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User != null ? $"{src.User.FirstName} {src.User.LastName}".Trim() : string.Empty))
            .ForMember(dest => dest.ClassName, opt => opt.MapFrom(src => src.Class != null ? $"{src.Class.Name} {src.Class.Section}".Trim() : string.Empty))
            .ForMember(dest => dest.ClassId, opt => opt.MapFrom(src => src.ClassId))
            .ForMember(dest => dest.Gender, opt => opt.MapFrom(src => src.Gender))
            .ForMember(dest => dest.DateOfBirth, opt => opt.MapFrom(src => src.DateOfBirth))
            .ForMember(dest => dest.Address, opt => opt.MapFrom(src => src.Address))
            .ForMember(dest => dest.ParentId, opt => opt.MapFrom(src => src.ParentId));
    }
}