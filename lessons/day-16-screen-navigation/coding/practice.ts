/**
 * TypeScript Practice: Long File Navigation
 *
 * This file contains extensive TypeScript code designed for practicing
 * screen navigation commands (Ctrl+F, Ctrl+B, Ctrl+D, Ctrl+U, H, M, L, gg, G).
 *
 * Navigate efficiently through this large codebase using Vim screen commands.
 */

import { EventEmitter } from 'events';
import { readFile, writeFile, mkdir, stat } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';

// ========================================
// CONFIGURATION TYPES AND INTERFACES
// ========================================

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  poolMin: number;
  poolMax: number;
  timeout: number;
  retries: number;
  backoffMultiplier: number;
}

interface CacheConfig {
  provider: 'redis' | 'memcached' | 'memory';
  host?: string;
  port?: number;
  password?: string;
  database?: number;
  keyPrefix: string;
  ttl: number;
  maxMemory?: string;
  evictionPolicy?: 'lru' | 'lfu' | 'random';
}

interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  format: 'json' | 'text' | 'structured';
  outputs: LogOutput[];
  rotation: {
    enabled: boolean;
    maxSize: string;
    maxFiles: number;
    maxAge: string;
  };
}

interface LogOutput {
  type: 'file' | 'console' | 'syslog' | 'webhook';
  destination?: string;
  level?: string;
  filter?: string[];
}

interface SecurityConfig {
  encryption: {
    algorithm: string;
    keySize: number;
    ivSize: number;
    saltSize: number;
  };
  jwt: {
    secret: string;
    algorithm: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
    expiresIn: string;
    issuer: string;
    audience: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
    standardHeaders: boolean;
    legacyHeaders: boolean;
  };
  cors: {
    origin: string | string[] | boolean;
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
    maxAge: number;
  };
}

// ========================================
// DATA TRANSFER OBJECTS
// ========================================

interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
  };
}

interface UpdateUserDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  preferences?: {
    newsletter?: boolean;
    notifications?: boolean;
    theme?: 'light' | 'dark';
    language?: string;
    timezone?: string;
  };
}

interface UserResponseDto {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
  };
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// DOMAIN ENTITIES
// ========================================

abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(id?: string) {
    this.id = id ?? this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public touch(): void {
    this.updatedAt = new Date();
  }
}

class User extends BaseEntity {
  public username: string;
  public email: string;
  private passwordHash: string;
  public firstName: string;
  public lastName: string;
  public dateOfBirth?: Date;
  public phoneNumber?: string;
  public address?: UserAddress;
  public preferences: UserPreferences;
  public role: UserRole;
  public status: UserStatus;
  public emailVerified: boolean;
  public phoneVerified: boolean;
  public lastLoginAt?: Date;

  constructor(data: CreateUserDto, passwordHash: string) {
    super();
    this.username = data.username;
    this.email = data.email;
    this.passwordHash = passwordHash;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dateOfBirth = data.dateOfBirth;
    this.phoneNumber = data.phoneNumber;
    this.address = data.address ? new UserAddress(data.address) : undefined;
    this.preferences = new UserPreferences(data.preferences);
    this.role = UserRole.USER;
    this.status = UserStatus.ACTIVE;
    this.emailVerified = false;
    this.phoneVerified = false;
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public updateProfile(data: UpdateUserDto): void {
    if (data.username) this.username = data.username;
    if (data.email) this.email = data.email;
    if (data.firstName) this.firstName = data.firstName;
    if (data.lastName) this.lastName = data.lastName;
    if (data.dateOfBirth !== undefined) this.dateOfBirth = data.dateOfBirth;
    if (data.phoneNumber !== undefined) this.phoneNumber = data.phoneNumber;

    if (data.address) {
      if (this.address) {
        this.address.update(data.address);
      } else {
        this.address = new UserAddress(data.address as any);
      }
    }

    if (data.preferences) {
      this.preferences.update(data.preferences);
    }

    this.touch();
  }

  public verifyEmail(): void {
    this.emailVerified = true;
    this.touch();
  }

  public verifyPhone(): void {
    this.phoneVerified = true;
    this.touch();
  }

  public updateLastLogin(): void {
    this.lastLoginAt = new Date();
    this.touch();
  }

  public suspend(): void {
    this.status = UserStatus.SUSPENDED;
    this.touch();
  }

  public activate(): void {
    this.status = UserStatus.ACTIVE;
    this.touch();
  }

  public deactivate(): void {
    this.status = UserStatus.INACTIVE;
    this.touch();
  }

  public changeRole(role: UserRole): void {
    this.role = role;
    this.touch();
  }

  public validatePassword(password: string): boolean {
    // This would normally use bcrypt or similar
    return this.passwordHash === this.hashPassword(password);
  }

  public changePassword(newPassword: string): void {
    this.passwordHash = this.hashPassword(newPassword);
    this.touch();
  }

  private hashPassword(password: string): string {
    // This would normally use bcrypt or similar
    return `hashed_${password}`;
  }

  public toResponseDto(): UserResponseDto {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      dateOfBirth: this.dateOfBirth,
      phoneNumber: this.phoneNumber,
      address: this.address?.toPlainObject(),
      preferences: this.preferences.toPlainObject(),
      role: this.role.toString(),
      status: this.status.toString() as 'active' | 'inactive' | 'suspended',
      emailVerified: this.emailVerified,
      phoneVerified: this.phoneVerified,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

class UserAddress {
  public street: string;
  public city: string;
  public state: string;
  public zipCode: string;
  public country: string;

  constructor(data: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) {
    this.street = data.street;
    this.city = data.city;
    this.state = data.state;
    this.zipCode = data.zipCode;
    this.country = data.country;
  }

  public update(data: Partial<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>): void {
    if (data.street) this.street = data.street;
    if (data.city) this.city = data.city;
    if (data.state) this.state = data.state;
    if (data.zipCode) this.zipCode = data.zipCode;
    if (data.country) this.country = data.country;
  }

  public toPlainObject() {
    return {
      street: this.street,
      city: this.city,
      state: this.state,
      zipCode: this.zipCode,
      country: this.country,
    };
  }
}

class UserPreferences {
  public newsletter: boolean;
  public notifications: boolean;
  public theme: 'light' | 'dark';
  public language: string;
  public timezone: string;

  constructor(data?: {
    newsletter?: boolean;
    notifications?: boolean;
    theme?: 'light' | 'dark';
    language?: string;
    timezone?: string;
  }) {
    this.newsletter = data?.newsletter ?? true;
    this.notifications = data?.notifications ?? true;
    this.theme = data?.theme ?? 'light';
    this.language = data?.language ?? 'en';
    this.timezone = data?.timezone ?? 'UTC';
  }

  public update(data: {
    newsletter?: boolean;
    notifications?: boolean;
    theme?: 'light' | 'dark';
    language?: string;
    timezone?: string;
  }): void {
    if (data.newsletter !== undefined) this.newsletter = data.newsletter;
    if (data.notifications !== undefined) this.notifications = data.notifications;
    if (data.theme) this.theme = data.theme;
    if (data.language) this.language = data.language;
    if (data.timezone) this.timezone = data.timezone;
  }

  public toPlainObject() {
    return {
      newsletter: this.newsletter,
      notifications: this.notifications,
      theme: this.theme,
      language: this.language,
      timezone: this.timezone,
    };
  }
}

enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest',
}

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

// ========================================
// REPOSITORY INTERFACES AND IMPLEMENTATIONS
// ========================================

interface Repository<T, K = string> {
  findById(id: K): Promise<T | null>;
  findAll(options?: FindOptions<T>): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: K, entity: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
  count(conditions?: Partial<T>): Promise<number>;
}

interface FindOptions<T> {
  where?: Partial<T>;
  orderBy?: Array<{
    field: keyof T;
    direction: 'ASC' | 'DESC';
  }>;
  limit?: number;
  offset?: number;
}

class InMemoryUserRepository implements Repository<User> {
  private users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? this.deepClone(user) : null;
  }

  async findAll(options?: FindOptions<User>): Promise<User[]> {
    let users = Array.from(this.users.values());

    if (options?.where) {
      users = users.filter(user => this.matchesConditions(user, options.where!));
    }

    if (options?.orderBy) {
      users.sort((a, b) => this.compareEntities(a, b, options.orderBy!));
    }

    if (options?.offset) {
      users = users.slice(options.offset);
    }

    if (options?.limit) {
      users = users.slice(0, options.limit);
    }

    return users.map(user => this.deepClone(user));
  }

  async create(user: User): Promise<User> {
    const clonedUser = this.deepClone(user);
    this.users.set(clonedUser.id, clonedUser);
    return this.deepClone(clonedUser);
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    Object.assign(user, updates);
    user.touch();

    return this.deepClone(user);
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async count(conditions?: Partial<User>): Promise<number> {
    if (!conditions) {
      return this.users.size;
    }

    return Array.from(this.users.values())
      .filter(user => this.matchesConditions(user, conditions))
      .length;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.email === email);
    return user ? this.deepClone(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.username === username);
    return user ? this.deepClone(user) : null;
  }

  private matchesConditions(entity: User, conditions: Partial<User>): boolean {
    return Object.entries(conditions).every(([key, value]) => {
      const entityValue = (entity as any)[key];
      return entityValue === value;
    });
  }

  private compareEntities(a: User, b: User, orderBy: Array<{ field: keyof User; direction: 'ASC' | 'DESC' }>): number {
    for (const { field, direction } of orderBy) {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue < bValue) return direction === 'ASC' ? -1 : 1;
      if (aValue > bValue) return direction === 'ASC' ? 1 : -1;
    }

    return 0;
  }

  private deepClone(obj: User): User {
    return JSON.parse(JSON.stringify(obj));
  }
}

// ========================================
// SERVICE LAYER
// ========================================

class UserService extends EventEmitter {
  constructor(
    private userRepository: InMemoryUserRepository,
    private logger: Logger,
    private cacheService: CacheService
  ) {
    super();
  }

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.info('Creating new user', { username: dto.username, email: dto.email });

    await this.validateUniqueConstraints(dto.username, dto.email);

    const passwordHash = this.hashPassword(dto.password);
    const user = new User(dto, passwordHash);

    const savedUser = await this.userRepository.create(user);

    await this.cacheService.set(`user:${savedUser.id}`, savedUser, 3600);

    this.emit('userCreated', savedUser);
    this.logger.info('User created successfully', { userId: savedUser.id });

    return savedUser.toResponseDto();
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    this.logger.debug('Fetching user by ID', { userId: id });

    const cachedUser = await this.cacheService.get<User>(`user:${id}`);
    if (cachedUser) {
      this.logger.debug('User found in cache', { userId: id });
      return cachedUser.toResponseDto();
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn('User not found', { userId: id });
      return null;
    }

    await this.cacheService.set(`user:${id}`, user, 3600);

    return user.toResponseDto();
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.info('Updating user', { userId: id });

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }

    if (dto.username && dto.username !== existingUser.username) {
      const usernameExists = await this.userRepository.findByUsername(dto.username);
      if (usernameExists) {
        throw new Error('Username already exists');
      }
    }

    if (dto.email && dto.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(dto.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    existingUser.updateProfile(dto);
    const updatedUser = await this.userRepository.update(id, existingUser);

    await this.cacheService.delete(`user:${id}`);

    this.emit('userUpdated', updatedUser);
    this.logger.info('User updated successfully', { userId: id });

    return updatedUser.toResponseDto();
  }

  async deleteUser(id: string): Promise<boolean> {
    this.logger.info('Deleting user', { userId: id });

    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn('User not found for deletion', { userId: id });
      return false;
    }

    const deleted = await this.userRepository.delete(id);

    if (deleted) {
      await this.cacheService.delete(`user:${id}`);
      this.emit('userDeleted', user);
      this.logger.info('User deleted successfully', { userId: id });
    }

    return deleted;
  }

  private async validateUniqueConstraints(username: string, email: string): Promise<void> {
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error('Username already exists');
    }

    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }
  }

  private hashPassword(password: string): string {
    // This would normally use bcrypt or similar
    return `hashed_${password}`;
  }
}

// ========================================
// SUPPORTING SERVICES
// ========================================

interface Logger {
  error(message: string, meta?: object): void;
  warn(message: string, meta?: object): void;
  info(message: string, meta?: object): void;
  debug(message: string, meta?: object): void;
  trace(message: string, meta?: object): void;
}

class ConsoleLogger implements Logger {
  constructor(private level: 'error' | 'warn' | 'info' | 'debug' | 'trace' = 'info') {}

  error(message: string, meta?: object): void {
    this.log('ERROR', message, meta);
  }

  warn(message: string, meta?: object): void {
    if (this.shouldLog('warn')) {
      this.log('WARN', message, meta);
    }
  }

  info(message: string, meta?: object): void {
    if (this.shouldLog('info')) {
      this.log('INFO', message, meta);
    }
  }

  debug(message: string, meta?: object): void {
    if (this.shouldLog('debug')) {
      this.log('DEBUG', message, meta);
    }
  }

  trace(message: string, meta?: object): void {
    if (this.shouldLog('trace')) {
      this.log('TRACE', message, meta);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['error', 'warn', 'info', 'debug', 'trace'];
    const currentIndex = levels.indexOf(this.level);
    const requestedIndex = levels.indexOf(level);
    return requestedIndex <= currentIndex;
  }

  private log(level: string, message: string, meta?: object): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta,
    };
    console.log(JSON.stringify(logEntry, null, 2));
  }
}

interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

class MemoryCacheService implements CacheService {
  private cache: Map<string, { value: any; expiresAt: number }> = new Map();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async set<T>(key: string, value: T, ttl: number = 3600): Promise<void> {
    const expiresAt = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

// ========================================
// EXPORT DECLARATIONS
// ========================================

export {
  type DatabaseConfig,
  type CacheConfig,
  type LoggingConfig,
  type SecurityConfig,
  type CreateUserDto,
  type UpdateUserDto,
  type UserResponseDto,
  User,
  UserAddress,
  UserPreferences,
  UserRole,
  UserStatus,
  InMemoryUserRepository,
  UserService,
  ConsoleLogger,
  MemoryCacheService,
};