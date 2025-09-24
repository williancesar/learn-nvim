/**
 * Day 34: Global Commands Practice - Batch Operations
 *
 * This file contains code patterns perfect for practicing global commands.
 * Focus on selecting, filtering, and operating on multiple lines that match patterns.
 *
 * Key commands to practice:
 * - :g/pattern/command (execute command on lines matching pattern)
 * - :g!/pattern/command (execute command on lines NOT matching pattern)
 * - :v/pattern/command (same as :g!, execute on non-matching lines)
 * - :g/pattern/d (delete all lines matching pattern)
 * - :g/pattern/m$ (move all matching lines to end of file)
 * - :g/pattern/t$ (copy all matching lines to end of file)
 * - :g/pattern/p (print all matching lines)
 * - :g/pattern/s/old/new/g (substitute on matching lines only)
 */

// GLOBAL COMMAND EXERCISE 1: Log entries for filtering
// Practice using :g to filter log levels, timestamps, or specific events
const logEntries = [
  '2023-12-10 09:15:23 INFO  Starting application server on port 3000',
  '2023-12-10 09:15:24 INFO  Database connection established successfully',
  '2023-12-10 09:15:25 DEBUG Loading configuration from /etc/myapp/config.json',
  '2023-12-10 09:15:26 INFO  Redis cache connection established',
  '2023-12-10 09:15:27 WARN  Rate limiting threshold set to 100 requests/minute',
  '2023-12-10 09:16:01 ERROR Failed to connect to external API: Connection timeout',
  '2023-12-10 09:16:02 INFO  Retrying API connection in 5 seconds',
  '2023-12-10 09:16:07 INFO  API connection restored successfully',
  '2023-12-10 09:16:15 DEBUG User authentication request from IP 192.168.1.100',
  '2023-12-10 09:16:16 INFO  User login successful: user_id=12345',
  '2023-12-10 09:16:30 WARN  Suspicious login attempt from IP 203.45.67.89',
  '2023-12-10 09:16:31 ERROR Authentication failed: Invalid credentials',
  '2023-12-10 09:16:45 DEBUG Processing payment request: amount=$99.99',
  '2023-12-10 09:16:46 INFO  Payment processed successfully: transaction_id=TXN789',
  '2023-12-10 09:17:00 ERROR Database connection lost, attempting reconnection',
  '2023-12-10 09:17:01 WARN  Operating in degraded mode with reduced functionality',
  '2023-12-10 09:17:05 INFO  Database connection restored',
  '2023-12-10 09:17:06 DEBUG Clearing cached user sessions',
  '2023-12-10 09:17:10 INFO  System health check completed: All services operational',
  '2023-12-10 09:17:15 WARN  Memory usage approaching 80% threshold',
  '2023-12-10 09:17:20 ERROR Out of memory error in user session handler',
  '2023-12-10 09:17:21 INFO  Garbage collection triggered automatically',
  '2023-12-10 09:17:25 DEBUG System resources optimized successfully',
  '2023-12-10 09:17:30 INFO  Application server ready to accept requests'
];

// GLOBAL COMMAND EXERCISE 2: Configuration settings with comments
// Practice selecting configuration lines vs comments
const configurationFile = [
  '# Database Configuration',
  'db.host=localhost',
  'db.port=5432',
  'db.name=production_db',
  '# db.username=admin',
  'db.username=prod_user',
  'db.password=secure_password_123',
  '',
  '# Redis Cache Settings',
  'redis.enabled=true',
  'redis.host=redis-server.internal',
  'redis.port=6379',
  '# redis.password=cache_password',
  'redis.timeout=5000',
  '',
  '# Email Service Configuration',
  'smtp.host=smtp.company.com',
  'smtp.port=587',
  'smtp.ssl=true',
  'smtp.username=noreply@company.com',
  '# smtp.password=email_password',
  '',
  '# API Keys and Secrets',
  'api.key.stripe=pk_live_abc123def456',
  '# api.key.stripe=pk_test_test123test456',
  'api.key.sendgrid=SG.xyz789abc123',
  'jwt.secret=super_secret_jwt_key_2023',
  '',
  '# Feature Flags',
  'feature.new_dashboard=true',
  'feature.beta_checkout=false',
  '# feature.debug_mode=true',
  'feature.maintenance_mode=false',
  '',
  '# Logging Configuration',
  'log.level=info',
  '# log.level=debug',
  'log.file=/var/log/myapp.log',
  'log.rotation=daily',
  'log.max_size=100MB'
];

// GLOBAL COMMAND EXERCISE 3: Import statements to organize
// Practice moving imports by type (React, libraries, local files)
const importStatements = [
  "import React, { useState, useEffect } from 'react';",
  "import lodash from 'lodash';",
  "import './App.css';",
  "import Header from './components/Header';",
  "import axios from 'axios';",
  "import { BrowserRouter as Router } from 'react-router-dom';",
  "import Footer from './components/Footer';",
  "import moment from 'moment';",
  "import UserService from './services/UserService';",
  "import { createStore } from 'redux';",
  "import Navigation from './components/Navigation';",
  "import validator from 'validator';",
  "import ApiClient from './utils/ApiClient';",
  "import { Provider } from 'react-redux';",
  "import Sidebar from './components/Sidebar';",
  "import jwt from 'jsonwebtoken';",
  "import DatabaseHelper from './helpers/DatabaseHelper';",
  "import { Route, Routes } from 'react-router-dom';",
  "import ProductCard from './components/ProductCard';",
  "import bcrypt from 'bcrypt';",
  "import ErrorBoundary from './components/ErrorBoundary';",
  "import styled from 'styled-components';",
  "import AuthContext from './contexts/AuthContext';",
  "import dotenv from 'dotenv';",
  "import LoadingSpinner from './components/LoadingSpinner';"
];

// GLOBAL COMMAND EXERCISE 4: Function definitions to categorize
// Practice organizing functions by type (async, sync, arrow, regular)
const functionDefinitions = [
  'function calculateTotal(items) {',
  'const processPayment = async (paymentData) => {',
  'function validateEmail(email) {',
  'const fetchUserData = async (userId) => {',
  'function formatCurrency(amount) {',
  'const updateUserProfile = async (userId, data) => {',
  'function generateRandomId() {',
  'const saveToDatabase = async (record) => {',
  'function debounce(func, delay) {',
  'const sendNotification = async (message) => {',
  'function throttle(func, limit) {',
  'const uploadFile = async (file) => {',
  'function deepClone(obj) {',
  'const authenticateUser = async (credentials) => {',
  'function isValidPassword(password) {',
  'const logUserActivity = async (activity) => {',
  'function parseJSON(jsonString) {',
  'const refreshToken = async (token) => {',
  'function formatDate(date) {',
  'const deleteRecord = async (id) => {',
  'function capitalizeString(str) {',
  'const generateReport = async (params) => {',
  'function mergeObjects(obj1, obj2) {',
  'const scheduleTask = async (task) => {',
  'function arrayToObject(arr, key) {'
];

// GLOBAL COMMAND EXERCISE 5: CSS properties to group
// Practice organizing CSS properties by category
const cssProperties = [
  '  color: #333333;',
  '  position: absolute;',
  '  font-size: 16px;',
  '  top: 0;',
  '  background-color: #ffffff;',
  '  left: 0;',
  '  font-weight: bold;',
  '  right: 0;',
  '  border: 1px solid #cccccc;',
  '  bottom: 0;',
  '  font-family: Arial, sans-serif;',
  '  z-index: 1000;',
  '  padding: 16px;',
  '  display: flex;',
  '  margin: 8px;',
  '  flex-direction: column;',
  '  border-radius: 4px;',
  '  align-items: center;',
  '  box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
  '  justify-content: center;',
  '  line-height: 1.5;',
  '  width: 100%;',
  '  text-align: center;',
  '  height: auto;',
  '  opacity: 0.8;',
  '  max-width: 800px;',
  '  transform: translateX(-50%);',
  '  min-height: 200px;',
  '  transition: all 0.3s ease;',
  '  overflow: hidden;'
];

// GLOBAL COMMAND EXERCISE 6: Test cases to organize
// Practice grouping test cases by type (unit, integration, e2e)
const testCases = [
  "describe('User Authentication', () => {",
  "  it('should login with valid credentials', async () => {",
  "  it('should reject invalid email format', () => {",
  "describe('API Integration Tests', () => {",
  "  it('should fetch user data from API', async () => {",
  "  it('should validate required fields', () => {",
  "describe('E2E User Journey', () => {",
  "  it('should complete purchase flow', async () => {",
  "  it('should handle empty input fields', () => {",
  "describe('Database Operations', () => {",
  "  it('should save user to database', async () => {",
  "  it('should return error for duplicate email', () => {",
  "describe('Frontend Components', () => {",
  "  it('should render user profile correctly', () => {",
  "  it('should update UI when props change', () => {",
  "describe('Payment Processing', () => {",
  "  it('should process credit card payment', async () => {",
  "  it('should validate card number format', () => {",
  "describe('Error Handling', () => {",
  "  it('should display error message on failure', () => {",
  "  it('should retry failed requests', async () => {",
  "describe('Performance Tests', () => {",
  "  it('should load page under 2 seconds', async () => {",
  "  it('should handle concurrent users', async () => {",
  "describe('Security Tests', () => {",
  "  it('should prevent SQL injection', () => {",
  "  it('should sanitize user input', () => {"
];

// GLOBAL COMMAND EXERCISE 7: Variable declarations to modernize
// Practice selecting var vs let/const declarations
const variableDeclarations = [
  'var userName = "john_doe";',
  'let userAge = 25;',
  'var userEmail = "john@example.com";',
  'const API_URL = "https://api.example.com";',
  'var isLoggedIn = false;',
  'let currentPage = 1;',
  'var totalPages = 10;',
  'const MAX_RETRIES = 3;',
  'var retryCount = 0;',
  'let errorMessage = null;',
  'var debugMode = true;',
  'const APP_VERSION = "1.0.0";',
  'var lastModified = new Date();',
  'let selectedItems = [];',
  'var shoppingCart = {};',
  'const TAX_RATE = 0.08;',
  'var discountApplied = false;',
  'let totalAmount = 0;',
  'var paymentMethod = "credit_card";',
  'const SHIPPING_COST = 9.99;'
];

// GLOBAL COMMAND EXERCISE 8: API endpoints by HTTP method
// Practice grouping endpoints by GET, POST, PUT, DELETE
const apiEndpoints = [
  "app.get('/api/users', getUserList);",
  "app.post('/api/users', createUser);",
  "app.get('/api/users/:id', getUserById);",
  "app.put('/api/users/:id', updateUser);",
  "app.delete('/api/users/:id', deleteUser);",
  "app.get('/api/products', getProductList);",
  "app.post('/api/products', createProduct);",
  "app.get('/api/products/:id', getProductById);",
  "app.put('/api/products/:id', updateProduct);",
  "app.delete('/api/products/:id', deleteProduct);",
  "app.get('/api/orders', getOrderList);",
  "app.post('/api/orders', createOrder);",
  "app.get('/api/orders/:id', getOrderById);",
  "app.put('/api/orders/:id', updateOrder);",
  "app.delete('/api/orders/:id', cancelOrder);",
  "app.get('/health', healthCheck);",
  "app.post('/auth/login', authenticateUser);",
  "app.post('/auth/logout', logoutUser);",
  "app.post('/auth/refresh', refreshToken);",
  "app.get('/auth/profile', getUserProfile);"
];

// GLOBAL COMMAND EXERCISE 9: Database migrations to organize
// Practice grouping migration operations
const migrationStatements = [
  'CREATE TABLE users (',
  'ALTER TABLE users ADD COLUMN phone VARCHAR(20);',
  'CREATE INDEX idx_users_email ON users(email);',
  'DROP TABLE temp_data;',
  'CREATE TABLE products (',
  'ALTER TABLE products ADD COLUMN weight DECIMAL(8,3);',
  'CREATE INDEX idx_products_category ON products(category_id);',
  'DROP INDEX old_product_index;',
  'CREATE TABLE orders (',
  'ALTER TABLE orders ADD COLUMN shipping_address TEXT;',
  'CREATE INDEX idx_orders_user ON orders(user_id);',
  'DROP CONSTRAINT fk_old_constraint;',
  'CREATE VIEW active_users AS SELECT * FROM users WHERE is_active = true;',
  'ALTER TABLE categories ADD COLUMN description TEXT;',
  'CREATE SEQUENCE order_number_seq START 1000;',
  'DROP VIEW inactive_products;',
  'CREATE TRIGGER update_timestamp BEFORE UPDATE ON users',
  'ALTER TABLE payments ADD COLUMN transaction_fee DECIMAL(10,2);',
  'CREATE UNIQUE INDEX idx_unique_username ON users(username);',
  'DROP TRIGGER old_audit_trigger;'
];

// GLOBAL COMMAND EXERCISE 10: Error handling patterns
// Practice organizing try-catch blocks and error types
const errorHandlingExamples = [
  '  try {',
  '    const result = await apiCall();',
  '    return result;',
  '  } catch (NetworkError) {',
  '    console.error("Network error occurred");',
  '    throw new Error("Network connection failed");',
  '  } catch (ValidationError) {',
  '    console.error("Validation failed");',
  '    return { error: "Invalid input data" };',
  '  } catch (AuthenticationError) {',
  '    console.error("Authentication failed");',
  '    redirectToLogin();',
  '  } catch (DatabaseError) {',
  '    console.error("Database operation failed");',
  '    throw new Error("Data persistence failed");',
  '  } catch (TimeoutError) {',
  '    console.error("Request timeout");',
  '    return { error: "Request took too long" };',
  '  } catch (PermissionError) {',
  '    console.error("Insufficient permissions");',
  '    return { error: "Access denied" };',
  '  } catch (Error) {',
  '    console.error("Unexpected error occurred");',
  '    throw new Error("Internal server error");',
  '  } finally {',
  '    cleanup();',
  '  }'
];

export {
  logEntries,
  configurationFile,
  importStatements,
  functionDefinitions,
  cssProperties,
  testCases,
  variableDeclarations,
  apiEndpoints,
  migrationStatements,
  errorHandlingExamples
};