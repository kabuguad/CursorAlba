using System.ComponentModel.DataAnnotations;

namespace Entities.Models.Home;

/// <summary>
/// Singleton row that holds all editable text and stat fields for the public / (home) page.
/// Only one row ever exists (Id = 1). Use UPSERT / EnsureSeeded on startup.
/// </summary>
public class HomePageContent
{
    [Key]
    public int Id { get; set; } = 1;

    // ── Hero — slideshow images ────────────────────────────────────────────────

    /// <summary>First background slideshow image URL.</summary>
    [MaxLength(500)]
    public string HeroImage1Url { get; set; } = string.Empty;

    /// <summary>Second background slideshow image URL.</summary>
    [MaxLength(500)]
    public string HeroImage2Url { get; set; } = string.Empty;

    /// <summary>Third background slideshow image URL.</summary>
    [MaxLength(500)]
    public string HeroImage3Url { get; set; } = string.Empty;

    /// <summary>Fourth background slideshow image URL.</summary>
    [MaxLength(500)]
    public string HeroImage4Url { get; set; } = string.Empty;

    // ── Hero — headline & body ─────────────────────────────────────────────────

    /// <summary>
    /// First (white) line of the main headline.
    /// e.g. "Where Excellence"
    /// </summary>
    [Required, MaxLength(200)]
    public string HeroTagline { get; set; } = string.Empty;

    /// <summary>
    /// Second (gold outlined) line of the main headline.
    /// e.g. "Meets Tomorrow"
    /// </summary>
    [Required, MaxLength(200)]
    public string HeroTaglineGold { get; set; } = string.Empty;

    /// <summary>
    /// Small badge text shown above the headline.
    /// e.g. "Kutus · Kirinyaga County · Est. 2005"
    /// </summary>
    [Required, MaxLength(200)]
    public string HeroLocationBadge { get; set; } = string.Empty;

    /// <summary>Paragraph shown below the headline.</summary>
    [Required, MaxLength(600)]
    public string HeroSubtitle { get; set; } = string.Empty;

    // ── Hero — CTA buttons ─────────────────────────────────────────────────────

    /// <summary>Label for the primary (gold) CTA button. e.g. "Apply Now"</summary>
    [Required, MaxLength(100)]
    public string HeroPrimaryCtaLabel { get; set; } = string.Empty;

    /// <summary>Relative URL for the primary CTA. e.g. "/admissions"</summary>
    [Required, MaxLength(300)]
    public string HeroPrimaryCtaUrl { get; set; } = string.Empty;

    /// <summary>Label for the secondary (outline) CTA button. e.g. "Explore Programs"</summary>
    [Required, MaxLength(100)]
    public string HeroSecondaryCtaLabel { get; set; } = string.Empty;

    /// <summary>Relative URL for the secondary CTA. e.g. "/academics"</summary>
    [Required, MaxLength(300)]
    public string HeroSecondaryCtaUrl { get; set; } = string.Empty;

    // ── Hero — stats bar ───────────────────────────────────────────────────────

    /// <summary>Number shown for the "Students Enrolled" stat counter.</summary>
    public int StatStudentsEnrolled { get; set; } = 2000;

    /// <summary>Number shown for the "Expert Educators" stat counter.</summary>
    public int StatEducators { get; set; } = 120;

    /// <summary>Year shown for the "Est." stat counter.</summary>
    public int StatEstYear { get; set; } = 2005;

    /// <summary>Number shown for the "Co-Curricular Activities" stat counter.</summary>
    public int StatActivities { get; set; } = 30;

    // ── Foundation section ─────────────────────────────────────────────────────

    /// <summary>Section badge label. e.g. "Our Foundation"</summary>
    [Required, MaxLength(100)]
    public string FoundationSectionLabel { get; set; } = string.Empty;

    /// <summary>Section heading. e.g. "What We Stand For"</summary>
    [Required, MaxLength(200)]
    public string FoundationHeading { get; set; } = string.Empty;

    // Mission card

    /// <summary>Coloured micro-label above the mission card title. e.g. "Our Mission"</summary>
    [Required, MaxLength(100)]
    public string MissionLabel { get; set; } = string.Empty;

    /// <summary>Mission card title. e.g. "To Nurture Genius"</summary>
    [Required, MaxLength(200)]
    public string MissionTitle { get; set; } = string.Empty;

    /// <summary>Mission card body paragraph.</summary>
    [Required, MaxLength(1000)]
    public string MissionBody { get; set; } = string.Empty;

    // Motto card (centre highlight)

    /// <summary>Coloured micro-label above the motto card title. e.g. "Our Motto"</summary>
    [Required, MaxLength(100)]
    public string MottoLabel { get; set; } = string.Empty;

    /// <summary>Motto card title. e.g. "Excellence in All"</summary>
    [Required, MaxLength(200)]
    public string MottoTitle { get; set; } = string.Empty;

    /// <summary>
    /// Italic gold tagline displayed in the motto card.
    /// e.g. "Unlocking Every Child's Genius"
    /// </summary>
    [Required, MaxLength(300)]
    public string MottoTagline { get; set; } = string.Empty;

    /// <summary>Short descriptor shown beneath the tagline.</summary>
    [Required, MaxLength(500)]
    public string MottoBody { get; set; } = string.Empty;

    // Vision card

    /// <summary>Coloured micro-label above the vision card title. e.g. "Our Vision"</summary>
    [Required, MaxLength(100)]
    public string VisionLabel { get; set; } = string.Empty;

    /// <summary>Vision card title. e.g. "Leaders for Tomorrow"</summary>
    [Required, MaxLength(200)]
    public string VisionTitle { get; set; } = string.Empty;

    /// <summary>Vision card body paragraph.</summary>
    [Required, MaxLength(1000)]
    public string VisionBody { get; set; } = string.Empty;

    // ── Final CTA section ──────────────────────────────────────────────────────

    /// <summary>
    /// Pill badge text above the CTA heading.
    /// e.g. "Applications Open · 2026–2027"
    /// </summary>
    [Required, MaxLength(200)]
    public string CtaBadgeText { get; set; } = string.Empty;

    /// <summary>Large CTA section heading. e.g. "Ready to Join Alber School?"</summary>
    [Required, MaxLength(300)]
    public string CtaHeading { get; set; } = string.Empty;

    /// <summary>Supporting paragraph shown below the CTA heading.</summary>
    [Required, MaxLength(500)]
    public string CtaSubtext { get; set; } = string.Empty;

    /// <summary>Label for the primary (gold) CTA button. e.g. "Apply Now"</summary>
    [Required, MaxLength(100)]
    public string CtaPrimaryLabel { get; set; } = string.Empty;

    /// <summary>Relative URL for the primary CTA. e.g. "/admissions"</summary>
    [Required, MaxLength(300)]
    public string CtaPrimaryUrl { get; set; } = string.Empty;

    /// <summary>Label for the secondary (outline) CTA button. e.g. "Contact Us"</summary>
    [Required, MaxLength(100)]
    public string CtaSecondaryLabel { get; set; } = string.Empty;

    /// <summary>Relative URL for the secondary CTA. e.g. "/contact"</summary>
    [Required, MaxLength(300)]
    public string CtaSecondaryUrl { get; set; } = string.Empty;

    // ── Audit ──────────────────────────────────────────────────────────────────

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
