namespace Sabio.Services.Interfaces
{
    public interface IAmazonUploader
    {
        string Upload(int userId, string contentType, byte[] data);
    }
}