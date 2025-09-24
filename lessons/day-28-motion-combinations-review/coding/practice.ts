/**
 * TypeScript Practice: Comprehensive Review
 *
 * This file combines all advanced TypeScript concepts and Vim motion practice
 * from the previous lessons. It serves as a comprehensive review covering:
 * - Paragraph boundaries and navigation
 * - Text objects and bracket matching
 * - Search patterns and line jumping
 * - Visual block operations
 * - Complex type definitions and generics
 *
 * Practice all learned motions and operations on this comprehensive codebase.
 */

import { EventEmitter } from 'events';
import { createHash, randomBytes } from 'crypto';
import { promisify } from 'util';

// ========================================
// ADVANCED TYPE SYSTEM DEFINITIONS
// ========================================

// Complex conditional types for practice
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Array<infer U>
      ? ReadonlyArray<DeepReadonly<U>>
      : DeepReadonly<T[P]>
    : T[P];
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : DeepPartial<T[P]>
    : T[P];
};

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

// Advanced mapped types
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

type EventMap<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Changed`]: (
    oldValue: T[K],
    newValue: T[K]
  ) => void;
};

// Template literal types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ApiVersion = 'v1' | 'v2' | 'v3';
type ResourceType = 'users' | 'products' | 'orders' | 'payments' | 'analytics';

type ApiEndpoint<
  M extends HttpMethod,
  V extends ApiVersion,
  R extends ResourceType
> = `${M} /api/${V}/${R}`;

type CrudEndpoints<R extends ResourceType> = {
  list: ApiEndpoint<'GET', 'v1', R>;
  create: ApiEndpoint<'POST', 'v1', R>;
  read: ApiEndpoint<'GET', 'v1', R>;
  update: ApiEndpoint<'PUT', 'v1', R>;
  delete: ApiEndpoint<'DELETE', 'v1', R>;
};

// ========================================
// CORE DOMAIN ENTITIES
// ========================================

abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;
  public version: number;

  constructor(id?: string) {
    this.id = id || this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.version = 1;
  }

  protected generateId(): string {
    return `${this.constructor.name.toLowerCase()}_${Date.now()}_${randomBytes(8).toString('hex')}`;
  }

  public touch(): void {
    this.updatedAt = new Date();
    this.version += 1;
  }

  public abstract validate(): ValidationResult;
  public abstract toJSON(): Record<string, unknown>;
  public abstract fromJSON(data: Record<string, unknown>): void;
}

class User extends BaseEntity {
  public username: string;
  public email: string;
  private passwordHash: string;
  public profile: UserProfile;
  public preferences: UserPreferences;
  public status: UserStatus;
  public roles: Set<UserRole>;
  public permissions: Map<string, Permission>;
  public sessions: UserSession[];
  public auditLog: AuditEntry[];

  constructor(data: CreateUserData) {
    super();
    this.username = data.username;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.profile = new UserProfile(data.profile);
    this.preferences = new UserPreferences(data.preferences);
    this.status = UserStatus.PENDING_VERIFICATION;
    this.roles = new Set([UserRole.USER]);
    this.permissions = new Map();
    this.sessions = [];
    this.auditLog = [];
  }

  public authenticate(password: string): boolean {
    const hash = createHash('sha256').update(password).digest('hex');
    return this.passwordHash === hash;
  }

  public addRole(role: UserRole): void {
    this.roles.add(role);
    this.updatePermissions();
    this.logAuditEvent('role_added', { role });
    this.touch();
  }

  public removeRole(role: UserRole): void {
    this.roles.delete(role);
    this.updatePermissions();
    this.logAuditEvent('role_removed', { role });
    this.touch();
  }

  public hasPermission(resource: string, action: string): boolean {
    const permission = this.permissions.get(resource);
    return permission ? permission.actions.includes(action) : false;
  }

  public createSession(deviceInfo: DeviceInfo): UserSession {
    const session = new UserSession(this.id, deviceInfo);
    this.sessions.push(session);
    this.logAuditEvent('session_created', { sessionId: session.id });
    this.touch();
    return session;
  }

  public revokeSession(sessionId: string): boolean {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex >= 0) {
      this.sessions.splice(sessionIndex, 1);
      this.logAuditEvent('session_revoked', { sessionId });
      this.touch();
      return true;
    }
    return false;
  }

  public updateProfile(updates: Partial<UserProfileData>): void {
    this.profile.update(updates);
    this.logAuditEvent('profile_updated', { updates });
    this.touch();
  }

  public updatePreferences(updates: Partial<UserPreferencesData>): void {
    this.preferences.update(updates);
    this.logAuditEvent('preferences_updated', { updates });
    this.touch();
  }

  private updatePermissions(): void {
    this.permissions.clear();

    for (const role of this.roles) {
      const rolePermissions = getRolePermissions(role);
      for (const [resource, permission] of rolePermissions) {
        const existing = this.permissions.get(resource);
        if (existing) {
          existing.actions = [...new Set([...existing.actions, ...permission.actions])];
        } else {
          this.permissions.set(resource, { ...permission });
        }
      }
    }
  }

  private logAuditEvent(action: string, data: Record<string, unknown>): void {
    this.auditLog.push({
      id: this.generateId(),
      userId: this.id,
      action,
      data,
      timestamp: new Date(),
      ipAddress: null, // Would be set from request context
      userAgent: null  // Would be set from request context
    });
  }

  public validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Username validation
    if (!this.username || this.username.length < 3) {
      errors.push({
        field: 'username',
        code: 'INVALID_LENGTH',
        message: 'Username must be at least 3 characters long'
      });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(this.username)) {
      errors.push({
        field: 'username',
        code: 'INVALID_FORMAT',
        message: 'Username can only contain letters, numbers, underscores, and hyphens'
      });
    }

    // Email validation
    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errors.push({
        field: 'email',
        code: 'INVALID_FORMAT',
        message: 'Valid email address is required'
      });
    }

    // Profile validation
    const profileValidation = this.profile.validate();
    errors.push(...profileValidation.errors);
    warnings.push(...profileValidation.warnings);

    // Preferences validation
    const preferencesValidation = this.preferences.validate();
    errors.push(...preferencesValidation.errors);
    warnings.push(...preferencesValidation.warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      profile: this.profile.toJSON(),
      preferences: this.preferences.toJSON(),
      status: this.status,
      roles: Array.from(this.roles),
      sessions: this.sessions.map(s => s.toJSON()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      version: this.version
    };
  }

  public fromJSON(data: Record<string, unknown>): void {
    this.username = data.username as string;
    this.email = data.email as string;
    this.status = data.status as UserStatus;
    this.roles = new Set(data.roles as UserRole[]);

    if (data.profile) {
      this.profile.fromJSON(data.profile as Record<string, unknown>);
    }

    if (data.preferences) {
      this.preferences.fromJSON(data.preferences as Record<string, unknown>);
    }

    this.updatedAt = new Date(data.updatedAt as string);
    this.version = data.version as number;
  }
}

class UserProfile {
  public firstName: string;
  public lastName: string;
  public dateOfBirth?: Date;
  public phoneNumber?: string;
  public address?: Address;
  public avatar?: string;
  public bio?: string;
  public socialLinks: Map<string, string>;
  public customFields: Map<string, unknown>;

  constructor(data: UserProfileData) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dateOfBirth = data.dateOfBirth;
    this.phoneNumber = data.phoneNumber;
    this.address = data.address ? new Address(data.address) : undefined;
    this.avatar = data.avatar;
    this.bio = data.bio;
    this.socialLinks = new Map(Object.entries(data.socialLinks || {}));
    this.customFields = new Map(Object.entries(data.customFields || {}));
  }

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public get age(): number | null {
    if (!this.dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  public update(updates: Partial<UserProfileData>): void {
    Object.assign(this, updates);

    if (updates.address) {
      this.address = new Address(updates.address);
    }

    if (updates.socialLinks) {
      this.socialLinks = new Map(Object.entries(updates.socialLinks));
    }

    if (updates.customFields) {
      this.customFields = new Map(Object.entries(updates.customFields));
    }
  }

  public validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!this.firstName || this.firstName.trim().length === 0) {
      errors.push({
        field: 'firstName',
        code: 'REQUIRED',
        message: 'First name is required'
      });
    }

    if (!this.lastName || this.lastName.trim().length === 0) {
      errors.push({
        field: 'lastName',
        code: 'REQUIRED',
        message: 'Last name is required'
      });
    }

    if (this.dateOfBirth) {
      const age = this.age;
      if (age !== null && age < 13) {
        errors.push({
          field: 'dateOfBirth',
          code: 'AGE_RESTRICTION',
          message: 'User must be at least 13 years old'
        });
      }
    }

    if (this.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(this.phoneNumber)) {
      warnings.push({
        field: 'phoneNumber',
        code: 'INVALID_FORMAT',
        message: 'Phone number format may be invalid'
      });
    }

    if (this.address) {
      const addressValidation = this.address.validate();
      errors.push(...addressValidation.errors.map(e => ({ ...e, field: `address.${e.field}` })));
      warnings.push(...addressValidation.warnings.map(w => ({ ...w, field: `address.${w.field}` })));
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  public toJSON(): Record<string, unknown> {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      age: this.age,
      dateOfBirth: this.dateOfBirth?.toISOString(),
      phoneNumber: this.phoneNumber,
      address: this.address?.toJSON(),
      avatar: this.avatar,
      bio: this.bio,
      socialLinks: Object.fromEntries(this.socialLinks),
      customFields: Object.fromEntries(this.customFields)
    };
  }

  public fromJSON(data: Record<string, unknown>): void {
    this.firstName = data.firstName as string;
    this.lastName = data.lastName as string;
    this.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth as string) : undefined;
    this.phoneNumber = data.phoneNumber as string;
    this.avatar = data.avatar as string;
    this.bio = data.bio as string;

    if (data.address) {
      this.address = new Address(data.address as AddressData);
    }

    if (data.socialLinks) {
      this.socialLinks = new Map(Object.entries(data.socialLinks as Record<string, string>));
    }

    if (data.customFields) {
      this.customFields = new Map(Object.entries(data.customFields as Record<string, unknown>));
    }
  }
}

class UserPreferences {
  public theme: Theme;
  public language: string;
  public timezone: string;
  public notifications: NotificationSettings;
  public privacy: PrivacySettings;
  public accessibility: AccessibilitySettings;
  public experimental: Map<string, boolean>;

  constructor(data?: UserPreferencesData) {
    this.theme = data?.theme || Theme.LIGHT;
    this.language = data?.language || 'en';
    this.timezone = data?.timezone || 'UTC';
    this.notifications = data?.notifications || new NotificationSettings();
    this.privacy = data?.privacy || new PrivacySettings();
    this.accessibility = data?.accessibility || new AccessibilitySettings();
    this.experimental = new Map(Object.entries(data?.experimental || {}));
  }

  public update(updates: Partial<UserPreferencesData>): void {
    Object.assign(this, updates);

    if (updates.notifications) {
      this.notifications = { ...this.notifications, ...updates.notifications };
    }

    if (updates.privacy) {
      this.privacy = { ...this.privacy, ...updates.privacy };
    }

    if (updates.accessibility) {
      this.accessibility = { ...this.accessibility, ...updates.accessibility };
    }

    if (updates.experimental) {
      this.experimental = new Map(Object.entries(updates.experimental));
    }
  }

  public validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!Object.values(Theme).includes(this.theme)) {
      errors.push({
        field: 'theme',
        code: 'INVALID_VALUE',
        message: 'Invalid theme value'
      });
    }

    if (!this.language || this.language.length !== 2) {
      warnings.push({
        field: 'language',
        code: 'INVALID_FORMAT',
        message: 'Language should be a 2-letter ISO code'
      });
    }

    return { valid: errors.length === 0, errors, warnings };
  }

  public toJSON(): Record<string, unknown> {
    return {
      theme: this.theme,
      language: this.language,
      timezone: this.timezone,
      notifications: this.notifications,
      privacy: this.privacy,
      accessibility: this.accessibility,
      experimental: Object.fromEntries(this.experimental)
    };
  }

  public fromJSON(data: Record<string, unknown>): void {
    this.theme = data.theme as Theme;
    this.language = data.language as string;
    this.timezone = data.timezone as string;
    this.notifications = data.notifications as NotificationSettings;
    this.privacy = data.privacy as PrivacySettings;
    this.accessibility = data.accessibility as AccessibilitySettings;

    if (data.experimental) {
      this.experimental = new Map(Object.entries(data.experimental as Record<string, boolean>));
    }
  }
}

class UserSession {
  public readonly id: string;
  public readonly userId: string;
  public readonly deviceInfo: DeviceInfo;
  public readonly createdAt: Date;
  public lastAccessedAt: Date;
  public isActive: boolean;
  public refreshToken?: string;
  public expiresAt: Date;

  constructor(userId: string, deviceInfo: DeviceInfo) {
    this.id = `session_${Date.now()}_${randomBytes(16).toString('hex')}`;
    this.userId = userId;
    this.deviceInfo = deviceInfo;
    this.createdAt = new Date();
    this.lastAccessedAt = new Date();
    this.isActive = true;
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  }

  public touch(): void {
    this.lastAccessedAt = new Date();
  }

  public revoke(): void {
    this.isActive = false;
  }

  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  public extend(hours: number = 24): void {
    this.expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      userId: this.userId,
      deviceInfo: this.deviceInfo,
      createdAt: this.createdAt.toISOString(),
      lastAccessedAt: this.lastAccessedAt.toISOString(),
      isActive: this.isActive,
      expiresAt: this.expiresAt.toISOString()
    };
  }
}

// ========================================
// REPOSITORY AND SERVICE LAYER
// ========================================

interface Repository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(options?: QueryOptions): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  count(filters?: Record<string, unknown>): Promise<number>;
}

class UserRepository implements Repository<User> {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map();
  private usernameIndex: Map<string, string> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userId = this.emailIndex.get(email.toLowerCase());
    return userId ? this.users.get(userId) || null : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userId = this.usernameIndex.get(username.toLowerCase());
    return userId ? this.users.get(userId) || null : null;
  }

  async findAll(options?: QueryOptions): Promise<User[]> {
    let users = Array.from(this.users.values());

    if (options?.filters) {
      users = users.filter(user => this.matchesFilters(user, options.filters!));
    }

    if (options?.sort) {
      users.sort((a, b) => this.compareUsers(a, b, options.sort!));
    }

    if (options?.pagination) {
      const start = (options.pagination.page - 1) * options.pagination.limit;
      users = users.slice(start, start + options.pagination.limit);
    }

    return users;
  }

  async create(user: User): Promise<User> {
    const validation = user.validate();
    if (!validation.valid) {
      throw new ValidationException('User validation failed', validation.errors);
    }

    if (await this.findByEmail(user.email)) {
      throw new ConflictException('Email already exists');
    }

    if (await this.findByUsername(user.username)) {
      throw new ConflictException('Username already exists');
    }

    this.users.set(user.id, user);
    this.emailIndex.set(user.email.toLowerCase(), user.id);
    this.usernameIndex.set(user.username.toLowerCase(), user.id);

    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updates);
    user.touch();

    const validation = user.validate();
    if (!validation.valid) {
      throw new ValidationException('User validation failed', validation.errors);
    }

    return user;
  }

  async delete(id: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) {
      return false;
    }

    this.users.delete(id);
    this.emailIndex.delete(user.email.toLowerCase());
    this.usernameIndex.delete(user.username.toLowerCase());

    return true;
  }

  async count(filters?: Record<string, unknown>): Promise<number> {
    if (!filters) {
      return this.users.size;
    }

    return Array.from(this.users.values())
      .filter(user => this.matchesFilters(user, filters))
      .length;
  }

  private matchesFilters(user: User, filters: Record<string, unknown>): boolean {
    return Object.entries(filters).every(([key, value]) => {
      const userValue = this.getNestedValue(user, key);
      if (Array.isArray(value)) {
        return value.includes(userValue);
      }
      return userValue === value;
    });
  }

  private compareUsers(a: User, b: User, sort: SortOption): number {
    const aValue = this.getNestedValue(a, sort.field);
    const bValue = this.getNestedValue(b, sort.field);

    if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

class UserService extends EventEmitter {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger,
    private cacheService: CacheService,
    private emailService: EmailService
  ) {
    super();
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    this.logger.info('Creating user', { email: userData.email, username: userData.username });

    const hashedPassword = await this.hashPassword(userData.password);
    const user = new User({
      ...userData,
      passwordHash: hashedPassword
    });

    const createdUser = await this.userRepository.create(user);

    await this.cacheService.set(`user:${createdUser.id}`, createdUser, 3600);
    await this.emailService.sendWelcomeEmail(createdUser.email, createdUser.profile.firstName);

    this.emit('userCreated', createdUser);
    this.logger.info('User created successfully', { userId: createdUser.id });

    return createdUser;
  }

  async authenticateUser(email: string, password: string): Promise<AuthenticationResult> {
    this.logger.info('Authenticating user', { email });

    const user = await this.userRepository.findByEmail(email);
    if (!user || !user.authenticate(password)) {
      this.logger.warn('Authentication failed', { email });
      return { success: false, error: 'Invalid credentials' };
    }

    if (user.status !== UserStatus.ACTIVE) {
      this.logger.warn('Authentication failed - inactive user', { email, status: user.status });
      return { success: false, error: 'Account is not active' };
    }

    const deviceInfo: DeviceInfo = {
      userAgent: 'mock-user-agent',
      ipAddress: '127.0.0.1',
      deviceId: 'mock-device-id'
    };

    const session = user.createSession(deviceInfo);
    await this.userRepository.update(user.id, user);

    this.emit('userAuthenticated', { userId: user.id, sessionId: session.id });
    this.logger.info('User authenticated successfully', { userId: user.id });

    return {
      success: true,
      user,
      session,
      token: await this.generateJWT(user, session)
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return createHash('sha256').update(password).digest('hex');
  }

  private async generateJWT(user: User, session: UserSession): Promise<string> {
    // Mock JWT generation
    const payload = {
      userId: user.id,
      sessionId: session.id,
      email: user.email,
      roles: Array.from(user.roles)
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }
}

// ========================================
// SUPPORTING TYPES AND ENUMS
// ========================================

enum UserStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest'
}

enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto'
}

interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  profile: UserProfileData;
  preferences?: UserPreferencesData;
}

interface UserProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  address?: AddressData;
  avatar?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  customFields?: Record<string, unknown>;
}

interface UserPreferencesData {
  theme?: Theme;
  language?: string;
  timezone?: string;
  notifications?: NotificationSettings;
  privacy?: PrivacySettings;
  accessibility?: AccessibilitySettings;
  experimental?: Record<string, boolean>;
}

interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface DeviceInfo {
  userAgent: string;
  ipAddress: string;
  deviceId?: string;
}

interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, unknown>;
}

interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  data: Record<string, unknown>;
  timestamp: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  code: string;
  message: string;
}

interface ValidationWarning {
  field: string;
  code: string;
  message: string;
}

interface QueryOptions {
  filters?: Record<string, unknown>;
  sort?: SortOption;
  pagination?: PaginationOption;
}

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

interface PaginationOption {
  page: number;
  limit: number;
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  profile: UserProfileData;
  preferences?: UserPreferencesData;
}

interface AuthenticationResult {
  success: boolean;
  user?: User;
  session?: UserSession;
  token?: string;
  error?: string;
}

// Mock implementations for supporting classes
class Address {
  constructor(public data: AddressData) {}
  validate(): ValidationResult { return { valid: true, errors: [], warnings: [] }; }
  toJSON(): Record<string, unknown> { return this.data; }
}

class NotificationSettings {
  email: boolean = true;
  push: boolean = true;
  sms: boolean = false;
}

class PrivacySettings {
  profileVisibility: 'public' | 'private' = 'public';
  dataSharing: boolean = false;
}

class AccessibilitySettings {
  highContrast: boolean = false;
  fontSize: 'small' | 'medium' | 'large' = 'medium';
}

// Exception classes
class ValidationException extends Error {
  constructor(message: string, public errors: ValidationError[]) {
    super(message);
  }
}

class ConflictException extends Error {}
class NotFoundException extends Error {}

// Service interfaces
interface Logger {
  info(message: string, meta?: object): void;
  warn(message: string, meta?: object): void;
  error(message: string, meta?: object): void;
}

interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl: number): Promise<void>;
}

interface EmailService {
  sendWelcomeEmail(email: string, firstName: string): Promise<void>;
}

// Helper function
function getRolePermissions(role: UserRole): Map<string, Permission> {
  // Mock implementation
  return new Map();
}

// ========================================
// EXPORTS
// ========================================

export {
  type DeepReadonly,
  type DeepPartial,
  type RequiredKeys,
  type OptionalKeys,
  type Getters,
  type Setters,
  type EventMap,
  type ApiEndpoint,
  type CrudEndpoints,
  BaseEntity,
  User,
  UserProfile,
  UserPreferences,
  UserSession,
  UserRepository,
  UserService,
  UserStatus,
  UserRole,
  Theme,
  type CreateUserRequest,
  type AuthenticationResult,
  type ValidationResult,
  ValidationException,
  ConflictException,
  NotFoundException
};