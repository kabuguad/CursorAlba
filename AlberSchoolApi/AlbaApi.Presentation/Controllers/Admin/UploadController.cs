using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Service.Contracts;

namespace AlbaApi.Presentation.Controllers.Admin;

[ApiController]
[Route("api/admin/upload")]
[EnableRateLimiting("write")]
[Authorize(Policy = "RequireAdmin")]
public class UploadController : ControllerBase
{
    private readonly IServiceManager _serviceManager;

    public UploadController(IServiceManager serviceManager)
    {
        _serviceManager = serviceManager;
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string? folder)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file provided." });

        if (file.Length > 10 * 1024 * 1024)
            return BadRequest(new { error = "File size must not exceed 10 MB." });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            return BadRequest(new { error = $"File type '{extension}' is not allowed." });

        var url = await _serviceManager.FileUploadService.UploadAsync(file, folder ?? "");
        return Ok(new { url, fileName = file.FileName, size = file.Length });
    }

    [HttpDelete]
    public IActionResult Delete([FromQuery] string fileUrl)
    {
        if (string.IsNullOrWhiteSpace(fileUrl))
            return BadRequest(new { error = "File URL is required." });

        _serviceManager.FileUploadService.Delete(fileUrl);
        return NoContent();
    }

    private static readonly HashSet<string> AllowedExtensions =
        [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf", ".doc", ".docx"];
}
