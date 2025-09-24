/*
 * Day 02: Basic Navigation Practice
 *
 * Navigation Practice Instructions:
 * 1. Use 'h', 'j', 'k', 'l' for basic movement
 * 2. Try 'w' and 'b' for word movement
 * 3. Use '0' and '$' for line beginning/end
 * 4. Practice 'gg' (top) and 'G' (bottom)
 * 5. Use '{' and '}' for paragraph movement
 * 6. Try Ctrl+f and Ctrl+b for page navigation
 * 7. Use '/' to search for class names
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel;

namespace NvimPractice.Day02.Navigation;

// Navigation target: Try 'gg' to get here quickly
public abstract class BaseEntity
{
    public Guid Id { get; protected set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; protected set; }

    protected virtual void UpdateTimestamp()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}

// Navigation practice: Use 'f' to find 'I' in INotifyPropertyChanged
public abstract class ObservableEntity : BaseEntity, INotifyPropertyChanged
{
    public event PropertyChangedEventHandler? PropertyChanged;

    protected virtual void OnPropertyChanged(string propertyName)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    protected bool SetProperty<T>(ref T field, T value, string propertyName)
    {
        if (EqualityComparer<T>.Default.Equals(field, value))
            return false;

        field = value;
        OnPropertyChanged(propertyName);
        UpdateTimestamp();
        return true;
    }
}

// Try searching for this class with '/Customer'
public class Customer : ObservableEntity
{
    private string _firstName = string.Empty;
    private string _lastName = string.Empty;
    private string _email = string.Empty;
    private CustomerStatus _status = CustomerStatus.Active;

    public string FirstName
    {
        get => _firstName;
        set => SetProperty(ref _firstName, value, nameof(FirstName));
    }

    public string LastName
    {
        get => _lastName;
        set => SetProperty(ref _lastName, value, nameof(LastName));
    }

    public string Email
    {
        get => _email;
        set => SetProperty(ref _email, value, nameof(Email));
    }

    public CustomerStatus Status
    {
        get => _status;
        set => SetProperty(ref _status, value, nameof(Status));
    }

    public string FullName => $"{FirstName} {LastName}";

    public ICollection<Order> Orders { get; init; } = new List<Order>();
}

// Navigation target: Use 'w' to move word by word through this enum
public enum CustomerStatus
{
    Active,
    Inactive,
    Suspended,
    Deleted
}

// Practice '$' to jump to end of long lines in this class
public class Order : ObservableEntity
{
    private decimal _totalAmount;
    private OrderStatus _status = OrderStatus.Pending;
    private DateTime? _shippedAt;
    private DateTime? _deliveredAt;

    public Guid CustomerId { get; init; }
    public Customer? Customer { get; init; }

    public decimal TotalAmount
    {
        get => _totalAmount;
        set => SetProperty(ref _totalAmount, value, nameof(TotalAmount));
    }

    public OrderStatus Status
    {
        get => _status;
        set => SetProperty(ref _status, value, nameof(Status));
    }

    public DateTime? ShippedAt
    {
        get => _shippedAt;
        set => SetProperty(ref _shippedAt, value, nameof(ShippedAt));
    }

    public DateTime? DeliveredAt
    {
        get => _deliveredAt;
        set => SetProperty(ref _deliveredAt, value, nameof(DeliveredAt));
    }

    public ICollection<OrderItem> Items { get; init; } = new List<OrderItem>();

    // Practice 'b' to move backward through words in method names
    public void MarkAsShipped()
    {
        Status = OrderStatus.Shipped;
        ShippedAt = DateTime.UtcNow;
    }

    public void MarkAsDelivered()
    {
        Status = OrderStatus.Delivered;
        DeliveredAt = DateTime.UtcNow;
    }

    public void CancelOrder()
    {
        Status = OrderStatus.Cancelled;
    }
}

// Use '{' and '}' to navigate between these class definitions
public enum OrderStatus
{
    Pending,
    Confirmed,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Returned
}

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; init; }
    public Order? Order { get; init; }

    public Guid ProductId { get; init; }
    public Product? Product { get; init; }

    public int Quantity { get; init; }
    public decimal UnitPrice { get; init; }
    public decimal TotalPrice => Quantity * UnitPrice;
}

// Navigation challenge: Jump here from Customer class using search
public class Product : ObservableEntity
{
    private string _name = string.Empty;
    private string _description = string.Empty;
    private decimal _price;
    private int _stockQuantity;
    private ProductCategory _category = ProductCategory.General;

    public string Name
    {
        get => _name;
        set => SetProperty(ref _name, value, nameof(Name));
    }

    public string Description
    {
        get => _description;
        set => SetProperty(ref _description, value, nameof(Description));
    }

    public decimal Price
    {
        get => _price;
        set => SetProperty(ref _price, value, nameof(Price));
    }

    public int StockQuantity
    {
        get => _stockQuantity;
        set => SetProperty(ref _stockQuantity, value, nameof(StockQuantity));
    }

    public ProductCategory Category
    {
        get => _category;
        set => SetProperty(ref _category, value, nameof(Category));
    }

    public bool IsInStock => StockQuantity > 0;

    public void AdjustStock(int adjustment)
    {
        StockQuantity = Math.Max(0, StockQuantity + adjustment);
    }
}

public enum ProductCategory
{
    General,
    Electronics,
    Clothing,
    Books,
    Sports,
    Home,
    Garden
}

// Practice Ctrl+f and Ctrl+b to scroll through this service class
public class OrderService
{
    private readonly List<Customer> _customers = new();
    private readonly List<Order> _orders = new();
    private readonly List<Product> _products = new();

    public Customer CreateCustomer(string firstName, string lastName, string email)
    {
        var customer = new Customer
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email
        };
        _customers.Add(customer);
        return customer;
    }

    public Product CreateProduct(string name, string description, decimal price, int stock, ProductCategory category)
    {
        var product = new Product
        {
            Name = name,
            Description = description,
            Price = price,
            StockQuantity = stock,
            Category = category
        };
        _products.Add(product);
        return product;
    }

    public Order CreateOrder(Guid customerId)
    {
        var customer = _customers.FirstOrDefault(c => c.Id == customerId);
        if (customer == null)
            throw new ArgumentException("Customer not found", nameof(customerId));

        var order = new Order
        {
            CustomerId = customerId,
            Customer = customer
        };
        _orders.Add(order);
        return order;
    }

    public void AddOrderItem(Guid orderId, Guid productId, int quantity)
    {
        var order = _orders.FirstOrDefault(o => o.Id == orderId);
        var product = _products.FirstOrDefault(p => p.Id == productId);

        if (order == null || product == null)
            throw new ArgumentException("Order or Product not found");

        if (product.StockQuantity < quantity)
            throw new InvalidOperationException("Insufficient stock");

        var orderItem = new OrderItem
        {
            OrderId = orderId,
            Order = order,
            ProductId = productId,
            Product = product,
            Quantity = quantity,
            UnitPrice = product.Price
        };

        order.Items.Add(orderItem);
        product.AdjustStock(-quantity);
        order.TotalAmount = order.Items.Sum(item => item.TotalPrice);
    }

    public IEnumerable<Order> GetOrdersByCustomer(Guid customerId)
    {
        return _orders.Where(o => o.CustomerId == customerId);
    }

    public IEnumerable<Order> GetOrdersByStatus(OrderStatus status)
    {
        return _orders.Where(o => o.Status == status);
    }

    public IEnumerable<Product> GetProductsByCategory(ProductCategory category)
    {
        return _products.Where(p => p.Category == category);
    }

    public IEnumerable<Product> GetLowStockProducts(int threshold = 5)
    {
        return _products.Where(p => p.StockQuantity <= threshold);
    }
}

// Navigation target: Use 'G' to jump to the bottom of the file
public static class NavigationMarkers
{
    // Practice jumping between these constants with search
    public const string NAVIGATION_START = "Use 'gg' to get to the top";
    public const string NAVIGATION_MIDDLE = "Practice word movement here";
    public const string NAVIGATION_END = "Use 'G' to reach the bottom";

    // Last line - try navigating here from the top with 'G'
}