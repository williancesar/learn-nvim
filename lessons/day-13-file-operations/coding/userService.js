/**
 * USER SERVICE MODULE
 * ===================
 *
 * This file is part of the Day 13 file operations practice.
 * Practice opening this file from main.js using :e userService.js
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * User Service Class
 * Practice: Open main.js in a split to see how this is used
 */
export class UserService {
    constructor() {
        this.users = new Map();
        this.sessions = new Map();
        this.config = null;
        this.running = false;
    }

    /**
     * Initialize the user service
     * Practice: Open config.json to verify database settings
     */
    async initialize(databaseConfig) {
        try {
            this.config = databaseConfig;

            // Connect to database
            // Practice: Create database.js with :e database.js
            console.log('Connecting to user database...');

            // Load existing users
            await this.loadUsers();

            console.log('UserService initialized');
            return true;

        } catch (error) {
            console.error('UserService initialization failed:', error);
            throw error;
        }
    }

    /**
     * Start the user service
     * Practice: Use :b main.js to switch back to main file
     */
    async start() {
        if (!this.config) {
            throw new Error('UserService not initialized');
        }

        this.running = true;
        console.log('UserService started');
    }

    /**
     * Create a new user
     * Practice: Open validation.js with :tabnew validation.js to create validation rules
     */
    async createUser(userData) {
        const { username, email, password, profile } = userData;

        // Validate input
        // Practice: Create validators/userValidator.js with :e validators/userValidator.js
        if (!username || !email || !password) {
            throw new Error('Missing required fields');
        }

        // Check if user exists
        if (this.users.has(username)) {
            throw new Error('User already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user object
        const user = {
            id: this.generateUserId(),
            username,
            email,
            password: hashedPassword,
            profile: profile || {},
            createdAt: new Date(),
            lastLogin: null,
            active: true
        };

        // Save user
        this.users.set(username, user);

        // Practice: Create audit.log with :e audit.log
        console.log(`User created: ${username}`);

        return { ...user, password: undefined }; // Don't return password
    }

    /**
     * Authenticate user
     * Practice: Open auth.js in vertical split with :vsplit auth.js
     */
    async authenticateUser(username, password) {
        const user = this.users.get(username);

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.active) {
            throw new Error('User account is disabled');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            // Practice: Log to security.log with :e security.log
            throw new Error('Invalid credentials');
        }

        // Update last login
        user.lastLogin = new Date();

        // Generate session token
        // Practice: Create tokens.js with :e tokens.js
        const token = this.generateSessionToken(user);

        // Store session
        this.sessions.set(token, {
            userId: user.id,
            username: user.username,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        });

        return {
            user: { ...user, password: undefined },
            token
        };
    }

    /**
     * Get user by username
     * Practice: Navigate between files using :bn and :bp
     */
    async getUserByUsername(username) {
        const user = this.users.get(username);

        if (!user) {
            return null;
        }

        return { ...user, password: undefined };
    }

    /**
     * Get user by ID
     * Practice: Open utils.js with :e utils.js to create helper functions
     */
    async getUserById(userId) {
        for (const user of this.users.values()) {
            if (user.id === userId) {
                return { ...user, password: undefined };
            }
        }

        return null;
    }

    /**
     * Update user profile
     * Practice: Create profile.js with :tabnew profile.js
     */
    async updateUserProfile(username, profileUpdates) {
        const user = this.users.get(username);

        if (!user) {
            throw new Error('User not found');
        }

        // Merge profile updates
        user.profile = {
            ...user.profile,
            ...profileUpdates,
            updatedAt: new Date()
        };

        // Practice: Save changes and switch to main.js with :w then :b main.js
        console.log(`Profile updated for user: ${username}`);

        return { ...user, password: undefined };
    }

    /**
     * Change user password
     * Practice: Open security/passwordPolicy.js with :e security/passwordPolicy.js
     */
    async changePassword(username, currentPassword, newPassword) {
        const user = this.users.get(username);

        if (!user) {
            throw new Error('User not found');
        }

        // Verify current password
        const isCurrentValid = await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentValid) {
            throw new Error('Current password is incorrect');
        }

        // Validate new password
        // Practice: Create password validation in security/passwordValidator.js
        if (newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        // Hash new password
        const saltRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);

        // Practice: Log password change to audit.log
        console.log(`Password changed for user: ${username}`);

        return true;
    }

    /**
     * Validate session token
     * Practice: Open sessions.js in a split with :split sessions.js
     */
    async validateSession(token) {
        const session = this.sessions.get(token);

        if (!session) {
            return null;
        }

        // Check if session is expired
        if (new Date() > session.expiresAt) {
            this.sessions.delete(token);
            return null;
        }

        // Get user data
        const user = await this.getUserById(session.userId);

        return user;
    }

    /**
     * Logout user (invalidate session)
     * Practice: Use :wa to save all files before testing
     */
    async logout(token) {
        const session = this.sessions.get(token);

        if (session) {
            this.sessions.delete(token);
            // Practice: Log logout to audit.log
            console.log(`User logged out: ${session.username}`);
            return true;
        }

        return false;
    }

    /**
     * Get all users (admin only)
     * Practice: Create admin.js with :e admin.js for admin functions
     */
    async getAllUsers() {
        const users = Array.from(this.users.values()).map(user => ({
            ...user,
            password: undefined
        }));

        return users;
    }

    /**
     * Deactivate user account
     * Practice: Open main.js and navigate back with :b#
     */
    async deactivateUser(username) {
        const user = this.users.get(username);

        if (!user) {
            throw new Error('User not found');
        }

        user.active = false;
        user.deactivatedAt = new Date();

        // Invalidate all sessions for this user
        for (const [token, session] of this.sessions.entries()) {
            if (session.username === username) {
                this.sessions.delete(token);
            }
        }

        console.log(`User deactivated: ${username}`);
        return true;
    }

    /**
     * Validate users batch
     * Practice: This method is called from main.js - check the connection
     */
    async validateUsers(users) {
        const validUsers = [];

        for (const userData of users) {
            try {
                // Validate required fields
                if (!userData.username || !userData.email) {
                    continue;
                }

                // Check email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(userData.email)) {
                    continue;
                }

                validUsers.push(userData);

            } catch (error) {
                console.error('User validation failed:', error);
            }
        }

        return validUsers;
    }

    /**
     * Load users from storage
     * Practice: Create storage.js with :e storage.js
     */
    async loadUsers() {
        // In a real app, this would load from database
        console.log('Loading users from database...');

        // Mock some initial users for testing
        const mockUsers = [
            {
                username: 'admin',
                email: 'admin@example.com',
                password: 'hashedpassword123',
                profile: { role: 'admin' }
            },
            {
                username: 'user1',
                email: 'user1@example.com',
                password: 'hashedpassword456',
                profile: { role: 'user' }
            }
        ];

        // Practice: Save this data to users.json with :e users.json
        for (const userData of mockUsers) {
            const user = {
                id: this.generateUserId(),
                ...userData,
                createdAt: new Date(),
                lastLogin: null,
                active: true
            };

            this.users.set(user.username, user);
        }

        console.log(`Loaded ${this.users.size} users`);
    }

    /**
     * Generate unique user ID
     * Practice: Open helpers/idGenerator.js with :e helpers/idGenerator.js
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate session token
     * Practice: Create security/tokenGenerator.js with :tabnew security/tokenGenerator.js
     */
    generateSessionToken(user) {
        const payload = {
            userId: user.id,
            username: user.username,
            iat: Date.now()
        };

        // In a real app, use a proper secret
        return jwt.sign(payload, 'your-secret-key', { expiresIn: '24h' });
    }

    /**
     * Check if service is running
     * Practice: This is called from main.js health check
     */
    isRunning() {
        return this.running;
    }

    /**
     * Stop the user service
     * Practice: Called from main.js shutdown - use :b main.js to verify
     */
    async stop() {
        this.running = false;

        // Clear sessions
        this.sessions.clear();

        console.log('UserService stopped');
    }

    /**
     * Get service statistics
     * Practice: Create stats.js with :e stats.js for detailed statistics
     */
    getStats() {
        return {
            totalUsers: this.users.size,
            activeSessions: this.sessions.size,
            activeUsers: Array.from(this.users.values()).filter(u => u.active).length,
            running: this.running
        };
    }
}

/**
 * PRACTICE EXERCISES SPECIFIC TO THIS FILE:
 *
 * 1. Navigate from main.js to this file:
 *    - From main.js, use :e userService.js
 *    - Or use :split userService.js for horizontal split
 *    - Or use :vsplit userService.js for vertical split
 *
 * 2. Create related files referenced in comments:
 *    - :e database.js (database connection)
 *    - :e validation.js (validation utilities)
 *    - :e audit.log (audit logging)
 *    - :e security.log (security logging)
 *    - :tabnew security/passwordValidator.js
 *
 * 3. Buffer management while editing:
 *    - Open main.js and userService.js in tabs
 *    - Use :bn/:bp to switch between them
 *    - Use :b# to alternate between files
 *    - Use :ls to see all open buffers
 *
 * 4. Save and test workflow:
 *    - Make changes to methods
 *    - Use :w to save
 *    - Use :wa to save all files
 *    - Test by running main.js
 */