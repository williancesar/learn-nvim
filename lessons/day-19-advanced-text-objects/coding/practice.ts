/**
 * TypeScript Practice: Advanced Text Objects
 *
 * This file contains TypeScript code designed for practicing advanced text objects
 * including function calls (if, af), class methods (im, am), and custom text objects.
 *
 * Focus on selecting entire functions, methods, and complex code blocks.
 */

import { EventEmitter } from 'events';
import { createHash } from 'crypto';
import { readFile, writeFile } from 'fs/promises';

// Advanced type system demonstrating complex text objects
namespace DatabaseLayer {
  export interface ConnectionPool<T extends DatabaseConnection> {
    acquire(): Promise<T>;
    release(connection: T): Promise<void>;
    destroy(connection: T): Promise<void>;
    clear(): Promise<void>;
    size(): number;
    available(): number;
  }

  export abstract class DatabaseConnection {
    protected abstract connectionString: string;
    protected abstract isConnected: boolean;

    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract query<T>(sql: string, params?: any[]): Promise<T[]>;
    abstract transaction<T>(callback: (trx: TransactionContext) => Promise<T>): Promise<T>;

    protected validateConnection(): void {
      if (!this.isConnected) {
        throw new Error('Database connection is not established');
      }
    }

    protected createQueryContext(sql: string, params?: any[]): QueryContext {
      return {
        sql,
        params: params || [],
        timestamp: new Date(),
        id: this.generateQueryId()
      };
    }

    private generateQueryId(): string {
      return createHash('md5')
        .update(`${Date.now()}-${Math.random()}`)
        .digest('hex')
        .substring(0, 8);
    }
  }

  export interface TransactionContext {
    query<T>(sql: string, params?: any[]): Promise<T[]>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
  }

  export interface QueryContext {
    sql: string;
    params: any[];
    timestamp: Date;
    id: string;
  }
}

// Service layer with complex method definitions
abstract class BaseService<TEntity, TRepository extends Repository<TEntity>> extends EventEmitter {
  protected repository: TRepository;
  protected logger: Logger;
  protected cache: CacheService;

  constructor(repository: TRepository, logger: Logger, cache: CacheService) {
    super();
    this.repository = repository;
    this.logger = logger;
    this.cache = cache;
  }

  async findById(id: string): Promise<TEntity | null> {
    this.logger.debug('Finding entity by ID', { entityId: id });

    const cacheKey = this.buildCacheKey('findById', id);
    const cached = await this.cache.get<TEntity>(cacheKey);

    if (cached) {
      this.logger.debug('Entity found in cache', { entityId: id });
      return cached;
    }

    const entity = await this.repository.findById(id);

    if (entity) {
      await this.cache.set(cacheKey, entity, this.getCacheTtl());
      this.emit('entityFound', { id, entity });
    }

    return entity;
  }

  async create(data: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TEntity> {
    this.logger.info('Creating new entity', { data });

    await this.validateCreateData(data);

    const entity = await this.repository.create(data);

    await this.invalidateRelatedCache(entity);

    this.emit('entityCreated', { entity });
    this.logger.info('Entity created successfully', { entityId: (entity as any).id });

    return entity;
  }

  async update(id: string, data: Partial<TEntity>): Promise<TEntity> {
    this.logger.info('Updating entity', { entityId: id, data });

    const existingEntity = await this.findById(id);
    if (!existingEntity) {
      throw new Error(`Entity with id ${id} not found`);
    }

    await this.validateUpdateData(data, existingEntity);

    const updatedEntity = await this.repository.update(id, data);

    await this.invalidateRelatedCache(updatedEntity);

    this.emit('entityUpdated', { id, entity: updatedEntity, previousEntity: existingEntity });
    this.logger.info('Entity updated successfully', { entityId: id });

    return updatedEntity;
  }

  async delete(id: string): Promise<boolean> {
    this.logger.info('Deleting entity', { entityId: id });

    const existingEntity = await this.findById(id);
    if (!existingEntity) {
      this.logger.warn('Entity not found for deletion', { entityId: id });
      return false;
    }

    const deleted = await this.repository.delete(id);

    if (deleted) {
      await this.invalidateRelatedCache(existingEntity);
      this.emit('entityDeleted', { id, entity: existingEntity });
      this.logger.info('Entity deleted successfully', { entityId: id });
    }

    return deleted;
  }

  protected abstract validateCreateData(data: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<void>;
  protected abstract validateUpdateData(data: Partial<TEntity>, existing: TEntity): Promise<void>;
  protected abstract getCacheTtl(): number;

  protected buildCacheKey(operation: string, ...args: any[]): string {
    const argsHash = createHash('md5')
      .update(JSON.stringify(args))
      .digest('hex')
      .substring(0, 8);

    return `${this.constructor.name}:${operation}:${argsHash}`;
  }

  protected async invalidateRelatedCache(entity: TEntity): Promise<void> {
    const patterns = this.getCacheInvalidationPatterns(entity);

    for (const pattern of patterns) {
      await this.cache.deletePattern(pattern);
    }
  }

  protected getCacheInvalidationPatterns(entity: TEntity): string[] {
    return [`${this.constructor.name}:*`];
  }
}

// Concrete service implementation with complex methods
class UserService extends BaseService<User, UserRepository> {
  private emailService: EmailService;
  private passwordHasher: PasswordHasher;

  constructor(
    repository: UserRepository,
    logger: Logger,
    cache: CacheService,
    emailService: EmailService,
    passwordHasher: PasswordHasher
  ) {
    super(repository, logger, cache);
    this.emailService = emailService;
    this.passwordHasher = passwordHasher;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    this.logger.info('Creating new user', { email: userData.email, username: userData.username });

    await this.validateUserCreation(userData);

    const hashedPassword = await this.passwordHasher.hash(userData.password);

    const user = await this.create({
      ...userData,
      password: hashedPassword,
      emailVerified: false,
      status: UserStatus.PENDING
    } as any);

    await this.sendVerificationEmail(user);

    return user;
  }

  async authenticateUser(email: string, password: string): Promise<AuthenticationResult> {
    this.logger.info('Authenticating user', { email });

    const user = await this.repository.findByEmail(email);
    if (!user) {
      this.logger.warn('Authentication failed - user not found', { email });
      return { success: false, error: 'Invalid credentials' };
    }

    if (user.status !== UserStatus.ACTIVE) {
      this.logger.warn('Authentication failed - user not active', { email, status: user.status });
      return { success: false, error: 'Account is not active' };
    }

    const isPasswordValid = await this.passwordHasher.verify(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn('Authentication failed - invalid password', { email });
      await this.incrementFailedLoginAttempts(user.id);
      return { success: false, error: 'Invalid credentials' };
    }

    await this.updateLastLoginTime(user.id);
    await this.resetFailedLoginAttempts(user.id);

    this.logger.info('User authenticated successfully', { userId: user.id, email });

    return {
      success: true,
      user,
      token: await this.generateAuthToken(user)
    };
  }

  async verifyEmail(token: string): Promise<boolean> {
    this.logger.info('Verifying email', { token });

    const tokenData = await this.parseVerificationToken(token);
    if (!tokenData || !tokenData.userId) {
      this.logger.warn('Invalid verification token', { token });
      return false;
    }

    const user = await this.findById(tokenData.userId);
    if (!user) {
      this.logger.warn('User not found for email verification', { userId: tokenData.userId });
      return false;
    }

    if (user.emailVerified) {
      this.logger.info('Email already verified', { userId: user.id });
      return true;
    }

    await this.update(user.id, {
      emailVerified: true,
      status: UserStatus.ACTIVE
    } as any);

    this.logger.info('Email verified successfully', { userId: user.id });

    return true;
  }

  async resetPassword(email: string): Promise<boolean> {
    this.logger.info('Password reset requested', { email });

    const user = await this.repository.findByEmail(email);
    if (!user) {
      this.logger.warn('Password reset requested for non-existent user', { email });
      return false;
    }

    const resetToken = await this.generatePasswordResetToken(user);
    await this.sendPasswordResetEmail(user, resetToken);

    this.logger.info('Password reset email sent', { userId: user.id, email });

    return true;
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    this.logger.info('Updating password', { userId });

    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await this.passwordHasher.verify(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      this.logger.warn('Password update failed - invalid current password', { userId });
      return false;
    }

    const hashedNewPassword = await this.passwordHasher.hash(newPassword);

    await this.update(userId, {
      password: hashedNewPassword
    } as any);

    this.logger.info('Password updated successfully', { userId });

    return true;
  }

  protected async validateCreateData(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    if (!data.email || !this.isValidEmail(data.email)) {
      throw new Error('Valid email is required');
    }

    if (!data.username || data.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    const existingUserByEmail = await this.repository.findByEmail(data.email);
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }

    const existingUserByUsername = await this.repository.findByUsername(data.username);
    if (existingUserByUsername) {
      throw new Error('Username already exists');
    }
  }

  protected async validateUpdateData(data: Partial<User>, existing: User): Promise<void> {
    if (data.email && data.email !== existing.email) {
      if (!this.isValidEmail(data.email)) {
        throw new Error('Valid email is required');
      }

      const existingUserByEmail = await this.repository.findByEmail(data.email);
      if (existingUserByEmail && existingUserByEmail.id !== existing.id) {
        throw new Error('Email already exists');
      }
    }

    if (data.username && data.username !== existing.username) {
      if (data.username.length < 3) {
        throw new Error('Username must be at least 3 characters long');
      }

      const existingUserByUsername = await this.repository.findByUsername(data.username);
      if (existingUserByUsername && existingUserByUsername.id !== existing.id) {
        throw new Error('Username already exists');
      }
    }
  }

  protected getCacheTtl(): number {
    return 3600; // 1 hour
  }

  private async validateUserCreation(userData: CreateUserRequest): Promise<void> {
    if (!userData.password || userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!this.hasUpperCase(userData.password)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (!this.hasLowerCase(userData.password)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (!this.hasNumber(userData.password)) {
      throw new Error('Password must contain at least one number');
    }

    if (!this.hasSpecialCharacter(userData.password)) {
      throw new Error('Password must contain at least one special character');
    }
  }

  private async sendVerificationEmail(user: User): Promise<void> {
    const verificationToken = await this.generateVerificationToken(user);
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;

    await this.emailService.send({
      to: user.email,
      subject: 'Please verify your email address',
      template: 'email-verification',
      data: {
        username: user.username,
        verificationUrl
      }
    });
  }

  private async sendPasswordResetEmail(user: User, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    await this.emailService.send({
      to: user.email,
      subject: 'Password reset request',
      template: 'password-reset',
      data: {
        username: user.username,
        resetUrl
      }
    });
  }

  private async generateVerificationToken(user: User): Promise<string> {
    const payload = {
      userId: user.id,
      email: user.email,
      type: 'email-verification',
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    return this.signToken(payload);
  }

  private async generatePasswordResetToken(user: User): Promise<string> {
    const payload = {
      userId: user.id,
      email: user.email,
      type: 'password-reset',
      expiresAt: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
    };

    return this.signToken(payload);
  }

  private async generateAuthToken(user: User): Promise<string> {
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      type: 'authentication',
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    };

    return this.signToken(payload);
  }

  private async signToken(payload: any): Promise<string> {
    // This would normally use JWT or similar
    const tokenData = JSON.stringify(payload);
    return Buffer.from(tokenData).toString('base64');
  }

  private async parseVerificationToken(token: string): Promise<any | null> {
    try {
      const tokenData = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(tokenData);

      if (payload.expiresAt < Date.now()) {
        return null;
      }

      return payload;
    } catch (error) {
      return null;
    }
  }

  private async incrementFailedLoginAttempts(userId: string): Promise<void> {
    // Implementation would track failed login attempts
    this.logger.warn('Failed login attempt recorded', { userId });
  }

  private async resetFailedLoginAttempts(userId: string): Promise<void> {
    // Implementation would reset failed login attempts
    this.logger.debug('Failed login attempts reset', { userId });
  }

  private async updateLastLoginTime(userId: string): Promise<void> {
    await this.update(userId, {
      lastLoginAt: new Date()
    } as any);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private hasUpperCase(str: string): boolean {
    return /[A-Z]/.test(str);
  }

  private hasLowerCase(str: string): boolean {
    return /[a-z]/.test(str);
  }

  private hasNumber(str: string): boolean {
    return /[0-9]/.test(str);
  }

  private hasSpecialCharacter(str: string): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
  }
}

// Supporting interfaces and types
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
}

interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  emailVerified: boolean;
  status: UserStatus;
  role: UserRole;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthenticationResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface Logger {
  debug(message: string, meta?: object): void;
  info(message: string, meta?: object): void;
  warn(message: string, meta?: object): void;
  error(message: string, meta?: object): void;
}

interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  deletePattern(pattern: string): Promise<void>;
}

interface EmailService {
  send(options: EmailOptions): Promise<void>;
}

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export {
  BaseService,
  UserService,
  type Repository,
  type UserRepository,
  type User,
  type CreateUserRequest,
  type AuthenticationResult,
  UserStatus,
  UserRole,
  DatabaseLayer
};