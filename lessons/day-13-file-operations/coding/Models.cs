using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace VimPractice.FileOperations.Models;

// Models.cs - Data models and entities
// Practice: Open this file from practice.cs using :e Models.cs
// Navigate to different models using /Product, /Customer, /Order, etc.

/// <summary>
/// Product entity representing items in the catalog
/// Practice navigating: gd on Product to find definition, * to find all usages
/// </summary>
public class Product
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [StringLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [Required]
    [StringLength(50)]
    public string Sku { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;

    public int CategoryId { get; set; }
    [ForeignKey(nameof(CategoryId))]
    public virtual Category? Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public virtual ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public virtual ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    // Calculated properties
    [NotMapped]
    public decimal AverageRating => Reviews.Any() ? Reviews.Average(r => r.Rating) : 0;

    [NotMapped]
    public int ReviewCount => Reviews.Count;

    [NotMapped]
    public bool IsInStock => StockQuantity > 0;

    [NotMapped]
    public bool IsLowStock => StockQuantity > 0 && StockQuantity <= 10;
}

/// <summary>
/// Customer entity for user management
/// Practice: Navigate here from Product using ]] or search /Customer
/// </summary>
public class Customer
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string Email { get; set; } = string.Empty;

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [Required]
    [StringLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    public bool IsEmailVerified { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();
    public virtual ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();
    public virtual ShoppingCart? ShoppingCart { get; set; }

    // Calculated properties
    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";

    [NotMapped]
    public int TotalOrders => Orders.Count;

    [NotMapped]
    public decimal TotalSpent => Orders.Where(o => o.Status == OrderStatus.Completed)
                                     .Sum(o => o.TotalAmount);
}

/// <summary>
/// Order entity for purchase transactions
/// Practice: Use f{ and f} to navigate between braces, or use % to match brackets
/// </summary>
public class Order
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string OrderNumber { get; set; } = string.Empty;

    public int CustomerId { get; set; }
    [ForeignKey(nameof(CustomerId))]
    public virtual Customer? Customer { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal SubtotalAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TaxAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ShippingAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal DiscountAmount { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public int? ShippingAddressId { get; set; }
    [ForeignKey(nameof(ShippingAddressId))]
    public virtual Address? ShippingAddress { get; set; }

    public int? BillingAddressId { get; set; }
    [ForeignKey(nameof(BillingAddressId))]
    public virtual Address? BillingAddress { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    // Navigation properties
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    // Calculated properties
    [NotMapped]
    public int TotalItems => OrderItems.Sum(oi => oi.Quantity);

    [NotMapped]
    public bool IsShipped => ShippedAt.HasValue;

    [NotMapped]
    public bool IsDelivered => DeliveredAt.HasValue;
}

/// <summary>
/// Category entity for product organization
/// Practice: Use ) and ( to navigate by sentences, or { and } for paragraphs
/// </summary>
public class Category
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [StringLength(50)]
    public string? Slug { get; set; }

    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;

    public int? ParentCategoryId { get; set; }
    [ForeignKey(nameof(ParentCategoryId))]
    public virtual Category? ParentCategory { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();

    // Calculated properties
    [NotMapped]
    public int ProductCount => Products.Count(p => p.IsActive);

    [NotMapped]
    public bool HasSubCategories => SubCategories.Any();

    [NotMapped]
    public string FullPath => ParentCategory != null
        ? $"{ParentCategory.FullPath} > {Name}"
        : Name;
}

/// <summary>
/// OrderItem entity for individual items in orders
/// Practice: Use w/W to move by words, b/B to move backward by words
/// </summary>
public class OrderItem
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int OrderId { get; set; }
    [ForeignKey(nameof(OrderId))]
    public virtual Order? Order { get; set; }

    public int ProductId { get; set; }
    [ForeignKey(nameof(ProductId))]
    public virtual Product? Product { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalPrice { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Calculated properties
    [NotMapped]
    public decimal LineTotal => Quantity * UnitPrice;
}

/// <summary>
/// Address entity for shipping and billing
/// Practice: Use gg to go to top, G to go to bottom, :number to go to specific line
/// </summary>
public class Address
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int CustomerId { get; set; }
    [ForeignKey(nameof(CustomerId))]
    public virtual Customer? Customer { get; set; }

    [Required]
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string AddressLine1 { get; set; } = string.Empty;

    [StringLength(200)]
    public string? AddressLine2 { get; set; }

    [Required]
    [StringLength(100)]
    public string City { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string State { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string PostalCode { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string Country { get; set; } = string.Empty;

    [Phone]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    public bool IsDefault { get; set; } = false;
    public AddressType Type { get; set; } = AddressType.Both;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Calculated properties
    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";

    [NotMapped]
    public string FormattedAddress => $"{AddressLine1}, {City}, {State} {PostalCode}, {Country}";
}

/// <summary>
/// Shopping cart entity for temporary item storage
/// Practice: Use H/M/L to move to top/middle/bottom of screen
/// </summary>
public class ShoppingCart
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int CustomerId { get; set; }
    [ForeignKey(nameof(CustomerId))]
    public virtual Customer? Customer { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();

    // Calculated properties
    [NotMapped]
    public int TotalItems => CartItems.Sum(ci => ci.Quantity);

    [NotMapped]
    public decimal TotalAmount => CartItems.Sum(ci => ci.TotalPrice);

    [NotMapped]
    public bool IsEmpty => !CartItems.Any();
}

/// <summary>
/// Cart item entity for items in shopping cart
/// Practice: Use Ctrl-f/Ctrl-b for page up/down, Ctrl-d/Ctrl-u for half page
/// </summary>
public class CartItem
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ShoppingCartId { get; set; }
    [ForeignKey(nameof(ShoppingCartId))]
    public virtual ShoppingCart? ShoppingCart { get; set; }

    public int ProductId { get; set; }
    [ForeignKey(nameof(ProductId))]
    public virtual Product? Product { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Calculated properties
    [NotMapped]
    public decimal TotalPrice => Quantity * UnitPrice;
}

// Enumerations
public enum OrderStatus
{
    Pending = 0,
    Processing = 1,
    Shipped = 2,
    Delivered = 3,
    Cancelled = 4,
    Returned = 5
}

public enum AddressType
{
    Shipping = 0,
    Billing = 1,
    Both = 2
}

public enum PaymentStatus
{
    Pending = 0,
    Processing = 1,
    Completed = 2,
    Failed = 3,
    Cancelled = 4,
    Refunded = 5
}

public enum PaymentMethod
{
    CreditCard = 0,
    DebitCard = 1,
    PayPal = 2,
    BankTransfer = 3,
    Cash = 4
}

// Additional supporting models
public class ProductImage
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ProductId { get; set; }
    [ForeignKey(nameof(ProductId))]
    public virtual Product? Product { get; set; }

    [Required]
    [StringLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [StringLength(200)]
    public string? AltText { get; set; }

    public int SortOrder { get; set; } = 0;
    public bool IsPrimary { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class ProductReview
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ProductId { get; set; }
    [ForeignKey(nameof(ProductId))]
    public virtual Product? Product { get; set; }

    public int CustomerId { get; set; }
    [ForeignKey(nameof(CustomerId))]
    public virtual Customer? Customer { get; set; }

    [Range(1, 5)]
    public int Rating { get; set; }

    [StringLength(200)]
    public string? Title { get; set; }

    [StringLength(2000)]
    public string? Comment { get; set; }

    public bool IsVerified { get; set; } = false;
    public bool IsApproved { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class Payment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int OrderId { get; set; }
    [ForeignKey(nameof(OrderId))]
    public virtual Order? Order { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    public PaymentMethod Method { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    [StringLength(100)]
    public string? TransactionId { get; set; }

    [StringLength(100)]
    public string? GatewayReference { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
}

// Practice Instructions for this file:
// 1. Navigate between classes using ]] and [[
// 2. Search for specific models using /ModelName
// 3. Jump to method definitions with gd
// 4. Find all references with *
// 5. Use f{ to find opening braces, f} for closing braces
// 6. Navigate properties with j/k, move by words with w/b
// 7. Practice opening related files:
//    - :e Services.cs (to see how these models are used)
//    - :sp Repositories.cs (to see data access)
//    - :vs Controllers.cs (to see API endpoints)