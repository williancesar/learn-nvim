/**
 * Day 36: Case Operations - Mixed Case Types and Interfaces
 *
 * This file contains TypeScript code with various case patterns for practicing
 * case transformation operations. Learn to convert between camelCase, PascalCase,
 * snake_case, UPPER_CASE, and kebab-case using vim's case operators.
 *
 * Case Operations Objectives:
 * - Use ~ to toggle case of character under cursor
 * - Use gU to convert to uppercase (gUU for entire line, gUiw for word)
 * - Use gu to convert to lowercase (guu for entire line, guiw for word)
 * - Use g~ to toggle case (g~~ for entire line, g~iw for word)
 * - Practice with text objects for precise case changes
 */

// ========== INCONSISTENT VARIABLE NAMING ==========
// Practice converting between different naming conventions

// TODO: Convert these to camelCase
const user_id = '12345';
const USER_EMAIL = 'user@example.com';
const First_Name = 'John';
const last-name = 'Doe';
const phone_NUMBER = '555-0123';
const is_ACTIVE = true;
const created_at_timestamp = new Date();

// TODO: Convert these to PascalCase
interface user_profile {
  avatar_url?: string;
  bio_TEXT?: string;
  social_LINKS?: {
    twitter_handle?: string;
    linkedin_URL?: string;
    github_username?: string;
  };
}

interface product_details {
  product_NAME: string;
  product_DESCRIPTION: string;
  unit_price: number;
  stock_QUANTITY: number;
  category_id: string;
  is_available: boolean;
}

// ========== MIXED CASE FUNCTION NAMES ==========
// Practice standardizing function naming conventions

// TODO: Convert to camelCase
function GET_USER_BY_ID(id: string) {
  return database.users.findById(id);
}

function create_new_user(userData: any) {
  return database.users.create(userData);
}

function UPDATE_USER_PROFILE(id: string, updates: any) {
  return database.users.update(id, updates);
}

function delete-user-account(id: string) {
  return database.users.delete(id);
}

function SEND_WELCOME_EMAIL(userEmail: string) {
  return emailService.sendWelcome(userEmail);
}

function validate_USER_INPUT(input: any) {
  return inputValidator.validate(input);
}

// ========== DATABASE COLUMN MAPPINGS ==========
// Practice converting between camelCase and snake_case

const USER_FIELD_MAPPING = {
  // TODO: Convert keys to camelCase, values to snake_case
  user_id: 'USER_ID',
  Email_Address: 'email-address',
  firstName: 'FIRST_NAME',
  Last_Name: 'lastname',
  phone_number: 'phoneNumber',
  DATE_OF_BIRTH: 'dateofbirth',
  created_AT: 'CreatedAt',
  updated_at: 'UPDATED_AT'
};

const PRODUCT_FIELD_MAPPING = {
  // TODO: Standardize naming convention
  product_ID: 'productid',
  Product_Name: 'PRODUCT_NAME',
  description: 'Description',
  unit_PRICE: 'unitprice',
  stock_quantity: 'STOCK_QUANTITY',
  category_ID: 'categoryId',
  is_AVAILABLE: 'isavailable'
};

// ========== API ENDPOINT CONSTANTS ==========
// Practice converting URL patterns and HTTP methods

const API_ENDPOINTS = {
  // TODO: Convert to consistent naming (UPPER_CASE for constants)
  get_users: '/api/users',
  post_users: '/api/users',
  GET_USER_BY_ID: '/api/users/:id',
  put_user: '/api/users/:id',
  delete_User: '/api/users/:id',

  // TODO: Convert these to kebab-case URLs
  getProducts: '/api/productList',
  createProduct: '/api/newProduct',
  updateProduct: '/api/updateProduct/:id',
  deleteProduct: '/api/removeProduct/:id',

  // TODO: Standardize these endpoint names
  Order_List: '/api/order-history',
  create_ORDER: '/api/place_order',
  ORDER_Details: '/api/orderInfo/:id',
  update_order_STATUS: '/api/order/:id/status'
};

// ========== ERROR CODE DEFINITIONS ==========
// Practice case conversions for error codes and messages

const ERROR_CODES = {
  // TODO: Convert to SCREAMING_SNAKE_CASE
  userNotFound: 'USER_001',
  invalidEmail: 'user_002',
  passwordTooWeak: 'USER_003',
  emailAlreadyExists: 'user_004',

  // TODO: Convert to consistent format
  Product_Not_Found: 'PROD_001',
  invalid_price: 'prod_002',
  category_MISSING: 'PROD_003',
  stock_unavailable: 'prod_004',

  // TODO: Standardize order error codes
  orderNotFound: 'ORDER_001',
  INVALID_ORDER_STATUS: 'order_002',
  payment_failed: 'ORDER_003',
  insufficient_STOCK: 'order_004'
};

// ========== TYPE DEFINITIONS WITH MIXED CASES ==========
// Practice converting type names and property names

type user_role = 'ADMIN' | 'user' | 'Moderator' | 'guest';
type Product_Status = 'available' | 'OUT_OF_STOCK' | 'discontinued' | 'Pre_Order';
type ORDER_STATUS = 'pending' | 'Processing' | 'SHIPPED' | 'delivered' | 'cancelled';

interface API_Response<T> {
  SUCCESS: boolean;
  error_message?: string;
  DATA?: T;
  timestamp: number;
  request_ID: string;
}

interface user_preferences {
  theme_SETTING: 'light' | 'DARK' | 'system';
  language_CODE: string;
  timezone_OFFSET: number;
  email_notifications: boolean;
  push_NOTIFICATIONS: boolean;
  privacy_SETTINGS: {
    profile_VISIBLE: boolean;
    show_EMAIL: boolean;
    allow_MESSAGING: boolean;
  };
}

// ========== CLASS DEFINITIONS WITH MIXED CONVENTIONS ==========
// Practice standardizing class and method names

class user_service {
  // TODO: Convert class name to PascalCase

  private USER_REPOSITORY: any;
  private email_SERVICE: any;

  constructor(userRepo: any, emailSvc: any) {
    this.USER_REPOSITORY = userRepo;
    this.email_SERVICE = emailSvc;
  }

  // TODO: Convert method names to camelCase
  async GET_USER_PROFILE(user_id: string) {
    return this.USER_REPOSITORY.findById(user_id);
  }

  async create_user_account(user_DATA: any) {
    const new_user = await this.USER_REPOSITORY.create(user_DATA);
    await this.email_SERVICE.SEND_WELCOME_EMAIL(new_user.email);
    return new_user;
  }

  async UPDATE_USER_SETTINGS(user_id: string, NEW_SETTINGS: any) {
    return this.USER_REPOSITORY.update(user_id, NEW_SETTINGS);
  }

  async delete_user_permanently(USER_ID: string) {
    return this.USER_REPOSITORY.delete(USER_ID);
  }
}

class PRODUCT_MANAGER {
  // TODO: Convert to PascalCase

  private product_repo: any;
  private inventory_SERVICE: any;

  async find_products_by_category(CATEGORY_NAME: string) {
    return this.product_repo.findByCategory(CATEGORY_NAME);
  }

  async CREATE_NEW_PRODUCT(product_details: any) {
    return this.product_repo.create(product_details);
  }

  async update_product_inventory(product_ID: string, NEW_QUANTITY: number) {
    return this.inventory_SERVICE.updateStock(product_ID, NEW_QUANTITY);
  }
}

// ========== CONFIGURATION OBJECTS ==========
// Practice case transformations in configuration

const database_CONFIG = {
  // TODO: Convert to consistent camelCase
  HOST_NAME: 'localhost',
  port_number: 5432,
  Database_Name: 'myapp',
  user_NAME: 'postgres',
  PASSWORD: 'secret123',
  connection_POOL: {
    min_connections: 0,
    MAX_CONNECTIONS: 10,
    idle_TIMEOUT: 30000
  },
  SSL_CONFIG: {
    require_SSL: false,
    ca_CERTIFICATE: null,
    client_KEY: null,
    client_CERT: null
  }
};

const EMAIL_configuration = {
  // TODO: Standardize property naming
  smtp_HOST: 'smtp.gmail.com',
  PORT_NUMBER: 587,
  use_TLS: true,
  AUTH_settings: {
    user_EMAIL: process.env.EMAIL_USER,
    email_PASSWORD: process.env.EMAIL_PASS
  },
  DEFAULT_FROM: 'noreply@example.com',
  retry_ATTEMPTS: 3,
  timeout_MS: 5000
};

// ========== CASE OPERATION PRACTICE EXERCISES ==========
/*
CASE TRANSFORMATION EXERCISES:

1. Character-level toggles:
   - Use ~ to toggle case of individual characters
   - Position cursor on mixed-case words and toggle

2. Word-level transformations:
   - Use guiw to lowercase entire word under cursor
   - Use gUiw to uppercase entire word under cursor
   - Use g~iw to toggle case of entire word

3. Line-level operations:
   - Use guu to lowercase entire line
   - Use gUU to uppercase entire line
   - Use g~~ to toggle case of entire line

4. Text object operations:
   - Use gu" to lowercase content inside quotes
   - Use gU{ to uppercase content inside braces
   - Use g~) to toggle case inside parentheses

5. Visual selection transformations:
   - Select text in visual mode, then use u, U, or ~
   - Select function names and convert to camelCase
   - Select constants and convert to UPPER_CASE

6. Search and replace with case:
   - Use \c in patterns for case-insensitive search
   - Use \C in patterns for case-sensitive search
   - Combine with substitution for bulk case changes

Practice Goals:
- Convert snake_case to camelCase throughout the file
- Standardize constant names to UPPER_CASE
- Fix mixed-case type and interface names
- Ensure consistent naming conventions across all code
*/