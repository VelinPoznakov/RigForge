namespace RigForge.GCommon.Exceptions;

public class ConnectionStringNotFound: Exception
{
    public ConnectionStringNotFound()
    {
    }

    public ConnectionStringNotFound(string message)
        : base(message)
    {
    }

    public ConnectionStringNotFound(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}