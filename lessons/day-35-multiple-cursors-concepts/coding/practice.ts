/**
 * Day 35: TypeScript Multiple Cursor Simulation Practice
 * Focus: Simulating multiple cursor operations with TypeScript tables and structured data
 *
 * Exercise Goals:
 * - Practice operations that would benefit from multiple cursors
 * - Learn to work with tabular data structures
 * - Master column-based editing patterns
 * - Practice simultaneous edits across similar patterns
 */

// User permissions table - perfect for multiple cursor operations
interface UserPermission {
  userId:    string;  // User identifier
  resource:  string;  // Resource name
  action:    string;  // Permitted action
  granted:   boolean; // Permission status
  grantedBy: string;  // Who granted permission
  grantedAt: Date;    // When permission was granted
}

// Role definitions table with aligned structure
interface RoleDefinition {
  roleId:      string;   // Role identifier
  roleName:    string;   // Role display name
  description: string;   // Role description
  isActive:    boolean;  // Role status
  createdBy:   string;   // Creator
  createdAt:   Date;     // Creation date
}

// Product pricing table - structured for bulk operations
interface ProductPricing {
  productId:   string;  // Product identifier
  sku:         string;  // Stock keeping unit
  basePrice:   number;  // Base price
  salePrice:   number;  // Sale price
  currency:    string;  // Currency code
  isOnSale:    boolean; // Sale status
  validFrom:   Date;    // Price valid from
  validUntil:  Date;    // Price valid until
}

// Configuration settings table
interface ConfigSetting {
  key:         string;   // Setting key
  value:       string;   // Setting value
  type:        string;   // Value type
  category:    string;   // Setting category
  description: string;   // Setting description
  isSecret:    boolean;  // Is sensitive data
  updatedBy:   string;   // Last updated by
  updatedAt:   Date;     // Last update time
}

// API endpoint definitions - great for multiple cursor edits
interface ApiEndpoint {
  method:      string;   // HTTP method
  path:        string;   // Endpoint path
  handler:     string;   // Handler function
  middleware:  string[]; // Applied middleware
  rateLimit:   number;   // Rate limit per minute
  authRequired: boolean; // Authentication required
  deprecated:  boolean;  // Is deprecated
  version:     string;   // API version
}

// Database table schemas for bulk operations
const USER_PERMISSIONS: UserPermission[] = [
  { userId: 'user001', resource: 'posts',    action: 'read',   granted: true,  grantedBy: 'admin001', grantedAt: new Date('2023-01-15') },
  { userId: 'user001', resource: 'posts',    action: 'write',  granted: true,  grantedBy: 'admin001', grantedAt: new Date('2023-01-15') },
  { userId: 'user001', resource: 'posts',    action: 'delete', granted: false, grantedBy: 'admin001', grantedAt: new Date('2023-01-15') },
  { userId: 'user002', resource: 'posts',    action: 'read',   granted: true,  grantedBy: 'admin001', grantedAt: new Date('2023-01-16') },
  { userId: 'user002', resource: 'posts',    action: 'write',  granted: false, grantedBy: 'admin001', grantedAt: new Date('2023-01-16') },
  { userId: 'user002', resource: 'posts',    action: 'delete', granted: false, grantedBy: 'admin001', grantedAt: new Date('2023-01-16') },
  { userId: 'user003', resource: 'comments', action: 'read',   granted: true,  grantedBy: 'admin002', grantedAt: new Date('2023-01-17') },
  { userId: 'user003', resource: 'comments', action: 'write',  granted: true,  grantedBy: 'admin002', grantedAt: new Date('2023-01-17') },
  { userId: 'user003', resource: 'comments', action: 'delete', granted: true,  grantedBy: 'admin002', grantedAt: new Date('2023-01-17') },
  { userId: 'user004', resource: 'users',    action: 'read',   granted: true,  grantedBy: 'admin001', grantedAt: new Date('2023-01-18') },
  { userId: 'user004', resource: 'users',    action: 'write',  granted: false, grantedBy: 'admin001', grantedAt: new Date('2023-01-18') },
  { userId: 'user004', resource: 'users',    action: 'delete', granted: false, grantedBy: 'admin001', grantedAt: new Date('2023-01-18') },
];

const ROLE_DEFINITIONS: RoleDefinition[] = [
  { roleId: 'role001', roleName: 'Administrator', description: 'Full system access',     isActive: true,  createdBy: 'system', createdAt: new Date('2023-01-01') },
  { roleId: 'role002', roleName: 'Editor',        description: 'Content editing access', isActive: true,  createdBy: 'admin001', createdAt: new Date('2023-01-02') },
  { roleId: 'role003', roleName: 'Viewer',        description: 'Read-only access',       isActive: true,  createdBy: 'admin001', createdAt: new Date('2023-01-03') },
  { roleId: 'role004', roleName: 'Moderator',     description: 'Content moderation',     isActive: true,  createdBy: 'admin002', createdAt: new Date('2023-01-04') },
  { roleId: 'role005', roleName: 'Guest',         description: 'Limited guest access',   isActive: false, createdBy: 'admin001', createdAt: new Date('2023-01-05') },
  { roleId: 'role006', roleName: 'Contributor',   description: 'Content contribution',   isActive: true,  createdBy: 'admin002', createdAt: new Date('2023-01-06') },
  { roleId: 'role007', roleName: 'Reviewer',      description: 'Content review access',  isActive: true,  createdBy: 'admin001', createdAt: new Date('2023-01-07') },
  { roleId: 'role008', roleName: 'Support',       description: 'Customer support role',  isActive: true,  createdBy: 'admin002', createdAt: new Date('2023-01-08') },
];

const PRODUCT_PRICING: ProductPricing[] = [
  { productId: 'prod001', sku: 'LAP001', basePrice: 999.99,  salePrice: 899.99,  currency: 'USD', isOnSale: true,  validFrom: new Date('2023-01-01'), validUntil: new Date('2023-12-31') },
  { productId: 'prod002', sku: 'LAP002', basePrice: 1299.99, salePrice: 1199.99, currency: 'USD', isOnSale: true,  validFrom: new Date('2023-01-01'), validUntil: new Date('2023-12-31') },
  { productId: 'prod003', sku: 'MOU001', basePrice: 29.99,   salePrice: 24.99,   currency: 'USD', isOnSale: true,  validFrom: new Date('2023-01-01'), validUntil: new Date('2023-12-31') },
  { productId: 'prod004', sku: 'KEY001', basePrice: 79.99,   salePrice: 79.99,   currency: 'USD', isOnSale: false, validFrom: new Date('2023-01-01'), validUntil: new Date('2023-12-31') },
  { productId: 'prod005', sku: 'MON001', basePrice: 399.99,  salePrice: 349.99,  currency: 'USD', isOnSale: true,  validFrom: new Date('2023-01-01'), validUntil: new Date('2023-12-31') },
  { productId: 'prod006', sku: 'HEA001', basePrice: 199.99,  salePrice: 179.99,  currency: 'USD', isOnSale: true,  validFrom: new Date('2023-01-01'), validUntil: new Date('2023-12-31') },
  { productId: 'prod007', sku: 'CAM001', basePrice: 299.99,  salePrice: 299.99,  currency: 'USD', isOnSale: false, validFrom: new Date('2023-01-01'), validUntil: new Date('2023-12-31') },
  { productId: 'prod008', sku: 'SPE001', basePrice: 149.99,  salePrice: 129.99,  currency: 'USD', isOnSale: true,  validFrom: new Date('2023-01-01'), validUntil: new Date('2023-12-31') },
];

const CONFIG_SETTINGS: ConfigSetting[] = [
  { key: 'app.name',        value: 'MyApp',        type: 'string',  category: 'general', description: 'Application name',        isSecret: false, updatedBy: 'admin001', updatedAt: new Date('2023-09-01') },
  { key: 'app.version',     value: '1.0.0',        type: 'string',  category: 'general', description: 'Application version',     isSecret: false, updatedBy: 'admin001', updatedAt: new Date('2023-09-01') },
  { key: 'app.debug',       value: 'false',        type: 'boolean', category: 'general', description: 'Debug mode enabled',      isSecret: false, updatedBy: 'admin001', updatedAt: new Date('2023-09-01') },
  { key: 'db.host',         value: 'localhost',    type: 'string',  category: 'database', description: 'Database host',          isSecret: false, updatedBy: 'admin002', updatedAt: new Date('2023-09-02') },
  { key: 'db.port',         value: '5432',         type: 'number',  category: 'database', description: 'Database port',          isSecret: false, updatedBy: 'admin002', updatedAt: new Date('2023-09-02') },
  { key: 'db.password',     value: '********',     type: 'string',  category: 'database', description: 'Database password',      isSecret: true,  updatedBy: 'admin002', updatedAt: new Date('2023-09-02') },
  { key: 'redis.host',      value: 'localhost',    type: 'string',  category: 'cache',    description: 'Redis host',             isSecret: false, updatedBy: 'admin001', updatedAt: new Date('2023-09-03') },
  { key: 'redis.port',      value: '6379',         type: 'number',  category: 'cache',    description: 'Redis port',             isSecret: false, updatedBy: 'admin001', updatedAt: new Date('2023-09-03') },
  { key: 'mail.host',       value: 'smtp.gmail.com', type: 'string', category: 'email',   description: 'SMTP host',              isSecret: false, updatedBy: 'admin002', updatedAt: new Date('2023-09-04') },
  { key: 'mail.username',   value: 'app@company.com', type: 'string', category: 'email',  description: 'SMTP username',          isSecret: false, updatedBy: 'admin002', updatedAt: new Date('2023-09-04') },
  { key: 'mail.password',   value: '********',     type: 'string',  category: 'email',    description: 'SMTP password',          isSecret: true,  updatedBy: 'admin002', updatedAt: new Date('2023-09-04') },
  { key: 'api.rateLimit',   value: '100',          type: 'number',  category: 'api',      description: 'API rate limit per hour', isSecret: false, updatedBy: 'admin001', updatedAt: new Date('2023-09-05') },
];

const API_ENDPOINTS: ApiEndpoint[] = [
  { method: 'GET',    path: '/api/users',           handler: 'getUsers',        middleware: ['auth', 'rateLimit'],     rateLimit: 100, authRequired: true,  deprecated: false, version: 'v1' },
  { method: 'POST',   path: '/api/users',           handler: 'createUser',      middleware: ['auth', 'validate'],      rateLimit: 50,  authRequired: true,  deprecated: false, version: 'v1' },
  { method: 'GET',    path: '/api/users/:id',       handler: 'getUserById',     middleware: ['auth'],                  rateLimit: 200, authRequired: true,  deprecated: false, version: 'v1' },
  { method: 'PUT',    path: '/api/users/:id',       handler: 'updateUser',      middleware: ['auth', 'validate'],      rateLimit: 30,  authRequired: true,  deprecated: false, version: 'v1' },
  { method: 'DELETE', path: '/api/users/:id',       handler: 'deleteUser',      middleware: ['auth', 'admin'],         rateLimit: 10,  authRequired: true,  deprecated: false, version: 'v1' },
  { method: 'GET',    path: '/api/products',        handler: 'getProducts',     middleware: ['rateLimit'],             rateLimit: 500, authRequired: false, deprecated: false, version: 'v1' },
  { method: 'POST',   path: '/api/products',        handler: 'createProduct',   middleware: ['auth', 'admin'],         rateLimit: 20,  authRequired: true,  deprecated: false, version: 'v1' },
  { method: 'GET',    path: '/api/products/:id',    handler: 'getProductById',  middleware: ['rateLimit'],             rateLimit: 1000, authRequired: false, deprecated: false, version: 'v1' },
  { method: 'PUT',    path: '/api/products/:id',    handler: 'updateProduct',   middleware: ['auth', 'admin'],         rateLimit: 20,  authRequired: true,  deprecated: false, version: 'v1' },
  { method: 'GET',    path: '/api/orders',          handler: 'getOrders',       middleware: ['auth'],                  rateLimit: 100, authRequired: true,  deprecated: false, version: 'v1' },
  { method: 'POST',   path: '/api/orders',          handler: 'createOrder',     middleware: ['auth', 'validate'],      rateLimit: 30,  authRequired: true,  deprecated: false, version: 'v1' },
  { method: 'GET',    path: '/api/orders/:id',      handler: 'getOrderById',    middleware: ['auth'],                  rateLimit: 200, authRequired: true,  deprecated: false, version: 'v1' },
];

// Utility functions for bulk operations on structured data
const updateAllPricesBy = (products: ProductPricing[], percentage: number): ProductPricing[] => {
  return products.map(product => ({
    ...product,
    basePrice: Math.round(product.basePrice * (1 + percentage / 100) * 100) / 100,
    salePrice: Math.round(product.salePrice * (1 + percentage / 100) * 100) / 100,
  }));
};

const toggleAllSaleStatus = (products: ProductPricing[]): ProductPricing[] => {
  return products.map(product => ({
    ...product,
    isOnSale: !product.isOnSale,
  }));
};

const updateAllRateLimits = (endpoints: ApiEndpoint[], multiplier: number): ApiEndpoint[] => {
  return endpoints.map(endpoint => ({
    ...endpoint,
    rateLimit: Math.round(endpoint.rateLimit * multiplier),
  }));
};

// Data transformation patterns perfect for multiple cursor simulation
const convertToUpperCase = (items: string[]): string[] => items.map(item => item.toUpperCase());
const convertToLowerCase = (items: string[]): string[] => items.map(item => item.toLowerCase());
const addPrefix = (items: string[], prefix: string): string[] => items.map(item => `${prefix}${item}`);
const addSuffix = (items: string[], suffix: string): string[] => items.map(item => `${item}${suffix}`);

// Export structured data for practice
export {
  USER_PERMISSIONS,
  ROLE_DEFINITIONS,
  PRODUCT_PRICING,
  CONFIG_SETTINGS,
  API_ENDPOINTS,
  updateAllPricesBy,
  toggleAllSaleStatus,
  updateAllRateLimits,
};