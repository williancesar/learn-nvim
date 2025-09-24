using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.IO;

// Main file: OrderManagementSystem.cs
namespace MultiFileNavigationPractice
{
    /// <summary>
    /// Main order management system - practice jumping between files
    /// Use Ctrl-o and Ctrl-i to navigate jump history
    /// Practice gd (go to definition) and gf (go to file)
    /// </summary>
    public class OrderManagementSystem
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICustomerService _customerService;
        private readonly IProductService _productService;
        private readonly IPaymentProcessor _paymentProcessor;
        private readonly IInventoryManager _inventoryManager;
        private readonly IShippingService _shippingService;
        private readonly INotificationService _notificationService;

        public OrderManagementSystem(
            IOrderRepository orderRepository,
            ICustomerService customerService,
            IProductService productService,
            IPaymentProcessor paymentProcessor,
            IInventoryManager inventoryManager,
            IShippingService shippingService,
            INotificationService notificationService)
        {
            _orderRepository = orderRepository;
            _customerService = customerService;
            _productService = productService;
            _paymentProcessor = paymentProcessor;
            _inventoryManager = inventoryManager;
            _shippingService = shippingService;
            _notificationService = notificationService;
        }

        public async Task<OrderResult> CreateOrderAsync(CreateOrderRequest request)
        {
            // Validate customer exists
            var customer = await _customerService.GetCustomerByIdAsync(request.CustomerId);
            if (customer == null)
            {
                return OrderResult.Failed("Customer not found");
            }

            // Validate products and check inventory
            var orderItems = new List<OrderItem>();
            foreach (var item in request.Items)
            {
                var product = await _productService.GetProductByIdAsync(item.ProductId);
                if (product == null)
                {
                    return OrderResult.Failed($"Product {item.ProductId} not found");
                }

                var inventoryCheck = await _inventoryManager.CheckAvailabilityAsync(item.ProductId, item.Quantity);
                if (!inventoryCheck.IsAvailable)
                {
                    return OrderResult.Failed($"Insufficient inventory for product {product.Name}");
                }

                orderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Product = product,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price,
                    TotalPrice = product.Price * item.Quantity
                });
            }

            // Create order
            var order = new Order
            {
                Id = Guid.NewGuid(),
                CustomerId = request.CustomerId,
                Customer = customer,
                Items = orderItems,
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending,
                Subtotal = orderItems.Sum(i => i.TotalPrice),
                ShippingAddress = request.ShippingAddress,
                BillingAddress = request.BillingAddress ?? request.ShippingAddress
            };

            order.Tax = CalculateTax(order.Subtotal, order.ShippingAddress);
            order.ShippingCost = await _shippingService.CalculateShippingCostAsync(order);
            order.Total = order.Subtotal + order.Tax + order.ShippingCost;

            // Process payment
            var paymentResult = await _paymentProcessor.ProcessPaymentAsync(new PaymentRequest
            {
                Amount = order.Total,
                Currency = "USD",
                PaymentMethod = request.PaymentMethod,
                OrderId = order.Id
            });

            if (!paymentResult.IsSuccessful)
            {
                return OrderResult.Failed($"Payment failed: {paymentResult.ErrorMessage}");
            }

            order.PaymentId = paymentResult.PaymentId;
            order.Status = OrderStatus.Paid;

            // Reserve inventory
            foreach (var item in orderItems)
            {
                await _inventoryManager.ReserveInventoryAsync(item.ProductId, item.Quantity);
            }

            // Save order
            var savedOrder = await _orderRepository.CreateOrderAsync(order);

            // Send confirmation notifications
            await _notificationService.SendOrderConfirmationAsync(savedOrder);

            return OrderResult.Success(savedOrder);
        }

        public async Task<OrderResult> UpdateOrderStatusAsync(Guid orderId, OrderStatus newStatus)
        {
            var order = await _orderRepository.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                return OrderResult.Failed("Order not found");
            }

            var oldStatus = order.Status;
            order.Status = newStatus;
            order.LastModified = DateTime.UtcNow;

            // Handle status-specific logic
            switch (newStatus)
            {
                case OrderStatus.Shipped:
                    await HandleOrderShippedAsync(order);
                    break;
                case OrderStatus.Delivered:
                    await HandleOrderDeliveredAsync(order);
                    break;
                case OrderStatus.Cancelled:
                    await HandleOrderCancelledAsync(order);
                    break;
                case OrderStatus.Returned:
                    await HandleOrderReturnedAsync(order);
                    break;
            }

            await _orderRepository.UpdateOrderAsync(order);
            await _notificationService.SendStatusUpdateAsync(order, oldStatus, newStatus);

            return OrderResult.Success(order);
        }

        private async Task HandleOrderShippedAsync(Order order)
        {
            var trackingInfo = await _shippingService.CreateShipmentAsync(order);
            order.TrackingNumber = trackingInfo.TrackingNumber;
            order.EstimatedDeliveryDate = trackingInfo.EstimatedDeliveryDate;

            foreach (var item in order.Items)
            {
                await _inventoryManager.CommitReservationAsync(item.ProductId, item.Quantity);
            }
        }

        private async Task HandleOrderDeliveredAsync(Order order)
        {
            order.DeliveredDate = DateTime.UtcNow;
            await _notificationService.RequestOrderReviewAsync(order);
        }

        private async Task HandleOrderCancelledAsync(Order order)
        {
            // Release inventory reservations
            foreach (var item in order.Items)
            {
                await _inventoryManager.ReleaseReservationAsync(item.ProductId, item.Quantity);
            }

            // Process refund if payment was made
            if (!string.IsNullOrEmpty(order.PaymentId))
            {
                await _paymentProcessor.ProcessRefundAsync(order.PaymentId, order.Total);
            }
        }

        private async Task HandleOrderReturnedAsync(Order order)
        {
            // Return inventory
            foreach (var item in order.Items)
            {
                await _inventoryManager.ReturnInventoryAsync(item.ProductId, item.Quantity);
            }

            // Process refund
            if (!string.IsNullOrEmpty(order.PaymentId))
            {
                await _paymentProcessor.ProcessRefundAsync(order.PaymentId, order.Total);
            }
        }

        private decimal CalculateTax(decimal subtotal, Address address)
        {
            // Simple tax calculation based on state
            var taxRate = address.State.ToUpperInvariant() switch
            {
                "CA" => 0.0875m,
                "NY" => 0.08m,
                "TX" => 0.0625m,
                "FL" => 0.06m,
                _ => 0.05m
            };

            return subtotal * taxRate;
        }
    }

    // Order domain models
    public class Order
    {
        public Guid Id { get; set; }
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public List<OrderItem> Items { get; set; } = new();
        public DateTime OrderDate { get; set; }
        public DateTime? LastModified { get; set; }
        public OrderStatus Status { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Tax { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal Total { get; set; }
        public Address ShippingAddress { get; set; } = new();
        public Address BillingAddress { get; set; } = new();
        public string? PaymentId { get; set; }
        public string? TrackingNumber { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
    }

    public class OrderItem
    {
        public int ProductId { get; set; }
        public Product? Product { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class Customer
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public List<Address> Addresses { get; set; } = new();
        public CustomerStatus Status { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; } = string.Empty;
        public ProductStatus Status { get; set; }
        public decimal Weight { get; set; }
        public ProductDimensions Dimensions { get; set; } = new();
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

    public class ProductDimensions
    {
        public decimal Length { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
    }

    // Enums
    public enum OrderStatus
    {
        Pending,
        Paid,
        Processing,
        Shipped,
        Delivered,
        Cancelled,
        Returned
    }

    public enum CustomerStatus
    {
        Active,
        Inactive,
        Suspended
    }

    public enum ProductStatus
    {
        Active,
        Inactive,
        Discontinued
    }

    // Request/Response models
    public class CreateOrderRequest
    {
        public int CustomerId { get; set; }
        public List<OrderItemRequest> Items { get; set; } = new();
        public Address ShippingAddress { get; set; } = new();
        public Address? BillingAddress { get; set; }
        public PaymentMethod PaymentMethod { get; set; } = new();
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class PaymentMethod
    {
        public string Type { get; set; } = string.Empty; // CreditCard, PayPal, etc.
        public string Token { get; set; } = string.Empty;
        public Dictionary<string, string> Metadata { get; set; } = new();
    }

    public class OrderResult
    {
        public bool IsSuccess { get; set; }
        public Order? Order { get; set; }
        public string? ErrorMessage { get; set; }

        public static OrderResult Success(Order order) => new() { IsSuccess = true, Order = order };
        public static OrderResult Failed(string error) => new() { IsSuccess = false, ErrorMessage = error };
    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public PaymentMethod PaymentMethod { get; set; } = new();
        public Guid OrderId { get; set; }
    }

    public class PaymentResult
    {
        public bool IsSuccessful { get; set; }
        public string? PaymentId { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public class InventoryCheckResult
    {
        public bool IsAvailable { get; set; }
        public int AvailableQuantity { get; set; }
        public string? Message { get; set; }
    }

    public class TrackingInfo
    {
        public string TrackingNumber { get; set; } = string.Empty;
        public DateTime EstimatedDeliveryDate { get; set; }
        public string Carrier { get; set; } = string.Empty;
    }

    // Service interfaces
    public interface IOrderRepository
    {
        Task<Order> CreateOrderAsync(Order order);
        Task<Order?> GetOrderByIdAsync(Guid orderId);
        Task<Order> UpdateOrderAsync(Order order);
        Task<IEnumerable<Order>> GetOrdersByCustomerAsync(int customerId);
    }

    public interface ICustomerService
    {
        Task<Customer?> GetCustomerByIdAsync(int customerId);
        Task<Customer> CreateCustomerAsync(Customer customer);
        Task<Customer> UpdateCustomerAsync(Customer customer);
    }

    public interface IProductService
    {
        Task<Product?> GetProductByIdAsync(int productId);
        Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm);
        Task<Product> CreateProductAsync(Product product);
    }

    public interface IPaymentProcessor
    {
        Task<PaymentResult> ProcessPaymentAsync(PaymentRequest request);
        Task<PaymentResult> ProcessRefundAsync(string paymentId, decimal amount);
    }

    public interface IInventoryManager
    {
        Task<InventoryCheckResult> CheckAvailabilityAsync(int productId, int quantity);
        Task ReserveInventoryAsync(int productId, int quantity);
        Task CommitReservationAsync(int productId, int quantity);
        Task ReleaseReservationAsync(int productId, int quantity);
        Task ReturnInventoryAsync(int productId, int quantity);
    }

    public interface IShippingService
    {
        Task<decimal> CalculateShippingCostAsync(Order order);
        Task<TrackingInfo> CreateShipmentAsync(Order order);
    }

    public interface INotificationService
    {
        Task SendOrderConfirmationAsync(Order order);
        Task SendStatusUpdateAsync(Order order, OrderStatus oldStatus, OrderStatus newStatus);
        Task RequestOrderReviewAsync(Order order);
    }
}