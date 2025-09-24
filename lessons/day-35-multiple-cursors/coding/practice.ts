/**
 * Day 35: Multiple Cursor Simulation - TypeScript Type Tables
 *
 * This file contains structured TypeScript data that simulates multiple cursor
 * operations. Practice editing similar structures simultaneously using visual
 * block mode and other vim techniques.
 *
 * Multiple Cursor Simulation Objectives:
 * - Use Ctrl+v for visual block mode to edit multiple lines
 * - Use :s with visual selection for targeted replacements
 * - Use . (dot) command to repeat operations across similar structures
 * - Practice consistent edits across tabular data and type definitions
 */

// ========== TYPE DEFINITION TABLES ==========
// Practice editing multiple similar type definitions simultaneously

type UserRole = 'admin' | 'user' | 'moderator' | 'guest';
type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
type ProductStatus = 'available' | 'soldout' | 'discontinued' | 'preorder';
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// ========== INTERFACE PROPERTY TABLES ==========
// Practice adding/removing properties across multiple interfaces

interface User {
  id        : string;
  email     : string;
  firstName : string;
  lastName  : string;
  role      : UserRole;
  status    : UserStatus;
  createdAt : Date;
  updatedAt : Date;
}

interface Product {
  id          : string;
  name        : string;
  description : string;
  price       : number;
  category    : string;
  status      : ProductStatus;
  createdAt   : Date;
  updatedAt   : Date;
}

interface Order {
  id         : string;
  userId     : string;
  products   : string[];
  total      : number;
  status     : OrderStatus;
  payment    : PaymentStatus;
  createdAt  : Date;
  updatedAt  : Date;
}

// ========== METHOD SIGNATURE TABLES ==========
// Practice editing method signatures consistently

class UserRepository {
  async findById    (id: string)                    : Promise<User | null>    { return null; }
  async findByEmail (email: string)                 : Promise<User | null>    { return null; }
  async findAll     (limit?: number)                : Promise<User[]>         { return []; }
  async create      (data: Omit<User, 'id'>)       : Promise<User>           { return {} as User; }
  async update      (id: string, data: Partial<User>) : Promise<User | null> { return null; }
  async delete      (id: string)                    : Promise<boolean>        { return false; }
}

class ProductRepository {
  async findById      (id: string)                      : Promise<Product | null>    { return null; }
  async findByCategory(category: string)                : Promise<Product[]>         { return []; }
  async findAll       (limit?: number)                  : Promise<Product[]>         { return []; }
  async create        (data: Omit<Product, 'id'>)      : Promise<Product>           { return {} as Product; }
  async update        (id: string, data: Partial<Product>) : Promise<Product | null> { return null; }
  async delete        (id: string)                      : Promise<boolean>           { return false; }
}

class OrderRepository {
  async findById     (id: string)                     : Promise<Order | null>    { return null; }
  async findByUserId (userId: string)                 : Promise<Order[]>         { return []; }
  async findAll      (limit?: number)                 : Promise<Order[]>         { return []; }
  async create       (data: Omit<Order, 'id'>)       : Promise<Order>           { return {} as Order; }
  async update       (id: string, data: Partial<Order>) : Promise<Order | null>  { return null; }
  async delete       (id: string)                     : Promise<boolean>         { return false; }
}

// ========== VALIDATION SCHEMA TABLES ==========
// Practice editing validation rules across multiple schemas

const UserValidationSchema = {
  id        : { required: true,  type: 'string', format: 'uuid' },
  email     : { required: true,  type: 'string', format: 'email' },
  firstName : { required: true,  type: 'string', minLength: 2, maxLength: 50 },
  lastName  : { required: true,  type: 'string', minLength: 2, maxLength: 50 },
  role      : { required: true,  type: 'string', enum: ['admin', 'user', 'moderator', 'guest'] },
  status    : { required: true,  type: 'string', enum: ['active', 'inactive', 'pending', 'suspended'] },
  createdAt : { required: true,  type: 'string', format: 'date-time' },
  updatedAt : { required: true,  type: 'string', format: 'date-time' }
};

const ProductValidationSchema = {
  id          : { required: true,  type: 'string', format: 'uuid' },
  name        : { required: true,  type: 'string', minLength: 3, maxLength: 200 },
  description : { required: false, type: 'string', maxLength: 1000 },
  price       : { required: true,  type: 'number', minimum: 0 },
  category    : { required: true,  type: 'string', minLength: 2, maxLength: 100 },
  status      : { required: true,  type: 'string', enum: ['available', 'soldout', 'discontinued', 'preorder'] },
  createdAt   : { required: true,  type: 'string', format: 'date-time' },
  updatedAt   : { required: true,  type: 'string', format: 'date-time' }
};

const OrderValidationSchema = {
  id        : { required: true,  type: 'string', format: 'uuid' },
  userId    : { required: true,  type: 'string', format: 'uuid' },
  products  : { required: true,  type: 'array',  items: { type: 'string' } },
  total     : { required: true,  type: 'number', minimum: 0 },
  status    : { required: true,  type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered'] },
  payment   : { required: true,  type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'] },
  createdAt : { required: true,  type: 'string', format: 'date-time' },
  updatedAt : { required: true,  type: 'string', format: 'date-time' }
};

// ========== API ENDPOINT TABLES ==========
// Practice editing endpoint configurations simultaneously

const USER_ENDPOINTS = [
  { method: 'GET',    path: '/api/users',     handler: 'getUsers',    auth: true,  rate: 100 },
  { method: 'GET',    path: '/api/users/:id', handler: 'getUserById', auth: true,  rate: 200 },
  { method: 'POST',   path: '/api/users',     handler: 'createUser',  auth: true,  rate: 50  },
  { method: 'PUT',    path: '/api/users/:id', handler: 'updateUser',  auth: true,  rate: 50  },
  { method: 'DELETE', path: '/api/users/:id', handler: 'deleteUser',  auth: true,  rate: 10  }
];

const PRODUCT_ENDPOINTS = [
  { method: 'GET',    path: '/api/products',     handler: 'getProducts',    auth: false, rate: 300 },
  { method: 'GET',    path: '/api/products/:id', handler: 'getProductById', auth: false, rate: 500 },
  { method: 'POST',   path: '/api/products',     handler: 'createProduct',  auth: true,  rate: 25  },
  { method: 'PUT',    path: '/api/products/:id', handler: 'updateProduct',  auth: true,  rate: 25  },
  { method: 'DELETE', path: '/api/products/:id', handler: 'deleteProduct',  auth: true,  rate: 5   }
];

const ORDER_ENDPOINTS = [
  { method: 'GET',    path: '/api/orders',        handler: 'getOrders',     auth: true, rate: 100 },
  { method: 'GET',    path: '/api/orders/:id',    handler: 'getOrderById',  auth: true, rate: 200 },
  { method: 'POST',   path: '/api/orders',        handler: 'createOrder',   auth: true, rate: 30  },
  { method: 'PUT',    path: '/api/orders/:id',    handler: 'updateOrder',   auth: true, rate: 30  },
  { method: 'DELETE', path: '/api/orders/:id',    handler: 'cancelOrder',   auth: true, rate: 20  }
];

// ========== DATABASE QUERY TABLES ==========
// Practice editing SQL queries with consistent structure

const USER_QUERIES = {
  SELECT_ALL      : 'SELECT * FROM users',
  SELECT_BY_ID    : 'SELECT * FROM users WHERE id = ?',
  SELECT_BY_EMAIL : 'SELECT * FROM users WHERE email = ?',
  INSERT          : 'INSERT INTO users (id, email, firstName, lastName, role, status) VALUES (?, ?, ?, ?, ?, ?)',
  UPDATE          : 'UPDATE users SET email = ?, firstName = ?, lastName = ?, role = ?, status = ? WHERE id = ?',
  DELETE          : 'DELETE FROM users WHERE id = ?'
};

const PRODUCT_QUERIES = {
  SELECT_ALL         : 'SELECT * FROM products',
  SELECT_BY_ID       : 'SELECT * FROM products WHERE id = ?',
  SELECT_BY_CATEGORY : 'SELECT * FROM products WHERE category = ?',
  INSERT             : 'INSERT INTO products (id, name, description, price, category, status) VALUES (?, ?, ?, ?, ?, ?)',
  UPDATE             : 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, status = ? WHERE id = ?',
  DELETE             : 'DELETE FROM products WHERE id = ?'
};

const ORDER_QUERIES = {
  SELECT_ALL        : 'SELECT * FROM orders',
  SELECT_BY_ID      : 'SELECT * FROM orders WHERE id = ?',
  SELECT_BY_USER_ID : 'SELECT * FROM orders WHERE userId = ?',
  INSERT            : 'INSERT INTO orders (id, userId, products, total, status, payment) VALUES (?, ?, ?, ?, ?, ?)',
  UPDATE            : 'UPDATE orders SET products = ?, total = ?, status = ?, payment = ? WHERE id = ?',
  DELETE            : 'DELETE FROM orders WHERE id = ?'
};

// ========== ERROR MESSAGE TABLES ==========
// Practice editing error messages consistently

const USER_ERRORS = {
  NOT_FOUND      : 'User not found',
  EMAIL_EXISTS   : 'Email already exists',
  INVALID_EMAIL  : 'Invalid email format',
  INVALID_ROLE   : 'Invalid user role',
  INVALID_STATUS : 'Invalid user status',
  CREATE_FAILED  : 'Failed to create user',
  UPDATE_FAILED  : 'Failed to update user',
  DELETE_FAILED  : 'Failed to delete user'
};

const PRODUCT_ERRORS = {
  NOT_FOUND         : 'Product not found',
  NAME_EXISTS       : 'Product name already exists',
  INVALID_PRICE     : 'Invalid product price',
  INVALID_CATEGORY  : 'Invalid product category',
  INVALID_STATUS    : 'Invalid product status',
  CREATE_FAILED     : 'Failed to create product',
  UPDATE_FAILED     : 'Failed to update product',
  DELETE_FAILED     : 'Failed to delete product'
};

const ORDER_ERRORS = {
  NOT_FOUND        : 'Order not found',
  USER_NOT_FOUND   : 'User not found for order',
  INVALID_PRODUCTS : 'Invalid products list',
  INVALID_TOTAL    : 'Invalid order total',
  INVALID_STATUS   : 'Invalid order status',
  CREATE_FAILED    : 'Failed to create order',
  UPDATE_FAILED    : 'Failed to update order',
  DELETE_FAILED    : 'Failed to delete order'
};

// ========== MULTIPLE CURSOR PRACTICE EXERCISES ==========
/*
MULTIPLE CURSOR SIMULATION EXERCISES:

1. Visual Block Mode:
   - Use Ctrl+v to select a column
   - Edit multiple interface property types simultaneously
   - Add/remove optional markers (?) to multiple properties

2. Consistent Replacements:
   - Use visual selection with :s to replace across selected lines
   - Change 'string' to 'String' in multiple type definitions
   - Update method return types across repository classes

3. Tabular Data Editing:
   - Align colons in interface definitions
   - Update endpoint rate limits simultaneously
   - Modify validation schema requirements in bulk

4. Dot Command Repetition:
   - Make a change to one interface property
   - Use . to repeat the same change on similar properties
   - Navigate between similar structures and repeat edits

5. Pattern-Based Editing:
   - Use macros to record complex edits
   - Apply the same structural changes across multiple schemas
   - Bulk update error message formats

Practice Goals:
- Learn to identify patterns suitable for multi-cursor-like operations
- Master visual block mode for columnar edits
- Use search/replace with visual selections for targeted changes
- Develop muscle memory for repeating operations across similar code
*/