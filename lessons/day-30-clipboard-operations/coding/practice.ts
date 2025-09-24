/**
 * Day 30: System Clipboard Operations - TypeScript Code for External Sharing
 *
 * This file contains TypeScript code designed for practicing system clipboard
 * operations. Use "+y to copy to system clipboard and "+p to paste from it.
 * Practice sharing code snippets between different applications and vim instances.
 *
 * System Clipboard Practice Objectives:
 * - Use "+yy to copy entire lines to system clipboard
 * - Use "+y$ to copy from cursor to end of line to system clipboard
 * - Use "+p to paste from system clipboard after cursor
 * - Use "+P to paste from system clipboard before cursor
 * - Practice copying code for documentation, emails, or other applications
 */

// ========== SHAREABLE CODE SNIPPETS ==========
// Copy these snippets to system clipboard for use in documentation or other apps

/**
 * Authentication utility functions for JWT tokens
 * Perfect for copying to documentation or README files
 */
export class AuthTokenManager {
  private readonly secretKey: string;
  private readonly expirationTime: number;

  constructor(secretKey: string, expirationHours: number = 24) {
    this.secretKey = secretKey;
    this.expirationTime = expirationHours * 60 * 60 * 1000; // Convert to milliseconds
  }

  /**
   * Generate a JWT token for user authentication
   * @param userId - Unique identifier for the user
   * @param email - User's email address
   * @param roles - Array of user roles
   * @returns Promise<string> - JWT token
   */
  async generateToken(userId: string, email: string, roles: string[]): Promise<string> {
    const payload = {
      userId,
      email,
      roles,
      iat: Date.now(),
      exp: Date.now() + this.expirationTime
    };

    // Implementation would use a JWT library like jsonwebtoken
    return this.signPayload(payload);
  }

  /**
   * Verify and decode a JWT token
   * @param token - JWT token to verify
   * @returns Promise<DecodedToken | null> - Decoded token or null if invalid
   */
  async verifyToken(token: string): Promise<DecodedToken | null> {
    try {
      const decoded = await this.decodeToken(token);

      if (decoded.exp < Date.now()) {
        return null; // Token expired
      }

      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  private async signPayload(payload: TokenPayload): Promise<string> {
    // Implement JWT signing logic here
    return 'signed-jwt-token';
  }

  private async decodeToken(token: string): Promise<DecodedToken> {
    // Implement JWT decoding logic here
    return {} as DecodedToken;
  }
}

// ========== API ENDPOINT EXAMPLES FOR SHARING ==========
// Copy these Express.js route examples to share with backend developers

/**
 * REST API endpoints for user management
 * Copy these to share API documentation or implementation examples
 */

// GET /api/users - Retrieve all users with pagination
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const users = await userService.findAll({ offset, limit });
    const total = await userService.count();

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users'
    });
  }
});

// POST /api/users - Create a new user
app.post('/api/users', async (req: Request, res: Response) => {
  try {
    const userData: CreateUserRequest = req.body;

    // Validate required fields
    if (!userData.email || !userData.firstName || !userData.lastName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: email, firstName, lastName'
      });
    }

    // Check if user already exists
    const existingUser = await userService.findByEmail(userData.email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    const newUser = await userService.create(userData);

    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
});

// ========== REACT COMPONENT EXAMPLES ==========
// Copy these React components to share with frontend developers

/**
 * User Profile Component - TypeScript React implementation
 * Perfect for sharing component structure and props typing
 */
interface UserProfileProps {
  user: User;
  editable?: boolean;
  onUpdate?: (updates: Partial<User>) => Promise<void>;
  onDelete?: (userId: string) => Promise<void>;
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  editable = false,
  onUpdate,
  onDelete,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    bio: user.profile?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!onUpdate) return;

    setLoading(true);
    setError(null);

    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.profile?.bio || ''
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className={`user-profile ${className}`}>
      <div className="profile-header">
        <img
          src={user.profile?.avatar || '/default-avatar.png'}
          alt={`${user.firstName} ${user.lastName}`}
          className="avatar"
        />
        <div className="user-info">
          {isEditing ? (
            <EditForm
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              onCancel={handleCancel}
              loading={loading}
              error={error}
            />
          ) : (
            <DisplayInfo
              user={user}
              editable={editable}
              onEdit={() => setIsEditing(true)}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ========== DATABASE SCHEMA DEFINITIONS ==========
// Copy these schema definitions to share with database administrators

/**
 * PostgreSQL table definitions for user management system
 * Copy these SQL statements to share database schema
 */

const CREATE_USERS_TABLE = `
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
  );

  CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator');

  CREATE INDEX idx_users_email ON users(email);
  CREATE INDEX idx_users_role ON users(role);
  CREATE INDEX idx_users_created_at ON users(created_at);
`;

const CREATE_USER_PROFILES_TABLE = `
  CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    address JSONB,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE UNIQUE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
  CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);
`;

// ========== DOCKER CONFIGURATION ==========
// Copy these Docker configurations to share deployment setup

/**
 * Docker Compose configuration for TypeScript application
 * Copy this to share containerized development setup
 */

const DOCKER_COMPOSE_CONFIG = `
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - JWT_SECRET=your-super-secret-jwt-key
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis
    command: npm run dev

  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
`;

// ========== PACKAGE.JSON SCRIPTS ==========
// Copy these npm scripts to share build and development commands

/**
 * NPM scripts for TypeScript project
 * Copy these to share development workflow
 */

const PACKAGE_JSON_SCRIPTS = {
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc && npm run copy-assets",
    "start": "node dist/server.js",
    "test": "jest --config jest.config.js",
    "test:watch": "jest --config jest.config.js --watch",
    "test:coverage": "jest --config jest.config.js --coverage",
    "lint": "eslint src/**/*.ts --fix",
    "format": "prettier --write src/**/*.{ts,js,json}",
    "typecheck": "tsc --noEmit",
    "copy-assets": "cp -r src/assets dist/assets",
    "db:migrate": "npx prisma migrate deploy",
    "db:generate": "npx prisma generate",
    "db:seed": "ts-node prisma/seed.ts",
    "docker:build": "docker build -t myapp .",
    "docker:run": "docker run -p 3000:3000 myapp",
    "deploy:staging": "npm run build && npm run deploy:push:staging",
    "deploy:production": "npm run build && npm run deploy:push:production"
  },
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/express": "^4.17.17",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "jsonwebtoken": "^9.0.0",
    "@types/jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "@types/bcryptjs": "^2.4.2",
    "joi": "^17.9.0",
    "dotenv": "^16.0.0"
  }
};

// ========== ESLINT CONFIGURATION ==========
// Copy this ESLint config to share code quality standards

const ESLINT_CONFIG = {
  "extends": [
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "root": true,
  "env": {
    "node": true,
    "es6": true
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "prefer-const": "error",
    "no-var": "error",
    "no-console": "warn"
  }
};

// ========== TSCONFIG CONFIGURATION ==========
// Copy this TypeScript config to share compiler settings

const TSCONFIG = {
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/types/*": ["src/types/*"],
      "@/utils/*": ["src/utils/*"],
      "@/services/*": ["src/services/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests"
  ]
};

// ========== TESTING EXAMPLES ==========
// Copy these test examples to share testing patterns

/**
 * Jest test examples for TypeScript
 * Copy these to share testing best practices
 */

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<UserRepository>;

    userService = new UserService(mockRepository);
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser: User = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.findById('123');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findById).toHaveBeenCalledWith('123');
    });

    it('should return null when user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await userService.findById('999');

      expect(result).toBeNull();
      expect(mockRepository.findById).toHaveBeenCalledWith('999');
    });
  });
});

// ========== SHARE THESE CODE BLOCKS ==========
// Practice copying these entire blocks to system clipboard for sharing:
// 1. AuthTokenManager class - useful for authentication examples
// 2. Express.js route handlers - good for API documentation
// 3. React UserProfile component - excellent for frontend examples
// 4. Database schema SQL - perfect for database documentation
// 5. Docker Compose config - ideal for deployment documentation
// 6. Package.json scripts - great for project setup guides
// 7. TypeScript configuration - useful for project scaffolding
// 8. Jest test examples - perfect for testing documentation