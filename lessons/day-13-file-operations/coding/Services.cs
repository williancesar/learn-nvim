using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using VimPractice.FileOperations.Models;
using VimPractice.FileOperations.Repositories;

namespace VimPractice.FileOperations.Services;

// Services.cs - Business logic layer
// Practice: Open this file from Models.cs using :e Services.cs
// Navigate between service interfaces and implementations

/// <summary>
/// Product service interface
/// Practice: Use gd on method names to jump to implementations
/// </summary>
public interface IProductService
{
    Task<List<Product>> GetFeaturedProductsAsync();
    Task<List<Product>> GetProductsByCategoryAsync(int categoryId);
    Task<Product?> GetProductByIdAsync(int productId);
    Task<Product> CreateProductAsync(Product product);
    Task<Product> UpdateProductAsync(Product product);
    Task<bool> DeleteProductAsync(int productId);
    Task<List<Product>> SearchProductsAsync(string searchTerm);
    Task<bool> UpdateStockAsync(int productId, int newStock);
}

/// <summary>
/// Product service implementation
/// Practice: Navigate between methods using ]] and [[
/// </summary>
public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        IProductRepository productRepository,
        ICategoryRepository categoryRepository,
        ILogger<ProductService> logger)
    {
        _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
        _categoryRepository = categoryRepository ?? throw new ArgumentNullException(nameof(categoryRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<List<Product>> GetFeaturedProductsAsync()
    {
        try
        {
            _logger.LogInformation("Retrieving featured products");

            var products = await _productRepository.GetFeaturedProductsAsync();

            _logger.LogInformation("Retrieved {Count} featured products", products.Count);
            return products;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured products");
            throw;
        }
    }

    public async Task<List<Product>> GetProductsByCategoryAsync(int categoryId)
    {
        try
        {
            _logger.LogInformation("Retrieving products for category {CategoryId}", categoryId);

            // Validate category exists
            var category = await _categoryRepository.GetByIdAsync(categoryId);
            if (category == null)
            {
                throw new ArgumentException($"Category with ID {categoryId} not found");
            }

            var products = await _productRepository.GetByCategoryAsync(categoryId);

            _logger.LogInformation("Retrieved {Count} products for category {CategoryId}",
                products.Count, categoryId);
            return products;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products for category {CategoryId}", categoryId);
            throw;
        }
    }

    public async Task<Product?> GetProductByIdAsync(int productId)
    {
        try
        {
            _logger.LogDebug("Retrieving product {ProductId}", productId);

            var product = await _productRepository.GetByIdAsync(productId);

            if (product == null)
            {
                _logger.LogWarning("Product {ProductId} not found", productId);
            }

            return product;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product {ProductId}", productId);
            throw;
        }
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        try
        {
            _logger.LogInformation("Creating product {ProductName}", product.Name);

            // Validate business rules
            await ValidateProductAsync(product);

            // Ensure SKU is unique
            var existingProduct = await _productRepository.GetBySkuAsync(product.Sku);
            if (existingProduct != null)
            {
                throw new InvalidOperationException($"Product with SKU '{product.Sku}' already exists");
            }

            // Set timestamps
            product.CreatedAt = DateTime.UtcNow;
            product.UpdatedAt = DateTime.UtcNow;

            var createdProduct = await _productRepository.CreateAsync(product);

            _logger.LogInformation("Created product {ProductId} with name {ProductName}",
                createdProduct.Id, createdProduct.Name);

            return createdProduct;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product {ProductName}", product.Name);
            throw;
        }
    }

    public async Task<Product> UpdateProductAsync(Product product)
    {
        try
        {
            _logger.LogInformation("Updating product {ProductId}", product.Id);

            // Validate product exists
            var existingProduct = await _productRepository.GetByIdAsync(product.Id);
            if (existingProduct == null)
            {
                throw new ArgumentException($"Product with ID {product.Id} not found");
            }

            // Validate business rules
            await ValidateProductAsync(product);

            // Update timestamp
            product.UpdatedAt = DateTime.UtcNow;

            var updatedProduct = await _productRepository.UpdateAsync(product);

            _logger.LogInformation("Updated product {ProductId}", product.Id);

            return updatedProduct;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {ProductId}", product.Id);
            throw;
        }
    }

    public async Task<bool> DeleteProductAsync(int productId)
    {
        try
        {
            _logger.LogInformation("Deleting product {ProductId}", productId);

            // Validate product exists
            var product = await _productRepository.GetByIdAsync(productId);
            if (product == null)
            {
                _logger.LogWarning("Product {ProductId} not found for deletion", productId);
                return false;
            }

            // Check if product is referenced in orders
            var hasOrders = await _productRepository.HasOrdersAsync(productId);
            if (hasOrders)
            {
                // Soft delete - mark as inactive instead of hard delete
                product.IsActive = false;
                await _productRepository.UpdateAsync(product);

                _logger.LogInformation("Soft deleted product {ProductId} (marked as inactive)", productId);
            }
            else
            {
                // Hard delete
                await _productRepository.DeleteAsync(productId);

                _logger.LogInformation("Hard deleted product {ProductId}", productId);
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {ProductId}", productId);
            throw;
        }
    }

    public async Task<List<Product>> SearchProductsAsync(string searchTerm)
    {
        try
        {
            _logger.LogInformation("Searching products with term: {SearchTerm}", searchTerm);

            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return new List<Product>();
            }

            var products = await _productRepository.SearchAsync(searchTerm);

            _logger.LogInformation("Found {Count} products matching '{SearchTerm}'",
                products.Count, searchTerm);

            return products;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching products with term: {SearchTerm}", searchTerm);
            throw;
        }
    }

    public async Task<bool> UpdateStockAsync(int productId, int newStock)
    {
        try
        {
            _logger.LogInformation("Updating stock for product {ProductId} to {NewStock}",
                productId, newStock);

            var success = await _productRepository.UpdateStockAsync(productId, newStock);

            if (success)
            {
                _logger.LogInformation("Successfully updated stock for product {ProductId}", productId);
            }
            else
            {
                _logger.LogWarning("Failed to update stock for product {ProductId}", productId);
            }

            return success;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating stock for product {ProductId}", productId);
            throw;
        }
    }

    private async Task ValidateProductAsync(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Name))
        {
            throw new ArgumentException("Product name is required");
        }

        if (product.Price <= 0)
        {
            throw new ArgumentException("Product price must be greater than zero");
        }

        if (product.StockQuantity < 0)
        {
            throw new ArgumentException("Stock quantity cannot be negative");
        }

        // Validate category exists
        var category = await _categoryRepository.GetByIdAsync(product.CategoryId);
        if (category == null)
        {
            throw new ArgumentException($"Category with ID {product.CategoryId} not found");
        }

        if (!category.IsActive)
        {
            throw new ArgumentException($"Category '{category.Name}' is not active");
        }
    }
}

/// <summary>
/// Customer service interface
/// Practice: Use f( and f) to navigate between parentheses
/// </summary>
public interface ICustomerService
{
    Task<List<Customer>> GetActiveCustomersAsync();
    Task<Customer?> GetCustomerByIdAsync(int customerId);
    Task<Customer?> GetCustomerByEmailAsync(string email);
    Task<Customer> CreateCustomerAsync(Customer customer);
    Task<Customer> UpdateCustomerAsync(Customer customer);
    Task<bool> DeactivateCustomerAsync(int customerId);
    Task<bool> VerifyEmailAsync(int customerId);
}

/// <summary>
/// Customer service implementation
/// Practice: Use * to find all occurrences of a word under cursor
/// </summary>
public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly ILogger<CustomerService> _logger;

    public CustomerService(
        ICustomerRepository customerRepository,
        ILogger<CustomerService> logger)
    {
        _customerRepository = customerRepository ?? throw new ArgumentNullException(nameof(customerRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<List<Customer>> GetActiveCustomersAsync()
    {
        try
        {
            _logger.LogInformation("Retrieving active customers");

            var customers = await _customerRepository.GetActiveCustomersAsync();

            _logger.LogInformation("Retrieved {Count} active customers", customers.Count);
            return customers;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active customers");
            throw;
        }
    }

    public async Task<Customer?> GetCustomerByIdAsync(int customerId)
    {
        try
        {
            _logger.LogDebug("Retrieving customer {CustomerId}", customerId);

            var customer = await _customerRepository.GetByIdAsync(customerId);

            if (customer == null)
            {
                _logger.LogWarning("Customer {CustomerId} not found", customerId);
            }

            return customer;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customer {CustomerId}", customerId);
            throw;
        }
    }

    public async Task<Customer?> GetCustomerByEmailAsync(string email)
    {
        try
        {
            _logger.LogDebug("Retrieving customer by email: {Email}", email);

            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Email cannot be null or empty");
            }

            var customer = await _customerRepository.GetByEmailAsync(email);

            if (customer == null)
            {
                _logger.LogWarning("Customer with email {Email} not found", email);
            }

            return customer;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customer by email: {Email}", email);
            throw;
        }
    }

    public async Task<Customer> CreateCustomerAsync(Customer customer)
    {
        try
        {
            _logger.LogInformation("Creating customer {Email}", customer.Email);

            // Validate customer data
            await ValidateCustomerAsync(customer);

            // Check if email already exists
            var existingCustomer = await _customerRepository.GetByEmailAsync(customer.Email);
            if (existingCustomer != null)
            {
                throw new InvalidOperationException($"Customer with email '{customer.Email}' already exists");
            }

            // Set timestamps
            customer.CreatedAt = DateTime.UtcNow;
            customer.UpdatedAt = DateTime.UtcNow;

            var createdCustomer = await _customerRepository.CreateAsync(customer);

            _logger.LogInformation("Created customer {CustomerId} with email {Email}",
                createdCustomer.Id, createdCustomer.Email);

            return createdCustomer;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer {Email}", customer.Email);
            throw;
        }
    }

    public async Task<Customer> UpdateCustomerAsync(Customer customer)
    {
        try
        {
            _logger.LogInformation("Updating customer {CustomerId}", customer.Id);

            // Validate customer exists
            var existingCustomer = await _customerRepository.GetByIdAsync(customer.Id);
            if (existingCustomer == null)
            {
                throw new ArgumentException($"Customer with ID {customer.Id} not found");
            }

            // Validate customer data
            await ValidateCustomerAsync(customer);

            // Update timestamp
            customer.UpdatedAt = DateTime.UtcNow;

            var updatedCustomer = await _customerRepository.UpdateAsync(customer);

            _logger.LogInformation("Updated customer {CustomerId}", customer.Id);

            return updatedCustomer;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating customer {CustomerId}", customer.Id);
            throw;
        }
    }

    public async Task<bool> DeactivateCustomerAsync(int customerId)
    {
        try
        {
            _logger.LogInformation("Deactivating customer {CustomerId}", customerId);

            var customer = await _customerRepository.GetByIdAsync(customerId);
            if (customer == null)
            {
                _logger.LogWarning("Customer {CustomerId} not found for deactivation", customerId);
                return false;
            }

            customer.IsActive = false;
            customer.UpdatedAt = DateTime.UtcNow;

            await _customerRepository.UpdateAsync(customer);

            _logger.LogInformation("Deactivated customer {CustomerId}", customerId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deactivating customer {CustomerId}", customerId);
            throw;
        }
    }

    public async Task<bool> VerifyEmailAsync(int customerId)
    {
        try
        {
            _logger.LogInformation("Verifying email for customer {CustomerId}", customerId);

            var customer = await _customerRepository.GetByIdAsync(customerId);
            if (customer == null)
            {
                _logger.LogWarning("Customer {CustomerId} not found for email verification", customerId);
                return false;
            }

            customer.IsEmailVerified = true;
            customer.UpdatedAt = DateTime.UtcNow;

            await _customerRepository.UpdateAsync(customer);

            _logger.LogInformation("Verified email for customer {CustomerId}", customerId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying email for customer {CustomerId}", customerId);
            throw;
        }
    }

    private async Task ValidateCustomerAsync(Customer customer)
    {
        if (string.IsNullOrWhiteSpace(customer.FirstName))
        {
            throw new ArgumentException("First name is required");
        }

        if (string.IsNullOrWhiteSpace(customer.LastName))
        {
            throw new ArgumentException("Last name is required");
        }

        if (string.IsNullOrWhiteSpace(customer.Email))
        {
            throw new ArgumentException("Email is required");
        }

        if (!IsValidEmail(customer.Email))
        {
            throw new ArgumentException("Invalid email format");
        }

        // Prevent duplicate email (except for current customer during update)
        var existingCustomer = await _customerRepository.GetByEmailAsync(customer.Email);
        if (existingCustomer != null && existingCustomer.Id != customer.Id)
        {
            throw new ArgumentException($"Email '{customer.Email}' is already in use");
        }

        await Task.CompletedTask;
    }

    private static bool IsValidEmail(string email)
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
}

/// <summary>
/// Order service interface and implementation
/// Practice: Use % to jump between matching brackets/braces
/// </summary>
public interface IOrderService
{
    Task<List<Order>> GetRecentOrdersAsync(TimeSpan timeSpan);
    Task<Order?> GetOrderByIdAsync(int orderId);
    Task<List<Order>> GetOrdersByCustomerAsync(int customerId);
    Task<Order> CreateOrderAsync(Order order);
    Task<Order> UpdateOrderStatusAsync(int orderId, OrderStatus status);
    Task<bool> CancelOrderAsync(int orderId);
}

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICustomerRepository _customerRepository;
    private readonly IProductRepository _productRepository;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        ICustomerRepository customerRepository,
        IProductRepository productRepository,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        _customerRepository = customerRepository ?? throw new ArgumentNullException(nameof(customerRepository));
        _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<List<Order>> GetRecentOrdersAsync(TimeSpan timeSpan)
    {
        try
        {
            var cutoffDate = DateTime.UtcNow.Subtract(timeSpan);
            _logger.LogInformation("Retrieving orders since {CutoffDate}", cutoffDate);

            var orders = await _orderRepository.GetOrdersSinceAsync(cutoffDate);

            _logger.LogInformation("Retrieved {Count} orders since {CutoffDate}",
                orders.Count, cutoffDate);
            return orders;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving recent orders");
            throw;
        }
    }

    public async Task<Order?> GetOrderByIdAsync(int orderId)
    {
        try
        {
            _logger.LogDebug("Retrieving order {OrderId}", orderId);

            var order = await _orderRepository.GetByIdAsync(orderId);

            if (order == null)
            {
                _logger.LogWarning("Order {OrderId} not found", orderId);
            }

            return order;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving order {OrderId}", orderId);
            throw;
        }
    }

    public async Task<List<Order>> GetOrdersByCustomerAsync(int customerId)
    {
        try
        {
            _logger.LogInformation("Retrieving orders for customer {CustomerId}", customerId);

            var orders = await _orderRepository.GetByCustomerAsync(customerId);

            _logger.LogInformation("Retrieved {Count} orders for customer {CustomerId}",
                orders.Count, customerId);
            return orders;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving orders for customer {CustomerId}", customerId);
            throw;
        }
    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
        try
        {
            _logger.LogInformation("Creating order for customer {CustomerId}", order.CustomerId);

            // Validate order
            await ValidateOrderAsync(order);

            // Generate order number
            order.OrderNumber = await GenerateOrderNumberAsync();

            // Set timestamps
            order.CreatedAt = DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;

            var createdOrder = await _orderRepository.CreateAsync(order);

            _logger.LogInformation("Created order {OrderId} with number {OrderNumber}",
                createdOrder.Id, createdOrder.OrderNumber);

            return createdOrder;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order for customer {CustomerId}", order.CustomerId);
            throw;
        }
    }

    public async Task<Order> UpdateOrderStatusAsync(int orderId, OrderStatus status)
    {
        try
        {
            _logger.LogInformation("Updating order {OrderId} status to {Status}", orderId, status);

            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                throw new ArgumentException($"Order with ID {orderId} not found");
            }

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;

            // Set additional timestamps based on status
            switch (status)
            {
                case OrderStatus.Shipped:
                    order.ShippedAt = DateTime.UtcNow;
                    break;
                case OrderStatus.Delivered:
                    order.DeliveredAt = DateTime.UtcNow;
                    break;
            }

            var updatedOrder = await _orderRepository.UpdateAsync(order);

            _logger.LogInformation("Updated order {OrderId} status to {Status}", orderId, status);

            return updatedOrder;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order {OrderId} status", orderId);
            throw;
        }
    }

    public async Task<bool> CancelOrderAsync(int orderId)
    {
        try
        {
            _logger.LogInformation("Cancelling order {OrderId}", orderId);

            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                _logger.LogWarning("Order {OrderId} not found for cancellation", orderId);
                return false;
            }

            if (order.Status == OrderStatus.Shipped || order.Status == OrderStatus.Delivered)
            {
                throw new InvalidOperationException($"Cannot cancel order {orderId} with status {order.Status}");
            }

            order.Status = OrderStatus.Cancelled;
            order.UpdatedAt = DateTime.UtcNow;

            await _orderRepository.UpdateAsync(order);

            _logger.LogInformation("Cancelled order {OrderId}", orderId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling order {OrderId}", orderId);
            throw;
        }
    }

    private async Task ValidateOrderAsync(Order order)
    {
        // Validate customer exists
        var customer = await _customerRepository.GetByIdAsync(order.CustomerId);
        if (customer == null)
        {
            throw new ArgumentException($"Customer with ID {order.CustomerId} not found");
        }

        if (!customer.IsActive)
        {
            throw new ArgumentException($"Customer {order.CustomerId} is not active");
        }

        // Validate order items
        if (!order.OrderItems.Any())
        {
            throw new ArgumentException("Order must contain at least one item");
        }

        foreach (var item in order.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId);
            if (product == null)
            {
                throw new ArgumentException($"Product with ID {item.ProductId} not found");
            }

            if (!product.IsActive)
            {
                throw new ArgumentException($"Product '{product.Name}' is not active");
            }

            if (item.Quantity > product.StockQuantity)
            {
                throw new ArgumentException($"Insufficient stock for product '{product.Name}'. Available: {product.StockQuantity}, Requested: {item.Quantity}");
            }
        }

        // Validate amounts
        if (order.SubtotalAmount <= 0)
        {
            throw new ArgumentException("Subtotal amount must be greater than zero");
        }

        if (order.TotalAmount <= 0)
        {
            throw new ArgumentException("Total amount must be greater than zero");
        }
    }

    private async Task<string> GenerateOrderNumberAsync()
    {
        var prefix = "ORD";
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var sequence = await _orderRepository.GetNextSequenceNumberAsync();

        return $"{prefix}{timestamp}{sequence:D4}";
    }
}

// Additional service interfaces for completeness
public interface IInventoryService
{
    Task StartAsync();
    Task StopAsync();
    Task<bool> ReserveStockAsync(int productId, int quantity);
    Task<bool> ReleaseStockAsync(int productId, int quantity);
}

public interface IPaymentService
{
    Task<Payment> ProcessPaymentAsync(Order order, PaymentMethod method);
    Task<Payment> RefundPaymentAsync(int paymentId, decimal amount);
}

public interface INotificationService
{
    Task StartAsync();
    Task StopAsync();
    Task SendOrderConfirmationAsync(Order order);
    Task SendShippingNotificationAsync(Order order);
}

public interface IShoppingCartService
{
    Task<ShoppingCart> GetCartAsync(int customerId);
    Task<ShoppingCart> AddItemAsync(int customerId, int productId, int quantity);
    Task<ShoppingCart> RemoveItemAsync(int customerId, int productId);
    Task<ShoppingCart> ClearCartAsync(int customerId);
}

public interface IRecommendationService
{
    Task<List<Product>> GetRecommendationsAsync(int customerId);
    Task<List<Product>> GetRelatedProductsAsync(int productId);
}

public interface IAnalyticsService
{
    Task StartAsync();
    Task StopAsync();
    Task TrackOrderAsync(Order order);
    Task TrackProductViewAsync(int productId, int customerId);
}

// Practice Instructions for this file:
// 1. Navigate between service interfaces and implementations using ]] and [[
// 2. Use gd to jump to method definitions
// 3. Search for specific methods using /MethodName
// 4. Find all usages of a service with *
// 5. Practice opening related files:
//    - :e Repositories.cs (to see data access layer)
//    - :sp Models.cs (to see the data models used)
//    - :vs Controllers.cs (to see how services are used in API)
//    - :tabnew Configuration.cs (to see service registration)