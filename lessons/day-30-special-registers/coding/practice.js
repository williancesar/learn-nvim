/**
 * Day 30: System Clipboard Practice - Special Registers
 *
 * This file contains code designed for practicing system clipboard operations.
 * Practice using special registers like + (system clipboard) and * (selection).
 *
 * Key commands to practice:
 * - "+y (copy to system clipboard)
 * - "+p (paste from system clipboard)
 * - "*y (copy to selection clipboard)
 * - "*p (paste from selection clipboard)
 * - :reg + (view system clipboard register)
 * - :reg * (view selection register)
 */

// CLIPBOARD EXERCISE 1: Configuration Objects
// Copy these configurations to system clipboard and paste them in different orders

const DATABASE_CONFIG = {
  development: {
    host: 'localhost',
    port: 5432,
    database: 'myapp_dev',
    username: 'developer',
    password: 'dev_password',
    ssl: false,
    pool: {
      min: 2,
      max: 10,
      idle: 10000
    }
  },
  staging: {
    host: 'staging-db.example.com',
    port: 5432,
    database: 'myapp_staging',
    username: 'staging_user',
    password: process.env.STAGING_DB_PASSWORD,
    ssl: true,
    pool: {
      min: 5,
      max: 20,
      idle: 30000
    }
  },
  production: {
    host: 'prod-db.example.com',
    port: 5432,
    database: 'myapp_production',
    username: 'prod_user',
    password: process.env.PRODUCTION_DB_PASSWORD,
    ssl: true,
    pool: {
      min: 10,
      max: 50,
      idle: 60000
    }
  }
};

const REDIS_CONFIG = {
  development: {
    host: 'localhost',
    port: 6379,
    password: null,
    db: 0,
    keyPrefix: 'myapp:dev:',
    retryDelayOnFailover: 100,
    enableOfflineQueue: false
  },
  staging: {
    host: 'staging-redis.example.com',
    port: 6379,
    password: process.env.STAGING_REDIS_PASSWORD,
    db: 1,
    keyPrefix: 'myapp:staging:',
    retryDelayOnFailover: 200,
    enableOfflineQueue: true
  },
  production: {
    host: 'prod-redis.example.com',
    port: 6379,
    password: process.env.PRODUCTION_REDIS_PASSWORD,
    db: 2,
    keyPrefix: 'myapp:prod:',
    retryDelayOnFailover: 500,
    enableOfflineQueue: true
  }
};

// CLIPBOARD EXERCISE 2: API Endpoint Definitions
// Practice copying these endpoint definitions to share between files

const USER_ENDPOINTS = {
  CREATE_USER: '/api/v1/users',
  GET_USER: '/api/v1/users/:id',
  UPDATE_USER: '/api/v1/users/:id',
  DELETE_USER: '/api/v1/users/:id',
  LIST_USERS: '/api/v1/users',
  USER_PROFILE: '/api/v1/users/:id/profile',
  USER_SETTINGS: '/api/v1/users/:id/settings',
  USER_PREFERENCES: '/api/v1/users/:id/preferences'
};

const PRODUCT_ENDPOINTS = {
  CREATE_PRODUCT: '/api/v1/products',
  GET_PRODUCT: '/api/v1/products/:id',
  UPDATE_PRODUCT: '/api/v1/products/:id',
  DELETE_PRODUCT: '/api/v1/products/:id',
  LIST_PRODUCTS: '/api/v1/products',
  PRODUCT_REVIEWS: '/api/v1/products/:id/reviews',
  PRODUCT_IMAGES: '/api/v1/products/:id/images',
  PRODUCT_VARIANTS: '/api/v1/products/:id/variants'
};

const ORDER_ENDPOINTS = {
  CREATE_ORDER: '/api/v1/orders',
  GET_ORDER: '/api/v1/orders/:id',
  UPDATE_ORDER: '/api/v1/orders/:id',
  CANCEL_ORDER: '/api/v1/orders/:id/cancel',
  LIST_ORDERS: '/api/v1/orders',
  ORDER_ITEMS: '/api/v1/orders/:id/items',
  ORDER_PAYMENT: '/api/v1/orders/:id/payment',
  ORDER_SHIPPING: '/api/v1/orders/:id/shipping'
};

// CLIPBOARD EXERCISE 3: Error Messages and Constants
// Copy these error messages to create consistent error handling across modules

const ERROR_MESSAGES = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: 'Invalid email or password provided',
    TOKEN_EXPIRED: 'Authentication token has expired',
    ACCESS_DENIED: 'Access denied for this resource',
    ACCOUNT_LOCKED: 'Account has been temporarily locked',
    PASSWORD_RESET_REQUIRED: 'Password reset is required'
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please provide a valid email address',
    INVALID_PHONE: 'Please provide a valid phone number',
    PASSWORD_TOO_WEAK: 'Password must contain at least 8 characters with uppercase, lowercase, numbers, and symbols',
    INVALID_DATE: 'Please provide a valid date',
    FILE_TOO_LARGE: 'File size exceeds maximum allowed limit'
  },
  DATABASE: {
    CONNECTION_FAILED: 'Unable to connect to database',
    QUERY_TIMEOUT: 'Database query timeout',
    DUPLICATE_ENTRY: 'Record already exists',
    FOREIGN_KEY_CONSTRAINT: 'Cannot delete record due to existing references',
    TRANSACTION_FAILED: 'Database transaction failed'
  },
  NETWORK: {
    CONNECTION_TIMEOUT: 'Request timeout - please try again',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
    RATE_LIMIT_EXCEEDED: 'Too many requests - please wait before trying again',
    PAYLOAD_TOO_LARGE: 'Request payload is too large',
    INVALID_RESPONSE: 'Invalid response from server'
  }
};

const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

// CLIPBOARD EXERCISE 4: Utility Functions
// Practice copying these utility functions to reuse in other files

const formatters = {
  currency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  },

  percentage: (value, decimals = 2) => {
    return `${(value * 100).toFixed(decimals)}%`;
  },

  fileSize: (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  },

  duration: (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },

  dateRelative: (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) return new Date(date).toLocaleDateString();
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }
};

const validators = {
  isEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isPhone: (phone) => /^\+?[\d\s\-\(\)]{10,}$/.test(phone),
  isURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  isCreditCard: (number) => {
    const cleaned = number.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return false;

    let sum = 0;
    let alternate = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      if (alternate) {
        digit *= 2;
        if (digit > 9) digit = (digit % 10) + 1;
      }
      sum += digit;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  },
  isStrongPassword: (password) => {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /\d/.test(password) &&
           /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }
};

// CLIPBOARD EXERCISE 5: React Component Templates
// Copy these component structures to create new components quickly

const ButtonComponent = `
import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const classNames = [
    'btn',
    \`btn--\${variant}\`,
    \`btn--\${size}\`,
    disabled && 'btn--disabled',
    loading && 'btn--loading'
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      <span className="btn__content">{children}</span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button;
`;

const InputComponent = `
import React, { useState, useId } from 'react';
import PropTypes from 'prop-types';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const inputId = useId();

  const classNames = [
    'input-field',
    focused && 'input-field--focused',
    error && 'input-field--error',
    disabled && 'input-field--disabled'
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {label && (
        <label htmlFor={inputId} className="input-field__label">
          {label}
          {required && <span className="input-field__required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        onFocus={() => setFocused(true)}
        disabled={disabled}
        className="input-field__input"
        {...props}
      />
      {error && <span className="input-field__error">{error}</span>}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};

export default Input;
`;

// CLIPBOARD EXERCISE 6: Test Templates
// Copy these test structures to create comprehensive test suites

const testUtilities = {
  mockApiResponse: (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  }),

  mockLocalStorage: () => {
    const store = {};
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => store[key] = value.toString(),
      removeItem: (key) => delete store[key],
      clear: () => Object.keys(store).forEach(key => delete store[key])
    };
  },

  createMockUser: (overrides = {}) => ({
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date().toISOString(),
    ...overrides
  }),

  createMockProduct: (overrides = {}) => ({
    id: '456',
    name: 'Test Product',
    price: 29.99,
    description: 'A test product for unit testing',
    category: 'electronics',
    inStock: true,
    ...overrides
  }),

  waitFor: (condition, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }
};

// CLIPBOARD EXERCISE 7: CSS-in-JS Styles
// Practice copying these style objects between components

const commonStyles = {
  button: {
    primary: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#0056b3'
      },
      '&:disabled': {
        backgroundColor: '#6c757d',
        cursor: 'not-allowed'
      }
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#007bff',
      border: '1px solid #007bff',
      padding: '12px 24px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: '#007bff',
        color: 'white'
      }
    }
  },

  input: {
    base: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #ced4da',
      borderRadius: '4px',
      fontSize: '16px',
      transition: 'border-color 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#007bff',
        boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)'
      }
    },
    error: {
      borderColor: '#dc3545',
      '&:focus': {
        borderColor: '#dc3545',
        boxShadow: '0 0 0 2px rgba(220, 53, 69, 0.25)'
      }
    }
  },

  layout: {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px'
    },
    flexCenter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    flexBetween: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }
};

export {
  DATABASE_CONFIG,
  REDIS_CONFIG,
  USER_ENDPOINTS,
  PRODUCT_ENDPOINTS,
  ORDER_ENDPOINTS,
  ERROR_MESSAGES,
  HTTP_STATUS_CODES,
  formatters,
  validators,
  testUtilities,
  commonStyles
};