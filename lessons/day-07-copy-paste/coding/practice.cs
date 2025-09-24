/*
 * Day 07: Copy & Paste Practice
 *
 * Copy & Paste Instructions:
 * 1. Use 'yy' to yank (copy) entire lines
 * 2. Use 'p' and 'P' to paste after/before cursor
 * 3. Practice 'yw', 'yb', 'ye' for word copying
 * 4. Try visual mode selection + 'y' for complex copying
 * 5. Use 'Y' to yank from cursor to end of line
 * 6. Practice duplicating patterns and methods below
 * 7. Copy templates to create new similar structures
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NvimPractice.Day07.CopyPaste;

// ===== COPY THESE VALIDATION ATTRIBUTES TO OTHER PROPERTIES =====
[Required(ErrorMessage = "This field is required")]
[StringLength(100, MinimumLength = 2, ErrorMessage = "Length must be between 2 and 100 characters")]
public string SampleProperty { get; set; } = string.Empty;

// ===== DUPLICATION TEMPLATE: Copy this class structure for similar entities =====
public class CustomerTemplate
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;

    public string FullName => $"{FirstName} {LastName}";
}

// TODO: Copy CustomerTemplate and create ProductTemplate class below
// Practice: Use 'yy' to copy lines, then modify class name and properties



// ===== COPY THESE CRUD OPERATIONS TO CREATE SIMILAR SERVICES =====
public class CustomerService
{
    private readonly List<CustomerTemplate> _customers = new();

    // Copy this method pattern for other CRUD operations
    public async Task<CustomerTemplate> CreateAsync(CustomerTemplate customer)
    {
        if (customer == null)
            throw new ArgumentNullException(nameof(customer));

        customer.Id = Guid.NewGuid();
        customer.CreatedAt = DateTime.UtcNow;
        _customers.Add(customer);

        return customer;
    }

    // TODO: Copy CreateAsync and modify to make UpdateAsync method



    // Copy this method pattern for other entity retrievals
    public async Task<CustomerTemplate?> GetByIdAsync(Guid id)
    {
        return _customers.FirstOrDefault(c => c.Id == id);
    }

    // TODO: Copy GetByIdAsync and create GetByEmailAsync method


    // Copy this pattern for other filtering operations
    public async Task<IEnumerable<CustomerTemplate>> GetActiveAsync()
    {
        return _customers.Where(c => c.IsActive).ToList();
    }

    // TODO: Copy GetActiveAsync and create GetInactiveAsync method


    // Copy this method for soft delete pattern
    public async Task<bool> SoftDeleteAsync(Guid id)
    {
        var customer = await GetByIdAsync(id);
        if (customer == null)
            return false;

        customer.IsActive = false;
        customer.UpdatedAt = DateTime.UtcNow;
        return true;
    }

    // TODO: Copy SoftDeleteAsync and create RestoreAsync method

}

// ===== REPOSITORY PATTERN TEMPLATE - COPY FOR OTHER ENTITIES =====
public interface IRepository<T> where T : class
{
    Task<T> CreateAsync(T entity);
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> UpdateAsync(T entity);
    Task<bool> DeleteAsync(Guid id);
    Task<bool> ExistsAsync(Guid id);
}

// Copy this implementation for other entity repositories
public class InMemoryRepository<T> : IRepository<T> where T : class
{
    protected readonly List<T> _entities = new();
    protected readonly Func<T, Guid> _getIdFunc;

    public InMemoryRepository(Func<T, Guid> getIdFunc)
    {
        _getIdFunc = getIdFunc ?? throw new ArgumentNullException(nameof(getIdFunc));
    }

    public virtual Task<T> CreateAsync(T entity)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity));

        _entities.Add(entity);
        return Task.FromResult(entity);
    }

    public virtual Task<T?> GetByIdAsync(Guid id)
    {
        var entity = _entities.FirstOrDefault(e => _getIdFunc(e) == id);
        return Task.FromResult(entity);
    }

    public virtual Task<IEnumerable<T>> GetAllAsync()
    {
        return Task.FromResult(_entities.AsEnumerable());
    }

    public virtual Task<T> UpdateAsync(T entity)
    {
        if (entity == null)
            throw new ArgumentNullException(nameof(entity));

        var id = _getIdFunc(entity);
        var index = _entities.FindIndex(e => _getIdFunc(e) == id);

        if (index >= 0)
        {
            _entities[index] = entity;
        }

        return Task.FromResult(entity);
    }

    public virtual Task<bool> DeleteAsync(Guid id)
    {
        var entity = _entities.FirstOrDefault(e => _getIdFunc(e) == id);
        if (entity != null)
        {
            _entities.Remove(entity);
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public virtual Task<bool> ExistsAsync(Guid id)
    {
        var exists = _entities.Any(e => _getIdFunc(e) == id);
        return Task.FromResult(exists);
    }
}

// TODO: Copy InMemoryRepository and create specialized CustomerRepository
// Add custom methods like GetByEmailAsync, GetByNameAsync



// ===== VALIDATION PATTERNS - COPY FOR CONSISTENT VALIDATION =====
public static class ValidationHelper
{
    // Copy this validation pattern for other string validations
    public static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return false;

        var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        return System.Text.RegularExpressions.Regex.IsMatch(email, emailPattern);
    }

    // TODO: Copy IsValidEmail and create IsValidPhoneNumber method


    // Copy this pattern for string length validation
    public static bool IsValidLength(string value, int minLength, int maxLength)
    {
        if (string.IsNullOrEmpty(value))
            return false;

        return value.Length >= minLength && value.Length <= maxLength;
    }

    // TODO: Copy IsValidLength and create IsValidAge method for int values


    // Copy this pattern for required field validation
    public static bool IsRequired(string value)
    {
        return !string.IsNullOrWhiteSpace(value);
    }

    // TODO: Copy IsRequired and create IsRequiredGuid method

}

// ===== ERROR HANDLING PATTERNS - COPY FOR CONSISTENT ERROR RESPONSES =====
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? ErrorMessage { get; set; }
    public List<string> ValidationErrors { get; set; } = new();

    public static ApiResponse<T> SuccessResult(T data)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data
        };
    }

    public static ApiResponse<T> ErrorResult(string errorMessage)
    {
        return new ApiResponse<T>
        {
            Success = false,
            ErrorMessage = errorMessage
        };
    }

    public static ApiResponse<T> ValidationErrorResult(List<string> validationErrors)
    {
        return new ApiResponse<T>
        {
            Success = false,
            ValidationErrors = validationErrors
        };
    }
}

// TODO: Copy ApiResponse and create PagedResponse<T> for pagination
// Include properties: Items, TotalCount, PageNumber, PageSize



// ===== CONTROLLER PATTERN TEMPLATE - COPY FOR OTHER CONTROLLERS =====
public class BaseController<T, TService> where T : class where TService : class
{
    protected readonly TService _service;

    public BaseController(TService service)
    {
        _service = service ?? throw new ArgumentNullException(nameof(service));
    }

    // Copy this action pattern for other endpoints
    protected async Task<ApiResponse<T>> HandleCreateAsync<TRequest>(
        TRequest request,
        Func<TRequest, Task<T>> createFunc,
        Func<TRequest, List<string>>? validateFunc = null)
    {
        try
        {
            if (validateFunc != null)
            {
                var validationErrors = validateFunc(request);
                if (validationErrors.Any())
                {
                    return ApiResponse<T>.ValidationErrorResult(validationErrors);
                }
            }

            var result = await createFunc(request);
            return ApiResponse<T>.SuccessResult(result);
        }
        catch (Exception ex)
        {
            return ApiResponse<T>.ErrorResult(ex.Message);
        }
    }

    // TODO: Copy HandleCreateAsync and create HandleUpdateAsync method


    // Copy this pattern for GET operations
    protected async Task<ApiResponse<T>> HandleGetAsync(
        Func<Task<T?>> getFunc,
        string notFoundMessage = "Entity not found")
    {
        try
        {
            var result = await getFunc();
            if (result == null)
            {
                return ApiResponse<T>.ErrorResult(notFoundMessage);
            }

            return ApiResponse<T>.SuccessResult(result);
        }
        catch (Exception ex)
        {
            return ApiResponse<T>.ErrorResult(ex.Message);
        }
    }

    // TODO: Copy HandleGetAsync and create HandleDeleteAsync method

}

// ===== DATA TRANSFER OBJECT PATTERNS - COPY FOR CONSISTENT DTOs =====
public class CreateCustomerRequest
{
    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 2)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Phone]
    public string? PhoneNumber { get; set; }
}

// TODO: Copy CreateCustomerRequest and create UpdateCustomerRequest
// Include additional Id property for updates



public class CustomerResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string FullName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; }
}

// TODO: Copy CustomerResponse and create CustomerSummaryResponse
// Include only Id, FullName, Email, IsActive properties



// ===== MAPPING EXTENSIONS - COPY FOR OTHER ENTITY MAPPINGS =====
public static class CustomerMappingExtensions
{
    // Copy this mapping pattern for other entities
    public static CustomerTemplate ToEntity(this CreateCustomerRequest request)
    {
        return new CustomerTemplate
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            // PhoneNumber = request.PhoneNumber // Uncomment when added to template
        };
    }

    // TODO: Copy ToEntity and create ToResponse method


    // Copy this pattern for update mappings
    public static void UpdateEntity(this CustomerTemplate entity, CreateCustomerRequest request)
    {
        entity.FirstName = request.FirstName;
        entity.LastName = request.LastName;
        entity.Email = request.Email;
        entity.UpdatedAt = DateTime.UtcNow;
        // entity.PhoneNumber = request.PhoneNumber; // Uncomment when added
    }

    // TODO: Copy UpdateEntity and create specific update methods for different scenarios

}

// ===== ASYNC OPERATION PATTERNS - COPY FOR CONSISTENT ASYNC HANDLING =====
public static class AsyncOperationHelper
{
    // Copy this pattern for async operations with retry logic
    public static async Task<T> ExecuteWithRetryAsync<T>(
        Func<Task<T>> operation,
        int maxRetries = 3,
        TimeSpan delay = default)
    {
        if (delay == default)
            delay = TimeSpan.FromMilliseconds(500);

        Exception? lastException = null;

        for (int i = 0; i <= maxRetries; i++)
        {
            try
            {
                return await operation();
            }
            catch (Exception ex)
            {
                lastException = ex;
                if (i < maxRetries)
                {
                    await Task.Delay(delay);
                }
            }
        }

        throw lastException ?? new InvalidOperationException("Operation failed");
    }

    // TODO: Copy ExecuteWithRetryAsync and create ExecuteWithTimeoutAsync method


    // Copy this pattern for batch operations
    public static async Task<List<TResult>> ExecuteBatchAsync<TInput, TResult>(
        IEnumerable<TInput> items,
        Func<TInput, Task<TResult>> operation,
        int batchSize = 10)
    {
        var results = new List<TResult>();
        var batches = items.Select((item, index) => new { item, index })
                          .GroupBy(x => x.index / batchSize)
                          .Select(g => g.Select(x => x.item));

        foreach (var batch in batches)
        {
            var batchTasks = batch.Select(operation);
            var batchResults = await Task.WhenAll(batchTasks);
            results.AddRange(batchResults);
        }

        return results;
    }

    // TODO: Copy ExecuteBatchAsync and create ExecuteParallelAsync method

}