using AlberSchoolApi.Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AlberSchoolApi.Infrastructure.Data.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> b)
    {
        b.ToTable("Users");
        b.HasKey(u => u.Id);
        b.Property(u => u.Name).HasMaxLength(200).IsRequired();
        b.Property(u => u.Email).HasMaxLength(320).IsRequired();
        b.HasIndex(u => u.Email).IsUnique();
        b.Property(u => u.PasswordHash).HasMaxLength(512).IsRequired();
        b.Property(u => u.Phone).HasMaxLength(50);
        b.Property(u => u.Avatar).HasMaxLength(1000);
        b.Property(u => u.Role).HasConversion<string>().HasMaxLength(20);
        b.Property(u => u.Status).HasConversion<string>().HasMaxLength(20);
        b.Property(u => u.LinkedProfileType).HasConversion<string>().HasMaxLength(20);
        b.Property(u => u.PasswordResetToken).HasMaxLength(512);
        b.Property(u => u.CreatedAt).HasDefaultValueSql("NOW()");
    }
}

public class PermissionConfiguration : IEntityTypeConfiguration<Permission>
{
    public void Configure(EntityTypeBuilder<Permission> b)
    {
        b.ToTable("Permissions");
        b.HasKey(p => p.Id);
        b.Property(p => p.Code).HasMaxLength(100).IsRequired();
        b.HasIndex(p => p.Code).IsUnique();
        b.Property(p => p.Description).HasMaxLength(500);
        b.Property(p => p.PermissionGroup).HasMaxLength(100);
    }
}

public class UserPermissionConfiguration : IEntityTypeConfiguration<UserPermission>
{
    public void Configure(EntityTypeBuilder<UserPermission> b)
    {
        b.ToTable("UserPermissions");
        b.HasKey(up => new { up.UserId, up.PermissionId });
        b.Property(up => up.GrantedAt).HasDefaultValueSql("NOW()");

        b.HasOne(up => up.User).WithMany(u => u.UserPermissions).HasForeignKey(up => up.UserId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(up => up.Permission).WithMany(p => p.UserPermissions).HasForeignKey(up => up.PermissionId).OnDelete(DeleteBehavior.Cascade);
        b.HasOne(up => up.GrantedByUser).WithMany().HasForeignKey(up => up.GrantedBy).OnDelete(DeleteBehavior.NoAction);
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> b)
    {
        b.ToTable("RefreshTokens");
        b.HasKey(r => r.Id);
        b.Property(r => r.Token).HasMaxLength(1000).IsRequired();
        b.HasIndex(r => r.Token).IsUnique();
        b.Property(r => r.ReplacedByToken).HasMaxLength(1000);
        b.Property(r => r.CreatedAt).HasDefaultValueSql("NOW()");
        b.HasOne(r => r.User).WithMany(u => u.RefreshTokens).HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> b)
    {
        b.ToTable("AuditLogs");
        b.HasKey(a => a.Id);
        b.Property(a => a.Id).UseIdentityByDefaultColumn();
        b.Property(a => a.UserName).HasMaxLength(200);
        b.Property(a => a.UserRole).HasMaxLength(20);
        b.Property(a => a.Action).HasConversion<string>().HasMaxLength(20);
        b.Property(a => a.Resource).HasMaxLength(100).IsRequired();
        b.Property(a => a.ResourceId).HasMaxLength(50);
        b.Property(a => a.Details).HasMaxLength(2000);
        b.Property(a => a.IpAddress).HasMaxLength(50);
        b.Property(a => a.SessionId).HasMaxLength(200);
        b.Property(a => a.Timestamp).HasDefaultValueSql("NOW()");
        b.HasOne(a => a.User).WithMany(u => u.AuditLogs).HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.SetNull);
    }
}
