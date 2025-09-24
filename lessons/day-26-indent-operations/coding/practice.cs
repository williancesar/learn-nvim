using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IndentationPractice
{
/// <summary>
/// Practice file for indentation operations: >>, <<, =, >ap, <ap
/// This file has deliberately poor indentation to practice fixing it
/// Practice: Select blocks with V and use > < to indent/unindent
/// Practice: Use = to auto-format selected code blocks
/// </summary>
public class PoorlyIndentedClass
{
private readonly IService _service;
private readonly IRepository _repository;
private readonly ILogger _logger;

public PoorlyIndentedClass(IService service, IRepository repository, ILogger logger)
{
_service = service;
_repository = repository;
_logger = logger;
}

public async Task<Result> ProcessDataAsync(InputData data)
{
try
{
if (data == null)
{
throw new ArgumentNullException(nameof(data));
}

var validationResult = await ValidateDataAsync(data);
if (!validationResult.IsValid)
{
return Result.Failed(validationResult.ErrorMessage);
}

var processedData = new List<ProcessedItem>();
foreach (var item in data.Items)
{
try
{
var processed = await ProcessSingleItemAsync(item);
if (processed != null)
{
processedData.Add(processed);
}
}
catch (Exception ex)
{
_logger.LogError(ex, "Error processing item {ItemId}", item.Id);
}
}

return Result.Success(processedData);
}
catch (Exception ex)
{
_logger.LogError(ex, "Error in ProcessDataAsync");
return Result.Failed("Processing failed");
}
}

private async Task<ValidationResult> ValidateDataAsync(InputData data)
{
var errors = new List<string>();

if (string.IsNullOrEmpty(data.Name))
{
errors.Add("Name is required");
}

if (data.Items == null || !data.Items.Any())
{
errors.Add("Items collection cannot be empty");
}
else
{
foreach (var item in data.Items)
{
if (item.Value < 0)
{
errors.Add($"Item {item.Id} has negative value");
}

if (string.IsNullOrEmpty(item.Description))
{
errors.Add($"Item {item.Id} missing description");
}
}
}

if (data.Configuration != null)
{
if (data.Configuration.MaxItems > 0 && data.Items.Count() > data.Configuration.MaxItems)
{
errors.Add($"Too many items. Max allowed: {data.Configuration.MaxItems}");
}

if (data.Configuration.RequiredFields != null)
{
foreach (var field in data.Configuration.RequiredFields)
{
switch (field.ToLower())
{
case "email":
if (string.IsNullOrEmpty(data.Email))
{
errors.Add("Email is required");
}
break;
case "phone":
if (string.IsNullOrEmpty(data.PhoneNumber))
{
errors.Add("Phone number is required");
}
break;
case "address":
if (data.Address == null)
{
errors.Add("Address is required");
}
else
{
if (string.IsNullOrEmpty(data.Address.Street))
{
errors.Add("Street address is required");
}
if (string.IsNullOrEmpty(data.Address.City))
{
errors.Add("City is required");
}
if (string.IsNullOrEmpty(data.Address.PostalCode))
{
errors.Add("Postal code is required");
}
}
break;
}
}
}
}

return new ValidationResult
{
IsValid = !errors.Any(),
ErrorMessage = string.Join("; ", errors)
};
}

private async Task<ProcessedItem?> ProcessSingleItemAsync(InputItem item)
{
var transformations = new Dictionary<string, Func<object, object>>
{
["normalize"] = value => value.ToString()?.Trim().ToLowerInvariant(),
["format"] = value => FormatValue(value),
["validate"] = value => ValidateValue(value)
};

var processedItem = new ProcessedItem
{
Id = item.Id,
OriginalValue = item.Value,
Description = item.Description,
ProcessedDate = DateTime.UtcNow
};

try
{
foreach (var transformation in transformations)
{
switch (transformation.Key)
{
case "normalize":
processedItem.NormalizedDescription = transformation.Value(item.Description)?.ToString();
break;
case "format":
processedItem.FormattedValue = transformation.Value(item.Value)?.ToString();
break;
case "validate":
var validationResult = transformation.Value(item);
if (validationResult is bool isValid && !isValid)
{
return null;
}
break;
}
}

if (item.Metadata != null && item.Metadata.Any())
{
processedItem.ProcessedMetadata = new Dictionary<string, object>();
foreach (var metadata in item.Metadata)
{
try
{
var processedValue = ProcessMetadataValue(metadata.Key, metadata.Value);
processedItem.ProcessedMetadata[metadata.Key] = processedValue;
}
catch (Exception ex)
{
_logger.LogWarning(ex, "Error processing metadata {Key}", metadata.Key);
}
}
}

var enrichmentData = await _service.GetEnrichmentDataAsync(item.Id);
if (enrichmentData != null)
{
processedItem.EnrichedData = new EnrichedData
{
Category = enrichmentData.Category,
Tags = enrichmentData.Tags,
RelatedItems = enrichmentData.RelatedItems,
Score = CalculateScore(item, enrichmentData)
};

if (enrichmentData.Rules != null)
{
foreach (var rule in enrichmentData.Rules)
{
try
{
if (rule.ShouldApply(item))
{
var ruleResult = rule.Apply(processedItem);
if (ruleResult.IsSuccessful)
{
processedItem.AppliedRules.Add(rule.Name);
}
else
{
_logger.LogWarning("Rule {RuleName} failed for item {ItemId}: {Error}",
rule.Name, item.Id, ruleResult.ErrorMessage);
}
}
}
catch (Exception ex)
{
_logger.LogError(ex, "Error applying rule {RuleName} to item {ItemId}",
rule.Name, item.Id);
}
}
}
}

return processedItem;
}
catch (Exception ex)
{
_logger.LogError(ex, "Error in ProcessSingleItemAsync for item {ItemId}", item.Id);
return null;
}
}

private object ProcessMetadataValue(string key, object value)
{
switch (key.ToLower())
{
case "timestamp":
if (DateTime.TryParse(value.ToString(), out var timestamp))
{
return timestamp;
}
return DateTime.MinValue;

case "amount":
if (decimal.TryParse(value.ToString(), out var amount))
{
return amount;
}
return 0m;

case "tags":
if (value is string tagString)
{
return tagString.Split(',', StringSplitOptions.RemoveEmptyEntries)
.Select(tag => tag.Trim())
.ToList();
}
return new List<string>();

case "priority":
if (Enum.TryParse<Priority>(value.ToString(), true, out var priority))
{
return priority;
}
return Priority.Normal;

default:
return value?.ToString() ?? string.Empty;
}
}

private string FormatValue(object value)
{
return value switch
{
decimal d => d.ToString("C2"),
DateTime dt => dt.ToString("yyyy-MM-dd HH:mm:ss"),
bool b => b ? "Yes" : "No",
int i when i > 1000 => $"{i:N0}",
_ => value?.ToString() ?? string.Empty
};
}

private bool ValidateValue(object value)
{
if (value == null)
{
return false;
}

return value switch
{
string s => !string.IsNullOrWhiteSpace(s),
decimal d => d >= 0,
int i => i >= 0,
DateTime dt => dt > DateTime.MinValue && dt <= DateTime.MaxValue,
_ => true
};
}

private decimal CalculateScore(InputItem item, EnrichmentData enrichmentData)
{
var baseScore = item.Value * 0.3m;

if (enrichmentData.Category == "Premium")
{
baseScore *= 1.5m;
}

if (enrichmentData.Tags?.Contains("Featured") == true)
{
baseScore *= 1.2m;
}

if (enrichmentData.RelatedItems?.Count > 5)
{
baseScore *= 1.1m;
}

return Math.Round(baseScore, 2);
}

public async Task<AnalysisResult> AnalyzeProcessedDataAsync(List<ProcessedItem> processedItems)
{
if (processedItems == null || !processedItems.Any())
{
return new AnalysisResult
{
IsSuccessful = false,
ErrorMessage = "No processed items to analyze"
};
}

try
{
var analysis = new AnalysisResult
{
IsSuccessful = true,
TotalItems = processedItems.Count,
ProcessingDate = DateTime.UtcNow
};

var groupedByCategory = processedItems
.Where(item => item.EnrichedData?.Category != null)
.GroupBy(item => item.EnrichedData.Category)
.ToList();

analysis.CategoryBreakdown = groupedByCategory
.Select(group => new CategoryAnalysis
{
Category = group.Key,
ItemCount = group.Count(),
AverageScore = group.Average(item => item.EnrichedData?.Score ?? 0),
TotalValue = group.Sum(item => item.OriginalValue)
})
.OrderByDescending(ca => ca.ItemCount)
.ToList();

var allTags = processedItems
.Where(item => item.EnrichedData?.Tags != null)
.SelectMany(item => item.EnrichedData.Tags)
.GroupBy(tag => tag)
.Select(group => new TagAnalysis
{
Tag = group.Key,
Count = group.Count(),
Percentage = (double)group.Count() / processedItems.Count * 100
})
.OrderByDescending(ta => ta.Count)
.Take(10)
.ToList();

analysis.TopTags = allTags;

var qualityMetrics = new QualityMetrics
{
ItemsWithDescription = processedItems.Count(item => !string.IsNullOrEmpty(item.Description)),
ItemsWithMetadata = processedItems.Count(item => item.ProcessedMetadata?.Any() == true),
ItemsWithEnrichment = processedItems.Count(item => item.EnrichedData != null),
AverageProcessingTime = processedItems.Average(item =>
(item.ProcessedDate - DateTime.UtcNow.AddMinutes(-1)).TotalMilliseconds)
};

analysis.QualityMetrics = qualityMetrics;

return analysis;
}
catch (Exception ex)
{
_logger.LogError(ex, "Error in AnalyzeProcessedDataAsync");
return new AnalysisResult
{
IsSuccessful = false,
ErrorMessage = $"Analysis failed: {ex.Message}"
};
}
}
}

// Data classes with poor indentation to practice fixing
public class InputData
{
public string Name { get; set; } = string.Empty;
public string? Email { get; set; }
public string? PhoneNumber { get; set; }
public Address? Address { get; set; }
public List<InputItem> Items { get; set; } = new();
public Configuration? Configuration { get; set; }
}

public class InputItem
{
public int Id { get; set; }
public decimal Value { get; set; }
public string Description { get; set; } = string.Empty;
public Dictionary<string, object>? Metadata { get; set; }
}

public class Address
{
public string Street { get; set; } = string.Empty;
public string City { get; set; } = string.Empty;
public string PostalCode { get; set; } = string.Empty;
public string Country { get; set; } = string.Empty;
}

public class Configuration
{
public int MaxItems { get; set; }
public List<string>? RequiredFields { get; set; }
public Dictionary<string, object>? Settings { get; set; }
}

public class ProcessedItem
{
public int Id { get; set; }
public decimal OriginalValue { get; set; }
public string Description { get; set; } = string.Empty;
public string? NormalizedDescription { get; set; }
public string? FormattedValue { get; set; }
public DateTime ProcessedDate { get; set; }
public Dictionary<string, object>? ProcessedMetadata { get; set; }
public EnrichedData? EnrichedData { get; set; }
public List<string> AppliedRules { get; set; } = new();
}

public class EnrichedData
{
public string Category { get; set; } = string.Empty;
public List<string>? Tags { get; set; }
public List<int>? RelatedItems { get; set; }
public decimal Score { get; set; }
public List<BusinessRule>? Rules { get; set; }
}

public class BusinessRule
{
public string Name { get; set; } = string.Empty;
public Func<InputItem, bool> ShouldApply { get; set; } = _ => false;
public Func<ProcessedItem, RuleResult> Apply { get; set; } = _ => new RuleResult();
}

public class RuleResult
{
public bool IsSuccessful { get; set; }
public string? ErrorMessage { get; set; }
}

public class ValidationResult
{
public bool IsValid { get; set; }
public string? ErrorMessage { get; set; }
}

public class Result
{
public bool IsSuccessful { get; set; }
public List<ProcessedItem>? Data { get; set; }
public string? ErrorMessage { get; set; }

public static Result Success(List<ProcessedItem> data) =>
new() { IsSuccessful = true, Data = data };

public static Result Failed(string error) =>
new() { IsSuccessful = false, ErrorMessage = error };
}

public class AnalysisResult
{
public bool IsSuccessful { get; set; }
public string? ErrorMessage { get; set; }
public int TotalItems { get; set; }
public DateTime ProcessingDate { get; set; }
public List<CategoryAnalysis>? CategoryBreakdown { get; set; }
public List<TagAnalysis>? TopTags { get; set; }
public QualityMetrics? QualityMetrics { get; set; }
}

public class CategoryAnalysis
{
public string Category { get; set; } = string.Empty;
public int ItemCount { get; set; }
public decimal AverageScore { get; set; }
public decimal TotalValue { get; set; }
}

public class TagAnalysis
{
public string Tag { get; set; } = string.Empty;
public int Count { get; set; }
public double Percentage { get; set; }
}

public class QualityMetrics
{
public int ItemsWithDescription { get; set; }
public int ItemsWithMetadata { get; set; }
public int ItemsWithEnrichment { get; set; }
public double AverageProcessingTime { get; set; }
}

public enum Priority
{
Low,
Normal,
High,
Critical
}

// Service interfaces with poor indentation
public interface IService
{
Task<EnrichmentData?> GetEnrichmentDataAsync(int itemId);
Task<ProcessingStatistics> GetProcessingStatisticsAsync();
}

public interface IRepository
{
Task<List<ProcessedItem>> GetProcessedItemsAsync(DateTime fromDate, DateTime toDate);
Task SaveProcessedItemsAsync(List<ProcessedItem> items);
}

public interface ILogger
{
void LogInformation(string message, params object[] args);
void LogWarning(string message, params object[] args);
void LogError(Exception exception, string message, params object[] args);
}

public class ProcessingStatistics
{
public int TotalProcessed { get; set; }
public int SuccessfullyProcessed { get; set; }
public int FailedProcessing { get; set; }
public TimeSpan AverageProcessingTime { get; set; }
}
}