/**
 * Day 32: Advanced Visual Operations - TypeScript Code for Visual Mode Practice
 *
 * This file contains TypeScript code designed for practicing advanced visual
 * mode operations. Practice visual block mode, visual line mode, and complex
 * text object selections with TypeScript constructs.
 *
 * Visual Operations Objectives:
 * - Use V for visual line mode
 * - Use v for visual character mode
 * - Use Ctrl+v for visual block mode
 * - Practice visual text objects: vit, vat, vi{, va{, vi", va", etc.
 * - Use gv to reselect the last visual selection
 */

// ========== ALIGNED CODE FOR VISUAL BLOCK MODE ==========
// Practice visual block mode to edit multiple lines simultaneously

interface ApiEndpoint {
  method   : 'GET'    | 'POST'   | 'PUT'    | 'DELETE';
  path     : string;
  handler  : Function;
  auth     : boolean;
  rateLimit: number;
}

interface DatabaseConfig {
  host     : string;
  port     : number;
  username : string;
  password : string;
  database : string;
  ssl      : boolean;
  pool     : { min: number; max: number; };
}

interface UserPermissions {
  read     : boolean;
  write    : boolean;
  delete   : boolean;
  admin    : boolean;
  moderate : boolean;
}

// Practice: Use visual block mode to align the colons
const API_ROUTES = [
  { method: 'GET',    path: '/users',        handler: getUsers,       auth: true,  rateLimit: 100 },
  { method: 'POST',   path: '/users',        handler: createUser,     auth: true,  rateLimit: 50  },
  { method: 'GET',    path: '/users/:id',    handler: getUserById,    auth: true,  rateLimit: 200 },
  { method: 'PUT',    path: '/users/:id',    handler: updateUser,     auth: true,  rateLimit: 50  },
  { method: 'DELETE', path: '/users/:id',    handler: deleteUser,     auth: true,  rateLimit: 10  },
  { method: 'GET',    path: '/products',     handler: getProducts,    auth: false, rateLimit: 300 },
  { method: 'POST',   path: '/products',     handler: createProduct,  auth: true,  rateLimit: 25  },
  { method: 'GET',    path: '/products/:id', handler: getProductById, auth: false, rateLimit: 500 },
];

// ========== NESTED OBJECTS FOR VISUAL SELECTION ==========
// Practice selecting entire objects, inner objects, and specific properties

const APPLICATION_CONFIG = {
  server: {
    host: 'localhost',
    port: 3000,
    cors: {
      origin: ['http://localhost:3000', 'https://app.example.com'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    },
    middleware: {
      logging: true,
      compression: true,
      security: {
        helmet: true,
        rateLimit: {
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100 // requests per window
        }
      }
    }
  },
  database: {
    type: 'postgresql',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'myapp'
    },
    pool: {
      min: 0,
      max: 10,
      idle: 10000
    },
    migrations: {
      directory: './migrations',
      tableName: 'knex_migrations'
    }
  },
  redis: {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB) || 0
    },
    options: {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: 3
    }
  }
};

// ========== TYPESCRIPT GENERICS FOR VISUAL TEXT OBJECTS ==========
// Practice selecting generic constraints, type parameters, and return types

export class Repository<
  TEntity extends Record<string, unknown>,
  TKey extends keyof TEntity = 'id'
> {
  constructor(
    private readonly tableName: string,
    private readonly primaryKey: TKey,
    private readonly db: Database
  ) {}

  async findById<TResult = TEntity>(
    id: TEntity[TKey]
  ): Promise<TResult | null> {
    const query = this.db
      .select('*')
      .from(this.tableName)
      .where(this.primaryKey as string, id)
      .first();

    return (await query) as TResult || null;
  }

  async findMany<TResult = TEntity>(
    conditions: Partial<TEntity>,
    options?: {
      limit?: number;
      offset?: number;
      orderBy?: Array<{ column: keyof TEntity; order: 'asc' | 'desc' }>;
    }
  ): Promise<TResult[]> {
    let query = this.db
      .select('*')
      .from(this.tableName)
      .where(conditions);

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    if (options?.orderBy) {
      options.orderBy.forEach(({ column, order }) => {
        query = query.orderBy(column as string, order);
      });
    }

    return (await query) as TResult[];
  }

  async create<TInput extends Omit<TEntity, TKey>>(
    data: TInput
  ): Promise<TEntity> {
    const [result] = await this.db
      .insert(data)
      .into(this.tableName)
      .returning('*');

    return result as TEntity;
  }

  async update<TInput extends Partial<Omit<TEntity, TKey>>>(
    id: TEntity[TKey],
    updates: TInput
  ): Promise<TEntity | null> {
    const [result] = await this.db
      .update(updates)
      .from(this.tableName)
      .where(this.primaryKey as string, id)
      .returning('*');

    return result as TEntity || null;
  }

  async delete(id: TEntity[TKey]): Promise<boolean> {
    const deletedCount = await this.db
      .delete()
      .from(this.tableName)
      .where(this.primaryKey as string, id);

    return deletedCount > 0;
  }
}

// ========== COMPLEX TYPE DEFINITIONS FOR VISUAL SELECTION ==========
// Practice selecting conditional types, mapped types, and utility types

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
    : T[P];
};

type ExtractArrayType<T> = T extends Array<infer U>
  ? U
  : T extends ReadonlyArray<infer U>
  ? U
  : never;

type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionKeys<T>>;

type MethodKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type Methods<T> = Pick<T, MethodKeys<T>>;

// ========== INTERFACE HIERARCHIES FOR VISUAL OPERATIONS ==========
// Practice selecting extends clauses, method signatures, and property groups

interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

interface TimestampEntity extends BaseEntity {
  createdBy: string;
  updatedBy: string;
  deletedAt?: Date;
  deletedBy?: string;
}

interface User extends TimestampEntity {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: UserPermission[];
  profile: UserProfile;
  settings: UserSettings;
  sessions: UserSession[];
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
  };
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showPhone: boolean;
    allowMessaging: boolean;
  };
}

// ========== FUNCTION SIGNATURES FOR VISUAL SELECTION ==========
// Practice selecting parameter lists, return types, and function bodies

async function authenticateUser(
  credentials: {
    email: string;
    password: string;
  },
  options?: {
    rememberMe?: boolean;
    ipAddress?: string;
    userAgent?: string;
  }
): Promise<{
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}> {
  // Validate credentials format
  if (!credentials.email || !credentials.password) {
    throw new AuthenticationError('Email and password are required');
  }

  // Find user by email
  const user = await userRepository.findByEmail(credentials.email);
  if (!user) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(
    credentials.password,
    user.passwordHash
  );
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid credentials');
  }

  // Generate tokens
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: options?.rememberMe ? '30d' : '24h'
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      type: 'refresh'
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: '90d'
    }
  );

  // Create session record
  await sessionRepository.create({
    userId: user.id,
    token,
    refreshToken,
    ipAddress: options?.ipAddress,
    userAgent: options?.userAgent,
    expiresAt: new Date(Date.now() + (options?.rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000)
  });

  return {
    user: excludeFields(user, ['passwordHash']),
    token,
    refreshToken,
    expiresAt: new Date(Date.now() + (options?.rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000)
  };
}

// ========== ARRAY AND OBJECT LITERALS FOR VISUAL SELECTION ==========
// Practice selecting array elements, object properties, and nested structures

const VALIDATION_RULES = {
  user: {
    email: [
      { rule: 'required', message: 'Email is required' },
      { rule: 'email', message: 'Invalid email format' },
      { rule: 'maxLength', value: 255, message: 'Email too long' }
    ],
    password: [
      { rule: 'required', message: 'Password is required' },
      { rule: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
      { rule: 'pattern', value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Password must contain uppercase, lowercase, and number' }
    ],
    firstName: [
      { rule: 'required', message: 'First name is required' },
      { rule: 'minLength', value: 2, message: 'First name too short' },
      { rule: 'maxLength', value: 50, message: 'First name too long' }
    ],
    lastName: [
      { rule: 'required', message: 'Last name is required' },
      { rule: 'minLength', value: 2, message: 'Last name too short' },
      { rule: 'maxLength', value: 50, message: 'Last name too long' }
    ]
  },
  product: {
    name: [
      { rule: 'required', message: 'Product name is required' },
      { rule: 'minLength', value: 3, message: 'Product name too short' },
      { rule: 'maxLength', value: 200, message: 'Product name too long' }
    ],
    price: [
      { rule: 'required', message: 'Price is required' },
      { rule: 'min', value: 0, message: 'Price cannot be negative' },
      { rule: 'max', value: 999999.99, message: 'Price too high' }
    ],
    category: [
      { rule: 'required', message: 'Category is required' },
      { rule: 'enum', values: ['electronics', 'clothing', 'books', 'home'], message: 'Invalid category' }
    ]
  }
};

// ========== CLASS DEFINITIONS FOR VISUAL SELECTION ==========
// Practice selecting class methods, properties, decorators, and access modifiers

export class UserService {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
    private readonly cacheService: CacheService,
    private readonly logger: Logger
  ) {}

  @Cached('user:profile', 300) // Cache for 5 minutes
  async getUserProfile(
    userId: string,
    includePrivate: boolean = false
  ): Promise<UserProfile> {
    this.logger.info(`Fetching user profile for ${userId}`);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const profile = user.profile;

    if (!includePrivate) {
      delete profile.phoneNumber;
      delete profile.dateOfBirth;
    }

    return profile;
  }

  @RateLimit(10, '1m') // 10 requests per minute
  @ValidateInput(UserUpdateSchema)
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>,
    updatedBy: string
  ): Promise<UserProfile> {
    this.logger.info(`Updating user profile for ${userId} by ${updatedBy}`);

    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Validate updates
    const validatedUpdates = await this.validateProfileUpdates(updates);

    // Update user profile
    const updatedUser = await this.userRepository.update(userId, {
      profile: { ...existingUser.profile, ...validatedUpdates },
      updatedBy,
      updatedAt: new Date()
    });

    // Clear cache
    await this.cacheService.delete(`user:profile:${userId}`);

    // Send notification email if email changed
    if (updates.email && updates.email !== existingUser.email) {
      await this.emailService.sendProfileUpdateNotification(
        updatedUser.email,
        'Email address updated'
      );
    }

    return updatedUser.profile;
  }

  private async validateProfileUpdates(
    updates: Partial<UserProfile>
  ): Promise<Partial<UserProfile>> {
    const validatedUpdates: Partial<UserProfile> = {};

    // Validate each field if provided
    if (updates.bio !== undefined) {
      if (updates.bio.length > 500) {
        throw new ValidationError('Bio too long', 'bio', updates.bio);
      }
      validatedUpdates.bio = updates.bio.trim();
    }

    if (updates.website !== undefined) {
      if (!isValidUrl(updates.website)) {
        throw new ValidationError('Invalid website URL', 'website', updates.website);
      }
      validatedUpdates.website = updates.website;
    }

    if (updates.phoneNumber !== undefined) {
      if (!isValidPhoneNumber(updates.phoneNumber)) {
        throw new ValidationError('Invalid phone number', 'phoneNumber', updates.phoneNumber);
      }
      validatedUpdates.phoneNumber = updates.phoneNumber;
    }

    return validatedUpdates;
  }
}

// ========== VISUAL PRACTICE EXERCISES ==========
/*
VISUAL MODE PRACTICE EXERCISES:

1. Visual Line Mode (V):
   - Select entire interface definitions
   - Select complete method implementations
   - Select configuration objects

2. Visual Character Mode (v):
   - Select specific type annotations
   - Select parameter lists
   - Select property names

3. Visual Block Mode (Ctrl+v):
   - Align colons in object literals
   - Edit multiple similar lines simultaneously
   - Add/remove prefixes from multiple lines

4. Text Objects:
   - vi{ to select inside braces
   - va{ to select including braces
   - vit to select inside tags (for JSX)
   - vi" to select inside quotes
   - va" to select including quotes

5. Advanced Visual Operations:
   - Use gv to reselect last visual selection
   - Use o to toggle cursor position in visual mode
   - Use V followed by motion for line-wise selection
   - Use visual mode with search (/, ?, *, #)
*/