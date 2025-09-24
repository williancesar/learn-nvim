/**
 * Day 13: Utility Functions and Classes
 *
 * Navigate here from auth.service.ts using :e utils.ts
 * Practice buffer list: :ls, then navigate with :b[number]
 * Try deleting a buffer: :bd, then restore with :e utils.ts
 */

import { LogLevel, LogEntry, LoggerConfig } from './types';

/**
 * Logger class for structured logging
 * Used throughout the application for consistent logging
 */
export class Logger {
  private context: string;
  private level: LogLevel;
  private config: Partial<LoggerConfig>;

  constructor(context: string, level: LogLevel = LogLevel.INFO, config: Partial<LoggerConfig> = {}) {
    this.context = context;
    this.level = level;
    this.config = {
      format: 'text',
      outputs: [{ type: 'console', config: {} }],
      ...config
    };
  }

  /**
   * Create child logger with extended context
   */
  createChild(childContext: string): Logger {
    const fullContext = `${this.context}:${childContext}`;
    return new Logger(fullContext, this.level, this.config);
  }

  /**
   * Log trace message (most verbose)
   */
  trace(message: string, data?: any): void {
    this.log(LogLevel.TRACE, message, data);
  }

  /**
   * Log debug message
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log info message
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.WARN, message, data, error);
  }

  /**
   * Log error message
   */
  error(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.ERROR, message, data, error);
  }

  /**
   * Log fatal message (most severe)
   */
  fatal(message: string, data?: any, error?: Error): void {
    this.log(LogLevel.FATAL, message, data, error);
  }

  /**
   * Generic log method
   */
  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (level < this.level) {
      return; // Don't log if below configured level
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: this.context,
      data,
      error
    };

    this.output(entry);
  }

  /**
   * Output log entry to configured outputs
   */
  private output(entry: LogEntry): void {
    const formatted = this.formatEntry(entry);

    this.config.outputs?.forEach(output => {
      switch (output.type) {
        case 'console':
          this.outputToConsole(entry, formatted);
          break;
        case 'file':
          this.outputToFile(entry, formatted, output.config);
          break;
        case 'http':
          this.outputToHttp(entry, formatted, output.config);
          break;
      }
    });
  }

  /**
   * Format log entry based on configuration
   */
  private formatEntry(entry: LogEntry): string {
    if (this.config.format === 'json') {
      return JSON.stringify({
        timestamp: entry.timestamp.toISOString(),
        level: LogLevel[entry.level],
        context: entry.context,
        message: entry.message,
        data: entry.data,
        error: entry.error ? {
          name: entry.error.name,
          message: entry.error.message,
          stack: entry.error.stack
        } : undefined
      });
    }

    // Text format
    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level].padEnd(5);
    const context = entry.context.padEnd(20);

    let formatted = `${timestamp} [${level}] ${context} ${entry.message}`;

    if (entry.data) {
      formatted += ` | Data: ${JSON.stringify(entry.data)}`;
    }

    if (entry.error) {
      formatted += ` | Error: ${entry.error.message}`;
      if (entry.error.stack) {
        formatted += `\nStack: ${entry.error.stack}`;
      }
    }

    return formatted;
  }

  /**
   * Output to console with appropriate method
   */
  private outputToConsole(entry: LogEntry, formatted: string): void {
    switch (entry.level) {
      case LogLevel.TRACE:
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formatted);
        break;
    }
  }

  /**
   * Output to file (placeholder - would need Node.js fs in real implementation)
   */
  private outputToFile(entry: LogEntry, formatted: string, config: any): void {
    // In a real implementation, this would write to a file
    console.log(`[FILE LOG] ${formatted}`);
  }

  /**
   * Output to HTTP endpoint (placeholder)
   */
  private outputToHttp(entry: LogEntry, formatted: string, config: any): void {
    // In a real implementation, this would send to a logging service
    console.log(`[HTTP LOG] ${formatted}`);
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.level;
  }
}

/**
 * Email validation utility
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Password validation utility
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Phone number validation utility
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if it's a valid length (10-15 digits)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * URL validation utility
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Date formatting utility
 */
export function formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Date parsing utility
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }

  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Time ago utility (e.g., "2 hours ago")
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();

  if (diffMs < 0) {
    return 'in the future';
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) {
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }
  if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  }
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

/**
 * String truncation utility
 */
export function truncateString(str: string, maxLength: number, ellipsis: string = '...'): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * String capitalization utility
 */
export function capitalize(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Camel case conversion utility
 */
export function toCamelCase(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

/**
 * Snake case conversion utility
 */
export function toSnakeCase(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/^_/, '')
    .toLowerCase()
    .replace(/[-\s]+/g, '_');
}

/**
 * Kebab case conversion utility
 */
export function toKebabCase(str: string): string {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/^-/, '')
    .toLowerCase()
    .replace(/[_\s]+/g, '-');
}

/**
 * Deep clone utility
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * Object comparison utility
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
    return true;
  }

  if (obj1 == null || obj2 == null) {
    return obj1 === obj2;
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (typeof obj1 !== 'object') {
    return obj1 === obj2;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (!keys2.includes(key)) {
      return false;
    }

    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

/**
 * Debounce utility
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func.apply(null, args);
      timeoutId = null;
    }, waitMs);
  };
}

/**
 * Throttle utility
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}

/**
 * Retry utility with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retries: number;
    delay: number;
    backoff?: number;
    shouldRetry?: (error: any) => boolean;
  }
): Promise<T> {
  const { retries, delay, backoff = 2, shouldRetry = () => true } = options;

  let lastError: any;

  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (i === retries || !shouldRetry(error)) {
        break;
      }

      const waitTime = delay * Math.pow(backoff, i);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

/**
 * Generate random ID
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * File size formatting utility
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Number formatting utility
 */
export function formatNumber(num: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Currency formatting utility
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Percentage formatting utility
 */
export function formatPercentage(value: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}

/**
 * Environment detection utilities
 */
export const isClient = typeof window !== 'undefined';
export const isServer = typeof window === 'undefined';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

export default {
  Logger,
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateUrl,
  formatDate,
  parseDate,
  timeAgo,
  truncateString,
  capitalize,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  deepClone,
  deepEqual,
  debounce,
  throttle,
  retry,
  generateId,
  generateUUID,
  formatFileSize,
  formatNumber,
  formatCurrency,
  formatPercentage,
  isClient,
  isServer,
  isDevelopment,
  isProduction
};