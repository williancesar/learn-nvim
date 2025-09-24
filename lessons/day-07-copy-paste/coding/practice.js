/**
 * Day 07 - Copy & Paste Practice File
 * Focus: y, yy, Y, p, P, yw, y$, y0
 *
 * COPY (YANK) COMMANDS:
 * y = yank (copy) with motion
 * yy = yank entire line
 * Y = yank to end of line (same as y$)
 * yw = yank word
 * y$ = yank to end of line
 * y0 = yank to beginning of line
 *
 * PASTE COMMANDS:
 * p = paste after cursor/below line
 * P = paste before cursor/above line
 *
 * PRACTICE: Copy code sections and create duplicates/templates
 */

/**
 * COPY PRACTICE SECTION 1: Basic User Entity
 * Copy this User class and paste it below to create an Admin class
 */
class User {
    constructor(id, username, email) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.createdAt = new Date();
        this.isActive = true;
    }

    getProfile() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            createdAt: this.createdAt
        };
    }

    updateEmail(newEmail) {
        this.email = newEmail;
        this.updatedAt = new Date();
    }

    deactivate() {
        this.isActive = false;
        this.deactivatedAt = new Date();
    }
}

// PRACTICE: Copy the User class above using yy (on class line) then navigate and use p
// Modify the pasted class to create an Admin class with additional properties

/**
 * COPY PRACTICE SECTION 2: API Endpoint Templates
 * Copy these endpoint functions and create variations
 */

// Copy this function and paste to create getUserById, updateUser, deleteUser
async function createUser(userData) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

// PRACTICE INSTRUCTIONS:
// 1. Copy the createUser function (yy on function line, then multiple yy for full function)
// 2. Paste below (p) and modify to create getUserById
// 3. Copy and paste again to create updateUser (change method to PUT)
// 4. Copy and paste again to create deleteUser (change method to DELETE)

/**
 * COPY PRACTICE SECTION 3: Validation Functions
 * Copy and modify these validation functions for different data types
 */

// Copy this validation function template
function validateUserData(userData) {
    const errors = [];

    if (!userData.username || userData.username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }

    if (!userData.email || !isValidEmail(userData.email)) {
        errors.push('Valid email is required');
    }

    if (!userData.password || userData.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// PRACTICE: Copy validateUserData and create validatePostData, validateCommentData

/**
 * COPY PRACTICE SECTION 4: Database Models
 * Copy these model definitions and create similar ones
 */

const UserModel = {
    tableName: 'users',

    columns: {
        id: 'INTEGER PRIMARY KEY',
        username: 'VARCHAR(50) UNIQUE NOT NULL',
        email: 'VARCHAR(100) UNIQUE NOT NULL',
        password: 'VARCHAR(255) NOT NULL',
        created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
    },

    create: async function(userData) {
        const query = `INSERT INTO ${this.tableName} (username, email, password) VALUES (?, ?, ?)`;
        return await db.execute(query, [userData.username, userData.email, userData.password]);
    },

    findById: async function(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
        return await db.queryOne(query, [id]);
    },

    findByEmail: async function(email) {
        const query = `SELECT * FROM ${this.tableName} WHERE email = ?`;
        return await db.queryOne(query, [email]);
    },

    update: async function(id, updates) {
        const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const query = `UPDATE ${this.tableName} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        return await db.execute(query, [...Object.values(updates), id]);
    }
};

// PRACTICE: Copy UserModel and create PostModel, CommentModel with similar structure
// Change tableName and columns appropriately

/**
 * COPY PRACTICE SECTION 5: Error Handling Utilities
 * Copy these error classes and create specific error types
 */

class BaseError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            timestamp: this.timestamp
        };
    }
}

// PRACTICE: Copy BaseError class and create ValidationError, AuthenticationError, NotFoundError
// Modify constructor to set appropriate default status codes (400, 401, 404)

/**
 * COPY PRACTICE SECTION 6: Middleware Functions
 * Copy this authentication middleware and create similar ones
 */

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            error: 'Authentication token required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Invalid or expired token'
        });
    }
};

// PRACTICE: Copy authMiddleware and create:
// - adminMiddleware (check if user.role === 'admin')
// - rateLimitMiddleware (implement rate limiting logic)
// - validationMiddleware (validate request body)

/**
 * COPY PRACTICE SECTION 7: Configuration Objects
 * Copy these config objects and create environment-specific versions
 */

const developmentConfig = {
    database: {
        host: 'localhost',
        port: 5432,
        username: 'dev_user',
        password: 'dev_password',
        database: 'myapp_dev'
    },
    redis: {
        host: 'localhost',
        port: 6379,
        password: null
    },
    logging: {
        level: 'debug',
        enableConsole: true,
        enableFile: false
    },
    features: {
        enableEmailVerification: false,
        enableTwoFactorAuth: false,
        enableAnalytics: false
    }
};

// PRACTICE: Copy developmentConfig and create productionConfig, testConfig
// Modify values appropriately for each environment

/**
 * COPY PRACTICE SECTION 8: Route Handlers
 * Copy this route pattern and create full CRUD operations
 */

// Copy this route handler pattern
app.get('/api/users/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// PRACTICE: Copy the route handler and create:
// - POST /api/users (create user)
// - PUT /api/users/:id (update user)
// - DELETE /api/users/:id (delete user)
// - GET /api/users (list users with pagination)

/**
 * COPY PRACTICE SECTION 9: Test Cases
 * Copy this test structure and create comprehensive test suite
 */

describe('User Service', () => {
    let userService;
    let mockUser;

    beforeEach(() => {
        userService = new UserService();
        mockUser = {
            id: 1,
            username: 'testuser',
            email: 'test@example.com'
        };
    });

    it('should create a new user successfully', async () => {
        // Arrange
        const userData = {
            username: 'newuser',
            email: 'new@example.com',
            password: 'password123'
        };

        // Act
        const result = await userService.createUser(userData);

        // Assert
        expect(result).toBeDefined();
        expect(result.username).toBe(userData.username);
        expect(result.email).toBe(userData.email);
    });
});

// PRACTICE: Copy the test structure and create tests for:
// - getUserById
// - updateUser
// - deleteUser
// - validateUserData
// Copy the individual test case and create negative test cases

/**
 * COPY & PASTE PRACTICE CHECKLIST:
 *
 * Line Operations:
 * □ Used 'yy' to copy entire lines
 * □ Used 'Y' to copy to end of line
 * □ Used 'p' to paste below/after
 * □ Used 'P' to paste above/before
 *
 * Word/Motion Operations:
 * □ Used 'yw' to copy words
 * □ Used 'y$' to copy to end of line
 * □ Used 'y0' to copy to beginning of line
 * □ Used 'y' with motions (y2w, y3j, etc.)
 *
 * Practical Applications:
 * □ Copied and modified class definitions
 * □ Copied function templates and created variations
 * □ Copied configuration objects for different environments
 * □ Copied test cases and created comprehensive test suites
 * □ Copied route handlers and built CRUD operations
 * □ Copied error classes and created specific error types
 *
 * ADVANCED PRACTICE:
 * 1. Copy entire functions and modify for different use cases
 * 2. Copy object structures and adapt for different data models
 * 3. Copy middleware patterns and create specialized versions
 * 4. Copy configuration templates for different environments
 * 5. Copy test patterns and create comprehensive test coverage
 */