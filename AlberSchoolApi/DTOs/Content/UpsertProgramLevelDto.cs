namespace DTOs.Content;

public record UpsertProgramLevelDto(string Slug, string Name, string Ages, string Description, string? ImageUrl, int SortOrder);