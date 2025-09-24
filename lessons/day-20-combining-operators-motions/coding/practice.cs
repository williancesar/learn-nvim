using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace OperatorMotionPractice
{
    /// <summary>
    /// Practice file for combining operators with motions:
    /// d (delete), c (change), y (yank/copy), v (select)
    /// Combined with motions: w, e, b, f, t, /, ?, ^, $, gg, G, {, }
    /// Practice: dw, cw, y$, d/pattern, cf;, ct", v}, etc.
    /// </summary>
    public class DataTransformationEngine
    {
        private readonly Dictionary<string, Func<object, object>> transformations;
        private readonly List<ValidationRule> validationRules;
        private readonly StringBuilder processingLog;

        public DataTransformationEngine()
        {
            transformations = new Dictionary<string, Func<object, object>>();
            validationRules = new List<ValidationRule>();
            processingLog = new StringBuilder();
            InitializeDefaultTransformations();
        }

        public void RegisterTransformation(string name, Func<object, object> transformation)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Transformation name cannot be null or empty", nameof(name));

            if (transformation == null)
                throw new ArgumentNullException(nameof(transformation));

            transformations[name] = transformation;
            LogOperation($"Registered transformation: {name}");
        }

        public void AddValidationRule(string fieldName, Func<object, bool> validator, string errorMessage)
        {
            var rule = new ValidationRule
            {
                FieldName = fieldName,
                Validator = validator,
                ErrorMessage = errorMessage
            };

            validationRules.Add(rule);
            LogOperation($"Added validation rule for field: {fieldName}");
        }

        public async Task<TransformationResult> ProcessDataAsync(IEnumerable<DataRecord> inputData)
        {
            var result = new TransformationResult();
            var processedRecords = new List<DataRecord>();

            foreach (var record in inputData)
            {
                try
                {
                    var validatedRecord = ValidateRecord(record);
                    if (validatedRecord.IsValid)
                    {
                        var transformedRecord = await TransformRecordAsync(record);
                        processedRecords.Add(transformedRecord);
                        result.SuccessCount++;
                    }
                    else
                    {
                        result.ErrorCount++;
                        result.Errors.AddRange(validatedRecord.Errors.Select(e => $"Record {record.Id}: {e}"));
                    }
                }
                catch (Exception ex)
                {
                    result.ErrorCount++;
                    result.Errors.Add($"Record {record.Id}: {ex.Message}");
                    LogOperation($"Error processing record {record.Id}: {ex.Message}");
                }
            }

            result.ProcessedData = processedRecords;
            result.ProcessingTime = DateTime.UtcNow;
            LogOperation($"Processing completed. Success: {result.SuccessCount}, Errors: {result.ErrorCount}");

            return result;
        }

        private ValidationResult ValidateRecord(DataRecord record)
        {
            var result = new ValidationResult { IsValid = true, Errors = new List<string>() };

            foreach (var rule in validationRules)
            {
                var fieldValue = GetFieldValue(record, rule.FieldName);
                if (!rule.Validator(fieldValue))
                {
                    result.IsValid = false;
                    result.Errors.Add(rule.ErrorMessage);
                }
            }

            return result;
        }

        private async Task<DataRecord> TransformRecordAsync(DataRecord record)
        {
            var transformedRecord = record.Clone();

            foreach (var transformation in transformations)
            {
                try
                {
                    var fieldValue = GetFieldValue(transformedRecord, transformation.Key);
                    var transformedValue = transformation.Value(fieldValue);
                    SetFieldValue(transformedRecord, transformation.Key, transformedValue);

                    LogOperation($"Applied transformation {transformation.Key} to record {record.Id}");
                }
                catch (Exception ex)
                {
                    LogOperation($"Transformation {transformation.Key} failed for record {record.Id}: {ex.Message}");
                    throw new TransformationException($"Failed to apply transformation {transformation.Key}", ex);
                }
            }

            return transformedRecord;
        }

        private object GetFieldValue(DataRecord record, string fieldName)
        {
            return fieldName.ToLowerInvariant() switch
            {
                "id" => record.Id,
                "name" => record.Name,
                "value" => record.Value,
                "category" => record.Category,
                "timestamp" => record.Timestamp,
                "metadata" => record.Metadata,
                "tags" => record.Tags,
                "status" => record.Status,
                _ => record.AdditionalData.GetValueOrDefault(fieldName)
            };
        }

        private void SetFieldValue(DataRecord record, string fieldName, object value)
        {
            switch (fieldName.ToLowerInvariant())
            {
                case "id":
                    record.Id = Convert.ToInt32(value);
                    break;
                case "name":
                    record.Name = value?.ToString() ?? string.Empty;
                    break;
                case "value":
                    record.Value = Convert.ToDecimal(value);
                    break;
                case "category":
                    record.Category = value?.ToString() ?? string.Empty;
                    break;
                case "timestamp":
                    record.Timestamp = Convert.ToDateTime(value);
                    break;
                case "metadata":
                    record.Metadata = value?.ToString();
                    break;
                case "tags":
                    record.Tags = value as List<string> ?? new List<string>();
                    break;
                case "status":
                    record.Status = value?.ToString() ?? string.Empty;
                    break;
                default:
                    record.AdditionalData[fieldName] = value;
                    break;
            }
        }

        public string GenerateReport(TransformationResult result)
        {
            var report = new StringBuilder();
            report.AppendLine("=== Data Transformation Report ===");
            report.AppendLine($"Processing Time: {result.ProcessingTime:yyyy-MM-dd HH:mm:ss}");
            report.AppendLine($"Total Records Processed: {result.SuccessCount + result.ErrorCount}");
            report.AppendLine($"Successful Transformations: {result.SuccessCount}");
            report.AppendLine($"Failed Transformations: {result.ErrorCount}");
            report.AppendLine();

            if (result.Errors.Any())
            {
                report.AppendLine("=== Errors ===");
                foreach (var error in result.Errors)
                {
                    report.AppendLine($"- {error}");
                }
                report.AppendLine();
            }

            report.AppendLine("=== Transformation Summary ===");
            foreach (var transformation in transformations.Keys)
            {
                report.AppendLine($"- {transformation}: Applied to {result.SuccessCount} records");
            }

            report.AppendLine();
            report.AppendLine("=== Validation Rules ===");
            foreach (var rule in validationRules)
            {
                report.AppendLine($"- {rule.FieldName}: {rule.ErrorMessage}");
            }

            return report.ToString();
        }

        public void ExportProcessingLog(string filePath)
        {
            var logContent = processingLog.ToString();
            System.IO.File.WriteAllText(filePath, logContent);
            LogOperation($"Processing log exported to: {filePath}");
        }

        public Dictionary<string, int> GetTransformationStatistics(TransformationResult result)
        {
            var statistics = new Dictionary<string, int>();

            statistics["TotalRecords"] = result.SuccessCount + result.ErrorCount;
            statistics["SuccessfulTransformations"] = result.SuccessCount;
            statistics["FailedTransformations"] = result.ErrorCount;
            statistics["ValidationRuleCount"] = validationRules.Count;
            statistics["RegisteredTransformations"] = transformations.Count;

            foreach (var category in result.ProcessedData.GroupBy(r => r.Category))
            {
                statistics[$"Category_{category.Key}"] = category.Count();
            }

            foreach (var status in result.ProcessedData.GroupBy(r => r.Status))
            {
                statistics[$"Status_{status.Key}"] = status.Count();
            }

            return statistics;
        }

        private void InitializeDefaultTransformations()
        {
            RegisterTransformation("normalizeText", value => value?.ToString()?.Trim().ToLowerInvariant() ?? string.Empty);
            RegisterTransformation("capitalizeFirst", value => CapitalizeFirstLetter(value?.ToString()));
            RegisterTransformation("removeSpecialChars", value => RemoveSpecialCharacters(value?.ToString()));
            RegisterTransformation("formatCurrency", value => FormatAsCurrency(value));
            RegisterTransformation("standardizeDate", value => StandardizeDate(value));
            RegisterTransformation("trimWhitespace", value => value?.ToString()?.Trim() ?? string.Empty);
            RegisterTransformation("convertToUpper", value => value?.ToString()?.ToUpperInvariant() ?? string.Empty);
            RegisterTransformation("validateEmail", value => ValidateEmailFormat(value?.ToString()));
            RegisterTransformation("parseNumeric", value => ParseNumericValue(value));
            RegisterTransformation("formatPhoneNumber", value => FormatPhoneNumber(value?.ToString()));
        }

        private string CapitalizeFirstLetter(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            return char.ToUpperInvariant(input[0]) + input.Substring(1).ToLowerInvariant();
        }

        private string RemoveSpecialCharacters(string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            return new string(input.Where(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c)).ToArray());
        }

        private string FormatAsCurrency(object value)
        {
            if (decimal.TryParse(value?.ToString(), out var amount))
            {
                return amount.ToString("C2");
            }
            return "$0.00";
        }

        private DateTime StandardizeDate(object value)
        {
            if (DateTime.TryParse(value?.ToString(), out var date))
            {
                return date.Date;
            }
            return DateTime.MinValue;
        }

        private string ValidateEmailFormat(string email)
        {
            if (string.IsNullOrEmpty(email))
                return string.Empty;

            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address;
            }
            catch
            {
                return "INVALID_EMAIL";
            }
        }

        private decimal ParseNumericValue(object value)
        {
            if (decimal.TryParse(value?.ToString()?.Replace(",", "").Replace("$", ""), out var number))
            {
                return number;
            }
            return 0;
        }

        private string FormatPhoneNumber(string phone)
        {
            if (string.IsNullOrEmpty(phone))
                return string.Empty;

            var digits = new string(phone.Where(char.IsDigit).ToArray());

            if (digits.Length == 10)
            {
                return $"({digits.Substring(0, 3)}) {digits.Substring(3, 3)}-{digits.Substring(6, 4)}";
            }
            else if (digits.Length == 11 && digits.StartsWith("1"))
            {
                return $"+1 ({digits.Substring(1, 3)}) {digits.Substring(4, 3)}-{digits.Substring(7, 4)}";
            }

            return phone;
        }

        private void LogOperation(string message)
        {
            processingLog.AppendLine($"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] {message}");
        }
    }

    public class DataRecord
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Value { get; set; }
        public string Category { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? Metadata { get; set; }
        public List<string> Tags { get; set; } = new();
        public string Status { get; set; } = string.Empty;
        public Dictionary<string, object> AdditionalData { get; set; } = new();

        public DataRecord Clone()
        {
            return new DataRecord
            {
                Id = Id,
                Name = Name,
                Value = Value,
                Category = Category,
                Timestamp = Timestamp,
                Metadata = Metadata,
                Tags = new List<string>(Tags),
                Status = Status,
                AdditionalData = new Dictionary<string, object>(AdditionalData)
            };
        }
    }

    public class ValidationRule
    {
        public string FieldName { get; set; } = string.Empty;
        public Func<object, bool> Validator { get; set; } = _ => true;
        public string ErrorMessage { get; set; } = string.Empty;
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public List<string> Errors { get; set; } = new();
    }

    public class TransformationResult
    {
        public int SuccessCount { get; set; }
        public int ErrorCount { get; set; }
        public List<string> Errors { get; set; } = new();
        public List<DataRecord> ProcessedData { get; set; } = new();
        public DateTime ProcessingTime { get; set; }
    }

    public class TransformationException : Exception
    {
        public TransformationException(string message) : base(message) { }
        public TransformationException(string message, Exception innerException) : base(message, innerException) { }
    }

    public static class DataRecordExtensions
    {
        public static bool HasTag(this DataRecord record, string tag)
        {
            return record.Tags.Contains(tag, StringComparer.OrdinalIgnoreCase);
        }

        public static void AddTag(this DataRecord record, string tag)
        {
            if (!record.HasTag(tag))
            {
                record.Tags.Add(tag);
            }
        }

        public static void RemoveTag(this DataRecord record, string tag)
        {
            record.Tags.RemoveAll(t => string.Equals(t, tag, StringComparison.OrdinalIgnoreCase));
        }

        public static bool IsValid(this DataRecord record)
        {
            return !string.IsNullOrWhiteSpace(record.Name) &&
                   !string.IsNullOrWhiteSpace(record.Category) &&
                   record.Value >= 0 &&
                   record.Timestamp != default;
        }

        public static string GetDisplayName(this DataRecord record)
        {
            return $"{record.Name} ({record.Category}) - {record.Value:C}";
        }

        public static bool MatchesFilter(this DataRecord record, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return true;

            var term = searchTerm.ToLowerInvariant();

            return record.Name.ToLowerInvariant().Contains(term) ||
                   record.Category.ToLowerInvariant().Contains(term) ||
                   record.Status.ToLowerInvariant().Contains(term) ||
                   record.Tags.Any(tag => tag.ToLowerInvariant().Contains(term)) ||
                   (record.Metadata?.ToLowerInvariant().Contains(term) ?? false);
        }
    }
}