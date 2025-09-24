/**
 * Day 31: Macro Recording Practice - Repetitive Code Patterns
 *
 * This file contains repetitive code patterns perfect for macro recording practice.
 * Look for patterns that can be automated with macros.
 *
 * Key commands to practice:
 * - qa (start recording macro to register 'a')
 * - q (stop recording)
 * - @a (replay macro from register 'a')
 * - 5@a (replay macro 5 times)
 * - @@ (replay last macro)
 */

// MACRO EXERCISE 1: Convert these function declarations to arrow functions
// Record a macro to convert each function declaration
function addNumbers(a, b) {
  return a + b;
}

function subtractNumbers(a, b) {
  return a - b;
}

function multiplyNumbers(a, b) {
  return a * b;
}

function divideNumbers(a, b) {
  return a / b;
}

function powerNumbers(a, b) {
  return Math.pow(a, b);
}

function squareNumber(num) {
  return num * num;
}

function cubeNumber(num) {
  return num * num * num;
}

function absoluteValue(num) {
  return Math.abs(num);
}

function roundNumber(num) {
  return Math.round(num);
}

function floorNumber(num) {
  return Math.floor(num);
}

function ceilNumber(num) {
  return Math.ceil(num);
}

// MACRO EXERCISE 2: Add JSDoc comments to these functions
// Record a macro to add proper JSDoc documentation
function calculateTax(amount, rate) {
  return amount * rate;
}

function formatCurrency(amount, currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// MACRO EXERCISE 3: Convert these var declarations to const/let
// Record a macro to modernize variable declarations
var userName = 'john_doe';
var userAge = 25;
var userEmail = 'john@example.com';
var userActive = true;
var userRoles = ['user', 'admin'];
var userPreferences = { theme: 'dark', notifications: true };
var userLastLogin = new Date();
var userLoginCount = 42;
var userScore = 1250.75;
var userLevel = 'intermediate';

var productName = 'Wireless Headphones';
var productPrice = 99.99;
var productDescription = 'High-quality wireless headphones with noise cancellation';
var productInStock = true;
var productCategories = ['electronics', 'audio'];
var productSpecs = { battery: '30 hours', weight: '250g' };
var productRating = 4.5;
var productReviews = 1247;
var productDiscount = 0.15;
var productManufacturer = 'TechCorp';

// MACRO EXERCISE 4: Add console.log statements to these assignments
// Record a macro to add debugging logs after each assignment
let totalRevenue = 0;
let totalOrders = 0;
let averageOrderValue = 0;
let conversionRate = 0;
let customerLifetimeValue = 0;
let returnCustomerRate = 0;
let cartAbandonmentRate = 0;
let topSellingProduct = '';
let seasonalTrend = '';
let marketingROI = 0;

let serverUptime = 0;
let responseTime = 0;
let errorRate = 0;
let throughput = 0;
let memoryUsage = 0;
let cpuUsage = 0;
let diskSpace = 0;
let activeConnections = 0;
let queueLength = 0;
let cacheHitRate = 0;

// MACRO EXERCISE 5: Wrap these expressions in try-catch blocks
// Record a macro to add error handling to each operation
JSON.parse(userInputData);
localStorage.setItem('user', userData);
fetch('/api/users').then(response => response.json());
document.querySelector('#invalid-selector').addEventListener('click', handler);
parseInt(userInput, 10);
new Date(dateString);
atob(encodedString);
eval(dynamicCode);
Object.keys(potentiallyUndefined).length;
array.find(item => item.id === targetId).name;

// MACRO EXERCISE 6: Convert these objects to use computed property names
// Record a macro to modernize object property syntax
const config1 = {};
config1['api' + 'Key'] = 'secret123';
config1['base' + 'Url'] = 'https://api.example.com';
config1['timeout' + 'Ms'] = 5000;

const config2 = {};
config2['db' + 'Host'] = 'localhost';
config2['db' + 'Port'] = 5432;
config2['db' + 'Name'] = 'myapp';

const config3 = {};
config3['redis' + 'Host'] = 'localhost';
config3['redis' + 'Port'] = 6379;
config3['redis' + 'Password'] = 'secret';

const config4 = {};
config4['smtp' + 'Host'] = 'smtp.gmail.com';
config4['smtp' + 'Port'] = 587;
config4['smtp' + 'Secure'] = true;

// MACRO EXERCISE 7: Add default parameters to these functions
// Record a macro to modernize function parameters
function createUser(name, email, role, active, settings) {
  name = name || 'Anonymous';
  email = email || 'noemail@example.com';
  role = role || 'user';
  active = active !== undefined ? active : true;
  settings = settings || {};

  return { name, email, role, active, settings };
}

function configureServer(host, port, ssl, timeout, retries) {
  host = host || 'localhost';
  port = port || 3000;
  ssl = ssl !== undefined ? ssl : false;
  timeout = timeout || 30000;
  retries = retries || 3;

  return { host, port, ssl, timeout, retries };
}

function setupDatabase(driver, host, port, database, username) {
  driver = driver || 'postgresql';
  host = host || 'localhost';
  port = port || 5432;
  database = database || 'defaultdb';
  username = username || 'user';

  return { driver, host, port, database, username };
}

// MACRO EXERCISE 8: Convert these callbacks to async/await
// Record a macro to modernize asynchronous code
function fetchUserData(userId, callback) {
  fetch(`/api/users/${userId}`)
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(error => callback(error, null));
}

function saveUserData(userData, callback) {
  fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(error => callback(error, null));
}

function deleteUserData(userId, callback) {
  fetch(`/api/users/${userId}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(data => callback(null, data))
    .catch(error => callback(error, null));
}

// MACRO EXERCISE 9: Add TypeScript-style type annotations as comments
// Record a macro to add type information to variables
let userName;
let userAge;
let userEmail;
let userActive;
let userRoles;
let userPreferences;
let calculateTotal;
let processPayment;
let sendNotification;
let validateInput;

// MACRO EXERCISE 10: Destructure these object property accesses
// Record a macro to convert dot notation to destructuring
const user = { name: 'John', email: 'john@example.com', age: 30 };
const userName2 = user.name;
const userEmail2 = user.email;
const userAge2 = user.age;

const product = { title: 'Laptop', price: 999, category: 'electronics' };
const productTitle = product.title;
const productPrice2 = product.price;
const productCategory = product.category;

const order = { id: '123', total: 299.99, status: 'pending' };
const orderId = order.id;
const orderTotal = order.total;
const orderStatus = order.status;

const settings = { theme: 'dark', language: 'en', notifications: true };
const settingsTheme = settings.theme;
const settingsLanguage = settings.language;
const settingsNotifications = settings.notifications;

// MACRO EXERCISE 11: Convert these string concatenations to template literals
// Record a macro to modernize string building
const message1 = 'Hello ' + userName + ', welcome to our app!';
const message2 = 'You have ' + unreadCount + ' unread messages.';
const message3 = 'Your order #' + orderId + ' total is $' + orderTotal + '.';
const message4 = 'Server running on ' + host + ':' + port;
const message5 = 'Error ' + errorCode + ': ' + errorMessage;
const message6 = 'Processing ' + currentItem + ' of ' + totalItems + ' items.';
const message7 = 'User ' + userId + ' updated profile at ' + timestamp + '.';
const message8 = 'Download complete: ' + filename + ' (' + fileSize + ' bytes)';
const message9 = 'Connected to ' + databaseName + ' as ' + username + '.';
const message10 = 'API request to ' + endpoint + ' took ' + duration + 'ms.';

// MACRO EXERCISE 12: Add null checks to these property accesses
// Record a macro to add defensive programming patterns
const userDisplayName = user.profile.displayName;
const userAvatar = user.profile.avatar.url;
const userAddress = user.contact.address.street;
const userPhone = user.contact.phone.primary;
const companyName = user.employment.company.name;
const companyAddress = user.employment.company.address.city;
const managerName = user.employment.manager.name;
const managerEmail = user.employment.manager.contact.email;
const projectName = user.currentProjects.active.name;
const projectDeadline = user.currentProjects.active.timeline.deadline;

export {
  addNumbers,
  subtractNumbers,
  multiplyNumbers,
  divideNumbers,
  calculateTax,
  formatCurrency,
  validateEmail,
  generateRandomString,
  debounce,
  throttle,
  createUser,
  configureServer,
  setupDatabase,
  fetchUserData,
  saveUserData,
  deleteUserData
};