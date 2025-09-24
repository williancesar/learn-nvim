using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace VimPractice.VisualMode;

// Practice file for Day 10: Visual Mode Selection
// This file contains classes and methods designed for practicing visual selections
// Practice: v (character), V (line), Ctrl-v (block), gv (reselect)

/// <summary>
/// E-commerce system with multiple classes for visual selection practice
/// Focus on selecting: entire methods, class definitions, properties, attributes, parameters
/// </summary>
public class ProductCatalogService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProductCatalogService> _logger;
    private readonly ICacheService _cache;
    private readonly IImageProcessingService _imageService;

    public ProductCatalogService(
        ApplicationDbContext context,
        ILogger<ProductCatalogService> logger,
        ICacheService cache,
        IImageProcessingService imageService)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        _imageService = imageService ?? throw new ArgumentNullException(nameof(imageService));
    }

    // Practice selecting entire method (V + motion)
    public async Task<PagedResult<ProductDto>> GetProductsAsync(
        ProductSearchCriteria criteria,
        PaginationParameters pagination,
        CancellationToken cancellationToken = default)
    {
        var cacheKey = $"products:{criteria.GetHashCode()}:{pagination.GetHashCode()}";

        var cachedResult = await _cache.GetAsync<PagedResult<ProductDto>>(cacheKey, cancellationToken);
        if (cachedResult != null)
        {
            _logger.LogDebug("Returning cached products for key: {CacheKey}", cacheKey);
            return cachedResult;
        }

        var query = _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Reviews)
            .AsQueryable();

        // Apply filters
        if (!string.IsNullOrEmpty(criteria.SearchTerm))
        {
            query = query.Where(p =>
                p.Name.Contains(criteria.SearchTerm) ||
                p.Description.Contains(criteria.SearchTerm) ||
                p.Category.Name.Contains(criteria.SearchTerm));
        }

        if (criteria.CategoryId.HasValue)
        {
            query = query.Where(p => p.CategoryId == criteria.CategoryId.Value);
        }

        if (criteria.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= criteria.MinPrice.Value);
        }

        if (criteria.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= criteria.MaxPrice.Value);
        }

        if (criteria.InStock.HasValue && criteria.InStock.Value)
        {
            query = query.Where(p => p.StockQuantity > 0);
        }

        // Apply sorting
        query = criteria.SortBy switch
        {
            ProductSortOption.Name => criteria.SortDescending
                ? query.OrderByDescending(p => p.Name)
                : query.OrderBy(p => p.Name),
            ProductSortOption.Price => criteria.SortDescending
                ? query.OrderByDescending(p => p.Price)
                : query.OrderBy(p => p.Price),
            ProductSortOption.CreatedDate => criteria.SortDescending
                ? query.OrderByDescending(p => p.CreatedAt)
                : query.OrderBy(p => p.CreatedAt),
            ProductSortOption.Rating => criteria.SortDescending
                ? query.OrderByDescending(p => p.Reviews.Average(r => r.Rating))
                : query.OrderBy(p => p.Reviews.Average(r => r.Rating)),
            _ => query.OrderBy(p => p.Id)
        };

        var totalCount = await query.CountAsync(cancellationToken);

        var products = await query
            .Skip(pagination.Skip)
            .Take(pagination.Take)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                CategoryName = p.Category.Name,
                ImageUrls = p.Images.Select(i => i.Url).ToList(),
                AverageRating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0,
                ReviewCount = p.Reviews.Count,
                CreatedAt = p.CreatedAt,
                IsInStock = p.StockQuantity > 0
            })
            .ToListAsync(cancellationToken);

        var result = new PagedResult<ProductDto>
        {
            Items = products,
            TotalCount = totalCount,
            PageNumber = pagination.PageNumber,
            PageSize = pagination.PageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pagination.PageSize)
        };

        await _cache.SetAsync(cacheKey, result, TimeSpan.FromMinutes(15), cancellationToken);

        return result;
    }

    // Practice selecting method parameters (visual select inside parentheses)
    public async Task<ProductDetailDto> GetProductDetailAsync(
        int productId,
        bool includeReviews = true,
        bool includeRelatedProducts = true,
        bool includeSpecifications = true,
        CancellationToken cancellationToken = default)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Include(p => p.Images)
            .Include(p => p.Specifications)
            .Include(p => p.Reviews)
                .ThenInclude(r => r.Customer)
            .FirstOrDefaultAsync(p => p.Id == productId, cancellationToken);

        if (product == null)
        {
            throw new ProductNotFoundException($"Product with ID {productId} not found");
        }

        var productDetail = new ProductDetailDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            LongDescription = product.LongDescription,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            Sku = product.Sku,
            CategoryName = product.Category.Name,
            CategoryId = product.CategoryId,
            ImageUrls = product.Images.OrderBy(i => i.SortOrder).Select(i => i.Url).ToList(),
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt,
            IsInStock = product.StockQuantity > 0
        };

        if (includeSpecifications)
        {
            productDetail.Specifications = product.Specifications
                .ToDictionary(s => s.Name, s => s.Value);
        }

        if (includeReviews)
        {
            productDetail.Reviews = product.Reviews
                .OrderByDescending(r => r.CreatedAt)
                .Take(10)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Rating = r.Rating,
                    Title = r.Title,
                    Comment = r.Comment,
                    CustomerName = r.Customer.DisplayName,
                    CreatedAt = r.CreatedAt,
                    IsVerifiedPurchase = r.IsVerifiedPurchase
                })
                .ToList();

            productDetail.AverageRating = product.Reviews.Any()
                ? product.Reviews.Average(r => r.Rating)
                : 0;
            productDetail.ReviewCount = product.Reviews.Count;
        }

        if (includeRelatedProducts)
        {
            productDetail.RelatedProducts = await GetRelatedProductsAsync(
                productId,
                product.CategoryId,
                cancellationToken);
        }

        return productDetail;
    }

    // Practice selecting LINQ queries (multiple lines)
    private async Task<List<RelatedProductDto>> GetRelatedProductsAsync(
        int excludeProductId,
        int categoryId,
        CancellationToken cancellationToken)
    {
        return await _context.Products
            .Where(p => p.Id != excludeProductId &&
                       p.CategoryId == categoryId &&
                       p.StockQuantity > 0)
            .OrderByDescending(p => p.Reviews.Average(r => r.Rating))
            .ThenByDescending(p => p.Reviews.Count)
            .Take(5)
            .Select(p => new RelatedProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                ImageUrl = p.Images.OrderBy(i => i.SortOrder).First().Url,
                AverageRating = p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0
            })
            .ToListAsync(cancellationToken);
    }

    // Practice selecting attributes and their parameters
    [HttpPost("products")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ProductDto> CreateProductAsync(
        [FromBody] CreateProductRequest request,
        CancellationToken cancellationToken = default)
    {
        var validationResult = await ValidateCreateProductRequestAsync(request, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var product = new Product
        {
            Name = request.Name,
            Description = request.Description,
            LongDescription = request.LongDescription,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            Sku = await GenerateSkuAsync(request.CategoryId, cancellationToken),
            CategoryId = request.CategoryId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        // Process images
        if (request.ImageUrls != null && request.ImageUrls.Any())
        {
            var images = request.ImageUrls.Select((url, index) => new ProductImage
            {
                ProductId = product.Id,
                Url = url,
                SortOrder = index,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.ProductImages.AddRange(images);
        }

        // Process specifications
        if (request.Specifications != null && request.Specifications.Any())
        {
            var specifications = request.Specifications.Select(spec => new ProductSpecification
            {
                ProductId = product.Id,
                Name = spec.Key,
                Value = spec.Value,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.ProductSpecifications.AddRange(specifications);
        }

        await _context.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created product {ProductId} with name {ProductName}",
            product.Id, product.Name);

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            CreatedAt = product.CreatedAt,
            IsInStock = product.StockQuantity > 0
        };
    }
}

// Practice selecting entire class definitions
public class Product
{
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? LongDescription { get; set; }

    [Required]
    [Range(0.01, 999999.99)]
    public decimal Price { get; set; }

    [Range(0, int.MaxValue)]
    public int StockQuantity { get; set; }

    [Required]
    [StringLength(50)]
    public string Sku { get; set; } = string.Empty;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties for practice selecting collections
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductSpecification> Specifications { get; set; } = new List<ProductSpecification>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}

// Practice selecting record definitions and primary constructors
public record ProductDto(
    int Id,
    string Name,
    string Description,
    decimal Price,
    int StockQuantity,
    string CategoryName,
    List<string> ImageUrls,
    double AverageRating,
    int ReviewCount,
    DateTime CreatedAt,
    bool IsInStock);

// Practice selecting complex record with body
public record CreateProductRequest
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    public string Name { get; init; } = string.Empty;

    [Required]
    [StringLength(500, MinimumLength = 10)]
    public string Description { get; init; } = string.Empty;

    [StringLength(2000)]
    public string? LongDescription { get; init; }

    [Required]
    [Range(0.01, 999999.99)]
    public decimal Price { get; init; }

    [Required]
    [Range(0, int.MaxValue)]
    public int StockQuantity { get; init; }

    [Required]
    [Range(1, int.MaxValue)]
    public int CategoryId { get; init; }

    public List<string>? ImageUrls { get; init; }
    public Dictionary<string, string>? Specifications { get; init; }
}

// Practice selecting enums and their values
public enum ProductSortOption
{
    Name,
    Price,
    CreatedDate,
    Rating,
    StockQuantity,
    CategoryName
}

// Practice selecting switch expressions
public static class ProductExtensions
{
    public static string GetDisplayText(this ProductSortOption sortOption) => sortOption switch
    {
        ProductSortOption.Name => "Product Name",
        ProductSortOption.Price => "Price",
        ProductSortOption.CreatedDate => "Date Added",
        ProductSortOption.Rating => "Customer Rating",
        ProductSortOption.StockQuantity => "Stock Level",
        ProductSortOption.CategoryName => "Category",
        _ => "Unknown"
    };

    public static bool IsValidSortOption(this ProductSortOption sortOption) => sortOption switch
    {
        ProductSortOption.Name or
        ProductSortOption.Price or
        ProductSortOption.CreatedDate or
        ProductSortOption.Rating => true,
        _ => false
    };
}

// Practice Instructions for Visual Mode:
// v - Character visual mode: select characters
// V - Line visual mode: select entire lines
// Ctrl-v - Block visual mode: select rectangular blocks
// gv - Reselect last visual selection
// o - Move to other end of selection
// > - Indent selection
// < - Unindent selection
// = - Auto-indent selection
// y - Yank (copy) selection
// d - Delete selection
// c - Change selection
//
// Practice targets:
// 1. Select entire methods (V + motion)
// 2. Select method parameters (vi( or va()
// 3. Select class definitions (V + motion)
// 4. Select attributes and decorators
// 5. Select LINQ query chains
// 6. Select property definitions
// 7. Select using statements block
// 8. Select namespace content