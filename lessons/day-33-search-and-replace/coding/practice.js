/**
 * Day 33: Search and Replace Practice - Pattern Matching
 *
 * This file contains various patterns perfect for practicing search and replace operations.
 * Focus on using regex patterns, word boundaries, and complex substitutions.
 *
 * Key commands to practice:
 * - :s/old/new/ (substitute first occurrence on line)
 * - :s/old/new/g (substitute all occurrences on line)
 * - :%s/old/new/g (substitute all occurrences in file)
 * - :%s/old/new/gc (substitute with confirmation)
 * - /pattern (search forward)
 * - ?pattern (search backward)
 * - * (search for word under cursor)
 * - # (search backward for word under cursor)
 */

// SEARCH & REPLACE EXERCISE 1: Variable naming conventions
// Practice replacing camelCase with snake_case and vice versa
const userName = 'john_doe';
const userEmail = 'john@example.com';
const userAge = 25;
const userProfile = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1-555-0123',
  homeAddress: '123 Main St',
  workAddress: '456 Business Ave',
  emergencyContact: 'Jane Doe',
  birthDate: '1998-05-15'
};

const productName = 'Wireless Headphones';
const productPrice = 199.99;
const productDescription = 'High-quality wireless headphones with noise cancellation';
const productCategory = 'Electronics';
const productBrand = 'AudioTech';
const productModel = 'AT-1000';
const productWeight = '250g';
const productDimensions = '20cm x 15cm x 8cm';
const productWarranty = '2 years';
const productColor = 'Black';

// SEARCH & REPLACE EXERCISE 2: API endpoint patterns
// Practice replacing URL patterns and HTTP methods
const endpoints = {
  getUserData: 'GET /api/users/:id',
  createUserAccount: 'POST /api/users',
  updateUserProfile: 'PUT /api/users/:id',
  deleteUserAccount: 'DELETE /api/users/:id',
  getUserOrders: 'GET /api/users/:id/orders',
  createUserOrder: 'POST /api/users/:id/orders',
  updateUserOrder: 'PUT /api/users/:id/orders/:orderId',
  cancelUserOrder: 'DELETE /api/users/:id/orders/:orderId'
};

const baseUrl = 'http://localhost:3000';
const apiVersion = 'v1';
const userEndpoint = '/users';
const productEndpoint = '/products';
const orderEndpoint = '/orders';
const authEndpoint = '/auth';

// SEARCH & REPLACE EXERCISE 3: Configuration values
// Practice replacing environment-specific configurations
const developmentConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    name: 'myapp_development',
    user: 'dev_user',
    password: 'dev_password'
  },
  redis: {
    host: 'localhost',
    port: 6379,
    password: null
  },
  server: {
    host: 'localhost',
    port: 3000,
    ssl: false
  },
  logging: {
    level: 'debug',
    file: '/var/log/myapp-dev.log'
  }
};

const productionConfig = {
  database: {
    host: 'prod-db.example.com',
    port: 5432,
    name: 'myapp_production',
    user: 'prod_user',
    password: process.env.DB_PASSWORD
  },
  redis: {
    host: 'prod-redis.example.com',
    port: 6379,
    password: process.env.REDIS_PASSWORD
  },
  server: {
    host: '0.0.0.0',
    port: 443,
    ssl: true
  },
  logging: {
    level: 'error',
    file: '/var/log/myapp-prod.log'
  }
};

// SEARCH & REPLACE EXERCISE 4: Function parameter patterns
// Practice replacing parameter names and types
function calculateTotalPrice(basePrice, taxRate, discountRate, shippingCost) {
  const subtotal = basePrice - (basePrice * discountRate);
  const taxAmount = subtotal * taxRate;
  const totalPrice = subtotal + taxAmount + shippingCost;
  return totalPrice;
}

function processUserRegistration(firstName, lastName, emailAddress, phoneNumber, password) {
  const userData = {
    firstName: firstName,
    lastName: lastName,
    email: emailAddress,
    phone: phoneNumber,
    password: hashPassword(password),
    createdAt: new Date().toISOString()
  };
  return userData;
}

function generateProductReport(productId, startDate, endDate, includeDetails) {
  const reportData = {
    productId: productId,
    period: {
      start: startDate,
      end: endDate
    },
    includeDetails: includeDetails,
    generatedAt: new Date().toISOString()
  };
  return reportData;
}

// SEARCH & REPLACE EXERCISE 5: Error messages and status codes
// Practice replacing error codes and messages
const errorMessages = {
  AUTH_001: 'Invalid username or password provided',
  AUTH_002: 'Authentication token has expired',
  AUTH_003: 'Access denied for this resource',
  AUTH_004: 'Account has been temporarily locked',

  VALID_001: 'Required field is missing',
  VALID_002: 'Invalid email address format',
  VALID_003: 'Password does not meet requirements',
  VALID_004: 'Phone number format is invalid',

  DB_001: 'Database connection failed',
  DB_002: 'Query execution timeout',
  DB_003: 'Duplicate entry found',
  DB_004: 'Foreign key constraint violation',

  NET_001: 'Network connection timeout',
  NET_002: 'Service temporarily unavailable',
  NET_003: 'Rate limit exceeded',
  NET_004: 'Invalid response format'
};

// SEARCH & REPLACE EXERCISE 6: CSS class names and selectors
// Practice replacing CSS naming conventions
const styles = `
.user-profile-container {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
}

.user-profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
}

.user-profile-info {
  flex: 1;
}

.user-profile-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.user-profile-email {
  color: #666666;
  font-size: 16px;
}

.user-profile-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.user-profile-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`;

// SEARCH & REPLACE EXERCISE 7: Import/export statements
// Practice replacing module import patterns
import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';
import validator from 'validator';

import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import UserProfile from './components/UserProfile';
import ProductList from './components/ProductList';
import OrderHistory from './components/OrderHistory';

import { userService } from './services/userService';
import { productService } from './services/productService';
import { orderService } from './services/orderService';
import { authService } from './services/authService';

// SEARCH & REPLACE EXERCISE 8: Database query patterns
// Practice replacing SQL table names and column names
const queries = {
  selectAllUsers: 'SELECT * FROM users WHERE is_active = true',
  selectUserById: 'SELECT user_id, first_name, last_name, email FROM users WHERE user_id = ?',
  insertNewUser: 'INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
  updateUserEmail: 'UPDATE users SET email = ?, updated_at = NOW() WHERE user_id = ?',
  deleteUser: 'DELETE FROM users WHERE user_id = ? AND is_active = true',

  selectAllProducts: 'SELECT * FROM products WHERE is_available = true',
  selectProductById: 'SELECT product_id, product_name, price, description FROM products WHERE product_id = ?',
  insertNewProduct: 'INSERT INTO products (product_name, price, description, category_id) VALUES (?, ?, ?, ?)',
  updateProductPrice: 'UPDATE products SET price = ?, updated_at = NOW() WHERE product_id = ?',
  deleteProduct: 'DELETE FROM products WHERE product_id = ? AND is_available = true',

  selectUserOrders: 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
  selectOrderById: 'SELECT order_id, user_id, total_amount, status FROM orders WHERE order_id = ?',
  insertNewOrder: 'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
  updateOrderStatus: 'UPDATE orders SET status = ?, updated_at = NOW() WHERE order_id = ?',
  cancelOrder: 'UPDATE orders SET status = "cancelled", updated_at = NOW() WHERE order_id = ?'
};

// SEARCH & REPLACE EXERCISE 9: Regex patterns for validation
// Practice replacing validation patterns and rules
const validationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  creditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/,
  ssn: /^\d{3}-?\d{2}-?\d{4}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
};

// SEARCH & REPLACE EXERCISE 10: Event handler naming
// Practice replacing event handler function names
const eventHandlers = {
  onClick: handleClick,
  onSubmit: handleSubmit,
  onChange: handleChange,
  onFocus: handleFocus,
  onBlur: handleBlur,
  onMouseEnter: handleMouseEnter,
  onMouseLeave: handleMouseLeave,
  onKeyDown: handleKeyDown,
  onKeyUp: handleKeyUp,
  onScroll: handleScroll
};

function handleClick(event) {
  console.log('Click event triggered');
}

function handleSubmit(event) {
  event.preventDefault();
  console.log('Form submitted');
}

function handleChange(event) {
  console.log('Input changed:', event.target.value);
}

function handleFocus(event) {
  console.log('Input focused');
}

function handleBlur(event) {
  console.log('Input blurred');
}

// SEARCH & REPLACE EXERCISE 11: API response properties
// Practice replacing response property names
const apiResponses = {
  user: {
    user_id: 123,
    first_name: 'John',
    last_name: 'Doe',
    email_address: 'john@example.com',
    phone_number: '+1-555-0123',
    created_at: '2023-01-15T10:30:00Z',
    updated_at: '2023-12-01T14:22:00Z',
    last_login: '2023-12-10T09:15:00Z',
    is_active: true,
    is_verified: true
  },

  product: {
    product_id: 456,
    product_name: 'Wireless Headphones',
    product_description: 'Premium wireless headphones',
    product_price: 199.99,
    product_category: 'Electronics',
    product_brand: 'AudioTech',
    in_stock: true,
    stock_quantity: 50,
    created_at: '2023-06-01T12:00:00Z',
    updated_at: '2023-12-01T16:45:00Z'
  },

  order: {
    order_id: 789,
    user_id: 123,
    order_number: 'ORD-2023-001234',
    order_status: 'pending',
    total_amount: 299.99,
    tax_amount: 24.00,
    shipping_cost: 9.99,
    discount_amount: 0.00,
    created_at: '2023-12-10T15:30:00Z',
    updated_at: '2023-12-10T15:30:00Z',
    estimated_delivery: '2023-12-15T00:00:00Z'
  }
};

// SEARCH & REPLACE EXERCISE 12: Environment variable names
// Practice replacing environment variable patterns
const envVariables = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_NAME: process.env.DB_NAME || 'myapp',
  DB_USER: process.env.DB_USER || 'user',
  DB_PASS: process.env.DB_PASS || 'password',

  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASS: process.env.REDIS_PASS || null,

  JWT_SECRET: process.env.JWT_SECRET || 'default-secret',
  JWT_EXPIRES: process.env.JWT_EXPIRES || '24h',

  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || 'user@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || 'password',

  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || 'access-key',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || 'secret-key',
  AWS_BUCKET: process.env.AWS_BUCKET || 'my-bucket'
};

export {
  userName,
  userEmail,
  userAge,
  userProfile,
  productName,
  productPrice,
  endpoints,
  developmentConfig,
  productionConfig,
  calculateTotalPrice,
  processUserRegistration,
  errorMessages,
  validationPatterns,
  eventHandlers,
  apiResponses,
  envVariables
};