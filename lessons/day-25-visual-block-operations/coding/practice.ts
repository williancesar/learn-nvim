/**
 * TypeScript Practice: Visual Block Editing
 *
 * This file contains TypeScript code with tabular data and aligned structures
 * designed for practicing visual block operations (Ctrl+V, I, A, r, c, d).
 *
 * Focus on selecting rectangular blocks and editing multiple lines simultaneously.
 */

// Type tables for visual block practice - select columns with Ctrl+V
type DatabaseConnection = {
  host        : string;
  port        : number;
  database    : string;
  username    : string;
  password    : string;
  ssl         : boolean;
  timeout     : number;
  poolSize    : number;
  retries     : number;
};

type CacheConfiguration = {
  provider    : 'redis' | 'memory' | 'file';
  host        : string;
  port        : number;
  password    : string;
  database    : number;
  keyPrefix   : string;
  ttl         : number;
  maxMemory   : string;
  eviction    : 'lru' | 'lfu' | 'random';
};

type LoggingSettings = {
  level       : 'debug' | 'info' | 'warn' | 'error';
  format      : 'json' | 'text' | 'structured';
  destination : 'console' | 'file' | 'syslog';
  filename    : string;
  maxSize     : string;
  maxFiles    : number;
  rotation    : boolean;
  timestamp   : boolean;
  colorize    : boolean;
};

// Configuration object with aligned properties
const systemConfiguration = {
  application  : {
    name         : 'UserManagementSystem',
    version      : '2.1.0',
    environment  : 'production',
    port         : 3000,
    host         : '0.0.0.0',
    workers      : 4,
    timeout      : 30000,
    keepAlive    : true,
    compression  : true,
  },
  database     : {
    primary      : {
      host       : 'primary-db.company.com',
      port       : 5432,
      database   : 'user_management_prod',
      username   : 'app_user',
      password   : 'secure_password_123',
      ssl        : true,
      timeout    : 5000,
      poolSize   : 20,
      retries    : 3,
    },
    replica      : {
      host       : 'replica-db.company.com',
      port       : 5433,
      database   : 'user_management_replica',
      username   : 'readonly_user',
      password   : 'readonly_password_456',
      ssl        : true,
      timeout    : 5000,
      poolSize   : 10,
      retries    : 2,
    },
    backup       : {
      host       : 'backup-db.company.com',
      port       : 5434,
      database   : 'user_management_backup',
      username   : 'backup_user',
      password   : 'backup_password_789',
      ssl        : true,
      timeout    : 10000,
      poolSize   : 5,
      retries    : 1,
    },
  },
  redis        : {
    primary      : {
      host       : 'redis-primary.company.com',
      port       : 6379,
      password   : 'redis_primary_secret',
      database   : 0,
      keyPrefix  : 'app:primary:',
      ttl        : 3600,
      maxMemory  : '2gb',
      eviction   : 'allkeys-lru',
    },
    sessions     : {
      host       : 'redis-sessions.company.com',
      port       : 6380,
      password   : 'redis_sessions_secret',
      database   : 1,
      keyPrefix  : 'app:sessions:',
      ttl        : 86400,
      maxMemory  : '1gb',
      eviction   : 'volatile-ttl',
    },
    cache        : {
      host       : 'redis-cache.company.com',
      port       : 6381,
      password   : 'redis_cache_secret',
      database   : 2,
      keyPrefix  : 'app:cache:',
      ttl        : 1800,
      maxMemory  : '512mb',
      eviction   : 'allkeys-lfu',
    },
  },
  monitoring   : {
    prometheus   : {
      enabled    : true,
      port       : 9090,
      endpoint   : '/metrics',
      interval   : 15,
      retention  : '30d',
      storage    : '/data/prometheus',
    },
    grafana      : {
      enabled    : true,
      port       : 3001,
      database   : 'postgres',
      username   : 'grafana',
      password   : 'grafana_secret',
      adminUser  : 'admin',
      adminPass  : 'admin_secret',
    },
    alertmanager : {
      enabled    : true,
      port       : 9093,
      webhook    : 'https://hooks.slack.com/webhook',
      email      : 'alerts@company.com',
      retention  : '7d',
    },
  },
};

// API endpoint definitions with aligned structure
const apiEndpoints = {
  // User Management Endpoints
  users    : {
    list     : { method: 'GET',    path: '/api/v1/users',           auth: true,  cache: true,  rateLimit: 100 },
    create   : { method: 'POST',   path: '/api/v1/users',           auth: true,  cache: false, rateLimit: 10  },
    get      : { method: 'GET',    path: '/api/v1/users/:id',       auth: true,  cache: true,  rateLimit: 200 },
    update   : { method: 'PUT',    path: '/api/v1/users/:id',       auth: true,  cache: false, rateLimit: 20  },
    delete   : { method: 'DELETE', path: '/api/v1/users/:id',       auth: true,  cache: false, rateLimit: 5   },
    search   : { method: 'GET',    path: '/api/v1/users/search',    auth: true,  cache: true,  rateLimit: 50  },
  },
  // Authentication Endpoints
  auth     : {
    login    : { method: 'POST',   path: '/api/v1/auth/login',      auth: false, cache: false, rateLimit: 5   },
    logout   : { method: 'POST',   path: '/api/v1/auth/logout',     auth: true,  cache: false, rateLimit: 10  },
    refresh  : { method: 'POST',   path: '/api/v1/auth/refresh',    auth: false, cache: false, rateLimit: 10  },
    verify   : { method: 'POST',   path: '/api/v1/auth/verify',     auth: false, cache: false, rateLimit: 20  },
    reset    : { method: 'POST',   path: '/api/v1/auth/reset',      auth: false, cache: false, rateLimit: 3   },
  },
  // Profile Endpoints
  profile  : {
    get      : { method: 'GET',    path: '/api/v1/profile',         auth: true,  cache: true,  rateLimit: 100 },
    update   : { method: 'PUT',    path: '/api/v1/profile',         auth: true,  cache: false, rateLimit: 20  },
    avatar   : { method: 'POST',   path: '/api/v1/profile/avatar',  auth: true,  cache: false, rateLimit: 5   },
    settings : { method: 'PUT',    path: '/api/v1/profile/settings',auth: true,  cache: false, rateLimit: 10  },
  },
  // Analytics Endpoints
  analytics: {
    users    : { method: 'GET',    path: '/api/v1/analytics/users', auth: true,  cache: true,  rateLimit: 20  },
    sessions : { method: 'GET',    path: '/api/v1/analytics/sessions',auth: true, cache: true,  rateLimit: 20  },
    events   : { method: 'GET',    path: '/api/v1/analytics/events', auth: true,  cache: true,  rateLimit: 50  },
    reports  : { method: 'GET',    path: '/api/v1/analytics/reports',auth: true,  cache: true,  rateLimit: 10  },
  },
};

// Database schema definitions with aligned columns
const databaseSchema = {
  users: {
    columns: {
      id           : { type: 'UUID',         nullable: false, primaryKey: true,  default: 'gen_random_uuid()' },
      email        : { type: 'VARCHAR(255)', nullable: false, unique: true,      default: null                },
      username     : { type: 'VARCHAR(50)',  nullable: false, unique: true,      default: null                },
      password_hash: { type: 'VARCHAR(255)', nullable: false, unique: false,     default: null                },
      first_name   : { type: 'VARCHAR(100)', nullable: false, unique: false,     default: null                },
      last_name    : { type: 'VARCHAR(100)', nullable: false, unique: false,     default: null                },
      date_of_birth: { type: 'DATE',         nullable: true,  unique: false,     default: null                },
      phone_number : { type: 'VARCHAR(20)',  nullable: true,  unique: false,     default: null                },
      avatar_url   : { type: 'TEXT',         nullable: true,  unique: false,     default: null                },
      bio          : { type: 'TEXT',         nullable: true,  unique: false,     default: null                },
      status       : { type: 'VARCHAR(20)',  nullable: false, unique: false,     default: "'active'"          },
      role         : { type: 'VARCHAR(20)',  nullable: false, unique: false,     default: "'user'"            },
      verified_at  : { type: 'TIMESTAMP',    nullable: true,  unique: false,     default: null                },
      last_login_at: { type: 'TIMESTAMP',    nullable: true,  unique: false,     default: null                },
      created_at   : { type: 'TIMESTAMP',    nullable: false, unique: false,     default: 'CURRENT_TIMESTAMP' },
      updated_at   : { type: 'TIMESTAMP',    nullable: false, unique: false,     default: 'CURRENT_TIMESTAMP' },
    },
    indexes: {
      idx_users_email    : { columns: ['email'],        unique: true,  type: 'btree' },
      idx_users_username : { columns: ['username'],     unique: true,  type: 'btree' },
      idx_users_status   : { columns: ['status'],       unique: false, type: 'btree' },
      idx_users_role     : { columns: ['role'],         unique: false, type: 'btree' },
      idx_users_created  : { columns: ['created_at'],   unique: false, type: 'btree' },
      idx_users_verified : { columns: ['verified_at'],  unique: false, type: 'btree' },
    },
  },
  sessions: {
    columns: {
      id           : { type: 'UUID',         nullable: false, primaryKey: true,  default: 'gen_random_uuid()' },
      user_id      : { type: 'UUID',         nullable: false, unique: false,     default: null                },
      token_hash   : { type: 'VARCHAR(255)', nullable: false, unique: true,      default: null                },
      refresh_token: { type: 'VARCHAR(255)', nullable: true,  unique: true,      default: null                },
      device_info  : { type: 'JSONB',        nullable: true,  unique: false,     default: null                },
      ip_address   : { type: 'INET',         nullable: true,  unique: false,     default: null                },
      user_agent   : { type: 'TEXT',         nullable: true,  unique: false,     default: null                },
      is_active    : { type: 'BOOLEAN',      nullable: false, unique: false,     default: 'true'              },
      expires_at   : { type: 'TIMESTAMP',    nullable: false, unique: false,     default: null                },
      last_used_at : { type: 'TIMESTAMP',    nullable: true,  unique: false,     default: null                },
      created_at   : { type: 'TIMESTAMP',    nullable: false, unique: false,     default: 'CURRENT_TIMESTAMP' },
    },
    indexes: {
      idx_sessions_user_id   : { columns: ['user_id'],      unique: false, type: 'btree' },
      idx_sessions_token     : { columns: ['token_hash'],   unique: true,  type: 'hash'  },
      idx_sessions_refresh   : { columns: ['refresh_token'],unique: true,  type: 'hash'  },
      idx_sessions_expires   : { columns: ['expires_at'],   unique: false, type: 'btree' },
      idx_sessions_active    : { columns: ['is_active'],    unique: false, type: 'btree' },
    },
  },
  audit_logs: {
    columns: {
      id         : { type: 'UUID',         nullable: false, primaryKey: true,  default: 'gen_random_uuid()' },
      user_id    : { type: 'UUID',         nullable: true,  unique: false,     default: null                },
      action     : { type: 'VARCHAR(100)', nullable: false, unique: false,     default: null                },
      resource   : { type: 'VARCHAR(100)', nullable: false, unique: false,     default: null                },
      resource_id: { type: 'VARCHAR(255)', nullable: true,  unique: false,     default: null                },
      old_values : { type: 'JSONB',        nullable: true,  unique: false,     default: null                },
      new_values : { type: 'JSONB',        nullable: true,  unique: false,     default: null                },
      ip_address : { type: 'INET',         nullable: true,  unique: false,     default: null                },
      user_agent : { type: 'TEXT',         nullable: true,  unique: false,     default: null                },
      timestamp  : { type: 'TIMESTAMP',    nullable: false, unique: false,     default: 'CURRENT_TIMESTAMP' },
    },
    indexes: {
      idx_audit_user_id  : { columns: ['user_id'],    unique: false, type: 'btree' },
      idx_audit_action   : { columns: ['action'],     unique: false, type: 'btree' },
      idx_audit_resource : { columns: ['resource'],   unique: false, type: 'btree' },
      idx_audit_timestamp: { columns: ['timestamp'],  unique: false, type: 'btree' },
    },
  },
};

// Error code mappings with aligned structure
const errorCodes = {
  // Authentication Errors
  AUTH_001: { status: 401, message: 'Invalid credentials provided',           category: 'authentication', retryable: false },
  AUTH_002: { status: 401, message: 'Token expired or invalid',               category: 'authentication', retryable: false },
  AUTH_003: { status: 401, message: 'Account not verified',                   category: 'authentication', retryable: false },
  AUTH_004: { status: 423, message: 'Account locked due to failed attempts',  category: 'authentication', retryable: false },
  AUTH_005: { status: 403, message: 'Insufficient permissions',               category: 'authorization',  retryable: false },
  
  // Validation Errors
  VAL_001 : { status: 400, message: 'Email format is invalid',                category: 'validation',     retryable: false },
  VAL_002 : { status: 400, message: 'Password does not meet requirements',    category: 'validation',     retryable: false },
  VAL_003 : { status: 400, message: 'Username already exists',                category: 'validation',     retryable: false },
  VAL_004 : { status: 400, message: 'Email already registered',               category: 'validation',     retryable: false },
  VAL_005 : { status: 400, message: 'Required field missing',                 category: 'validation',     retryable: false },
  
  // Resource Errors
  RES_001 : { status: 404, message: 'User not found',                         category: 'resource',       retryable: false },
  RES_002 : { status: 404, message: 'Session not found',                      category: 'resource',       retryable: false },
  RES_003 : { status: 409, message: 'Resource conflict detected',             category: 'resource',       retryable: false },
  RES_004 : { status: 410, message: 'Resource no longer available',           category: 'resource',       retryable: false },
  
  // System Errors
  SYS_001 : { status: 500, message: 'Database connection failed',             category: 'system',         retryable: true  },
  SYS_002 : { status: 500, message: 'Cache service unavailable',              category: 'system',         retryable: true  },
  SYS_003 : { status: 500, message: 'External service timeout',               category: 'system',         retryable: true  },
  SYS_004 : { status: 503, message: 'Service temporarily unavailable',        category: 'system',         retryable: true  },
  SYS_005 : { status: 500, message: 'Internal server error',                  category: 'system',         retryable: false },
  
  // Rate Limiting Errors
  RATE_001: { status: 429, message: 'Rate limit exceeded for API calls',      category: 'rate_limit',     retryable: true  },
  RATE_002: { status: 429, message: 'Login attempts rate limit exceeded',     category: 'rate_limit',     retryable: true  },
  RATE_003: { status: 429, message: 'Registration rate limit exceeded',       category: 'rate_limit',     retryable: true  },
};

// Performance metrics configuration
const metricsConfiguration = {
  counters: {
    api_requests_total     : { help: 'Total number of API requests',           labels: ['method', 'endpoint', 'status'] },
    auth_attempts_total    : { help: 'Total authentication attempts',          labels: ['result', 'method']              },
    db_queries_total       : { help: 'Total database queries executed',       labels: ['operation', 'table']           },
    cache_operations_total : { help: 'Total cache operations',                 labels: ['operation', 'result']          },
    errors_total           : { help: 'Total number of errors',                 labels: ['type', 'code']                 },
  },
  histograms: {
    request_duration_seconds : { help: 'HTTP request duration in seconds',    buckets: [0.1, 0.5, 1, 2, 5, 10]         },
    db_query_duration_seconds: { help: 'Database query duration in seconds',  buckets: [0.001, 0.01, 0.1, 1, 5]        },
    cache_operation_duration : { help: 'Cache operation duration in seconds', buckets: [0.001, 0.005, 0.01, 0.05, 0.1] },
  },
  gauges: {
    active_connections     : { help: 'Number of active database connections'                                           },
    memory_usage_bytes     : { help: 'Current memory usage in bytes'                                                 },
    cpu_usage_percent      : { help: 'Current CPU usage percentage'                                                  },
    active_users           : { help: 'Number of currently active users'                                              },
    queue_size             : { help: 'Current size of the processing queue'                                          },
  },
};

// Test data arrays for visual block operations
const testUsers = [
  { id: 'usr_001', name: 'John Smith',      email: 'john.smith@example.com',      age: 28, department: 'Engineering', salary: 75000, active: true  },
  { id: 'usr_002', name: 'Jane Doe',        email: 'jane.doe@example.com',        age: 32, department: 'Marketing',   salary: 68000, active: true  },
  { id: 'usr_003', name: 'Bob Johnson',     email: 'bob.johnson@example.com',     age: 45, department: 'Sales',       salary: 82000, active: false },
  { id: 'usr_004', name: 'Alice Brown',     email: 'alice.brown@example.com',     age: 29, department: 'Engineering', salary: 78000, active: true  },
  { id: 'usr_005', name: 'Charlie Wilson',  email: 'charlie.wilson@example.com',  age: 38, department: 'HR',          salary: 65000, active: true  },
  { id: 'usr_006', name: 'Diana Prince',    email: 'diana.prince@example.com',    age: 31, department: 'Legal',       salary: 85000, active: true  },
  { id: 'usr_007', name: 'Edward Davis',    email: 'edward.davis@example.com',    age: 42, department: 'Finance',     salary: 72000, active: false },
  { id: 'usr_008', name: 'Fiona Miller',    email: 'fiona.miller@example.com',    age: 27, department: 'Design',      salary: 63000, active: true  },
  { id: 'usr_009', name: 'George Taylor',   email: 'george.taylor@example.com',   age: 35, department: 'Operations',  salary: 70000, active: true  },
  { id: 'usr_010', name: 'Helen Anderson',  email: 'helen.anderson@example.com',  age: 40, department: 'Quality',     salary: 67000, active: false },
];

const testProducts = [
  { sku: 'PRD001', name: 'Laptop Pro 15"',        category: 'Electronics', price: 1299.99, stock: 45,  rating: 4.5, featured: true  },
  { sku: 'PRD002', name: 'Wireless Mouse',        category: 'Accessories', price:   29.99, stock: 150, rating: 4.2, featured: false },
  { sku: 'PRD003', name: 'Mechanical Keyboard',   category: 'Accessories', price:   89.99, stock: 78,  rating: 4.7, featured: true  },
  { sku: 'PRD004', name: 'Monitor 4K 27"',        category: 'Electronics', price:  399.99, stock: 23,  rating: 4.4, featured: true  },
  { sku: 'PRD005', name: 'USB-C Hub',             category: 'Accessories', price:   49.99, stock: 92,  rating: 4.1, featured: false },
  { sku: 'PRD006', name: 'Webcam HD',             category: 'Electronics', price:   79.99, stock: 34,  rating: 4.0, featured: false },
  { sku: 'PRD007', name: 'Desk Lamp LED',         category: 'Furniture',   price:   35.99, stock: 67,  rating: 4.3, featured: false },
  { sku: 'PRD008', name: 'Office Chair',          category: 'Furniture',   price:  249.99, stock: 12,  rating: 4.6, featured: true  },
  { sku: 'PRD009', name: 'Headphones Wireless',   category: 'Audio',       price:  159.99, stock: 89,  rating: 4.8, featured: true  },
  { sku: 'PRD010', name: 'Bluetooth Speaker',     category: 'Audio',       price:   69.99, stock: 156, rating: 4.2, featured: false },
];

const testOrders = [
  { id: 'ORD001', customer: 'John Smith',      date: '2024-01-15', total:  1329.98, items: 2, status: 'completed', payment: 'credit_card' },
  { id: 'ORD002', customer: 'Jane Doe',        date: '2024-01-16', total:   119.98, items: 3, status: 'shipped',   payment: 'paypal'      },
  { id: 'ORD003', customer: 'Bob Johnson',     date: '2024-01-17', total:   449.98, items: 1, status: 'processing',payment: 'credit_card' },
  { id: 'ORD004', customer: 'Alice Brown',     date: '2024-01-18', total:    89.99, items: 1, status: 'completed', payment: 'debit_card'  },
  { id: 'ORD005', customer: 'Charlie Wilson',  date: '2024-01-19', total:   285.97, items: 4, status: 'cancelled', payment: 'credit_card' },
  { id: 'ORD006', customer: 'Diana Prince',    date: '2024-01-20', total:   159.99, items: 1, status: 'shipped',   payment: 'paypal'      },
  { id: 'ORD007', customer: 'Edward Davis',    date: '2024-01-21', total:    35.99, items: 1, status: 'completed', payment: 'credit_card' },
  { id: 'ORD008', customer: 'Fiona Miller',    date: '2024-01-22', total:   319.98, items: 2, status: 'processing',payment: 'debit_card'  },
  { id: 'ORD009', customer: 'George Taylor',   date: '2024-01-23', total:   229.98, items: 3, status: 'shipped',   payment: 'credit_card' },
  { id: 'ORD010', customer: 'Helen Anderson',  date: '2024-01-24', total:    69.99, items: 1, status: 'completed', payment: 'paypal'      },
];

// Export all configurations for use in other modules
export {
  systemConfiguration,
  apiEndpoints,
  databaseSchema,
  errorCodes,
  metricsConfiguration,
  testUsers,
  testProducts,
  testOrders,
  type DatabaseConnection,
  type CacheConfiguration,
  type LoggingSettings,
};