/**
 * TypeScript Practice: Quote and Bracket Objects
 *
 * This file contains extensive use of quotes, brackets, and parentheses
 * designed for practicing quote/bracket text objects (i", a", i', a', i`, a`, i[, a[, i{, a{, i(, a)).
 *
 * Focus on selecting content within various delimiters and brackets.
 */

// String literals with various quote types for practice
const stringExamples = {
  singleQuoted: 'This is a single-quoted string with "nested double quotes" inside',
  doubleQuoted: "This is a double-quoted string with 'nested single quotes' inside",
  templateLiteral: `This is a template literal with ${42} interpolation and "quotes" and 'apostrophes'`,
  complexTemplate: `
    Multi-line template literal
    with various 'quote types' and "nested quotes"
    and even \`backticks\` inside
  `,
  jsonString: '{"key": "value", "nested": {"array": [1, 2, 3]}}',
  regexString: '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/',
  pathString: '/usr/local/bin/node --version --help',
  urlString: 'https://api.example.com/v1/users?page=1&limit=10&sort="name"'
};

// Complex generics with nested angle brackets
type DeepNested<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? DeepNested<T[K]>
    : T[K] extends Array<infer U>
    ? Array<DeepNested<U>>
    : T[K] extends Promise<infer P>
    ? Promise<DeepNested<P>>
    : T[K];
};

type ConditionalType<T> = T extends string
  ? string[]
  : T extends number
  ? number[]
  : T extends boolean
  ? boolean[]
  : T extends Array<infer U>
  ? Array<ConditionalType<U>>
  : T extends Record<string, infer V>
  ? Record<string, ConditionalType<V>>
  : never;

type MappedType<T extends Record<string, any>> = {
  readonly [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
} & {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

// Interface with complex generic constraints
interface Repository<TEntity, TKey = string> {
  findById(id: TKey): Promise<TEntity | null>;
  findMany(query: QueryBuilder<TEntity>): Promise<TEntity[]>;
  create(data: Omit<TEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<TEntity>;
  update(id: TKey, data: Partial<TEntity>): Promise<TEntity>;
  delete(id: TKey): Promise<boolean>;
}

interface QueryBuilder<T> {
  where<K extends keyof T>(field: K, operator: 'eq' | 'ne' | 'gt' | 'lt' | 'in', value: T[K] | T[K][]): QueryBuilder<T>;
  orderBy<K extends keyof T>(field: K, direction: 'asc' | 'desc'): QueryBuilder<T>;
  limit(count: number): QueryBuilder<T>;
  offset(count: number): QueryBuilder<T>;
}

// Function with complex parameter types and brackets
function processComplexData<
  TInput extends Record<string, any>,
  TOutput = Partial<TInput>,
  TOptions extends { [key: string]: any } = {}
>(
  input: TInput,
  transformers: Array<(data: TInput, options: TOptions) => TInput>,
  validators: Array<(data: TInput) => boolean>,
  options: TOptions & { strict?: boolean; async?: boolean }
): Promise<TOutput> {
  return new Promise((resolve, reject) => {
    try {
      const processedData = transformers.reduce(
        (acc, transformer) => transformer(acc, options),
        input
      );

      const isValid = validators.every((validator) => validator(processedData));

      if (!isValid && options.strict) {
        reject(new Error('Validation failed'));
        return;
      }

      resolve(processedData as TOutput);
    } catch (error) {
      reject(error);
    }
  });
}

// Object with nested brackets and various quote types
const configurationObject = {
  database: {
    connections: {
      primary: {
        host: 'localhost',
        port: 5432,
        database: 'app_prod',
        credentials: {
          username: 'user',
          password: 'secure_password_123!@#'
        }
      },
      secondary: {
        host: 'replica.example.com',
        port: 5433,
        database: 'app_replica',
        credentials: {
          username: 'readonly_user',
          password: 'readonly_pass_456$%^'
        }
      }
    },
    pooling: {
      min: 5,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    }
  },
  cache: {
    redis: {
      host: 'cache.example.com',
      port: 6379,
      password: 'redis_secret_789&*()',
      keyPrefix: 'app:cache:',
      ttl: 3600
    },
    memory: {
      maxSize: '1GB',
      evictionPolicy: 'lru'
    }
  },
  logging: {
    level: 'info',
    transports: [
      {
        type: 'file',
        filename: '/var/log/app.log',
        maxSize: '100MB',
        maxFiles: 5
      },
      {
        type: 'console',
        format: 'json',
        colorize: true
      }
    ]
  }
};

// Class with methods containing various bracket types
class DataProcessor<T extends Record<string, any>> {
  private cache: Map<string, T>;
  private validators: Array<(data: T) => boolean>;

  constructor(
    private options: {
      cacheSize: number;
      ttl: number;
      strict: boolean;
      transformers: Array<(data: T) => T>;
    }
  ) {
    this.cache = new Map();
    this.validators = [
      (data: T) => Object.keys(data).length > 0,
      (data: T) => data !== null && data !== undefined,
      (data: T) => typeof data === 'object'
    ];
  }

  process(data: T): Promise<T> {
    const cacheKey = this.generateCacheKey(data);

    if (this.cache.has(cacheKey)) {
      return Promise.resolve(this.cache.get(cacheKey)!);
    }

    return this.processInternal(data).then((result) => {
      this.cache.set(cacheKey, result);
      return result;
    });
  }

  private async processInternal(data: T): Promise<T> {
    let processed = { ...data };

    for (const transformer of this.options.transformers) {
      processed = transformer(processed);
    }

    const validationResults = this.validators.map((validator) => ({
      valid: validator(processed),
      validator: validator.toString()
    }));

    if (this.options.strict && validationResults.some(({ valid }) => !valid)) {
      const failedValidators = validationResults
        .filter(({ valid }) => !valid)
        .map(({ validator }) => validator);

      throw new Error(`Validation failed: ${failedValidators.join(', ')}`);
    }

    return processed;
  }

  private generateCacheKey(data: T): string {
    const keys = Object.keys(data).sort();
    const values = keys.map((key) => `${key}:${JSON.stringify(data[key])}`);
    return `cache_${values.join('|')}`;
  }
}

// Array operations with nested brackets
const arrayOperations = {
  nestedArrays: [
    ['string1', 'string2', 'string3'],
    [{ key: 'value1', nested: { deep: 'value' } }],
    [1, 2, 3, [4, 5, [6, 7, 8]]],
    [true, false, null, undefined]
  ],

  objectArrays: [
    {
      id: 'user1',
      data: { name: 'John', preferences: { theme: 'dark', lang: 'en' } }
    },
    {
      id: 'user2',
      data: { name: 'Jane', preferences: { theme: 'light', lang: 'es' } }
    }
  ],

  functionArrays: [
    (x: number) => x * 2,
    (x: number) => x + 1,
    (x: number) => Math.pow(x, 2),
    (x: number) => Math.sqrt(x)
  ]
};

// Function calls with complex parameter lists
const results = processComplexData(
  {
    users: ['user1', 'user2', 'user3'],
    settings: { theme: 'dark', language: 'en' },
    metadata: { version: '1.0.0', timestamp: new Date() }
  },
  [
    (data) => ({ ...data, processed: true }),
    (data) => ({ ...data, timestamp: new Date().toISOString() }),
    (data, options) => ({ ...data, options: JSON.stringify(options) })
  ],
  [
    (data) => data.hasOwnProperty('users'),
    (data) => Array.isArray(data.users),
    (data) => data.settings !== null
  ],
  {
    strict: true,
    async: false,
    timeout: 5000,
    retries: 3
  }
);

// Complex type assertions and type guards
function isStringArray(value: any): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isNumberRecord(value: any): value is Record<string, number> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.values(value).every((v) => typeof v === 'number')
  );
}

// Template literals with complex expressions
const buildQueryString = (params: Record<string, any>) => {
  const queryParts = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });

  return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
};

const sqlQuery = (table: string, conditions: Record<string, any>) => `
  SELECT *
  FROM ${table}
  WHERE ${Object.entries(conditions)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key} IN (${value.map((v) => `'${v}'`).join(', ')})`;
      }
      return `${key} = '${value}'`;
    })
    .join(' AND ')}
  ORDER BY created_at DESC
  LIMIT 100;
`;

// Regular expressions with various delimiters
const regexPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  creditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/
};

// JSON-like structures with nested quotes and brackets
const jsonExamples = {
  simpleObject: `{"name": "John", "age": 30, "city": "New York"}`,
  nestedObject: `{
    "user": {
      "profile": {
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "preferences": ["dark-theme", "notifications", "auto-save"]
    }
  }`,
  arrayWithObjects: `[
    {"id": 1, "status": "active", "tags": ["important", "urgent"]},
    {"id": 2, "status": "inactive", "tags": ["review", "pending"]},
    {"id": 3, "status": "completed", "tags": ["done", "archived"]}
  ]`,
  complexNested: `{
    "data": {
      "users": [
        {
          "id": "u1",
          "profile": {"name": "Alice", "role": "admin"},
          "permissions": ["read", "write", "delete"]
        }
      ]
    },
    "meta": {"total": 1, "page": 1, "hasMore": false}
  }`
};

// Export with complex type definitions
export {
  type DeepNested,
  type ConditionalType,
  type MappedType,
  type Repository,
  type QueryBuilder,
  DataProcessor,
  processComplexData,
  isStringArray,
  isNumberRecord,
  buildQueryString,
  sqlQuery,
  configurationObject,
  arrayOperations,
  stringExamples,
  regexPatterns,
  jsonExamples
};