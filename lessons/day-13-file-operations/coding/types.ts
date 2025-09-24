/**
 * Day 13: Shared Type Definitions
 *
 * This file contains all the shared TypeScript type definitions.
 * Practice navigating here from practice.ts using :e types.ts
 * Try opening multiple files in splits: :vsp user.service.ts
 */

// User-related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  profile?: UserProfile;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest'
}

export interface UserProfile {
  bio?: string;
  avatar?: string;
  website?: string;
  location?: string;
  birthDate?: Date;
  phoneNumber?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    emailVisible: boolean;
    lastSeenVisible: boolean;
  };
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmation {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// User CRUD types
export interface UserCreationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  profile?: Partial<UserProfile>;
  preferences?: Partial<UserPreferences>;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  profile?: Partial<UserProfile>;
  preferences?: Partial<UserPreferences>;
}

export interface UserSearchCriteria {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface ResponseMeta {
  timestamp: Date;
  requestId: string;
  version: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// HTTP client types
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers?: Record<string, string>;
  auth?: {
    type: 'bearer' | 'basic' | 'api-key';
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
  };
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

export interface ResponseData<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

// Logging types
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: any;
  error?: Error;
}

export interface LoggerConfig {
  level: LogLevel;
  format: 'json' | 'text';
  outputs: LogOutput[];
}

export interface LogOutput {
  type: 'console' | 'file' | 'http';
  config: Record<string, any>;
}

// Configuration types
export interface AppConfig {
  env: 'development' | 'staging' | 'production';
  api: ApiClientConfig;
  logging: LoggerConfig;
  features: {
    registration: boolean;
    passwordReset: boolean;
    emailVerification: boolean;
    socialLogin: boolean;
    twoFactorAuth: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    dateFormat: string;
    timeFormat: string;
    timezone: string;
  };
}

// Validation types
export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message: string;
  value?: any;
  validator?: (value: any) => boolean;
}

export interface ValidationSchema {
  [field: string]: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// Event types
export interface AppEvent {
  type: string;
  timestamp: Date;
  source: string;
  data?: any;
}

export interface UserEvent extends AppEvent {
  userId: string;
  type: 'user.created' | 'user.updated' | 'user.deleted' | 'user.login' | 'user.logout';
}

export interface AuthEvent extends AppEvent {
  type: 'auth.login' | 'auth.logout' | 'auth.token_refresh' | 'auth.password_reset';
  userId?: string;
  sessionId?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// Database types
export interface DatabaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AuditLog extends DatabaseEntity {
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  changes: Record<string, { old?: any; new?: any }>;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Cache types
export interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: Date;
  createdAt: Date;
  accessCount: number;
  lastAccessed: Date;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
  maxMemory: number; // Maximum memory usage in bytes
  strategy: 'lru' | 'lfu' | 'fifo';
}

// Feature flag types
export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  isEnabled: boolean;
  conditions?: FeatureFlagCondition[];
  rolloutPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeatureFlagCondition {
  type: 'user_role' | 'user_attribute' | 'date_range' | 'custom';
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: any;
}

// Metrics and analytics types
export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

export interface PerformanceMetric extends Metric {
  duration: number;
  operation: string;
  success: boolean;
  errorCode?: string;
}

export interface BusinessMetric extends Metric {
  category: 'user' | 'revenue' | 'engagement' | 'conversion';
  period: 'hour' | 'day' | 'week' | 'month' | 'year';
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
  actionText?: string;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    types: string[];
  };
  push: {
    enabled: boolean;
    types: string[];
  };
  inApp: {
    enabled: boolean;
    types: string[];
  };
}

// File upload types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  allowedExtensions: string[];
  generateThumbnails: boolean;
  thumbnailSizes: number[];
  storage: {
    type: 'local' | 's3' | 'gcs' | 'azure';
    config: Record<string, any>;
  };
}

// Export all types for easy importing
export * from './types';