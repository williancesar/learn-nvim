using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using VimPractice.FileOperations.Models;

namespace VimPractice.FileOperations.Repositories;

// Repositories.cs - Data access layer
// Practice: Open this file from Services.cs using :e Repositories.cs
// Navigate between repository interfaces and implementations

/// <summary>
/// Base repository interface with common operations
/// Practice: Use gd to jump between interface and implementation
/// </summary>
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
    Task InitializeAsync();
}

/// <summary>
/// Product repository interface
/// Practice: Navigate between methods using ]] and [[
/// </summary>
public interface IProductRepository : IRepository<Product>
{
    Task<List<Product>> GetFeaturedProductsAsync();
    Task<List<Product>> GetByCategoryAsync(int categoryId);
    Task<Product?> GetBySkuAsync(string sku);
    Task<List<Product>> SearchAsync(string searchTerm);
    Task<bool> UpdateStockAsync(int productId, int newStock);
    Task<bool> HasOrdersAsync(int productId);
    Task<List<Product>> GetLowStockProductsAsync(int threshold = 10);
}

/// <summary>
/// Product repository implementation
/// Practice: Use f{ and f} to navigate between braces
/// </summary>
public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProductRepository> _logger;

    public ProductRepository(ApplicationDbContext context, ILogger<ProductRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task InitializeAsync()
    {
        try
        {
            _logger.LogInformation("Initializing Product repository");

            // Ensure database is created and tables exist
            await _context.Database.EnsureCreatedAsync();

            // Create indexes for better performance
            await CreateIndexesAsync();

            _logger.LogInformation("Product repository initialized successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing Product repository");
            throw;
        }
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        try
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Reviews)
                .ThenInclude(r => r.Customer)
                .FirstOrDefaultAsync(p => p.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product {ProductId}", id);
            throw;
        }
    }

    public async Task<List<Product>> GetAllAsync()
    {
        try
        {
            return await _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsActive)
                .OrderBy(p => p.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all products");
            throw;
        }
    }

    public async Task<List<Product>> GetFeaturedProductsAsync()
    {
        try
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.IsActive && p.IsFeatured)
                .OrderByDescending(p => p.Reviews.Average(r => r.Rating))
                .ThenByDescending(p => p.CreatedAt)
                .Take(20)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving featured products");
            throw;
        }
    }

    public async Task<List<Product>> GetByCategoryAsync(int categoryId)
    {
        try
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.IsActive && p.CategoryId == categoryId)
                .OrderBy(p => p.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving products for category {CategoryId}", categoryId);
            throw;
        }
    }

    public async Task<Product?> GetBySkuAsync(string sku)
    {
        try
        {
            return await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Sku == sku);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving product by SKU {Sku}", sku);
            throw;
        }
    }

    public async Task<List<Product>> SearchAsync(string searchTerm)
    {
        try
        {
            var lowercaseSearchTerm = searchTerm.ToLower();

            return await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Where(p => p.IsActive &&
                           (p.Name.ToLower().Contains(lowercaseSearchTerm) ||
                            p.Description.ToLower().Contains(lowercaseSearchTerm) ||
                            p.Category.Name.ToLower().Contains(lowercaseSearchTerm)))
                .OrderByDescending(p => p.Name.ToLower().StartsWith(lowercaseSearchTerm))
                .ThenBy(p => p.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching products with term {SearchTerm}", searchTerm);
            throw;
        }
    }

    public async Task<Product> CreateAsync(Product entity)
    {
        try
        {
            _context.Products.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating product {ProductName}", entity.Name);
            throw;
        }
    }

    public async Task<Product> UpdateAsync(Product entity)
    {
        try
        {
            _context.Products.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating product {ProductId}", entity.Id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting product {ProductId}", id);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        try
        {
            return await _context.Products.AnyAsync(p => p.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if product {ProductId} exists", id);
            throw;
        }
    }

    public async Task<bool> UpdateStockAsync(int productId, int newStock)
    {
        try
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
                return false;

            product.StockQuantity = newStock;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating stock for product {ProductId}", productId);
            throw;
        }
    }

    public async Task<bool> HasOrdersAsync(int productId)
    {
        try
        {
            return await _context.OrderItems.AnyAsync(oi => oi.ProductId == productId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking orders for product {ProductId}", productId);
            throw;
        }
    }

    public async Task<List<Product>> GetLowStockProductsAsync(int threshold = 10)
    {
        try
        {
            return await _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsActive && p.StockQuantity <= threshold && p.StockQuantity > 0)
                .OrderBy(p => p.StockQuantity)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving low stock products");
            throw;
        }
    }

    private async Task CreateIndexesAsync()
    {
        // Implementation for creating database indexes
        // This would typically be done through migrations in a real application
        await Task.CompletedTask;
    }
}

/// <summary>
/// Customer repository interface
/// Practice: Use * to find all occurrences of ICustomerRepository
/// </summary>
public interface ICustomerRepository : IRepository<Customer>
{
    Task<Customer?> GetByEmailAsync(string email);
    Task<List<Customer>> GetActiveCustomersAsync();
    Task<List<Customer>> GetCustomersWithOrdersAsync();
    Task<List<Customer>> GetCustomersCreatedSinceAsync(DateTime date);
}

/// <summary>
/// Customer repository implementation
/// Practice: Use % to jump between matching brackets
/// </summary>
public class CustomerRepository : ICustomerRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CustomerRepository> _logger;

    public CustomerRepository(ApplicationDbContext context, ILogger<CustomerRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task InitializeAsync()
    {
        try
        {
            _logger.LogInformation("Initializing Customer repository");
            await _context.Database.EnsureCreatedAsync();
            _logger.LogInformation("Customer repository initialized successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing Customer repository");
            throw;
        }
    }

    public async Task<Customer?> GetByIdAsync(int id)
    {
        try
        {
            return await _context.Customers
                .Include(c => c.Addresses)
                .Include(c => c.Orders)
                .ThenInclude(o => o.OrderItems)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customer {CustomerId}", id);
            throw;
        }
    }

    public async Task<Customer?> GetByEmailAsync(string email)
    {
        try
        {
            return await _context.Customers
                .Include(c => c.Addresses)
                .FirstOrDefaultAsync(c => c.Email.ToLower() == email.ToLower());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customer by email {Email}", email);
            throw;
        }
    }

    public async Task<List<Customer>> GetAllAsync()
    {
        try
        {
            return await _context.Customers
                .OrderBy(c => c.LastName)
                .ThenBy(c => c.FirstName)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all customers");
            throw;
        }
    }

    public async Task<List<Customer>> GetActiveCustomersAsync()
    {
        try
        {
            return await _context.Customers
                .Where(c => c.IsActive)
                .OrderBy(c => c.LastName)
                .ThenBy(c => c.FirstName)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active customers");
            throw;
        }
    }

    public async Task<List<Customer>> GetCustomersWithOrdersAsync()
    {
        try
        {
            return await _context.Customers
                .Include(c => c.Orders)
                .Where(c => c.IsActive && c.Orders.Any())
                .OrderByDescending(c => c.Orders.Count)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customers with orders");
            throw;
        }
    }

    public async Task<List<Customer>> GetCustomersCreatedSinceAsync(DateTime date)
    {
        try
        {
            return await _context.Customers
                .Where(c => c.CreatedAt >= date)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving customers created since {Date}", date);
            throw;
        }
    }

    public async Task<Customer> CreateAsync(Customer entity)
    {
        try
        {
            _context.Customers.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating customer {Email}", entity.Email);
            throw;
        }
    }

    public async Task<Customer> UpdateAsync(Customer entity)
    {
        try
        {
            _context.Customers.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating customer {CustomerId}", entity.Id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return false;

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting customer {CustomerId}", id);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        try
        {
            return await _context.Customers.AnyAsync(c => c.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if customer {CustomerId} exists", id);
            throw;
        }
    }
}

/// <summary>
/// Order repository interface
/// Practice: Use /interface to find interface definitions
/// </summary>
public interface IOrderRepository : IRepository<Order>
{
    Task<List<Order>> GetByCustomerAsync(int customerId);
    Task<List<Order>> GetOrdersSinceAsync(DateTime date);
    Task<List<Order>> GetOrdersByStatusAsync(OrderStatus status);
    Task<string> GenerateOrderNumberAsync();
    Task<int> GetNextSequenceNumberAsync();
    Task<List<Order>> GetOrdersWithItemsAsync();
}

/// <summary>
/// Order repository implementation
/// Practice: Use w/b to move by words, e/ge to move to end of words
/// </summary>
public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OrderRepository> _logger;

    public OrderRepository(ApplicationDbContext context, ILogger<OrderRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task InitializeAsync()
    {
        try
        {
            _logger.LogInformation("Initializing Order repository");
            await _context.Database.EnsureCreatedAsync();
            _logger.LogInformation("Order repository initialized successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing Order repository");
            throw;
        }
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        try
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.ShippingAddress)
                .Include(o => o.BillingAddress)
                .Include(o => o.Payments)
                .FirstOrDefaultAsync(o => o.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving order {OrderId}", id);
            throw;
        }
    }

    public async Task<List<Order>> GetAllAsync()
    {
        try
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all orders");
            throw;
        }
    }

    public async Task<List<Order>> GetByCustomerAsync(int customerId)
    {
        try
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving orders for customer {CustomerId}", customerId);
            throw;
        }
    }

    public async Task<List<Order>> GetOrdersSinceAsync(DateTime date)
    {
        try
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .Where(o => o.CreatedAt >= date)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving orders since {Date}", date);
            throw;
        }
    }

    public async Task<List<Order>> GetOrdersByStatusAsync(OrderStatus status)
    {
        try
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .Where(o => o.Status == status)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving orders with status {Status}", status);
            throw;
        }
    }

    public async Task<List<Order>> GetOrdersWithItemsAsync()
    {
        try
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.OrderItems.Any())
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving orders with items");
            throw;
        }
    }

    public async Task<Order> CreateAsync(Order entity)
    {
        try
        {
            _context.Orders.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order for customer {CustomerId}", entity.CustomerId);
            throw;
        }
    }

    public async Task<Order> UpdateAsync(Order entity)
    {
        try
        {
            _context.Orders.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order {OrderId}", entity.Id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return false;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting order {OrderId}", id);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        try
        {
            return await _context.Orders.AnyAsync(o => o.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if order {OrderId} exists", id);
            throw;
        }
    }

    public async Task<string> GenerateOrderNumberAsync()
    {
        try
        {
            var sequence = await GetNextSequenceNumberAsync();
            var today = DateTime.UtcNow.ToString("yyyyMMdd");
            return $"ORD{today}{sequence:D4}";
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating order number");
            throw;
        }
    }

    public async Task<int> GetNextSequenceNumberAsync()
    {
        try
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var todayOrderCount = await _context.Orders
                .CountAsync(o => o.CreatedAt >= today && o.CreatedAt < tomorrow);

            return todayOrderCount + 1;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting next sequence number");
            throw;
        }
    }
}

/// <summary>
/// Category repository interface
/// Practice: Use gg to go to top, G to go to bottom of file
/// </summary>
public interface ICategoryRepository : IRepository<Category>
{
    Task<List<Category>> GetActiveCategoriesAsync();
    Task<List<Category>> GetTopLevelCategoriesAsync();
    Task<List<Category>> GetSubCategoriesAsync(int parentId);
    Task<Category?> GetBySlugAsync(string slug);
}

/// <summary>
/// Category repository implementation
/// Practice: Use :number to jump to specific line number
/// </summary>
public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<CategoryRepository> _logger;

    public CategoryRepository(ApplicationDbContext context, ILogger<CategoryRepository> logger)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task InitializeAsync()
    {
        try
        {
            _logger.LogInformation("Initializing Category repository");
            await _context.Database.EnsureCreatedAsync();
            _logger.LogInformation("Category repository initialized successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initializing Category repository");
            throw;
        }
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        try
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category {CategoryId}", id);
            throw;
        }
    }

    public async Task<List<Category>> GetAllAsync()
    {
        try
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all categories");
            throw;
        }
    }

    public async Task<List<Category>> GetActiveCategoriesAsync()
    {
        try
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Where(c => c.IsActive)
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving active categories");
            throw;
        }
    }

    public async Task<List<Category>> GetTopLevelCategoriesAsync()
    {
        try
        {
            return await _context.Categories
                .Include(c => c.SubCategories)
                .Where(c => c.IsActive && c.ParentCategoryId == null)
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving top-level categories");
            throw;
        }
    }

    public async Task<List<Category>> GetSubCategoriesAsync(int parentId)
    {
        try
        {
            return await _context.Categories
                .Where(c => c.IsActive && c.ParentCategoryId == parentId)
                .OrderBy(c => c.SortOrder)
                .ThenBy(c => c.Name)
                .ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving subcategories for parent {ParentId}", parentId);
            throw;
        }
    }

    public async Task<Category?> GetBySlugAsync(string slug)
    {
        try
        {
            return await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.Slug == slug);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving category by slug {Slug}", slug);
            throw;
        }
    }

    public async Task<Category> CreateAsync(Category entity)
    {
        try
        {
            _context.Categories.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating category {CategoryName}", entity.Name);
            throw;
        }
    }

    public async Task<Category> UpdateAsync(Category entity)
    {
        try
        {
            _context.Categories.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating category {CategoryId}", entity.Id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(int id)
    {
        try
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return false;

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting category {CategoryId}", id);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(int id)
    {
        try
        {
            return await _context.Categories.AnyAsync(c => c.Id == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if category {CategoryId} exists", id);
            throw;
        }
    }
}

/// <summary>
/// Entity Framework DbContext
/// Practice: Use H/M/L to move to top/middle/bottom of viewport
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<ShoppingCart> ShoppingCarts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<ProductReview> ProductReviews { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure entity relationships and constraints
        ConfigureProductEntity(modelBuilder);
        ConfigureCustomerEntity(modelBuilder);
        ConfigureOrderEntity(modelBuilder);
        ConfigureCategoryEntity(modelBuilder);
        ConfigureAddressEntity(modelBuilder);
        ConfigureShoppingCartEntity(modelBuilder);
        ConfigureProductImageEntity(modelBuilder);
        ConfigureProductReviewEntity(modelBuilder);
        ConfigurePaymentEntity(modelBuilder);
    }

    private static void ConfigureProductEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Sku).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Category)
                  .WithMany(e => e.Products)
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.Sku).IsUnique();
            entity.HasIndex(e => e.Name);
        });
    }

    private static void ConfigureCustomerEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(256);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);

            entity.HasIndex(e => e.Email).IsUnique();
        });
    }

    private static void ConfigureOrderEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OrderNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.SubtotalAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TaxAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.ShippingAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Customer)
                  .WithMany(e => e.Orders)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.OrderNumber).IsUnique();
            entity.HasIndex(e => e.CustomerId);
        });
    }

    private static void ConfigureCategoryEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);

            entity.HasOne(e => e.ParentCategory)
                  .WithMany(e => e.SubCategories)
                  .HasForeignKey(e => e.ParentCategoryId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.Slug);
        });
    }

    private static void ConfigureAddressEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AddressLine1).IsRequired().HasMaxLength(200);
            entity.Property(e => e.City).IsRequired().HasMaxLength(100);
            entity.Property(e => e.State).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PostalCode).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Country).IsRequired().HasMaxLength(50);

            entity.HasOne(e => e.Customer)
                  .WithMany(e => e.Addresses)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureShoppingCartEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ShoppingCart>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Customer)
                  .WithOne(e => e.ShoppingCart)
                  .HasForeignKey<ShoppingCart>(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureProductImageEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.ImageUrl).IsRequired().HasMaxLength(500);

            entity.HasOne(e => e.Product)
                  .WithMany(e => e.Images)
                  .HasForeignKey(e => e.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureProductReviewEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProductReview>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Product)
                  .WithMany(e => e.Reviews)
                  .HasForeignKey(e => e.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Customer)
                  .WithMany(e => e.Reviews)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigurePaymentEntity(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");

            entity.HasOne(e => e.Order)
                  .WithMany(e => e.Payments)
                  .HasForeignKey(e => e.OrderId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

// Practice Instructions for this file:
// 1. Navigate between repository interfaces and implementations using ]] and [[
// 2. Use gd to jump to method definitions from interfaces
// 3. Search for specific methods using /MethodName
// 4. Find all usages of a repository interface with *
// 5. Use f{ to find opening braces, f} for closing braces
// 6. Practice opening related files:
//    - :e Models.cs (to see the entities being managed)
//    - :sp Services.cs (to see how repositories are used)
//    - :vs Controllers.cs (to see the full application flow)
//    - :tabnew Configuration.cs (to see dependency injection setup)