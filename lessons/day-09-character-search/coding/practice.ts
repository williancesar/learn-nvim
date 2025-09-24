/**
 * Day 9: Character Search Practice with TypeScript
 *
 * This file contains complex type definitions with many symbols to practice f/F/t/T movements.
 * Use these commands to navigate efficiently:
 * - f{char}: Move forward to next occurrence of {char}
 * - F{char}: Move backward to previous occurrence of {char}
 * - t{char}: Move forward until (before) next occurrence of {char}
 * - T{char}: Move backward until (after) previous occurrence of {char}
 * - ; : Repeat last f/F/t/T movement
 * - , : Repeat last f/F/t/T movement in opposite direction
 *
 * Practice finding: ( ) [ ] { } < > : ; , . " ' = + - * / & | ! ? @ # $ % ^ ~
 */

// Complex generic utility types with many symbols
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T[P] extends Function
    ? T[P]
    : T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

type NonNullable<T> = T extends null | undefined ? never : T;

type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;

type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

type ConstructorParameters<T extends abstract new (...args: any) => any> = T extends abstract new (...args: infer P) => any ? P : never;

// Advanced conditional types with symbols
type IsArray<T> = T extends readonly any[] ? true : false;
type IsFunction<T> = T extends (...args: any[]) => any ? true : false;
type IsObject<T> = T extends object ? (T extends Function ? false : true) : false;

type ExtractFromUnion<T, U extends T> = T extends U ? T : never;
type ExcludeFromUnion<T, U> = T extends U ? never : T;

type KeysMatching<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Complex mapped types with various symbols
type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type MakeRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

type Flatten<T> = T extends ReadonlyArray<infer U> ? U : T;
type Head<T extends ReadonlyArray<any>> = T extends ReadonlyArray<infer H> ? H : never;
type Tail<T extends ReadonlyArray<any>> = T extends readonly [any, ...infer Rest] ? Rest : [];

// String manipulation types with template literals
type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${CamelCase<P3>}`
  : S;

type KebabCase<S extends string> = S extends `${infer C}${infer T}`
  ? `${C extends Uppercase<C> ? `-${Lowercase<C>}` : C}${KebabCase<T>}`
  : S;

type SnakeCase<S extends string> = S extends `${infer C}${infer T}`
  ? `${C extends Uppercase<C> ? `_${Lowercase<C>}` : C}${SnakeCase<T>}`
  : S;

// Database schema with complex type relationships
interface DatabaseSchema {
  users: {
    id: number;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
    profile?: UserProfile;
    roles: Role[];
    permissions: Permission[];
  };

  posts: {
    id: number;
    title: string;
    content: string;
    author_id: number;
    created_at: Date;
    updated_at: Date;
    published: boolean;
    tags: Tag[];
    comments: Comment[];
    metadata: Record<string, unknown>;
  };

  comments: {
    id: number;
    post_id: number;
    author_id: number;
    content: string;
    parent_id?: number;
    created_at: Date;
    updated_at: Date;
    replies?: Comment[];
  };
}

// Complex interface definitions with many symbols
interface UserProfile {
  bio?: string;
  avatar_url?: string;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  statistics: {
    posts_count: number;
    comments_count: number;
    likes_received: number;
    followers_count: number;
    following_count: number;
  };
}

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
  created_at: Date;
  updated_at: Date;
}

interface Permission {
  id: number;
  name: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
  conditions?: Record<string, any>;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  created_at: Date;
  post_count: number;
}

interface Comment {
  id: number;
  content: string;
  author: Pick<DatabaseSchema['users'], 'id' | 'email' | 'profile'>;
  created_at: Date;
  updated_at: Date;
  likes_count: number;
  parent_id?: number;
  replies?: Comment[];
}

// API response types with complex nesting
type ApiResponse<T> = {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
    has_more?: boolean;
  };
} | {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

type PaginatedResponse<T> = ApiResponse<T[]> & {
  success: true;
  meta: {
    total: number;
    page: number;
    per_page: number;
    has_more: boolean;
    links: {
      first?: string;
      last?: string;
      prev?: string;
      next?: string;
    };
  };
};

// Complex generic class with many type parameters
class Repository<
  TEntity extends Record<string, any>,
  TCreateInput extends Partial<TEntity>,
  TUpdateInput extends Partial<TEntity>,
  TQueryOptions extends Record<string, any> = {}
> {
  constructor(
    private readonly tableName: string,
    private readonly primaryKey: keyof TEntity = 'id' as keyof TEntity
  ) {}

  async findById<K extends keyof TEntity>(
    id: TEntity[K],
    options?: { include?: (keyof TEntity)[] }
  ): Promise<TEntity | null> {
    // Implementation here...
    return null;
  }

  async findMany(
    where?: Partial<TEntity>,
    options?: TQueryOptions & {
      limit?: number;
      offset?: number;
      orderBy?: { [K in keyof TEntity]?: 'asc' | 'desc' };
      include?: (keyof TEntity)[];
    }
  ): Promise<TEntity[]> {
    // Implementation here...
    return [];
  }

  async create(data: TCreateInput): Promise<TEntity> {
    // Implementation here...
    return {} as TEntity;
  }

  async update(
    id: TEntity[keyof TEntity],
    data: TUpdateInput
  ): Promise<TEntity | null> {
    // Implementation here...
    return null;
  }

  async delete(id: TEntity[keyof TEntity]): Promise<boolean> {
    // Implementation here...
    return false;
  }

  async count(where?: Partial<TEntity>): Promise<number> {
    // Implementation here...
    return 0;
  }
}

// Complex function signatures with many symbols
type QueryBuilder<T> = {
  where<K extends keyof T>(field: K, operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN', value: T[K] | T[K][]): QueryBuilder<T>;
  and<K extends keyof T>(field: K, operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN', value: T[K] | T[K][]): QueryBuilder<T>;
  or<K extends keyof T>(field: K, operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN', value: T[K] | T[K][]): QueryBuilder<T>;
  orderBy<K extends keyof T>(field: K, direction?: 'ASC' | 'DESC'): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  offset(count: number): QueryBuilder<T>;
  groupBy<K extends keyof T>(...fields: K[]): QueryBuilder<T>;
  having<K extends keyof T>(field: K, operator: '=' | '!=' | '>' | '<' | '>=' | '<=', value: T[K]): QueryBuilder<T>;
  join<U>(table: string, condition: string): QueryBuilder<T & U>;
  leftJoin<U>(table: string, condition: string): QueryBuilder<T & Partial<U>>;
  rightJoin<U>(table: string, condition: string): QueryBuilder<Partial<T> & U>;
  execute(): Promise<T[]>;
  first(): Promise<T | null>;
  count(): Promise<number>;
  exists(): Promise<boolean>;
};

// Event system with complex type definitions
interface EventMap {
  'user:created': { user: DatabaseSchema['users']; timestamp: Date };
  'user:updated': { user: DatabaseSchema['users']; changes: Partial<DatabaseSchema['users']>; timestamp: Date };
  'user:deleted': { userId: number; timestamp: Date };
  'post:created': { post: DatabaseSchema['posts']; timestamp: Date };
  'post:updated': { post: DatabaseSchema['posts']; changes: Partial<DatabaseSchema['posts']>; timestamp: Date };
  'post:published': { post: DatabaseSchema['posts']; timestamp: Date };
  'comment:created': { comment: Comment; timestamp: Date };
  'comment:liked': { commentId: number; userId: number; timestamp: Date };
}

type EventListener<T extends keyof EventMap> = (event: EventMap[T]) => void | Promise<void>;

class EventEmitter {
  private listeners: {
    [K in keyof EventMap]?: Set<EventListener<K>>;
  } = {};

  on<T extends keyof EventMap>(event: T, listener: EventListener<T>): this {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event]!.add(listener);
    return this;
  }

  off<T extends keyof EventMap>(event: T, listener: EventListener<T>): this {
    this.listeners[event]?.delete(listener);
    return this;
  }

  emit<T extends keyof EventMap>(event: T, data: EventMap[T]): Promise<void[]> {
    const eventListeners = this.listeners[event];
    if (!eventListeners || eventListeners.size === 0) {
      return Promise.resolve([]);
    }

    const promises = Array.from(eventListeners).map(listener =>
      Promise.resolve(listener(data))
    );

    return Promise.all(promises);
  }

  once<T extends keyof EventMap>(event: T, listener: EventListener<T>): this {
    const onceWrapper: EventListener<T> = (data) => {
      this.off(event, onceWrapper);
      return listener(data);
    };
    return this.on(event, onceWrapper);
  }
}

// Complex validation types with symbols
type ValidationSchema<T> = {
  [K in keyof T]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'url' | 'array' | 'object';
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: T[K]) => boolean | string;
    transform?: (value: any) => T[K];
  };
};

type ValidationResult<T> = {
  isValid: boolean;
  errors: {
    [K in keyof T]?: string[];
  };
  data?: T;
};

class Validator<T extends Record<string, any>> {
  constructor(private schema: ValidationSchema<T>) {}

  validate(data: unknown): ValidationResult<T> {
    // Complex validation logic with many operators and symbols
    const errors: { [K in keyof T]?: string[] } = {};
    const result = {} as T;

    for (const [key, rules] of Object.entries(this.schema)) {
      const value = (data as any)?.[key];
      const fieldErrors: string[] = [];

      if (rules.required && (value === undefined || value === null || value === '')) {
        fieldErrors.push(`${key} is required`);
        continue;
      }

      if (value !== undefined && value !== null) {
        // Type validation with complex conditions
        if (rules.type && typeof value !== rules.type) {
          fieldErrors.push(`${key} must be of type ${rules.type}`);
        }

        // Range validation with comparison operators
        if (rules.min !== undefined && value < rules.min) {
          fieldErrors.push(`${key} must be at least ${rules.min}`);
        }

        if (rules.max !== undefined && value > rules.max) {
          fieldErrors.push(`${key} must be at most ${rules.max}`);
        }

        // Pattern validation with regex symbols
        if (rules.pattern && !rules.pattern.test(value)) {
          fieldErrors.push(`${key} format is invalid`);
        }

        // Custom validation with function calls
        if (rules.custom) {
          const customResult = rules.custom(value);
          if (typeof customResult === 'string') {
            fieldErrors.push(customResult);
          } else if (!customResult) {
            fieldErrors.push(`${key} failed custom validation`);
          }
        }

        // Transform with assignment and ternary operators
        result[key as keyof T] = rules.transform ? rules.transform(value) : value;
      }

      if (fieldErrors.length > 0) {
        errors[key as keyof T] = fieldErrors;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      data: Object.keys(errors).length === 0 ? result : undefined
    };
  }
}

// Export all types and classes for use
export type {
  DatabaseSchema,
  UserProfile,
  Role,
  Permission,
  Tag,
  Comment,
  ApiResponse,
  PaginatedResponse,
  QueryBuilder,
  EventMap,
  EventListener,
  ValidationSchema,
  ValidationResult,
  DeepReadonly,
  NonNullable,
  ReturnType,
  Parameters,
  ConstructorParameters,
  IsArray,
  IsFunction,
  IsObject,
  ExtractFromUnion,
  ExcludeFromUnion,
  KeysMatching,
  MakeOptional,
  MakeRequired,
  Flatten,
  Head,
  Tail,
  CamelCase,
  KebabCase,
  SnakeCase
};

export {
  Repository,
  EventEmitter,
  Validator
};