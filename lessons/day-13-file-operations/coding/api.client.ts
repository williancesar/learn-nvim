/**
 * Day 13: API Client Implementation
 *
 * Navigate here using :e api.client.ts
 * Practice horizontal split: :sp config.ts (to see configuration)
 * Practice closing splits: Ctrl-w c, :q
 */

import { Logger } from './utils';
import {
  ApiResponse,
  ApiClientConfig,
  RequestConfig,
  ResponseData,
  ApiError
} from './types';

/**
 * HTTP API Client for making requests to the backend
 * Navigate to config.ts to see the configuration structure: :e config.ts
 */
export class ApiClient {
  private config: ApiClientConfig;
  private logger: Logger;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig) {
    this.config = config;
    this.logger = new Logger('ApiClient');
  }

  /**
   * Set authentication token for requests
   */
  setAuthToken(token: string): void {
    this.authToken = token;
    this.logger.debug('Authentication token set');
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
    this.logger.debug('Authentication token cleared');
  }

  /**
   * GET request
   */
  async get<T>(url: string, options: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      ...options
    });
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, options: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...options
    });
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, options: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...options
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, options: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...options
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, options: Partial<RequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...options
    });
  }

  /**
   * Generic request method with retry logic
   */
  private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    this.logger.debug('Making API request', {
      requestId,
      method: config.method,
      url: config.url,
      hasData: !!config.data
    });

    let lastError: Error | null = null;
    let retryCount = 0;

    while (retryCount <= this.config.retries) {
      try {
        const response = await this.makeHttpRequest<T>(config, requestId);
        const duration = Date.now() - startTime;

        this.logger.debug('API request completed', {
          requestId,
          status: response.status,
          duration,
          retryCount
        });

        return this.handleResponse<T>(response, requestId);
      } catch (error) {
        lastError = error as Error;
        retryCount++;

        if (retryCount <= this.config.retries && this.isRetryableError(error)) {
          const delay = this.calculateRetryDelay(retryCount);

          this.logger.warn('API request failed, retrying', {
            requestId,
            retryCount,
            error: error.message,
            delayMs: delay
          });

          await this.sleep(delay);
        } else {
          break;
        }
      }
    }

    const duration = Date.now() - startTime;
    this.logger.error('API request failed after retries', {
      requestId,
      retryCount,
      duration,
      error: lastError?.message
    });

    return this.handleError<T>(lastError!, requestId);
  }

  /**
   * Make actual HTTP request using fetch API
   */
  private async makeHttpRequest<T>(config: RequestConfig, requestId: string): Promise<ResponseData<T>> {
    const url = this.buildUrl(config.url, config.params);
    const headers = this.buildHeaders(config.headers);
    const timeout = config.timeout || this.config.timeout;

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const fetchConfig: RequestInit = {
        method: config.method,
        headers,
        signal: controller.signal
      };

      // Add body for non-GET requests
      if (config.data && config.method !== 'GET') {
        if (headers['Content-Type']?.includes('application/json')) {
          fetchConfig.body = JSON.stringify(config.data);
        } else if (config.data instanceof FormData) {
          fetchConfig.body = config.data;
          // Remove Content-Type header to let browser set it with boundary
          delete headers['Content-Type'];
        } else {
          fetchConfig.body = config.data;
        }
      }

      const response = await fetch(url, fetchConfig);

      clearTimeout(timeoutId);

      let data: T;
      const contentType = response.headers.get('Content-Type') || '';

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else if (config.responseType === 'blob') {
        data = await response.blob() as T;
      } else if (config.responseType === 'arraybuffer') {
        data = await response.arrayBuffer() as T;
      } else {
        data = await response.text() as T;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: this.parseResponseHeaders(response.headers)
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Build complete URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const baseUrl = this.config.baseURL.replace(/\/$/, '');
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const fullUrl = `${baseUrl}${url}`;

    if (!params || Object.keys(params).length === 0) {
      return fullUrl;
    }

    const urlObj = new URL(fullUrl);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => urlObj.searchParams.append(key, String(item)));
        } else {
          urlObj.searchParams.set(key, String(value));
        }
      }
    });

    return urlObj.toString();
  }

  /**
   * Build request headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...this.config.headers,
      ...customHeaders
    };

    // Add authentication header
    if (this.authToken) {
      if (this.config.auth?.type === 'bearer') {
        headers['Authorization'] = `Bearer ${this.authToken}`;
      } else if (this.config.auth?.type === 'api-key') {
        headers['X-API-Key'] = this.authToken;
      }
    }

    return headers;
  }

  /**
   * Parse response headers to object
   */
  private parseResponseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};

    headers.forEach((value, key) => {
      result[key] = value;
    });

    return result;
  }

  /**
   * Handle successful response
   */
  private handleResponse<T>(response: ResponseData<T>, requestId: string): ApiResponse<T> {
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        meta: {
          timestamp: new Date(),
          requestId,
          version: '1.0'
        }
      };
    }

    // Handle HTTP error status codes
    const error: ApiError = {
      code: `HTTP_${response.status}`,
      message: response.statusText || 'HTTP Error'
    };

    // Try to extract error details from response
    if (response.data && typeof response.data === 'object') {
      const errorData = response.data as any;
      if (errorData.error) {
        error.code = errorData.error.code || error.code;
        error.message = errorData.error.message || error.message;
        error.details = errorData.error.details;
      }
    }

    return {
      success: false,
      error,
      meta: {
        timestamp: new Date(),
        requestId,
        version: '1.0'
      }
    };
  }

  /**
   * Handle request errors
   */
  private handleError<T>(error: Error, requestId: string): ApiResponse<T> {
    let apiError: ApiError = {
      code: 'NETWORK_ERROR',
      message: 'Network request failed'
    };

    if (error.name === 'AbortError') {
      apiError = {
        code: 'TIMEOUT_ERROR',
        message: 'Request timeout'
      };
    } else if (error.message.includes('fetch')) {
      apiError = {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch data from server'
      };
    } else {
      apiError.message = error.message;
    }

    return {
      success: false,
      error: apiError,
      meta: {
        timestamp: new Date(),
        requestId,
        version: '1.0'
      }
    };
  }

  /**
   * Check if error is retryable
   */
  private isRetryableError(error: any): boolean {
    // Don't retry client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      return false;
    }

    // Retry server errors (5xx) and network errors
    return true;
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(retryCount: number): number {
    const baseDelay = this.config.retryDelay || 1000;
    return Math.min(baseDelay * Math.pow(2, retryCount - 1), 30000); // Max 30 seconds
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate unique request ID for tracking
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: Date }>> {
    try {
      return await this.get<{ status: string; timestamp: Date }>('/health');
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'HEALTH_CHECK_FAILED',
          message: 'Health check request failed'
        }
      };
    }
  }

  /**
   * Upload file with progress tracking
   */
  async uploadFile(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ url: string; id: string }>> {
    const requestId = this.generateRequestId();

    this.logger.debug('Starting file upload', {
      requestId,
      filename: file.name,
      size: file.size,
      type: file.type
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const url = this.buildUrl(endpoint);
      const headers = this.buildHeaders();

      // Remove Content-Type to let browser set it with boundary
      delete headers['Content-Type'];

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                data,
                meta: {
                  timestamp: new Date(),
                  requestId,
                  version: '1.0'
                }
              });
            } catch (error) {
              reject(new Error('Invalid JSON response'));
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.addEventListener('timeout', () => {
          reject(new Error('Upload timeout'));
        });

        xhr.open('POST', url);

        // Set headers
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });

        xhr.timeout = this.config.timeout;
        xhr.send(formData);
      });
    } catch (error) {
      this.logger.error('File upload error', { requestId, error });
      return this.handleError<{ url: string; id: string }>(error as Error, requestId);
    }
  }

  /**
   * Download file
   */
  async downloadFile(url: string, filename?: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await this.get<Blob>(url, { responseType: 'blob' });

      if (response.success && response.data) {
        // Trigger download if filename provided
        if (filename) {
          const downloadUrl = URL.createObjectURL(response.data);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }
      }

      return response;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DOWNLOAD_ERROR',
          message: 'Failed to download file'
        }
      };
    }
  }
}

export default ApiClient;