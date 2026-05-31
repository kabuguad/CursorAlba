using Microsoft.AspNetCore.Http;

namespace Service.Contracts;

public interface IFileUploadService
{
    Task<string> UploadAsync(IFormFile file, string subDirectory = "");
    void Delete(string fileUrl);
}
