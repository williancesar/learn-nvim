/**
 * Day 30: TypeScript System Clipboard Practice
 * Focus: Working with system clipboard operations and special registers
 *
 * Exercise Goals:
 * - Practice using + register (system clipboard)
 * - Learn * register (primary selection on X11)
 * - Master clipboard integration with complex TypeScript code
 * - Practice copying code to share externally
 */

// External API integration types
interface ExternalApiCredentials {
  apiKey: string;
  secretKey: string;
  endpoint: string;
  timeout: number;
}

// REST API client with system clipboard friendly formatting
class RestApiClient {
  private readonly baseUrl: string;
  private readonly credentials: ExternalApiCredentials;
  private readonly defaultHeaders: Record<string, string>;

  constructor(credentials: ExternalApiCredentials) {
    this.baseUrl = credentials.endpoint;
    this.credentials = credentials;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${credentials.apiKey}`,
      'X-API-Version': '2023-01-01',
    };
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.defaultHeaders,
      signal: AbortSignal.timeout(this.credentials.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T, U>(path: string, data: T): Promise<U> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.defaultHeaders,
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.credentials.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async put<T, U>(path: string, data: T): Promise<U> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.defaultHeaders,
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.credentials.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async delete(path: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.defaultHeaders,
      signal: AbortSignal.timeout(this.credentials.timeout),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }
}

// Data transfer objects for external systems
interface CustomerDto {
  id: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'suspended' | 'cancelled';
    billingCycle: 'monthly' | 'yearly';
    nextBillingDate: string;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    source: 'web' | 'api' | 'import';
    tags: string[];
  };
}

// External service integration patterns
class ExternalServiceIntegration {
  private apiClient: RestApiClient;
  private rateLimiter: Map<string, number> = new Map();
  private readonly maxRequestsPerMinute = 60;

  constructor(credentials: ExternalApiCredentials) {
    this.apiClient = new RestApiClient(credentials);
  }

  private async checkRateLimit(key: string): Promise<void> {
    const now = Date.now();
    const lastRequest = this.rateLimiter.get(key) || 0;
    const timeDiff = now - lastRequest;

    if (timeDiff < 60000 / this.maxRequestsPerMinute) {
      const waitTime = (60000 / this.maxRequestsPerMinute) - timeDiff;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.rateLimiter.set(key, Date.now());
  }

  async syncCustomer(customer: CustomerDto): Promise<boolean> {
    await this.checkRateLimit('customer-sync');

    try {
      await this.apiClient.post('/customers', customer);
      return true;
    } catch (error) {
      console.error('Failed to sync customer:', error);
      return false;
    }
  }

  async batchSyncCustomers(customers: CustomerDto[]): Promise<{
    successful: string[];
    failed: { id: string; error: string }[];
  }> {
    const results = {
      successful: [] as string[],
      failed: [] as { id: string; error: string }[],
    };

    for (const customer of customers) {
      try {
        await this.syncCustomer(customer);
        results.successful.push(customer.id);
      } catch (error) {
        results.failed.push({
          id: customer.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }
}

// Configuration templates for external sharing
const developmentConfig = {
  api: {
    baseUrl: 'https://dev-api.example.com',
    timeout: 5000,
    retries: 3,
  },
  database: {
    host: 'localhost',
    port: 5432,
    database: 'app_dev',
    ssl: false,
  },
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0,
  },
  logging: {
    level: 'debug',
    file: './logs/app.log',
    console: true,
  },
};

const productionConfig = {
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 10000,
    retries: 5,
  },
  database: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_NAME!,
    ssl: true,
  },
  redis: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    db: 0,
  },
  logging: {
    level: 'info',
    file: '/var/log/app/app.log',
    console: false,
  },
};

// Utility functions for clipboard-friendly code sharing
export const createApiClient = (env: 'development' | 'production') => {
  const config = env === 'development' ? developmentConfig : productionConfig;

  return new RestApiClient({
    apiKey: process.env.API_KEY!,
    secretKey: process.env.SECRET_KEY!,
    endpoint: config.api.baseUrl,
    timeout: config.api.timeout,
  });
};

export const validateCustomerData = (data: Partial<CustomerDto>): string[] => {
  const errors: string[] = [];

  if (!data.companyName?.trim()) {
    errors.push('Company name is required');
  }

  if (!data.contactEmail || !/\S+@\S+\.\S+/.test(data.contactEmail)) {
    errors.push('Valid contact email is required');
  }

  if (!data.subscription?.plan) {
    errors.push('Subscription plan is required');
  }

  if (!data.address?.country) {
    errors.push('Country is required');
  }

  return errors;
};

// Sample data blocks perfect for clipboard operations
export const sampleCustomers: CustomerDto[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    companyName: 'Tech Solutions Inc.',
    contactEmail: 'contact@techsolutions.com',
    contactPhone: '+1-555-0123',
    address: {
      street: '123 Innovation Drive',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
    subscription: {
      plan: 'enterprise',
      status: 'active',
      billingCycle: 'yearly',
      nextBillingDate: '2024-12-31',
    },
    metadata: {
      createdAt: '2023-01-15T10:30:00Z',
      updatedAt: '2023-09-20T14:45:00Z',
      source: 'web',
      tags: ['high-value', 'enterprise', 'tech'],
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    companyName: 'Creative Agency LLC',
    contactEmail: 'hello@creativeagency.com',
    contactPhone: '+1-555-0456',
    address: {
      street: '456 Design Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    subscription: {
      plan: 'premium',
      status: 'active',
      billingCycle: 'monthly',
      nextBillingDate: '2023-10-15',
    },
    metadata: {
      createdAt: '2023-03-22T09:15:00Z',
      updatedAt: '2023-09-18T11:30:00Z',
      source: 'api',
      tags: ['creative', 'design', 'marketing'],
    },
  },
];

// Code snippets for external documentation
export const quickStartExample = `
// Quick start with TypeScript API client
import { createApiClient, validateCustomerData } from './practice';

const client = createApiClient('development');
const integration = new ExternalServiceIntegration(credentials);

// Sync a customer
const result = await integration.syncCustomer(sampleCustomers[0]);
console.log('Sync result:', result);
`;

export const errorHandlingExample = `
// Error handling patterns
try {
  const customers = await client.get<CustomerDto[]>('/customers');
  const validationErrors = customers
    .map(customer => ({
      id: customer.id,
      errors: validateCustomerData(customer)
    }))
    .filter(result => result.errors.length > 0);

  if (validationErrors.length > 0) {
    console.warn('Found validation errors:', validationErrors);
  }
} catch (error) {
  console.error('API request failed:', error);
}
`;