/**
 * Day 13: Application Configuration
 *
 * Navigate here from api.client.ts using :e config.ts
 * Practice window splitting: :split, :vsplit, and Ctrl-w navigation
 * Try opening this file in a new tab: :tabnew config.ts
 */

import {
  AppConfig,
  ApiClientConfig,
  LoggerConfig,
  LogLevel
} from './types';

/**
 * Development environment configuration
 */
const developmentConfig: AppConfig = {
  env: 'development',

  api: {
    baseURL: 'http://localhost:3001/api',
    timeout: 10000, // 10 seconds
    retries: 2,
    retryDelay: 1000, // 1 second
    headers: {
      'X-Client-Version': '1.0.0',
      'X-Client-Platform': 'web'
    },
    auth: {
      type: 'bearer'
    }
  },

  logging: {
    level: LogLevel.DEBUG,
    format: 'text',
    outputs: [
      {
        type: 'console',
        config: {
          colorized: true,
          showTimestamp: true
        }
      }
    ]
  },

  features: {
    registration: true,
    passwordReset: true,
    emailVerification: false, // Disabled in dev for easier testing
    socialLogin: true,
    twoFactorAuth: false // Disabled in dev
  },

  security: {
    passwordMinLength: 6, // Relaxed for dev
    passwordRequireSpecialChars: false, // Relaxed for dev
    sessionTimeout: 86400000, // 24 hours
    maxLoginAttempts: 10, // Higher limit for dev
    lockoutDuration: 300000 // 5 minutes
  },

  ui: {
    theme: 'light',
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    timezone: 'UTC'
  }
};

/**
 * Staging environment configuration
 */
const stagingConfig: AppConfig = {
  env: 'staging',

  api: {
    baseURL: 'https://api-staging.example.com/api',
    timeout: 15000, // 15 seconds
    retries: 3,
    retryDelay: 2000, // 2 seconds
    headers: {
      'X-Client-Version': '1.0.0',
      'X-Client-Platform': 'web',
      'X-Environment': 'staging'
    },
    auth: {
      type: 'bearer'
    }
  },

  logging: {
    level: LogLevel.INFO,
    format: 'json',
    outputs: [
      {
        type: 'console',
        config: {
          colorized: false,
          showTimestamp: true
        }
      },
      {
        type: 'http',
        config: {
          endpoint: 'https://logs-staging.example.com/ingest',
          batchSize: 100,
          flushInterval: 5000
        }
      }
    ]
  },

  features: {
    registration: true,
    passwordReset: true,
    emailVerification: true,
    socialLogin: true,
    twoFactorAuth: false // Not yet ready for staging
  },

  security: {
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
    sessionTimeout: 28800000, // 8 hours
    maxLoginAttempts: 5,
    lockoutDuration: 900000 // 15 minutes
  },

  ui: {
    theme: 'light',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'hh:mm A',
    timezone: 'UTC'
  }
};

/**
 * Production environment configuration
 */
const productionConfig: AppConfig = {
  env: 'production',

  api: {
    baseURL: 'https://api.example.com/api',
    timeout: 30000, // 30 seconds
    retries: 5,
    retryDelay: 3000, // 3 seconds
    headers: {
      'X-Client-Version': '1.0.0',
      'X-Client-Platform': 'web'
    },
    auth: {
      type: 'bearer'
    }
  },

  logging: {
    level: LogLevel.WARN, // Only warnings and errors in production
    format: 'json',
    outputs: [
      {
        type: 'http',
        config: {
          endpoint: 'https://logs.example.com/ingest',
          batchSize: 500,
          flushInterval: 10000,
          apiKey: process.env.LOGGING_API_KEY
        }
      }
    ]
  },

  features: {
    registration: true,
    passwordReset: true,
    emailVerification: true,
    socialLogin: true,
    twoFactorAuth: true
  },

  security: {
    passwordMinLength: 12, // Stricter in production
    passwordRequireSpecialChars: true,
    sessionTimeout: 3600000, // 1 hour
    maxLoginAttempts: 3,
    lockoutDuration: 1800000 // 30 minutes
  },

  ui: {
    theme: 'auto',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'hh:mm A',
    timezone: 'America/New_York'
  }
};

/**
 * Database configuration for different environments
 */
export const databaseConfig = {
  development: {
    host: 'localhost',
    port: 5432,
    database: 'myapp_dev',
    username: 'dev_user',
    password: 'dev_password',
    ssl: false,
    pool: {
      min: 2,
      max: 10,
      idle: 30000,
      acquire: 60000
    },
    logging: true,
    synchronize: true, // Auto-sync schema in dev
    dropSchema: false
  },

  staging: {
    host: process.env.DB_HOST || 'staging-db.example.com',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'myapp_staging',
    username: process.env.DB_USER || 'staging_user',
    password: process.env.DB_PASSWORD || 'staging_password',
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    pool: {
      min: 5,
      max: 20,
      idle: 30000,
      acquire: 60000
    },
    logging: false,
    synchronize: false,
    dropSchema: false
  },

  production: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: process.env.DB_SSL_CA,
      cert: process.env.DB_SSL_CERT,
      key: process.env.DB_SSL_KEY
    },
    pool: {
      min: 10,
      max: 50,
      idle: 30000,
      acquire: 60000
    },
    logging: false,
    synchronize: false,
    dropSchema: false
  }
};

/**
 * Redis cache configuration
 */
export const cacheConfig = {
  development: {
    host: 'localhost',
    port: 6379,
    password: undefined,
    db: 0,
    ttl: 300, // 5 minutes
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableOfflineQueue: false
  },

  staging: {
    host: process.env.REDIS_HOST || 'staging-redis.example.com',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: 0,
    ttl: 600, // 10 minutes
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    enableOfflineQueue: false,
    tls: {
      rejectUnauthorized: false
    }
  },

  production: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD!,
    db: 0,
    ttl: 3600, // 1 hour
    maxRetriesPerRequest: 5,
    retryDelayOnFailover: 200,
    enableOfflineQueue: false,
    tls: {
      rejectUnauthorized: true
    }
  }
};

/**
 * Email service configuration
 */
export const emailConfig = {
  development: {
    provider: 'smtp',
    smtp: {
      host: 'localhost',
      port: 1025, // MailHog for local dev
      secure: false,
      auth: undefined
    },
    from: {
      name: 'MyApp Dev',
      email: 'dev@myapp.local'
    },
    templates: {
      welcome: 'templates/welcome.hbs',
      passwordReset: 'templates/password-reset.hbs',
      emailVerification: 'templates/email-verification.hbs'
    }
  },

  staging: {
    provider: 'sendgrid',
    apiKey: process.env.SENDGRID_API_KEY,
    from: {
      name: 'MyApp Staging',
      email: 'staging@example.com'
    },
    templates: {
      welcome: 'd-1234567890abcdef1234567890abcdef',
      passwordReset: 'd-abcdef1234567890abcdef1234567890',
      emailVerification: 'd-567890abcdef1234567890abcdef1234'
    }
  },

  production: {
    provider: 'sendgrid',
    apiKey: process.env.SENDGRID_API_KEY!,
    from: {
      name: 'MyApp',
      email: 'noreply@example.com'
    },
    templates: {
      welcome: process.env.SENDGRID_TEMPLATE_WELCOME!,
      passwordReset: process.env.SENDGRID_TEMPLATE_PASSWORD_RESET!,
      emailVerification: process.env.SENDGRID_TEMPLATE_EMAIL_VERIFICATION!
    }
  }
};

/**
 * File upload configuration
 */
export const uploadConfig = {
  development: {
    provider: 'local',
    local: {
      uploadDir: './uploads',
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain'
      ]
    },
    baseUrl: 'http://localhost:3001/uploads'
  },

  staging: {
    provider: 's3',
    s3: {
      bucket: process.env.S3_BUCKET_STAGING || 'myapp-staging-uploads',
      region: process.env.S3_REGION || 'us-east-1',
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
    },
    baseUrl: `https://${process.env.S3_BUCKET_STAGING}.s3.amazonaws.com`
  },

  production: {
    provider: 's3',
    s3: {
      bucket: process.env.S3_BUCKET!,
      region: process.env.S3_REGION!,
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      maxFileSize: 100 * 1024 * 1024, // 100MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
    },
    baseUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com`
  }
};

/**
 * Monitoring and analytics configuration
 */
export const monitoringConfig = {
  development: {
    enabled: false,
    sentry: {
      dsn: undefined,
      environment: 'development',
      tracesSampleRate: 0.1
    },
    analytics: {
      enabled: false
    }
  },

  staging: {
    enabled: true,
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: 'staging',
      tracesSampleRate: 0.5
    },
    analytics: {
      enabled: true,
      googleAnalytics: {
        trackingId: process.env.GA_TRACKING_ID_STAGING
      }
    }
  },

  production: {
    enabled: true,
    sentry: {
      dsn: process.env.SENTRY_DSN!,
      environment: 'production',
      tracesSampleRate: 0.1
    },
    analytics: {
      enabled: true,
      googleAnalytics: {
        trackingId: process.env.GA_TRACKING_ID!
      },
      mixpanel: {
        token: process.env.MIXPANEL_TOKEN
      }
    }
  }
};

/**
 * Rate limiting configuration
 */
export const rateLimitConfig = {
  development: {
    enabled: false,
    global: {
      windowMs: 60000, // 1 minute
      max: 1000, // Very high limit for dev
      standardHeaders: true,
      legacyHeaders: false
    }
  },

  staging: {
    enabled: true,
    global: {
      windowMs: 60000, // 1 minute
      max: 500, // 500 requests per minute
      standardHeaders: true,
      legacyHeaders: false
    },
    auth: {
      windowMs: 900000, // 15 minutes
      max: 10, // 10 login attempts per 15 minutes
      skipSuccessfulRequests: true
    }
  },

  production: {
    enabled: true,
    global: {
      windowMs: 60000, // 1 minute
      max: 100, // 100 requests per minute
      standardHeaders: true,
      legacyHeaders: false
    },
    auth: {
      windowMs: 900000, // 15 minutes
      max: 5, // 5 login attempts per 15 minutes
      skipSuccessfulRequests: true
    },
    api: {
      windowMs: 60000, // 1 minute
      max: 200, // 200 API calls per minute
      standardHeaders: true,
      legacyHeaders: false
    }
  }
};

/**
 * Security configuration
 */
export const securityConfig = {
  development: {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
      optionsSuccessStatus: 200
    },
    helmet: {
      contentSecurityPolicy: false, // Disabled for easier dev
      crossOriginEmbedderPolicy: false
    },
    session: {
      secret: 'dev-secret-key-not-for-production',
      secure: false,
      httpOnly: true,
      maxAge: 86400000 // 24 hours
    }
  },

  staging: {
    cors: {
      origin: ['https://staging.example.com'],
      credentials: true,
      optionsSuccessStatus: 200
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:']
        }
      }
    },
    session: {
      secret: process.env.SESSION_SECRET || 'staging-secret-key',
      secure: true,
      httpOnly: true,
      maxAge: 28800000 // 8 hours
    }
  },

  production: {
    cors: {
      origin: ['https://example.com', 'https://www.example.com'],
      credentials: true,
      optionsSuccessStatus: 200
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'https://api.example.com']
        }
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    },
    session: {
      secret: process.env.SESSION_SECRET!,
      secure: true,
      httpOnly: true,
      maxAge: 3600000 // 1 hour
    }
  }
};

/**
 * Get configuration based on environment
 */
function getConfig(): AppConfig {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    case 'development':
    default:
      return developmentConfig;
  }
}

/**
 * Validate required environment variables
 */
function validateConfig(): void {
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production') {
    const requiredVars = [
      'DB_HOST',
      'DB_NAME',
      'DB_USER',
      'DB_PASSWORD',
      'REDIS_HOST',
      'REDIS_PASSWORD',
      'SESSION_SECRET',
      'SENDGRID_API_KEY',
      'S3_BUCKET',
      'S3_ACCESS_KEY_ID',
      'S3_SECRET_ACCESS_KEY',
      'SENTRY_DSN'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
}

// Export main configuration
const config = getConfig();

// Validate configuration on import
validateConfig();

export {
  config as default,
  developmentConfig,
  stagingConfig,
  productionConfig,
  databaseConfig,
  cacheConfig,
  emailConfig,
  uploadConfig,
  monitoringConfig,
  rateLimitConfig,
  securityConfig,
  getConfig,
  validateConfig
};