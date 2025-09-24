/**
 * TypeScript Practice: Paragraph Boundaries and Navigation
 *
 * This file demonstrates advanced TypeScript concepts with clear paragraph boundaries
 * for practicing paragraph motion commands ({ and }).
 *
 * Focus on navigating between logical code blocks using paragraph motions.
 */

// Type Definitions Section
type UserRole = 'admin' | 'user' | 'moderator' | 'guest';
type Status = 'active' | 'inactive' | 'pending' | 'suspended';

interface BaseUser {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}


// Advanced User Interface with Generics
interface ExtendedUser<T extends Record<string, unknown>> extends BaseUser {
  role: UserRole;
  status: Status;
  profile: T;
  preferences: UserPreferences;
  permissions: Permission[];
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
}


// Permission System Types
interface Permission {
  resource: string;
  actions: string[];
  conditions?: PermissionCondition[];
}

interface PermissionCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in' | 'contains';
  value: string | number | boolean | string[];
}


// Notification Configuration
interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  categories: {
    security: boolean;
    updates: boolean;
    marketing: boolean;
    reminders: boolean;
  };
}


// Service Layer Interfaces
interface UserService<T extends Record<string, unknown>> {
  createUser(data: Omit<ExtendedUser<T>, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExtendedUser<T>>;
  getUserById(id: string): Promise<ExtendedUser<T> | null>;
  updateUser(id: string, data: Partial<ExtendedUser<T>>): Promise<ExtendedUser<T>>;
  deleteUser(id: string): Promise<boolean>;
}

interface AuthenticationService {
  login(username: string, password: string): Promise<AuthResult>;
  logout(token: string): Promise<void>;
  refreshToken(token: string): Promise<string>;
  validateToken(token: string): Promise<boolean>;
}


// Authentication Types
interface AuthResult {
  success: boolean;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: ExtendedUser<any>;
  error?: AuthError;
}

interface AuthError {
  code: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'TOKEN_EXPIRED' | 'RATE_LIMITED';
  message: string;
  details?: Record<string, unknown>;
}


// Database Repository Pattern
abstract class BaseRepository<T, K = string> {
  protected abstract tableName: string;

  abstract findById(id: K): Promise<T | null>;
  abstract create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  abstract update(id: K, data: Partial<T>): Promise<T>;
  abstract delete(id: K): Promise<boolean>;

  protected buildQuery(conditions: Record<string, unknown>): string {
    const clauses = Object.entries(conditions)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key} = ?`);

    return clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
  }
}


// Concrete Repository Implementation
class UserRepository extends BaseRepository<ExtendedUser<any>, string> {
  protected tableName = 'users';

  async findById(id: string): Promise<ExtendedUser<any> | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const result = await this.executeQuery(query, [id]);
    return result.length > 0 ? this.mapToUser(result[0]) : null;
  }

  async create(data: Omit<ExtendedUser<any>, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExtendedUser<any>> {
    const id = this.generateId();
    const now = new Date();
    const user = { ...data, id, createdAt: now, updatedAt: now };

    const query = `INSERT INTO ${this.tableName} (${Object.keys(user).join(', ')}) VALUES (${Object.keys(user).map(() => '?').join(', ')})`;
    await this.executeQuery(query, Object.values(user));

    return user;
  }

  async update(id: string, data: Partial<ExtendedUser<any>>): Promise<ExtendedUser<any>> {
    const updateData = { ...data, updatedAt: new Date() };
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const query = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;

    await this.executeQuery(query, [...Object.values(updateData), id]);

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found after update`);
    }

    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.executeQuery(query, [id]);
    return result.affectedRows > 0;
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async executeQuery(query: string, params: any[]): Promise<any> {
    // Mock database execution
    console.log(`Executing query: ${query}`, params);
    return { affectedRows: 1, length: 1 };
  }

  private mapToUser(row: any): ExtendedUser<any> {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      role: row.role,
      status: row.status,
      profile: JSON.parse(row.profile || '{}'),
      preferences: JSON.parse(row.preferences || '{}'),
      permissions: JSON.parse(row.permissions || '[]'),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}


// Service Implementation
class UserServiceImpl<T extends Record<string, unknown>> implements UserService<T> {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: Omit<ExtendedUser<T>, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExtendedUser<T>> {
    this.validateUserData(data);
    return await this.userRepository.create(data);
  }

  async getUserById(id: string): Promise<ExtendedUser<T> | null> {
    if (!id) {
      throw new Error('User ID is required');
    }

    return await this.userRepository.findById(id);
  }

  async updateUser(id: string, data: Partial<ExtendedUser<T>>): Promise<ExtendedUser<T>> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    this.validateUpdateData(data);
    return await this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<boolean> {
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      return false;
    }

    return await this.userRepository.delete(id);
  }

  private validateUserData(data: Omit<ExtendedUser<T>, 'id' | 'createdAt' | 'updatedAt'>): void {
    if (!data.username || data.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Valid email address is required');
    }

    if (!['admin', 'user', 'moderator', 'guest'].includes(data.role)) {
      throw new Error('Invalid user role');
    }
  }

  private validateUpdateData(data: Partial<ExtendedUser<T>>): void {
    if (data.username && data.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (data.email && !this.isValidEmail(data.email)) {
      throw new Error('Valid email address is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}


// Export Configuration
export {
  type UserRole,
  type Status,
  type ExtendedUser,
  type UserPreferences,
  type Permission,
  type NotificationSettings,
  type UserService,
  type AuthenticationService,
  UserRepository,
  UserServiceImpl,
  BaseRepository,
};