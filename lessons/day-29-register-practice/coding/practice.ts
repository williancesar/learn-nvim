/**
 * Day 29: TypeScript Register Practice - Multiple Copy/Paste Scenarios
 *
 * This file contains various TypeScript constructs designed for practicing
 * vim register operations. Use named registers (a-z) to copy different
 * code blocks and paste them in various locations.
 *
 * Register Practice Objectives:
 * - Use "ay to copy into register 'a'
 * - Use "by to copy into register 'b'
 * - Use "ap to paste from register 'a'
 * - Practice copying method signatures, type definitions, and implementations separately
 */

// ========== UTILITY TYPES FOR COPYING ==========
// Copy these types into different registers for reuse

type Optional<T> = {
  [K in keyof T]?: T[K];
};

type Required<T> = {
  [K in keyof T]-?: T[K];
};

type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type Nullable<T> = T | null;

type NonNullable<T> = T extends null | undefined ? never : T;

// ========== INTERFACE DEFINITIONS TO COPY ==========
// Practice copying these interfaces to create variations

interface BaseUser {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminUser extends BaseUser {
  role: 'admin';
  permissions: string[];
  lastLogin?: Date;
}

interface RegularUser extends BaseUser {
  role: 'user';
  profile: UserProfile;
  preferences: UserPreferences;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

// ========== API RESPONSE TYPES TO DUPLICATE ==========
// Copy these response types and modify them for different endpoints

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface SearchResponse<T> extends PaginatedResponse<T> {
  query: string;
  filters: Record<string, unknown>;
  suggestions: string[];
}

// ========== METHOD SIGNATURES TO COPY ==========
// Practice copying method signatures separately from implementations

class UserService {
  // Copy this method signature to create similar CRUD methods
  async findById(id: string): Promise<BaseUser | null>;

  // Copy and modify for different entity types
  async findByEmail(email: string): Promise<BaseUser | null>;

  // Copy this pattern for batch operations
  async findByIds(ids: string[]): Promise<BaseUser[]>;

  // Copy for different creation patterns
  async create(userData: Omit<BaseUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<BaseUser>;

  // Copy for different update patterns
  async update(id: string, updates: Partial<BaseUser>): Promise<BaseUser>;

  // Copy for soft delete patterns
  async softDelete(id: string): Promise<boolean>;

  // Copy for hard delete patterns
  async hardDelete(id: string): Promise<boolean>;

  // Copy for search patterns
  async search(query: string, filters?: Record<string, unknown>): Promise<SearchResponse<BaseUser>>;
}

// ========== IMPLEMENTATIONS TO COPY ==========
// Practice copying implementations and modifying them

class UserRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<BaseUser | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw new Error('Failed to find user');
    }
  }

  async findByEmail(email: string): Promise<BaseUser | null> {
    try {
      const result = await this.db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Failed to find user');
    }
  }

  async create(userData: Omit<BaseUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<BaseUser> {
    const id = generateUUID();
    const now = new Date();

    try {
      const result = await this.db.query(
        'INSERT INTO users (id, email, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, userData.email, now, now]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}

// ========== GENERIC CLASSES TO COPY ==========
// Copy these generic patterns and adapt for different types

class Repository<T extends { id: string }> {
  constructor(protected tableName: string, protected db: Database) {}

  async findById(id: string): Promise<T | null> {
    const result = await this.db.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findAll(): Promise<T[]> {
    const result = await this.db.query(`SELECT * FROM ${this.tableName}`);
    return result.rows;
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    const id = generateUUID();
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map((_, i) => `$${i + 2}`).join(', ');
    const values = Object.values(data);

    const result = await this.db.query(
      `INSERT INTO ${this.tableName} (id, ${columns}) VALUES ($1, ${placeholders}) RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  }

  async update(id: string, updates: Partial<Omit<T, 'id'>>): Promise<T> {
    const setClause = Object.keys(updates)
      .map((key, i) => `${key} = $${i + 2}`)
      .join(', ');
    const values = Object.values(updates);

    const result = await this.db.query(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rowCount > 0;
  }
}

// ========== VALIDATION SCHEMAS TO COPY ==========
// Copy these validation patterns and modify for different entities

const UserValidationSchema = {
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format'
  },
  firstName: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50,
    message: 'First name must be 2-50 characters'
  },
  lastName: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 50,
    message: 'Last name must be 2-50 characters'
  },
  age: {
    required: false,
    type: 'number',
    min: 13,
    max: 120,
    message: 'Age must be between 13 and 120'
  }
};

// ========== ERROR HANDLING PATTERNS TO COPY ==========
// Copy these error patterns and adapt for different scenarios

class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends Error {
  constructor(message: string, public conflictingField: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

// ========== UTILITY FUNCTIONS TO COPY ==========
// Copy these utility functions and create variations

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateTime(date: Date): string {
  return date.toISOString();
}

function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// ========== TYPE GUARDS TO COPY ==========
// Copy these type guards and create variants for different types

function isAdminUser(user: BaseUser): user is AdminUser {
  return 'role' in user && user.role === 'admin';
}

function isRegularUser(user: BaseUser): user is RegularUser {
  return 'role' in user && user.role === 'user';
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

// ========== PRACTICE AREAS FOR REGISTER OPERATIONS ==========
// TODO: Copy the Repository class and rename it to ProductRepository
// TODO: Copy the UserValidationSchema and adapt it for Product validation
// TODO: Copy the error classes and create specific product-related errors
// TODO: Copy utility functions and modify them for product operations
// TODO: Copy type guards and create product-specific type guards