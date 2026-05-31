using System.Text.Json;

namespace Entities.Exceptions;

public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message) { }

    public BadRequestException(string message, object? details = null)
        : base(message)
    {
        Details = details;
    }

    public object? Details { get; }
}
