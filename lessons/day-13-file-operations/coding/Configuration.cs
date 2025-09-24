using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using VimPractice.FileOperations.Models;
using VimPractice.FileOperations.Repositories;
using VimPractice.FileOperations.Services;

namespace VimPractice.FileOperations.Configuration;

// Configuration.cs - Dependency injection and service configuration
// Practice: Open this file from practice.cs using :tabnew Configuration.cs
// Navigate between configuration sections using search patterns

/// <summary>
/// Service collection extensions for dependency injection setup
/// Practice: Use gd to jump to method definitions, * to find all usages
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Configure all application services
    /// Practice: Navigate through this method using j/k and f{/f}
    /// </summary>
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database configuration
        services.AddDatabaseServices(configuration);

        // Repository services
        services.AddRepositoryServices();

        // Business logic services
        services.AddBusinessServices();

        // Background services
        services.AddBackgroundServices();

        // External services
        services.AddExternalServices(configuration);

        // Caching services
        services.AddCachingServices(configuration);

        // Logging configuration
        services.AddLoggingServices(configuration);

        return services;
    }

    /// <summary>
    /// Configure database services
    /// Practice: Use ]] to navigate to next method, [[ for previous
    /// </summary>
    public static IServiceCollection AddDatabaseServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Get connection string from configuration
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found");

        // Configure Entity Framework
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(10),
                    errorNumbersToAdd: null);

                sqlOptions.CommandTimeout(30);
                sqlOptions.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName);
            });

            // Enable sensitive data logging in development
            if (configuration.GetValue<bool>("Logging:EnableSensitiveDataLogging"))
            {
                options.EnableSensitiveDataLogging();
            }

            // Enable detailed errors in development
            if (configuration.GetValue<bool>("Logging:EnableDetailedErrors"))
            {
                options.EnableDetailedErrors();
            }
        });

        // Configure database health checks
        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>("database");

        return services;
    }

    /// <summary>
    /// Configure repository services
    /// Practice: Use f( and f) to navigate between parentheses
    /// </summary>
    public static IServiceCollection AddRepositoryServices(this IServiceCollection services)
    {
        // Register repositories with scoped lifetime
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();

        // Register additional repositories
        services.AddScoped<IRepository<Address>, Repository<Address>>();
        services.AddScoped<IRepository<ShoppingCart>, Repository<ShoppingCart>>();
        services.AddScoped<IRepository<CartItem>, Repository<CartItem>>();
        services.AddScoped<IRepository<ProductImage>, Repository<ProductImage>>();
        services.AddScoped<IRepository<ProductReview>, Repository<ProductReview>>();
        services.AddScoped<IRepository<Payment>, Repository<Payment>>();

        return services;
    }

    /// <summary>
    /// Configure business logic services
    /// Practice: Use % to jump between matching brackets
    /// </summary>
    public static IServiceCollection AddBusinessServices(this IServiceCollection services)
    {
        // Core business services
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IOrderService, OrderService>();

        // Shopping and cart services
        services.AddScoped<IShoppingCartService, ShoppingCartService>();
        services.AddScoped<IInventoryService, InventoryService>();

        // Payment and financial services
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<IPricingService, PricingService>();
        services.AddScoped<ITaxCalculationService, TaxCalculationService>();

        // Recommendation and analytics
        services.AddScoped<IRecommendationService, RecommendationService>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();
        services.AddScoped<IReportingService, ReportingService>();

        // Communication services
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ISmsService, SmsService>();

        // Security and validation
        services.AddScoped<ISecurityService, SecurityService>();
        services.AddScoped<IValidationService, ValidationService>();
        services.AddScoped<IAuditService, AuditService>();

        return services;
    }

    /// <summary>
    /// Configure background services
    /// Practice: Use w/b to move by words, e/ge to move to end of words
    /// </summary>
    public static IServiceCollection AddBackgroundServices(this IServiceCollection services)
    {
        // Background task services
        services.AddHostedService<InventoryUpdateService>();
        services.AddHostedService<OrderProcessingService>();
        services.AddHostedService<NotificationDispatchService>();
        services.AddHostedService<AnalyticsAggregationService>();
        services.AddHostedService<DataCleanupService>();

        // Scheduled task services
        services.AddHostedService<DailyReportGenerationService>();
        services.AddHostedService<WeeklyAnalyticsService>();
        services.AddHostedService<MonthlyMaintenanceService>();

        // Message queue services
        services.AddHostedService<MessageQueueProcessorService>();
        services.AddHostedService<EventProcessingService>();

        return services;
    }

    /// <summary>
    /// Configure external services and integrations
    /// Practice: Use H/M/L to move to top/middle/bottom of viewport
    /// </summary>
    public static IServiceCollection AddExternalServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Payment gateway integrations
        services.Configure<PaymentGatewayOptions>(
            configuration.GetSection("PaymentGateways"));

        services.AddHttpClient<IPaymentGatewayService, StripePaymentService>(client =>
        {
            client.BaseAddress = new Uri(configuration["PaymentGateways:Stripe:BaseUrl"]!);
            client.Timeout = TimeSpan.FromSeconds(30);
        });

        services.AddHttpClient<IPaymentGatewayService, PayPalPaymentService>(client =>
        {
            client.BaseAddress = new Uri(configuration["PaymentGateways:PayPal:BaseUrl"]!);
            client.Timeout = TimeSpan.FromSeconds(30);
        });

        // Shipping service integrations
        services.Configure<ShippingOptions>(
            configuration.GetSection("Shipping"));

        services.AddHttpClient<IShippingService, FedExShippingService>(client =>
        {
            client.BaseAddress = new Uri(configuration["Shipping:FedEx:BaseUrl"]!);
            client.Timeout = TimeSpan.FromSeconds(45);
        });

        services.AddHttpClient<IShippingService, UpsShippingService>(client =>
        {
            client.BaseAddress = new Uri(configuration["Shipping:UPS:BaseUrl"]!);
            client.Timeout = TimeSpan.FromSeconds(45);
        });

        // Email service integration
        services.Configure<EmailOptions>(
            configuration.GetSection("Email"));

        services.AddHttpClient<IEmailService, SendGridEmailService>(client =>
        {
            client.BaseAddress = new Uri(configuration["Email:SendGrid:BaseUrl"]!);
            client.Timeout = TimeSpan.FromSeconds(30);
        });

        // SMS service integration
        services.Configure<SmsOptions>(
            configuration.GetSection("SMS"));

        services.AddHttpClient<ISmsService, TwilioSmsService>(client =>
        {
            client.BaseAddress = new Uri(configuration["SMS:Twilio:BaseUrl"]!);
            client.Timeout = TimeSpan.FromSeconds(30);
        });

        // Search service integration
        services.Configure<SearchOptions>(
            configuration.GetSection("Search"));

        services.AddHttpClient<ISearchService, ElasticsearchService>(client =>
        {
            client.BaseAddress = new Uri(configuration["Search:Elasticsearch:BaseUrl"]!);
            client.Timeout = TimeSpan.FromSeconds(30);
        });

        // File storage service
        services.Configure<FileStorageOptions>(
            configuration.GetSection("FileStorage"));

        services.AddScoped<IFileStorageService, AzureBlobStorageService>();
        services.AddScoped<IImageProcessingService, ImageSharpProcessingService>();

        return services;
    }

    /// <summary>
    /// Configure caching services
    /// Practice: Use Ctrl-f/Ctrl-b for page navigation
    /// </summary>
    public static IServiceCollection AddCachingServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Memory caching
        services.AddMemoryCache(options =>
        {
            options.SizeLimit = configuration.GetValue<long>("Caching:Memory:SizeLimit", 1000);
            options.CompactionPercentage = configuration.GetValue<double>("Caching:Memory:CompactionPercentage", 0.25);
        });

        // Distributed caching with Redis
        var redisConnectionString = configuration.GetConnectionString("Redis");
        if (!string.IsNullOrEmpty(redisConnectionString))
        {
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConnectionString;
                options.InstanceName = configuration["Caching:Redis:InstanceName"] ?? "ECommerceApp";
            });

            // Register Redis-based services
            services.AddScoped<IDistributedCacheService, RedisCacheService>();
            services.AddScoped<ISessionService, RedisSessionService>();
        }
        else
        {
            // Fallback to in-memory distributed cache
            services.AddDistributedMemoryCache();
            services.AddScoped<IDistributedCacheService, MemoryCacheService>();
            services.AddScoped<ISessionService, MemorySessionService>();
        }

        // Cache-aside pattern implementations
        services.AddScoped<ICachedProductService, CachedProductService>();
        services.AddScoped<ICachedCustomerService, CachedCustomerService>();
        services.AddScoped<ICachedCategoryService, CachedCategoryService>();

        return services;
    }

    /// <summary>
    /// Configure logging services
    /// Practice: Use /pattern to search for specific configuration patterns
    /// </summary>
    public static IServiceCollection AddLoggingServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddLogging(builder =>
        {
            builder.ClearProviders();

            // Console logging
            if (configuration.GetValue<bool>("Logging:Console:Enabled", true))
            {
                builder.AddConsole(options =>
                {
                    options.IncludeScopes = configuration.GetValue<bool>("Logging:Console:IncludeScopes", false);
                    options.TimestampFormat = configuration["Logging:Console:TimestampFormat"] ?? "yyyy-MM-dd HH:mm:ss ";
                });
            }

            // Debug logging
            if (configuration.GetValue<bool>("Logging:Debug:Enabled", false))
            {
                builder.AddDebug();
            }

            // File logging (using Serilog or similar)
            if (configuration.GetValue<bool>("Logging:File:Enabled", false))
            {
                // Configure file logging provider
                var logPath = configuration["Logging:File:Path"] ?? "logs/app-.log";
                var maxFileSize = configuration.GetValue<long>("Logging:File:MaxFileSize", 10 * 1024 * 1024); // 10MB
                var maxFiles = configuration.GetValue<int>("Logging:File:MaxFiles", 10);

                // Implementation would depend on chosen file logging provider
            }

            // Application Insights logging (Azure)
            if (configuration.GetValue<bool>("Logging:ApplicationInsights:Enabled", false))
            {
                var instrumentationKey = configuration["Logging:ApplicationInsights:InstrumentationKey"];
                if (!string.IsNullOrEmpty(instrumentationKey))
                {
                    services.AddApplicationInsightsTelemetry(instrumentationKey);
                    builder.AddApplicationInsights();
                }
            }

            // Set minimum log levels
            builder.SetMinimumLevel(GetLogLevel(configuration["Logging:LogLevel:Default"] ?? "Information"));

            // Configure specific category log levels
            foreach (var categoryConfig in configuration.GetSection("Logging:LogLevel").GetChildren())
            {
                if (categoryConfig.Key != "Default")
                {
                    builder.AddFilter(categoryConfig.Key, GetLogLevel(categoryConfig.Value ?? "Information"));
                }
            }
        });

        // Custom logging services
        services.AddScoped<IAuditLogger, DatabaseAuditLogger>();
        services.AddScoped<IPerformanceLogger, PerformanceLogger>();
        services.AddScoped<ISecurityLogger, SecurityLogger>();

        return services;
    }

    /// <summary>
    /// Helper method to parse log level from configuration
    /// Practice: Use gg to go to top, G to go to bottom
    /// </summary>
    private static LogLevel GetLogLevel(string logLevelString)
    {
        return logLevelString.ToLowerInvariant() switch
        {
            "trace" => LogLevel.Trace,
            "debug" => LogLevel.Debug,
            "information" => LogLevel.Information,
            "warning" => LogLevel.Warning,
            "error" => LogLevel.Error,
            "critical" => LogLevel.Critical,
            "none" => LogLevel.None,
            _ => LogLevel.Information
        };
    }
}

/// <summary>
/// Configuration options classes
/// Practice: Use :number to jump to specific line numbers
/// </summary>
public class PaymentGatewayOptions
{
    public StripeOptions Stripe { get; set; } = new();
    public PayPalOptions PayPal { get; set; } = new();

    public class StripeOptions
    {
        public string BaseUrl { get; set; } = string.Empty;
        public string PublishableKey { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
        public string WebhookSecret { get; set; } = string.Empty;
    }

    public class PayPalOptions
    {
        public string BaseUrl { get; set; } = string.Empty;
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string Mode { get; set; } = "sandbox"; // sandbox or live
    }
}

public class ShippingOptions
{
    public FedExOptions FedEx { get; set; } = new();
    public UpsOptions UPS { get; set; } = new();

    public class FedExOptions
    {
        public string BaseUrl { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string MeterNumber { get; set; } = string.Empty;
    }

    public class UpsOptions
    {
        public string BaseUrl { get; set; } = string.Empty;
        public string AccessKey { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
    }
}

public class EmailOptions
{
    public SendGridOptions SendGrid { get; set; } = new();

    public class SendGridOptions
    {
        public string BaseUrl { get; set; } = "https://api.sendgrid.com";
        public string ApiKey { get; set; } = string.Empty;
        public string FromEmail { get; set; } = string.Empty;
        public string FromName { get; set; } = string.Empty;
    }
}

public class SmsOptions
{
    public TwilioOptions Twilio { get; set; } = new();

    public class TwilioOptions
    {
        public string BaseUrl { get; set; } = "https://api.twilio.com";
        public string AccountSid { get; set; } = string.Empty;
        public string AuthToken { get; set; } = string.Empty;
        public string FromPhoneNumber { get; set; } = string.Empty;
    }
}

public class SearchOptions
{
    public ElasticsearchOptions Elasticsearch { get; set; } = new();

    public class ElasticsearchOptions
    {
        public string BaseUrl { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string IndexPrefix { get; set; } = "ecommerce";
    }
}

public class FileStorageOptions
{
    public AzureBlobOptions AzureBlob { get; set; } = new();

    public class AzureBlobOptions
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string ContainerName { get; set; } = "uploads";
        public string BaseUrl { get; set; } = string.Empty;
    }
}

/// <summary>
/// Application configuration builder
/// Practice: Use * to find all occurrences of Configuration
/// </summary>
public static class ConfigurationBuilder
{
    public static IConfiguration BuildConfiguration(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

        var configBuilder = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables()
            .AddCommandLine(args);

        // Add Azure Key Vault in production
        if (environment == "Production")
        {
            var config = configBuilder.Build();
            var keyVaultUrl = config["KeyVault:Url"];

            if (!string.IsNullOrEmpty(keyVaultUrl))
            {
                configBuilder.AddAzureKeyVault(new Uri(keyVaultUrl), new DefaultAzureCredential());
            }
        }

        // Add user secrets in development
        if (environment == "Development")
        {
            configBuilder.AddUserSecrets<Program>();
        }

        return configBuilder.Build();
    }
}

/// <summary>
/// Health check configuration
/// Practice: Use ] and [ for section navigation
/// </summary>
public static class HealthCheckExtensions
{
    public static IServiceCollection AddApplicationHealthChecks(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var healthChecksBuilder = services.AddHealthChecks();

        // Database health check
        healthChecksBuilder.AddDbContextCheck<ApplicationDbContext>("database");

        // Redis health check
        var redisConnectionString = configuration.GetConnectionString("Redis");
        if (!string.IsNullOrEmpty(redisConnectionString))
        {
            healthChecksBuilder.AddRedis(redisConnectionString, "redis");
        }

        // External service health checks
        var stripeApiUrl = configuration["PaymentGateways:Stripe:BaseUrl"];
        if (!string.IsNullOrEmpty(stripeApiUrl))
        {
            healthChecksBuilder.AddUrlGroup(new Uri(stripeApiUrl), "stripe");
        }

        var sendGridApiUrl = configuration["Email:SendGrid:BaseUrl"];
        if (!string.IsNullOrEmpty(sendGridApiUrl))
        {
            healthChecksBuilder.AddUrlGroup(new Uri(sendGridApiUrl), "sendgrid");
        }

        // Custom health checks
        healthChecksBuilder.AddCheck<InventoryHealthCheck>("inventory");
        healthChecksBuilder.AddCheck<PaymentProcessingHealthCheck>("payment-processing");
        healthChecksBuilder.AddCheck<OrderProcessingHealthCheck>("order-processing");

        return services;
    }
}

// Placeholder interfaces and classes for service implementations
public interface IPaymentGatewayService { }
public interface IShippingService { }
public interface IEmailService { }
public interface ISmsService { }
public interface ISearchService { }
public interface IFileStorageService { }
public interface IImageProcessingService { }
public interface IDistributedCacheService { }
public interface ISessionService { }
public interface ICachedProductService { }
public interface ICachedCustomerService { }
public interface ICachedCategoryService { }
public interface IAuditLogger { }
public interface IPerformanceLogger { }
public interface ISecurityLogger { }
public interface IPricingService { }
public interface ITaxCalculationService { }
public interface IReportingService { }
public interface ISecurityService { }
public interface IValidationService { }
public interface IAuditService { }

// Placeholder implementations
public class StripePaymentService : IPaymentGatewayService { }
public class PayPalPaymentService : IPaymentGatewayService { }
public class FedExShippingService : IShippingService { }
public class UpsShippingService : IShippingService { }
public class SendGridEmailService : IEmailService { }
public class TwilioSmsService : ISmsService { }
public class ElasticsearchService : ISearchService { }
public class AzureBlobStorageService : IFileStorageService { }
public class ImageSharpProcessingService : IImageProcessingService { }
public class RedisCacheService : IDistributedCacheService { }
public class MemoryCacheService : IDistributedCacheService { }
public class RedisSessionService : ISessionService { }
public class MemorySessionService : ISessionService { }
public class CachedProductService : ICachedProductService { }
public class CachedCustomerService : ICachedCustomerService { }
public class CachedCategoryService : ICachedCategoryService { }
public class DatabaseAuditLogger : IAuditLogger { }
public class PerformanceLogger : IPerformanceLogger { }
public class SecurityLogger : ISecurityLogger { }

// Placeholder background services
public class InventoryUpdateService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

public class OrderProcessingService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

public class NotificationDispatchService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

public class AnalyticsAggregationService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

public class DataCleanupService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

public class DailyReportGenerationService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

public class WeeklyAnalyticsService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

public class MonthlyMaintenanceService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

public class MessageQueueProcessorService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

public class EventProcessingService : BackgroundService
{
    protected override Task ExecuteAsync(CancellationToken stoppingToken) => Task.CompletedTask;
}

// Placeholder health checks
public class InventoryHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        => Task.FromResult(HealthCheckResult.Healthy());
}

public class PaymentProcessingHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        => Task.FromResult(HealthCheckResult.Healthy());
}

public class OrderProcessingHealthCheck : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        => Task.FromResult(HealthCheckResult.Healthy());
}

// Practice Instructions for this file:
// 1. Navigate between configuration sections using ]] and [[
// 2. Use gd to jump to method definitions
// 3. Search for specific configuration options using /OptionName
// 4. Find all service registrations with /AddScoped or /AddSingleton
// 5. Use f{ to find opening braces, f} for closing braces
// 6. Practice opening related files:
//    - :e practice.cs (to see how configuration is used)
//    - :sp Services.cs (to see the services being configured)
//    - :vs Repositories.cs (to see repository registrations)
//    - :tabnew Models.cs (to see the data models)