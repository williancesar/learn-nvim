// User model for validation
// Referenced by router.js and db.js

class User {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    validate() {
        const errors = [];

        // Name validation
        if (!this.name || this.name.length < 2) {
            errors.push('Name must be at least 2 characters');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email || !emailRegex.test(this.email)) {
            errors.push('Valid email is required');
        }

        // Password validation (for new users)
        if (!this.id && (!this.password || this.password.length < 8)) {
            errors.push('Password must be at least 8 characters');
        }

        return errors;
    }

    toJSON() {
        // Return safe representation (no password)
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromDatabase(row) {
        // Create instance from database row
        return new User({
            id: row.id,
            name: row.name,
            email: row.email,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        });
    }
}

module.exports = User;