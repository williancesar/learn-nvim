/**
 * TypeScript Practice: Search Patterns
 *
 * This file contains TypeScript code with repetitive patterns designed for
 * practicing search commands (/, ?, *, #, n, N) and search pattern matching.
 *
 * Focus on searching for specific patterns, identifiers, and repeated structures.
 */

// API Response patterns - search for ApiResponse, ErrorResponse, SuccessResponse
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorResponse;
  timestamp: string;
  requestId: string;
}

interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, any>;
  stackTrace?: string;
}

interface SuccessResponse<T> extends ApiResponse<T> {
  success: true;
  data: T;
}

interface FailureResponse extends ApiResponse<never> {
  success: false;
  error: ErrorResponse;
}

// Database entity patterns - search for Entity, Repository, Service
abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor() {
    this.id = this.generateId();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  abstract validate(): boolean;
  abstract toJSON(): Record<string, any>;

  protected generateId(): string {
    return `entity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }
}

class UserEntity extends BaseEntity {
  username: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;

  constructor(userData: CreateUserData) {
    super();
    this.username = userData.username;
    this.email = userData.email;
    this.passwordHash = userData.passwordHash;
    this.profile = userData.profile;
  }

  validate(): boolean {
    return this.username.length >= 3 &&
           this.email.includes('@') &&
           this.passwordHash.length > 0;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      profile: this.profile,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

class ProductEntity extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];

  constructor(productData: CreateProductData) {
    super();
    this.name = productData.name;
    this.description = productData.description;
    this.price = productData.price;
    this.category = productData.category;
    this.tags = productData.tags;
  }

  validate(): boolean {
    return this.name.length > 0 &&
           this.price >= 0 &&
           this.category.length > 0;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      tags: this.tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

class OrderEntity extends BaseEntity {
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;

  constructor(orderData: CreateOrderData) {
    super();
    this.userId = orderData.userId;
    this.items = orderData.items;
    this.status = OrderStatus.PENDING;
    this.totalAmount = this.calculateTotal();
  }

  validate(): boolean {
    return this.userId.length > 0 &&
           this.items.length > 0 &&
           this.totalAmount > 0;
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      status: this.status,
      totalAmount: this.totalAmount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  private calculateTotal(): number {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

// Repository patterns - search for Repository, findById, findByEmail, findByUsername
interface Repository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(options?: FindOptions): Promise<T[]>;
  create(entity: T): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  count(filters?: Record<string, any>): Promise<number>;
}

interface UserRepository extends Repository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findByEmailOrUsername(identifier: string): Promise<UserEntity | null>;
}

interface ProductRepository extends Repository<ProductEntity> {
  findByCategory(category: string): Promise<ProductEntity[]>;
  findByTag(tag: string): Promise<ProductEntity[]>;
  findByPriceRange(min: number, max: number): Promise<ProductEntity[]>;
  searchByName(query: string): Promise<ProductEntity[]>;
}

interface OrderRepository extends Repository<OrderEntity> {
  findByUserId(userId: string): Promise<OrderEntity[]>;
  findByStatus(status: OrderStatus): Promise<OrderEntity[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<OrderEntity[]>;
}

// Service patterns - search for Service, create, update, delete
abstract class BaseService<T extends BaseEntity, R extends Repository<T>> {
  protected repository: R;
  protected logger: Logger;

  constructor(repository: R, logger: Logger) {
    this.repository = repository;
    this.logger = logger;
  }

  async findById(id: string): Promise<T | null> {
    this.logger.debug(`Finding entity by id: ${id}`);
    return await this.repository.findById(id);
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    this.logger.debug('Finding all entities', options);
    return await this.repository.findAll(options);
  }

  async create(entityData: any): Promise<T> {
    this.logger.info('Creating new entity', entityData);
    const entity = this.createEntity(entityData);
    await this.validateEntity(entity);
    return await this.repository.create(entity);
  }

  async update(id: string, updates: Partial<T>): Promise<T> {
    this.logger.info(`Updating entity ${id}`, updates);
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error(`Entity with id ${id} not found`);
    }
    return await this.repository.update(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    this.logger.info(`Deleting entity ${id}`);
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }
    return await this.repository.delete(id);
  }

  protected abstract createEntity(data: any): T;
  protected abstract validateEntity(entity: T): Promise<void>;
}

class UserService extends BaseService<UserEntity, UserRepository> {
  constructor(repository: UserRepository, logger: Logger) {
    super(repository, logger);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    this.logger.debug(`Finding user by email: ${email}`);
    return await this.repository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    this.logger.debug(`Finding user by username: ${username}`);
    return await this.repository.findByUsername(username);
  }

  async findByEmailOrUsername(identifier: string): Promise<UserEntity | null> {
    this.logger.debug(`Finding user by identifier: ${identifier}`);
    return await this.repository.findByEmailOrUsername(identifier);
  }

  protected createEntity(data: CreateUserData): UserEntity {
    return new UserEntity(data);
  }

  protected async validateEntity(entity: UserEntity): Promise<void> {
    if (!entity.validate()) {
      throw new Error('Invalid user entity');
    }

    const existingByEmail = await this.repository.findByEmail(entity.email);
    if (existingByEmail) {
      throw new Error('Email already exists');
    }

    const existingByUsername = await this.repository.findByUsername(entity.username);
    if (existingByUsername) {
      throw new Error('Username already exists');
    }
  }
}

class ProductService extends BaseService<ProductEntity, ProductRepository> {
  constructor(repository: ProductRepository, logger: Logger) {
    super(repository, logger);
  }

  async findByCategory(category: string): Promise<ProductEntity[]> {
    this.logger.debug(`Finding products by category: ${category}`);
    return await this.repository.findByCategory(category);
  }

  async findByTag(tag: string): Promise<ProductEntity[]> {
    this.logger.debug(`Finding products by tag: ${tag}`);
    return await this.repository.findByTag(tag);
  }

  async findByPriceRange(min: number, max: number): Promise<ProductEntity[]> {
    this.logger.debug(`Finding products by price range: ${min} - ${max}`);
    return await this.repository.findByPriceRange(min, max);
  }

  async searchByName(query: string): Promise<ProductEntity[]> {
    this.logger.debug(`Searching products by name: ${query}`);
    return await this.repository.searchByName(query);
  }

  protected createEntity(data: CreateProductData): ProductEntity {
    return new ProductEntity(data);
  }

  protected async validateEntity(entity: ProductEntity): Promise<void> {
    if (!entity.validate()) {
      throw new Error('Invalid product entity');
    }
  }
}

class OrderService extends BaseService<OrderEntity, OrderRepository> {
  constructor(repository: OrderRepository, logger: Logger) {
    super(repository, logger);
  }

  async findByUserId(userId: string): Promise<OrderEntity[]> {
    this.logger.debug(`Finding orders by user id: ${userId}`);
    return await this.repository.findByUserId(userId);
  }

  async findByStatus(status: OrderStatus): Promise<OrderEntity[]> {
    this.logger.debug(`Finding orders by status: ${status}`);
    return await this.repository.findByStatus(status);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<OrderEntity[]> {
    this.logger.debug(`Finding orders by date range: ${startDate} - ${endDate}`);
    return await this.repository.findByDateRange(startDate, endDate);
  }

  protected createEntity(data: CreateOrderData): OrderEntity {
    return new OrderEntity(data);
  }

  protected async validateEntity(entity: OrderEntity): Promise<void> {
    if (!entity.validate()) {
      throw new Error('Invalid order entity');
    }
  }
}

// Event patterns - search for Event, Handler, Listener
interface DomainEvent {
  id: string;
  type: string;
  timestamp: Date;
  data: Record<string, any>;
}

interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

interface EventListener<T extends DomainEvent> {
  listen(event: T): void;
}

class UserCreatedEvent implements DomainEvent {
  id: string;
  type: string = 'UserCreated';
  timestamp: Date;
  data: { userId: string; email: string; username: string };

  constructor(userId: string, email: string, username: string) {
    this.id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.data = { userId, email, username };
  }
}

class UserUpdatedEvent implements DomainEvent {
  id: string;
  type: string = 'UserUpdated';
  timestamp: Date;
  data: { userId: string; changes: Record<string, any> };

  constructor(userId: string, changes: Record<string, any>) {
    this.id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.data = { userId, changes };
  }
}

class UserDeletedEvent implements DomainEvent {
  id: string;
  type: string = 'UserDeleted';
  timestamp: Date;
  data: { userId: string };

  constructor(userId: string) {
    this.id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.data = { userId };
  }
}

class ProductCreatedEvent implements DomainEvent {
  id: string;
  type: string = 'ProductCreated';
  timestamp: Date;
  data: { productId: string; name: string; category: string };

  constructor(productId: string, name: string, category: string) {
    this.id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.data = { productId, name, category };
  }
}

class OrderCreatedEvent implements DomainEvent {
  id: string;
  type: string = 'OrderCreated';
  timestamp: Date;
  data: { orderId: string; userId: string; totalAmount: number };

  constructor(orderId: string, userId: string, totalAmount: number) {
    this.id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = new Date();
    this.data = { orderId, userId, totalAmount };
  }
}

// Handler patterns - search for Handler, handle
class UserCreatedHandler implements EventHandler<UserCreatedEvent> {
  constructor(private emailService: EmailService, private logger: Logger) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    this.logger.info('Handling UserCreated event', event.data);
    await this.emailService.sendWelcomeEmail(event.data.email, event.data.username);
  }
}

class UserUpdatedHandler implements EventHandler<UserUpdatedEvent> {
  constructor(private auditService: AuditService, private logger: Logger) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    this.logger.info('Handling UserUpdated event', event.data);
    await this.auditService.logUserUpdate(event.data.userId, event.data.changes);
  }
}

class UserDeletedHandler implements EventHandler<UserDeletedEvent> {
  constructor(private cleanupService: CleanupService, private logger: Logger) {}

  async handle(event: UserDeletedEvent): Promise<void> {
    this.logger.info('Handling UserDeleted event', event.data);
    await this.cleanupService.cleanupUserData(event.data.userId);
  }
}

class OrderCreatedHandler implements EventHandler<OrderCreatedEvent> {
  constructor(private inventoryService: InventoryService, private logger: Logger) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    this.logger.info('Handling OrderCreated event', event.data);
    await this.inventoryService.reserveItems(event.data.orderId);
  }
}

// Configuration patterns - search for Config, Settings, Options
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  poolSize: number;
  timeout: number;
}

interface CacheConfig {
  provider: 'redis' | 'memory';
  host?: string;
  port?: number;
  password?: string;
  ttl: number;
  maxMemory?: string;
}

interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text';
  destination: 'console' | 'file';
  filename?: string;
}

interface AuthConfig {
  secretKey: string;
  tokenExpiry: number;
  refreshTokenExpiry: number;
  saltRounds: number;
}

interface EmailConfig {
  provider: string;
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
}

interface ApplicationConfig {
  database: DatabaseConfig;
  cache: CacheConfig;
  logging: LoggingConfig;
  auth: AuthConfig;
  email: EmailConfig;
}

// Supporting interfaces and types
interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  profile: UserProfile;
}

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
}

interface CreateOrderData {
  userId: string;
  items: OrderItem[];
}

interface UserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface FindOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

interface Logger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
}

interface EmailService {
  sendWelcomeEmail(email: string, username: string): Promise<void>;
}

interface AuditService {
  logUserUpdate(userId: string, changes: Record<string, any>): Promise<void>;
}

interface CleanupService {
  cleanupUserData(userId: string): Promise<void>;
}

interface InventoryService {
  reserveItems(orderId: string): Promise<void>;
}

enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export {
  type ApiResponse,
  type ErrorResponse,
  type SuccessResponse,
  type FailureResponse,
  BaseEntity,
  UserEntity,
  ProductEntity,
  OrderEntity,
  type Repository,
  type UserRepository,
  type ProductRepository,
  type OrderRepository,
  BaseService,
  UserService,
  ProductService,
  OrderService,
  type DomainEvent,
  type EventHandler,
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
  ProductCreatedEvent,
  OrderCreatedEvent,
  UserCreatedHandler,
  UserUpdatedHandler,
  UserDeletedHandler,
  OrderCreatedHandler,
  type ApplicationConfig,
  OrderStatus
};