using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JoinFormatPractice
{
    /// <summary>
    /// Practice file for joining and formatting operations:
    /// Practice: J (join lines), gJ (join without space), gq (format text)
    /// Practice formatting long method signatures, parameter lists, and expressions
    /// Focus on breaking and joining long lines appropriately
    /// </summary>
    public class LongMethodSignatureExamples
    {
        // Practice joining these broken method signatures
        public async Task<ComplexOperationResult>
            ExecuteComplexBusinessOperationWithMultipleParametersAsync(
                string primaryIdentifier,
                int secondaryIdentifier,
                DateTime operationTimestamp,
                decimal monetaryAmount,
                string currencyCode,
                bool validateInputs,
                CancellationToken cancellationToken = default)
        {
            // Practice joining these parameter validations
            if (string.IsNullOrWhiteSpace(primaryIdentifier))
                throw new ArgumentException("Primary identifier cannot be null or empty",
                    nameof(primaryIdentifier));

            if (secondaryIdentifier <= 0)
                throw new ArgumentException("Secondary identifier must be positive",
                    nameof(secondaryIdentifier));

            if (operationTimestamp == default)
                throw new ArgumentException("Operation timestamp cannot be default",
                    nameof(operationTimestamp));

            if (monetaryAmount < 0)
                throw new ArgumentException("Monetary amount cannot be negative",
                    nameof(monetaryAmount));

            // Practice formatting this long conditional chain
            var validationResult = validateInputs &&
                                   !string.IsNullOrEmpty(currencyCode) &&
                                   currencyCode.Length == 3 &&
                                   monetaryAmount > 0 &&
                                   operationTimestamp > DateTime.Now.AddDays(-30);

            // Practice joining these method calls
            var preprocessedData = await PreprocessOperationDataAsync(primaryIdentifier,
                                                                      secondaryIdentifier)
                                        .ConfigureAwait(false);

            var enrichedData = await EnrichDataWithExternalSourcesAsync(preprocessedData,
                                                                        operationTimestamp,
                                                                        currencyCode)
                                   .ConfigureAwait(false);

            var transformedData = await TransformDataAccordingToBusinessRulesAsync(enrichedData,
                                                                                   monetaryAmount,
                                                                                   validateInputs)
                                      .ConfigureAwait(false);

            return new ComplexOperationResult
            {
                IsSuccessful = true,
                ProcessedData = transformedData,
                OperationId = Guid.NewGuid(),
                ProcessingTimestamp = DateTime.UtcNow
            };
        }

        // Practice formatting this constructor with many parameters
        public LongMethodSignatureExamples(
            IBusinessRuleEngine businessRuleEngine,
            IDataValidationService dataValidationService,
            IExternalDataEnrichmentService externalDataEnrichmentService,
            IDataTransformationService dataTransformationService,
            IOperationLoggingService operationLoggingService,
            IPerformanceMonitoringService performanceMonitoringService,
            IConfigurationManager configurationManager,
            ICacheManager cacheManager,
            INotificationService notificationService)
        {
            // Practice joining these null checks
            _businessRuleEngine = businessRuleEngine ??
                                  throw new ArgumentNullException(nameof(businessRuleEngine));
            _dataValidationService = dataValidationService ??
                                     throw new ArgumentNullException(nameof(dataValidationService));
            _externalDataEnrichmentService = externalDataEnrichmentService ??
                                             throw new ArgumentNullException(nameof(externalDataEnrichmentService));
            _dataTransformationService = dataTransformationService ??
                                         throw new ArgumentNullException(nameof(dataTransformationService));
            _operationLoggingService = operationLoggingService ??
                                       throw new ArgumentNullException(nameof(operationLoggingService));
            _performanceMonitoringService = performanceMonitoringService ??
                                            throw new ArgumentNullException(nameof(performanceMonitoringService));
        }

        // Practice formatting this long LINQ query
        public async Task<List<ProcessedDataItem>>
            GetFilteredAndSortedDataItemsAsync(
                IEnumerable<RawDataItem> rawDataItems,
                DateTime filterStartDate,
                DateTime filterEndDate,
                decimal minimumAmount,
                string[] allowedCategories,
                SortOrder sortOrder = SortOrder.Ascending)
        {
            // Practice joining/breaking this complex LINQ expression
            var filteredAndSortedItems = rawDataItems
                .Where(item => item.CreatedDate >= filterStartDate &&
                               item.CreatedDate <= filterEndDate &&
                               item.Amount >= minimumAmount &&
                               allowedCategories.Contains(item.Category,
                                                          StringComparer.OrdinalIgnoreCase))
                .Select(item => new ProcessedDataItem
                {
                    Id = item.Id,
                    ProcessedAmount = item.Amount * GetCurrencyConversionRate(item.CurrencyCode),
                    NormalizedCategory = NormalizeCategory(item.Category),
                    ProcessedDescription = CleanAndFormatDescription(item.Description),
                    Tags = ExtractTagsFromDescription(item.Description),
                    CalculatedScore = CalculateItemScore(item.Amount,
                                                         item.Category,
                                                         item.CreatedDate),
                    RelatedItems = FindRelatedItems(item.Id, rawDataItems),
                    ValidationStatus = ValidateDataItem(item)
                })
                .OrderBy(item => sortOrder == SortOrder.Ascending ?
                                 item.CalculatedScore :
                                 -item.CalculatedScore)
                .ThenBy(item => item.ProcessedAmount)
                .ThenBy(item => item.NormalizedCategory)
                .ToList();

            return filteredAndSortedItems;
        }

        // Practice formatting method with many generic constraints
        public async Task<TResult>
            ExecuteGenericOperationWithConstraintsAsync<TInput, TOutput, TResult>(
                TInput inputData,
                Func<TInput, Task<TOutput>> transformationFunction,
                Func<TOutput, TResult> resultFunction,
                IValidator<TInput> inputValidator,
                IValidator<TOutput> outputValidator)
            where TInput : class, IValidatable, new()
            where TOutput : class, IProcessable, IComparable<TOutput>
            where TResult : class, IResult
        {
            // Practice joining these validation calls
            var inputValidationResult = await inputValidator
                .ValidateAsync(inputData)
                .ConfigureAwait(false);

            if (!inputValidationResult.IsValid)
            {
                throw new ValidationException($"Input validation failed: {inputValidationResult.ErrorMessage}");
            }

            // Practice formatting this try-catch with long method calls
            try
            {
                var transformedOutput = await transformationFunction(inputData)
                                            .ConfigureAwait(false);

                var outputValidationResult = await outputValidator
                                                .ValidateAsync(transformedOutput)
                                                .ConfigureAwait(false);

                if (!outputValidationResult.IsValid)
                {
                    throw new ValidationException($"Output validation failed: {outputValidationResult.ErrorMessage}");
                }

                var finalResult = resultFunction(transformedOutput);
                return finalResult;
            }
            catch (Exception ex) when (ex is ValidationException ||
                                       ex is TransformationException ||
                                       ex is ProcessingException)
            {
                // Practice joining this logging statement
                _operationLoggingService.LogError(ex,
                    "Error in ExecuteGenericOperationWithConstraintsAsync for input type {InputType} and output type {OutputType}",
                    typeof(TInput).Name,
                    typeof(TOutput).Name);
                throw;
            }
        }

        // Practice formatting long conditional expressions
        public bool EvaluateComplexBusinessCondition(
            BusinessContext context,
            OperationParameters parameters,
            UserPermissions permissions)
        {
            // Practice joining/breaking this long conditional
            var result = context.IsActive &&
                         context.ValidFrom <= DateTime.UtcNow &&
                         context.ValidTo >= DateTime.UtcNow &&
                         parameters.Amount > 0 &&
                         parameters.Amount <= context.MaxAllowedAmount &&
                         permissions.CanPerformOperation &&
                         permissions.HasRequiredRole &&
                         (permissions.DepartmentCode == context.RequiredDepartment ||
                          permissions.IsAdministrator) &&
                         context.BusinessRules.All(rule => rule.Evaluate(parameters)) &&
                         !context.BlockedOperations.Contains(parameters.OperationType) &&
                         ValidateAdditionalConstraints(context, parameters, permissions);

            return result;
        }

        // Practice formatting complex switch expressions
        public string FormatDataBasedOnType(object data, string formatType, CultureInfo culture)
        {
            // Practice joining/breaking this switch expression
            return (data, formatType.ToLowerInvariant()) switch
            {
                (DateTime dateTime, "short") => dateTime.ToString("d", culture),
                (DateTime dateTime, "long") => dateTime.ToString("D", culture),
                (DateTime dateTime, "iso") => dateTime.ToString("yyyy-MM-ddTHH:mm:ss.fffZ",
                                                                 CultureInfo.InvariantCulture),
                (decimal amount, "currency") => amount.ToString("C", culture),
                (decimal amount, "percentage") => (amount / 100).ToString("P2", culture),
                (decimal amount, "scientific") => amount.ToString("E2", culture),
                (int number, "thousands") => number.ToString("N0", culture),
                (double value, "fixed") => value.ToString("F2", culture),
                (string text, "upper") => text.ToUpperInvariant(),
                (string text, "lower") => text.ToLowerInvariant(),
                (string text, "title") => CultureInfo.CurrentCulture.TextInfo.ToTitleCase(text.ToLower()),
                (bool boolean, "yesno") => boolean ? "Yes" : "No",
                (bool boolean, "onoff") => boolean ? "On" : "Off",
                (null, _) => "N/A",
                (_, _) => data.ToString() ?? string.Empty
            };
        }

        // Practice formatting array and collection initializations
        private readonly Dictionary<string, Func<object, string>> _formatters =
            new Dictionary<string, Func<object, string>>
            {
                ["currency"] = value => value is decimal d ?
                                       d.ToString("C2") :
                                       "Invalid",
                ["percentage"] = value => value is decimal d ?
                                         (d * 100).ToString("F2") + "%" :
                                         "Invalid",
                ["datetime"] = value => value is DateTime dt ?
                                       dt.ToString("yyyy-MM-dd HH:mm:ss") :
                                       "Invalid",
                ["boolean"] = value => value is bool b ?
                                      (b ? "True" : "False") :
                                      "Invalid"
            };

        // Practice formatting method chains
        public async Task<string> BuildComplexReportAsync(
            IEnumerable<DataRecord> records,
            ReportConfiguration configuration)
        {
            // Practice breaking/joining this method chain
            var reportData = await records
                .Where(r => r.IsActive &&
                           r.LastModified >= configuration.StartDate &&
                           r.LastModified <= configuration.EndDate)
                .GroupBy(r => new { r.Category, r.Department })
                .Select(g => new ReportSection
                {
                    Category = g.Key.Category,
                    Department = g.Key.Department,
                    RecordCount = g.Count(),
                    TotalAmount = g.Sum(r => r.Amount),
                    AverageAmount = g.Average(r => r.Amount),
                    MinAmount = g.Min(r => r.Amount),
                    MaxAmount = g.Max(r => r.Amount),
                    FirstRecord = g.OrderBy(r => r.CreatedDate).First(),
                    LastRecord = g.OrderByDescending(r => r.CreatedDate).First()
                })
                .OrderByDescending(s => s.TotalAmount)
                .ThenBy(s => s.Category)
                .ThenBy(s => s.Department)
                .ToListAsync();

            // Practice formatting this string interpolation
            var reportHeader = $@"
Report Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss UTC}
Configuration: {configuration.Name}
Period: {configuration.StartDate:yyyy-MM-dd} to {configuration.EndDate:yyyy-MM-dd}
Total Sections: {reportData.Count}
Grand Total: {reportData.Sum(s => s.TotalAmount):C2}
";

            var reportBody = string.Join("\n\n",
                reportData.Select(section =>
                    $"Category: {section.Category}\n" +
                    $"Department: {section.Department}\n" +
                    $"Records: {section.RecordCount:N0}\n" +
                    $"Total: {section.TotalAmount:C2}\n" +
                    $"Average: {section.AverageAmount:C2}\n" +
                    $"Range: {section.MinAmount:C2} - {section.MaxAmount:C2}"));

            return reportHeader + "\n" + reportBody;
        }

        // Private fields for dependency injection
        private readonly IBusinessRuleEngine _businessRuleEngine;
        private readonly IDataValidationService _dataValidationService;
        private readonly IExternalDataEnrichmentService _externalDataEnrichmentService;
        private readonly IDataTransformationService _dataTransformationService;
        private readonly IOperationLoggingService _operationLoggingService;
        private readonly IPerformanceMonitoringService _performanceMonitoringService;

        // Helper methods with long signatures to practice formatting
        private async Task<PreprocessedData> PreprocessOperationDataAsync(
            string primaryIdentifier,
            int secondaryIdentifier) => throw new NotImplementedException();

        private async Task<EnrichedData> EnrichDataWithExternalSourcesAsync(
            PreprocessedData data,
            DateTime timestamp,
            string currencyCode) => throw new NotImplementedException();

        private async Task<TransformedData> TransformDataAccordingToBusinessRulesAsync(
            EnrichedData data,
            decimal amount,
            bool validate) => throw new NotImplementedException();

        private decimal GetCurrencyConversionRate(string currencyCode) => 1.0m;
        private string NormalizeCategory(string category) => category;
        private string CleanAndFormatDescription(string description) => description;
        private List<string> ExtractTagsFromDescription(string description) => new();
        private decimal CalculateItemScore(decimal amount, string category, DateTime date) => 0;
        private List<int> FindRelatedItems(int id, IEnumerable<RawDataItem> items) => new();
        private ValidationStatus ValidateDataItem(RawDataItem item) => ValidationStatus.Valid;
        private bool ValidateAdditionalConstraints(BusinessContext context, OperationParameters parameters, UserPermissions permissions) => true;
    }

    // Supporting classes and enums
    public class ComplexOperationResult
    {
        public bool IsSuccessful { get; set; }
        public TransformedData? ProcessedData { get; set; }
        public Guid OperationId { get; set; }
        public DateTime ProcessingTimestamp { get; set; }
    }

    public class ProcessedDataItem
    {
        public int Id { get; set; }
        public decimal ProcessedAmount { get; set; }
        public string NormalizedCategory { get; set; } = string.Empty;
        public string ProcessedDescription { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
        public decimal CalculatedScore { get; set; }
        public List<int> RelatedItems { get; set; } = new();
        public ValidationStatus ValidationStatus { get; set; }
    }

    public enum SortOrder { Ascending, Descending }
    public enum ValidationStatus { Valid, Invalid, Pending }

    // Interface definitions
    public interface IValidatable { }
    public interface IProcessable { }
    public interface IResult { }
    public interface IValidator<T> { Task<ValidationResult> ValidateAsync(T item); }
    public interface IBusinessRuleEngine { }
    public interface IDataValidationService { }
    public interface IExternalDataEnrichmentService { }
    public interface IDataTransformationService { }
    public interface IOperationLoggingService
    {
        void LogError(Exception ex, string message, params object[] args);
    }
    public interface IPerformanceMonitoringService { }

    // Data classes
    public class RawDataItem
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;
        public string CurrencyCode { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class BusinessContext
    {
        public bool IsActive { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public decimal MaxAllowedAmount { get; set; }
        public string RequiredDepartment { get; set; } = string.Empty;
        public List<IBusinessRule> BusinessRules { get; set; } = new();
        public HashSet<string> BlockedOperations { get; set; } = new();
    }

    public class OperationParameters
    {
        public decimal Amount { get; set; }
        public string OperationType { get; set; } = string.Empty;
    }

    public class UserPermissions
    {
        public bool CanPerformOperation { get; set; }
        public bool HasRequiredRole { get; set; }
        public string DepartmentCode { get; set; } = string.Empty;
        public bool IsAdministrator { get; set; }
    }

    public class ReportConfiguration
    {
        public string Name { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class ReportSection
    {
        public string Category { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int RecordCount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal AverageAmount { get; set; }
        public decimal MinAmount { get; set; }
        public decimal MaxAmount { get; set; }
        public DataRecord? FirstRecord { get; set; }
        public DataRecord? LastRecord { get; set; }
    }

    public class DataRecord
    {
        public bool IsActive { get; set; }
        public DateTime LastModified { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    // Supporting types
    public class PreprocessedData { }
    public class EnrichedData { }
    public class TransformedData { }
    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
    }
    public class ValidationException : Exception
    {
        public ValidationException(string message) : base(message) { }
    }
    public class TransformationException : Exception { }
    public class ProcessingException : Exception { }
    public interface IBusinessRule { bool Evaluate(OperationParameters parameters); }
}