using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using VimPractice.FileOperations.Models;
using VimPractice.FileOperations.Services;
using VimPractice.FileOperations.Repositories;

namespace VimPractice.FileOperations;

// Practice file for Day 13: File Operations
// This is the main entry point - practice opening related files with :e, :split, :vsplit, :tabnew
// Related files: Models.cs, Services.cs, Repositories.cs, Controllers.cs, Configuration.cs

/// <summary>
/// Main application startup and configuration
/// Practice: :e Models.cs, :e Services.cs, :sp Repositories.cs, :vs Controllers.cs
/// </summary>
public class Program
{
    private static ILogger<Program>? _logger;
    private static IServiceProvider? _serviceProvider;

    public static async Task Main(string[] args)
    {
        try
        {
            // Configure services (see Configuration.cs for detailed setup)
            _serviceProvider = ConfigureServices();
            _logger = _serviceProvider.GetRequiredService<ILogger<Program>>();

            _logger.LogInformation("Starting E-commerce application...");

            // Initialize repositories (see Repositories.cs)
            await InitializeRepositoriesAsync();

            // Start application services (see Services.cs)
            await StartApplicationServicesAsync();

            // Run the main application loop
            await RunApplicationAsync();
        }
        catch (Exception ex)
        {
            _logger?.LogCritical(ex, "Application failed to start");
            throw;
        }
        finally
        {
            await CleanupAsync();
        }
    }

    private static IServiceProvider ConfigureServices()
    {
        // Detailed service configuration is in Configuration.cs
        // Practice: :e Configuration.cs to see the full setup
        var services = new ServiceCollection();

        // Add logging
        services.AddLogging(builder =>
        {
            builder.AddConsole()
                   .AddDebug()
                   .SetMinimumLevel(LogLevel.Information);
        });

        // Register repositories (defined in Repositories.cs)
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<ICategoryRepository, CategoryRepository>();

        // Register services (defined in Services.cs)
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IInventoryService, InventoryService>();
        services.AddScoped<IPaymentService, PaymentService>();
        services.AddScoped<INotificationService, NotificationService>();

        // Register business logic services
        services.AddScoped<IShoppingCartService, ShoppingCartService>();
        services.AddScoped<IRecommendationService, RecommendationService>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();

        return services.BuildServiceProvider();
    }

    private static async Task InitializeRepositoriesAsync()
    {
        _logger?.LogInformation("Initializing data repositories...");

        // Initialize database connections and schemas
        var productRepo = _serviceProvider?.GetRequiredService<IProductRepository>();
        var customerRepo = _serviceProvider?.GetRequiredService<ICustomerRepository>();
        var orderRepo = _serviceProvider?.GetRequiredService<IOrderRepository>();
        var categoryRepo = _serviceProvider?.GetRequiredService<ICategoryRepository>();

        if (productRepo != null)
            await productRepo.InitializeAsync();

        if (customerRepo != null)
            await customerRepo.InitializeAsync();

        if (orderRepo != null)
            await orderRepo.InitializeAsync();

        if (categoryRepo != null)
            await categoryRepo.InitializeAsync();

        _logger?.LogInformation("Repository initialization completed");
    }

    private static async Task StartApplicationServicesAsync()
    {
        _logger?.LogInformation("Starting application services...");

        // Start background services
        var inventoryService = _serviceProvider?.GetRequiredService<IInventoryService>();
        var notificationService = _serviceProvider?.GetRequiredService<INotificationService>();
        var analyticsService = _serviceProvider?.GetRequiredService<IAnalyticsService>();

        if (inventoryService != null)
            await inventoryService.StartAsync();

        if (notificationService != null)
            await notificationService.StartAsync();

        if (analyticsService != null)
            await analyticsService.StartAsync();

        _logger?.LogInformation("Application services started successfully");
    }

    private static async Task RunApplicationAsync()
    {
        _logger?.LogInformation("Application is running. Press Ctrl+C to exit.");

        // Simulate application running
        var productService = _serviceProvider?.GetRequiredService<IProductService>();
        var customerService = _serviceProvider?.GetRequiredService<ICustomerService>();
        var orderService = _serviceProvider?.GetRequiredService<IOrderService>();

        // Demo operations - practice navigating to service implementations
        if (productService != null)
        {
            var products = await productService.GetFeaturedProductsAsync();
            _logger?.LogInformation("Loaded {Count} featured products", products.Count);
        }

        if (customerService != null)
        {
            var customers = await customerService.GetActiveCustomersAsync();
            _logger?.LogInformation("Found {Count} active customers", customers.Count);
        }

        if (orderService != null)
        {
            var recentOrders = await orderService.GetRecentOrdersAsync(TimeSpan.FromDays(7));
            _logger?.LogInformation("Retrieved {Count} orders from the last 7 days", recentOrders.Count);
        }

        // Keep application running
        var cancellationToken = new CancellationTokenSource();
        Console.CancelKeyPress += (_, e) =>
        {
            e.Cancel = true;
            cancellationToken.Cancel();
        };

        try
        {
            await Task.Delay(-1, cancellationToken.Token);
        }
        catch (OperationCanceledException)
        {
            _logger?.LogInformation("Application shutdown requested");
        }
    }

    private static async Task CleanupAsync()
    {
        _logger?.LogInformation("Performing application cleanup...");

        if (_serviceProvider is IAsyncDisposable asyncDisposable)
        {
            await asyncDisposable.DisposeAsync();
        }
        else if (_serviceProvider is IDisposable disposable)
        {
            disposable.Dispose();
        }

        _logger?.LogInformation("Application cleanup completed");
    }
}

/// <summary>
/// Application-wide constants and configuration keys
/// </summary>
public static class ApplicationConstants
{
    // Database configuration
    public const string DefaultConnectionString = "Server=localhost;Database=ECommerce;Trusted_Connection=true;";
    public const int DefaultCommandTimeout = 30;
    public const int DefaultPoolSize = 100;

    // Cache configuration
    public const int DefaultCacheExpirationMinutes = 15;
    public const string CacheKeyPrefix = "ecommerce:";

    // Business rules
    public const int MaxItemsPerOrder = 50;
    public decimal MaxOrderValue = 10000.00m;
    public const int MaxCustomerOrdersPerDay = 10;

    // Application settings
    public const string ApplicationName = "E-Commerce Platform";
    public const string ApplicationVersion = "1.0.0";
    public const int DefaultPageSize = 20;
    public const int MaxPageSize = 100;
}

// Practice Instructions for File Operations:
// :e filename - Edit/open file
// :sp filename - Split window horizontally and open file
// :vs filename - Split window vertically and open file
// :tabnew filename - Open file in new tab
// Ctrl-w w - Switch between windows
// Ctrl-w h/j/k/l - Move between windows
// gt/gT - Switch between tabs
// :q - Close current window/tab
// :qa - Close all windows
// :wa - Save all files
// :wqa - Save all and quit
//
// Practice workflow:
// 1. Open this file (practice.cs)
// 2. :e Models.cs (open models in same window)
// 3. :sp Services.cs (split horizontally and open services)
// 4. :vs Repositories.cs (split vertically and open repositories)
// 5. :tabnew Controllers.cs (open controllers in new tab)
// 6. Navigate between files and windows
// 7. Make changes across multiple files
// 8. Save and manage all open files