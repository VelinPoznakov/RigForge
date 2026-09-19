namespace RigForge.GCommon.Exceptions;

public class JwtConfigurationNotFound : Exception
{
    public JwtConfigurationNotFound()
    {
    }

    public JwtConfigurationNotFound(string message)
        : base(message)
    {
    }

    public JwtConfigurationNotFound(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}
