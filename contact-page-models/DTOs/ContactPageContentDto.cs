using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Contact;

// ── Update DTO (admin PUT) ────────────────────────────────────────────────────

public class UpdateContactPageContentDto
{
    [Required, MaxLength(200)]  public string HeroHeadline     { get; set; } = string.Empty;
    [Required, MaxLength(400)]  public string HeroSubheadline  { get; set; } = string.Empty;
    [MaxLength(500)]            public string HeroImageUrl      { get; set; } = string.Empty;

    [Required, MaxLength(30)]   public string PhonePrimary     { get; set; } = string.Empty;
    [MaxLength(30)]             public string PhoneSecondary    { get; set; } = string.Empty;

    [Required, MaxLength(100)]  public string EmailPrimary     { get; set; } = string.Empty;
    [MaxLength(100)]            public string EmailSecondary    { get; set; } = string.Empty;

    [Required, MaxLength(20)]   public string WhatsAppNumber   { get; set; } = string.Empty;

    [Required, MaxLength(200)]  public string AddressLine1     { get; set; } = string.Empty;
    [Required, MaxLength(200)]  public string AddressLine2     { get; set; } = string.Empty;
    [MaxLength(1000)]           public string MapEmbedUrl      { get; set; } = string.Empty;

    [Required, MaxLength(300)]  public string OfficeHours      { get; set; } = string.Empty;
    [MaxLength(300)]            public string OfficeHoursNote  { get; set; } = string.Empty;
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/contact-page-content</summary>
public class ContactPageContentResponseDto
{
    public int      Id              { get; set; }
    public string   HeroHeadline    { get; set; } = string.Empty;
    public string   HeroSubheadline { get; set; } = string.Empty;
    public string   HeroImageUrl    { get; set; } = string.Empty;
    public string   PhonePrimary    { get; set; } = string.Empty;
    public string   PhoneSecondary  { get; set; } = string.Empty;
    public string   EmailPrimary    { get; set; } = string.Empty;
    public string   EmailSecondary  { get; set; } = string.Empty;
    public string   WhatsAppNumber  { get; set; } = string.Empty;
    public string   AddressLine1    { get; set; } = string.Empty;
    public string   AddressLine2    { get; set; } = string.Empty;
    public string   MapEmbedUrl     { get; set; } = string.Empty;
    public string   OfficeHours     { get; set; } = string.Empty;
    public string   OfficeHoursNote { get; set; } = string.Empty;
    public DateTime UpdatedAt       { get; set; }
}
