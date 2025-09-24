/**
 * TypeScript Practice: Line Targets and Matching
 *
 * This file contains TypeScript code designed for practicing line jump commands
 * and line-specific navigation (G, gg, :number, %, matching brackets).
 *
 * Focus on jumping to specific line numbers and matching paired delimiters.
 */

// Line 10: Function with complex bracket matching
function processComplexDataStructure(
  data: {
    users: Array<{
      id: string;
      profile: {
        personal: {
          name: string;
          contacts: {
            emails: string[];
            phones: Array<{
              number: string;
              type: 'mobile' | 'home' | 'work';
            }>;
          };
        };
        preferences: {
          settings: {
            theme: 'light' | 'dark';
            notifications: {
              email: boolean;
              push: boolean;
              sms: boolean;
            };
          };
        };
      };
    }>;
    metadata: {
      version: string;
      timestamp: Date;
      source: {
        application: string;
        environment: 'dev' | 'staging' | 'prod';
      };
    };
  },
  options: {
    validation: {
      strict: boolean;
      rules: Array<{
        field: string;
        required: boolean;
        validators: Array<{
          type: 'regex' | 'length' | 'range' | 'custom';
          params: {
            pattern?: string;
            min?: number;
            max?: number;
            validator?: (value: any) => boolean;
          };
        }>;
      }>;
    };
    transformation: {
      enabled: boolean;
      pipeline: Array<{
        stage: string;
        transformers: Array<{
          name: string;
          config: {
            inputPath: string;
            outputPath: string;
            mapping: {
              [key: string]: {
                source: string;
                target: string;
                converter?: (value: any) => any;
              };
            };
          };
        }>;
      }>;
    };
  }
): Promise<{
  success: boolean;
  result?: {
    processedData: typeof data;
    statistics: {
      totalUsers: number;
      validationErrors: Array<{
        userId: string;
        field: string;
        error: string;
      }>;
      transformationResults: {
        appliedTransformers: string[];
        skippedTransformers: string[];
        errors: Array<{
          transformer: string;
          error: string;
        }>;
      };
    };
  };
  error?: {
    code: string;
    message: string;
    details: Record<string, any>;
  };
}> {
  // Line 100: Implementation starts here
  return new Promise((resolve, reject) => {
    try {
      const startTime = performance.now();
      
      // Validate input data structure
      if (!data || !data.users || !Array.isArray(data.users)) {
        resolve({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Invalid data structure provided',
            details: { expectedStructure: 'Object with users array' }
          }
        });
        return;
      }

      // Process each user
      const validationErrors: Array<{ userId: string; field: string; error: string }> = [];
      const processedUsers = data.users.map((user) => {
        // Validate user structure
        if (!user.id || typeof user.id !== 'string') {
          validationErrors.push({
            userId: user.id || 'unknown',
            field: 'id',
            error: 'User ID is required and must be a string'
          });
        }

        // Validate profile structure
        if (!user.profile || typeof user.profile !== 'object') {
          validationErrors.push({
            userId: user.id,
            field: 'profile',
            error: 'User profile is required'
          });
        } else {
          // Validate personal information
          if (!user.profile.personal || typeof user.profile.personal !== 'object') {
            validationErrors.push({
              userId: user.id,
              field: 'profile.personal',
              error: 'Personal information is required'
            });
          } else {
            if (!user.profile.personal.name || typeof user.profile.personal.name !== 'string') {
              validationErrors.push({
                userId: user.id,
                field: 'profile.personal.name',
                error: 'Name is required and must be a string'
              });
            }

            // Validate contacts
            if (user.profile.personal.contacts) {
              if (!Array.isArray(user.profile.personal.contacts.emails)) {
                validationErrors.push({
                  userId: user.id,
                  field: 'profile.personal.contacts.emails',
                  error: 'Emails must be an array'
                });
              }

              if (!Array.isArray(user.profile.personal.contacts.phones)) {
                validationErrors.push({
                  userId: user.id,
                  field: 'profile.personal.contacts.phones',
                  error: 'Phones must be an array'
                });
              } else {
                user.profile.personal.contacts.phones.forEach((phone, index) => {
                  if (!phone.number || typeof phone.number !== 'string') {
                    validationErrors.push({
                      userId: user.id,
                      field: `profile.personal.contacts.phones[${index}].number`,
                      error: 'Phone number is required'
                    });
                  }

                  if (!['mobile', 'home', 'work'].includes(phone.type)) {
                    validationErrors.push({
                      userId: user.id,
                      field: `profile.personal.contacts.phones[${index}].type`,
                      error: 'Phone type must be mobile, home, or work'
                    });
                  }
                });
              }
            }
          }

          // Validate preferences
          if (user.profile.preferences) {
            if (user.profile.preferences.settings) {
              if (user.profile.preferences.settings.theme &&
                  !['light', 'dark'].includes(user.profile.preferences.settings.theme)) {
                validationErrors.push({
                  userId: user.id,
                  field: 'profile.preferences.settings.theme',
                  error: 'Theme must be light or dark'
                });
              }

              if (user.profile.preferences.settings.notifications) {
                const notifications = user.profile.preferences.settings.notifications;
                ['email', 'push', 'sms'].forEach((field) => {
                  if (notifications[field as keyof typeof notifications] !== undefined &&
                      typeof notifications[field as keyof typeof notifications] !== 'boolean') {
                    validationErrors.push({
                      userId: user.id,
                      field: `profile.preferences.settings.notifications.${field}`,
                      error: `${field} notification setting must be a boolean`
                    });
                  }
                });
              }
            }
          }
        }

        return user;
      });

      // Line 200: Apply transformations if enabled
      let transformationResults = {
        appliedTransformers: [] as string[],
        skippedTransformers: [] as string[],
        errors: [] as Array<{ transformer: string; error: string }>
      };

      if (options.transformation && options.transformation.enabled) {
        options.transformation.pipeline.forEach((stage) => {
          stage.transformers.forEach((transformer) => {
            try {
              // Apply transformer logic here
              transformationResults.appliedTransformers.push(transformer.name);
            } catch (error) {
              transformationResults.errors.push({
                transformer: transformer.name,
                error: error instanceof Error ? error.message : 'Unknown error'
              });
            }
          });
        });
      }

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Line 225: Return success result
      resolve({
        success: true,
        result: {
          processedData: {
            ...data,
            users: processedUsers
          },
          statistics: {
            totalUsers: processedUsers.length,
            validationErrors,
            transformationResults
          }
        }
      });

    } catch (error) {
      // Line 240: Handle unexpected errors
      reject({
        success: false,
        error: {
          code: 'PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown processing error',
          details: { processingStage: 'main', timestamp: new Date().toISOString() }
        }
      });
    }
  });
}

// Line 250: Complex class with nested methods
class DataValidator {
  private rules: ValidationRule[];
  private cache: Map<string, boolean>;

  constructor(rules: ValidationRule[]) {
    this.rules = rules;
    this.cache = new Map();
  }

  validate(data: any, path: string = ''): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    this.rules.forEach((rule) => {
      const fieldPath = path ? `${path}.${rule.field}` : rule.field;
      const value = this.getNestedValue(data, rule.field);

      if (rule.required && (value === undefined || value === null)) {
        errors.push({
          field: fieldPath,
          message: `${rule.field} is required`,
          code: 'REQUIRED_FIELD_MISSING'
        });
        return;
      }

      if (value !== undefined && value !== null) {
        rule.validators.forEach((validator) => {
          const result = this.executeValidator(value, validator, fieldPath);
          if (!result.valid) {
            if (result.severity === 'error') {
              errors.push({
                field: fieldPath,
                message: result.message,
                code: result.code
              });
            } else {
              warnings.push({
                field: fieldPath,
                message: result.message,
                code: result.code
              });
            }
          }
        });
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  // Line 300: Private helper methods
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      if (current && typeof current === 'object' && key in current) {
        return current[key];
      }
      return undefined;
    }, obj);
  }

  private executeValidator(
    value: any,
    validator: ValidatorConfig,
    fieldPath: string
  ): { valid: boolean; message: string; code: string; severity: 'error' | 'warning' } {
    switch (validator.type) {
      case 'regex':
        if (validator.params.pattern) {
          const regex = new RegExp(validator.params.pattern);
          const valid = regex.test(String(value));
          return {
            valid,
            message: valid ? '' : `${fieldPath} does not match required pattern`,
            code: 'PATTERN_MISMATCH',
            severity: 'error'
          };
        }
        break;

      case 'length':
        const length = Array.isArray(value) ? value.length : String(value).length;
        const minLength = validator.params.min || 0;
        const maxLength = validator.params.max || Infinity;
        const valid = length >= minLength && length <= maxLength;
        return {
          valid,
          message: valid ? '' : `${fieldPath} length must be between ${minLength} and ${maxLength}`,
          code: 'LENGTH_INVALID',
          severity: 'error'
        };

      case 'range':
        if (typeof value === 'number') {
          const min = validator.params.min || -Infinity;
          const max = validator.params.max || Infinity;
          const valid = value >= min && value <= max;
          return {
            valid,
            message: valid ? '' : `${fieldPath} must be between ${min} and ${max}`,
            code: 'VALUE_OUT_OF_RANGE',
            severity: 'error'
          };
        }
        break;

      case 'custom':
        if (validator.params.validator) {
          try {
            const valid = validator.params.validator(value);
            return {
              valid,
              message: valid ? '' : `${fieldPath} failed custom validation`,
              code: 'CUSTOM_VALIDATION_FAILED',
              severity: 'error'
            };
          } catch (error) {
            return {
              valid: false,
              message: `${fieldPath} custom validator threw an error`,
              code: 'VALIDATOR_ERROR',
              severity: 'error'
            };
          }
        }
        break;
    }

    return {
      valid: true,
      message: '',
      code: '',
      severity: 'error'
    };
  }
}

// Line 400: Supporting interfaces with complex nesting
interface ValidationRule {
  field: string;
  required: boolean;
  validators: ValidatorConfig[];
}

interface ValidatorConfig {
  type: 'regex' | 'length' | 'range' | 'custom';
  params: {
    pattern?: string;
    min?: number;
    max?: number;
    validator?: (value: any) => boolean;
  };
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}

interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

// Line 440: More complex nested structures
const complexConfigurationObject = {
  application: {
    name: 'DataProcessor',
    version: '2.1.0',
    environment: 'production',
    features: {
      authentication: {
        enabled: true,
        providers: [
          {
            name: 'oauth2',
            config: {
              clientId: 'app-client-id',
              clientSecret: 'secret-key',
              redirectUri: 'https://app.example.com/auth/callback',
              scopes: ['read', 'write', 'admin']
            }
          },
          {
            name: 'saml',
            config: {
              entityId: 'app-entity-id',
              ssoUrl: 'https://idp.example.com/sso',
              certificate: 'base64-encoded-cert',
              attributes: {
                email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
                name: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
                role: 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
              }
            }
          }
        ]
      },
      database: {
        enabled: true,
        connections: {
          primary: {
            host: 'primary-db.example.com',
            port: 5432,
            database: 'app_production',
            username: 'app_user',
            password: 'secure_password',
            ssl: {
              enabled: true,
              rejectUnauthorized: true,
              ca: 'ca-certificate',
              cert: 'client-certificate',
              key: 'client-key'
            },
            pool: {
              min: 5,
              max: 20,
              idleTimeoutMillis: 30000,
              connectionTimeoutMillis: 2000
            }
          },
          readonly: {
            host: 'readonly-db.example.com',
            port: 5432,
            database: 'app_production_readonly',
            username: 'readonly_user',
            password: 'readonly_password',
            ssl: {
              enabled: true,
              rejectUnauthorized: true
            },
            pool: {
              min: 2,
              max: 10,
              idleTimeoutMillis: 30000
            }
          }
        }
      },
      caching: {
        enabled: true,
        providers: {
          redis: {
            host: 'redis.example.com',
            port: 6379,
            password: 'redis_password',
            database: 0,
            keyPrefix: 'app:',
            ttl: 3600,
            cluster: {
              enabled: true,
              nodes: [
                { host: 'redis-1.example.com', port: 6379 },
                { host: 'redis-2.example.com', port: 6379 },
                { host: 'redis-3.example.com', port: 6379 }
              ]
            }
          },
          memory: {
            maxSize: '100MB',
            ttl: 1800,
            evictionPolicy: 'lru'
          }
        }
      }
    }
  },
  monitoring: {
    enabled: true,
    metrics: {
      prometheus: {
        enabled: true,
        endpoint: '/metrics',
        port: 9090
      },
      custom: {
        enabled: true,
        collectors: [
          {
            name: 'database_connections',
            type: 'gauge',
            help: 'Number of active database connections'
          },
          {
            name: 'api_requests_total',
            type: 'counter',
            help: 'Total number of API requests',
            labels: ['method', 'endpoint', 'status']
          },
          {
            name: 'request_duration_seconds',
            type: 'histogram',
            help: 'Request duration in seconds',
            buckets: [0.1, 0.5, 1, 2, 5, 10]
          }
        ]
      }
    },
    logging: {
      level: 'info',
      format: 'json',
      outputs: [
        {
          type: 'file',
          filename: '/var/log/app.log',
          maxSize: '100MB',
          maxFiles: 10,
          rotation: {
            frequency: 'daily',
            datePattern: 'YYYY-MM-DD'
          }
        },
        {
          type: 'console',
          colorize: true,
          timestamp: true
        }
      ]
    }
  }
};

// Line 600: Export section
export {
  processComplexDataStructure,
  DataValidator,
  type ValidationRule,
  type ValidatorConfig,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  complexConfigurationObject
};

export default DataValidator;