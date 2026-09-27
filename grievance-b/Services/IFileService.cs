using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace grievance_b.Services
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string subFolder);
        void DeleteFile(string? relativePath);
    }
}
