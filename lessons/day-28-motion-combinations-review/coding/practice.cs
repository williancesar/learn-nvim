using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.ComponentModel.DataAnnotations;

namespace ComprehensiveReviewPractice
{
    /// <summary>
    /// COMPREHENSIVE C# PRACTICE FILE - WEEK 4 REVIEW
    ///
    /// This file combines all Vim motion techniques from Days 15-27:
    /// • Paragraph motion ({ }) - Navigate between logical code blocks
    /// • Screen navigation (H M L Ctrl-d Ctrl-u) - Move around large files
    /// • Text objects (iw aw is as ip ap) - Select and manipulate text units
    /// • Quote/bracket objects (i" a" i( a) i{ a} i[ a]) - Work with delimited content
    /// • XML comments and regions - Navigate documentation and code organization
    /// • Operator+motion combinations (dw cw y$ v}) - Combine actions with movements
    /// • Multi-file navigation (Ctrl-o Ctrl-i gd gf) - Jump between files and definitions
    /// • Search patterns (/ ? * # n N) - Find and navigate to specific content
    /// • Line jumps and bracket matching (gg G 42G % [{ ]}) - Target specific locations
    /// • Marks (ma 'a `a) - Set and navigate to custom positions
    /// • Visual block (Ctrl-v I A) - Column-based editing operations
    /// • Indentation (>> << = >ap <ap) - Format and organize code structure
    /// • Join and format (J gJ gq) - Manage line breaks and text formatting
    ///
    /// PRACTICE CHALLENGES:
    /// 1. Use { } to navigate between methods and classes
    /// 2. Use text objects to select and modify method names, parameters, and strings
    /// 3. Use search to find specific patterns like method names or variable declarations
    /// 4. Use marks to bookmark important sections and jump between them
    /// 5. Use visual block to edit multiple lines simultaneously
    /// 6. Fix indentation issues throughout the file
    /// 7. Format long method signatures and parameter lists
    /// </summary>

    #region Core Business Logic Services

    /// <summary>
    /// Comprehensive enterprise service demonstrating all C# and Vim concepts
    /// Practice navigating this large class using paragraph motions
    /// </summary>
    public class EnterpriseBusinessService
    {
        // MARK: Dependencies and Private Fields
        private readonly IUserRepository _userRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IPaymentService _paymentService;
        private readonly IInventoryService _inventoryService;
        private readonly INotificationService _notificationService;
        private readonly ILoggingService _loggingService;
        private readonly ICacheService _cacheService;
        private readonly IConfigurationService _configurationService;
        private readonly IValidationService _validationService;

        public EnterpriseBusinessService(
            IUserRepository userRepository,
            IOrderRepository orderRepository,
            IProductRepository productRepository,
            IPaymentService paymentService,
            IInventoryService inventoryService,
            INotificationService notificationService,
            ILoggingService loggingService,
            ICacheService cacheService,
            IConfigurationService configurationService,
            IValidationService validationService)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
            _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
            _paymentService = paymentService ?? throw new ArgumentNullException(nameof(paymentService));
            _inventoryService = inventoryService ?? throw new ArgumentNullException(nameof(inventoryService));
            _notificationService = notificationService ?? throw new ArgumentNullException(nameof(notificationService));
            _loggingService = loggingService ?? throw new ArgumentNullException(nameof(loggingService));
            _cacheService = cacheService ?? throw new ArgumentNullException(nameof(cacheService));
            _configurationService = configurationService ?? throw new ArgumentNullException(nameof(configurationService));
            _validationService = validationService ?? throw new ArgumentNullException(nameof(validationService));
        }


        /// <summary>
        /// Creates a new user account with comprehensive validation
        /// Practice using text objects to select method parameters and string literals
        /// </summary>
        /// <param name="request">User creation request with all required information</param>
        /// <returns>Result containing the created user or error information</returns>
        public async Task<UserCreationResult> CreateUserAccountAsync(CreateUserRequest request)
        {
            _loggingService.LogInformation("Starting user creation process for email: {Email}", request.EmailAddress);

            try
            {
                // Practice selecting these validation conditions with text objects
                var validationResult = await _validationService.ValidateUserCreationRequestAsync(request);
                if (!validationResult.IsValid)
                {
                    return UserCreationResult.Failed(validationResult.ErrorMessage);
                }

                // Practice using search patterns to find similar email checks
                var existingUser = await _userRepository.GetUserByEmailAsync(request.EmailAddress);
                if (existingUser != null)
                {
                    _loggingService.LogWarning("User creation failed: Email already exists {Email}", request.EmailAddress);
                    return UserCreationResult.Failed("An account with this email address already exists");
                }

                // Practice using visual block to align these property assignments
                var newUser = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    EmailAddress = request.EmailAddress,
                    PhoneNumber = request.PhoneNumber,
                    DateOfBirth = request.DateOfBirth,
                    Address = request.Address,
                    CreatedDate = DateTime.UtcNow,
                    LastModifiedDate = DateTime.UtcNow,
                    IsActive = true,
                    EmailVerified = false,
                    AccountStatus = AccountStatus.Active
                };

                var hashedPassword = await _paymentService.HashPasswordAsync(request.Password);
                newUser.PasswordHash = hashedPassword;

                var createdUser = await _userRepository.CreateUserAsync(newUser);
                await _notificationService.SendWelcomeEmailAsync(createdUser);

                _loggingService.LogInformation("User account created successfully: {UserId}", createdUser.Id);
                return UserCreationResult.Success(createdUser);
            }
            catch (Exception ex)
            {
                _loggingService.LogError(ex, "Error creating user account for email: {Email}", request.EmailAddress);
                return UserCreationResult.Failed("An error occurred while creating the user account");
            }
        }


        /// <summary>
        /// Processes a complex order with multiple validation steps
        /// Practice using marks to navigate between different sections of this method
        /// </summary>
        public async Task<OrderProcessingResult> ProcessOrderAsync(ProcessOrderRequest request)
        {
            // MARK: Set 'o' here for order processing start
            _loggingService.LogInformation("Processing order for user: {UserId}", request.UserId);

            try
            {
                // MARK: Set 'u' here for user validation
                var user = await _userRepository.GetUserByIdAsync(request.UserId);
                if (user == null || !user.IsActive)
                {
                    return OrderProcessingResult.Failed("Invalid or inactive user account");
                }

                // MARK: Set 'p' here for product validation
                var productValidation = await ValidateOrderProductsAsync(request.OrderItems);
                if (!productValidation.IsValid)
                {
                    return OrderProcessingResult.Failed(productValidation.ErrorMessage);
                }

                // MARK: Set 'i' here for inventory check
                var inventoryCheck = await _inventoryService.CheckInventoryAvailabilityAsync(request.OrderItems);
                if (!inventoryCheck.IsAvailable)
                {
                    return OrderProcessingResult.Failed("Insufficient inventory for one or more items");
                }

                // Practice using text objects to select and modify this complex object initialization
                var order = new Order
                {
                    Id = Guid.NewGuid(),
                    UserId = request.UserId,
                    User = user,
                    OrderDate = DateTime.UtcNow,
                    Status = OrderStatus.Pending,
                    Items = request.OrderItems.Select(item => new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = item.UnitPrice,
                        TotalPrice = item.Quantity * item.UnitPrice
                    }).ToList(),
                    ShippingAddress = request.ShippingAddress,
                    BillingAddress = request.BillingAddress,
                    PaymentMethod = request.PaymentMethod
                };

                // MARK: Set 'c' here for calculation section
                order.Subtotal = order.Items.Sum(item => item.TotalPrice);
                order.TaxAmount = await CalculateTaxAsync(order.Subtotal, order.ShippingAddress);
                order.ShippingCost = await CalculateShippingCostAsync(order);
                order.TotalAmount = order.Subtotal + order.TaxAmount + order.ShippingCost;

                // MARK: Set 'y' here for payment processing
                var paymentResult = await _paymentService.ProcessPaymentAsync(new PaymentRequest
                {
                    Amount = order.TotalAmount,
                    PaymentMethod = request.PaymentMethod,
                    OrderId = order.Id,
                    UserId = request.UserId
                });

                if (!paymentResult.IsSuccessful)
                {
                    _loggingService.LogWarning("Payment failed for order: {OrderId}, Reason: {Reason}",
                        order.Id, paymentResult.ErrorMessage);
                    return OrderProcessingResult.Failed($"Payment processing failed: {paymentResult.ErrorMessage}");
                }

                order.PaymentId = paymentResult.PaymentId;
                order.Status = OrderStatus.Paid;

                // MARK: Set 'r' here for reservation and save
                await _inventoryService.ReserveInventoryAsync(request.OrderItems);
                var savedOrder = await _orderRepository.CreateOrderAsync(order);
                await _notificationService.SendOrderConfirmationAsync(savedOrder);

                _loggingService.LogInformation("Order processed successfully: {OrderId}", savedOrder.Id);
                return OrderProcessingResult.Success(savedOrder);
            }
            catch (Exception ex)
            {
                _loggingService.LogError(ex, "Error processing order for user: {UserId}", request.UserId);
                return OrderProcessingResult.Failed("An error occurred while processing the order");
            }
        }


        /// <summary>
        /// Generates comprehensive analytics report
        /// Practice using search patterns to find similar aggregation operations
        /// </summary>
        public async Task<AnalyticsReport> GenerateBusinessAnalyticsReportAsync(AnalyticsRequest request)
        {
            _loggingService.LogInformation("Generating analytics report for period: {StartDate} to {EndDate}",
                request.StartDate, request.EndDate);

            try
            {
                // Practice using visual block to align these data retrieval calls
                var users = await _userRepository.GetUsersCreatedInPeriodAsync(request.StartDate, request.EndDate);
                var orders = await _orderRepository.GetOrdersInPeriodAsync(request.StartDate, request.EndDate);
                var products = await _productRepository.GetAllProductsAsync();
                var payments = await _paymentService.GetPaymentsInPeriodAsync(request.StartDate, request.EndDate);

                // Practice joining these complex LINQ expressions
                var userMetrics = new UserMetrics
                {
                    TotalUsers = users.Count(),
                    NewUsers = users.Count(u => u.CreatedDate >= request.StartDate),
                    ActiveUsers = users.Count(u => u.IsActive),
                    VerifiedUsers = users.Count(u => u.EmailVerified),
                    UsersByStatus = users.GroupBy(u => u.AccountStatus)
                                        .ToDictionary(g => g.Key.ToString(), g => g.Count())
                };

                var orderMetrics = new OrderMetrics
                {
                    TotalOrders = orders.Count(),
                    CompletedOrders = orders.Count(o => o.Status == OrderStatus.Completed),
                    PendingOrders = orders.Count(o => o.Status == OrderStatus.Pending),
                    CancelledOrders = orders.Count(o => o.Status == OrderStatus.Cancelled),
                    TotalRevenue = orders.Where(o => o.Status == OrderStatus.Completed)
                                        .Sum(o => o.TotalAmount),
                    AverageOrderValue = orders.Where(o => o.Status == OrderStatus.Completed)
                                             .Average(o => o.TotalAmount),
                    OrdersByMonth = orders.GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
                                         .Select(g => new MonthlyOrderData
                                         {
                                             Year = g.Key.Year,
                                             Month = g.Key.Month,
                                             OrderCount = g.Count(),
                                             Revenue = g.Sum(o => o.TotalAmount)
                                         })
                                         .OrderBy(m => m.Year)
                                         .ThenBy(m => m.Month)
                                         .ToList()
                };

                // Practice using bracket matching to navigate this complex nested structure
                var productMetrics = new ProductMetrics
                {
                    TotalProducts = products.Count(),
                    ActiveProducts = products.Count(p => p.IsActive),
                    TopSellingProducts = orders.SelectMany(o => o.Items)
                                              .GroupBy(i => i.ProductId)
                                              .Select(g => new ProductSalesData
                                              {
                                                  ProductId = g.Key,
                                                  ProductName = products.FirstOrDefault(p => p.Id == g.Key)?.Name ?? "Unknown",
                                                  TotalQuantitySold = g.Sum(i => i.Quantity),
                                                  TotalRevenue = g.Sum(i => i.TotalPrice),
                                                  OrderCount = g.Count()
                                              })
                                              .OrderByDescending(p => p.TotalRevenue)
                                              .Take(10)
                                              .ToList(),
                    ProductCategories = products.GroupBy(p => p.Category)
                                               .ToDictionary(g => g.Key, g => g.Count())
                };

                return new AnalyticsReport
                {
                    GeneratedDate = DateTime.UtcNow,
                    ReportPeriod = new DateRange(request.StartDate, request.EndDate),
                    UserMetrics = userMetrics,
                    OrderMetrics = orderMetrics,
                    ProductMetrics = productMetrics,
                    Summary = GenerateReportSummary(userMetrics, orderMetrics, productMetrics)
                };
            }
            catch (Exception ex)
            {
                _loggingService.LogError(ex, "Error generating analytics report");
                throw new BusinessException("Failed to generate analytics report", ex);
            }
        }


        // Practice indentation operations on these poorly formatted private methods
        private async Task<ValidationResult> ValidateOrderProductsAsync(List<OrderItemRequest> orderItems)
        {
        var errors = new List<string>();

        foreach (var item in orderItems)
        {
        var product = await _productRepository.GetProductByIdAsync(item.ProductId);
        if (product == null)
        {
        errors.Add($"Product with ID {item.ProductId} not found");
        continue;
        }

        if (!product.IsActive)
        {
        errors.Add($"Product {product.Name} is not available");
        }

        if (item.Quantity <= 0)
        {
        errors.Add($"Invalid quantity for product {product.Name}");
        }

        if (item.UnitPrice != product.Price)
        {
        errors.Add($"Price mismatch for product {product.Name}");
        }
        }

        return new ValidationResult
        {
        IsValid = !errors.Any(),
        ErrorMessage = string.Join("; ", errors)
        };
        }

        private async Task<decimal> CalculateTaxAsync(decimal subtotal, Address shippingAddress)
        {
        var taxRate = shippingAddress.State.ToUpperInvariant() switch
        {
        "CA" => 0.0875m,
        "NY" => 0.08m,
        "TX" => 0.0625m,
        "FL" => 0.06m,
        "WA" => 0.065m,
        _ => 0.05m
        };

        return subtotal * taxRate;
        }

        private async Task<decimal> CalculateShippingCostAsync(Order order)
        {
        var baseShippingCost = 9.99m;
        var weightMultiplier = 0.5m;
        var totalWeight = order.Items.Sum(item => item.Quantity * 1.0m); // Assume 1 lb per item

        if (order.Subtotal >= 100)
        {
        return 0; // Free shipping over $100
        }

        return baseShippingCost + (totalWeight * weightMultiplier);
        }

        private string GenerateReportSummary(UserMetrics userMetrics, OrderMetrics orderMetrics, ProductMetrics productMetrics)
        {
        return $@"
Business Analytics Summary:
- Total Users: {userMetrics.TotalUsers:N0} ({userMetrics.NewUsers:N0} new this period)
- Total Orders: {orderMetrics.TotalOrders:N0} (Revenue: {orderMetrics.TotalRevenue:C})
- Active Products: {productMetrics.ActiveProducts:N0} of {productMetrics.TotalProducts:N0}
- Average Order Value: {orderMetrics.AverageOrderValue:C}
- Top Product: {productMetrics.TopSellingProducts.FirstOrDefault()?.ProductName ?? "N/A"}
";
        }
    }

    #endregion

    #region Data Models and DTOs

    // Practice using text objects to select and modify these data structures
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public Address? Address { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public bool IsActive { get; set; }
        public bool EmailVerified { get; set; }
        public AccountStatus AccountStatus { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
    }

    public class Order
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public List<OrderItem> Items { get; set; } = new();
        public Address ShippingAddress { get; set; } = new();
        public Address BillingAddress { get; set; } = new();
        public PaymentMethod PaymentMethod { get; set; } = new();
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal TotalAmount { get; set; }
        public string? PaymentId { get; set; }
    }

    public class OrderItem
    {
        public Guid ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class Product
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int StockQuantity { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
    }

    public class Address
    {
        public string Street1 { get; set; } = string.Empty;
        public string? Street2 { get; set; }
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Country { get; set; } = "US";
    }

    public class PaymentMethod
    {
        public string Type { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public Dictionary<string, string> Metadata { get; set; } = new();
    }

    // Practice visual block operations on these aligned enums
    public enum AccountStatus
    {
        Active,
        Inactive,
        Suspended,
        Deleted
    }

    public enum OrderStatus
    {
        Pending,
        Paid,
        Processing,
        Shipped,
        Delivered,
        Completed,
        Cancelled,
        Refunded
    }

    #endregion

    #region Request and Response Models

    // Practice search patterns to find similar request/response patterns
    public class CreateUserRequest
    {
        [Required, MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;

        [Phone]
        public string? PhoneNumber { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        public DateTime? DateOfBirth { get; set; }

        public Address? Address { get; set; }
    }

    public class ProcessOrderRequest
    {
        public Guid UserId { get; set; }
        public List<OrderItemRequest> OrderItems { get; set; } = new();
        public Address ShippingAddress { get; set; } = new();
        public Address BillingAddress { get; set; } = new();
        public PaymentMethod PaymentMethod { get; set; } = new();
    }

    public class OrderItemRequest
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class AnalyticsRequest
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public List<string>? Categories { get; set; }
        public bool IncludeInactive { get; set; }
    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }
        public PaymentMethod PaymentMethod { get; set; } = new();
        public Guid OrderId { get; set; }
        public Guid UserId { get; set; }
    }

    // Result classes with consistent patterns
    public class UserCreationResult
    {
        public bool IsSuccessful { get; set; }
        public User? User { get; set; }
        public string? ErrorMessage { get; set; }

        public static UserCreationResult Success(User user) => new() { IsSuccessful = true, User = user };
        public static UserCreationResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class OrderProcessingResult
    {
        public bool IsSuccessful { get; set; }
        public Order? Order { get; set; }
        public string? ErrorMessage { get; set; }

        public static OrderProcessingResult Success(Order order) => new() { IsSuccessful = true, Order = order };
        public static OrderProcessingResult Failed(string error) => new() { IsSuccessful = false, ErrorMessage = error };
    }

    public class ValidationResult
    {
        public bool IsValid { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public class PaymentResult
    {
        public bool IsSuccessful { get; set; }
        public string? PaymentId { get; set; }
        public string? ErrorMessage { get; set; }
    }

    #endregion

    #region Analytics and Reporting Models

    // Practice using marks to navigate between these related classes
    public class AnalyticsReport
    {
        public DateTime GeneratedDate { get; set; }
        public DateRange ReportPeriod { get; set; } = new();
        public UserMetrics UserMetrics { get; set; } = new();
        public OrderMetrics OrderMetrics { get; set; } = new();
        public ProductMetrics ProductMetrics { get; set; } = new();
        public string Summary { get; set; } = string.Empty;
    }

    public class DateRange
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public DateRange() { }
        public DateRange(DateTime start, DateTime end)
        {
            StartDate = start;
            EndDate = end;
        }
    }

    public class UserMetrics
    {
        public int TotalUsers { get; set; }
        public int NewUsers { get; set; }
        public int ActiveUsers { get; set; }
        public int VerifiedUsers { get; set; }
        public Dictionary<string, int> UsersByStatus { get; set; } = new();
    }

    public class OrderMetrics
    {
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int PendingOrders { get; set; }
        public int CancelledOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal AverageOrderValue { get; set; }
        public List<MonthlyOrderData> OrdersByMonth { get; set; } = new();
    }

    public class ProductMetrics
    {
        public int TotalProducts { get; set; }
        public int ActiveProducts { get; set; }
        public List<ProductSalesData> TopSellingProducts { get; set; } = new();
        public Dictionary<string, int> ProductCategories { get; set; } = new();
    }

    public class MonthlyOrderData
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int OrderCount { get; set; }
        public decimal Revenue { get; set; }
    }

    public class ProductSalesData
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int TotalQuantitySold { get; set; }
        public decimal TotalRevenue { get; set; }
        public int OrderCount { get; set; }
    }

    #endregion

    #region Service Interfaces

    // Practice using text objects to select interface method signatures
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(Guid userId);
        Task<User?> GetUserByEmailAsync(string emailAddress);
        Task<User> CreateUserAsync(User user);
        Task<User> UpdateUserAsync(User user);
        Task<List<User>> GetUsersCreatedInPeriodAsync(DateTime startDate, DateTime endDate);
    }

    public interface IOrderRepository
    {
        Task<Order?> GetOrderByIdAsync(Guid orderId);
        Task<Order> CreateOrderAsync(Order order);
        Task<Order> UpdateOrderAsync(Order order);
        Task<List<Order>> GetOrdersInPeriodAsync(DateTime startDate, DateTime endDate);
        Task<List<Order>> GetOrdersByUserIdAsync(Guid userId);
    }

    public interface IProductRepository
    {
        Task<Product?> GetProductByIdAsync(Guid productId);
        Task<List<Product>> GetAllProductsAsync();
        Task<Product> CreateProductAsync(Product product);
        Task<Product> UpdateProductAsync(Product product);
        Task<List<Product>> SearchProductsAsync(string searchTerm);
    }

    public interface IPaymentService
    {
        Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
        Task<PaymentResult> RefundPaymentAsync(string paymentId, decimal amount);
        Task<string> HashPasswordAsync(string password);
        Task<List<PaymentResult>> GetPaymentsInPeriodAsync(DateTime startDate, DateTime endDate);
    }

    public interface IInventoryService
    {
        Task<InventoryCheckResult> CheckInventoryAvailabilityAsync(List<OrderItemRequest> items);
        Task ReserveInventoryAsync(List<OrderItemRequest> items);
        Task ReleaseInventoryReservationAsync(List<OrderItemRequest> items);
        Task UpdateStockQuantityAsync(Guid productId, int newQuantity);
    }

    public interface INotificationService
    {
        Task SendWelcomeEmailAsync(User user);
        Task SendOrderConfirmationAsync(Order order);
        Task SendShippingNotificationAsync(Order order, string trackingNumber);
        Task SendPasswordResetEmailAsync(string emailAddress, string resetToken);
    }

    public interface ILoggingService
    {
        void LogInformation(string message, params object[] args);
        void LogWarning(string message, params object[] args);
        void LogError(Exception exception, string message, params object[] args);
    }

    public interface ICacheService
    {
        Task<T?> GetAsync<T>(string key) where T : class;
        Task SetAsync<T>(string key, T value, TimeSpan? expiration = null) where T : class;
        Task RemoveAsync(string key);
    }

    public interface IConfigurationService
    {
        T GetValue<T>(string key);
        void SetValue<T>(string key, T value);
        bool HasKey(string key);
    }

    public interface IValidationService
    {
        Task<ValidationResult> ValidateUserCreationRequestAsync(CreateUserRequest request);
        Task<ValidationResult> ValidateOrderAsync(ProcessOrderRequest request);
        Task<ValidationResult> ValidateProductAsync(Product product);
    }

    // Supporting result classes
    public class InventoryCheckResult
    {
        public bool IsAvailable { get; set; }
        public string? ErrorMessage { get; set; }
        public Dictionary<Guid, int> AvailableQuantities { get; set; } = new();
    }

    public class BusinessException : Exception
    {
        public BusinessException(string message) : base(message) { }
        public BusinessException(string message, Exception innerException) : base(message, innerException) { }
    }

    #endregion

    #region Extension Methods and Utilities

    // Practice using search patterns to find these extension methods
    public static class StringExtensions
    {
        public static bool IsValidEmail(this string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public static string ToTitleCase(this string input)
        {
            if (string.IsNullOrEmpty(input))
                return string.Empty;

            return System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(input.ToLower());
        }

        public static string Truncate(this string input, int maxLength)
        {
            if (string.IsNullOrEmpty(input) || input.Length <= maxLength)
                return input;

            return input.Substring(0, maxLength) + "...";
        }
    }

    public static class EnumerableExtensions
    {
        public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> source) where T : class
        {
            return source.Where(item => item != null).Cast<T>();
        }

        public static IEnumerable<TResult> SelectNotNull<TSource, TResult>(
            this IEnumerable<TSource> source,
            Func<TSource, TResult?> selector) where TResult : class
        {
            return source.Select(selector).WhereNotNull();
        }
    }

    public static class DateTimeExtensions
    {
        public static bool IsWeekend(this DateTime date)
        {
            return date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday;
        }

        public static DateTime StartOfWeek(this DateTime date, DayOfWeek startOfWeek = DayOfWeek.Monday)
        {
            var diff = (7 + (date.DayOfWeek - startOfWeek)) % 7;
            return date.AddDays(-1 * diff).Date;
        }

        public static DateTime EndOfMonth(this DateTime date)
        {
            return new DateTime(date.Year, date.Month, DateTime.DaysInMonth(date.Year, date.Month));
        }
    }

    #endregion
}