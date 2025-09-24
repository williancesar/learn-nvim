using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace VimPractice.CharacterSearch;

// Practice file for Day 09: Character Search with f/F/t/T
// This file contains many symbols and characters to practice finding with f/F/t/T

/// <summary>
/// Advanced configuration manager with complex symbol patterns
/// Practice finding: (, ), {, }, [, ], <, >, ", ', ;, :, =, +, -, *, /, \, |, &, %, $, #, @, !
/// </summary>
public class ConfigurationManager<TSettings> where TSettings : class, new()
{
    private readonly ILogger<ConfigurationManager<TSettings>> _logger;
    private readonly Dictionary<string, object> _cache = new();
    private readonly List<IConfigurationProvider> _providers = new();
    private readonly object _lockObject = new();
    private TSettings? _settings;

    // Practice targets: parentheses (), brackets [], braces {}, angle brackets <>
    public ConfigurationManager(
        ILogger<ConfigurationManager<TSettings>> logger,
        IConfiguration configuration,
        IEnumerable<IConfigurationProvider> providers = null!)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));

        // Practice finding colons, semicolons, and equal signs
        var defaultProviders = new IConfigurationProvider[]
        {
            new JsonConfigurationProvider("appsettings.json"),
            new EnvironmentVariableProvider("APP_"),
            new CommandLineProvider(),
            new AzureKeyVaultProvider($"https://{Environment.GetEnvironmentVariable("VAULT_NAME")}.vault.azure.net/")
        };

        _providers.AddRange(providers ?? defaultProviders);
        InitializeAsync().ConfigureAwait(false);
    }

    // Practice finding quotes (single and double), commas, periods
    public async Task<T> GetValueAsync<T>(string key, T defaultValue = default(T)!) where T : class
    {
        ArgumentException.ThrowIfNullOrEmpty(key, nameof(key));

        try
        {
            lock (_lockObject)
            {
                if (_cache.TryGetValue($"cache:{key}", out var cachedValue))
                {
                    _logger.LogDebug("Retrieved '{Key}' from cache: {Value}", key, cachedValue);
                    return (T)cachedValue;
                }
            }

            // Practice finding operators: +, -, *, /, %, &, |, ^, ~, <<, >>
            var configValue = await ResolveValueAsync(key);
            var result = ConvertValue<T>(configValue) ?? defaultValue;

            // Practice finding comparison operators: ==, !=, <, >, <=, >=
            if (result != null && !ReferenceEquals(result, defaultValue))
            {
                lock (_lockObject)
                {
                    _cache[$"cache:{key}"] = result;
                }
            }

            return result;
        }
        catch (Exception ex) when (ex is not ArgumentException)
        {
            _logger.LogError(ex, "Failed to get configuration value for key '{Key}'", key);
            return defaultValue;
        }
    }

    // Practice finding special characters: @, #, $, %, ^, &, *, !, ~, `
    private async Task<string?> ResolveValueAsync(string key)
    {
        var tasks = _providers.Select(async provider =>
        {
            try
            {
                var value = await provider.GetValueAsync($"config::{key}");
                _logger.LogTrace("Provider {ProviderType} returned: '{Value}' for key '{Key}'",
                    provider.GetType().Name, value, key);
                return (Provider: provider, Value: value);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Provider {ProviderType} failed for key '{Key}'",
                    provider.GetType().Name, key);
                return (Provider: provider, Value: (string?)null);
            }
        });

        var results = await Task.WhenAll(tasks);

        // Practice finding logical operators: &&, ||, !, ?:
        return results
            .Where(r => !string.IsNullOrEmpty(r.Value))
            .OrderByDescending(r => r.Provider.Priority)
            .FirstOrDefault().Value;
    }

    // Practice finding mathematical symbols and operators
    private static T? ConvertValue<T>(string? value) where T : class
    {
        if (string.IsNullOrEmpty(value)) return null;

        var targetType = typeof(T);

        // Practice finding switch expressions with =>
        return targetType.Name switch
        {
            nameof(String) => value as T,
            nameof(Int32) => int.TryParse(value, out var intVal) ? (T)(object)intVal : null,
            nameof(Int64) => long.TryParse(value, out var longVal) ? (T)(object)longVal : null,
            nameof(Decimal) => decimal.TryParse(value, out var decVal) ? (T)(object)decVal : null,
            nameof(Double) => double.TryParse(value, out var dblVal) ? (T)(object)dblVal : null,
            nameof(Boolean) => bool.TryParse(value, out var boolVal) ? (T)(object)boolVal : null,
            nameof(DateTime) => DateTime.TryParse(value, out var dateVal) ? (T)(object)dateVal : null,
            nameof(Guid) => Guid.TryParse(value, out var guidVal) ? (T)(object)guidVal : null,
            _ => JsonSerializer.Deserialize<T>(value, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
            })
        };
    }

    // Practice finding array/collection syntax: [], {}, <>
    public async Task<Dictionary<string, TValue>> GetSectionAsync<TValue>(string sectionKey)
        where TValue : class
    {
        var section = new Dictionary<string, TValue>();
        var prefix = $"{sectionKey}:";

        foreach (var provider in _providers.OrderByDescending(p => p.Priority))
        {
            try
            {
                var keys = await provider.GetKeysAsync(prefix);

                foreach (var key in keys)
                {
                    var fullKey = $"{prefix}{key}";
                    var value = await GetValueAsync<TValue>(fullKey);

                    if (value != null)
                    {
                        section[key] = value;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load section '{Section}' from provider {Provider}",
                    sectionKey, provider.GetType().Name);
            }
        }

        return section;
    }

    // Practice finding regex-like patterns and escape sequences
    public async Task<bool> ValidateConfigurationAsync(
        Func<TSettings, ValidationResult> validator,
        string[]? requiredKeys = null,
        Dictionary<string, string>? patterns = null)
    {
        _settings ??= await GetValueAsync<TSettings>("Settings") ?? new TSettings();

        // Validate required keys with complex path syntax
        if (requiredKeys != null)
        {
            foreach (var key in requiredKeys)
            {
                var value = await GetValueAsync<string>($"Required::{key}");
                if (string.IsNullOrEmpty(value))
                {
                    _logger.LogError("Required configuration key '{Key}' is missing or empty", key);
                    return false;
                }
            }
        }

        // Validate patterns with regex-like syntax
        if (patterns != null)
        {
            foreach (var (key, pattern) in patterns)
            {
                var value = await GetValueAsync<string>($"Validation::{key}");
                if (!string.IsNullOrEmpty(value) && !System.Text.RegularExpressions.Regex.IsMatch(value, pattern))
                {
                    _logger.LogError("Configuration value '{Key}' = '{Value}' doesn't match pattern '{Pattern}'",
                        key, value, pattern);
                    return false;
                }
            }
        }

        // Custom validation with lambda expressions
        var result = validator(_settings);
        if (!result.IsValid)
        {
            _logger.LogError("Configuration validation failed: {Errors}",
                string.Join("; ", result.Errors));
            return false;
        }

        return true;
    }

    // Practice finding complex method signatures with multiple generic constraints
    public async Task<ConfigurationSnapshot<T1, T2, T3>> CreateSnapshotAsync<T1, T2, T3>(
        Expression<Func<TSettings, T1>> selector1,
        Expression<Func<TSettings, T2>> selector2,
        Expression<Func<TSettings, T3>> selector3)
        where T1 : class, IComparable<T1>
        where T2 : struct, IFormattable
        where T3 : IEnumerable<string>, new()
    {
        _settings ??= await GetValueAsync<TSettings>("Settings") ?? new TSettings();

        var compiled1 = selector1.Compile();
        var compiled2 = selector2.Compile();
        var compiled3 = selector3.Compile();

        return new ConfigurationSnapshot<T1, T2, T3>
        {
            Timestamp = DateTimeOffset.UtcNow,
            Value1 = compiled1(_settings),
            Value2 = compiled2(_settings),
            Value3 = compiled3(_settings),
            Metadata = new Dictionary<string, object>
            {
                ["Source"] = GetType().Assembly.GetName().Name!,
                ["Version"] = GetType().Assembly.GetName().Version!.ToString(),
                ["Environment"] = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
                ["MachineName"] = Environment.MachineName,
                ["ProcessId"] = Environment.ProcessId,
                ["ThreadId"] = Environment.CurrentManagedThreadId
            }
        };
    }
}

// Practice finding interface declarations and inheritance symbols
public interface IConfigurationProvider : IDisposable
{
    int Priority { get; }
    Task<string?> GetValueAsync(string key);
    Task<IEnumerable<string>> GetKeysAsync(string prefix = "");
    event EventHandler<ConfigurationChangedEventArgs>? ConfigurationChanged;
}

// Practice finding record syntax with various symbols
public record ConfigurationSnapshot<T1, T2, T3>(
    DateTimeOffset Timestamp,
    T1 Value1,
    T2 Value2,
    T3 Value3)
{
    public Dictionary<string, object> Metadata { get; init; } = new();

    // Practice finding operators in operator overloading
    public static bool operator ==(ConfigurationSnapshot<T1, T2, T3>? left, ConfigurationSnapshot<T1, T2, T3>? right)
        => ReferenceEquals(left, right) || (left is not null && right is not null && left.Equals(right));

    public static bool operator !=(ConfigurationSnapshot<T1, T2, T3>? left, ConfigurationSnapshot<T1, T2, T3>? right)
        => !(left == right);
}

// Practice finding complex attribute syntax with multiple parameters
[Serializable]
[System.ComponentModel.DataAnnotations.Display(Name = "Validation Result", Description = "Result of configuration validation")]
public class ValidationResult
{
    public bool IsValid { get; init; }
    public List<string> Errors { get; init; } = new();
    public Dictionary<string, object> Context { get; init; } = new();

    // Practice finding null-conditional operators and null-coalescing
    public string ErrorsAsString => Errors?.Count > 0 ? string.Join(Environment.NewLine, Errors) : string.Empty;
    public int ErrorCount => Errors?.Count ?? 0;

    // Practice finding range operators and indices
    public IEnumerable<string> GetTopErrors(int count = 5) => Errors.Take(count);
    public string[] GetErrorsArray() => Errors.ToArray()[..Math.Min(Errors.Count, 10)];
}

// Practice Instructions for f/F/t/T:
// f{char} - Find next occurrence of character (forward)
// F{char} - Find previous occurrence of character (backward)
// t{char} - Find next occurrence, cursor before character (forward)
// T{char} - Find previous occurrence, cursor after character (backward)
// ; - Repeat last find in same direction
// , - Repeat last find in opposite direction
//
// Practice targets in this file:
// Parentheses: ( )  |  Brackets: [ ]  |  Braces: { }  |  Angle brackets: < >
// Quotes: " '  |  Operators: = + - * / % & | ^ ~ ! < > <= >= == != && ||
// Special chars: @ # $ % ^ & * ! ~ ` ? : ; , .
// Mathematical: + - * / % ^ ** ++ -- += -= *= /= %= &= |= ^= <<= >>=