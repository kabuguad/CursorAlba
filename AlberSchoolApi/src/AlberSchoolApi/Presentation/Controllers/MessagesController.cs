using System.Security.Claims;
using AlberSchoolApi.Application.Common;
using AlberSchoolApi.Application.DTOs.Communications;
using AlberSchoolApi.Application.Interfaces.Repositories;
using AlberSchoolApi.Domain.Entities.Communications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlberSchoolApi.Presentation.Controllers;

[ApiController]
[Route("api/messages")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMessageRepository _messages;

    public MessagesController(IMessageRepository messages) => _messages = messages;

    /// <summary>Get the current user's inbox.</summary>
    [HttpGet("inbox")]
    public async Task<ActionResult<ApiResponse<IEnumerable<MessageDto>>>> Inbox(CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();
        var messages = await _messages.GetInboxAsync(userId.Value, ct);
        return Ok(ApiResponse<IEnumerable<MessageDto>>.Ok(messages.Select(MapToDto)));
    }

    /// <summary>Get the current user's sent messages.</summary>
    [HttpGet("sent")]
    public async Task<ActionResult<ApiResponse<IEnumerable<MessageDto>>>> Sent(CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();
        var messages = await _messages.GetSentAsync(userId.Value, ct);
        return Ok(ApiResponse<IEnumerable<MessageDto>>.Ok(messages.Select(MapToDto)));
    }

    /// <summary>Get all messages in a thread.</summary>
    [HttpGet("thread/{threadId:guid}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<MessageDto>>>> GetThread(Guid threadId, CancellationToken ct)
    {
        var messages = await _messages.GetThreadAsync(threadId, ct);
        return Ok(ApiResponse<IEnumerable<MessageDto>>.Ok(messages.Select(MapToDto)));
    }

    /// <summary>Send a new message (or reply to a thread).</summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<MessageDto>>> Send([FromBody] SendMessageRequest req, CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();

        var threadId = req.ReplyToThreadId ?? Guid.NewGuid();
        var message = new Message
        {
            ThreadId = threadId,
            FromUserId = userId.Value,
            ToUserId = req.ToUserId,
            Subject = req.Subject,
            Body = req.Body
        };
        await _messages.AddAsync(message, ct);
        await _messages.SaveChangesAsync(ct);
        return Ok(ApiResponse<MessageDto>.Ok(MapToDto(message), "Message sent."));
    }

    /// <summary>Mark a message as read.</summary>
    [HttpPatch("{id:int}/read")]
    public async Task<ActionResult<ApiResponse>> MarkRead(int id, CancellationToken ct)
    {
        await _messages.MarkReadAsync(id, ct);
        return Ok(ApiResponse.Ok("Message marked as read."));
    }

    /// <summary>Get the unread message count for the current user.</summary>
    [HttpGet("unread-count")]
    public async Task<ActionResult<ApiResponse<int>>> UnreadCount(CancellationToken ct)
    {
        var userId = GetUserId();
        if (userId is null) return Unauthorized();
        var count = await _messages.GetUnreadCountAsync(userId.Value, ct);
        return Ok(ApiResponse<int>.Ok(count));
    }

    private int? GetUserId()
    {
        var str = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(str, out var id) ? id : null;
    }

    private static MessageDto MapToDto(Message m) => new(
        m.Id, m.ThreadId, m.FromUserId,
        m.FromUser != null ? m.FromUser.Name : "",
        m.ToUserId,
        m.ToUser != null ? m.ToUser.Name : "",
        m.Subject, m.Body, m.SentAt, m.ReadAt.HasValue);
}
