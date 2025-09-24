/**
 * Day 13: User Service Implementation
 *
 * Navigate here from practice.ts using :e user.service.ts
 * Try opening in a vertical split: :vsp user.service.ts
 * Practice buffer navigation: :bn, :bp, :ls, :b2, etc.
 */

import { ApiClient } from './api.client';
import { Logger } from './utils';
import {
  User,
  UserRole,
  ApiResponse,
  UserCreationData,
  UserUpdateData,
  UserSearchCriteria,
  PaginationParams,
  SortOptions,
  PaginationMeta
} from './types';

/**
 * UserService handles all user-related operations
 * Navigate to api.client.ts to see the HTTP client implementation
 */
export class UserService {
  private apiClient: ApiClient;
  private logger: Logger;
  private cache: Map<string, { user: User; expiresAt: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(apiClient: ApiClient, logger: Logger) {
    this.apiClient = apiClient;
    this.logger = logger.createChild('UserService');
  }

  /**
   * Create a new user
   */
  async createUser(userData: UserCreationData): Promise<ApiResponse<User>> {
    try {
      this.logger.info('Creating new user', { email: userData.email });

      // Validate user data
      const validationResult = this.validateUserCreationData(userData);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid user data',
            details: validationResult.errors
          }
        };
      }

      // Prepare user data for API
      const requestData = {
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        firstName: userData.firstName.trim(),
        lastName: userData.lastName.trim(),
        role: userData.role || UserRole.USER,
        profile: userData.profile || {},
        preferences: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          privacy: {
            profileVisible: true,
            emailVisible: false,
            lastSeenVisible: true
          },
          ...userData.preferences
        }
      };

      const response = await this.apiClient.post<User>('/users', requestData);

      if (response.success && response.data) {
        this.logger.info('User created successfully', { userId: response.data.id });
        this.setCachedUser(response.data);
      }

      return response;
    } catch (error) {
      this.logger.error('Error creating user', error);
      return {
        success: false,
        error: {
          code: 'USER_CREATION_ERROR',
          message: 'Failed to create user'
        }
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      this.logger.debug('Fetching user by ID', { userId });

      // Check cache first
      const cachedUser = this.getCachedUser(userId);
      if (cachedUser) {
        this.logger.debug('User found in cache', { userId });
        return {
          success: true,
          data: cachedUser
        };
      }

      const response = await this.apiClient.get<User>(`/users/${userId}`);

      if (response.success && response.data) {
        this.setCachedUser(response.data);
        this.logger.debug('User fetched successfully', { userId });
      }

      return response;
    } catch (error) {
      this.logger.error('Error fetching user', { userId, error });
      return {
        success: false,
        error: {
          code: 'USER_FETCH_ERROR',
          message: 'Failed to fetch user'
        }
      };
    }
  }

  /**
   * Update user data
   */
  async updateUser(userId: string, updateData: UserUpdateData): Promise<ApiResponse<User>> {
    try {
      this.logger.info('Updating user', { userId, updateData });

      // Validate update data
      const validationResult = this.validateUserUpdateData(updateData);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid update data',
            details: validationResult.errors
          }
        };
      }

      // Prepare update data
      const requestData = { ...updateData };
      if (requestData.firstName) {
        requestData.firstName = requestData.firstName.trim();
      }
      if (requestData.lastName) {
        requestData.lastName = requestData.lastName.trim();
      }

      const response = await this.apiClient.put<User>(`/users/${userId}`, requestData);

      if (response.success && response.data) {
        this.logger.info('User updated successfully', { userId });
        this.setCachedUser(response.data);
      }

      return response;
    } catch (error) {
      this.logger.error('Error updating user', { userId, error });
      return {
        success: false,
        error: {
          code: 'USER_UPDATE_ERROR',
          message: 'Failed to update user'
        }
      };
    }
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<ApiResponse<boolean>> {
    try {
      this.logger.info('Deleting user', { userId });

      const response = await this.apiClient.delete<boolean>(`/users/${userId}`);

      if (response.success) {
        this.logger.info('User deleted successfully', { userId });
        this.removeCachedUser(userId);
      }

      return response;
    } catch (error) {
      this.logger.error('Error deleting user', { userId, error });
      return {
        success: false,
        error: {
          code: 'USER_DELETE_ERROR',
          message: 'Failed to delete user'
        }
      };
    }
  }

  /**
   * Get paginated list of users
   */
  async getUsers(
    params: PaginationParams = { page: 1, limit: 20 },
    sort: SortOptions = { field: 'createdAt', order: 'desc' }
  ): Promise<ApiResponse<User[]>> {
    try {
      this.logger.debug('Fetching users list', { params, sort });

      const queryParams = {
        page: params.page,
        limit: Math.min(params.limit, 100), // Max 100 users per page
        sortBy: sort.field,
        sortOrder: sort.order
      };

      const response = await this.apiClient.get<User[]>('/users', { params: queryParams });

      if (response.success && response.data) {
        this.logger.debug('Users fetched successfully', { count: response.data.length });

        // Cache fetched users
        response.data.forEach(user => this.setCachedUser(user));
      }

      return response;
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
   * Search users by various criteria
   */
  async searchUsers(query: string, filters?: UserSearchCriteria): Promise<ApiResponse<User[]>> {
    try {
      this.logger.debug('Searching users', { query, filters });

      const searchParams = {
        q: query.trim(),
        ...filters
      };

      // Convert date objects to ISO strings for API
      if (searchParams.createdAfter) {
        searchParams.createdAfter = searchParams.createdAfter.toISOString();
      }
      if (searchParams.createdBefore) {
        searchParams.createdBefore = searchParams.createdBefore.toISOString();
      }
      if (searchParams.lastLoginAfter) {
        searchParams.lastLoginAfter = searchParams.lastLoginAfter.toISOString();
      }
      if (searchParams.lastLoginBefore) {
        searchParams.lastLoginBefore = searchParams.lastLoginBefore.toISOString();
      }

      const response = await this.apiClient.get<User[]>('/users/search', { params: searchParams });

      if (response.success && response.data) {
        this.logger.debug('User search completed', { count: response.data.length });

        // Cache search results
        response.data.forEach(user => this.setCachedUser(user));
      }

      return response;
    } catch (error) {
      this.logger.error('Error searching users', { query, error });
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
   * Get user by email address
   */
  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    try {
      this.logger.debug('Fetching user by email', { email });

      const normalizedEmail = email.toLowerCase().trim();
      const response = await this.apiClient.get<User>(`/users/by-email/${encodeURIComponent(normalizedEmail)}`);

      if (response.success && response.data) {
        this.setCachedUser(response.data);
        this.logger.debug('User found by email', { userId: response.data.id });
      }

      return response;
    } catch (error) {
      this.logger.error('Error fetching user by email', { email, error });
      return {
        success: false,
        error: {
          code: 'USER_FETCH_ERROR',
          message: 'Failed to fetch user by email'
        }
      };
    }
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, newRole: UserRole): Promise<ApiResponse<User>> {
    try {
      this.logger.info('Updating user role', { userId, newRole });

      const response = await this.apiClient.patch<User>(`/users/${userId}/role`, { role: newRole });

      if (response.success && response.data) {
        this.logger.info('User role updated successfully', { userId, newRole });
        this.setCachedUser(response.data);
      }

      return response;
    } catch (error) {
      this.logger.error('Error updating user role', { userId, newRole, error });
      return {
        success: false,
        error: {
          code: 'ROLE_UPDATE_ERROR',
          message: 'Failed to update user role'
        }
      };
    }
  }

  /**
   * Activate or deactivate user account
   */
  async setUserActiveStatus(userId: string, isActive: boolean): Promise<ApiResponse<User>> {
    try {
      this.logger.info('Setting user active status', { userId, isActive });

      const response = await this.apiClient.patch<User>(`/users/${userId}/status`, { isActive });

      if (response.success && response.data) {
        this.logger.info('User status updated successfully', { userId, isActive });
        this.setCachedUser(response.data);
      }

      return response;
    } catch (error) {
      this.logger.error('Error updating user status', { userId, isActive, error });
      return {
        success: false,
        error: {
          code: 'STATUS_UPDATE_ERROR',
          message: 'Failed to update user status'
        }
      };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<ApiResponse<Record<string, number>>> {
    try {
      this.logger.debug('Fetching user statistics');

      const response = await this.apiClient.get<Record<string, number>>('/users/stats');

      if (response.success) {
        this.logger.debug('User statistics fetched successfully');
      }

      return response;
    } catch (error) {
      this.logger.error('Error fetching user statistics', error);
      return {
        success: false,
        error: {
          code: 'STATS_FETCH_ERROR',
          message: 'Failed to fetch user statistics'
        }
      };
    }
  }

  /**
   * Validate user creation data
   */
  private validateUserCreationData(userData: UserCreationData): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // Email validation
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.email = ['Valid email address is required'];
    }

    // Password validation
    if (!userData.password) {
      errors.password = ['Password is required'];
    } else if (userData.password.length < 8) {
      errors.password = ['Password must be at least 8 characters long'];
    }

    // Name validation
    if (!userData.firstName || userData.firstName.trim().length === 0) {
      errors.firstName = ['First name is required'];
    }

    if (!userData.lastName || userData.lastName.trim().length === 0) {
      errors.lastName = ['Last name is required'];
    }

    // Role validation
    if (userData.role && !Object.values(UserRole).includes(userData.role)) {
      errors.role = ['Invalid user role'];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate user update data
   */
  private validateUserUpdateData(updateData: UserUpdateData): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};

    // First name validation
    if (updateData.firstName !== undefined && updateData.firstName.trim().length === 0) {
      errors.firstName = ['First name cannot be empty'];
    }

    // Last name validation
    if (updateData.lastName !== undefined && updateData.lastName.trim().length === 0) {
      errors.lastName = ['Last name cannot be empty'];
    }

    // Role validation
    if (updateData.role && !Object.values(UserRole).includes(updateData.role)) {
      errors.role = ['Invalid user role'];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Email validation helper
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Cache management methods
   */
  private setCachedUser(user: User): void {
    this.cache.set(user.id, {
      user,
      expiresAt: Date.now() + this.cacheTimeout
    });
  }

  private getCachedUser(userId: string): User | null {
    const cached = this.cache.get(userId);
    if (!cached) return null;

    if (Date.now() > cached.expiresAt) {
      this.cache.delete(userId);
      return null;
    }

    return cached.user;
  }

  private removeCachedUser(userId: string): void {
    this.cache.delete(userId);
  }

  /**
   * Clear all cached users
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.debug('User cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; expired: number } {
    const now = Date.now();
    let expired = 0;

    for (const [userId, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        expired++;
        this.cache.delete(userId);
      }
    }

    return {
      size: this.cache.size,
      expired
    };
  }
}

export default UserService;