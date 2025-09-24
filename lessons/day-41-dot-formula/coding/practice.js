/**
 * Day 41: Dot Formula Practice - Repetitive Patterns
 *
 * This file contains repetitive patterns perfect for practicing the dot command (.)
 * and building efficient editing workflows.
 *
 * Key concepts to practice:
 * - . (repeat last change)
 * - Make a change, then use . to repeat it
 * - Combine with motions: f, t, w, ), etc.
 * - Use with text objects: aw, ip, it, etc.
 * - Pattern: Motion + Action + Repeat (. command)
 * - Search and replace pattern: /pattern + action + n + . + n + .
 */

// DOT FORMULA EXERCISE 1: Adding semicolons to statements
// Pattern: A;<Esc> then j + . for each line
const statements = [
  'const userName = "john_doe"',
  'const userEmail = "john@example.com"',
  'const userAge = 25',
  'const userActive = true',
  'const userRoles = ["user", "admin"]',
  'const userPreferences = { theme: "dark" }',
  'const userLastLogin = new Date()',
  'const userLoginCount = 42',
  'const userScore = 1250.75',
  'const userLevel = "intermediate"'
];

// DOT FORMULA EXERCISE 2: Wrapping function calls in try-catch
// Pattern: Vjc try { <Ctrl-r>" } catch (error) { console.error(error); }<Esc>
// Then use j + . for each function call
parseJsonData(responseText);
validateUserInput(formData);
connectToDatabase(connectionString);
sendEmailNotification(emailData);
processPaymentTransaction(paymentInfo);
generateSecurityToken(userCredentials);
updateUserPreferences(userId, preferences);
calculateOrderTotal(orderItems);
encryptSensitiveData(personalInfo);
logUserActivity(activityData);

// DOT FORMULA EXERCISE 3: Converting single quotes to double quotes
// Pattern: f'r" then ; + . for each occurrence
const sqlQueries = [
  "SELECT * FROM users WHERE name = 'john' AND status = 'active'",
  "INSERT INTO products (name, price) VALUES ('headphones', '199.99')",
  "UPDATE orders SET status = 'shipped' WHERE id = '12345'",
  "DELETE FROM sessions WHERE expires_at < 'now()'",
  "SELECT COUNT(*) FROM orders WHERE date > '2023-01-01'",
  "UPDATE users SET last_login = 'now()' WHERE id = '123'",
  "INSERT INTO logs (message, level) VALUES ('Error occurred', 'error')",
  "SELECT * FROM products WHERE category = 'electronics'",
  "UPDATE settings SET theme = 'dark' WHERE user_id = '456'",
  "DELETE FROM cache WHERE key LIKE 'temp_%'"
];

// DOT FORMULA EXERCISE 4: Adding console.log statements
// Pattern: O console.log('<object_name>:', <object_name>);<Esc>
// Then move to next object and use .
const userProfile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
};

const productData = {
  id: 'PROD001',
  name: 'Wireless Headphones',
  price: 199.99
};

const orderInfo = {
  orderId: 'ORD-12345',
  customerId: 'CUST-789',
  total: 299.99
};

const paymentDetails = {
  method: 'credit_card',
  amount: 299.99,
  currency: 'USD'
};

const shippingAddress = {
  street: '123 Main St',
  city: 'San Francisco',
  state: 'CA'
};

// DOT FORMULA EXERCISE 5: Converting var to const
// Pattern: /var<Enter> + cw const<Esc> + n + . + n + .
var serverPort = 3000;
var databaseHost = 'localhost';
var redisPort = 6379;
var jwtSecret = 'secret_key';
var sessionTimeout = 3600;
var maxRetries = 5;
var debugMode = true;
var apiVersion = 'v2';
var rateLimitWindow = 900;
var cacheExpiry = 1800;

// DOT FORMULA EXERCISE 6: Adding type annotations (comments)
// Pattern: A // string<Esc> then j + . with modifications
let firstName;
let lastName;
let emailAddress;
let phoneNumber;
let streetAddress;
let cityName;
let stateName;
let zipCode;
let countryCode;
let birthDate;

// DOT FORMULA EXERCISE 7: Wrapping strings in template literals
// Pattern: F'i`<Esc> f'r} + ct'${<Ctrl-r>"}` <Esc>
const messages = [
  'Hello ' + userName + ', welcome to our app!',
  'You have ' + messageCount + ' unread messages.',
  'Your order ' + orderId + ' has been shipped.',
  'Welcome back, ' + userDisplayName + '!',
  'Error ' + errorCode + ': ' + errorMessage,
  'Processing ' + currentItem + ' of ' + totalItems + ' items.',
  'User ' + userId + ' logged in at ' + timestamp + '.',
  'Payment of ' + amount + ' ' + currency + ' processed.',
  'File ' + fileName + ' uploaded successfully.',
  'Connection to ' + serverName + ' established.'
];

// DOT FORMULA EXERCISE 8: Converting function declarations to arrow functions
// Pattern: /function<Enter> + C const functionName = () => {<Enter><Esc>
// Then n + . for each function
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function generateRandomId() {
  return Math.random().toString(36).substr(2, 9);
}

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// DOT FORMULA EXERCISE 9: Adding JSDoc comments
// Pattern: O /** @param {type} name - description */<Esc>
function createUser(userData) {
  return new User(userData);
}

function updateProfile(userId, profileData) {
  return userService.updateProfile(userId, profileData);
}

function deleteAccount(accountId) {
  return accountService.delete(accountId);
}

function sendNotification(recipient, message) {
  return notificationService.send(recipient, message);
}

function processPayment(paymentData) {
  return paymentProcessor.charge(paymentData);
}

// DOT FORMULA EXERCISE 10: Adding error handling wrappers
// Pattern: V}c try {<Enter><Ctrl-r>"> } catch (error) {<Enter>console.error('Error:', error);<Enter>throw error;<Enter>}<Esc>
const result1 = await apiCall('/users');
const result2 = await database.query('SELECT * FROM products');
const result3 = await fileSystem.readFile('./config.json');
const result4 = await emailService.send(emailData);
const result5 = await cacheService.get(cacheKey);
const result6 = await authService.validateToken(token);
const result7 = await storageService.upload(fileData);
const result8 = await analyticsService.track(eventData);
const result9 = await searchService.query(searchTerms);
const result10 = await notificationService.broadcast(message);

// DOT FORMULA EXERCISE 11: Converting object properties to destructured variables
// Pattern: yiw + O const { <Ctrl-r>" } = objectName;<Esc>
const userObject = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1-555-0123',
  address: '123 Main St',
  city: 'San Francisco',
  state: 'California',
  zipCode: '94102'
};

// Add destructuring for: firstName, lastName, email, phone, address, city, state, zipCode

// DOT FORMULA EXERCISE 12: Adding null checks to property accesses
// Pattern: F. + i?<Esc> then f. + . for each property access
const userName = user.profile.name;
const userAvatar = user.profile.avatar.url;
const userEmail = user.contact.email;
const userPhone = user.contact.phone.primary;
const companyName = user.employment.company.name;
const departmentName = user.employment.department.name;
const managerEmail = user.employment.manager.contact.email;
const projectName = user.assignments.current.project.name;
const taskStatus = user.assignments.current.tasks.active.status;
const deadline = user.assignments.current.tasks.active.deadline;

// DOT FORMULA EXERCISE 13: Adding async/await to Promise chains
// Pattern: C const result = await<Enter><Ctrl-r>";<Esc>
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

fetch('/api/products')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

fetch('/api/orders')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));

// DOT FORMULA EXERCISE 14: Converting string concatenation to template literals
// Pattern: f+ + ct`${ <Ctrl-r>" }<Esc> + f+ + c2l }<Esc>
const fullName = firstName + ' ' + lastName;
const address = streetAddress + ', ' + cityName + ', ' + stateName;
const url = baseUrl + '/api/' + version + '/' + endpoint;
const filename = filePrefix + '_' + timestamp + '.' + fileExtension;
const query = 'SELECT * FROM ' + tableName + ' WHERE id = ' + recordId;

// DOT FORMULA EXERCISE 15: Adding return type annotations (comments)
// Pattern: A // returns Type<Esc>
function getUserById(id) {
  return database.findUser(id);
}

function calculateTax(amount, rate) {
  return amount * rate;
}

function formatDate(date) {
  return date.toISOString();
}

function parseJson(jsonString) {
  return JSON.parse(jsonString);
}

function generateHash(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export {
  statements,
  sqlQueries,
  userProfile,
  productData,
  orderInfo,
  messages,
  calculateTotal,
  validateEmail,
  formatCurrency,
  createUser,
  userObject
};