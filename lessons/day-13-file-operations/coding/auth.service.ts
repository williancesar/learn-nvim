/**
 * Day 13: Authentication Service Implementation
 *
 * Navigate here from practice.ts using :e auth.service.ts
 * Try opening multiple files in tabs: :tabnew types.ts, then :tabnew utils.ts
 * Practice tab navigation: gt, gT, :tabc, :tabo
 */

import { ApiClient } from './api.client';
import { Logger } from './utils';
import {
  User,
  ApiResponse,
  LoginCredentials,
  LoginResponse,
  RefreshTokenRequest,
  PasswordResetRequest,
  PasswordResetConfirmation,
  ChangePasswordRequest
} from './types';

/**
 * AuthService handles user authentication and session management
 * Navigate to utils.ts to see the Logger implementation: :e utils.ts
 */
export class AuthService {
  private apiClient: ApiClient;
  private logger: Logger;
  private currentToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiresAt: Date | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor(apiClient: ApiClient, logger: Logger) {
    this.apiClient = apiClient;
    this.logger = logger.createChild('AuthService');

    // Set up token refresh timer
    this.setupTokenRefresh();
  }

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    try {
      this.logger.info('Attempting user login', { email: credentials.email });

      // Validate credentials
      const validationResult = this.validateLoginCredentials(credentials);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid credentials format',
            details: validationResult.errors
          }
        };
      }

      // Prepare login request
      const loginData = {
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      };

      const response = await this.apiClient.post<LoginResponse>('/auth/login', loginData);

      if (response.success && response.data) {
        const { user, token, refreshToken, expiresAt } = response.data;

        // Store authentication tokens
        this.currentToken = token;
        this.refreshToken = refreshToken;
        this.tokenExpiresAt = new Date(expiresAt);

        // Update API client with new token
        this.apiClient.setAuthToken(token);

        // Store in localStorage for persistence
        this.storeTokens(token, refreshToken, expiresAt);

        // Setup automatic token refresh
        this.scheduleTokenRefresh();

        this.logger.info('User login successful', { userId: user.id });

        return {
          success: true,
          data: user
        };
      }

      return response as ApiResponse<User>;
    } catch (error) {
      this.logger.error('Login error', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: 'Authentication failed'
        }
      };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<ApiResponse<boolean>> {
    try {
      this.logger.info('Logging out user');

      // Call logout endpoint if we have a token
      if (this.currentToken) {
        try {
          await this.apiClient.post('/auth/logout', {
            refreshToken: this.refreshToken
          });
        } catch (error) {
          this.logger.warn('Logout API call failed, continuing with local cleanup', error);
        }
      }

      // Clear all authentication data
      this.clearAuthenticationData();

      this.logger.info('User logout completed');

      return {
        success: true,
        data: true
      };
    } catch (error) {
      this.logger.error('Logout error', error);

      // Even if logout fails, clear local data
      this.clearAuthenticationData();

      return {
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: 'Logout failed, but session cleared locally'
        }
      };
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshAuthToken(): Promise<ApiResponse<string>> {
    try {
      if (!this.refreshToken) {
        return {
          success: false,
          error: {
            code: 'NO_REFRESH_TOKEN',
            message: 'No refresh token available'
          }
        };
      }

      this.logger.debug('Refreshing authentication token');

      const request: RefreshTokenRequest = {
        refreshToken: this.refreshToken
      };

      const response = await this.apiClient.post<LoginResponse>('/auth/refresh', request);

      if (response.success && response.data) {
        const { token, refreshToken, expiresAt } = response.data;

        // Update stored tokens
        this.currentToken = token;
        this.refreshToken = refreshToken;
        this.tokenExpiresAt = new Date(expiresAt);

        // Update API client
        this.apiClient.setAuthToken(token);

        // Update localStorage
        this.storeTokens(token, refreshToken, expiresAt);

        // Schedule next refresh
        this.scheduleTokenRefresh();

        this.logger.debug('Token refreshed successfully');

        return {
          success: true,
          data: token
        };
      }

      return response as ApiResponse<string>;
    } catch (error) {
      this.logger.error('Token refresh error', error);

      // If refresh fails, clear authentication
      this.clearAuthenticationData();

      return {
        success: false,
        error: {
          code: 'TOKEN_REFRESH_ERROR',
          message: 'Failed to refresh authentication token'
        }
      };
    }
  }

  /**
   * Validate existing token
   */
  async validateToken(token: string): Promise<User> {
    try {
      this.logger.debug('Validating authentication token');

      // Set token temporarily for validation
      this.apiClient.setAuthToken(token);

      const response = await this.apiClient.get<User>('/auth/validate');

      if (response.success && response.data) {
        // Token is valid, store it
        this.currentToken = token;
        this.logger.debug('Token validation successful', { userId: response.data.id });
        return response.data;
      }

      throw new Error('Invalid token');
    } catch (error) {
      this.logger.warn('Token validation failed', error);
      this.apiClient.clearAuthToken();
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(request: PasswordResetRequest): Promise<ApiResponse<boolean>> {
    try {
      this.logger.info('Requesting password reset', { email: request.email });

      if (!this.isValidEmail(request.email)) {
        return {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Please provide a valid email address'
          }
        };
      }

      const requestData = {
        email: request.email.toLowerCase().trim()
      };

      const response = await this.apiClient.post<boolean>('/auth/password-reset/request', requestData);

      if (response.success) {
        this.logger.info('Password reset request sent', { email: request.email });
      }

      return response;
    } catch (error) {
      this.logger.error('Password reset request error', error);
      return {
        success: false,
        error: {
          code: 'PASSWORD_RESET_ERROR',
          message: 'Failed to request password reset'
        }
      };
    }
  }

  /**
   * Confirm password reset with token
   */
  async confirmPasswordReset(confirmation: PasswordResetConfirmation): Promise<ApiResponse<boolean>> {
    try {
      this.logger.info('Confirming password reset');

      // Validate new password
      if (!this.isValidPassword(confirmation.newPassword)) {
        return {
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'Password must be at least 8 characters long'
          }
        };
      }

      const response = await this.apiClient.post<boolean>('/auth/password-reset/confirm', confirmation);

      if (response.success) {
        this.logger.info('Password reset confirmed successfully');
      }

      return response;
    } catch (error) {
      this.logger.error('Password reset confirmation error', error);
      return {
        success: false,
        error: {
          code: 'PASSWORD_RESET_CONFIRM_ERROR',
          message: 'Failed to reset password'
        }
      };
    }
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<boolean>> {
    try {
      this.logger.info('Changing user password');

      if (!this.currentToken) {
        return {
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'User is not authenticated'
          }
        };
      }

      // Validate new password
      if (!this.isValidPassword(request.newPassword)) {
        return {
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: 'New password must be at least 8 characters long'
          }
        };
      }

      const response = await this.apiClient.post<boolean>('/auth/change-password', request);

      if (response.success) {
        this.logger.info('Password changed successfully');
      }

      return response;
    } catch (error) {
      this.logger.error('Password change error', error);
      return {
        success: false,
        error: {
          code: 'PASSWORD_CHANGE_ERROR',
          message: 'Failed to change password'
        }
      };
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.currentToken !== null && this.isTokenValid();
  }

  /**
   * Get current authentication token
   */
  getCurrentToken(): string | null {
    return this.isTokenValid() ? this.currentToken : null;
  }

  /**
   * Get token expiration time
   */
  getTokenExpiresAt(): Date | null {
    return this.tokenExpiresAt;
  }

  /**
   * Private helper methods
   */
  private validateLoginCredentials(credentials: LoginCredentials): {
    isValid: boolean;
    errors: Record<string, string[]>;
  } {
    const errors: Record<string, string[]> = {};

    if (!credentials.email || !this.isValidEmail(credentials.email)) {
      errors.email = ['Valid email address is required'];
    }

    if (!credentials.password || credentials.password.length === 0) {
      errors.password = ['Password is required'];
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password && password.length >= 8;
  }

  private isTokenValid(): boolean {
    if (!this.tokenExpiresAt) return false;
    return new Date() < this.tokenExpiresAt;
  }

  private storeTokens(token: string, refreshToken: string, expiresAt: Date): void {
    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('token_expires_at', expiresAt.toISOString());
    } catch (error) {
      this.logger.warn('Failed to store tokens in localStorage', error);
    }
  }

  private loadStoredTokens(): void {
    try {
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('refresh_token');
      const expiresAt = localStorage.getItem('token_expires_at');

      if (token && refreshToken && expiresAt) {
        this.currentToken = token;
        this.refreshToken = refreshToken;
        this.tokenExpiresAt = new Date(expiresAt);

        if (this.isTokenValid()) {
          this.apiClient.setAuthToken(token);
          this.scheduleTokenRefresh();
        } else {
          this.clearStoredTokens();
        }
      }
    } catch (error) {
      this.logger.warn('Failed to load stored tokens', error);
      this.clearStoredTokens();
    }
  }

  private clearStoredTokens(): void {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
    } catch (error) {
      this.logger.warn('Failed to clear stored tokens', error);
    }
  }

  private clearAuthenticationData(): void {
    // Clear in-memory data
    this.currentToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = null;

    // Clear stored tokens
    this.clearStoredTokens();

    // Clear API client token
    this.apiClient.clearAuthToken();

    // Clear refresh timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private setupTokenRefresh(): void {
    // Load any existing tokens on startup
    this.loadStoredTokens();
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.tokenExpiresAt) return;

    // Schedule refresh 5 minutes before expiration
    const refreshTime = this.tokenExpiresAt.getTime() - Date.now() - (5 * 60 * 1000);

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshAuthToken().catch(error => {
          this.logger.error('Automatic token refresh failed', error);
        });
      }, refreshTime);

      this.logger.debug('Token refresh scheduled', {
        refreshIn: refreshTime,
        expiresAt: this.tokenExpiresAt
      });
    }
  }
}

export default AuthService;