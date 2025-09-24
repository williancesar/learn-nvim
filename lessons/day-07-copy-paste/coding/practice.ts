/**
 * Day 07: Copy & Paste - TypeScript Practice
 *
 * NEOVIM PRACTICE INSTRUCTIONS:
 * 1. Use 'yy' to yank (copy) entire lines
 * 2. Practice 'yw' to yank words
 * 3. Use 'y$' to yank to end of line
 * 4. Practice 'p' to paste after cursor
 * 5. Use 'P' to paste before cursor
 * 6. Try visual mode 'v' + 'y' to copy selections
 * 7. Copy and duplicate the reusable patterns below
 * 8. Practice copying type definitions and interfaces
 */

// Reusable type patterns and interfaces to duplicate

// COPY THIS: Basic Entity Pattern - Duplicate this pattern for different entities
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// COPY THIS: Generic Repository Pattern - Reuse for different data types
interface Repository<T extends BaseEntity> {
  create(entity: Omit<T, keyof BaseEntity>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findMany(filter: Partial<T>): Promise<T[]>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}

// COPY THIS: API Response Pattern - Duplicate for different response types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  statusCode: number;
  timestamp: Date;
  errors?: ApiError[];
}

interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

// COPY THIS: Service Configuration Pattern - Reuse for different services
interface ServiceConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  apiKey?: string;
  headers?: Record<string, string>;
}

// COPY THIS: Generic Service Class Pattern - Duplicate and customize
abstract class BaseService<TEntity extends BaseEntity, TCreateDto, TUpdateDto> {
  protected config: ServiceConfig;
  protected repository: Repository<TEntity>;

  constructor(config: ServiceConfig, repository: Repository<TEntity>) {
    this.config = config;
    this.repository = repository;
  }

  async create(data: TCreateDto): Promise<ApiResponse<TEntity>> {
    try {
      const entity = await this.repository.create(data as any);
      return this.createSuccessResponse(entity, 'Entity created successfully', 201);
    } catch (error) {
      return this.createErrorResponse(error, 400);
    }
  }

  async findById(id: string): Promise<ApiResponse<TEntity | null>> {
    try {
      const entity = await this.repository.findById(id);
      return this.createSuccessResponse(entity, 'Entity retrieved successfully');
    } catch (error) {
      return this.createErrorResponse(error, 404);
    }
  }

  async update(id: string, data: TUpdateDto): Promise<ApiResponse<TEntity>> {
    try {
      const entity = await this.repository.update(id, data as any);
      return this.createSuccessResponse(entity, 'Entity updated successfully');
    } catch (error) {
      return this.createErrorResponse(error, 400);
    }
  }

  async delete(id: string): Promise<ApiResponse<boolean>> {
    try {
      const result = await this.repository.delete(id);
      return this.createSuccessResponse(result, 'Entity deleted successfully');
    } catch (error) {
      return this.createErrorResponse(error, 400);
    }
  }

  protected createSuccessResponse<T>(
    data: T,
    message: string,
    statusCode: number = 200
  ): ApiResponse<T> {
    return {
      data,
      success: true,
      message,
      statusCode,
      timestamp: new Date()
    };
  }

  protected createErrorResponse(
    error: any,
    statusCode: number = 500
  ): ApiResponse<any> {
    return {
      data: null,
      success: false,
      message: error.message || 'An error occurred',
      statusCode,
      timestamp: new Date(),
      errors: [{
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred'
      }]
    };
  }
}

// COPY THIS: Validation Decorator Pattern - Reuse for different validations
function ValidateRequired(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    for (const arg of args) {
      if (arg === null || arg === undefined) {
        throw new Error(`Required parameter is missing in ${propertyKey}`);
      }
    }
    return originalMethod.apply(this, args);
  };
}

// COPY THIS: Logging Decorator Pattern - Duplicate for different log levels
function LogInfo(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`[INFO] Calling ${propertyKey} with:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`[INFO] ${propertyKey} returned:`, result);
    return result;
  };
}

// COPY THIS: Cache Decorator Pattern - Reuse with different TTL values
function Cacheable(ttl: number = 300000) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, { value: any; expiry: number }>();

    descriptor.value = async function (...args: any[]) {
      const key = JSON.stringify(args);
      const cached = cache.get(key);

      if (cached && cached.expiry > Date.now()) {
        return cached.value;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(key, { value: result, expiry: Date.now() + ttl });
      return result;
    };
  };
}

// COPY THIS: Utility Types Pattern - Duplicate for different transformations
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

// COPY THIS: Error Handling Pattern - Reuse for different error types
class BaseError extends Error {
  public code: string;
  public statusCode: number;
  public details?: Record<string, any>;

  constructor(
    message: string,
    code: string = 'GENERIC_ERROR',
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// COPY THIS: Event Emitter Pattern - Duplicate for different event types
interface EventMap {
  created: { id: string; timestamp: Date };
  updated: { id: string; changes: Record<string, any>; timestamp: Date };
  deleted: { id: string; timestamp: Date };
}

class EventEmitter<T extends Record<string, any> = EventMap> {
  private listeners: Map<keyof T, Array<(data: T[keyof T]) => void>> = new Map();

  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => listener(data));
    }
  }

  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
}

// COPY THESE: Example Entity Implementations
// TODO: Copy the BaseEntity pattern above and create User entity
// TODO: Copy the Repository pattern and create UserRepository
// TODO: Copy the ServiceConfig pattern for UserServiceConfig
// TODO: Copy the BaseService pattern and create UserService
// TODO: Copy the BaseError pattern and create UserNotFoundError

// PRACTICE AREA: Copy and paste the patterns above to create:
// 1. Product entity (copy BaseEntity pattern)
// 2. ProductRepository (copy Repository pattern)
// 3. ProductService (copy BaseService pattern)
// 4. ProductCreatedEvent (copy EventMap pattern)
// 5. ProductError classes (copy BaseError pattern)

// Example implementation to copy from:
interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

interface UserCreateDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface UserUpdateDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

class UserNotFoundError extends BaseError {
  constructor(id: string) {
    super(
      `User with id ${id} not found`,
      'USER_NOT_FOUND',
      404,
      { userId: id }
    );
  }
}

class UserService extends BaseService<User, UserCreateDto, UserUpdateDto> {
  @ValidateRequired
  @LogInfo
  @Cacheable(60000)
  async findByEmail(email: string): Promise<ApiResponse<User | null>> {
    try {
      const users = await this.repository.findMany({ email } as any);
      const user = users.length > 0 ? users[0] : null;
      return this.createSuccessResponse(user, 'User found by email');
    } catch (error) {
      return this.createErrorResponse(error, 404);
    }
  }
}

// TODO: Practice copying the above patterns to create similar implementations

export {
  BaseEntity,
  Repository,
  ApiResponse,
  ServiceConfig,
  BaseService,
  BaseError,
  EventEmitter,
  User,
  UserService,
  UserNotFoundError
};