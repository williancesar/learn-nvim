/**
 * DAY 11: CHANGE OPERATIONS PRACTICE
 * ===================================
 *
 * LEARNING OBJECTIVES:
 * - Master change commands (c, cc, C, s, S)
 * - Practice substitution with different text objects
 * - Learn efficient text replacement workflows
 *
 * KEY COMMANDS TO PRACTICE:
 * - c{motion}  : Change from cursor to motion target
 * - cc         : Change entire line
 * - C          : Change from cursor to end of line
 * - s          : Substitute character (delete char and enter insert)
 * - S          : Substitute line (delete line and enter insert)
 * - cw         : Change word
 * - ciw        : Change inner word
 * - caw        : Change around word
 * - ci"        : Change inside quotes
 * - ca{        : Change around braces
 * - ct{char}   : Change till character
 * - cf{char}   : Change find character
 *
 * EXERCISE INSTRUCTIONS:
 * 1. Practice changing different code elements
 * 2. Use change commands with various text objects
 * 3. Replace old code patterns with modern alternatives
 * 4. Focus on efficient substitution workflows
 */

// CHANGE TARGET: Variable names that need updating
let oldVariableName = 'change this to newVariableName';
let usr = 'change to user';
let temp = 'change to temporary';
let btn = 'change to button';
let img = 'change to image';
let cfg = 'change to config';
let db = 'change to database';
let auth = 'change to authentication';

// CHANGE TARGET: Function names needing modernization
function getData() {
    // Change to: async function fetchData()
    return fetch('/api/data');
}

function processInfo() {
    // Change to: async function processInformation()
    console.log('Processing...');
}

function updateUI() {
    // Change to: function updateUserInterface()
    console.log('Updating interface...');
}

function calcTotal() {
    // Change to: function calculateTotal()
    return 100;
}

// CHANGE TARGET: Old syntax patterns to update
var oldVar = 'change to const';
var anotherOldVar = 'change to let';

// Change these function declarations to arrow functions
function add(a, b) {
    return a + b;
}

function multiply(x, y) {
    return x * y;
}

function greet(name) {
    return 'Hello, ' + name;
}

// CHANGE TARGET: String concatenation to template literals
const message1 = 'Hello, ' + userName + '! Welcome back.';
const message2 = 'Your score is ' + score + ' out of ' + total + '.';
const message3 = 'File ' + fileName + ' saved to ' + directory + '.';
const url = baseUrl + '/api/users/' + userId + '/profile';

// CHANGE TARGET: Object property shorthand opportunities
const userProfile = {
    name: name,           // Change to shorthand: name,
    age: age,             // Change to shorthand: age,
    email: email,         // Change to shorthand: email,
    city: city,           // Change to shorthand: city,
    country: country      // Change to shorthand: country
};

// CHANGE TARGET: Method definitions to use shorthand
const apiClient = {
    get: function(url) {     // Change to: get(url) {
        return fetch(url);
    },

    post: function(url, data) {  // Change to: post(url, data) {
        return fetch(url, { method: 'POST', body: data });
    },

    put: function(url, data) {   // Change to: put(url, data) {
        return fetch(url, { method: 'PUT', body: data });
    }
};

// CHANGE TARGET: Comments needing updates
// TODO: Fix this bug                  // Change to: FIXME: Critical bug
// HACK: Temporary solution            // Change to: TODO: Implement proper solution
// NOTE: This might break              // Change to: WARNING: Potential breaking change
// IDEA: Could be optimized            // Change to: OPTIMIZE: Performance improvement needed

// CHANGE TARGET: Configuration values to update
const config = {
    environment: 'development',      // Change to: 'production'
    apiVersion: 'v1',               // Change to: 'v2'
    timeout: 5000,                  // Change to: 10000
    retries: 3,                     // Change to: 5
    debug: true,                    // Change to: false
    logging: 'verbose'              // Change to: 'info'
};

// CHANGE TARGET: Class properties and methods
class UserManager {
    constructor() {
        this.users = [];
        this.activeUsers = [];
        this.adminUsers = [];
    }

    // Change method name: addUser -> createUser
    addUser(userData) {
        const user = {
            id: Date.now(),
            ...userData,
            createdAt: new Date(),
            active: true
        };
        this.users.push(user);
        return user;
    }

    // Change method name: getUser -> findUser
    getUser(userId) {
        return this.users.find(user => user.id === userId);
    }

    // Change method name: removeUser -> deleteUser
    removeUser(userId) {
        const index = this.users.findIndex(user => user.id === userId);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
        return null;
    }

    // Change property access pattern
    getUserCount() {
        return this.users.length;     // Change to: this.users.size (if using Set)
    }
}

// CHANGE TARGET: Error messages to be more descriptive
const errorMessages = {
    invalid: 'Invalid input',                    // Change to: 'Invalid input provided'
    notFound: 'Not found',                      // Change to: 'Resource not found'
    unauthorized: 'Access denied',              // Change to: 'Unauthorized access attempt'
    timeout: 'Request timeout',                 // Change to: 'Request timeout exceeded'
    serverError: 'Server error'                 // Change to: 'Internal server error occurred'
};

// CHANGE TARGET: Magic numbers to named constants
function calculateDiscount(price) {
    if (price > 100) {              // Change 100 to DISCOUNT_THRESHOLD
        return price * 0.1;         // Change 0.1 to DISCOUNT_RATE
    }
    return 0;
}

function validateAge(age) {
    return age >= 18 && age <= 120;  // Change to MIN_AGE and MAX_AGE constants
}

// CHANGE TARGET: Inconsistent naming conventions
const api_base_url = 'https://api.example.com';     // Change to: apiBaseUrl
const user_preferences = {};                         // Change to: userPreferences
const max_retry_count = 5;                          // Change to: maxRetryCount
const is_debug_mode = false;                        // Change to: isDebugMode

// CHANGE TARGET: Outdated browser compatibility code
function addEventListenerCompat(element, event, handler) {
    if (element.addEventListener) {              // Change: Remove compatibility check
        element.addEventListener(event, handler);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, handler);
    }
}

// CHANGE TARGET: Callback pattern to Promise/async-await
function loadData(callback) {                    // Change to: async function loadData()
    setTimeout(() => {
        const data = { message: 'Data loaded' };
        callback(data);                          // Change to: return data;
    }, 1000);
}

function processData(data, callback) {           // Change to: async function processData(data)
    setTimeout(() => {
        const processed = { ...data, processed: true };
        callback(processed);                     // Change to: return processed;
    }, 500);
}

// CHANGE TARGET: Array iteration patterns
const numbers = [1, 2, 3, 4, 5];

// Change for loop to map
let doubled = [];
for (let i = 0; i < numbers.length; i++) {
    doubled.push(numbers[i] * 2);
}

// Change for loop to filter
let evens = [];
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] % 2 === 0) {
        evens.push(numbers[i]);
    }
}

// Change for loop to reduce
let sum = 0;
for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
}

// CHANGE TARGET: jQuery patterns to vanilla JS
// Change: $('#myElement') to document.getElementById('myElement')
// Change: $('.myClass') to document.querySelectorAll('.myClass')
// Change: $(document).ready() to DOMContentLoaded event

const jqueryPatterns = {
    selector: "$('#user-profile')",              // Change to vanilla JS
    addClass: "$('.button').addClass('active')", // Change to vanilla JS
    onClick: "$('.btn').click(handler)",         // Change to vanilla JS
    hide: "$('.modal').hide()",                  // Change to vanilla JS
    show: "$('.tooltip').show()"                 // Change to vanilla JS
};

// CHANGE TARGET: Synchronous operations to async
function saveUserData(userData) {                // Change to: async function
    // Simulate API call
    console.log('Saving user data...');
    return userData;                             // Change to: await apiCall
}

function validateInput(input) {                  // Change to: async function
    console.log('Validating input...');
    return true;                                 // Change to: await validation
}

// CHANGE TARGET: Hard-coded values to environment variables
const databaseConfig = {
    host: 'localhost',                           // Change to: process.env.DB_HOST
    port: 5432,                                  // Change to: process.env.DB_PORT
    username: 'admin',                           // Change to: process.env.DB_USER
    password: 'password123',                     // Change to: process.env.DB_PASSWORD
    database: 'myapp'                            // Change to: process.env.DB_NAME
};

// CHANGE TARGET: Switch statement to object lookup
function getStatusColor(status) {
    switch (status) {                            // Change entire switch to object lookup
        case 'pending':
            return 'yellow';
        case 'approved':
            return 'green';
        case 'rejected':
            return 'red';
        case 'cancelled':
            return 'gray';
        default:
            return 'black';
    }
}

// CHANGE TARGET: Nested ternary operators to if-else or function
const priority = urgent ? (important ? 'high' : 'medium') : (important ? 'low' : 'none');

// CHANGE TARGET: Class to functional component pattern
class Counter {                                  // Change to: function Counter() or const Counter = () =>
    constructor(initialValue = 0) {
        this.value = initialValue;
    }

    increment() {                                // Change to: const increment = () =>
        this.value++;
    }

    decrement() {                                // Change to: const decrement = () =>
        this.value--;
    }

    getValue() {                                 // Change to: const getValue = () =>
        return this.value;
    }
}

// CHANGE TARGET: Error handling patterns
function riskyOperation() {
    try {
        // Some operation
        return 'success';
    } catch (error) {
        console.log(error);                      // Change to: console.error
        return null;                             // Change to: throw error or proper handling
    }
}

// CHANGE TARGET: Type checking patterns
function processValue(value) {
    if (typeof value === 'string') {             // Change to more specific validation
        return value.toUpperCase();
    }
    if (typeof value === 'number') {             // Change to handle edge cases
        return value * 2;
    }
    return value;                                // Change to throw error for invalid types
}

/**
 * PRACTICE EXERCISES:
 *
 * 1. BASIC CHANGE COMMANDS:
 *    - Use 'cw' to change words like 'oldVariableName' to 'newVariableName'
 *    - Use 'cc' to change entire lines
 *    - Use 'C' to change from cursor to end of line
 *    - Use 's' to substitute single characters
 *    - Use 'S' to substitute entire lines
 *
 * 2. CHANGE WITH TEXT OBJECTS:
 *    - Use 'ciw' to change words without affecting surrounding spaces
 *    - Use 'ci"' to change text inside quotes
 *    - Use 'ca(' to change function parameters including parentheses
 *    - Use 'ci{' to change content inside braces
 *
 * 3. CHANGE WITH MOTIONS:
 *    - Use 'ct(' to change until opening parenthesis
 *    - Use 'cf;' to change including semicolon
 *    - Use 'c$' to change to end of line
 *    - Use 'c^' to change to beginning of line
 *
 * 4. MODERNIZATION PRACTICE:
 *    - Change 'var' declarations to 'const' or 'let'
 *    - Change function declarations to arrow functions
 *    - Change string concatenation to template literals
 *    - Change callback patterns to async/await
 *
 * 5. REFACTORING WORKFLOWS:
 *    - Change method names consistently across a class
 *    - Update configuration values throughout the file
 *    - Replace magic numbers with named constants
 *    - Convert jQuery patterns to vanilla JavaScript
 *
 * REMEMBER:
 * - 'c' puts you in insert mode after deleting
 * - Combine 'c' with any motion or text object
 * - 'cc' changes the entire line but preserves indentation
 * - 'C' is equivalent to 'c$'
 * - 's' is equivalent to 'cl'
 * - 'S' is equivalent to 'cc'
 */