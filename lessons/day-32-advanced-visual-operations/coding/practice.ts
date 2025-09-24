/**
 * Day 32: TypeScript Advanced Visual Operations Practice
 * Focus: Complex visual selections with TypeScript code structures
 *
 * Exercise Goals:
 * - Practice visual line selections (V) on complex TypeScript blocks
 * - Master visual block selections (Ctrl+V) for column operations
 * - Learn visual character selections (v) for precise text operations
 * - Practice selecting and manipulating entire functions, classes, and types
 */

// Complex nested type definitions for visual selection practice
type DatabaseConnection = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  timeout: number;
  maxConnections: number;
  retryAttempts: number;
  retryDelay: number;
};

type CacheConfiguration = {
  enabled: boolean;
  provider: 'redis' | 'memcached' | 'memory';
  host?: string;
  port?: number;
  ttl: number;
  maxSize: number;
  keyPrefix: string;
  compression: boolean;
  serialization: 'json' | 'msgpack' | 'pickle';
  evictionPolicy: 'lru' | 'lfu' | 'ttl';
};

type LoggingConfiguration = {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text' | 'structured';
  outputs: Array<{
    type: 'console' | 'file' | 'syslog' | 'http';
    target?: string;
    level?: string;
    format?: string;
    rotation?: {
      maxSize: string;
      maxFiles: number;
      compress: boolean;
    };
  }>;
  fields: {
    timestamp: boolean;
    level: boolean;
    message: boolean;
    source: boolean;
    stackTrace: boolean;
    requestId: boolean;
    userId: boolean;
  };
};

// Multi-line interface perfect for visual block selections
interface ApplicationConfiguration {
  name:           string;           // Application name
  version:        string;           // Version number
  environment:    string;           // Environment (dev/staging/prod)
  debug:          boolean;          // Debug mode enabled
  port:           number;           // Server port
  host:           string;           // Server host
  baseUrl:        string;           // Base URL for the application
  apiPrefix:      string;           // API route prefix
  corsEnabled:    boolean;          // CORS enabled
  rateLimiting:   boolean;          // Rate limiting enabled
  compression:    boolean;          // Response compression
  healthCheck:    boolean;          // Health check endpoint
  metrics:        boolean;          // Metrics collection
  monitoring:     boolean;          // Application monitoring
  security:       boolean;          // Security features enabled
  authentication: boolean;          // Authentication required
}

// Complex class with multiple methods for visual selection practice
class ConfigurationManager {
  private config: ApplicationConfiguration;
  private database: DatabaseConnection;
  private cache: CacheConfiguration;
  private logging: LoggingConfiguration;

  constructor(
    config: ApplicationConfiguration,
    database: DatabaseConnection,
    cache: CacheConfiguration,
    logging: LoggingConfiguration
  ) {
    this.config = config;
    this.database = database;
    this.cache = cache;
    this.logging = logging;
  }

  // Method 1: Database configuration
  getDatabaseConfig(): DatabaseConnection {
    return {
      host: this.database.host,
      port: this.database.port,
      database: this.database.database,
      username: this.database.username,
      password: this.database.password,
      ssl: this.database.ssl,
      timeout: this.database.timeout,
      maxConnections: this.database.maxConnections,
      retryAttempts: this.database.retryAttempts,
      retryDelay: this.database.retryDelay,
    };
  }

  // Method 2: Cache configuration
  getCacheConfig(): CacheConfiguration {
    return {
      enabled: this.cache.enabled,
      provider: this.cache.provider,
      host: this.cache.host,
      port: this.cache.port,
      ttl: this.cache.ttl,
      maxSize: this.cache.maxSize,
      keyPrefix: this.cache.keyPrefix,
      compression: this.cache.compression,
      serialization: this.cache.serialization,
      evictionPolicy: this.cache.evictionPolicy,
    };
  }

  // Method 3: Logging configuration
  getLoggingConfig(): LoggingConfiguration {
    return {
      level: this.logging.level,
      format: this.logging.format,
      outputs: this.logging.outputs.map(output => ({
        type: output.type,
        target: output.target,
        level: output.level,
        format: output.format,
        rotation: output.rotation ? {
          maxSize: output.rotation.maxSize,
          maxFiles: output.rotation.maxFiles,
          compress: output.rotation.compress,
        } : undefined,
      })),
      fields: {
        timestamp: this.logging.fields.timestamp,
        level: this.logging.fields.level,
        message: this.logging.fields.message,
        source: this.logging.fields.source,
        stackTrace: this.logging.fields.stackTrace,
        requestId: this.logging.fields.requestId,
        userId: this.logging.fields.userId,
      },
    };
  }

  // Method 4: Validation methods
  validateDatabaseConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.database.host) errors.push('Database host is required');
    if (!this.database.port || this.database.port < 1 || this.database.port > 65535) {
      errors.push('Valid database port is required');
    }
    if (!this.database.database) errors.push('Database name is required');
    if (!this.database.username) errors.push('Database username is required');
    if (!this.database.password) errors.push('Database password is required');
    if (this.database.timeout < 1000) errors.push('Timeout must be at least 1000ms');
    if (this.database.maxConnections < 1) errors.push('Max connections must be positive');

    return { valid: errors.length === 0, errors };
  }

  validateCacheConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.cache.enabled) {
      if (!this.cache.provider) errors.push('Cache provider is required when enabled');
      if (this.cache.provider !== 'memory' && !this.cache.host) {
        errors.push('Cache host is required for external providers');
      }
      if (this.cache.provider !== 'memory' && !this.cache.port) {
        errors.push('Cache port is required for external providers');
      }
      if (this.cache.ttl < 1) errors.push('TTL must be positive');
      if (this.cache.maxSize < 1) errors.push('Max size must be positive');
    }

    return { valid: errors.length === 0, errors };
  }

  validateLoggingConfig(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.logging.level) errors.push('Logging level is required');
    if (!this.logging.format) errors.push('Logging format is required');
    if (!this.logging.outputs || this.logging.outputs.length === 0) {
      errors.push('At least one logging output is required');
    }

    this.logging.outputs.forEach((output, index) => {
      if (!output.type) errors.push(`Output ${index}: type is required`);
      if (output.type === 'file' && !output.target) {
        errors.push(`Output ${index}: file target is required`);
      }
      if (output.type === 'http' && !output.target) {
        errors.push(`Output ${index}: HTTP target URL is required`);
      }
    });

    return { valid: errors.length === 0, errors };
  }

  // Method 5: Configuration merging
  mergeConfigurations(override: Partial<ApplicationConfiguration>): ApplicationConfiguration {
    return {
      name: override.name ?? this.config.name,
      version: override.version ?? this.config.version,
      environment: override.environment ?? this.config.environment,
      debug: override.debug ?? this.config.debug,
      port: override.port ?? this.config.port,
      host: override.host ?? this.config.host,
      baseUrl: override.baseUrl ?? this.config.baseUrl,
      apiPrefix: override.apiPrefix ?? this.config.apiPrefix,
      corsEnabled: override.corsEnabled ?? this.config.corsEnabled,
      rateLimiting: override.rateLimiting ?? this.config.rateLimiting,
      compression: override.compression ?? this.config.compression,
      healthCheck: override.healthCheck ?? this.config.healthCheck,
      metrics: override.metrics ?? this.config.metrics,
      monitoring: override.monitoring ?? this.config.monitoring,
      security: override.security ?? this.config.security,
      authentication: override.authentication ?? this.config.authentication,
    };
  }
}

// Array of similar objects for visual block operations
const defaultConfigurations = [
  { name: 'development',  environment: 'dev',     debug: true,  port: 3000, corsEnabled: true  },
  { name: 'testing',      environment: 'test',    debug: true,  port: 3001, corsEnabled: true  },
  { name: 'staging',      environment: 'staging', debug: false, port: 3002, corsEnabled: false },
  { name: 'production',   environment: 'prod',    debug: false, port: 3003, corsEnabled: false },
  { name: 'local',        environment: 'local',   debug: true,  port: 3004, corsEnabled: true  },
];

// Multi-line constants for visual selection practice
const DATABASE_URLS = [
  'postgresql://user:pass@localhost:5432/app_dev',      // Development database
  'postgresql://user:pass@localhost:5433/app_test',     // Testing database
  'postgresql://user:pass@staging.db:5432/app_staging', // Staging database
  'postgresql://user:pass@prod.db:5432/app_prod',       // Production database
  'postgresql://user:pass@localhost:5434/app_local',    // Local database
];

const CACHE_ENDPOINTS = [
  'redis://localhost:6379/0',        // Local Redis instance
  'redis://cache-dev:6379/1',        // Development cache
  'redis://cache-staging:6379/2',    // Staging cache
  'redis://cache-prod:6379/3',       // Production cache
  'memcached://localhost:11211',     // Local Memcached
];

const LOG_LEVELS = [
  'debug',    // Detailed debugging information
  'info',     // General information messages
  'warn',     // Warning messages
  'error',    // Error messages only
  'fatal',    // Fatal errors only
];

// Export statements for visual selection practice
export { ConfigurationManager };
export { ApplicationConfiguration, DatabaseConnection, CacheConfiguration, LoggingConfiguration };
export { defaultConfigurations, DATABASE_URLS, CACHE_ENDPOINTS, LOG_LEVELS };
export type { ApplicationConfiguration as AppConfig };
export type { DatabaseConnection as DbConfig };
export type { CacheConfiguration as CacheConfig };
export type { LoggingConfiguration as LogConfig };