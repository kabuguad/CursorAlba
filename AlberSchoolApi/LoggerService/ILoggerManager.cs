using Microsoft.Extensions.Logging;

namespace LoggerService;

public interface ILoggerManager
{
    void LogInfo(string message);
    void LogWarn(string message);
    void LogDebug(string message);
    void LogError(string message, Exception? ex = null);
    void LogVerbose(string message);
}
