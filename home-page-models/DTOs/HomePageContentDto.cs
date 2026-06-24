using System.ComponentModel.DataAnnotations;

namespace AlbaApi.Presentation.DTOs.Home;

// ── Request DTO ───────────────────────────────────────────────────────────────
// No Create DTO — the row is seeded once. Only updates are allowed.

/// <summary>
/// Payload for PUT /api/home/page-content
/// All fields are required so the admin always submits the full document.
/// </summary>
public class UpdateHomePageContentDto
{
    // ── Hero — slideshow images ────────────────────────────────────────────────

    [MaxLength(500, ErrorMessage = "Hero image URL must be 500 characters or fewer.")]
    public string HeroImage1Url { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Hero image URL must be 500 characters or fewer.")]
    public string HeroImage2Url { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Hero image URL must be 500 characters or fewer.")]
    public string HeroImage3Url { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Hero image URL must be 500 characters or fewer.")]
    public string HeroImage4Url { get; set; } = string.Empty;

    // ── Hero — headline & body ─────────────────────────────────────────────────

    [Required(ErrorMessage = "Hero tagline is required.")]
    [MaxLength(200, ErrorMessage = "Hero tagline must be 200 characters or fewer.")]
    public string HeroTagline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hero gold tagline is required.")]
    [MaxLength(200, ErrorMessage = "Hero gold tagline must be 200 characters or fewer.")]
    public string HeroTaglineGold { get; set; } = string.Empty;

    [Required(ErrorMessage = "Location badge is required.")]
    [MaxLength(200, ErrorMessage = "Location badge must be 200 characters or fewer.")]
    public string HeroLocationBadge { get; set; } = string.Empty;

    [Required(ErrorMessage = "Hero subtitle is required.")]
    [MaxLength(600, ErrorMessage = "Hero subtitle must be 600 characters or fewer.")]
    public string HeroSubtitle { get; set; } = string.Empty;

    // ── Hero — CTA buttons ─────────────────────────────────────────────────────

    [Required(ErrorMessage = "Primary CTA label is required.")]
    [MaxLength(100, ErrorMessage = "Primary CTA label must be 100 characters or fewer.")]
    public string HeroPrimaryCtaLabel { get; set; } = string.Empty;

    [Required(ErrorMessage = "Primary CTA URL is required.")]
    [MaxLength(300, ErrorMessage = "Primary CTA URL must be 300 characters or fewer.")]
    public string HeroPrimaryCtaUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "Secondary CTA label is required.")]
    [MaxLength(100, ErrorMessage = "Secondary CTA label must be 100 characters or fewer.")]
    public string HeroSecondaryCtaLabel { get; set; } = string.Empty;

    [Required(ErrorMessage = "Secondary CTA URL is required.")]
    [MaxLength(300, ErrorMessage = "Secondary CTA URL must be 300 characters or fewer.")]
    public string HeroSecondaryCtaUrl { get; set; } = string.Empty;

    // ── Hero — stats bar ───────────────────────────────────────────────────────

    [Range(0, 100000, ErrorMessage = "Students enrolled must be between 0 and 100 000.")]
    public int StatStudentsEnrolled { get; set; }

    [Range(0, 10000, ErrorMessage = "Educators count must be between 0 and 10 000.")]
    public int StatEducators { get; set; }

    [Range(1900, 2100, ErrorMessage = "Establishment year must be between 1900 and 2100.")]
    public int StatEstYear { get; set; }

    [Range(0, 1000, ErrorMessage = "Activities count must be between 0 and 1 000.")]
    public int StatActivities { get; set; }

    // ── Foundation section ─────────────────────────────────────────────────────

    [Required(ErrorMessage = "Foundation section label is required.")]
    [MaxLength(100, ErrorMessage = "Foundation section label must be 100 characters or fewer.")]
    public string FoundationSectionLabel { get; set; } = string.Empty;

    [Required(ErrorMessage = "Foundation heading is required.")]
    [MaxLength(200, ErrorMessage = "Foundation heading must be 200 characters or fewer.")]
    public string FoundationHeading { get; set; } = string.Empty;

    // Mission

    [Required(ErrorMessage = "Mission label is required.")]
    [MaxLength(100, ErrorMessage = "Mission label must be 100 characters or fewer.")]
    public string MissionLabel { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mission title is required.")]
    [MaxLength(200, ErrorMessage = "Mission title must be 200 characters or fewer.")]
    public string MissionTitle { get; set; } = string.Empty;

    [Required(ErrorMessage = "Mission body is required.")]
    [MaxLength(1000, ErrorMessage = "Mission body must be 1 000 characters or fewer.")]
    public string MissionBody { get; set; } = string.Empty;

    // Motto

    [Required(ErrorMessage = "Motto label is required.")]
    [MaxLength(100, ErrorMessage = "Motto label must be 100 characters or fewer.")]
    public string MottoLabel { get; set; } = string.Empty;

    [Required(ErrorMessage = "Motto title is required.")]
    [MaxLength(200, ErrorMessage = "Motto title must be 200 characters or fewer.")]
    public string MottoTitle { get; set; } = string.Empty;

    [Required(ErrorMessage = "Motto tagline is required.")]
    [MaxLength(300, ErrorMessage = "Motto tagline must be 300 characters or fewer.")]
    public string MottoTagline { get; set; } = string.Empty;

    [Required(ErrorMessage = "Motto body is required.")]
    [MaxLength(500, ErrorMessage = "Motto body must be 500 characters or fewer.")]
    public string MottoBody { get; set; } = string.Empty;

    // Vision

    [Required(ErrorMessage = "Vision label is required.")]
    [MaxLength(100, ErrorMessage = "Vision label must be 100 characters or fewer.")]
    public string VisionLabel { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vision title is required.")]
    [MaxLength(200, ErrorMessage = "Vision title must be 200 characters or fewer.")]
    public string VisionTitle { get; set; } = string.Empty;

    [Required(ErrorMessage = "Vision body is required.")]
    [MaxLength(1000, ErrorMessage = "Vision body must be 1 000 characters or fewer.")]
    public string VisionBody { get; set; } = string.Empty;

    // ── Final CTA section ──────────────────────────────────────────────────────

    [Required(ErrorMessage = "CTA badge text is required.")]
    [MaxLength(200, ErrorMessage = "CTA badge text must be 200 characters or fewer.")]
    public string CtaBadgeText { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA heading is required.")]
    [MaxLength(300, ErrorMessage = "CTA heading must be 300 characters or fewer.")]
    public string CtaHeading { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA subtext is required.")]
    [MaxLength(500, ErrorMessage = "CTA subtext must be 500 characters or fewer.")]
    public string CtaSubtext { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA primary label is required.")]
    [MaxLength(100, ErrorMessage = "CTA primary label must be 100 characters or fewer.")]
    public string CtaPrimaryLabel { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA primary URL is required.")]
    [MaxLength(300, ErrorMessage = "CTA primary URL must be 300 characters or fewer.")]
    public string CtaPrimaryUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA secondary label is required.")]
    [MaxLength(100, ErrorMessage = "CTA secondary label must be 100 characters or fewer.")]
    public string CtaSecondaryLabel { get; set; } = string.Empty;

    [Required(ErrorMessage = "CTA secondary URL is required.")]
    [MaxLength(300, ErrorMessage = "CTA secondary URL must be 300 characters or fewer.")]
    public string CtaSecondaryUrl { get; set; } = string.Empty;
}

// ── Response DTO ──────────────────────────────────────────────────────────────

/// <summary>Shape returned by GET /api/home/page-content</summary>
public class HomePageContentResponseDto
{
    public int Id { get; set; }

    // Hero — images
    public string HeroImage1Url       { get; set; } = string.Empty;
    public string HeroImage2Url       { get; set; } = string.Empty;
    public string HeroImage3Url       { get; set; } = string.Empty;
    public string HeroImage4Url       { get; set; } = string.Empty;

    // Hero — text
    public string HeroTagline         { get; set; } = string.Empty;
    public string HeroTaglineGold     { get; set; } = string.Empty;
    public string HeroLocationBadge   { get; set; } = string.Empty;
    public string HeroSubtitle        { get; set; } = string.Empty;

    // Hero — CTAs
    public string HeroPrimaryCtaLabel   { get; set; } = string.Empty;
    public string HeroPrimaryCtaUrl     { get; set; } = string.Empty;
    public string HeroSecondaryCtaLabel { get; set; } = string.Empty;
    public string HeroSecondaryCtaUrl   { get; set; } = string.Empty;

    // Hero — stats
    public int StatStudentsEnrolled { get; set; }
    public int StatEducators        { get; set; }
    public int StatEstYear          { get; set; }
    public int StatActivities       { get; set; }

    // Foundation
    public string FoundationSectionLabel { get; set; } = string.Empty;
    public string FoundationHeading      { get; set; } = string.Empty;

    public string MissionLabel { get; set; } = string.Empty;
    public string MissionTitle { get; set; } = string.Empty;
    public string MissionBody  { get; set; } = string.Empty;

    public string MottoLabel   { get; set; } = string.Empty;
    public string MottoTitle   { get; set; } = string.Empty;
    public string MottoTagline { get; set; } = string.Empty;
    public string MottoBody    { get; set; } = string.Empty;

    public string VisionLabel { get; set; } = string.Empty;
    public string VisionTitle { get; set; } = string.Empty;
    public string VisionBody  { get; set; } = string.Empty;

    // Final CTA
    public string CtaBadgeText      { get; set; } = string.Empty;
    public string CtaHeading        { get; set; } = string.Empty;
    public string CtaSubtext        { get; set; } = string.Empty;
    public string CtaPrimaryLabel   { get; set; } = string.Empty;
    public string CtaPrimaryUrl     { get; set; } = string.Empty;
    public string CtaSecondaryLabel { get; set; } = string.Empty;
    public string CtaSecondaryUrl   { get; set; } = string.Empty;

    public DateTime UpdatedAt { get; set; }
}
