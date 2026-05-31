using AutoMapper;
using DTOs.Grade;
using DTOs.Finance;
using DTOs.User;
using Entities.Models.Grade;
using Entities.Models.Finance;
using Entities.Models.User;

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
    }
}
