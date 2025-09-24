/**
 * Day 8: Undo and Redo Practice with TypeScript
 *
 * This file contains intentional type errors that you'll fix and then undo/redo.
 * Practice using 'u' to undo and 'Ctrl-r' to redo changes.
 *
 * Instructions:
 * 1. Fix the type errors by adding proper type annotations
 * 2. Practice undoing your changes with 'u'
 * 3. Practice redoing your changes with 'Ctrl-r'
 * 4. Use 'U' to undo all changes on a line
 * 5. Use '.' to repeat your last change
 */

// Generic utility types with errors
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// User management system with type errors
interface BaseUser {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminUser extends BaseUser {
  role: 'admin';
  permissions: string[];
  departmentId: number;
}

interface RegularUser extends BaseUser {
  role: 'user';
  preferences: UserPreferences;
  subscriptionTier: 'free' | 'premium' | 'enterprise';
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  timezone: string;
}

// Type error: Missing generic constraint
class UserRepository<T> {
  private users: T[] = [];

  // Type error: Return type should be Promise<T | undefined>
  async findById(id: number): T | undefined {
    // Type error: Should use proper async/await
    return this.users.find(user => user.id === id);
  }

  // Type error: Parameter should be properly typed
  async create(userData): Promise<T> {
    const newUser = {
      ...userData,
      id: Math.random(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Type error: Missing proper return type annotation
  async update(id: number, updates: DeepPartial<T>) {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date()
    };

    return this.users[userIndex];
  }

  // Type error: Missing return type and proper filtering
  async findByRole(role: string) {
    return this.users.filter(user => user.role === role);
  }
}

// Authentication service with type errors
class AuthenticationService {
  private userRepo: UserRepository<AdminUser | RegularUser>;

  constructor() {
    this.userRepo = new UserRepository();
  }

  // Type error: Missing proper parameter typing
  async login(credentials): Promise<{ user: AdminUser | RegularUser; token: string } | null> {
    // Type error: Should validate credentials structure
    if (!credentials.email || !credentials.password) {
      return null;
    }

    // Type error: Should use proper async/await pattern
    const user = this.userRepo.findById(credentials.userId);
    if (!user) {
      return null;
    }

    // Type error: Should return proper type structure
    return {
      user,
      token: this.generateToken(user.id)
    };
  }

  // Type error: Missing parameter type
  private generateToken(userId): string {
    // Type error: Should use proper string template
    return `token_${userId}_${Date.now()}`;
  }

  // Type error: Missing return type annotation
  async createUser(userData: Omit<AdminUser | RegularUser, 'id' | 'createdAt' | 'updatedAt'>) {
    // Type error: Should validate user data structure
    const requiredFields = ['email', 'role'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    return this.userRepo.create(userData);
  }
}

// Permission system with type errors
enum Permission {
  READ_USERS,
  WRITE_USERS,
  DELETE_USERS,
  MANAGE_ROLES,
  VIEW_ANALYTICS,
  EXPORT_DATA
}

interface PermissionChecker {
  // Type error: Missing generic constraint
  hasPermission<T>(user: T, permission: Permission): boolean;
  // Type error: Missing parameter types
  checkMultiplePermissions(user, permissions): Record<Permission, boolean>;
}

class RoleBasedPermissionChecker implements PermissionChecker {
  private rolePermissions = {
    admin: [Permission.READ_USERS, Permission.WRITE_USERS, Permission.DELETE_USERS,
            Permission.MANAGE_ROLES, Permission.VIEW_ANALYTICS, Permission.EXPORT_DATA],
    user: [Permission.READ_USERS]
  };

  // Type error: Should constrain T to have role property
  hasPermission<T>(user: T, permission: Permission): boolean {
    const userRole = user.role;
    const allowedPermissions = this.rolePermissions[userRole] || [];
    return allowedPermissions.includes(permission);
  }

  // Type error: Missing proper parameter typing
  checkMultiplePermissions(user, permissions): Record<Permission, boolean> {
    const result = {};
    for (const permission of permissions) {
      result[permission] = this.hasPermission(user, permission);
    }
    return result;
  }
}

// Data validation utilities with type errors
type ValidationRule<T> = {
  field: keyof T;
  // Type error: Should properly type the validator function
  validator: (value) => boolean;
  message: string;
};

class DataValidator<T> {
  private rules: ValidationRule<T>[] = [];

  // Type error: Should properly type the rule parameter
  addRule(rule): this {
    this.rules.push(rule);
    return this;
  }

  // Type error: Missing return type annotation
  validate(data: T) {
    const errors = [];

    for (const rule of this.rules) {
      const value = data[rule.field];
      if (!rule.validator(value)) {
        errors.push({
          field: rule.field,
          message: rule.message
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Usage examples with type errors
const userValidator = new DataValidator<RegularUser>();

// Type error: Should properly type the validator function parameter
userValidator
  .addRule({
    field: 'email',
    validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    message: 'Invalid email format'
  })
  .addRule({
    field: 'subscriptionTier',
    validator: (tier) => ['free', 'premium', 'enterprise'].includes(tier),
    message: 'Invalid subscription tier'
  });

// Type error: Should use proper async/await
const authService = new AuthenticationService();
const permissionChecker = new RoleBasedPermissionChecker();

// Type error: Missing proper error handling
async function handleUserLogin(credentials: { email: string; password: string; userId: number }) {
  try {
    const loginResult = authService.login(credentials);

    if (!loginResult) {
      return { success: false, message: 'Invalid credentials' };
    }

    const hasReadPermission = permissionChecker.hasPermission(
      loginResult.user,
      Permission.READ_USERS
    );

    return {
      success: true,
      user: loginResult.user,
      token: loginResult.token,
      permissions: {
        canReadUsers: hasReadPermission
      }
    };
  } catch (error) {
    // Type error: Should properly type the error
    return { success: false, message: error.message };
  }
}

// Advanced type manipulation with errors
type ExtractArrayType<T> = T extends (infer U)[] ? U : never;
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Type error: Should properly constrain the generic types
function createUserProcessor<T, K>() {
  return {
    // Type error: Missing proper return type
    process(users: T[], transformer: (user: T) => K) {
      return users.map(transformer);
    },

    // Type error: Should use proper conditional types
    filter<P>(users: T[], predicate: (user: T) => user is P): P[] {
      return users.filter(predicate);
    }
  };
}

// Type error: Should use proper type assertion
const processor = createUserProcessor<AdminUser | RegularUser, string>();

export {
  UserRepository,
  AuthenticationService,
  RoleBasedPermissionChecker,
  DataValidator,
  Permission,
  type BaseUser,
  type AdminUser,
  type RegularUser,
  type DeepPartial,
  type RequiredFields
};