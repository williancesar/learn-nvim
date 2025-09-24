/*
 * Day 04: Line Operations Practice
 *
 * Line Operation Instructions:
 * 1. Use 'dd' to delete entire lines
 * 2. Use 'yy' to yank (copy) entire lines
 * 3. Use 'o' and 'O' to create new lines
 * 4. Try '>>' and '<<' for indentation
 * 5. Use line numbers: ':50' to jump to line 50
 * 6. Practice 'J' to join lines
 * 7. Use ':1,10d' to delete ranges of lines
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.ComponentModel.DataAnnotations;

namespace NvimPractice.Day04.LineOperations;

#region Region 01: Configuration Management System

/// <summary>
/// Line 20: Configuration management system for application settings
/// Practice: Jump to this line with ':20'
/// </summary>
public class ConfigurationManager
{
    private readonly Dictionary<string, object> _settings = new();
    private readonly string _configFilePath;

    public ConfigurationManager(string configFilePath)
    {
        _configFilePath = configFilePath ?? throw new ArgumentNullException(nameof(configFilePath));
        LoadConfiguration();
    }

    // Line 32: Try 'dd' to delete this method entirely
    public void LoadConfiguration()
    {
        try
        {
            if (File.Exists(_configFilePath))
            {
                var jsonContent = File.ReadAllText(_configFilePath);
                var settings = JsonSerializer.Deserialize<Dictionary<string, object>>(jsonContent);
                if (settings != null)
                {
                    _settings.Clear();
                    foreach (var kvp in settings)
                    {
                        _settings[kvp.Key] = kvp.Value;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error loading configuration: {ex.Message}");
        }
    }

    // Line 50: Practice jumping here with ':50'
    public T GetSetting<T>(string key, T defaultValue = default!)
    {
        if (_settings.TryGetValue(key, out var value))
        {
            try
            {
                if (value is JsonElement jsonElement)
                {
                    return JsonSerializer.Deserialize<T>(jsonElement.GetRawText()) ?? defaultValue;
                }
                return (T)Convert.ChangeType(value, typeof(T));
            }
            catch
            {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    // Line 67: Use 'yy' to copy this method and paste it below
    public void SetSetting<T>(string key, T value)
    {
        _settings[key] = value ?? throw new ArgumentNullException(nameof(value));
    }

    // Line 72: Practice 'o' to create a new line after this one
    public void SaveConfiguration()
    {
        try
        {
            var json = JsonSerializer.Serialize(_settings, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_configFilePath, json);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving configuration: {ex.Message}");
        }
    }

    // Line 82: Try 'O' to create a new line before this one
    public IEnumerable<string> GetAllKeys() => _settings.Keys;

    public bool HasSetting(string key) => _settings.ContainsKey(key);

    public void RemoveSetting(string key) => _settings.Remove(key);

    public void ClearAllSettings() => _settings.Clear();
}

#endregion

#region Region 02: Data Validation Framework

// Line 93: Practice line deletion with 'dd' on these comments
// This is a comprehensive data validation framework
// It provides attribute-based validation for complex objects
// You can use it to validate user input, API requests, and more
// Practice: Select these comment lines and delete them all at once

/// <summary>
/// Line 100: Custom validation attribute for email addresses
/// </summary>
public class EmailValidationAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value is string email && !string.IsNullOrWhiteSpace(email))
        {
            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (System.Text.RegularExpressions.Regex.IsMatch(email, emailPattern))
            {
                return ValidationResult.Success;
            }
        }
        return new ValidationResult($"The {validationContext.DisplayName} field is not a valid email address.");
    }
}

// Line 113: Practice '>>' to indent this class definition
public class PhoneValidationAttribute : ValidationAttribute
{
protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
{
if (value is string phone && !string.IsNullOrWhiteSpace(phone))
{
var cleanPhone = new string(phone.Where(char.IsDigit).ToArray());
if (cleanPhone.Length >= 10 && cleanPhone.Length <= 15)
{
return ValidationResult.Success;
}
}
return new ValidationResult($"The {validationContext.DisplayName} field must be a valid phone number.");
}
}

// Line 127: Use '<<' to unindent this class
        public class AgeRangeValidationAttribute : ValidationAttribute
        {
            private readonly int _minAge;
            private readonly int _maxAge;

            public AgeRangeValidationAttribute(int minAge, int maxAge)
            {
                _minAge = minAge;
                _maxAge = maxAge;
            }

            protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
            {
                if (value is DateTime birthDate)
                {
                    var age = DateTime.Today.Year - birthDate.Year;
                    if (birthDate.Date > DateTime.Today.AddYears(-age)) age--;

                    if (age >= _minAge && age <= _maxAge)
                    {
                        return ValidationResult.Success;
                    }
                }
                return new ValidationResult($"Age must be between {_minAge} and {_maxAge} years.");
            }
        }

#endregion

#region Region 03: User Profile Management

// Line 150: Practice line operations on this model class
public class UserProfile
{
    [Required(ErrorMessage = "First name is required")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailValidation(ErrorMessage = "Please provide a valid email address")]
    public string Email { get; set; } = string.Empty;

    [PhoneValidation(ErrorMessage = "Please provide a valid phone number")]
    public string? PhoneNumber { get; set; }

    [Required(ErrorMessage = "Date of birth is required")]
    [AgeRangeValidation(13, 120, ErrorMessage = "Age must be between 13 and 120 years")]
    public DateTime DateOfBirth { get; set; }

    // Line 170: Use 'J' to join this line with the next one
    public string Address { get; set; }
        = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Country { get; set; } = string.Empty;

    [StringLength(10, ErrorMessage = "Postal code cannot exceed 10 characters")]
    public string? PostalCode { get; set; }

    // Line 180: Practice line copying with 'yy'
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public bool IsActive { get; set; } = true;

    public string FullName => $"{FirstName} {LastName}";

    public int Age
    {
        get
        {
            var today = DateTime.Today;
            var age = today.Year - DateOfBirth.Year;
            if (DateOfBirth.Date > today.AddYears(-age)) age--;
            return age;
        }
    }
}

#endregion

#region Region 04: Business Logic Layer

// Line 200: Practice range deletion with ':200,220d'
public class UserProfileService
{
    private readonly List<UserProfile> _profiles = new();
    private readonly IValidator<UserProfile> _validator;

    public UserProfileService(IValidator<UserProfile> validator)
    {
        _validator = validator ?? throw new ArgumentNullException(nameof(validator));
    }

    // Line 210: Try deleting multiple methods at once
    public async Task<ValidationResult> CreateProfileAsync(UserProfile profile)
    {
        var validationResult = await _validator.ValidateAsync(profile);
        if (validationResult.IsValid)
        {
            profile.CreatedAt = DateTime.UtcNow;
            _profiles.Add(profile);
        }
        return validationResult;
    }

    // Line 220: Practice line operations on this method
    public async Task<ValidationResult> UpdateProfileAsync(string email, UserProfile updatedProfile)
    {
        var existingProfile = _profiles.FirstOrDefault(p => p.Email == email);
        if (existingProfile == null)
        {
            return new ValidationResult(new[] { new ValidationFailure("Email", "Profile not found") });
        }

        var validationResult = await _validator.ValidateAsync(updatedProfile);
        if (validationResult.IsValid)
        {
            existingProfile.FirstName = updatedProfile.FirstName;
            existingProfile.LastName = updatedProfile.LastName;
            existingProfile.PhoneNumber = updatedProfile.PhoneNumber;
            existingProfile.Address = updatedProfile.Address;
            existingProfile.City = updatedProfile.City;
            existingProfile.Country = updatedProfile.Country;
            existingProfile.PostalCode = updatedProfile.PostalCode;
            existingProfile.UpdatedAt = DateTime.UtcNow;
        }
        return validationResult;
    }

    // Line 240: Use line numbers to navigate to this method
    public UserProfile? GetProfileByEmail(string email)
    {
        return _profiles.FirstOrDefault(p => p.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
    }

    public IEnumerable<UserProfile> GetActiveProfiles()
    {
        return _profiles.Where(p => p.IsActive);
    }

    public IEnumerable<UserProfile> GetProfilesByCountry(string country)
    {
        return _profiles.Where(p => p.Country.Equals(country, StringComparison.OrdinalIgnoreCase));
    }

    // Line 253: Practice joining lines with 'J'
    public bool DeleteProfile(string email)
    {
        var profile = GetProfileByEmail(email);
        if (profile != null)
        {
            profile.IsActive = false;
            profile.UpdatedAt = DateTime.UtcNow;
            return true;
        }
        return false;
    }

    public int GetTotalActiveProfiles() => _profiles.Count(p => p.IsActive);

    public double GetAverageAge()
    {
        var activeProfiles = GetActiveProfiles().ToList();
        return activeProfiles.Any() ? activeProfiles.Average(p => p.Age) : 0;
    }
}

#endregion

#region Region 05: Validation Framework

// Line 275: Practice line operations in this interface
public interface IValidator<T>
{
    Task<ValidationResult> ValidateAsync(T instance);
    ValidationResult Validate(T instance);
}

// Line 281: Use 'o' and 'O' to add lines around this class
public class ValidationResult
{
    public bool IsValid { get; }
    public IEnumerable<ValidationFailure> Errors { get; }

    public ValidationResult()
    {
        IsValid = true;
        Errors = Enumerable.Empty<ValidationFailure>();
    }

    public ValidationResult(IEnumerable<ValidationFailure> failures)
    {
        IsValid = false;
        Errors = failures ?? throw new ArgumentNullException(nameof(failures));
    }

    public ValidationResult(ValidationFailure failure)
    {
        IsValid = false;
        Errors = new[] { failure ?? throw new ArgumentNullException(nameof(failure)) };
    }
}

// Line 302: Practice line deletion and creation here
public class ValidationFailure
{
    public string PropertyName { get; }
    public string ErrorMessage { get; }
    public object? AttemptedValue { get; }

    public ValidationFailure(string propertyName, string errorMessage, object? attemptedValue = null)
    {
        PropertyName = propertyName ?? throw new ArgumentNullException(nameof(propertyName));
        ErrorMessage = errorMessage ?? throw new ArgumentNullException(nameof(errorMessage));
        AttemptedValue = attemptedValue;
    }

    public override string ToString() => $"{PropertyName}: {ErrorMessage}";
}

#endregion

#region Region 06: Data Repository Pattern

// Line 320: Jump to this line with ':320'
public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(object id);
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(object id);
    Task<bool> ExistsAsync(object id);
}

// Line 330: Practice line operations on this implementation
public class InMemoryRepository<T> : IRepository<T> where T : class
{
    private readonly List<T> _entities = new();
    private readonly Func<T, object> _getIdFunc;

    public InMemoryRepository(Func<T, object> getIdFunc)
    {
        _getIdFunc = getIdFunc ?? throw new ArgumentNullException(nameof(getIdFunc));
    }

    public Task<IEnumerable<T>> GetAllAsync()
    {
        return Task.FromResult(_entities.AsEnumerable());
    }

    public Task<T?> GetByIdAsync(object id)
    {
        var entity = _entities.FirstOrDefault(e => _getIdFunc(e).Equals(id));
        return Task.FromResult(entity);
    }

    public Task AddAsync(T entity)
    {
        _entities.Add(entity ?? throw new ArgumentNullException(nameof(entity)));
        return Task.CompletedTask;
    }

    public Task UpdateAsync(T entity)
    {
        var id = _getIdFunc(entity);
        var index = _entities.FindIndex(e => _getIdFunc(e).Equals(id));
        if (index >= 0)
        {
            _entities[index] = entity;
        }
        return Task.CompletedTask;
    }

    public Task DeleteAsync(object id)
    {
        var entity = _entities.FirstOrDefault(e => _getIdFunc(e).Equals(id));
        if (entity != null)
        {
            _entities.Remove(entity);
        }
        return Task.CompletedTask;
    }

    public Task<bool> ExistsAsync(object id)
    {
        var exists = _entities.Any(e => _getIdFunc(e).Equals(id));
        return Task.FromResult(exists);
    }
}

#endregion

// Line 380: Final line - practice 'G' to jump here from the top