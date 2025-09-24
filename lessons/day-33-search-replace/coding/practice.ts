/**
 * Day 33: Search & Replace Practice - TypeScript Patterns for Find and Replace
 *
 * This file contains TypeScript code with various patterns designed for
 * practicing search and replace operations. Learn to use regex patterns,
 * case-sensitive/insensitive searches, and advanced replacement techniques.
 *
 * Search & Replace Objectives:
 * - Use / and ? for forward and backward search
 * - Use :s/pattern/replacement/flags for substitution
 * - Use :%s/pattern/replacement/g for global replacement
 * - Use \c for case-insensitive and \C for case-sensitive search
 * - Use regex patterns in search and replace operations
 */

// ========== INCONSISTENT NAMING FOR SEARCH & REPLACE ==========
// Practice finding and replacing inconsistent variable names and patterns

// TODO: Replace all instances of 'userData' with 'userInfo'
const userData = {
  id: '123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe'
};

function processUserData(userData: any) {
  console.log('Processing userData:', userData);
  return validateUserData(userData);
}

function validateUserData(userData: any): boolean {
  if (!userData || !userData.email) {
    throw new Error('Invalid userData: email is required');
  }
  return true;
}

async function saveUserData(userData: any): Promise<void> {
  await database.save('users', userData);
  console.log('userData saved successfully');
}

// TODO: Replace 'dbConnection' with 'databaseConnection'
const dbConnection = createConnection({
  host: 'localhost',
  port: 5432,
  database: 'myapp'
});

async function initializeDbConnection(): Promise<void> {
  await dbConnection.connect();
  console.log('dbConnection established');
}

function closeDbConnection(): void {
  dbConnection.close();
  console.log('dbConnection closed');
}

// ========== INCONSISTENT FUNCTION PREFIXES ==========
// Practice replacing function prefixes with consistent naming

// TODO: Replace 'get' prefix with 'fetch' for all async functions
async function getUser(id: string) {
  return await userRepository.findById(id);
}

async function getUserList(filters: any) {
  return await userRepository.findMany(filters);
}

async function getProduct(id: string) {
  return await productRepository.findById(id);
}

async function getProductList(filters: any) {
  return await productRepository.findMany(filters);
}

async function getOrder(id: string) {
  return await orderRepository.findById(id);
}

async function getOrderList(filters: any) {
  return await orderRepository.findMany(filters);
}

// TODO: Replace 'handle' prefix with 'process' for event handlers
function handleUserCreated(event: UserCreatedEvent) {
  console.log('User created:', event.userId);
  sendWelcomeEmail(event.userEmail);
}

function handleUserUpdated(event: UserUpdatedEvent) {
  console.log('User updated:', event.userId);
  invalidateUserCache(event.userId);
}

function handleProductCreated(event: ProductCreatedEvent) {
  console.log('Product created:', event.productId);
  updateSearchIndex(event.productId);
}

function handleOrderPlaced(event: OrderPlacedEvent) {
  console.log('Order placed:', event.orderId);
  sendOrderConfirmation(event.customerEmail);
}

// ========== OLD API ENDPOINTS TO UPDATE ==========
// Practice replacing old API endpoint patterns with new ones

// TODO: Replace '/api/v1/' with '/api/v2/' in all endpoint URLs
const API_ENDPOINTS = {
  // User endpoints
  USER_LIST: '/api/v1/users',
  USER_DETAIL: '/api/v1/users/:id',
  USER_CREATE: '/api/v1/users',
  USER_UPDATE: '/api/v1/users/:id',
  USER_DELETE: '/api/v1/users/:id',

  // Product endpoints
  PRODUCT_LIST: '/api/v1/products',
  PRODUCT_DETAIL: '/api/v1/products/:id',
  PRODUCT_CREATE: '/api/v1/products',
  PRODUCT_UPDATE: '/api/v1/products/:id',
  PRODUCT_DELETE: '/api/v1/products/:id',

  // Order endpoints
  ORDER_LIST: '/api/v1/orders',
  ORDER_DETAIL: '/api/v1/orders/:id',
  ORDER_CREATE: '/api/v1/orders',
  ORDER_UPDATE: '/api/v1/orders/:id',
  ORDER_CANCEL: '/api/v1/orders/:id/cancel',

  // Authentication endpoints
  LOGIN: '/api/v1/auth/login',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH: '/api/v1/auth/refresh',
  REGISTER: '/api/v1/auth/register',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password'
};

// ========== HTTP STATUS CODES TO STANDARDIZE ==========
// Practice replacing numeric status codes with named constants

// TODO: Replace numeric status codes with HTTP_STATUS constants
function handleApiResponse(response: any) {
  switch (response.status) {
    case 200:
      return { success: true, data: response.data };
    case 201:
      return { success: true, data: response.data, created: true };
    case 400:
      throw new Error('Bad Request');
    case 401:
      throw new Error('Unauthorized');
    case 403:
      throw new Error('Forbidden');
    case 404:
      throw new Error('Not Found');
    case 409:
      throw new Error('Conflict');
    case 422:
      throw new Error('Unprocessable Entity');
    case 500:
      throw new Error('Internal Server Error');
    default:
      throw new Error(`Unexpected status: ${response.status}`);
  }
}

function createApiResponse(data: any, status: number = 200) {
  return {
    data,
    status,
    timestamp: new Date().toISOString()
  };
}

function createErrorResponse(message: string, status: number = 500) {
  return {
    error: message,
    status,
    timestamp: new Date().toISOString()
  };
}

// ========== ENVIRONMENT VARIABLE PATTERNS ==========
// Practice replacing hardcoded values with environment variables

// TODO: Replace hardcoded configuration with process.env variables
const DATABASE_CONFIG = {
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'myapp',
  ssl: false
};

const REDIS_CONFIG = {
  host: 'localhost',
  port: 6379,
  password: null,
  db: 0
};

const JWT_CONFIG = {
  secret: 'super-secret-key',
  expiresIn: '24h',
  refreshSecret: 'super-secret-refresh-key',
  refreshExpiresIn: '7d'
};

const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'noreply@example.com',
    pass: 'email-password'
  }
};

// ========== LOGGING PATTERNS TO REPLACE ==========
// Practice replacing console.log with proper logging

// TODO: Replace 'console.log' with 'logger.info'
// TODO: Replace 'console.error' with 'logger.error'
// TODO: Replace 'console.warn' with 'logger.warn'
// TODO: Replace 'console.debug' with 'logger.debug'

function processPayment(orderId: string, amount: number) {
  console.log(`Processing payment for order ${orderId}, amount: ${amount}`);

  try {
    // Payment processing logic
    const result = chargeCard(amount);
    console.log('Payment processed successfully:', result);
    return result;
  } catch (error) {
    console.error('Payment processing failed:', error);
    console.warn('Retrying payment process');
    throw error;
  }
}

function importUserData(csvFile: string) {
  console.debug('Starting user data import from:', csvFile);

  try {
    const users = parseCsvFile(csvFile);
    console.log(`Found ${users.length} users to import`);

    users.forEach((user, index) => {
      console.debug(`Processing user ${index + 1}:`, user.email);
      createUser(user);
    });

    console.log('User data import completed successfully');
  } catch (error) {
    console.error('User data import failed:', error);
    throw error;
  }
}

// ========== CAMELCASE TO SNAKE_CASE CONVERSION ==========
// Practice converting between naming conventions

// TODO: Convert camelCase to snake_case for database columns
const USER_FIELDS = {
  firstName: 'first_name',
  lastName: 'last_name',
  emailAddress: 'email_address',
  phoneNumber: 'phone_number',
  dateOfBirth: 'date_of_birth',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  lastLoginAt: 'last_login_at',
  isActive: 'is_active',
  isVerified: 'is_verified'
};

const PRODUCT_FIELDS = {
  productName: 'product_name',
  productDescription: 'product_description',
  categoryId: 'category_id',
  unitPrice: 'unit_price',
  stockQuantity: 'stock_quantity',
  minimumStock: 'minimum_stock',
  isAvailable: 'is_available',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
};

// ========== OLD PROMISE PATTERNS TO ASYNC/AWAIT ==========
// Practice replacing Promise chains with async/await

// TODO: Replace Promise.then() chains with async/await
function fetchUserProfile(userId: string): Promise<any> {
  return fetchUser(userId)
    .then(user => {
      console.log('User fetched:', user.id);
      return fetchUserProfile(user.id);
    })
    .then(profile => {
      console.log('Profile fetched:', profile.id);
      return fetchUserPreferences(profile.userId);
    })
    .then(preferences => {
      console.log('Preferences fetched');
      return {
        user,
        profile,
        preferences
      };
    })
    .catch(error => {
      console.error('Failed to fetch user profile:', error);
      throw error;
    });
}

function processOrderPayment(orderId: string): Promise<any> {
  return fetchOrder(orderId)
    .then(order => {
      console.log('Order fetched:', order.id);
      return validateOrder(order);
    })
    .then(validatedOrder => {
      console.log('Order validated');
      return processPayment(validatedOrder.total);
    })
    .then(paymentResult => {
      console.log('Payment processed:', paymentResult.transactionId);
      return updateOrderStatus(orderId, 'paid');
    })
    .then(updatedOrder => {
      console.log('Order updated');
      return sendConfirmationEmail(updatedOrder.customerEmail);
    })
    .catch(error => {
      console.error('Order payment processing failed:', error);
      throw error;
    });
}

// ========== TYPE ANNOTATION PATTERNS ==========
// Practice adding or updating type annotations

// TODO: Replace 'any' types with specific interfaces
function createUser(userData: any): any {
  const user = {
    id: generateId(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    createdAt: new Date()
  };

  return userRepository.save(user);
}

function updateProduct(productId: string, updates: any): any {
  const existingProduct = productRepository.findById(productId);

  const updatedProduct = {
    ...existingProduct,
    ...updates,
    updatedAt: new Date()
  };

  return productRepository.save(updatedProduct);
}

function processApiRequest(request: any, response: any): any {
  const { body, params, query } = request;

  const result = businessLogic(body, params, query);

  response.json({
    success: true,
    data: result
  });
}

// ========== SEARCH & REPLACE PRACTICE EXERCISES ==========
/*
SEARCH & REPLACE EXERCISES:

1. Basic Replacement:
   :%s/userData/userInfo/g
   Replace all instances of 'userData' with 'userInfo'

2. Case-insensitive Search:
   :%s/\cuser/customer/g
   Replace 'user', 'User', 'USER', etc. with 'customer'

3. Word Boundaries:
   :%s/\<get\>/fetch/g
   Replace only whole word 'get' with 'fetch'

4. Regex Patterns:
   :%s/console\.\(log\|error\|warn\|debug\)/logger.\1/g
   Replace console methods with logger methods

5. Backreferences:
   :%s/\(fetch\)\([A-Z][a-z]*\)/\1\2Async/g
   Add 'Async' suffix to functions starting with 'fetch'

6. Multi-line Replacements:
   :%s/\/api\/v1\//\/api\/v2\//g
   Replace API version in URLs

7. Conditional Replacements:
   :g/TODO:/s/old/new/g
   Only replace 'old' with 'new' in lines containing 'TODO:'

8. Visual Mode Replacements:
   Select text in visual mode, then :'<,'>s/pattern/replacement/g
   Replace only in selected region

9. Confirmation Mode:
   :%s/pattern/replacement/gc
   Ask for confirmation before each replacement

10. Complex Patterns:
    :%s/\v(function\s+)(\w+)\s*\(/\1async \2(/g
    Add 'async' keyword to function declarations
*/