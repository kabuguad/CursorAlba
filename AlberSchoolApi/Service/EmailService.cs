using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;

namespace Service;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var emailSettings = _configuration.GetSection("EmailSettings");
        var smtpHost = emailSettings["SmtpHost"] ?? "smtp.gmail.com";
        var smtpPort = int.Parse(emailSettings["SmtpPort"] ?? "587");
        var fromEmail = emailSettings["FromEmail"] ?? "no-reply@albaschool.com";
        var fromName = emailSettings["FromName"] ?? "Alba School";
        var password = emailSettings["Password"] ?? "";

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(fromName, fromEmail));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;

        var bodyBuilder = new BodyBuilder { HtmlBody = body };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
        if (!string.IsNullOrEmpty(password))
            await client.AuthenticateAsync(fromEmail, password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
