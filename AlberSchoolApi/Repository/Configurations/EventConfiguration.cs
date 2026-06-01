using Entities.Models.Content;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Repository.Configurations;

public class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.HasData(
            new Event { Id = 1, Title = "Opening Ceremony 2026", StartDate = new DateTime(2026, 1, 12), EndDate = new DateTime(2026, 1, 12), Location = "Main Auditorium", Description = "Welcome back celebration with performances.", IsPublished = true, EventType = "Ceremony" },
            new Event { Id = 2, Title = "CBC Innovation Fair", StartDate = new DateTime(2026, 2, 20), EndDate = new DateTime(2026, 2, 20), Location = "Science Block", Description = "Student projects and STEM showcases.", IsPublished = true, EventType = "Academic" },
            new Event { Id = 3, Title = "Inter-House Athletics", StartDate = new DateTime(2026, 3, 15), EndDate = new DateTime(2026, 3, 15), Location = "Sports Complex", Description = "Annual track and field championships.", IsPublished = true, EventType = "Sports" },
            new Event { Id = 4, Title = "Music Gala Night", StartDate = new DateTime(2026, 4, 8), EndDate = new DateTime(2026, 4, 8), Location = "Arts Academy", Description = "Orchestra, choir, and solo performances.", IsPublished = true, EventType = "Arts" },
            new Event { Id = 5, Title = "Parent-Teacher Conference", StartDate = new DateTime(2026, 4, 22), EndDate = new DateTime(2026, 4, 22), Location = "Various Classrooms", Description = "Term 1 progress reviews.", IsPublished = true, EventType = "Meeting" },
            new Event { Id = 6, Title = "Drama & Dance Showcase", StartDate = new DateTime(2026, 5, 10), EndDate = new DateTime(2026, 5, 10), Location = "Theatre Studio", Description = "End-of-term performing arts premiere.", IsPublished = true, EventType = "Arts" },
            new Event { Id = 7, Title = "IGCSE Mock Exams", StartDate = new DateTime(2026, 5, 18), EndDate = new DateTime(2026, 5, 22), Location = "Exam Hall", Description = "Cambridge pathway assessment week.", IsPublished = true, EventType = "Academic" },
            new Event { Id = 8, Title = "Environmental Day", StartDate = new DateTime(2026, 6, 5), EndDate = new DateTime(2026, 6, 5), Location = "School Grounds", Description = "Tree planting and sustainability workshops.", IsPublished = true, EventType = "Community" },
            new Event { Id = 9, Title = "Swimming Championships", StartDate = new DateTime(2026, 6, 20), EndDate = new DateTime(2026, 6, 20), Location = "Aquatic Centre", Description = "Inter-school swimming competition.", IsPublished = true, EventType = "Sports" },
            new Event { Id = 10, Title = "Career Day", StartDate = new DateTime(2026, 7, 3), EndDate = new DateTime(2026, 7, 3), Location = "Conference Centre", Description = "Industry leaders mentor senior students.", IsPublished = true, EventType = "Academic" },
            new Event { Id = 11, Title = "Cultural Heritage Week", StartDate = new DateTime(2026, 7, 15), EndDate = new DateTime(2026, 7, 19), Location = "Campus Wide", Description = "Celebrating Kenyan heritage and diversity.", IsPublished = true, EventType = "Community" },
            new Event { Id = 12, Title = "Science Olympiad", StartDate = new DateTime(2026, 8, 1), EndDate = new DateTime(2026, 8, 1), Location = "Laboratories", Description = "Regional science competition qualifiers.", IsPublished = true, EventType = "Academic" },
            new Event { Id = 13, Title = "Founders Day", StartDate = new DateTime(2026, 8, 20), EndDate = new DateTime(2026, 8, 20), Location = "Governor's Adjacent Plaza", Description = "Commemorating Alber School legacy.", IsPublished = true, EventType = "Ceremony" },
            new Event { Id = 14, Title = "Graduation Ceremony", StartDate = new DateTime(2026, 11, 28), EndDate = new DateTime(2026, 11, 28), Location = "Grand Lawn", Description = "Class of 2026 commencement.", IsPublished = true, EventType = "Ceremony" },
            new Event { Id = 15, Title = "Christmas Concert", StartDate = new DateTime(2026, 12, 12), EndDate = new DateTime(2026, 12, 12), Location = "Main Auditorium", Description = "Festive performances and charity drive.", IsPublished = true, EventType = "Arts" }
        );
    }
}