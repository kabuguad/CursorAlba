namespace DTOs.Content;

public record UpsertPublicFeeRowDto(string Level, decimal Tuition, decimal Transport, decimal Activities, int SortOrder);