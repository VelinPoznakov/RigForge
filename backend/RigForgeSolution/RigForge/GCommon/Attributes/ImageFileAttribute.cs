using System.ComponentModel.DataAnnotations;

namespace RigForge.GCommon.Attributes;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter)]
public class ImageFileAttribute : ValidationAttribute
{
    private const int _signatureLength = 12;

    private static readonly IReadOnlyDictionary<string, string[]> _allowedContentTypes =
        new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
        {
            [".jpg"] = new[] { "image/jpeg", "image/pjpeg" },
            [".jpeg"] = new[] { "image/jpeg", "image/pjpeg" },
            [".png"] = new[] { "image/png" },
            [".webp"] = new[] { "image/webp" }
        };

    private static readonly byte[] _pngSignature = { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A };

    public ImageFileAttribute(int maxSizeBytes)
    {
        this.MaxSizeBytes = maxSizeBytes;
    }

    public int MaxSizeBytes { get; }

    public override bool IsValid(object? value)
    {
        if (value == null)
        {
            return true;
        }

        if (value is not IFormFile file)
        {
            return false;
        }

        if (file.Length <= 0 || file.Length > this.MaxSizeBytes)
        {
            return false;
        }

        string extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!_allowedContentTypes.TryGetValue(extension, out string[]? contentTypes)
            || !contentTypes.Contains(file.ContentType, StringComparer.OrdinalIgnoreCase))
        {
            return false;
        }

        byte[] header = new byte[_signatureLength];

        using (Stream stream = file.OpenReadStream())
        {
            int bytesRead = stream.ReadAtLeast(header, _signatureLength, throwOnEndOfStream: false);

            if (bytesRead < _signatureLength)
            {
                return false;
            }
        }

        return extension switch
        {
            ".jpg" or ".jpeg" => IsJpeg(header),
            ".png" => IsPng(header),
            ".webp" => IsWebp(header),
            _ => false
        };
    }

    private static bool IsJpeg(byte[] header)
    {
        return header[0] == 0xFF
            && header[1] == 0xD8
            && header[2] == 0xFF;
    }

    private static bool IsPng(byte[] header)
    {
        return header
            .AsSpan(0, _pngSignature.Length)
            .SequenceEqual(_pngSignature);
    }

    private static bool IsWebp(byte[] header)
    {
        return header.AsSpan(0, 4).SequenceEqual("RIFF"u8)
            && header.AsSpan(8, 4).SequenceEqual("WEBP"u8);
    }
}
