/**
 * Day 02 - Basic Navigation Practice File
 * Focus: h, j, k, l movement and basic positioning
 *
 * NAVIGATION TARGETS:
 * Use h/j/k/l to navigate between the marked positions below
 * h = left, j = down, k = up, l = right
 *
 * PRACTICE GOALS:
 * 1. Navigate to each 🎯 target marker
 * 2. Practice moving between function definitions
 * 3. Use basic navigation to correct syntax errors
 * 4. Navigate through nested structures
 */

// 🎯 TARGET 1: Navigate here using basic movement keys
const API_BASE_URL = 'https://api.example.com';

// 🎯 TARGET 2: Practice moving down with 'j' to reach this line
const HTTP_METHODS = {
    GET: 'GET',     // 🎯 Navigate to this property
    POST: 'POST',   // 🎯 Then move down to this one
    PUT: 'PUT',     // 🎯 Continue down here
    DELETE: 'DELETE' // 🎯 Finally reach this line
};

/**
 * HTTP Client Class
 * 🎯 TARGET 3: Navigate to the class name below
 */
class HttpClient {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;          // 🎯 Navigate to the semicolon
        this.defaultHeaders = {          // 🎯 Move to opening brace
            'Content-Type': 'application/json',  // 🎯 Navigate to the comma
            'Accept': 'application/json'         // 🎯 End of headers object
        };
    }

    // 🎯 TARGET 4: Navigate to method name 'setAuthToken'
    setAuthToken(token) {
        if (token) {                           // 🎯 Navigate to opening parenthesis
            this.defaultHeaders['Authorization'] = `Bearer ${token}`;  // 🎯 Navigate to closing bracket
        } else {
            delete this.defaultHeaders['Authorization'];  // 🎯 Navigate to 'delete' keyword
        }
    }

    // 🎯 TARGET 5: Practice navigating through parameter list
    async request(endpoint, method = 'GET', data = null, customHeaders = {}) {
        const url = `${this.baseUrl}${endpoint}`;  // 🎯 Navigate to template literal

        const options = {
            method,                    // 🎯 Navigate to comma after method
            headers: {                 // 🎯 Navigate to opening brace
                ...this.defaultHeaders,     // 🎯 Navigate to spread operator
                ...customHeaders            // 🎯 Navigate to closing spread
            }
        };

        // 🎯 TARGET 6: Navigate to conditional statement
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);  // 🎯 Navigate to semicolon
        }

        try {
            const response = await fetch(url, options);  // 🎯 Navigate to 'await' keyword

            if (!response.ok) {           // 🎯 Navigate to exclamation mark
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();  // 🎯 Navigate to 'return' keyword
        } catch (error) {
            console.error('Request failed:', error);  // 🎯 Navigate to error parameter
            throw error;                              // 🎯 Navigate to 'throw' keyword
        }
    }

    // 🎯 TARGET 7: Navigate between HTTP method definitions
    async get(endpoint, headers) {
        return this.request(endpoint, HTTP_METHODS.GET, null, headers);
    }

    async post(endpoint, data, headers) {      // 🎯 Navigate to 'data' parameter
        return this.request(endpoint, HTTP_METHODS.POST, data, headers);
    }

    async put(endpoint, data, headers) {       // 🎯 Navigate to 'put' method name
        return this.request(endpoint, HTTP_METHODS.PUT, data, headers);
    }

    async delete(endpoint, headers) {          // 🎯 Navigate to 'delete' method name
        return this.request(endpoint, HTTP_METHODS.DELETE, null, headers);
    }
}

// 🎯 TARGET 8: Navigate to class instantiation
const apiClient = new HttpClient();

// 🎯 TARGET 9: Practice navigating through array elements
const endpoints = [
    '/users',        // 🎯 Navigate to first endpoint
    '/posts',        // 🎯 Move down to second
    '/comments',     // 🎯 Continue to third
    '/categories',   // 🎯 Navigate to fourth
    '/tags'          // 🎯 Reach the last endpoint
];

// 🎯 TARGET 10: Navigate through object properties
const userProfile = {
    id: 1,                    // 🎯 Navigate to the number
    username: 'developer',    // 🎯 Navigate to the string
    email: 'dev@example.com', // 🎯 Navigate to email value
    preferences: {            // 🎯 Navigate to nested object
        theme: 'dark',            // 🎯 Navigate to theme value
        notifications: true,      // 🎯 Navigate to boolean
        language: 'en'            // 🎯 Navigate to language
    },
    roles: ['user', 'admin']  // 🎯 Navigate to array elements
};

// 🎯 TARGET 11: Navigate through function parameters and body
function processUserData(userData, options = {}) {
    const {                           // 🎯 Navigate to destructuring
        validateEmail = true,             // 🎯 Navigate to default value
        sanitizeInput = false,            // 🎯 Navigate to boolean
        transformCase = 'lower'           // 🎯 Navigate to string value
    } = options;

    // 🎯 TARGET 12: Navigate through conditional logic
    if (validateEmail && userData.email) {       // 🎯 Navigate to && operator
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // 🎯 Navigate to regex
        if (!emailRegex.test(userData.email)) {          // 🎯 Navigate to method call
            throw new Error('Invalid email format');     // 🎯 Navigate to error message
        }
    }

    // 🎯 TARGET 13: Navigate through return statement
    return {
        ...userData,                    // 🎯 Navigate to spread operator
        email: transformCase === 'lower'
            ? userData.email?.toLowerCase()     // 🎯 Navigate to optional chaining
            : userData.email?.toUpperCase(),    // 🎯 Navigate to alternate case
        processedAt: new Date().toISOString()   // 🎯 Navigate to method chain
    };
}

// 🎯 TARGET 14: Navigate through async/await pattern
async function fetchAndProcessUser(userId) {
    try {
        const userData = await apiClient.get(`/users/${userId}`);  // 🎯 Navigate to template literal
        const processedData = processUserData(userData, {         // 🎯 Navigate to function call
            validateEmail: true,      // 🎯 Navigate to option
            transformCase: 'lower'    // 🎯 Navigate to option value
        });

        console.log('Processed user:', processedData);  // 🎯 Navigate to log message
        return processedData;                           // 🎯 Navigate to return
    } catch (error) {
        console.error('Failed to process user:', error.message);  // 🎯 Navigate to error property
        return null;                                              // 🎯 Navigate to null return
    }
}

// 🎯 TARGET 15: Final navigation challenge - move through this complex structure
const complexConfig = {
    api: {
        endpoints: {
            users: '/api/v1/users',      // 🎯 Navigate here
            posts: '/api/v1/posts',      // 🎯 Then here
            auth: {
                login: '/auth/login',     // 🎯 Navigate to nested value
                logout: '/auth/logout',   // 🎯 Continue navigation
                refresh: '/auth/refresh'  // 🎯 Final target
            }
        }
    }
};

/**
 * NAVIGATION PRACTICE SUMMARY:
 * ✓ Used h/j/k/l to move between all targets
 * ✓ Navigated through different code structures
 * ✓ Practiced moving through nested objects/arrays
 * ✓ Moved between function definitions and calls
 *
 * Next: Practice word motions and more advanced navigation!
 */