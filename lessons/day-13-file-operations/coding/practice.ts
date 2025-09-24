/**
 * Day 13: File Operations Practice with TypeScript
 *
 * This multi-file TypeScript project helps you practice file navigation and operations.
 * Practice these file operations:
 * - :e filename - Edit/open a file
 * - :w - Write current file
 * - :w filename - Write to specific file
 * - :q - Quit current file
 * - :wq - Write and quit
 * - :qa - Quit all files
 * - :sp filename - Split horizontally and open file
 * - :vsp filename - Split vertically and open file
 * - Ctrl-w h/j/k/l - Navigate between splits
 * - Ctrl-w c - Close current split
 * - :tabnew filename - Open file in new tab
 * - gt/gT - Navigate between tabs
 * - :bn/:bp - Navigate between buffers
 * - :ls - List buffers
 * - :b[number] - Go to buffer by number
 * - :bd - Delete buffer
 *
 * This is the main entry point. Open the related files:
 * - types.ts (shared type definitions)
 * - user.service.ts (user management service)
 * - auth.service.ts (authentication service)
 * - api.client.ts (HTTP client)
 * - utils.ts (utility functions)
 * - config.ts (configuration)
 */

import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { ApiClient } from './api.client';
import { AppConfig } from './config';
import { Logger, validateEmail, formatDate } from './utils';
import {
  User,
  UserRole,
  ApiResponse,
  LoginCredentials,
  UserCreationData,
  UserUpdateData,
  PaginationParams,
  SortOptions
} from './types';

/**
 * Main Application Class
 *
 * This class orchestrates the various services and provides the main
 * application functionality. Practice navigating between this file
 * and the imported service files.
 */
class Application {
  private userService: UserService;
  private authService: AuthService;
  private apiClient: ApiClient;
  private logger: Logger;
  private currentUser: User | null = null;

  constructor(config: AppConfig) {
    this.logger = new Logger('Application', config.logging.level);
    this.apiClient = new ApiClient(config.api);
    this.authService = new AuthService(this.apiClient, this.logger);
    this.userService = new UserService(this.apiClient, this.logger);

    this.logger.info('Application initialized', { config });
  }

  /**
   * Initialize the application
   * Try opening auth.service.ts to see the AuthService implementation
   */
  async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing application...');

      // Check if user has existing session
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const user = await this.authService.validateToken(token);
          this.currentUser = user;
          this.logger.info('User session restored', { userId: user.id });
        } catch (error) {
          this.logger.warn('Invalid token found, clearing session', error);
          localStorage.removeItem('auth_token');
        }
      }

      this.logger.info('Application initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize application', error);
      throw error;
    }
  }

  /**
   * User authentication
   * Navigate to auth.service.ts (:e auth.service.ts) to see implementation details
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    try {
      this.logger.info('Attempting user login', { email: credentials.email });

      if (!validateEmail(credentials.email)) {
        return {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Please provide a valid email address'
          }
        };
      }

      const result = await this.authService.login(credentials);

      if (result.success) {
        this.currentUser = result.data;
        this.logger.info('User logged in successfully', { userId: result.data.id });
      } else {
        this.logger.warn('Login failed', result.error);
      }

      return result;
    } catch (error) {
      this.logger.error('Login error', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: 'An unexpected error occurred during login'
        }
      };
    }
  }

  /**
   * User logout
   */
  async logout(): Promise<void> {
    try {
      if (this.currentUser) {
        await this.authService.logout();
        this.currentUser = null;
        this.logger.info('User logged out successfully');
      }
    } catch (error) {
      this.logger.error('Logout error', error);
      // Continue with logout even if server call fails
      this.currentUser = null;
    }
  }

  /**
   * User registration
   * Check user.service.ts for user management functionality
   */
  async register(userData: UserCreationData): Promise<ApiResponse<User>> {
    try {
      this.logger.info('Attempting user registration', { email: userData.email });

      if (!validateEmail(userData.email)) {
        return {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Please provide a valid email address'
          }
        };
      }

      const result = await this.userService.createUser(userData);

      if (result.success) {
        this.logger.info('User registered successfully', { userId: result.data.id });
      } else {
        this.logger.warn('Registration failed', result.error);
      }

      return result;
    } catch (error) {
      this.logger.error('Registration error', error);
      return {
        success: false,
        error: {
          code: 'REGISTRATION_ERROR',
          message: 'An unexpected error occurred during registration'
        }
      };
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUserProfile(): Promise<ApiResponse<User>> {
    if (!this.currentUser) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'User is not authenticated'
        }
      };
    }

    try {
      const result = await this.userService.getUserById(this.currentUser.id);

      if (result.success) {
        this.currentUser = result.data;
      }

      return result;
    } catch (error) {
      this.logger.error('Error fetching user profile', error);
      return {
        success: false,
        error: {
          code: 'PROFILE_FETCH_ERROR',
          message: 'Failed to fetch user profile'
        }
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updateData: UserUpdateData): Promise<ApiResponse<User>> {
    if (!this.currentUser) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'User is not authenticated'
        }
      };
    }

    try {
      const result = await this.userService.updateUser(this.currentUser.id, updateData);

      if (result.success) {
        this.currentUser = result.data;
        this.logger.info('User profile updated', { userId: result.data.id });
      }

      return result;
    } catch (error) {
      this.logger.error('Error updating user profile', error);
      return {
        success: false,
        error: {
          code: 'PROFILE_UPDATE_ERROR',
          message: 'Failed to update user profile'
        }
      };
    }
  }

  /**
   * Get all users (admin only)
   * Navigate to user.service.ts to see the implementation
   */
  async getUsers(
    params: PaginationParams = { page: 1, limit: 20 },
    sort: SortOptions = { field: 'createdAt', order: 'desc' }
  ): Promise<ApiResponse<User[]>> {
    if (!this.currentUser || this.currentUser.role !== UserRole.ADMIN) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Admin role required to access user list'
        }
      };
    }

    try {
      return await this.userService.getUsers(params, sort);
    } catch (error) {
      this.logger.error('Error fetching users', error);
      return {
        success: false,
        error: {
          code: 'USERS_FETCH_ERROR',
          message: 'Failed to fetch users'
        }
      };
    }
  }

  /**
   * Search users by criteria
   */
  async searchUsers(query: string, filters?: Record<string, any>): Promise<ApiResponse<User[]>> {
    if (!this.currentUser || this.currentUser.role !== UserRole.ADMIN) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Admin role required to search users'
        }
      };
    }

    try {
      return await this.userService.searchUsers(query, filters);
    } catch (error) {
      this.logger.error('Error searching users', error);
      return {
        success: false,
        error: {
          code: 'USER_SEARCH_ERROR',
          message: 'Failed to search users'
        }
      };
    }
  }

  /**
   * Get application statistics (admin only)
   */
  async getStatistics(): Promise<ApiResponse<Record<string, number>>> {
    if (!this.currentUser || this.currentUser.role !== UserRole.ADMIN) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Admin role required to access statistics'
        }
      };
    }

    try {
      const result = await this.apiClient.get<Record<string, number>>('/admin/statistics');
      this.logger.info('Statistics fetched successfully');
      return result;
    } catch (error) {
      this.logger.error('Error fetching statistics', error);
      return {
        success: false,
        error: {
          code: 'STATISTICS_ERROR',
          message: 'Failed to fetch application statistics'
        }
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Format user display name
   * Uses utility function from utils.ts
   */
  formatUserDisplayName(user: User): string {
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    return fullName || user.email;
  }

  /**
   * Format user creation date
   * Uses utility function from utils.ts
   */
  formatUserCreationDate(user: User): string {
    return formatDate(user.createdAt, 'YYYY-MM-DD HH:mm:ss');
  }

  /**
   * Export user data (admin only)
   */
  async exportUserData(format: 'csv' | 'json' | 'xlsx' = 'csv'): Promise<ApiResponse<Blob>> {
    if (!this.currentUser || this.currentUser.role !== UserRole.ADMIN) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Admin role required to export user data'
        }
      };
    }

    try {
      const response = await this.apiClient.get<Blob>(`/admin/users/export?format=${format}`, {
        responseType: 'blob'
      });

      this.logger.info('User data exported successfully', { format });
      return response;
    } catch (error) {
      this.logger.error('Error exporting user data', error);
      return {
        success: false,
        error: {
          code: 'EXPORT_ERROR',
          message: 'Failed to export user data'
        }
      };
    }
  }

  /**
   * Cleanup application resources
   */
  async cleanup(): Promise<void> {
    try {
      this.logger.info('Cleaning up application resources...');

      // Clear any timers or intervals
      // Close any open connections
      // Clear sensitive data from memory

      this.currentUser = null;
      this.logger.info('Application cleanup completed');
    } catch (error) {
      this.logger.error('Error during application cleanup', error);
    }
  }
}

export default Application;

export {
  Application,
  type User,
  type UserRole,
  type ApiResponse,
  type LoginCredentials,
  type UserCreationData,
  type UserUpdateData,
  type PaginationParams,
  type SortOptions
};