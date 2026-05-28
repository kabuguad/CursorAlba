namespace AlberSchoolApi.Application.Common;

/// <summary>Uniform envelope for every API response.</summary>
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string? Message { get; set; }
    public T? Data { get; set; }
    public IEnumerable<string>? Errors { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null) =>
        new() { Success = true, Data = data, Message = message };

    public static ApiResponse<T> Fail(string message, IEnumerable<string>? errors = null) =>
        new() { Success = false, Message = message, Errors = errors };
}

/// <summary>Non-generic convenience overload for operations returning no data.</summary>
public class ApiResponse : ApiResponse<object>
{
    public static ApiResponse Ok(string message = "Success") =>
        new() { Success = true, Message = message };

    public static new ApiResponse Fail(string message, IEnumerable<string>? errors = null) =>
        new() { Success = false, Message = message, Errors = errors };
}
