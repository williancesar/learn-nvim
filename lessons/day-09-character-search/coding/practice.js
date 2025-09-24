/**
 * DAY 09: CHARACTER SEARCH PRACTICE
 * ==================================
 *
 * LEARNING OBJECTIVES:
 * - Master character search commands (f, F, t, T)
 * - Practice efficient cursor positioning with character targets
 * - Learn to combine character search with editing commands
 *
 * KEY COMMANDS TO PRACTICE:
 * - f{char}   : Jump forward to next occurrence of {char}
 * - F{char}   : Jump backward to previous occurrence of {char}
 * - t{char}   : Jump forward to character before next {char}
 * - T{char}   : Jump backward to character after previous {char}
 * - ;         : Repeat last f/F/t/T search in same direction
 * - ,         : Repeat last f/F/t/T search in opposite direction
 *
 * EXERCISE INSTRUCTIONS:
 * 1. Practice jumping to specific characters using f/F/t/T
 * 2. Use ; and , to repeat searches efficiently
 * 3. Combine character search with editing: d f{char}, c t{char}, etc.
 * 4. Focus on the punctuation and special characters marked below
 */

// SEARCH TARGET: Semicolons (;) - Practice f; and F;
const databaseConfig = {
    host: 'localhost'; // TARGET: Jump to this semicolon with f;
    port: 5432; // TARGET: Jump to this semicolon
    database: 'myapp'; // TARGET: Jump to this semicolon
    username: 'admin'; // TARGET: Jump to this semicolon
    password: 'secret123'; // TARGET: Jump to this semicolon
    ssl: true; // TARGET: Jump to this semicolon
    connectionTimeout: 30000; // TARGET: Jump to this semicolon
};

// SEARCH TARGET: Parentheses () - Practice f( f) F( F)
function calculateTotal(price, tax, discount, shippingCost) {
    // Practice: f( to jump to opening parentheses
    // Practice: f) to jump to closing parentheses
    const subtotal = (price - discount) * (1 + tax);
    const total = Math.round((subtotal + shippingCost) * 100) / 100;

    return {
        subtotal: Math.floor(subtotal),
        shippingCost: Math.ceil(shippingCost),
        total: parseFloat(total.toFixed(2))
    };
}

// SEARCH TARGET: Brackets [] - Practice f[ f] F[ F]
const shoppingCart = [
    { id: 1, name: 'Laptop', price: 999.99, quantity: 1 },
    { id: 2, name: 'Mouse', price: 29.99, quantity: 2 },
    { id: 3, name: 'Keyboard', price: 89.99, quantity: 1 },
    { id: 4, name: 'Monitor', price: 299.99, quantity: 1 }
];

// Practice f[ and f] to navigate between array brackets
const cartOperations = {
    getItemById: (items, id) => items[items.findIndex(item => item.id === id)],
    removeItem: (items, index) => [...items.slice(0, index), ...items.slice(index + 1)],
    updateQuantity: (items, id, newQty) => items[items.findIndex(i => i.id === id)].quantity = newQty
};

// SEARCH TARGET: Braces {} - Practice f{ f} F{ F}
const userProfile = {
    personal: { name: 'John Doe', age: 30, email: 'john@example.com' },
    preferences: { theme: 'dark', language: 'en', notifications: true },
    settings: { privacy: 'public', twoFactor: false, backup: 'weekly' }
};

// SEARCH TARGET: Quotes and Apostrophes - Practice f' f" F' F"
const messages = {
    welcome: "Welcome to our application! We're glad you're here.",
    error: 'An error occurred while processing your request.',
    success: "Your changes have been saved successfully!",
    warning: 'Please verify your email address before continuing.',
    info: "For more information, visit our 'Help' section."
};

// Practice t and T (till character) with quotes
const stringOperations = {
    extractQuoted: (text) => text.match(/"([^"]*)"/g), // Practice: t" and T"
    replaceQuotes: (text) => text.replace(/'/g, '"'), // Practice: t' and F'
    countQuotes: (text) => (text.match(/"/g) || []).length + (text.match(/'/g) || []).length
};

// SEARCH TARGET: Colons (:) - Practice f: F: t: T:
const apiEndpoints = {
    users: 'https://api.example.com/v1/users',
    posts: 'https://api.example.com/v1/posts',
    comments: 'https://api.example.com/v1/comments',
    auth: 'https://api.example.com/v1/auth/login',
    profile: 'https://api.example.com/v1/user/profile'
};

// SEARCH TARGET: Commas (,) - Practice f, F, t, T,
const csvData = 'John,Doe,30,Engineer,New York,john@email.com,2023-01-15,Active,Premium,true';
const parseCSV = (data) => {
    // Practice jumping between commas with f, and F,
    const fields = data.split(',');
    return {
        firstName: fields[0],
        lastName: fields[1],
        age: parseInt(fields[2]),
        job: fields[3],
        city: fields[4],
        email: fields[5],
        joinDate: fields[6],
        status: fields[7],
        plan: fields[8],
        active: fields[9] === 'true'
    };
};

// SEARCH TARGET: Dots (.) - Practice f. F. for method chaining
const dataProcessor = {
    processUserData: (users) => {
        return users
            .filter(user => user.active)
            .map(user => ({ ...user, displayName: `${user.firstName} ${user.lastName}` }))
            .sort((a, b) => a.lastName.localeCompare(b.lastName))
            .slice(0, 50);
    },

    formatResults: (data) => {
        return data
            .reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
            .entries()
            .map(([key, value]) => ({ id: key, ...value }));
    }
};

// SEARCH TARGET: Equal signs (=) - Practice f= F= t= T=
let counter = 0;
const increment = () => counter += 1;
const decrement = () => counter -= 1;
const reset = () => counter = 0;
const setValue = (value) => counter = Math.max(0, value);
const double = () => counter *= 2;
const halve = () => counter = Math.floor(counter / 2);

// SEARCH TARGET: Plus signs (+) - Practice f+ F+
const mathOperations = {
    add: (a, b) => a + b,
    addThree: (a, b, c) => a + b + c,
    concat: (str1, str2) => str1 + ' ' + str2,
    increment: (num) => ++num,
    buildUrl: (base, path) => base + '/' + path + '?v=' + Date.now()
};

// SEARCH TARGET: Minus signs (-) - Practice f- F-
const dateUtils = {
    formatDate: (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    parseDate: (str) => {
        // Practice: Jump between hyphens with f- and F-
        const [year, month, day] = str.split('-');
        return new Date(year, month - 1, day);
    },
    dateRange: (start, end) => `${start} - ${end}`,
    businessDays: (date) => {
        // Skip weekends and holidays
        const dayOfWeek = date.getDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6; // 0=Sunday, 6=Saturday
    }
};

// SEARCH TARGET: Asterisks (*) - Practice f* F*
const wildcardPatterns = [
    '*.js',     // JavaScript files
    '*.json',   // JSON files
    '*.md',     // Markdown files
    '*.html',   // HTML files
    '*.css',    // CSS files
    '*.png',    // PNG images
    'test/*.js' // Test JavaScript files
];

// SEARCH TARGET: Hash symbols (#) - Practice f# F#
const cssColors = {
    primary: '#007bff',     // Blue
    secondary: '#6c757d',   // Gray
    success: '#28a745',     // Green
    danger: '#dc3545',      // Red
    warning: '#ffc107',     // Yellow
    info: '#17a2b8',        // Cyan
    light: '#f8f9fa',       // Light gray
    dark: '#343a40'         // Dark gray
};

// SEARCH TARGET: Dollar signs ($) - Practice f$ F$
const templateStrings = {
    greeting: (name) => `Hello, ${name}! Welcome back.`,
    price: (amount, currency = 'USD') => `${currency === 'USD' ? '$' : '€'}${amount.toFixed(2)}`,
    path: (dir, file) => `${dir}/${file}`,
    query: (table, where) => `SELECT * FROM ${table} WHERE ${where}`,
    env: process.env.NODE_ENV || 'development'
};

// SEARCH TARGET: Percent signs (%) - Practice f% F%
const percentageCalculations = {
    calculateTip: (bill, tipPercent = 18) => bill * (tipPercent / 100),
    calculateDiscount: (price, discountPercent) => price * (1 - discountPercent / 100),
    calculateTax: (amount, taxPercent = 8.25) => amount * (taxPercent / 100),
    formatPercent: (decimal) => `${(decimal * 100).toFixed(1)}%`,
    progressBar: (current, total) => `Progress: ${Math.round((current / total) * 100)}%`
};

// SEARCH TARGET: Ampersands (&) - Practice f& F&
const urlBuilder = {
    addParam: (url, key, value) => `${url}${url.includes('?') ? '&' : '?'}${key}=${value}`,
    buildQuery: (params) => Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&'),
    parseQuery: (queryString) => {
        // Practice: Jump between & symbols
        return queryString.split('&').reduce((acc, param) => {
            const [key, value] = param.split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
    }
};

// SEARCH TARGET: Pipes (|) - Practice f| F|
const logLevels = 'DEBUG|INFO|WARN|ERROR|FATAL';
const statusCodes = 'PENDING|PROCESSING|COMPLETED|FAILED|CANCELLED';
const permissions = 'READ|WRITE|DELETE|ADMIN|GUEST';

const pipeOperations = {
    split: (str) => str.split('|'),
    join: (arr) => arr.join('|'),
    contains: (str, value) => str.split('|').includes(value),
    add: (str, value) => `${str}|${value}`,
    remove: (str, value) => str.split('|').filter(v => v !== value).join('|')
};

// SEARCH TARGET: Underscores (_) - Practice f_ F_
const snake_case_variables = {
    user_id: 12345,
    first_name: 'Jane',
    last_name: 'Smith',
    email_address: 'jane.smith@example.com',
    phone_number: '+1-555-123-4567',
    created_at: new Date(),
    updated_at: new Date(),
    is_active: true,
    user_preferences: {
        theme_color: 'blue',
        font_size: 14,
        auto_save: true
    }
};

// SEARCH TARGET: Backslashes (\) - Practice f\ F\ (escape characters)
const regexPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    url: /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    creditCard: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
    strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// Complex search practice combining multiple characters
const complexSearchExercise = `
Practice sequence:
1. f( - jump to opening parenthesis
2. f" - jump to quote
3. f, - jump to comma
4. f} - jump to closing brace
5. Use ; to repeat searches
6. Use , to reverse direction
`;

/**
 * PRACTICE EXERCISES:
 *
 * 1. BASIC CHARACTER SEARCH:
 *    - Place cursor at beginning of line 20
 *    - Use f; to jump to the first semicolon
 *    - Use ; to jump to the next semicolon
 *    - Use F; to jump back to previous semicolon
 *    - Use , to repeat the search in original direction
 *
 * 2. TILL CHARACTER PRACTICE:
 *    - Find a line with quotes in the messages object
 *    - Use t" to jump till the quote (cursor before quote)
 *    - Use T" to jump till the previous quote
 *    - Compare with f" (cursor on quote)
 *
 * 3. SEARCH AND EDIT COMBINATIONS:
 *    - Use df, to delete until comma
 *    - Use ct) to change until closing parenthesis
 *    - Use yf; to yank until semicolon
 *    - Use cf. to change until dot
 *
 * 4. REPETITION PRACTICE:
 *    - In the csvData line, use f,
 *    - Use ;;; to jump forward 3 commas
 *    - Use ,, to go back 2 commas
 *    - Practice until movement becomes automatic
 *
 * 5. COMPLEX NAVIGATION:
 *    - Navigate the method chaining in dataProcessor
 *    - Use f. to jump between method calls
 *    - Use f( and f) to jump between function calls
 *    - Combine with other movement commands
 *
 * REMEMBER:
 * - f moves to character, t moves till character
 * - Capital versions (F, T) search backward
 * - ; repeats search in same direction
 * - , repeats search in opposite direction
 * - Combine with operators: d, c, y for powerful editing
 */