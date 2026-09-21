namespace RigForge.Services.Contracts;

public interface IImageStorageService
{
    Task<string?> SaveAsync(IFormFile file);

    void Delete(string imageUrl);
}
