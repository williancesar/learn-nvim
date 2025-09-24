/**
 * Day 35: Multiple Cursor Simulation Practice - Data Tables
 *
 * This file contains tabular data and repetitive patterns that would benefit
 * from multiple cursor operations. In Vim, simulate multiple cursors using
 * visual block mode, macros, and global commands.
 *
 * Key techniques to practice:
 * - Ctrl-v (visual block mode) for column editing
 * - :g/pattern/s/old/new/ (global substitution)
 * - Macros with @@ for repetitive edits
 * - Visual block insert/append (I/A in visual block)
 * - :%s/pattern/replacement/g for pattern replacements
 */

// MULTIPLE CURSOR EXERCISE 1: User data table with aligned columns
// Practice editing multiple rows simultaneously
const userDatabase = [
  { id: 001, name: 'John Smith',      email: 'john.smith@email.com',      phone: '555-0101', status: 'active',   role: 'user' },
  { id: 002, name: 'Jane Doe',        email: 'jane.doe@email.com',        phone: '555-0102', status: 'active',   role: 'admin' },
  { id: 003, name: 'Bob Johnson',     email: 'bob.johnson@email.com',     phone: '555-0103', status: 'inactive', role: 'user' },
  { id: 004, name: 'Alice Williams',  email: 'alice.williams@email.com',  phone: '555-0104', status: 'active',   role: 'moderator' },
  { id: 005, name: 'Charlie Brown',   email: 'charlie.brown@email.com',   phone: '555-0105', status: 'active',   role: 'user' },
  { id: 006, name: 'Diana Prince',    email: 'diana.prince@email.com',    phone: '555-0106', status: 'active',   role: 'admin' },
  { id: 007, name: 'Edward Norton',   email: 'edward.norton@email.com',   phone: '555-0107', status: 'inactive', role: 'user' },
  { id: 008, name: 'Fiona Green',     email: 'fiona.green@email.com',     phone: '555-0108', status: 'active',   role: 'user' },
  { id: 009, name: 'George Lucas',    email: 'george.lucas@email.com',    phone: '555-0109', status: 'active',   role: 'moderator' },
  { id: 010, name: 'Helen Troy',      email: 'helen.troy@email.com',      phone: '555-0110', status: 'inactive', role: 'user' }
];

// MULTIPLE CURSOR EXERCISE 2: Product inventory with price updates
// Practice updating multiple price fields simultaneously
const productInventory = [
  { sku: 'ELEC001', name: 'Wireless Headphones',    category: 'Electronics', price: 99.99,  stock: 50,  supplier: 'AudioTech' },
  { sku: 'ELEC002', name: 'Bluetooth Speaker',      category: 'Electronics', price: 79.99,  stock: 30,  supplier: 'SoundCorp' },
  { sku: 'ELEC003', name: 'Smartphone Case',        category: 'Electronics', price: 19.99,  stock: 100, supplier: 'ProtectPlus' },
  { sku: 'ELEC004', name: 'USB Charging Cable',     category: 'Electronics', price: 14.99,  stock: 200, supplier: 'ChargeFast' },
  { sku: 'ELEC005', name: 'Portable Power Bank',    category: 'Electronics', price: 49.99,  stock: 75,  supplier: 'PowerMax' },
  { sku: 'BOOK001', name: 'JavaScript Handbook',    category: 'Books',       price: 39.99,  stock: 25,  supplier: 'TechBooks' },
  { sku: 'BOOK002', name: 'Python Programming',     category: 'Books',       price: 44.99,  stock: 20,  supplier: 'CodePress' },
  { sku: 'BOOK003', name: 'Web Development Guide',  category: 'Books',       price: 34.99,  stock: 15,  supplier: 'WebPublish' },
  { sku: 'CLTH001', name: 'Cotton T-Shirt',         category: 'Clothing',    price: 24.99,  stock: 80,  supplier: 'FashionCorp' },
  { sku: 'CLTH002', name: 'Denim Jeans',            category: 'Clothing',    price: 59.99,  stock: 40,  supplier: 'DenimWorld' }
];

// MULTIPLE CURSOR EXERCISE 3: Sales data with calculations
// Practice adding calculated fields to multiple rows
const salesData = [
  { date: '2023-01-01', product: 'Widget A',    quantity: 10, unitPrice: 25.00, discount: 0.05, tax: 0.08, total: 0 },
  { date: '2023-01-02', product: 'Widget B',    quantity: 15, unitPrice: 30.00, discount: 0.10, tax: 0.08, total: 0 },
  { date: '2023-01-03', product: 'Widget C',    quantity: 8,  unitPrice: 45.00, discount: 0.00, tax: 0.08, total: 0 },
  { date: '2023-01-04', product: 'Widget D',    quantity: 12, unitPrice: 35.00, discount: 0.15, tax: 0.08, total: 0 },
  { date: '2023-01-05', product: 'Widget E',    quantity: 20, unitPrice: 20.00, discount: 0.05, tax: 0.08, total: 0 },
  { date: '2023-01-06', product: 'Widget F',    quantity: 5,  unitPrice: 80.00, discount: 0.20, tax: 0.08, total: 0 },
  { date: '2023-01-07', product: 'Widget G',    quantity: 18, unitPrice: 28.00, discount: 0.08, tax: 0.08, total: 0 },
  { date: '2023-01-08', product: 'Widget H',    quantity: 7,  unitPrice: 60.00, discount: 0.12, tax: 0.08, total: 0 },
  { date: '2023-01-09', product: 'Widget I',    quantity: 25, unitPrice: 15.00, discount: 0.00, tax: 0.08, total: 0 },
  { date: '2023-01-10', product: 'Widget J',    quantity: 14, unitPrice: 40.00, discount: 0.07, tax: 0.08, total: 0 }
];

// MULTIPLE CURSOR EXERCISE 4: Server configuration entries
// Practice updating multiple configuration values
const serverConfigs = [
  'server.host = localhost',
  'server.port = 3000',
  'server.ssl = false',
  'server.timeout = 30000',
  'database.host = localhost',
  'database.port = 5432',
  'database.ssl = true',
  'database.timeout = 10000',
  'redis.host = localhost',
  'redis.port = 6379',
  'redis.ssl = false',
  'redis.timeout = 5000',
  'cache.host = localhost',
  'cache.port = 11211',
  'cache.ssl = false',
  'cache.timeout = 2000'
];

// MULTIPLE CURSOR EXERCISE 5: CSS property groups for batch editing
// Practice modifying multiple CSS properties together
const cssStyles = [
  '.header { background-color: #ffffff; color: #333333; padding: 10px; margin: 5px; }',
  '.navbar { background-color: #f8f9fa; color: #495057; padding: 12px; margin: 8px; }',
  '.content { background-color: #ffffff; color: #212529; padding: 20px; margin: 15px; }',
  '.sidebar { background-color: #e9ecef; color: #6c757d; padding: 15px; margin: 10px; }',
  '.footer { background-color: #343a40; color: #ffffff; padding: 25px; margin: 0px; }',
  '.card { background-color: #ffffff; color: #495057; padding: 18px; margin: 12px; }',
  '.button { background-color: #007bff; color: #ffffff; padding: 8px; margin: 4px; }',
  '.input { background-color: #ffffff; color: #495057; padding: 10px; margin: 6px; }',
  '.alert { background-color: #f8d7da; color: #721c24; padding: 14px; margin: 8px; }',
  '.badge { background-color: #17a2b8; color: #ffffff; padding: 6px; margin: 2px; }'
];

// MULTIPLE CURSOR EXERCISE 6: Function parameter lists
// Practice updating parameter names across multiple functions
const functionSignatures = [
  'function createUser(name, email, phone, address) {',
  'function updateUser(id, name, email, phone, address) {',
  'function deleteUser(id) {',
  'function getUserById(id) {',
  'function getUserByEmail(email) {',
  'function createProduct(name, price, category, description) {',
  'function updateProduct(id, name, price, category, description) {',
  'function deleteProduct(id) {',
  'function getProductById(id) {',
  'function getProductsByCategory(category) {',
  'function createOrder(userId, items, shippingAddress, paymentMethod) {',
  'function updateOrder(id, status, trackingNumber) {',
  'function cancelOrder(id, reason) {',
  'function getOrderById(id) {',
  'function getOrdersByUser(userId) {'
];

// MULTIPLE CURSOR EXERCISE 7: Database table columns
// Practice adding/modifying column definitions
const tableColumns = [
  'id SERIAL PRIMARY KEY',
  'name VARCHAR(100) NOT NULL',
  'email VARCHAR(255) NOT NULL',
  'phone VARCHAR(20)',
  'address TEXT',
  'created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  'updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  'is_active BOOLEAN DEFAULT TRUE',
  'is_verified BOOLEAN DEFAULT FALSE',
  'last_login TIMESTAMP',
  'role_id INTEGER REFERENCES roles(id)',
  'department_id INTEGER REFERENCES departments(id)',
  'manager_id INTEGER REFERENCES employees(id)',
  'salary DECIMAL(10,2)',
  'hire_date DATE'
];

// MULTIPLE CURSOR EXERCISE 8: API endpoint method declarations
// Practice updating HTTP methods and paths
const apiMethods = [
  'router.get("/users", getAllUsers);',
  'router.post("/users", createUser);',
  'router.get("/users/:id", getUserById);',
  'router.put("/users/:id", updateUser);',
  'router.delete("/users/:id", deleteUser);',
  'router.get("/products", getAllProducts);',
  'router.post("/products", createProduct);',
  'router.get("/products/:id", getProductById);',
  'router.put("/products/:id", updateProduct);',
  'router.delete("/products/:id", deleteProduct);',
  'router.get("/orders", getAllOrders);',
  'router.post("/orders", createOrder);',
  'router.get("/orders/:id", getOrderById);',
  'router.put("/orders/:id", updateOrder);',
  'router.delete("/orders/:id", cancelOrder);'
];

// MULTIPLE CURSOR EXERCISE 9: Test case descriptions
// Practice updating test descriptions and assertions
const testDescriptions = [
  'it("should create user with valid data", async () => {',
  'it("should update user with valid data", async () => {',
  'it("should delete user with valid id", async () => {',
  'it("should get user with valid id", async () => {',
  'it("should list all users", async () => {',
  'it("should create product with valid data", async () => {',
  'it("should update product with valid data", async () => {',
  'it("should delete product with valid id", async () => {',
  'it("should get product with valid id", async () => {',
  'it("should list all products", async () => {',
  'it("should create order with valid data", async () => {',
  'it("should update order with valid data", async () => {',
  'it("should cancel order with valid id", async () => {',
  'it("should get order with valid id", async () => {',
  'it("should list all orders", async () => {'
];

// MULTIPLE CURSOR EXERCISE 10: Environment variable assignments
// Practice updating environment variable names and values
const envVariables = [
  'export NODE_ENV=development',
  'export PORT=3000',
  'export HOST=localhost',
  'export DB_HOST=localhost',
  'export DB_PORT=5432',
  'export DB_NAME=myapp_dev',
  'export DB_USER=developer',
  'export DB_PASS=dev_password',
  'export REDIS_HOST=localhost',
  'export REDIS_PORT=6379',
  'export REDIS_PASS=',
  'export JWT_SECRET=dev_secret_key',
  'export JWT_EXPIRES=24h',
  'export SMTP_HOST=smtp.mailtrap.io',
  'export SMTP_PORT=2525',
  'export SMTP_USER=mailtrap_user',
  'export SMTP_PASS=mailtrap_pass',
  'export AWS_REGION=us-east-1',
  'export AWS_BUCKET=dev-uploads',
  'export LOG_LEVEL=debug'
];

// MULTIPLE CURSOR EXERCISE 11: JSON object transformations
// Practice converting object properties
const jsonObjects = [
  '{ "user_id": 1, "first_name": "John", "last_name": "Smith", "email_address": "john@example.com" }',
  '{ "user_id": 2, "first_name": "Jane", "last_name": "Doe", "email_address": "jane@example.com" }',
  '{ "user_id": 3, "first_name": "Bob", "last_name": "Johnson", "email_address": "bob@example.com" }',
  '{ "user_id": 4, "first_name": "Alice", "last_name": "Williams", "email_address": "alice@example.com" }',
  '{ "user_id": 5, "first_name": "Charlie", "last_name": "Brown", "email_address": "charlie@example.com" }',
  '{ "user_id": 6, "first_name": "Diana", "last_name": "Prince", "email_address": "diana@example.com" }',
  '{ "user_id": 7, "first_name": "Edward", "last_name": "Norton", "email_address": "edward@example.com" }',
  '{ "user_id": 8, "first_name": "Fiona", "last_name": "Green", "email_address": "fiona@example.com" }',
  '{ "user_id": 9, "first_name": "George", "last_name": "Lucas", "email_address": "george@example.com" }',
  '{ "user_id": 10, "first_name": "Helen", "last_name": "Troy", "email_address": "helen@example.com" }'
];

// MULTIPLE CURSOR EXERCISE 12: Array method chains for refactoring
// Practice updating method names across multiple chains
const arrayMethods = [
  'const userNames = users.map(user => user.name).filter(name => name.length > 5).sort();',
  'const userEmails = users.map(user => user.email).filter(email => email.includes("@")).sort();',
  'const userAges = users.map(user => user.age).filter(age => age >= 18).sort((a, b) => a - b);',
  'const productNames = products.map(product => product.name).filter(name => name.length > 10).sort();',
  'const productPrices = products.map(product => product.price).filter(price => price > 50).sort((a, b) => a - b);',
  'const orderTotals = orders.map(order => order.total).filter(total => total > 100).sort((a, b) => b - a);',
  'const orderDates = orders.map(order => order.date).filter(date => date.includes("2023")).sort();',
  'const categoryNames = categories.map(category => category.name).filter(name => name.startsWith("A")).sort();',
  'const tagNames = tags.map(tag => tag.name).filter(name => name.length <= 8).sort();',
  'const commentTexts = comments.map(comment => comment.text).filter(text => text.length > 20).sort();'
];

export {
  userDatabase,
  productInventory,
  salesData,
  serverConfigs,
  cssStyles,
  functionSignatures,
  tableColumns,
  apiMethods,
  testDescriptions,
  envVariables,
  jsonObjects,
  arrayMethods
};