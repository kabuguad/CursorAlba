using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Service.Contracts;

namespace Service;

public class FileUploadService : IFileUploadService
{
    private readonly IWebHostEnvironment _env;

    public FileUploadService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> UploadAsync(IFormFile file, string subDirectory = "")
    {
        var webRoot = _env.WebRootPath;
        if (string.IsNullOrEmpty(webRoot))
            webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        var uploadsDir = string.IsNullOrEmpty(subDirectory)
            ? Path.Combine(webRoot, "uploads")
            : Path.Combine(webRoot, "uploads", subDirectory);

        Directory.CreateDirectory(uploadsDir);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return string.IsNullOrEmpty(subDirectory)
            ? $"/uploads/{fileName}"
            : $"/uploads/{subDirectory}/{fileName}";
    }

    public void Delete(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl)) return;

        var webRoot = _env.WebRootPath;
        if (string.IsNullOrEmpty(webRoot))
            webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        var filePath = Path.Combine(webRoot, fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));
        if (File.Exists(filePath))
            File.Delete(filePath);
    }
}
