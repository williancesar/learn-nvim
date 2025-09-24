/**
 * Day 39: Code Folding Practice - Long TypeScript with Natural Fold Points
 *
 * This file contains long TypeScript code with natural folding boundaries.
 * Practice using vim's folding features to navigate and organize large codebases
 * by hiding/showing different levels of implementation detail.
 *
 * Folding Practice Objectives:
 * - Use zf to create manual folds
 * - Use za to toggle fold open/close
 * - Use zo to open fold, zc to close fold
 * - Use zR to open all folds, zM to close all folds
 * - Use zj/zk to navigate between folds
 * - Practice with different fold methods (manual, indent, marker, syntax)
 */

// ========== IMPORTS AND TYPE DEFINITIONS ========== {{{
import { Injectable, Inject, Optional, Logger } from '@nestjs/common';
import { Repository, EntityManager, QueryBuilder, Connection } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { CacheManager, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

// Complex type definitions that can be folded
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : T[P] extends Array<infer U>
      ? ReadonlyArray<DeepReadonly<U>>
      : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepReadonly<U>>
      : DeepReadonly<T[P]>
    : T[P];
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T[P] extends Function
      ? T[P]
      : DeepPartial<T[P]>
    : T[P];
};

export type NonNullableFields<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
// }}}

// ========== INTERFACE DEFINITIONS ========== {{{
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

interface AuditableEntity extends BaseEntity {
  createdBy: string;
  updatedBy: string;
  deletedAt?: Date;
  deletedBy?: string;
}

interface User extends AuditableEntity {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  profile: UserProfile;
  permissions: UserPermission[];
  sessions: UserSession[];
  preferences: UserPreferences;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: Date;
  lastLoginIP?: string;
  failedLoginAttempts: number;
  lockedUntil?: Date;
}

interface UserProfile {
  avatar?: string;
  bio?: string;
  website?: string;
  location?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
    portfolio?: string;
  };
  visibility: {
    email: boolean;
    phoneNumber: boolean;
    dateOfBirth: boolean;
    location: boolean;
    socialLinks: boolean;
    bio: boolean;
  };
  notifications: {
    emailMarketing: boolean;
    emailUpdates: boolean;
    emailSecurity: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system' | 'auto';
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  currency: string;
  measurementUnit: 'metric' | 'imperial';
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
    allowMessaging: boolean;
    showOnlineStatus: boolean;
    shareAnalytics: boolean;
  };
}

interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    browser: string;
    version: string;
  };
  location: {
    ip: string;
    country?: string;
    city?: string;
    timezone?: string;
  };
  createdAt: Date;
  expiresAt: Date;
  lastActiveAt: Date;
  isRevoked: boolean;
  revokedAt?: Date;
  revokedReason?: string;
}

enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest',
  API_CLIENT = 'api_client'
}

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  LOCKED = 'locked'
}

enum UserPermission {
  READ_USERS = 'read_users',
  WRITE_USERS = 'write_users',
  DELETE_USERS = 'delete_users',
  READ_ADMIN = 'read_admin',
  WRITE_ADMIN = 'write_admin',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_PERMISSIONS = 'manage_permissions',
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data',
  SYSTEM_CONFIG = 'system_config',
  AUDIT_LOGS = 'audit_logs',
  SECURITY_SETTINGS = 'security_settings'
}
// }}}

// ========== SERVICE LAYER IMPLEMENTATION ========== {{{
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly saltRounds = 12;
  private readonly maxFailedAttempts = 5;
  private readonly lockDuration = 30 * 60 * 1000; // 30 minutes

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,

    @Inject('USER_SESSION_REPOSITORY')
    private readonly sessionRepository: Repository<UserSession>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: CacheManager,

    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,

    @Optional()
    @Inject('EMAIL_SERVICE')
    private readonly emailService?: EmailService,

    @Optional()
    @Inject('AUDIT_SERVICE')
    private readonly auditService?: AuditService,

    @Optional()
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService?: NotificationService
  ) {}

  // ========== USER QUERY METHODS ========== {{{
  async findById(
    id: string,
    options?: {
      includeProfile?: boolean;
      includePreferences?: boolean;
      includePermissions?: boolean;
      includeSessions?: boolean;
      includeDeleted?: boolean;
    }
  ): Promise<User | null> {
    this.logger.debug(`Finding user by ID: ${id}`, { userId: id });

    const cacheKey = `user:${id}:${JSON.stringify(options || {})}`;
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) {
      this.logger.debug(`User found in cache: ${id}`, { userId: id });
      return cached;
    }

    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id });

      if (!options?.includeDeleted) {
        queryBuilder.andWhere('user.deletedAt IS NULL');
      }

      if (options?.includeProfile) {
        queryBuilder.leftJoinAndSelect('user.profile', 'profile');
      }

      if (options?.includePreferences) {
        queryBuilder.leftJoinAndSelect('user.preferences', 'preferences');
      }

      if (options?.includePermissions) {
        queryBuilder.leftJoinAndSelect('user.permissions', 'permissions');
      }

      if (options?.includeSessions) {
        queryBuilder
          .leftJoinAndSelect('user.sessions', 'sessions')
          .andWhere('(sessions.expiresAt > :now OR sessions.expiresAt IS NULL)', {
            now: new Date()
          })
          .andWhere('sessions.isRevoked = :revoked', { revoked: false });
      }

      const user = await queryBuilder.getOne();

      if (!user) {
        this.logger.warn(`User not found: ${id}`, { userId: id });
        return null;
      }

      // Cache the result for 5 minutes
      await this.cacheManager.set(cacheKey, user, 300);

      this.logger.debug(`User found successfully: ${id}`, { userId: id });
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${id}`, {
        userId: id,
        error: error.message,
        stack: error.stack
      });
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async findByEmail(
    email: string,
    options?: {
      includeDeleted?: boolean;
      includeProfile?: boolean;
      includeSessions?: boolean;
    }
  ): Promise<User | null> {
    this.logger.debug(`Finding user by email: ${email}`, { email });

    const cacheKey = `user:email:${email.toLowerCase()}:${JSON.stringify(options || {})}`;
    const cached = await this.cacheManager.get<User>(cacheKey);
    if (cached) {
      this.logger.debug(`User found in cache by email: ${email}`, { email });
      return cached;
    }

    try {
      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .where('LOWER(user.email) = LOWER(:email)', { email });

      if (!options?.includeDeleted) {
        queryBuilder.andWhere('user.deletedAt IS NULL');
      }

      if (options?.includeProfile) {
        queryBuilder.leftJoinAndSelect('user.profile', 'profile');
      }

      if (options?.includeSessions) {
        queryBuilder
          .leftJoinAndSelect('user.sessions', 'sessions')
          .andWhere('sessions.expiresAt > :now', { now: new Date() })
          .andWhere('sessions.isRevoked = :revoked', { revoked: false });
      }

      const user = await queryBuilder.getOne();

      if (!user) {
        this.logger.warn(`User not found by email: ${email}`, { email });
        return null;
      }

      // Cache the result for 5 minutes
      await this.cacheManager.set(cacheKey, user, 300);

      this.logger.debug(`User found by email: ${email}`, {
        email,
        userId: user.id
      });
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by email: ${email}`, {
        email,
        error: error.message,
        stack: error.stack
      });
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  async findMany(
    filters?: {
      role?: UserRole;
      status?: UserStatus;
      emailVerified?: boolean;
      createdAfter?: Date;
      createdBefore?: Date;
      search?: string;
    },
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: Array<{ field: keyof User; direction: 'ASC' | 'DESC' }>;
      includeProfile?: boolean;
      includeDeleted?: boolean;
    }
  ): Promise<{ users: User[]; total: number }> {
    this.logger.debug('Finding multiple users', { filters, options });

    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      // Apply filters
      if (filters?.role) {
        queryBuilder.andWhere('user.role = :role', { role: filters.role });
      }

      if (filters?.status) {
        queryBuilder.andWhere('user.status = :status', { status: filters.status });
      }

      if (filters?.emailVerified !== undefined) {
        queryBuilder.andWhere('user.emailVerified = :emailVerified', {
          emailVerified: filters.emailVerified
        });
      }

      if (filters?.createdAfter) {
        queryBuilder.andWhere('user.createdAt >= :createdAfter', {
          createdAfter: filters.createdAfter
        });
      }

      if (filters?.createdBefore) {
        queryBuilder.andWhere('user.createdAt <= :createdBefore', {
          createdBefore: filters.createdBefore
        });
      }

      if (filters?.search) {
        queryBuilder.andWhere(
          '(LOWER(user.firstName) LIKE LOWER(:search) OR LOWER(user.lastName) LIKE LOWER(:search) OR LOWER(user.email) LIKE LOWER(:search))',
          { search: `%${filters.search}%` }
        );
      }

      if (!options?.includeDeleted) {
        queryBuilder.andWhere('user.deletedAt IS NULL');
      }

      if (options?.includeProfile) {
        queryBuilder.leftJoinAndSelect('user.profile', 'profile');
      }

      // Apply ordering
      if (options?.orderBy && options.orderBy.length > 0) {
        options.orderBy.forEach((order, index) => {
          if (index === 0) {
            queryBuilder.orderBy(`user.${order.field}`, order.direction);
          } else {
            queryBuilder.addOrderBy(`user.${order.field}`, order.direction);
          }
        });
      } else {
        queryBuilder.orderBy('user.createdAt', 'DESC');
      }

      // Get total count
      const total = await queryBuilder.getCount();

      // Apply pagination
      if (options?.limit) {
        queryBuilder.limit(options.limit);
      }

      if (options?.offset) {
        queryBuilder.offset(options.offset);
      }

      const users = await queryBuilder.getMany();

      this.logger.debug(`Found ${users.length} users out of ${total} total`, {
        filters,
        options,
        resultCount: users.length,
        total
      });

      return { users, total };
    } catch (error) {
      this.logger.error('Error finding multiple users', {
        filters,
        options,
        error: error.message,
        stack: error.stack
      });
      throw new Error(`Failed to find users: ${error.message}`);
    }
  }
  // }}}

  // ========== USER MUTATION METHODS ========== {{{
  async create(
    userData: OptionalFields<
      Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'sessions' | 'failedLoginAttempts'>,
      'profile' | 'preferences' | 'permissions' | 'emailVerified' | 'phoneVerified' | 'twoFactorEnabled'
    >,
    createdBy: string
  ): Promise<User> {
    this.logger.debug('Creating new user', {
      email: userData.email,
      role: userData.role,
      createdBy
    });

    return this.entityManager.transaction(async (transactionManager) => {
      try {
        // Validate input data
        const validationErrors = await this.validateUserData(userData);
        if (validationErrors.length > 0) {
          throw new ValidationError('Invalid user data', validationErrors);
        }

        // Check if user already exists
        const existingUser = await this.findByEmail(userData.email);
        if (existingUser) {
          throw new ConflictError('User with this email already exists');
        }

        // Hash password
        const passwordHash = await this.hashPassword(userData.passwordHash);

        // Create user entity with defaults
        const user = transactionManager.create(User, {
          ...userData,
          passwordHash,
          createdBy,
          updatedBy: createdBy,
          version: 1,
          emailVerified: userData.emailVerified || false,
          phoneVerified: userData.phoneVerified || false,
          twoFactorEnabled: userData.twoFactorEnabled || false,
          failedLoginAttempts: 0,
          profile: userData.profile || this.createDefaultProfile(),
          preferences: userData.preferences || this.createDefaultPreferences(),
          permissions: userData.permissions || this.getDefaultPermissions(userData.role),
          sessions: []
        });

        const savedUser = await transactionManager.save(User, user);

        // Clear relevant caches
        await this.clearUserCaches(savedUser.email);

        // Send welcome email if email service is available
        if (this.emailService && !savedUser.emailVerified) {
          try {
            await this.emailService.sendWelcomeEmail(savedUser);
            await this.emailService.sendEmailVerification(savedUser);
          } catch (emailError) {
            this.logger.warn('Failed to send welcome/verification email', {
              userId: savedUser.id,
              email: savedUser.email,
              error: emailError.message
            });
          }
        }

        // Send notification to administrators
        if (this.notificationService) {
          try {
            await this.notificationService.notifyNewUserRegistration(savedUser);
          } catch (notificationError) {
            this.logger.warn('Failed to send new user notification', {
              userId: savedUser.id,
              error: notificationError.message
            });
          }
        }

        // Emit event
        this.eventEmitter.emit('user.created', {
          user: savedUser,
          createdBy,
          timestamp: new Date()
        });

        // Log audit event if audit service is available
        if (this.auditService) {
          await this.auditService.logUserCreated(savedUser, createdBy);
        }

        this.logger.info(`User created successfully: ${savedUser.id}`, {
          userId: savedUser.id,
          email: savedUser.email,
          role: savedUser.role,
          createdBy
        });

        return savedUser;
      } catch (error) {
        this.logger.error('Error creating user', {
          email: userData.email,
          createdBy,
          error: error.message,
          stack: error.stack
        });

        if (error instanceof ValidationError || error instanceof ConflictError) {
          throw error;
        }

        throw new Error(`Failed to create user: ${error.message}`);
      }
    });
  }
  // }}}

  // ========== UTILITY AND HELPER METHODS ========== {{{
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private createDefaultProfile(): Partial<UserProfile> {
    return {
      socialLinks: {},
      visibility: {
        email: false,
        phoneNumber: false,
        dateOfBirth: false,
        location: false,
        socialLinks: true,
        bio: true
      },
      notifications: {
        emailMarketing: false,
        emailUpdates: true,
        emailSecurity: true,
        pushNotifications: true,
        smsNotifications: false
      }
    };
  }

  private createDefaultPreferences(): UserPreferences {
    return {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: '24h',
      currency: 'USD',
      measurementUnit: 'metric',
      accessibility: {
        highContrast: false,
        reducedMotion: false,
        screenReader: false,
        fontSize: 'medium'
      },
      privacy: {
        profileVisible: true,
        activityVisible: true,
        allowMessaging: true,
        showOnlineStatus: true,
        shareAnalytics: false
      }
    };
  }

  private getDefaultPermissions(role: UserRole): UserPermission[] {
    const permissionMap: Record<UserRole, UserPermission[]> = {
      [UserRole.SUPER_ADMIN]: Object.values(UserPermission),
      [UserRole.ADMIN]: [
        UserPermission.READ_USERS,
        UserPermission.WRITE_USERS,
        UserPermission.DELETE_USERS,
        UserPermission.READ_ADMIN,
        UserPermission.MANAGE_ROLES,
        UserPermission.VIEW_ANALYTICS,
        UserPermission.EXPORT_DATA,
        UserPermission.AUDIT_LOGS
      ],
      [UserRole.MODERATOR]: [
        UserPermission.READ_USERS,
        UserPermission.WRITE_USERS,
        UserPermission.VIEW_ANALYTICS
      ],
      [UserRole.USER]: [
        UserPermission.READ_USERS
      ],
      [UserRole.GUEST]: [],
      [UserRole.API_CLIENT]: [
        UserPermission.READ_USERS
      ]
    };

    return permissionMap[role] || [];
  }

  private async validateUserData(userData: any): Promise<string[]> {
    const errors: string[] = [];

    if (!userData.email || typeof userData.email !== 'string') {
      errors.push('Email is required and must be a string');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Email format is invalid');
    }

    if (!userData.firstName || typeof userData.firstName !== 'string') {
      errors.push('First name is required and must be a string');
    } else if (userData.firstName.length < 2 || userData.firstName.length > 50) {
      errors.push('First name must be between 2 and 50 characters');
    }

    if (!userData.lastName || typeof userData.lastName !== 'string') {
      errors.push('Last name is required and must be a string');
    } else if (userData.lastName.length < 2 || userData.lastName.length > 50) {
      errors.push('Last name must be between 2 and 50 characters');
    }

    if (!userData.passwordHash || typeof userData.passwordHash !== 'string') {
      errors.push('Password is required and must be a string');
    } else if (userData.passwordHash.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!Object.values(UserRole).includes(userData.role)) {
      errors.push('Invalid user role');
    }

    if (!Object.values(UserStatus).includes(userData.status)) {
      errors.push('Invalid user status');
    }

    return errors;
  }

  private async clearUserCaches(email: string): Promise<void> {
    const patterns = [
      `user:email:${email.toLowerCase()}*`,
      `user:*`
    ];

    for (const pattern of patterns) {
      try {
        await this.cacheManager.del(pattern);
      } catch (error) {
        this.logger.warn('Failed to clear cache pattern', {
          pattern,
          error: error.message
        });
      }
    }
  }
  // }}}
}
// }}}

// ========== ERROR CLASSES ========== {{{
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, validationErrors?: string[]) {
    super(message, 400, 'VALIDATION_ERROR', { validationErrors });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, conflictingField?: string) {
    super(message, 409, 'CONFLICT', { conflictingField });
  }
}
// }}}

// ========== FOLDING PRACTICE EXERCISES ========== {{{
/*
FOLDING EXERCISES:

1. Manual Fold Creation:
   - Position cursor on section header line
   - Use zf}{ or zf/pattern to create fold
   - Practice creating folds around logical sections

2. Fold Navigation:
   - Use zj to jump to next fold
   - Use zk to jump to previous fold
   - Use [z to go to start of current fold
   - Use ]z to go to end of current fold

3. Fold Operations:
   - Use za to toggle fold under cursor
   - Use zo to open fold, zc to close fold
   - Use zO to open all nested folds recursively
   - Use zC to close all nested folds recursively

4. Global Fold Operations:
   - Use zM to close all folds in buffer
   - Use zR to open all folds in buffer
   - Use zm to increase fold level (close more)
   - Use zr to decrease fold level (open more)

5. Fold Methods:
   - Try :set foldmethod=indent for indentation-based folding
   - Try :set foldmethod=syntax for syntax-aware folding
   - Try :set foldmethod=marker for marker-based folding ({{{ }}})
   - Try :set foldmethod=manual for manual fold creation

6. Advanced Folding:
   - Use zf with motions: zf5j (fold next 5 lines)
   - Use zf with text objects: zfa{ (fold around braces)
   - Use zd to delete fold under cursor
   - Use zE to eliminate all folds in buffer

Practice Goals:
- Fold import sections to focus on implementation
- Fold individual methods to see class structure
- Fold interface definitions to see overall architecture
- Use folding to navigate large codebases efficiently
- Develop muscle memory for fold operations
*/
// }}}