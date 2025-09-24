/**
 * Day 32: Advanced Visual Operations Practice
 *
 * This file contains code designed for practicing advanced visual mode operations.
 * Focus on visual block mode, visual line mode, and complex visual selections.
 *
 * Key commands to practice:
 * - v (visual character mode)
 * - V (visual line mode)
 * - Ctrl-v (visual block mode)
 * - gv (reselect last visual selection)
 * - o (move to other end of selection)
 * - Visual operations: y, d, c, <, >, =, ~, u, U
 */

// VISUAL EXERCISE 1: Column-based data for visual block operations
// Practice selecting columns and performing operations on them
const salesData = [
  'Jan    15000   12000   8000    35000',
  'Feb    18000   14000   9500    41500',
  'Mar    22000   16000   11000   49000',
  'Apr    19000   15000   10200   44200',
  'May    25000   18000   12500   55500',
  'Jun    28000   20000   14000   62000',
  'Jul    30000   22000   15500   67500',
  'Aug    27000   19000   13800   59800',
  'Sep    24000   17000   12000   53000',
  'Oct    26000   18500   13200   57700',
  'Nov    29000   21000   14800   64800',
  'Dec    32000   24000   16500   72500'
];

// VISUAL EXERCISE 2: Tabular configuration data
// Practice selecting and modifying table-like structures
const serverConfigs = [
  'server01     192.168.1.10    8080    production    nginx     active',
  'server02     192.168.1.11    8080    production    apache    active',
  'server03     192.168.1.12    8080    staging       nginx     active',
  'server04     192.168.1.13    8080    staging       apache    inactive',
  'server05     192.168.1.14    8080    development   nginx     active',
  'server06     192.168.1.15    8080    development   apache    active',
  'server07     192.168.1.16    8080    testing       nginx     inactive',
  'server08     192.168.1.17    8080    testing       apache    active',
  'server09     192.168.1.18    8080    production    nginx     active',
  'server10     192.168.1.19    8080    production    apache    active'
];

// VISUAL EXERCISE 3: Multi-line object properties for line visual mode
// Practice selecting entire properties and moving/duplicating them
const userProfile = {
  // Personal Information
  firstName: 'Alexander',
  lastName: 'Richardson',
  email: 'alex.richardson@example.com',
  phone: '+1-555-0123',
  dateOfBirth: '1990-05-15',

  // Address Information
  address: {
    street: '123 Main Street',
    apartment: 'Apt 4B',
    city: 'San Francisco',
    state: 'California',
    zipCode: '94102',
    country: 'United States'
  },

  // Employment Information
  employment: {
    company: 'TechCorp Solutions',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    startDate: '2020-03-15',
    salary: 120000,
    manager: 'Sarah Johnson'
  },

  // Preferences
  preferences: {
    theme: 'dark',
    language: 'en-US',
    timezone: 'America/Los_Angeles',
    notifications: {
      email: true,
      sms: false,
      push: true,
      newsletter: true
    }
  },

  // Skills and Certifications
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Docker',
    'Kubernetes',
    'AWS'
  ],

  certifications: [
    'AWS Certified Solutions Architect',
    'Google Cloud Professional',
    'Certified Kubernetes Administrator'
  ]
};

// VISUAL EXERCISE 4: Array of similar objects for practicing visual operations
// Practice selecting multiple similar elements across different objects
const productCatalog = [
  {
    id: 'PROD001',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    subcategory: 'Audio',
    price: 149.99,
    discount: 0.15,
    inStock: true,
    quantity: 50,
    rating: 4.5,
    reviews: 324,
    brand: 'AudioTech',
    model: 'BT-500',
    color: 'Black'
  },
  {
    id: 'PROD002',
    name: 'Smartphone Protective Case',
    category: 'Electronics',
    subcategory: 'Accessories',
    price: 29.99,
    discount: 0.10,
    inStock: true,
    quantity: 150,
    rating: 4.2,
    reviews: 89,
    brand: 'ProtectPlus',
    model: 'SP-X12',
    color: 'Clear'
  },
  {
    id: 'PROD003',
    name: 'USB-C Charging Cable',
    category: 'Electronics',
    subcategory: 'Cables',
    price: 19.99,
    discount: 0.05,
    inStock: false,
    quantity: 0,
    rating: 4.0,
    reviews: 156,
    brand: 'ChargeFast',
    model: 'CC-USB3',
    color: 'White'
  },
  {
    id: 'PROD004',
    name: 'Portable Power Bank',
    category: 'Electronics',
    subcategory: 'Power',
    price: 79.99,
    discount: 0.20,
    inStock: true,
    quantity: 25,
    rating: 4.7,
    reviews: 201,
    brand: 'PowerMax',
    model: 'PB-10000',
    color: 'Blue'
  }
];

// VISUAL EXERCISE 5: CSS-like property blocks for visual block editing
// Practice selecting and modifying CSS-style properties in blocks
const componentStyles = `
.header-container {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 24px;
  padding-right: 24px;
  margin-top: 0px;
  margin-bottom: 0px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navigation-menu {
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
}

.content-section {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 32px;
  padding-right: 32px;
  margin-top: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.footer-area {
  background-color: #343a40;
  border-top: 1px solid #495057;
  padding-top: 24px;
  padding-bottom: 24px;
  padding-left: 48px;
  padding-right: 48px;
  margin-top: 32px;
  margin-bottom: 0px;
  color: #ffffff;
}`;

// VISUAL EXERCISE 6: Database schema-like structure
// Practice selecting table definitions and column groups
const databaseSchema = `
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    date_of_birth   DATE,
    phone_number    VARCHAR(20),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login      TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE,
    is_verified     BOOLEAN DEFAULT FALSE
);

CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    price           DECIMAL(10,2) NOT NULL,
    cost            DECIMAL(10,2),
    category_id     INTEGER REFERENCES categories(id),
    brand_id        INTEGER REFERENCES brands(id),
    sku             VARCHAR(100) UNIQUE,
    barcode         VARCHAR(100),
    weight          DECIMAL(8,3),
    dimensions      JSONB,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active       BOOLEAN DEFAULT TRUE
);

CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    order_number    VARCHAR(50) UNIQUE NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending',
    total_amount    DECIMAL(12,2) NOT NULL,
    tax_amount      DECIMAL(10,2),
    shipping_cost   DECIMAL(8,2),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    payment_method  VARCHAR(50),
    shipping_address JSONB,
    billing_address JSONB,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipped_at      TIMESTAMP,
    delivered_at    TIMESTAMP
);`;

// VISUAL EXERCISE 7: Configuration arrays with aligned values
// Practice selecting columns of values and modifying them together
const serverSettings = [
  ['max_connections',        '100',     'integer',   'Maximum database connections'],
  ['timeout_seconds',        '30',      'integer',   'Connection timeout in seconds'],
  ['retry_attempts',         '3',       'integer',   'Number of retry attempts'],
  ['log_level',             'info',     'string',    'Logging level (debug/info/warn/error)'],
  ['ssl_enabled',           'true',     'boolean',   'Enable SSL/TLS encryption'],
  ['port_number',           '5432',     'integer',   'Server port number'],
  ['host_address',          'localhost', 'string',   'Server host address'],
  ['database_name',         'myapp',    'string',    'Default database name'],
  ['username',              'admin',    'string',    'Default username'],
  ['password_required',     'true',     'boolean',   'Require password authentication'],
  ['backup_enabled',        'true',     'boolean',   'Enable automatic backups'],
  ['backup_frequency',      'daily',    'string',    'Backup frequency (hourly/daily/weekly)'],
  ['compression_enabled',   'false',    'boolean',   'Enable data compression'],
  ['cache_size_mb',         '256',      'integer',   'Cache size in megabytes'],
  ['temp_dir',              '/tmp',     'string',    'Temporary directory path']
];

// VISUAL EXERCISE 8: Multi-line function parameters
// Practice selecting parameter groups and reordering them
function createComplexConfiguration(
  serverHost,
  serverPort,
  databaseName,
  username,
  password,
  sslEnabled,
  connectionTimeout,
  maxConnections,
  retryAttempts,
  logLevel,
  backupEnabled,
  backupFrequency,
  compressionEnabled,
  cacheSize,
  tempDirectory
) {
  return {
    server: {
      host: serverHost,
      port: serverPort,
      ssl: sslEnabled,
      timeout: connectionTimeout,
      maxConnections: maxConnections
    },
    database: {
      name: databaseName,
      username: username,
      password: password,
      retryAttempts: retryAttempts
    },
    logging: {
      level: logLevel
    },
    backup: {
      enabled: backupEnabled,
      frequency: backupFrequency
    },
    performance: {
      compression: compressionEnabled,
      cacheSize: cacheSize,
      tempDir: tempDirectory
    }
  };
}

// VISUAL EXERCISE 9: API endpoint definitions with similar patterns
// Practice selecting and modifying endpoint patterns
const apiRoutes = {
  // User management endpoints
  'GET    /api/v1/users':           'listUsers',
  'POST   /api/v1/users':           'createUser',
  'GET    /api/v1/users/:id':       'getUser',
  'PUT    /api/v1/users/:id':       'updateUser',
  'DELETE /api/v1/users/:id':       'deleteUser',

  // Product management endpoints
  'GET    /api/v1/products':        'listProducts',
  'POST   /api/v1/products':        'createProduct',
  'GET    /api/v1/products/:id':    'getProduct',
  'PUT    /api/v1/products/:id':    'updateProduct',
  'DELETE /api/v1/products/:id':    'deleteProduct',

  // Order management endpoints
  'GET    /api/v1/orders':          'listOrders',
  'POST   /api/v1/orders':          'createOrder',
  'GET    /api/v1/orders/:id':      'getOrder',
  'PUT    /api/v1/orders/:id':      'updateOrder',
  'DELETE /api/v1/orders/:id':      'cancelOrder',

  // Category management endpoints
  'GET    /api/v1/categories':      'listCategories',
  'POST   /api/v1/categories':      'createCategory',
  'GET    /api/v1/categories/:id':  'getCategory',
  'PUT    /api/v1/categories/:id':  'updateCategory',
  'DELETE /api/v1/categories/:id':  'deleteCategory'
};

// VISUAL EXERCISE 10: Comment blocks for visual line operations
// Practice selecting and moving entire comment blocks
/**
 * Authentication and Authorization Module
 *
 * This module handles user authentication, session management,
 * and role-based access control for the application.
 *
 * Features:
 * - JWT token generation and validation
 * - Password hashing and verification
 * - Role-based permissions
 * - Session timeout handling
 * - Multi-factor authentication support
 */

/**
 * Database Connection and Query Module
 *
 * Provides abstraction layer for database operations
 * including connection pooling, query building, and
 * transaction management.
 *
 * Features:
 * - Connection pooling
 * - Query builder interface
 * - Transaction support
 * - Migration management
 * - Database health monitoring
 */

/**
 * Email Notification Service
 *
 * Handles all email communications including
 * transactional emails, newsletters, and
 * automated notification campaigns.
 *
 * Features:
 * - Template-based emails
 * - Queue management
 * - Delivery tracking
 * - A/B testing support
 * - Unsubscribe handling
 */

/**
 * File Upload and Storage Service
 *
 * Manages file uploads, processing, and storage
 * with support for multiple storage backends
 * and automatic optimization.
 *
 * Features:
 * - Multiple storage backends (S3, local, etc.)
 * - Image resizing and optimization
 * - Virus scanning
 * - CDN integration
 * - File metadata tracking
 */

export {
  salesData,
  serverConfigs,
  userProfile,
  productCatalog,
  componentStyles,
  databaseSchema,
  serverSettings,
  createComplexConfiguration,
  apiRoutes
};