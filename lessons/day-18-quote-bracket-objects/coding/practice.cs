using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace QuoteBracketObjectsPractice
{
    /// <summary>
    /// Practice file for quote and bracket text objects:
    /// i" a" (double quotes), i' a' (single quotes), i` a` (backticks)
    /// i( a( i) a) (parentheses), i[ a[ i] a] (square brackets), i{ a{ i} a} (curly braces)
    /// i< a< i> a> (angle brackets)
    /// Focus on selecting content within quotes and brackets
    /// </summary>
    public class ConfigurationManager<T> where T : class, new()
    {
        private readonly Dictionary<string, object> _settings = new();
        private readonly List<string> _configFiles = new() { "appsettings.json", "config.xml", "settings.ini" };
        private readonly string[] _validationRules = { "required", "email", "phone", "url" };

        public ConfigurationManager()
        {
            LoadDefaultSettings();
        }

        public void SetSetting(string key, object value)
        {
            if (string.IsNullOrEmpty(key))
                throw new ArgumentException("Key cannot be null or empty", nameof(key));

            _settings[key] = value ?? throw new ArgumentNullException(nameof(value));
        }

        public TValue GetSetting<TValue>(string key, TValue defaultValue = default)
        {
            if (_settings.TryGetValue(key, out var value))
            {
                return (TValue)value;
            }
            return defaultValue;
        }

        public string GetConnectionString(string name)
        {
            var template = "Server={server};Database={database};User Id={userId};Password={password};";
            var server = GetSetting("DatabaseServer", "localhost");
            var database = GetSetting($"Database_{name}", "DefaultDB");
            var userId = GetSetting("DatabaseUser", "admin");
            var password = GetSetting("DatabasePassword", "password123");

            return template
                .Replace("{server}", server)
                .Replace("{database}", database)
                .Replace("{userId}", userId)
                .Replace("{password}", password);
        }

        public Dictionary<string, string> ParseKeyValuePairs(string input)
        {
            var result = new Dictionary<string, string>();
            var pairs = input.Split(';', StringSplitOptions.RemoveEmptyEntries);

            foreach (var pair in pairs)
            {
                var keyValue = pair.Split('=', 2);
                if (keyValue.Length == 2)
                {
                    result[keyValue[0].Trim()] = keyValue[1].Trim();
                }
            }

            return result;
        }

        public List<string> ValidateConfiguration()
        {
            var errors = new List<string>();
            var requiredKeys = new[] { "ApiKey", "DatabaseConnection", "LogLevel" };

            foreach (var key in requiredKeys)
            {
                if (!_settings.ContainsKey(key))
                {
                    errors.Add($"Missing required setting: '{key}'");
                }
            }

            return errors;
        }

        public string GenerateConfigJson()
        {
            var config = new
            {
                Application = new
                {
                    Name = GetSetting("AppName", "MyApplication"),
                    Version = GetSetting("AppVersion", "1.0.0"),
                    Environment = GetSetting("Environment", "Development")
                },
                Database = new
                {
                    ConnectionString = GetConnectionString("Primary"),
                    CommandTimeout = GetSetting("CommandTimeout", 30),
                    EnableRetryLogic = GetSetting("EnableRetryLogic", true)
                },
                Logging = new
                {
                    LogLevel = GetSetting("LogLevel", "Information"),
                    LogPath = GetSetting("LogPath", "/var/logs/app.log"),
                    MaxFileSize = GetSetting("MaxFileSize", "10MB")
                },
                Features = new
                {
                    EnableCache = GetSetting("EnableCache", true),
                    CacheExpiration = GetSetting("CacheExpiration", "00:30:00"),
                    EnableMetrics = GetSetting("EnableMetrics", false)
                }
            };

            var options = new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            return JsonSerializer.Serialize(config, options);
        }

        public void LoadFromJsonString(string jsonContent)
        {
            if (string.IsNullOrWhiteSpace(jsonContent))
                throw new ArgumentException("JSON content cannot be null or empty");

            try
            {
                var document = JsonDocument.Parse(jsonContent);
                ProcessJsonElement(document.RootElement, "");
            }
            catch (JsonException ex)
            {
                throw new InvalidOperationException($"Invalid JSON format: {ex.Message}", ex);
            }
        }

        private void ProcessJsonElement(JsonElement element, string prefix)
        {
            switch (element.ValueKind)
            {
                case JsonValueKind.Object:
                    foreach (var property in element.EnumerateObject())
                    {
                        var key = string.IsNullOrEmpty(prefix) ? property.Name : $"{prefix}:{property.Name}";
                        ProcessJsonElement(property.Value, key);
                    }
                    break;

                case JsonValueKind.Array:
                    var array = element.EnumerateArray().ToArray();
                    _settings[prefix] = array.Select(e => e.ToString()).ToArray();
                    break;

                case JsonValueKind.String:
                    _settings[prefix] = element.GetString() ?? string.Empty;
                    break;

                case JsonValueKind.Number:
                    _settings[prefix] = element.GetDecimal();
                    break;

                case JsonValueKind.True:
                case JsonValueKind.False:
                    _settings[prefix] = element.GetBoolean();
                    break;

                case JsonValueKind.Null:
                    _settings[prefix] = null;
                    break;
            }
        }

        public string FormatDisplayText(string template, Dictionary<string, object> values)
        {
            var pattern = @"\{(\w+)\}";
            return Regex.Replace(template, pattern, match =>
            {
                var key = match.Groups[1].Value;
                if (values.TryGetValue(key, out var value))
                {
                    return value?.ToString() ?? string.Empty;
                }
                return match.Value;
            });
        }

        public void ExecuteScript(string script)
        {
            var commands = script.Split('\n', StringSplitOptions.RemoveEmptyEntries);

            foreach (var command in commands)
            {
                var trimmedCommand = command.Trim();
                if (trimmedCommand.StartsWith("//") || trimmedCommand.StartsWith("#"))
                    continue;

                if (trimmedCommand.StartsWith("SET "))
                {
                    var parts = trimmedCommand.Substring(4).Split('=', 2);
                    if (parts.Length == 2)
                    {
                        var key = parts[0].Trim();
                        var value = parts[1].Trim().Trim('"', '\'');
                        SetSetting(key, value);
                    }
                }
                else if (trimmedCommand.StartsWith("GET "))
                {
                    var key = trimmedCommand.Substring(4).Trim();
                    var value = GetSetting<object>(key);
                    Console.WriteLine($"{key} = {value}");
                }
            }
        }

        public List<ValidationError> ValidateEmailSettings()
        {
            var errors = new List<ValidationError>();
            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

            var emailFields = new[]
            {
                ("SenderEmail", GetSetting<string>("SenderEmail")),
                ("AdminEmail", GetSetting<string>("AdminEmail")),
                ("SupportEmail", GetSetting<string>("SupportEmail"))
            };

            foreach (var (fieldName, emailValue) in emailFields)
            {
                if (string.IsNullOrEmpty(emailValue))
                {
                    errors.Add(new ValidationError(fieldName, "Email address is required"));
                }
                else if (!Regex.IsMatch(emailValue, emailPattern))
                {
                    errors.Add(new ValidationError(fieldName, $"Invalid email format: '{emailValue}'"));
                }
            }

            return errors;
        }

        public Dictionary<string, object> GetSettingsSnapshot()
        {
            return new Dictionary<string, object>(_settings);
        }

        private void LoadDefaultSettings()
        {
            _settings["AppName"] = "ConfigurationManager";
            _settings["Version"] = "1.0.0";
            _settings["Environment"] = "Development";
            _settings["ApiTimeout"] = TimeSpan.FromSeconds(30);
            _settings["MaxRetries"] = 3;
            _settings["EnableLogging"] = true;
            _settings["LogLevel"] = "Information";
            _settings["DatabaseProvider"] = "SqlServer";
            _settings["ConnectionString"] = "Server=localhost;Database=TestDB;Integrated Security=true;";
            _settings["CacheSettings"] = new { Enabled = true, Duration = "00:15:00", MaxSize = "100MB" };
            _settings["FeatureFlags"] = new[] { "EnableNewUI", "EnableAdvancedSearch", "EnableReports" };
            _settings["SupportedFormats"] = new[] { "json", "xml", "yaml", "ini" };
            _settings["ValidationRules"] = _validationRules;
        }
    }

    public class ValidationError
    {
        public ValidationError(string field, string message)
        {
            Field = field ?? throw new ArgumentNullException(nameof(field));
            Message = message ?? throw new ArgumentNullException(nameof(message));
        }

        public string Field { get; }
        public string Message { get; }

        public override string ToString() => $"{Field}: {Message}";
    }

    public static class StringExtensions
    {
        public static string RemoveQuotes(this string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            if ((input.StartsWith('"') && input.EndsWith('"')) ||
                (input.StartsWith('\'') && input.EndsWith('\'')))
            {
                return input.Substring(1, input.Length - 2);
            }

            return input;
        }

        public static string WrapInQuotes(this string input, char quoteChar = '"')
        {
            return $"{quoteChar}{input}{quoteChar}";
        }

        public static string[] SplitQuoted(this string input, char delimiter = ',')
        {
            var result = new List<string>();
            var current = new System.Text.StringBuilder();
            var inQuotes = false;
            var quoteChar = '\0';

            for (int i = 0; i < input.Length; i++)
            {
                var ch = input[i];

                if (!inQuotes && (ch == '"' || ch == '\''))
                {
                    inQuotes = true;
                    quoteChar = ch;
                    current.Append(ch);
                }
                else if (inQuotes && ch == quoteChar)
                {
                    inQuotes = false;
                    current.Append(ch);
                }
                else if (!inQuotes && ch == delimiter)
                {
                    result.Add(current.ToString().Trim());
                    current.Clear();
                }
                else
                {
                    current.Append(ch);
                }
            }

            if (current.Length > 0)
            {
                result.Add(current.ToString().Trim());
            }

            return result.ToArray();
        }

        public static Dictionary<string, string> ParseAttributes(this string input)
        {
            var attributes = new Dictionary<string, string>();
            var pattern = @"(\w+)=(""[^""]*""|'[^']*'|\S+)";
            var matches = Regex.Matches(input, pattern);

            foreach (Match match in matches)
            {
                var name = match.Groups[1].Value;
                var value = match.Groups[2].Value.RemoveQuotes();
                attributes[name] = value;
            }

            return attributes;
        }
    }

    public class JsonConfigProcessor
    {
        public static T ProcessConfig<T>(string jsonContent) where T : new()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                AllowTrailingCommas = true,
                ReadCommentHandling = JsonCommentHandling.Skip
            };

            return JsonSerializer.Deserialize<T>(jsonContent, options) ?? new T();
        }

        public static Dictionary<string, object> FlattenJson(string jsonContent)
        {
            var result = new Dictionary<string, object>();
            var document = JsonDocument.Parse(jsonContent);
            FlattenJsonElement(document.RootElement, "", result);
            return result;
        }

        private static void FlattenJsonElement(JsonElement element, string prefix, Dictionary<string, object> result)
        {
            switch (element.ValueKind)
            {
                case JsonValueKind.Object:
                    foreach (var property in element.EnumerateObject())
                    {
                        var key = string.IsNullOrEmpty(prefix) ? property.Name : $"{prefix}.{property.Name}";
                        FlattenJsonElement(property.Value, key, result);
                    }
                    break;

                case JsonValueKind.Array:
                    var index = 0;
                    foreach (var item in element.EnumerateArray())
                    {
                        var key = $"{prefix}[{index}]";
                        FlattenJsonElement(item, key, result);
                        index++;
                    }
                    break;

                default:
                    result[prefix] = element.ValueKind switch
                    {
                        JsonValueKind.String => element.GetString(),
                        JsonValueKind.Number => element.GetDecimal(),
                        JsonValueKind.True => true,
                        JsonValueKind.False => false,
                        JsonValueKind.Null => null,
                        _ => element.ToString()
                    };
                    break;
            }
        }
    }
}