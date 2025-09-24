/**
 * Day 14: Comprehensive TypeScript Application - Week Review
 *
 * This comprehensive TypeScript application combines all the Vim skills you've learned this week.
 * Practice all the operations from Days 8-13:
 *
 * Day 8 Skills: Undo/Redo (u, Ctrl-r, U, .)
 * Day 9 Skills: Character Search (f, F, t, T, ;, ,)
 * Day 10 Skills: Visual Mode (v, V, Ctrl-v, o, gv, text objects)
 * Day 11 Skills: Change Operations (c, cc, C, cw, ciw, s, S, r, R)
 * Day 12 Skills: Number Operations (Ctrl-a, Ctrl-x, g Ctrl-a, g Ctrl-x)
 * Day 13 Skills: File Operations (:e, :w, :q, :sp, :vsp, :tabnew, gt, :bn, :bp)
 *
 * This is a real-world e-commerce TypeScript application with intentional issues to fix.
 */

import { EventEmitter } from 'events';

// ====================================================================
// CORE TYPES AND INTERFACES
// ====================================================================

// Product catalog system
interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: Money;
  category: Category;
  brand: Brand;
  inventory: InventoryInfo;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  seo: SeoMetadata;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Money {
  amount: number;    // Fix: Change to 0.00 using Ctrl-a/Ctrl-x
  currency: string;  // Fix: Change 'USD' to 'EUR' using change operations
  formatted: string; // Fix: Update to match currency
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children: Category[];
  level: number;        // Fix: Change level numbers using Ctrl-a/Ctrl-x
  sortOrder: number;    // Fix: Reorder categories using number operations
  isActive: boolean;
  productCount: number; // Fix: Update counts using Ctrl-a/Ctrl-x
}

interface Brand {
  id: string;
  name: string;        // Fix: Change brand names using change operations
  slug: string;        // Fix: Update slugs to match names
  description: string;
  logo: string;
  website?: string;    // Fix: Add proper URLs using change operations
  isActive: boolean;
  productCount: number; // Fix: Update counts
}

interface InventoryInfo {
  inStock: number;     // Fix: Update stock numbers using Ctrl-a/Ctrl-x
  reserved: number;    // Fix: Update reserved quantities
  available: number;   // Fix: Calculate available = inStock - reserved
  lowStockThreshold: number; // Fix: Set appropriate thresholds
  isTracked: boolean;
  allowBackorder: boolean;
  location: string;    // Fix: Change warehouse locations
}

interface ProductImage {
  id: string;
  url: string;         // Fix: Update image URLs using change operations
  alt: string;         // Fix: Update alt text to match products
  isPrimary: boolean;
  sortOrder: number;   // Fix: Reorder images using Ctrl-a/Ctrl-x
  width: number;       // Fix: Update image dimensions
  height: number;      // Fix: Update image dimensions
}

interface ProductVariant {
  id: string;
  sku: string;         // Fix: Update SKUs using change operations
  name: string;
  price: Money;        // Fix: Update variant pricing
  attributes: VariantAttribute[];
  inventory: InventoryInfo;
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;   // Fix: Reorder variants
}

interface VariantAttribute {
  name: string;        // Fix: Change attribute names (color, size, etc.)
  value: string;       // Fix: Change attribute values (red, large, etc.)
  type: 'color' | 'size' | 'material' | 'style';
}

interface ProductAttribute {
  id: string;
  name: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'boolean' | 'select';
  isFilterable: boolean;
  isVisible: boolean;
  sortOrder: number;   // Fix: Reorder attributes
}

interface SeoMetadata {
  title?: string;      // Fix: Update SEO titles using change operations
  description?: string; // Fix: Update SEO descriptions
  keywords: string[];  // Fix: Add/remove keywords using visual mode
  canonicalUrl?: string;
  ogImage?: string;
}

// ====================================================================
// SHOPPING CART AND ORDER SYSTEM
// ====================================================================

interface ShoppingCart {
  id: string;
  userId?: string;
  items: CartItem[];
  totals: CartTotals;
  discounts: Discount[];
  shipping?: ShippingOption;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;    // Fix: Update quantities using Ctrl-a/Ctrl-x
  unitPrice: Money;
  totalPrice: Money;   // Fix: Calculate total = unitPrice * quantity
  addedAt: Date;
}

interface CartTotals {
  subtotal: Money;     // Fix: Calculate subtotals
  shipping: Money;     // Fix: Update shipping costs
  tax: Money;          // Fix: Calculate tax amounts
  discount: Money;     // Fix: Apply discount amounts
  total: Money;        // Fix: Calculate final totals
  itemCount: number;   // Fix: Count total items using Ctrl-a/Ctrl-x
}

interface Discount {
  id: string;
  code: string;        // Fix: Change discount codes using change operations
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;       // Fix: Update discount values using Ctrl-a/Ctrl-x
  minAmount?: Money;   // Fix: Set minimum order amounts
  maxAmount?: Money;   // Fix: Set maximum discount amounts
  description: string;
  isActive: boolean;
  usageCount: number;  // Fix: Track usage with Ctrl-a/Ctrl-x
  usageLimit?: number; // Fix: Set usage limits
  expiresAt?: Date;
}

interface ShippingOption {
  id: string;
  name: string;        // Fix: Update shipping method names
  description: string;
  price: Money;        // Fix: Update shipping prices
  estimatedDays: number; // Fix: Update delivery estimates using Ctrl-a/Ctrl-x
  isActive: boolean;
  sortOrder: number;   // Fix: Reorder shipping options
}

// Order management
interface Order {
  id: string;
  orderNumber: string; // Fix: Update order numbers using change operations
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  totals: OrderTotals;
  shipping: ShippingDetails;
  billing: BillingDetails;
  payment: PaymentInfo;
  notes?: string;      // Fix: Add/edit order notes
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  productName: string; // Fix: Update product names using change operations
  variantName?: string;
  sku: string;         // Fix: Update SKUs
  quantity: number;    // Fix: Update quantities using Ctrl-a/Ctrl-x
  unitPrice: Money;
  totalPrice: Money;   // Fix: Recalculate totals
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

interface OrderTotals {
  subtotal: Money;     // Fix: Recalculate order totals
  shipping: Money;
  tax: Money;
  discount: Money;
  total: Money;
}

interface ShippingDetails {
  method: string;      // Fix: Update shipping methods
  trackingNumber?: string; // Fix: Add tracking numbers using change operations
  estimatedDelivery: Date; // Fix: Update delivery dates
  address: Address;
}

interface BillingDetails {
  address: Address;
  paymentMethod: string; // Fix: Update payment methods
}

interface Address {
  firstName: string;   // Fix: Update customer names using change operations
  lastName: string;
  company?: string;
  street1: string;     // Fix: Update addresses using change operations
  street2?: string;
  city: string;        // Fix: Change cities
  state: string;       // Fix: Change states/provinces
  postalCode: string;  // Fix: Update postal codes
  country: string;     // Fix: Change countries
  phone?: string;      // Fix: Update phone numbers
}

interface PaymentInfo {
  method: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string; // Fix: Add transaction IDs
  amount: Money;
  processedAt?: Date;
}

// ====================================================================
// USER MANAGEMENT SYSTEM
// ====================================================================

interface User {
  id: string;
  email: string;       // Fix: Update email addresses using change operations
  firstName: string;   // Fix: Change names using change operations
  lastName: string;
  password: string;    // Encrypted - don't change
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  profile: UserProfile;
  preferences: UserPreferences;
  addresses: Address[];
  orders: Order[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

enum UserRole {
  CUSTOMER = 1,        // Fix: Update role values using Ctrl-a/Ctrl-x
  ADMIN = 2,
  SUPER_ADMIN = 3,
  MODERATOR = 4,
  GUEST = 0
}

interface UserProfile {
  avatar?: string;     // Fix: Update avatar URLs
  bio?: string;        // Fix: Update user bios using change operations
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;      // Fix: Update phone numbers
  website?: string;    // Fix: Update personal websites
  socialMedia: {
    facebook?: string; // Fix: Update social media handles
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

interface UserPreferences {
  language: string;    // Fix: Change language codes (en, es, fr, de)
  currency: string;    // Fix: Change currency preferences (USD, EUR, GBP)
  timezone: string;    // Fix: Update timezones using change operations
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    showProfile: boolean;
    showEmail: boolean;
    showPurchases: boolean;
  };
}

// ====================================================================
// ANALYTICS AND REPORTING
// ====================================================================

interface SalesReport {
  period: {
    start: Date;
    end: Date;
    type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  metrics: {
    totalRevenue: Money;    // Fix: Update revenue figures using Ctrl-a/Ctrl-x
    totalOrders: number;    // Fix: Update order counts
    averageOrderValue: Money; // Fix: Calculate AOV
    conversionRate: number; // Fix: Update conversion rates (use decimals)
    newCustomers: number;   // Fix: Update customer counts
    returningCustomers: number; // Fix: Update returning customer counts
    refundAmount: Money;    // Fix: Update refund amounts
    refundRate: number;     // Fix: Calculate refund rates
  };
  topProducts: ProductSales[];
  topCategories: CategorySales[];
  customerSegments: CustomerSegment[];
}

interface ProductSales {
  productId: string;
  productName: string;    // Fix: Update product names
  sku: string;           // Fix: Update SKUs
  unitsSold: number;     // Fix: Update sales quantities using Ctrl-a/Ctrl-x
  revenue: Money;        // Fix: Update revenue amounts
  profit: Money;         // Fix: Calculate profit margins
  rank: number;          // Fix: Update rankings using Ctrl-a/Ctrl-x
}

interface CategorySales {
  categoryId: string;
  categoryName: string;  // Fix: Update category names using change operations
  productCount: number;  // Fix: Update product counts
  unitsSold: number;     // Fix: Update units sold
  revenue: Money;        // Fix: Update revenue
  avgPrice: Money;       // Fix: Calculate average prices
  rank: number;          // Fix: Update rankings
}

interface CustomerSegment {
  name: string;          // Fix: Update segment names (VIP, Regular, New, etc.)
  customerCount: number; // Fix: Update customer counts using Ctrl-a/Ctrl-x
  totalRevenue: Money;   // Fix: Update segment revenue
  avgOrderValue: Money;  // Fix: Calculate average order values
  avgOrderFrequency: number; // Fix: Update frequency metrics
  retentionRate: number; // Fix: Update retention rates (0.0-1.0)
}

// ====================================================================
// INVENTORY MANAGEMENT
// ====================================================================

interface InventoryMovement {
  id: string;
  productId: string;
  variantId?: string;
  type: MovementType;
  quantity: number;      // Fix: Update movement quantities using Ctrl-a/Ctrl-x
  reason: string;        // Fix: Update movement reasons using change operations
  reference?: string;    // Fix: Add reference numbers
  location: string;      // Fix: Update warehouse locations
  userId: string;
  createdAt: Date;
  notes?: string;        // Fix: Add movement notes
}

enum MovementType {
  PURCHASE = 'purchase',
  SALE = 'sale',
  RETURN = 'return',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  DAMAGED = 'damaged',
  EXPIRED = 'expired'
}

interface StockAlert {
  id: string;
  productId: string;
  variantId?: string;
  type: AlertType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;       // Fix: Update alert messages using change operations
  currentStock: number;  // Fix: Update current stock levels using Ctrl-a/Ctrl-x
  threshold: number;     // Fix: Adjust thresholds using Ctrl-a/Ctrl-x
  isActive: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

enum AlertType {
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  OVERSTOCK = 'overstock',
  EXPIRING_SOON = 'expiring_soon',
  DAMAGED_GOODS = 'damaged_goods'
}

// ====================================================================
// MAIN APPLICATION CLASSES
// ====================================================================

/**
 * E-commerce Application Main Class
 * This integrates all the systems above
 */
class ECommerceApplication extends EventEmitter {
  private products: Map<string, Product> = new Map();
  private categories: Map<string, Category> = new Map();
  private brands: Map<string, Brand> = new Map();
  private users: Map<string, User> = new Map();
  private orders: Map<string, Order> = new Map();
  private carts: Map<string, ShoppingCart> = new Map();
  private inventory: Map<string, InventoryInfo> = new Map();

  // Configuration settings - Fix these values using number operations
  private config = {
    defaultCurrency: 'USD',     // Fix: Change to EUR using change operations
    defaultLanguage: 'en',      // Fix: Change to es, fr, or de
    taxRate: 0.08,             // Fix: Update tax rate using Ctrl-a/Ctrl-x (8% -> 10%)
    shippingRate: 9.99,        // Fix: Update shipping rates using Ctrl-a/Ctrl-x
    freeShippingThreshold: 50.00, // Fix: Update threshold using Ctrl-a/Ctrl-x
    lowStockThreshold: 10,     // Fix: Adjust threshold using Ctrl-a/Ctrl-x
    maxItemsPerCart: 99,       // Fix: Update limits using Ctrl-a/Ctrl-x
    sessionTimeout: 3600,      // Fix: Update timeout (seconds) using Ctrl-a/Ctrl-x
    maxSearchResults: 50,      // Fix: Update max results using Ctrl-a/Ctrl-x
    defaultPageSize: 20,       // Fix: Update page size using Ctrl-a/Ctrl-x
    maxUploadSize: 5242880,    // Fix: Update file size limits (5MB) using Ctrl-a/Ctrl-x
    cacheTimeout: 300,         // Fix: Update cache timeout using Ctrl-a/Ctrl-x
    retryAttempts: 3,          // Fix: Update retry counts using Ctrl-a/Ctrl-x
    apiTimeout: 30000,         // Fix: Update API timeout (30s) using Ctrl-a/Ctrl-x
    maxConcurrentUsers: 1000   // Fix: Update user limits using Ctrl-a/Ctrl-x
  };

  constructor() {
    super();
    this.initializeApplication();
  }

  /**
   * Initialize application with sample data
   * Fix the data below using various Vim operations
   */
  private initializeApplication(): void {
    this.emit('app:initializing');

    // Create sample categories - Fix names and hierarchy using change operations
    const electronics = this.createCategory({
      id: 'cat_001',
      name: 'Electronics',      // Fix: Change to "Technology" using change operations
      slug: 'electronics',      // Fix: Update slug to match name
      level: 1,                // Fix: Adjust levels using Ctrl-a/Ctrl-x
      sortOrder: 1,            // Fix: Reorder categories using Ctrl-a/Ctrl-x
      productCount: 150        // Fix: Update counts using Ctrl-a/Ctrl-x
    });

    const laptops = this.createCategory({
      id: 'cat_002',
      name: 'Laptops',          // Fix: Change to "Notebooks" using change operations
      slug: 'laptops',          // Fix: Update slug to match
      parentId: 'cat_001',
      level: 2,                // Fix: Adjust level
      sortOrder: 1,            // Fix: Adjust sort order
      productCount: 45         // Fix: Update count
    });

    const smartphones = this.createCategory({
      id: 'cat_003',
      name: 'Smartphones',      // Fix: Change to "Mobile Phones"
      slug: 'smartphones',      // Fix: Update slug
      parentId: 'cat_001',
      level: 2,
      sortOrder: 2,            // Fix: Adjust sort order
      productCount: 78         // Fix: Update count using Ctrl-a/Ctrl-x
    });

    // Create sample brands - Fix brand information
    const apple = this.createBrand({
      id: 'brand_001',
      name: 'Apple',            // Fix: Change to "Apple Inc." using change operations
      slug: 'apple',            // Fix: Update slug
      description: 'Premium technology products', // Fix: Update description
      logo: '/logos/apple.png', // Fix: Update logo path
      website: 'https://apple.com', // Fix: Update website URL
      productCount: 25          // Fix: Update count using Ctrl-a/Ctrl-x
    });

    const samsung = this.createBrand({
      id: 'brand_002',
      name: 'Samsung',          // Fix: Change to "Samsung Electronics"
      slug: 'samsung',          // Fix: Update slug
      description: 'Innovative electronics manufacturer', // Fix: Update description
      logo: '/logos/samsung.png', // Fix: Update logo path
      website: 'https://samsung.com', // Fix: Update website
      productCount: 32          // Fix: Update count
    });

    // Create sample products - Fix product information
    const iphone = this.createProduct({
      id: 'prod_001',
      sku: 'IPH-13-128-BLK',    // Fix: Update SKU using change operations
      name: 'iPhone 13',        // Fix: Change to "iPhone 14" using change operations
      description: 'Latest iPhone model with advanced features', // Fix: Update description
      price: {
        amount: 799.00,         // Fix: Update price using Ctrl-a/Ctrl-x
        currency: 'USD',        // Fix: Change to EUR using change operations
        formatted: '$799.00'    // Fix: Update format to match currency
      },
      categoryId: 'cat_003',
      brandId: 'brand_001',
      inventory: {
        inStock: 50,            // Fix: Update stock using Ctrl-a/Ctrl-x
        reserved: 5,            // Fix: Update reserved
        available: 45,          // Fix: Calculate available = inStock - reserved
        lowStockThreshold: 10,  // Fix: Adjust threshold
        location: 'Warehouse A' // Fix: Change location using change operations
      }
    });

    const macbook = this.createProduct({
      id: 'prod_002',
      sku: 'MBP-M1-256-SLV',   // Fix: Update SKU
      name: 'MacBook Pro',      // Fix: Change to "MacBook Pro M2"
      description: 'Professional laptop for creative work', // Fix: Update description
      price: {
        amount: 1299.00,        // Fix: Update price using Ctrl-a/Ctrl-x
        currency: 'USD',        // Fix: Change currency
        formatted: '$1,299.00'  // Fix: Update formatting
      },
      categoryId: 'cat_002',
      brandId: 'brand_001',
      inventory: {
        inStock: 25,            // Fix: Update stock levels
        reserved: 3,
        available: 22,          // Fix: Calculate available
        lowStockThreshold: 5,   // Fix: Adjust threshold
        location: 'Warehouse B' // Fix: Change location
      }
    });

    // Create sample users - Fix user information
    const admin = this.createUser({
      id: 'user_001',
      email: 'admin@example.com', // Fix: Change to company domain using change operations
      firstName: 'John',          // Fix: Change first name using change operations
      lastName: 'Doe',            // Fix: Change last name
      role: UserRole.ADMIN,
      profile: {
        phone: '+1-555-0101',     // Fix: Update phone number using change operations
        bio: 'System Administrator', // Fix: Update bio
        website: 'https://johndoe.com' // Fix: Update personal website
      },
      preferences: {
        language: 'en',           // Fix: Change to 'es', 'fr', or 'de'
        currency: 'USD',          // Fix: Change currency preference
        timezone: 'America/New_York', // Fix: Change timezone using change operations
        theme: 'light'            // Fix: Change to 'dark' or 'auto'
      }
    });

    const customer = this.createUser({
      id: 'user_002',
      email: 'customer@example.com', // Fix: Update email
      firstName: 'Jane',            // Fix: Change name
      lastName: 'Smith',            // Fix: Change surname
      role: UserRole.CUSTOMER,
      profile: {
        phone: '+1-555-0102',       // Fix: Update phone
        bio: 'Tech enthusiast',     // Fix: Update bio
        birthDate: new Date('1990-05-15'), // Fix: Change birth date
        socialMedia: {
          twitter: '@janesmith',    // Fix: Update social handles using change operations
          instagram: '@jane.smith', // Fix: Update Instagram handle
          linkedin: 'jane-smith'    // Fix: Update LinkedIn profile
        }
      }
    });

    // Create sample orders - Fix order information
    const order1 = this.createOrder({
      id: 'order_001',
      orderNumber: 'ORD-2024-001', // Fix: Update order number using change operations
      userId: 'user_002',
      status: OrderStatus.PROCESSING, // Fix: Change status using change operations
      items: [
        {
          productId: 'prod_001',
          quantity: 1,              // Fix: Update quantities using Ctrl-a/Ctrl-x
          unitPrice: { amount: 799.00, currency: 'USD', formatted: '$799.00' },
          totalPrice: { amount: 799.00, currency: 'USD', formatted: '$799.00' }
        }
      ],
      shipping: {
        method: 'Standard Shipping', // Fix: Change to "Express Shipping"
        estimatedDelivery: new Date('2024-02-15'), // Fix: Update delivery date
        address: {
          firstName: 'Jane',        // Fix: Update shipping address
          lastName: 'Smith',
          street1: '123 Main St',   // Fix: Change address using change operations
          city: 'New York',         // Fix: Change city
          state: 'NY',              // Fix: Change state
          postalCode: '10001',      // Fix: Update ZIP code
          country: 'USA'            // Fix: Change country
        }
      }
    });

    // Initialize analytics data - Fix metrics using number operations
    this.generateSampleAnalytics();

    this.emit('app:initialized', {
      categories: this.categories.size,
      brands: this.brands.size,
      products: this.products.size,
      users: this.users.size,
      orders: this.orders.size
    });
  }

  /**
   * Generate sample analytics data
   * Fix all the metrics below using Ctrl-a/Ctrl-x operations
   */
  private generateSampleAnalytics(): void {
    const salesReport: SalesReport = {
      period: {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
        type: 'monthly'
      },
      metrics: {
        totalRevenue: { amount: 125450.75, currency: 'USD', formatted: '$125,450.75' }, // Fix: Update revenue using Ctrl-a/Ctrl-x
        totalOrders: 287,           // Fix: Update order count using Ctrl-a/Ctrl-x
        averageOrderValue: { amount: 437.11, currency: 'USD', formatted: '$437.11' }, // Fix: Recalculate AOV
        conversionRate: 0.034,      // Fix: Update conversion rate (3.4%)
        newCustomers: 156,          // Fix: Update new customer count using Ctrl-a/Ctrl-x
        returningCustomers: 131,    // Fix: Update returning customer count
        refundAmount: { amount: 2100.50, currency: 'USD', formatted: '$2,100.50' }, // Fix: Update refund amount
        refundRate: 0.017           // Fix: Calculate refund rate (1.7%)
      },
      topProducts: [
        {
          productId: 'prod_001',
          productName: 'iPhone 13',  // Fix: Update product name to match changes above
          sku: 'IPH-13-128-BLK',    // Fix: Update SKU to match changes
          unitsSold: 45,            // Fix: Update units sold using Ctrl-a/Ctrl-x
          revenue: { amount: 35955.00, currency: 'USD', formatted: '$35,955.00' }, // Fix: Recalculate revenue
          profit: { amount: 8988.75, currency: 'USD', formatted: '$8,988.75' }, // Fix: Update profit
          rank: 1                   // Fix: Update rankings if needed
        },
        {
          productId: 'prod_002',
          productName: 'MacBook Pro', // Fix: Update to match changes above
          sku: 'MBP-M1-256-SLV',    // Fix: Update SKU
          unitsSold: 23,            // Fix: Update units sold
          revenue: { amount: 29877.00, currency: 'USD', formatted: '$29,877.00' }, // Fix: Recalculate
          profit: { amount: 5975.40, currency: 'USD', formatted: '$5,975.40' }, // Fix: Update profit
          rank: 2                   // Fix: Update rank
        }
      ],
      topCategories: [
        {
          categoryId: 'cat_003',
          categoryName: 'Smartphones', // Fix: Update to match changes above
          productCount: 78,          // Fix: Update count to match changes
          unitsSold: 156,           // Fix: Update units sold using Ctrl-a/Ctrl-x
          revenue: { amount: 87234.50, currency: 'USD', formatted: '$87,234.50' }, // Fix: Update revenue
          avgPrice: { amount: 559.19, currency: 'USD', formatted: '$559.19' }, // Fix: Recalculate average
          rank: 1                   // Fix: Update rank
        }
      ],
      customerSegments: [
        {
          name: 'VIP Customers',    // Fix: Change segment names using change operations
          customerCount: 45,        // Fix: Update count using Ctrl-a/Ctrl-x
          totalRevenue: { amount: 67890.25, currency: 'USD', formatted: '$67,890.25' }, // Fix: Update revenue
          avgOrderValue: { amount: 1508.67, currency: 'USD', formatted: '$1,508.67' }, // Fix: Recalculate AOV
          avgOrderFrequency: 2.8,   // Fix: Update frequency
          retentionRate: 0.92       // Fix: Update retention rate (92%)
        },
        {
          name: 'Regular Customers', // Fix: Change name if needed
          customerCount: 198,       // Fix: Update count
          totalRevenue: { amount: 45123.50, currency: 'USD', formatted: '$45,123.50' }, // Fix: Update revenue
          avgOrderValue: { amount: 227.89, currency: 'USD', formatted: '$227.89' }, // Fix: Recalculate
          avgOrderFrequency: 1.4,   // Fix: Update frequency
          retentionRate: 0.67       // Fix: Update retention (67%)
        }
      ]
    };

    // Store analytics data
    this.emit('analytics:generated', salesReport);
  }

  // ====================================================================
  // CRUD OPERATIONS - Fix method implementations
  // ====================================================================

  private createCategory(data: Partial<Category>): Category {
    const category: Category = {
      id: data.id || this.generateId(),
      name: data.name || 'Unnamed Category', // Fix: Update default names
      slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || 'unnamed',
      parentId: data.parentId,
      children: data.children || [],
      level: data.level || 1,     // Fix: Adjust levels using Ctrl-a/Ctrl-x
      sortOrder: data.sortOrder || 0, // Fix: Set sort orders
      isActive: data.isActive !== false,
      productCount: data.productCount || 0 // Fix: Update counts
    };

    this.categories.set(category.id, category);
    this.emit('category:created', category);
    return category;
  }

  private createBrand(data: Partial<Brand>): Brand {
    const brand: Brand = {
      id: data.id || this.generateId(),
      name: data.name || 'Unknown Brand', // Fix: Update default names
      slug: data.slug || data.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
      description: data.description || '', // Fix: Add descriptions
      logo: data.logo || '/logos/default.png', // Fix: Update logo paths
      website: data.website,      // Fix: Add websites using change operations
      isActive: data.isActive !== false,
      productCount: data.productCount || 0 // Fix: Update counts
    };

    this.brands.set(brand.id, brand);
    this.emit('brand:created', brand);
    return brand;
  }

  private createProduct(data: any): Product {
    const product: Product = {
      id: data.id || this.generateId(),
      sku: data.sku || this.generateSKU(), // Fix: Update SKUs
      name: data.name || 'Unnamed Product', // Fix: Update names
      description: data.description || '', // Fix: Add descriptions
      price: data.price || { amount: 0, currency: 'USD', formatted: '$0.00' }, // Fix: Set prices
      category: this.categories.get(data.categoryId)!,
      brand: this.brands.get(data.brandId)!,
      inventory: data.inventory || {
        inStock: 0,             // Fix: Set initial stock using Ctrl-a/Ctrl-x
        reserved: 0,
        available: 0,
        lowStockThreshold: 5,   // Fix: Set thresholds
        isTracked: true,
        allowBackorder: false,
        location: 'Main Warehouse' // Fix: Set locations
      },
      images: data.images || [],
      variants: data.variants || [],
      attributes: data.attributes || [],
      seo: data.seo || {},      // Fix: Add SEO data
      isActive: data.isActive !== false,
      isFeatured: data.isFeatured || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.products.set(product.id, product);
    this.emit('product:created', product);
    return product;
  }

  private createUser(data: any): User {
    const user: User = {
      id: data.id || this.generateId(),
      email: data.email || `user${Date.now()}@example.com`, // Fix: Update emails
      firstName: data.firstName || 'Unknown', // Fix: Update names
      lastName: data.lastName || 'User',      // Fix: Update surnames
      password: 'hashed_password',  // Don't change this
      role: data.role || UserRole.CUSTOMER,
      isActive: data.isActive !== false,
      isEmailVerified: data.isEmailVerified || false,
      profile: data.profile || {},  // Fix: Add profile data
      preferences: {
        language: 'en',             // Fix: Change languages
        currency: 'USD',            // Fix: Change currencies
        timezone: 'UTC',            // Fix: Change timezones
        theme: 'light',             // Fix: Change themes
        notifications: {
          email: true,
          push: true,
          sms: false,
          marketing: false
        },
        privacy: {
          showProfile: true,
          showEmail: false,
          showPurchases: false
        },
        ...data.preferences
      },
      addresses: data.addresses || [],
      orders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: data.lastLoginAt
    };

    this.users.set(user.id, user);
    this.emit('user:created', user);
    return user;
  }

  private createOrder(data: any): Order {
    const order: Order = {
      id: data.id || this.generateId(),
      orderNumber: data.orderNumber || this.generateOrderNumber(), // Fix: Update order numbers
      userId: data.userId,
      status: data.status || OrderStatus.PENDING,
      items: data.items || [],      // Fix: Add order items
      totals: this.calculateOrderTotals(data.items || []), // Fix: Recalculate totals
      shipping: data.shipping || {}, // Fix: Add shipping details
      billing: data.billing || {},   // Fix: Add billing details
      payment: data.payment || {
        method: 'credit_card',
        status: 'pending',
        amount: { amount: 0, currency: 'USD', formatted: '$0.00' }
      },
      notes: data.notes,            // Fix: Add order notes
      createdAt: new Date(),
      updatedAt: new Date(),
      shippedAt: data.shippedAt,
      deliveredAt: data.deliveredAt
    };

    this.orders.set(order.id, order);
    this.emit('order:created', order);
    return order;
  }

  // ====================================================================
  // UTILITY METHODS - Fix implementations
  // ====================================================================

  private calculateOrderTotals(items: OrderItem[]): OrderTotals {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice.amount, 0); // Fix: Recalculate
    const shipping = subtotal >= this.config.freeShippingThreshold ? 0 : this.config.shippingRate; // Fix: Apply free shipping logic
    const tax = subtotal * this.config.taxRate; // Fix: Calculate tax
    const discount = 0; // Fix: Apply discounts
    const total = subtotal + shipping + tax - discount; // Fix: Calculate total

    return {
      subtotal: { amount: subtotal, currency: this.config.defaultCurrency, formatted: this.formatMoney(subtotal) },
      shipping: { amount: shipping, currency: this.config.defaultCurrency, formatted: this.formatMoney(shipping) },
      tax: { amount: tax, currency: this.config.defaultCurrency, formatted: this.formatMoney(tax) },
      discount: { amount: discount, currency: this.config.defaultCurrency, formatted: this.formatMoney(discount) },
      total: { amount: total, currency: this.config.defaultCurrency, formatted: this.formatMoney(total) }
    };
  }

  private formatMoney(amount: number): string {
    // Fix: Update formatting based on currency changes
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.config.defaultCurrency
    }).format(amount);
  }

  private generateId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSKU(): string {
    return `SKU-${Date.now().toString(36).toUpperCase()}`;
  }

  private generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const sequence = this.orders.size + 1; // Fix: Update sequence using Ctrl-a/Ctrl-x
    return `ORD-${year}-${sequence.toString().padStart(6, '0')}`; // Fix: Adjust padding
  }

  // ====================================================================
  // API METHODS - Fix implementations and error handling
  // ====================================================================

  async searchProducts(query: string, filters: any = {}): Promise<Product[]> {
    // Fix: Implement proper search logic
    const results = Array.from(this.products.values()).filter(product => {
      return product.name.toLowerCase().includes(query.toLowerCase()) ||
             product.description.toLowerCase().includes(query.toLowerCase()) ||
             product.sku.toLowerCase().includes(query.toLowerCase());
    });

    // Fix: Apply filters and pagination
    return results.slice(0, this.config.maxSearchResults); // Fix: Use config value
  }

  async getTopSellingProducts(limit: number = 10): Promise<ProductSales[]> {
    // Fix: Implement actual top selling logic
    // This is sample data - fix the values using Ctrl-a/Ctrl-x
    return [
      {
        productId: 'prod_001',
        productName: 'iPhone 13',    // Fix: Update to match changes
        sku: 'IPH-13-128-BLK',      // Fix: Update SKU
        unitsSold: 45,              // Fix: Update sales figures using Ctrl-a/Ctrl-x
        revenue: { amount: 35955.00, currency: 'USD', formatted: '$35,955.00' },
        profit: { amount: 8988.75, currency: 'USD', formatted: '$8,988.75' },
        rank: 1                     // Fix: Update rankings
      }
      // Add more products and fix their data
    ];
  }

  async updateInventory(productId: string, quantity: number, type: MovementType): Promise<void> {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    // Fix: Implement proper inventory updates using Ctrl-a/Ctrl-x operations
    switch (type) {
      case MovementType.PURCHASE:
        product.inventory.inStock += quantity; // Fix: Update stock levels
        break;
      case MovementType.SALE:
        product.inventory.inStock -= quantity; // Fix: Reduce stock
        break;
      case MovementType.ADJUSTMENT:
        product.inventory.inStock = quantity;  // Fix: Set exact quantity
        break;
      // Add more movement types
    }

    // Fix: Recalculate available quantity
    product.inventory.available = product.inventory.inStock - product.inventory.reserved;

    // Fix: Check for stock alerts
    if (product.inventory.available <= product.inventory.lowStockThreshold) {
      this.emit('inventory:low_stock', {
        productId,
        currentStock: product.inventory.available,
        threshold: product.inventory.lowStockThreshold
      });
    }

    this.emit('inventory:updated', { productId, quantity, type });
  }

  // ====================================================================
  // MAIN APPLICATION METHODS
  // ====================================================================

  start(): void {
    console.log('🚀 E-commerce Application Starting...');
    console.log(`📊 Loaded ${this.products.size} products`);     // Fix: Update counts
    console.log(`📁 Loaded ${this.categories.size} categories`); // Fix: Update counts
    console.log(`🏷️  Loaded ${this.brands.size} brands`);        // Fix: Update counts
    console.log(`👥 Loaded ${this.users.size} users`);          // Fix: Update counts
    console.log(`📦 Loaded ${this.orders.size} orders`);        // Fix: Update counts
    console.log('✅ Application ready!');

    this.emit('app:started');
  }

  stop(): void {
    console.log('🛑 E-commerce Application Stopping...');
    this.emit('app:stopped');
  }

  getStats(): any {
    return {
      products: this.products.size,     // Fix: Update stats using Ctrl-a/Ctrl-x
      categories: this.categories.size,
      brands: this.brands.size,
      users: this.users.size,
      orders: this.orders.size,
      revenue: 125450.75,              // Fix: Update revenue figures
      avgOrderValue: 437.11,           // Fix: Update AOV
      conversionRate: 3.4              // Fix: Update conversion rate
    };
  }
}

// ====================================================================
// EXPORT AND USAGE
// ====================================================================

export default ECommerceApplication;

export {
  Product,
  Category,
  Brand,
  User,
  Order,
  ShoppingCart,
  OrderStatus,
  UserRole,
  MovementType,
  AlertType,
  SalesReport,
  ProductSales,
  CategorySales,
  CustomerSegment
};

// Sample usage and testing
if (require.main === module) {
  const app = new ECommerceApplication();

  app.on('app:started', () => {
    console.log('📈 Application metrics:', app.getStats());
  });

  app.start();

  // Fix: Add event handlers for various application events
  app.on('product:created', (product) => {
    console.log(`✨ New product created: ${product.name}`); // Fix: Update log messages
  });

  app.on('order:created', (order) => {
    console.log(`🛒 New order: ${order.orderNumber}`); // Fix: Update log format
  });

  app.on('inventory:low_stock', (alert) => {
    console.log(`⚠️  Low stock alert: ${alert.productId} (${alert.currentStock} remaining)`); // Fix: Update alert format
  });

  // Fix: Add more event handlers and application logic
}