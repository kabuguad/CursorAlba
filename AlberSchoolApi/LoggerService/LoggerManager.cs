using Microsoft.Extensions.Logging;

namespace LoggerService;

public class LoggerManager(ILogger<LoggerManager> logger) : ILoggerManager
{
    public void LogDebug(string message) => logger.LogDebug(message);

    public void LogError(string message, Exception? ex = null) => logger.LogError(ex, message);

    public void LogInfo(string message) => logger.LogInformation(message);

    public void LogWarn(string message) => logger.LogWarning(message);

    public void LogVerbose(string message) => logger.LogTrace(message); // Trace is used for verbose in ASP.NET Core
}