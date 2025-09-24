/**
 * Day 12: Number Operations Practice with TypeScript
 *
 * This file contains numeric enums, array indices, and other numbers for practicing Ctrl-a/Ctrl-x.
 * Practice these number operations:
 * - Ctrl-a: Increment number under cursor
 * - Ctrl-x: Decrement number under cursor
 * - [count]Ctrl-a: Increment by count
 * - [count]Ctrl-x: Decrement by count
 * - g Ctrl-a: Increment numbers in visual selection incrementally
 * - g Ctrl-x: Decrement numbers in visual selection incrementally
 *
 * Navigate to numbers and practice incrementing/decrementing them.
 * Try visual selection with multiple numbers for batch operations.
 */

// HTTP Status Code Enums - Practice incrementing/decrementing these values
enum HttpStatusCode {
  // 1xx Informational
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,

  // 2xx Success
  OK = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  IMUsed = 226,

  // 3xx Redirection
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,

  // 4xx Client Errors
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  URITooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,

  // 5xx Server Errors
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HTTPVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511
}

// Priority Levels - Practice with these sequential numbers
enum Priority {
  Lowest = 1,
  Low = 2,
  Normal = 3,
  High = 4,
  Highest = 5,
  Critical = 6,
  Emergency = 7
}

// Log Levels with incremental values
enum LogLevel {
  Trace = 10,
  Debug = 20,
  Info = 30,
  Warn = 40,
  Error = 50,
  Fatal = 60
}

// Gaming-related enums for practice
enum DifficultyLevel {
  Beginner = 1,
  Easy = 2,
  Normal = 3,
  Hard = 4,
  Expert = 5,
  Master = 6,
  Legendary = 7,
  Nightmare = 8,
  Impossible = 9
}

enum PlayerLevel {
  Novice = 1,
  Apprentice = 5,
  Journeyman = 10,
  Expert = 15,
  Master = 20,
  Grandmaster = 25,
  Legend = 30,
  Mythic = 35,
  Transcendent = 40,
  Godlike = 50
}

// Configuration object with many numeric values
interface GameConfiguration {
  version: {
    major: 2,
    minor: 1,
    patch: 0,
    build: 1234
  };

  gameplay: {
    maxPlayers: 8,
    minPlayers: 2,
    roundDuration: 300, // seconds
    turnTimeout: 30,    // seconds
    maxRounds: 10,
    winCondition: 5,    // rounds to win
    pointsPerWin: 100,
    pointsPerLoss: 25,
    bonusMultiplier: 2
  };

  graphics: {
    defaultWidth: 1920,
    defaultHeight: 1080,
    minWidth: 800,
    minHeight: 600,
    maxFPS: 144,
    targetFPS: 60,
    vsyncEnabled: 1,    // 0 = off, 1 = on
    qualityLevel: 3,    // 1-5 scale
    shadowQuality: 2,   // 1-4 scale
    textureQuality: 4,  // 1-5 scale
    antiAliasing: 8     // samples
  };

  audio: {
    masterVolume: 80,   // 0-100
    musicVolume: 70,    // 0-100
    sfxVolume: 85,      // 0-100
    voiceVolume: 90,    // 0-100
    sampleRate: 44100,  // Hz
    bitDepth: 16,       // bits
    bufferSize: 512,    // samples
    channels: 2         // mono=1, stereo=2
  };

  network: {
    port: 8080,
    maxConnections: 100,
    timeoutMs: 5000,
    retryAttempts: 3,
    pingInterval: 1000,
    maxLatency: 150,
    compressionLevel: 6, // 0-9
    keepAliveInterval: 30000
  };

  performance: {
    targetFPS: 60,
    maxMemoryMB: 2048,
    cacheSize: 256,
    threadCount: 4,
    chunkSize: 64,
    loadDistance: 10,
    renderDistance: 8,
    particleLimit: 1000,
    entityLimit: 500,
    lightLimit: 32
  };
}

// Array with numeric indices for practice
const gameStats = [
  { playerId: 1001, score: 2500, level: 15, wins: 45, losses: 23 },
  { playerId: 1002, score: 1850, level: 12, wins: 38, losses: 19 },
  { playerId: 1003, score: 3200, level: 18, wins: 67, losses: 31 },
  { playerId: 1004, score: 1200, level: 8, wins: 22, losses: 28 },
  { playerId: 1005, score: 4100, level: 22, wins: 89, losses: 41 },
  { playerId: 1006, score: 950, level: 6, wins: 15, losses: 25 },
  { playerId: 1007, score: 2750, level: 16, wins: 52, losses: 34 },
  { playerId: 1008, score: 1650, level: 11, wins: 31, losses: 22 },
  { playerId: 1009, score: 3850, level: 20, wins: 78, losses: 38 },
  { playerId: 1010, score: 2200, level: 14, wins: 43, losses: 29 }
];

// Server configuration with ports and numeric settings
const serverConfigs = {
  production: {
    host: 'prod.gameserver.com',
    port: 443,
    workers: 8,
    memoryLimit: 4096, // MB
    cpuLimit: 80,      // percentage
    connections: 1000,
    timeout: 30000,    // ms
    retries: 5,
    logLevel: 3        // 1=error, 2=warn, 3=info, 4=debug
  },

  staging: {
    host: 'staging.gameserver.com',
    port: 8443,
    workers: 4,
    memoryLimit: 2048,
    cpuLimit: 60,
    connections: 500,
    timeout: 15000,
    retries: 3,
    logLevel: 4
  },

  development: {
    host: 'localhost',
    port: 3000,
    workers: 2,
    memoryLimit: 1024,
    cpuLimit: 40,
    connections: 100,
    timeout: 10000,
    retries: 2,
    logLevel: 5
  },

  testing: {
    host: 'test.gameserver.com',
    port: 8080,
    workers: 1,
    memoryLimit: 512,
    cpuLimit: 20,
    connections: 50,
    timeout: 5000,
    retries: 1,
    logLevel: 5
  }
};

// Database connection pools with numeric configurations
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  pool: {
    min: number;
    max: number;
    idle: number;
    acquire: number;
    evict: number;
  };
  retry: {
    max: number;
    timeout: number;
    interval: number;
  };
  ssl: {
    enabled: number; // 0 or 1
    version: number;
    ciphers: number;
  };
}

const databaseConfigs: Record<string, DatabaseConfig> = {
  primary: {
    host: 'db-primary.example.com',
    port: 5432,
    database: 'gamedb_prod',
    username: 'gameuser',
    password: 'secret123',
    pool: {
      min: 5,
      max: 20,
      idle: 30000,
      acquire: 60000,
      evict: 1800000
    },
    retry: {
      max: 3,
      timeout: 5000,
      interval: 1000
    },
    ssl: {
      enabled: 1,
      version: 3,
      ciphers: 256
    }
  },

  secondary: {
    host: 'db-secondary.example.com',
    port: 5433,
    database: 'gamedb_readonly',
    username: 'readonly',
    password: 'readonly456',
    pool: {
      min: 2,
      max: 10,
      idle: 15000,
      acquire: 30000,
      evict: 900000
    },
    retry: {
      max: 2,
      timeout: 3000,
      interval: 500
    },
    ssl: {
      enabled: 1,
      version: 3,
      ciphers: 128
    }
  },

  cache: {
    host: 'redis.example.com',
    port: 6379,
    database: 'cache',
    username: 'cache',
    password: 'cache789',
    pool: {
      min: 1,
      max: 5,
      idle: 10000,
      acquire: 15000,
      evict: 300000
    },
    retry: {
      max: 5,
      timeout: 2000,
      interval: 200
    },
    ssl: {
      enabled: 0,
      version: 0,
      ciphers: 0
    }
  }
};

// Game balance configuration with lots of numbers to adjust
interface GameBalance {
  characters: {
    warrior: {
      baseHealth: 100,
      baseAttack: 15,
      baseDefense: 12,
      baseMana: 50,
      healthPerLevel: 8,
      attackPerLevel: 2,
      defensePerLevel: 1,
      manaPerLevel: 3
    };

    mage: {
      baseHealth: 70,
      baseAttack: 8,
      baseDefense: 5,
      baseMana: 120,
      healthPerLevel: 4,
      attackPerLevel: 1,
      defensePerLevel: 1,
      manaPerLevel: 8
    };

    archer: {
      baseHealth: 85,
      baseAttack: 12,
      baseDefense: 8,
      baseMana: 80,
      healthPerLevel: 6,
      attackPerLevel: 2,
      defensePerLevel: 1,
      manaPerLevel: 4
    };

    rogue: {
      baseHealth: 75,
      baseAttack: 14,
      baseDefense: 6,
      baseMana: 60,
      healthPerLevel: 5,
      attackPerLevel: 3,
      defensePerLevel: 1,
      manaPerLevel: 2
    };
  };

  weapons: {
    sword: { damage: 20, speed: 5, durability: 100, cost: 500 },
    axe: { damage: 25, speed: 3, durability: 80, cost: 600 },
    bow: { damage: 15, speed: 8, durability: 60, cost: 400 },
    staff: { damage: 30, speed: 2, durability: 40, cost: 800 },
    dagger: { damage: 12, speed: 10, durability: 50, cost: 300 },
    hammer: { damage: 35, speed: 1, durability: 120, cost: 1000 },
    crossbow: { damage: 22, speed: 4, durability: 70, cost: 750 },
    wand: { damage: 18, speed: 6, durability: 30, cost: 450 }
  };

  armor: {
    helmet: { defense: 5, weight: 2, durability: 50, cost: 200 },
    chestplate: { defense: 15, weight: 8, durability: 100, cost: 800 },
    leggings: { defense: 10, weight: 5, durability: 80, cost: 500 },
    boots: { defense: 3, weight: 1, durability: 40, cost: 150 },
    gloves: { defense: 2, weight: 1, durability: 30, cost: 100 },
    shield: { defense: 8, weight: 3, durability: 60, cost: 300 }
  };

  spells: {
    fireball: { damage: 40, manaCost: 25, cooldown: 3, range: 8 },
    heal: { healing: 30, manaCost: 20, cooldown: 2, range: 0 },
    lightning: { damage: 35, manaCost: 30, cooldown: 4, range: 10 },
    shield: { absorption: 50, manaCost: 15, cooldown: 6, range: 0 },
    teleport: { distance: 15, manaCost: 40, cooldown: 8, range: 15 },
    freeze: { duration: 4, manaCost: 35, cooldown: 5, range: 6 },
    poison: { damagePerTurn: 8, manaCost: 20, cooldown: 3, range: 5 },
    buff: { bonus: 25, manaCost: 30, cooldown: 10, range: 0 }
  };

  economy: {
    basePrices: {
      health_potion: 25,
      mana_potion: 30,
      stamina_potion: 20,
      antidote: 15,
      scroll: 50,
      gem: 100,
      ore: 75,
      cloth: 10,
      leather: 35,
      wood: 5
    };

    shopMarkup: {
      common: 10,    // 10% markup
      uncommon: 15,  // 15% markup
      rare: 25,      // 25% markup
      epic: 40,      // 40% markup
      legendary: 60  // 60% markup
    };

    sellback: {
      common: 40,    // 40% of purchase price
      uncommon: 45,  // 45% of purchase price
      rare: 50,      // 50% of purchase price
      epic: 55,      // 55% of purchase price
      legendary: 60  // 60% of purchase price
    };
  };
}

// API rate limiting configuration
interface RateLimitConfig {
  endpoints: {
    '/api/auth/login': {
      windowMs: 900000,     // 15 minutes
      max: 5,               // 5 attempts per window
      blockDuration: 3600000 // 1 hour block
    };

    '/api/users/profile': {
      windowMs: 60000,      // 1 minute
      max: 30,              // 30 requests per minute
      blockDuration: 0      // no block
    };

    '/api/games/create': {
      windowMs: 300000,     // 5 minutes
      max: 10,              // 10 games per 5 minutes
      blockDuration: 600000 // 10 minute block
    };

    '/api/chat/send': {
      windowMs: 1000,       // 1 second
      max: 3,               // 3 messages per second
      blockDuration: 30000  // 30 second block
    };

    '/api/leaderboard': {
      windowMs: 30000,      // 30 seconds
      max: 50,              // 50 requests per 30 seconds
      blockDuration: 0      // no block
    };

    '/api/admin/*': {
      windowMs: 60000,      // 1 minute
      max: 100,             // 100 requests per minute
      blockDuration: 0      // no block
    };
  };

  global: {
    windowMs: 60000,        // 1 minute
    max: 1000,              // 1000 requests per minute per IP
    blockDuration: 300000   // 5 minute block
  };

  premium: {
    windowMs: 60000,        // 1 minute
    max: 5000,              // 5x the limit for premium users
    blockDuration: 60000    // 1 minute block
  };
}

// Monitoring thresholds and alerts
const monitoringConfig = {
  cpu: {
    warning: 70,    // 70% CPU usage warning
    critical: 85,   // 85% CPU usage critical
    samples: 10,    // number of samples to average
    interval: 5000  // 5 second intervals
  },

  memory: {
    warning: 80,    // 80% memory usage warning
    critical: 90,   // 90% memory usage critical
    samples: 5,     // number of samples to average
    interval: 10000 // 10 second intervals
  },

  disk: {
    warning: 75,    // 75% disk usage warning
    critical: 85,   // 85% disk usage critical
    samples: 1,     // single sample check
    interval: 60000 // 60 second intervals
  },

  network: {
    latency: {
      warning: 100,   // 100ms latency warning
      critical: 250,  // 250ms latency critical
      samples: 20,    // 20 ping samples
      interval: 1000  // 1 second intervals
    },

    bandwidth: {
      warning: 800,   // 800 Mbps warning (out of 1 Gbps)
      critical: 950,  // 950 Mbps critical
      samples: 10,    // 10 samples to average
      interval: 5000  // 5 second intervals
    }
  },

  errors: {
    rate: {
      warning: 5,     // 5% error rate warning
      critical: 10,   // 10% error rate critical
      window: 300000  // 5 minute window
    },

    count: {
      warning: 50,    // 50 errors per minute warning
      critical: 100,  // 100 errors per minute critical
      window: 60000   // 1 minute window
    }
  }
};

// Version history with incremental version numbers
const versionHistory = [
  { version: '1.0.0', build: 1000, date: '2023-01-15', features: 25, bugs: 0 },
  { version: '1.0.1', build: 1001, date: '2023-01-22', features: 25, bugs: 3 },
  { version: '1.1.0', build: 1100, date: '2023-02-15', features: 32, bugs: 1 },
  { version: '1.1.1', build: 1101, date: '2023-02-20', features: 32, bugs: 2 },
  { version: '1.2.0', build: 1200, date: '2023-03-15', features: 40, bugs: 0 },
  { version: '1.2.1', build: 1201, date: '2023-03-18', features: 40, bugs: 1 },
  { version: '1.3.0', build: 1300, date: '2023-04-10', features: 48, bugs: 2 },
  { version: '2.0.0', build: 2000, date: '2023-06-01', features: 75, bugs: 5 },
  { version: '2.0.1', build: 2001, date: '2023-06-05', features: 75, bugs: 3 },
  { version: '2.1.0', build: 2100, date: '2023-07-15', features: 85, bugs: 1 }
];

// Export enums and configurations
export {
  HttpStatusCode,
  Priority,
  LogLevel,
  DifficultyLevel,
  PlayerLevel,
  type GameConfiguration,
  type DatabaseConfig,
  type GameBalance,
  type RateLimitConfig,
  gameStats,
  serverConfigs,
  databaseConfigs,
  monitoringConfig,
  versionHistory
};