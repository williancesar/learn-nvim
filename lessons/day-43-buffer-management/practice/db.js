// Database connection and queries
// Navigate here from router.js and main.js

const { Pool } = require('pg');

class Database {
    constructor(config) {
        // Reference config.json for settings
        this.config = config;
        this.pool = null;
    }

    async connect() {
        // Create connection pool
        this.pool = new Pool({
            host: this.config.host,
            port: this.config.port,
            database: this.config.name,
            max: this.config.pool.max,
            min: this.config.pool.min
        });

        // Test connection
        try {
            const client = await this.pool.connect();
            console.log('Database connected successfully');
            client.release();
        } catch (error) {
            console.error('Database connection failed:', error);
            // See error.js for error handling
            throw error;
        }
    }

    async query(text, params) {
        // Execute database query
        const start = Date.now();
        const res = await this.pool.query(text, params);
        const duration = Date.now() - start;

        // Log query for debugging (check config.json for log level)
        console.log('Executed query', { text, duration, rows: res.rowCount });

        return res;
    }

    async getUsers() {
        // Fetch all users - called from router.js
        const query = 'SELECT * FROM users ORDER BY created_at DESC';
        const result = await this.query(query);
        return result.rows;
    }

    async getUserById(id) {
        // Fetch single user
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await this.query(query, [id]);
        return result.rows[0];
    }

    async createUser(userData) {
        // Insert new user - validate with models/user.js first
        const { name, email, password } = userData;
        const query = `
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const result = await this.query(query, [name, email, password]);
        return result.rows[0];
    }

    async updateUser(id, updates) {
        // Update existing user
        const { name, email } = updates;
        const query = `
            UPDATE users
            SET name = $2, email = $3, updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;
        const result = await this.query(query, [id, name, email]);
        return result.rows[0];
    }

    async deleteUser(id) {
        // Remove user
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
        const result = await this.query(query, [id]);
        return result.rows[0];
    }

    async disconnect() {
        // Close connection pool
        await this.pool.end();
        console.log('Database disconnected');
    }
}

module.exports = Database;