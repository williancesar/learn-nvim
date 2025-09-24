/**
 * TypeScript Practice: Text Objects Introduction
 *
 * This file contains various TypeScript constructs designed for practicing
 * basic text object commands (iw, aw, is, as, ip, ap).
 *
 * Practice selecting inner/around words, sentences, and paragraphs.
 */

// Text object practice with type definitions
type DatabaseConnection = {
  host: string;
  port: number;
  database: string;
  credentials: UserCredentials;
};

type UserCredentials = {
  username: string;
  password: string;
  apiKey?: string;
};

// Interface definitions for text object practice
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  metadata: ResponseMetadata;
}

interface ErrorResponse {
  code: string;
  message: string;
  details: Record<string, unknown>;
}

interface ResponseMetadata {
  timestamp: Date;
  requestId: string;
  version: string;
}

// Function signatures with multiple parameters
function processUserData(
  userData: UserData,
  options: ProcessingOptions,
  callback?: (result: ProcessingResult) => void
): Promise<ProcessingResult> {
  const startTime = performance.now();

  validateUserData(userData);

  const processor = new DataProcessor(options);
  const result = processor.process(userData);

  if (callback) {
    callback(result);
  }

  const endTime = performance.now();

  return Promise.resolve({
    ...result,
    processingTime: endTime - startTime
  });
}

// Class definition with methods
class DataProcessor {
  private options: ProcessingOptions;
  private cache: Map<string, any>;

  constructor(options: ProcessingOptions) {
    this.options = options;
    this.cache = new Map();
  }

  process(data: UserData): ProcessingResult {
    const cacheKey = this.generateCacheKey(data);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const transformedData = this.transformData(data);
    const validatedData = this.validateData(transformedData);
    const enrichedData = this.enrichData(validatedData);

    const result: ProcessingResult = {
      originalData: data,
      processedData: enrichedData,
      success: true,
      errors: [],
      warnings: []
    };

    this.cache.set(cacheKey, result);

    return result;
  }

  private transformData(data: UserData): TransformedData {
    return {
      id: data.id,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email.toLowerCase(),
      age: this.calculateAge(data.birthDate),
      preferences: this.normalizePreferences(data.preferences)
    };
  }

  private validateData(data: TransformedData): TransformedData {
    if (!data.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    if (data.age < 0 || data.age > 150) {
      throw new Error('Invalid age value');
    }

    return data;
  }

  private enrichData(data: TransformedData): EnrichedData {
    const locationData = this.getLocationData(data.email);
    const behaviorData = this.getBehaviorData(data.id);

    return {
      ...data,
      location: locationData,
      behavior: behaviorData,
      riskScore: this.calculateRiskScore(data, behaviorData)
    };
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  private normalizePreferences(preferences: UserPreferences): NormalizedPreferences {
    return {
      theme: preferences.theme || 'light',
      language: preferences.language || 'en',
      notifications: preferences.notifications !== false,
      privacy: preferences.privacy || 'standard'
    };
  }

  private generateCacheKey(data: UserData): string {
    return `${data.id}-${data.email}-${Date.now()}`;
  }

  private getLocationData(email: string): LocationData {
    const domain = email.split('@')[1];

    return {
      country: this.getCountryFromDomain(domain),
      timezone: this.getTimezoneFromDomain(domain),
      coordinates: this.getCoordinatesFromDomain(domain)
    };
  }

  private getBehaviorData(userId: string): BehaviorData {
    return {
      loginFrequency: Math.random() * 10,
      sessionDuration: Math.random() * 3600,
      lastActivity: new Date(),
      deviceCount: Math.floor(Math.random() * 5) + 1
    };
  }

  private calculateRiskScore(data: TransformedData, behavior: BehaviorData): number {
    let score = 0;

    if (data.age < 18) score += 0.2;
    if (behavior.deviceCount > 3) score += 0.1;
    if (behavior.sessionDuration > 7200) score += 0.3;

    return Math.min(score, 1.0);
  }

  private getCountryFromDomain(domain: string): string {
    const countryMap: Record<string, string> = {
      'gmail.com': 'US',
      'yahoo.com': 'US',
      'hotmail.com': 'US',
      'outlook.com': 'US'
    };

    return countryMap[domain] || 'Unknown';
  }

  private getTimezoneFromDomain(domain: string): string {
    const timezoneMap: Record<string, string> = {
      'gmail.com': 'America/New_York',
      'yahoo.com': 'America/Los_Angeles',
      'hotmail.com': 'America/Chicago',
      'outlook.com': 'America/Denver'
    };

    return timezoneMap[domain] || 'UTC';
  }

  private getCoordinatesFromDomain(domain: string): Coordinates {
    const coordinatesMap: Record<string, Coordinates> = {
      'gmail.com': { latitude: 40.7128, longitude: -74.0060 },
      'yahoo.com': { latitude: 34.0522, longitude: -118.2437 },
      'hotmail.com': { latitude: 41.8781, longitude: -87.6298 },
      'outlook.com': { latitude: 39.7392, longitude: -104.9903 }
    };

    return coordinatesMap[domain] || { latitude: 0, longitude: 0 };
  }
}

// Supporting type definitions
interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: boolean;
  privacy?: 'minimal' | 'standard' | 'enhanced';
}

interface ProcessingOptions {
  validateEmail: boolean;
  enrichWithLocation: boolean;
  enrichWithBehavior: boolean;
  calculateRisk: boolean;
  cacheResults: boolean;
}

interface ProcessingResult {
  originalData: UserData;
  processedData: EnrichedData;
  success: boolean;
  errors: string[];
  warnings: string[];
  processingTime?: number;
}

interface TransformedData {
  id: string;
  name: string;
  email: string;
  age: number;
  preferences: NormalizedPreferences;
}

interface NormalizedPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  privacy: 'minimal' | 'standard' | 'enhanced';
}

interface EnrichedData extends TransformedData {
  location: LocationData;
  behavior: BehaviorData;
  riskScore: number;
}

interface LocationData {
  country: string;
  timezone: string;
  coordinates: Coordinates;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface BehaviorData {
  loginFrequency: number;
  sessionDuration: number;
  lastActivity: Date;
  deviceCount: number;
}

// Validation functions
function validateUserData(data: UserData): void {
  if (!data.id || typeof data.id !== 'string') {
    throw new Error('User ID is required and must be a string');
  }

  if (!data.firstName || typeof data.firstName !== 'string') {
    throw new Error('First name is required and must be a string');
  }

  if (!data.lastName || typeof data.lastName !== 'string') {
    throw new Error('Last name is required and must be a string');
  }

  if (!data.email || typeof data.email !== 'string') {
    throw new Error('Email is required and must be a string');
  }

  if (!data.birthDate || !(data.birthDate instanceof Date)) {
    throw new Error('Birth date is required and must be a Date object');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }

  const currentYear = new Date().getFullYear();
  const birthYear = data.birthDate.getFullYear();
  if (birthYear < 1900 || birthYear > currentYear) {
    throw new Error('Invalid birth year');
  }
}

// Utility functions with various text patterns
const createUserProcessor = (options: Partial<ProcessingOptions> = {}): DataProcessor => {
  const defaultOptions: ProcessingOptions = {
    validateEmail: true,
    enrichWithLocation: true,
    enrichWithBehavior: true,
    calculateRisk: true,
    cacheResults: true
  };

  return new DataProcessor({ ...defaultOptions, ...options });
};

const processMultipleUsers = async (
  users: UserData[],
  options?: ProcessingOptions
): Promise<ProcessingResult[]> => {
  const processor = createUserProcessor(options);
  const results: ProcessingResult[] = [];

  for (const user of users) {
    try {
      const result = await processUserData(user, options || {} as ProcessingOptions);
      results.push(result);
    } catch (error) {
      results.push({
        originalData: user,
        processedData: {} as EnrichedData,
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: []
      });
    }
  }

  return results;
};

// Constants and enums for practice
const DEFAULT_PROCESSING_OPTIONS: ProcessingOptions = {
  validateEmail: true,
  enrichWithLocation: false,
  enrichWithBehavior: false,
  calculateRisk: false,
  cacheResults: true
};

enum ProcessingMode {
  BASIC = 'basic',
  ENHANCED = 'enhanced',
  FULL = 'full'
}

enum ValidationLevel {
  NONE = 0,
  BASIC = 1,
  STRICT = 2,
  COMPREHENSIVE = 3
}

// Export statements for text object practice
export {
  type DatabaseConnection,
  type UserCredentials,
  type APIResponse,
  type UserData,
  type ProcessingOptions,
  type ProcessingResult,
  DataProcessor,
  processUserData,
  processMultipleUsers,
  validateUserData,
  createUserProcessor,
  DEFAULT_PROCESSING_OPTIONS,
  ProcessingMode,
  ValidationLevel
};

export default DataProcessor;