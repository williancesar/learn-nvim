using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.IO;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace ScreenNavigationPractice
{
    /// <summary>
    /// Long C# file for practicing screen navigation commands:
    /// H - Top of screen, M - Middle of screen, L - Bottom of screen
    /// Ctrl-d - Scroll down half screen, Ctrl-u - Scroll up half screen
    /// Ctrl-f - Page down, Ctrl-b - Page up
    /// gg - Top of file, G - Bottom of file
    /// </summary>
    public class ComplexDataProcessor
    {
        private readonly ILogger<ComplexDataProcessor> _logger;
        private readonly IConfiguration _configuration;
        private readonly Dictionary<string, ProcessingRule> _processingRules;
        private readonly List<IDataValidator> _validators;
        private readonly CacheManager _cacheManager;
        private readonly MetricsCollector _metricsCollector;

        public ComplexDataProcessor(
            ILogger<ComplexDataProcessor> logger,
            IConfiguration configuration,
            IEnumerable<IDataValidator> validators,
            CacheManager cacheManager,
            MetricsCollector metricsCollector)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _validators = validators?.ToList() ?? throw new ArgumentNullException(nameof(validators));
            _cacheManager = cacheManager ?? throw new ArgumentNullException(nameof(cacheManager));
            _metricsCollector = metricsCollector ?? throw new ArgumentNullException(nameof(metricsCollector));
            _processingRules = InitializeProcessingRules();
        }

        public async Task<ProcessingResult> ProcessDataAsync(string inputData, ProcessingOptions options)
        {
            var startTime = DateTime.UtcNow;
            var result = new ProcessingResult();

            try
            {
                _logger.LogInformation("Starting data processing with options: {@Options}", options);
                _metricsCollector.IncrementCounter("processing_started");

                // Step 1: Validate input data
                var validationResult = await ValidateInputDataAsync(inputData);
                if (!validationResult.IsValid)
                {
                    result.Success = false;
                    result.Errors.AddRange(validationResult.Errors);
                    _logger.LogWarning("Input validation failed: {Errors}", string.Join(", ", validationResult.Errors));
                    return result;
                }

                // Step 2: Parse input data
                var parsedData = await ParseInputDataAsync(inputData);
                if (parsedData == null)
                {
                    result.Success = false;
                    result.Errors.Add("Failed to parse input data");
                    return result;
                }

                // Step 3: Apply transformations
                var transformedData = await ApplyTransformationsAsync(parsedData, options);
                if (transformedData == null)
                {
                    result.Success = false;
                    result.Errors.Add("Data transformation failed");
                    return result;
                }

                // Step 4: Apply business rules
                var processedData = await ApplyBusinessRulesAsync(transformedData, options);
                if (processedData == null)
                {
                    result.Success = false;
                    result.Errors.Add("Business rule processing failed");
                    return result;
                }

                // Step 5: Perform aggregations
                var aggregatedData = await PerformAggregationsAsync(processedData, options);

                // Step 6: Generate output
                var outputData = await GenerateOutputAsync(aggregatedData, options);

                // Step 7: Cache results if enabled
                if (options.EnableCaching)
                {
                    await CacheResultsAsync(inputData, outputData, options);
                }

                result.Success = true;
                result.OutputData = outputData;
                result.ProcessingTime = DateTime.UtcNow - startTime;
                result.RecordsProcessed = processedData?.Count ?? 0;

                _logger.LogInformation("Data processing completed successfully. Records: {Count}, Time: {Duration}ms",
                    result.RecordsProcessed, result.ProcessingTime.TotalMilliseconds);

                _metricsCollector.RecordProcessingTime(result.ProcessingTime);
                _metricsCollector.IncrementCounter("processing_completed");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during data processing");
                result.Success = false;
                result.Errors.Add($"Processing error: {ex.Message}");
                _metricsCollector.IncrementCounter("processing_failed");
                return result;
            }
        }

        private async Task<ValidationResult> ValidateInputDataAsync(string inputData)
        {
            var result = new ValidationResult { IsValid = true, Errors = new List<string>() };

            if (string.IsNullOrWhiteSpace(inputData))
            {
                result.IsValid = false;
                result.Errors.Add("Input data cannot be null or empty");
                return result;
            }

            foreach (var validator in _validators)
            {
                var validationResult = await validator.ValidateAsync(inputData);
                if (!validationResult.IsValid)
                {
                    result.IsValid = false;
                    result.Errors.AddRange(validationResult.Errors);
                }
            }

            return result;
        }

        private async Task<List<DataRecord>?> ParseInputDataAsync(string inputData)
        {
            try
            {
                _logger.LogDebug("Parsing input data of length: {Length}", inputData.Length);

                var records = new List<DataRecord>();
                var lines = inputData.Split('\n', StringSplitOptions.RemoveEmptyEntries);

                foreach (var line in lines)
                {
                    if (string.IsNullOrWhiteSpace(line))
                        continue;

                    var record = await ParseSingleRecordAsync(line);
                    if (record != null)
                    {
                        records.Add(record);
                    }
                }

                _logger.LogInformation("Parsed {Count} records from input data", records.Count);
                return records;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error parsing input data");
                return null;
            }
        }

        private async Task<DataRecord?> ParseSingleRecordAsync(string line)
        {
            try
            {
                var parts = line.Split(',');
                if (parts.Length < 5)
                {
                    _logger.LogWarning("Invalid record format: {Line}", line);
                    return null;
                }

                var record = new DataRecord
                {
                    Id = Guid.NewGuid(),
                    Timestamp = DateTime.Parse(parts[0]),
                    Category = parts[1].Trim(),
                    Value = decimal.Parse(parts[2]),
                    Status = parts[3].Trim(),
                    Metadata = parts[4].Trim(),
                    ProcessedDate = DateTime.UtcNow
                };

                return record;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to parse record: {Line}", line);
                return null;
            }
        }

        private async Task<List<DataRecord>?> ApplyTransformationsAsync(List<DataRecord> data, ProcessingOptions options)
        {
            try
            {
                var transformedData = new List<DataRecord>();

                foreach (var record in data)
                {
                    var transformedRecord = await TransformSingleRecordAsync(record, options);
                    if (transformedRecord != null)
                    {
                        transformedData.Add(transformedRecord);
                    }
                }

                _logger.LogInformation("Transformed {Count} records", transformedData.Count);
                return transformedData;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during data transformation");
                return null;
            }
        }

        private async Task<DataRecord?> TransformSingleRecordAsync(DataRecord record, ProcessingOptions options)
        {
            try
            {
                // Apply normalization
                if (options.NormalizeValues)
                {
                    record.Value = NormalizeValue(record.Value, options.NormalizationRange);
                }

                // Apply category mapping
                if (options.CategoryMappings?.ContainsKey(record.Category) == true)
                {
                    record.Category = options.CategoryMappings[record.Category];
                }

                // Apply status transformation
                record.Status = TransformStatus(record.Status, options);

                // Add computed fields
                record.ComputedScore = CalculateScore(record);
                record.QualityIndex = CalculateQualityIndex(record);

                return record;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to transform record: {RecordId}", record.Id);
                return null;
            }
        }

        private async Task<List<DataRecord>?> ApplyBusinessRulesAsync(List<DataRecord> data, ProcessingOptions options)
        {
            try
            {
                var processedData = new List<DataRecord>();

                foreach (var record in data)
                {
                    if (await ShouldProcessRecordAsync(record, options))
                    {
                        var processedRecord = await ApplyBusinessRulesToRecordAsync(record, options);
                        if (processedRecord != null)
                        {
                            processedData.Add(processedRecord);
                        }
                    }
                }

                _logger.LogInformation("Applied business rules to {Count} records", processedData.Count);
                return processedData;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error applying business rules");
                return null;
            }
        }

        private async Task<bool> ShouldProcessRecordAsync(DataRecord record, ProcessingOptions options)
        {
            // Check date range
            if (options.DateRange != null)
            {
                if (record.Timestamp < options.DateRange.Start || record.Timestamp > options.DateRange.End)
                {
                    return false;
                }
            }

            // Check value thresholds
            if (options.MinValue.HasValue && record.Value < options.MinValue.Value)
            {
                return false;
            }

            if (options.MaxValue.HasValue && record.Value > options.MaxValue.Value)
            {
                return false;
            }

            // Check category filters
            if (options.AllowedCategories?.Any() == true && !options.AllowedCategories.Contains(record.Category))
            {
                return false;
            }

            // Check status filters
            if (options.ExcludedStatuses?.Contains(record.Status) == true)
            {
                return false;
            }

            return true;
        }

        private async Task<DataRecord?> ApplyBusinessRulesToRecordAsync(DataRecord record, ProcessingOptions options)
        {
            try
            {
                // Apply rule-based transformations
                foreach (var rule in _processingRules.Values)
                {
                    if (rule.ShouldApply(record))
                    {
                        record = rule.Apply(record);
                    }
                }

                // Calculate derived metrics
                record.TrendIndicator = CalculateTrendIndicator(record);
                record.RiskScore = CalculateRiskScore(record);
                record.ConfidenceLevel = CalculateConfidenceLevel(record);

                return record;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to apply business rules to record: {RecordId}", record.Id);
                return null;
            }
        }

        private async Task<AggregatedData> PerformAggregationsAsync(List<DataRecord> data, ProcessingOptions options)
        {
            var aggregatedData = new AggregatedData
            {
                TotalRecords = data.Count,
                ProcessingTimestamp = DateTime.UtcNow
            };

            // Group by category
            var categoryGroups = data.GroupBy(r => r.Category).ToList();
            foreach (var group in categoryGroups)
            {
                var categoryStats = new CategoryStatistics
                {
                    Category = group.Key,
                    Count = group.Count(),
                    TotalValue = group.Sum(r => r.Value),
                    AverageValue = group.Average(r => r.Value),
                    MinValue = group.Min(r => r.Value),
                    MaxValue = group.Max(r => r.Value),
                    StandardDeviation = CalculateStandardDeviation(group.Select(r => r.Value))
                };

                aggregatedData.CategoryStatistics.Add(categoryStats);
            }

            // Time-based aggregations
            var timeGroups = data.GroupBy(r => r.Timestamp.Date).ToList();
            foreach (var group in timeGroups)
            {
                var timeStats = new TimeStatistics
                {
                    Date = group.Key,
                    Count = group.Count(),
                    TotalValue = group.Sum(r => r.Value),
                    AverageScore = group.Average(r => r.ComputedScore ?? 0)
                };

                aggregatedData.TimeStatistics.Add(timeStats);
            }

            // Status distribution
            aggregatedData.StatusDistribution = data
                .GroupBy(r => r.Status)
                .ToDictionary(g => g.Key, g => g.Count());

            // Quality metrics
            aggregatedData.OverallQualityScore = data.Average(r => r.QualityIndex ?? 0);
            aggregatedData.HighQualityRecordCount = data.Count(r => (r.QualityIndex ?? 0) > 0.8m);

            return aggregatedData;
        }

        private async Task<string> GenerateOutputAsync(AggregatedData aggregatedData, ProcessingOptions options)
        {
            try
            {
                var output = new
                {
                    Summary = new
                    {
                        TotalRecords = aggregatedData.TotalRecords,
                        ProcessingTimestamp = aggregatedData.ProcessingTimestamp,
                        OverallQualityScore = aggregatedData.OverallQualityScore,
                        HighQualityRecordCount = aggregatedData.HighQualityRecordCount
                    },
                    CategoryStatistics = aggregatedData.CategoryStatistics,
                    TimeStatistics = aggregatedData.TimeStatistics,
                    StatusDistribution = aggregatedData.StatusDistribution
                };

                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                };

                return JsonSerializer.Serialize(output, jsonOptions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating output");
                throw;
            }
        }

        private async Task CacheResultsAsync(string inputData, string outputData, ProcessingOptions options)
        {
            try
            {
                var cacheKey = GenerateCacheKey(inputData, options);
                var cacheEntry = new CacheEntry
                {
                    Key = cacheKey,
                    Value = outputData,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddHours(options.CacheExpirationHours ?? 24)
                };

                await _cacheManager.SetAsync(cacheKey, cacheEntry);
                _logger.LogDebug("Results cached with key: {CacheKey}", cacheKey);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to cache results");
            }
        }

        private Dictionary<string, ProcessingRule> InitializeProcessingRules()
        {
            return new Dictionary<string, ProcessingRule>
            {
                ["HighValueRule"] = new ProcessingRule
                {
                    Name = "HighValueRule",
                    Condition = record => record.Value > 1000,
                    Action = record => { record.Category = "HighValue"; return record; }
                },
                ["QualityBoostRule"] = new ProcessingRule
                {
                    Name = "QualityBoostRule",
                    Condition = record => record.Status == "Premium",
                    Action = record => { record.QualityIndex = (record.QualityIndex ?? 0) * 1.2m; return record; }
                }
            };
        }

        private decimal NormalizeValue(decimal value, (decimal Min, decimal Max) range)
        {
            return (value - range.Min) / (range.Max - range.Min);
        }

        private string TransformStatus(string status, ProcessingOptions options)
        {
            return options.StatusTransformations?.GetValueOrDefault(status, status) ?? status;
        }

        private decimal CalculateScore(DataRecord record)
        {
            return record.Value * 0.3m + (record.QualityIndex ?? 0) * 0.7m;
        }

        private decimal CalculateQualityIndex(DataRecord record)
        {
            var baseQuality = 0.5m;
            if (record.Status == "Premium") baseQuality += 0.3m;
            if (record.Value > 500) baseQuality += 0.2m;
            return Math.Min(1.0m, baseQuality);
        }

        private string CalculateTrendIndicator(DataRecord record)
        {
            return record.Value switch
            {
                > 1000 => "Increasing",
                < 100 => "Decreasing",
                _ => "Stable"
            };
        }

        private decimal CalculateRiskScore(DataRecord record)
        {
            return record.Category switch
            {
                "HighRisk" => 0.9m,
                "MediumRisk" => 0.5m,
                "LowRisk" => 0.1m,
                _ => 0.3m
            };
        }

        private decimal CalculateConfidenceLevel(DataRecord record)
        {
            return (record.QualityIndex ?? 0) * (1 - (record.RiskScore ?? 0));
        }

        private double CalculateStandardDeviation(IEnumerable<decimal> values)
        {
            var valueList = values.ToList();
            var average = valueList.Average();
            var sumOfSquaresOfDifferences = valueList.Select(val => (double)(val - average) * (double)(val - average)).Sum();
            return Math.Sqrt(sumOfSquaresOfDifferences / valueList.Count);
        }

        private string GenerateCacheKey(string inputData, ProcessingOptions options)
        {
            var hash = System.Security.Cryptography.SHA256.HashData(
                System.Text.Encoding.UTF8.GetBytes(inputData + JsonSerializer.Serialize(options)));
            return Convert.ToHexString(hash);
        }
    }
}