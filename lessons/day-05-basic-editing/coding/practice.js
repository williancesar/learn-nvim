/**
 * Day 05 - Basic Editing Practice File
 * Focus: i, I, a, A, o, O, r, R, s, S, c, C
 *
 * INSERTION COMMANDS:
 * i = insert before cursor
 * I = insert at beginning of line
 * a = append after cursor
 * A = append at end of line
 * o = open new line below
 * O = open new line above
 *
 * REPLACEMENT COMMANDS:
 * r = replace single character
 * R = replace mode (overwrite)
 * s = substitute character (delete char and insert)
 * S = substitute entire line
 * c = change (with motion)
 * C = change to end of line
 *
 * PRACTICE MARKERS: [INSERT], [APPEND], [REPLACE], [CHANGE]
 */

// [INSERT] Use 'i' to insert missing semicolon here
const apiBaseUrl = 'https://api.example.com'

// [APPEND] Use 'A' to append port number at end: :3000
const serverConfig = {
    host: 'localhost'
}

// [INSERT] Use 'I' to add 'export ' at beginning of this line
const databaseConfig = {
    // [INSERT] Use 'o' to open new line and add: username: 'admin',
    password: 'secret123',
    // [INSERT] Use 'O' to open line above and add: host: 'localhost',
    port: 5432
    // [APPEND] Use 'a' to append comma after 5432
};

/**
 * [CHANGE] Use 'S' to substitute entire line with proper JSDoc
 * Incomplete comment block
 */
class UserAuthenticationService {
    constructor(config) {
        // [INSERT] Use 'i' to insert 'this.' before config
        config = config;
        // [REPLACE] Use 'r' to replace '=' with '.'
        this.tokenExpiry = 3600; // seconds
        // [CHANGE] Use 'C' to change from 'se' to end: 'isInitialized = false;'
        this.isReady = undefined;
    }

    // [INSERT] Use 'I' to add proper indentation (4 spaces)
async login(username, password) {
        // [REPLACE] Use 'r' to replace 'l' with 'v' in 'validate'
        const isValid = this.lalidateCredentials(username, password);

        if (!isValid) {
            // [CHANGE] Use 'cw' to change 'throw' to 'return'
            throw new Error('Invalid credentials');
        }

        // [INSERT] Use 'a' to append missing parameters: '(username, password)'
        const token = this.generateToken;
        // [APPEND] Use 'A' to append: .setExpiration(this.tokenExpiry)
        return token;
    }

    // [REPLACE] Use 'R' to replace entire method name: 'validateCredentials'
    lalidateCredentials(username, password) {
        // [INSERT] Use 'o' to add new line: const minLength = 3;

        // [CHANGE] Use 'cw' to change 'username' to 'user'
        if (!username || username.length < 3) {
            return false;
        }

        // [REPLACE] Use 's' to substitute '!' with 'password &&'
        if (!password || password.length < 8) {
            return false;
        }

        // [INSERT] Use 'i' to insert 'return ' before 'true'
        true;
    }

    generateToken(username, password) {
        // [INSERT] Use 'I' to add missing 'const ' at beginning
        payload = {
            // [APPEND] Use 'a' to append missing comma
            username: username
            // [INSERT] Use 'o' to add: iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + this.tokenExpiry
        };

        // [CHANGE] Use 'C' to change from 'Base64' to end: 'btoa(JSON.stringify(payload));'
        return Base64.encode(payload);
    }

    // [INSERT] Use 'O' to add method above this line:
    // logout(token) {
    //     return this.invalidateToken(token);
    // }

    refreshToken(oldToken) {
        // [REPLACE] Use 'r' to replace 'v' with 'f' in 'verifyToken'
        const isValid = this.verifyToken(oldToken);

        if (isValid) {
            // [CHANGE] Use 'cw' to change 'oldToken' to 'newToken'
            return this.generateToken(oldToken.username, oldToken.password);
        }

        // [INSERT] Use 'i' to insert 'return ' before 'null'
        null;
    }
}

// [INSERT] Use 'o' to add new line and class instantiation:
// const authService = new UserAuthenticationService(serverConfig);

// [CHANGE] Use 'S' to substitute entire line with proper async function
function processUserLogin(credentials) {
    // [INSERT] Use 'i' to insert 'const ' before 'result'
    result = {
        success: false,
        // [APPEND] Use 'a' to append comma after 'false'
        message: ''
        // [INSERT] Use 'o' to add: token: null,
        // [INSERT] Use 'o' to add: expiresAt: null
    };

    try {
        // [REPLACE] Use 'r' to replace '=' with '.'
        const token = authService=login(credentials.username, credentials.password);

        // [CHANGE] Use 'cw' to change 'result' to 'response'
        result.success = true;
        // [APPEND] Use 'A' to append: .message = 'Login successful';
        result
        result.token = token;

    } catch (error) {
        // [INSERT] Use 'I' to add proper indentation
    result.message = error.message;
    }

    // [INSERT] Use 'i' to insert 'return ' before 'result'
    result;
}

// [REPLACE] Use 'S' to substitute with proper const declaration:
let userPreferences = {
    // [INSERT] Use 'o' to add: theme: 'dark',
    language: 'en'
    // [APPEND] Use 'a' to append comma after 'en'
};

// [CHANGE] Use 'C' to change from 'function' to end with arrow function:
function validateUserInput(input) {
    // [REPLACE] Use 'r' to replace 'i' with 'I' in 'Input'
    if (!input || typeof input !== 'object') {
        // [INSERT] Use 'i' to insert 'return ' before 'false'
        false;
    }

    // [INSERT] Use 'o' to add new line: const requiredFields = ['username', 'password'];

    // [CHANGE] Use 'cw' to change 'for' to 'forEach'
    for (const field of requiredFields) {
        if (!input[field]) {
            // [INSERT] Use 'i' to insert 'return ' before 'false'
            false;
        }
    }

    // [INSERT] Use 'i' to insert 'return ' before 'true'
    true;
}

// [INSERT] Use 'O' to add export statement above:
const API_ROUTES = {
    // [INSERT] Use 'i' to insert missing quote before 'api'
    login: /api/v1/auth/login',
    // [REPLACE] Use 'r' to replace '/' with "'" at the end
    logout: '/api/v1/auth/logout/,
    // [APPEND] Use 'A' to append missing quote and comma
    refresh: '/api/v1/auth/refresh
};

// [CHANGE] Use 'S' to substitute with proper async function:
function makeApiRequest(url, method, data) {
    // [INSERT] Use 'I' to add 'const ' at beginning
    options = {
        method: method,
        headers: {
            // [INSERT] Use 'o' to add: 'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    // [INSERT] Use 'o' to add conditional for data:
    // if (data) {
    //     options.body = JSON.stringify(data);
    // }

    // [CHANGE] Use 'C' to change from 'fetch' to proper return:
    fetch(url, options);
}

/**
 * [PRACTICE SUMMARY]
 *
 * Complete these editing tasks:
 * 1. Fix all syntax errors using appropriate insert/append commands
 * 2. Add missing variable declarations using 'I' and 'i'
 * 3. Complete incomplete statements using 'A' and 'a'
 * 4. Fix typos using 'r' for single characters
 * 5. Replace entire words/lines using 'R', 's', 'S'
 * 6. Change code structures using 'c' with motions
 * 7. Add new lines and methods using 'o' and 'O'
 *
 * [INSERTION PRACTICE CHECKLIST]
 * □ Used 'i' to insert before cursor
 * □ Used 'I' to insert at beginning of line
 * □ Used 'a' to append after cursor
 * □ Used 'A' to append at end of line
 * □ Used 'o' to open line below
 * □ Used 'O' to open line above
 * □ Used 'r' to replace single character
 * □ Used 'R' to enter replace mode
 * □ Used 's' to substitute character
 * □ Used 'S' to substitute entire line
 * □ Used 'c' with motions to change text
 * □ Used 'C' to change to end of line
 */