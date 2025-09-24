using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel;

namespace AdvancedTextObjectsPractice
{
    /// <summary>
    /// Practice file for advanced text objects with XML comments and regions
    /// Focus on navigating and manipulating XML documentation comments
    /// Practice with #region blocks, method documentation, and complex commenting structures
    /// </summary>

    #region Data Models and Entities

    /// <summary>
    /// Represents a product in the e-commerce system
    /// </summary>
    /// <remarks>
    /// This class encapsulates all product-related information including
    /// pricing, inventory, and categorization details.
    /// </remarks>
    public class Product
    {
        /// <summary>
        /// Gets or sets the unique identifier for the product
        /// </summary>
        /// <value>A positive integer representing the product ID</value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the product name
        /// </summary>
        /// <value>A non-empty string representing the product name</value>
        /// <exception cref="ArgumentException">Thrown when the name is null or empty</exception>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the detailed product description
        /// </summary>
        /// <value>A string containing the product description, may be null</value>
        /// <remarks>
        /// The description supports markdown formatting and should provide
        /// comprehensive information about the product features and benefits.
        /// </remarks>
        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the product price
        /// </summary>
        /// <value>A decimal value representing the price in the base currency</value>
        /// <exception cref="ArgumentOutOfRangeException">Thrown when price is negative</exception>
        public decimal Price { get; set; }

        /// <summary>
        /// Gets or sets the current stock quantity
        /// </summary>
        /// <value>An integer representing available inventory count</value>
        /// <remarks>
        /// When stock reaches zero, the product should be marked as out of stock.
        /// Negative values indicate backordered quantities.
        /// </remarks>
        public int StockQuantity { get; set; }

        /// <summary>
        /// Gets or sets the product category identifier
        /// </summary>
        /// <value>A positive integer referencing the category table</value>
        /// <seealso cref="Category"/>
        public int CategoryId { get; set; }

        /// <summary>
        /// Gets or sets the navigation property to the product category
        /// </summary>
        /// <value>A <see cref="Category"/> instance or null if not loaded</value>
        public Category? Category { get; set; }

        /// <summary>
        /// Gets or sets the product creation timestamp
        /// </summary>
        /// <value>A UTC datetime when the product was created</value>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the last modification timestamp
        /// </summary>
        /// <value>A UTC datetime when the product was last updated, or null if never updated</value>
        public DateTime? ModifiedDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the product is currently active
        /// </summary>
        /// <value><c>true</c> if the product is active; otherwise, <c>false</c></value>
        /// <remarks>
        /// Inactive products are not displayed in the public catalog but
        /// remain in the system for historical order tracking.
        /// </remarks>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets the collection of product reviews
        /// </summary>
        /// <value>A collection of <see cref="ProductReview"/> instances</value>
        public ICollection<ProductReview> Reviews { get; set; } = new List<ProductReview>();

        /// <summary>
        /// Gets the average rating based on customer reviews
        /// </summary>
        /// <value>A decimal between 0 and 5 representing the average rating</value>
        /// <returns>The calculated average or 0 if no reviews exist</returns>
        public decimal AverageRating => Reviews.Any() ? Reviews.Average(r => r.Rating) : 0;

        /// <summary>
        /// Gets a value indicating whether the product is in stock
        /// </summary>
        /// <value><c>true</c> if stock quantity is greater than zero; otherwise, <c>false</c></value>
        public bool IsInStock => StockQuantity > 0;
    }

    /// <summary>
    /// Represents a product category for organizational purposes
    /// </summary>
    /// <remarks>
    /// Categories form a hierarchical structure supporting nested subcategories
    /// for flexible product organization.
    /// </remarks>
    public class Category
    {
        /// <summary>
        /// Gets or sets the unique category identifier
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the category name
        /// </summary>
        /// <value>A unique, non-empty string identifying the category</value>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the category description
        /// </summary>
        /// <value>An optional description providing category details</value>
        public string? Description { get; set; }

        /// <summary>
        /// Gets or sets the parent category identifier
        /// </summary>
        /// <value>The ID of the parent category, or null for top-level categories</value>
        /// <remarks>
        /// This creates a tree structure where categories can have subcategories.
        /// A null value indicates this is a root-level category.
        /// </remarks>
        public int? ParentCategoryId { get; set; }

        /// <summary>
        /// Gets or sets the navigation property to the parent category
        /// </summary>
        /// <value>The parent <see cref="Category"/> instance or null for root categories</value>
        public Category? ParentCategory { get; set; }

        /// <summary>
        /// Gets or sets the collection of child categories
        /// </summary>
        /// <value>A collection of subcategories under this category</value>
        public ICollection<Category> SubCategories { get; set; } = new List<Category>();

        /// <summary>
        /// Gets or sets the collection of products in this category
        /// </summary>
        /// <value>A collection of <see cref="Product"/> instances</value>
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }

    #endregion

    #region Review and Rating System

    /// <summary>
    /// Represents a customer review for a product
    /// </summary>
    /// <remarks>
    /// Reviews include both a numeric rating and optional text feedback
    /// to help other customers make informed purchasing decisions.
    /// </remarks>
    public class ProductReview
    {
        /// <summary>
        /// Gets or sets the unique review identifier
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the product being reviewed
        /// </summary>
        /// <value>A positive integer referencing the product table</value>
        public int ProductId { get; set; }

        /// <summary>
        /// Gets or sets the navigation property to the reviewed product
        /// </summary>
        /// <value>The <see cref="Product"/> instance being reviewed</value>
        public Product? Product { get; set; }

        /// <summary>
        /// Gets or sets the customer who wrote the review
        /// </summary>
        /// <value>A positive integer referencing the customer table</value>
        public int CustomerId { get; set; }

        /// <summary>
        /// Gets or sets the numeric rating given by the customer
        /// </summary>
        /// <value>An integer between 1 and 5 inclusive</value>
        /// <exception cref="ArgumentOutOfRangeException">Thrown when rating is outside 1-5 range</exception>
        /// <remarks>
        /// The rating scale is:
        /// 1 - Poor
        /// 2 - Fair
        /// 3 - Good
        /// 4 - Very Good
        /// 5 - Excellent
        /// </remarks>
        public int Rating { get; set; }

        /// <summary>
        /// Gets or sets the review title or headline
        /// </summary>
        /// <value>A brief summary of the review, may be null</value>
        /// <remarks>
        /// The title should be concise and capture the essence of the review.
        /// Maximum recommended length is 100 characters.
        /// </remarks>
        public string? Title { get; set; }

        /// <summary>
        /// Gets or sets the detailed review text
        /// </summary>
        /// <value>The customer's detailed feedback about the product</value>
        /// <remarks>
        /// This field supports rich text formatting and should contain
        /// the customer's detailed experience with the product.
        /// </remarks>
        public string? ReviewText { get; set; }

        /// <summary>
        /// Gets or sets the date when the review was submitted
        /// </summary>
        /// <value>A UTC datetime representing the review submission time</value>
        public DateTime ReviewDate { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the review is verified
        /// </summary>
        /// <value><c>true</c> if the reviewer purchased the product; otherwise, <c>false</c></value>
        /// <remarks>
        /// Verified reviews carry more weight in the overall product rating
        /// and are displayed with a special indicator to other customers.
        /// </remarks>
        public bool IsVerifiedPurchase { get; set; }

        /// <summary>
        /// Gets or sets the number of helpful votes this review received
        /// </summary>
        /// <value>A non-negative integer representing helpful vote count</value>
        /// <remarks>
        /// Other customers can vote on whether a review was helpful,
        /// which affects the review's display order and prominence.
        /// </remarks>
        public int HelpfulVotes { get; set; }
    }

    #endregion

    #region Business Logic Services

    /// <summary>
    /// Provides business logic operations for product management
    /// </summary>
    /// <remarks>
    /// This service encapsulates all product-related business rules and operations,
    /// including inventory management, pricing calculations, and availability checks.
    /// </remarks>
    public class ProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IInventoryService _inventoryService;
        private readonly IPricingService _pricingService;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProductService"/> class
        /// </summary>
        /// <param name="productRepository">The product repository implementation</param>
        /// <param name="categoryRepository">The category repository implementation</param>
        /// <param name="inventoryService">The inventory management service</param>
        /// <param name="pricingService">The pricing calculation service</param>
        /// <exception cref="ArgumentNullException">Thrown when any parameter is null</exception>
        public ProductService(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository,
            IInventoryService inventoryService,
            IPricingService pricingService)
        {
            _productRepository = productRepository ?? throw new ArgumentNullException(nameof(productRepository));
            _categoryRepository = categoryRepository ?? throw new ArgumentNullException(nameof(categoryRepository));
            _inventoryService = inventoryService ?? throw new ArgumentNullException(nameof(inventoryService));
            _pricingService = pricingService ?? throw new ArgumentNullException(nameof(pricingService));
        }

        /// <summary>
        /// Retrieves a product by its unique identifier
        /// </summary>
        /// <param name="productId">The unique product identifier</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains the product if found; otherwise, null.
        /// </returns>
        /// <exception cref="ArgumentException">Thrown when productId is less than or equal to zero</exception>
        /// <remarks>
        /// This method includes related data such as category information
        /// and review summaries for complete product details.
        /// </remarks>
        public async Task<Product?> GetProductByIdAsync(int productId)
        {
            if (productId <= 0)
                throw new ArgumentException("Product ID must be greater than zero", nameof(productId));

            return await _productRepository.GetByIdWithDetailsAsync(productId);
        }

        /// <summary>
        /// Creates a new product in the system
        /// </summary>
        /// <param name="product">The product to create</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains the created product with assigned ID.
        /// </returns>
        /// <exception cref="ArgumentNullException">Thrown when product is null</exception>
        /// <exception cref="InvalidOperationException">Thrown when validation fails</exception>
        /// <remarks>
        /// This method performs comprehensive validation including:
        /// - Name uniqueness within the category
        /// - Price validation
        /// - Category existence verification
        /// - Business rule compliance
        /// </remarks>
        public async Task<Product> CreateProductAsync(Product product)
        {
            if (product == null)
                throw new ArgumentNullException(nameof(product));

            await ValidateProductAsync(product);

            product.CreatedDate = DateTime.UtcNow;
            product.IsActive = true;

            var createdProduct = await _productRepository.CreateAsync(product);
            await _inventoryService.InitializeInventoryAsync(createdProduct.Id, product.StockQuantity);

            return createdProduct;
        }

        /// <summary>
        /// Updates an existing product's information
        /// </summary>
        /// <param name="productId">The ID of the product to update</param>
        /// <param name="updatedProduct">The updated product information</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains the updated product.
        /// </returns>
        /// <exception cref="ArgumentException">Thrown when productId is invalid</exception>
        /// <exception cref="ArgumentNullException">Thrown when updatedProduct is null</exception>
        /// <exception cref="InvalidOperationException">Thrown when product doesn't exist or validation fails</exception>
        /// <remarks>
        /// Price changes are logged for audit purposes and may trigger
        /// customer notifications if the product is in active shopping carts.
        /// </remarks>
        public async Task<Product> UpdateProductAsync(int productId, Product updatedProduct)
        {
            if (productId <= 0)
                throw new ArgumentException("Product ID must be greater than zero", nameof(productId));

            if (updatedProduct == null)
                throw new ArgumentNullException(nameof(updatedProduct));

            var existingProduct = await _productRepository.GetByIdAsync(productId);
            if (existingProduct == null)
                throw new InvalidOperationException($"Product with ID {productId} not found");

            await ValidateProductAsync(updatedProduct, productId);

            // Track price changes for audit
            if (existingProduct.Price != updatedProduct.Price)
            {
                await _pricingService.LogPriceChangeAsync(productId, existingProduct.Price, updatedProduct.Price);
            }

            updatedProduct.Id = productId;
            updatedProduct.CreatedDate = existingProduct.CreatedDate;
            updatedProduct.ModifiedDate = DateTime.UtcNow;

            return await _productRepository.UpdateAsync(updatedProduct);
        }

        /// <summary>
        /// Searches for products based on specified criteria
        /// </summary>
        /// <param name="searchTerm">The text to search for in product names and descriptions</param>
        /// <param name="categoryId">Optional category filter</param>
        /// <param name="minPrice">Optional minimum price filter</param>
        /// <param name="maxPrice">Optional maximum price filter</param>
        /// <param name="includeInactive">Whether to include inactive products in results</param>
        /// <returns>
        /// A task that represents the asynchronous operation.
        /// The task result contains a collection of matching products.
        /// </returns>
        /// <remarks>
        /// Search results are ordered by relevance score, which considers:
        /// - Exact name matches (highest priority)
        /// - Partial name matches
        /// - Description content matches
        /// - Customer rating and review count
        /// - Recent sales volume
        /// </remarks>
        public async Task<IEnumerable<Product>> SearchProductsAsync(
            string? searchTerm = null,
            int? categoryId = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            bool includeInactive = false)
        {
            var searchCriteria = new ProductSearchCriteria
            {
                SearchTerm = searchTerm?.Trim(),
                CategoryId = categoryId,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                IncludeInactive = includeInactive
            };

            return await _productRepository.SearchAsync(searchCriteria);
        }

        /// <summary>
        /// Validates product data according to business rules
        /// </summary>
        /// <param name="product">The product to validate</param>
        /// <param name="excludeProductId">Optional product ID to exclude from uniqueness checks</param>
        /// <returns>A task that represents the asynchronous validation operation</returns>
        /// <exception cref="InvalidOperationException">Thrown when validation fails</exception>
        /// <remarks>
        /// Validation includes:
        /// - Required field validation
        /// - Business rule compliance
        /// - Data format validation
        /// - Uniqueness constraints
        /// </remarks>
        private async Task ValidateProductAsync(Product product, int? excludeProductId = null)
        {
            var errors = new List<string>();

            // Required field validation
            if (string.IsNullOrWhiteSpace(product.Name))
                errors.Add("Product name is required");

            if (product.Price < 0)
                errors.Add("Product price cannot be negative");

            if (product.CategoryId <= 0)
                errors.Add("Valid category is required");

            // Business rule validation
            if (product.StockQuantity < 0)
                errors.Add("Stock quantity cannot be negative");

            // Category existence validation
            var category = await _categoryRepository.GetByIdAsync(product.CategoryId);
            if (category == null)
                errors.Add($"Category with ID {product.CategoryId} does not exist");

            // Name uniqueness validation within category
            var existingProduct = await _productRepository.FindByNameAndCategoryAsync(product.Name, product.CategoryId);
            if (existingProduct != null && existingProduct.Id != excludeProductId)
                errors.Add($"A product with name '{product.Name}' already exists in this category");

            if (errors.Any())
                throw new InvalidOperationException($"Product validation failed: {string.Join(", ", errors)}");
        }
    }

    #endregion

    #region Data Access Interfaces

    /// <summary>
    /// Defines the contract for product data access operations
    /// </summary>
    /// <remarks>
    /// This interface abstracts the data layer implementation details
    /// and supports multiple storage backends and caching strategies.
    /// </remarks>
    public interface IProductRepository
    {
        /// <summary>
        /// Retrieves a product by its unique identifier
        /// </summary>
        /// <param name="id">The product identifier</param>
        /// <returns>The product if found; otherwise, null</returns>
        Task<Product?> GetByIdAsync(int id);

        /// <summary>
        /// Retrieves a product with all related data loaded
        /// </summary>
        /// <param name="id">The product identifier</param>
        /// <returns>The product with related data if found; otherwise, null</returns>
        Task<Product?> GetByIdWithDetailsAsync(int id);

        /// <summary>
        /// Creates a new product
        /// </summary>
        /// <param name="product">The product to create</param>
        /// <returns>The created product with assigned ID</returns>
        Task<Product> CreateAsync(Product product);

        /// <summary>
        /// Updates an existing product
        /// </summary>
        /// <param name="product">The product to update</param>
        /// <returns>The updated product</returns>
        Task<Product> UpdateAsync(Product product);

        /// <summary>
        /// Searches for products based on criteria
        /// </summary>
        /// <param name="criteria">The search criteria</param>
        /// <returns>A collection of matching products</returns>
        Task<IEnumerable<Product>> SearchAsync(ProductSearchCriteria criteria);

        /// <summary>
        /// Finds a product by name within a specific category
        /// </summary>
        /// <param name="name">The product name</param>
        /// <param name="categoryId">The category identifier</param>
        /// <returns>The product if found; otherwise, null</returns>
        Task<Product?> FindByNameAndCategoryAsync(string name, int categoryId);
    }

    /// <summary>
    /// Represents search criteria for product queries
    /// </summary>
    /// <remarks>
    /// This class encapsulates all possible search parameters
    /// for flexible product filtering and searching.
    /// </remarks>
    public class ProductSearchCriteria
    {
        /// <summary>
        /// Gets or sets the search term for name and description matching
        /// </summary>
        public string? SearchTerm { get; set; }

        /// <summary>
        /// Gets or sets the category filter
        /// </summary>
        public int? CategoryId { get; set; }

        /// <summary>
        /// Gets or sets the minimum price filter
        /// </summary>
        public decimal? MinPrice { get; set; }

        /// <summary>
        /// Gets or sets the maximum price filter
        /// </summary>
        public decimal? MaxPrice { get; set; }

        /// <summary>
        /// Gets or sets whether to include inactive products
        /// </summary>
        public bool IncludeInactive { get; set; }
    }

    #endregion

    #region Supporting Services

    /// <summary>
    /// Provides category management operations
    /// </summary>
    public interface ICategoryRepository
    {
        /// <summary>
        /// Retrieves a category by its identifier
        /// </summary>
        /// <param name="id">The category identifier</param>
        /// <returns>The category if found; otherwise, null</returns>
        Task<Category?> GetByIdAsync(int id);
    }

    /// <summary>
    /// Provides inventory management operations
    /// </summary>
    public interface IInventoryService
    {
        /// <summary>
        /// Initializes inventory tracking for a new product
        /// </summary>
        /// <param name="productId">The product identifier</param>
        /// <param name="initialQuantity">The initial stock quantity</param>
        /// <returns>A task representing the asynchronous operation</returns>
        Task InitializeInventoryAsync(int productId, int initialQuantity);
    }

    /// <summary>
    /// Provides pricing calculation and management operations
    /// </summary>
    public interface IPricingService
    {
        /// <summary>
        /// Logs a price change for audit purposes
        /// </summary>
        /// <param name="productId">The product identifier</param>
        /// <param name="oldPrice">The previous price</param>
        /// <param name="newPrice">The new price</param>
        /// <returns>A task representing the asynchronous operation</returns>
        Task LogPriceChangeAsync(int productId, decimal oldPrice, decimal newPrice);
    }

    #endregion
}