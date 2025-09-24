/**
 * Day 33: TypeScript Search & Replace Practice
 * Focus: Pattern matching and replacement operations with TypeScript code
 *
 * Exercise Goals:
 * - Practice search patterns with / and ? commands
 * - Master substitute commands (:s, :%s, :g) with TypeScript syntax
 * - Learn regex patterns for TypeScript-specific constructs
 * - Practice global search and replace across the file
 */

// Legacy naming conventions that need updating
interface UserDataOld {
  user_id: string;          // Should be: userId
  first_name: string;       // Should be: firstName
  last_name: string;        // Should be: lastName
  email_address: string;    // Should be: emailAddress
  phone_number: string;     // Should be: phoneNumber
  is_active: boolean;       // Should be: isActive
  created_at: Date;         // Should be: createdAt
  updated_at: Date;         // Should be: updatedAt
  last_login: Date;         // Should be: lastLogin
}

// Old API response format
interface ApiResponseOld {
  status_code: number;      // Should be: statusCode
  error_message?: string;   // Should be: errorMessage
  data_payload: any;        // Should be: dataPayload
  request_id: string;       // Should be: requestId
  response_time: number;    // Should be: responseTime
}

// Legacy function names that need modernization
class DataProcessorOld {
  // Old method names with underscores
  process_user_data(data: UserDataOld): void {
    console.log('Processing user data...');
  }

  validate_email_format(email: string): boolean {
    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email_regex.test(email);
  }

  format_phone_number(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  calculate_user_age(birth_date: Date): number {
    const current_date = new Date();
    const age_in_ms = current_date.getTime() - birth_date.getTime();
    return Math.floor(age_in_ms / (365.25 * 24 * 60 * 60 * 1000));
  }

  generate_user_token(user_id: string): string {
    const timestamp = Date.now();
    return `token_${user_id}_${timestamp}`;
  }

  send_welcome_email(email_address: string): Promise<boolean> {
    // Simulate email sending
    console.log(`Sending welcome email to: ${email_address}`);
    return Promise.resolve(true);
  }

  log_user_activity(user_id: string, activity_type: string): void {
    const log_entry = `[${new Date().toISOString()}] User ${user_id}: ${activity_type}`;
    console.log(log_entry);
  }
}

// Database queries with old naming conventions
const SQL_QUERIES = {
  SELECT_ALL_USERS: 'SELECT user_id, first_name, last_name FROM users',
  SELECT_USER_BY_ID: 'SELECT * FROM users WHERE user_id = ?',
  UPDATE_USER_LAST_LOGIN: 'UPDATE users SET last_login = NOW() WHERE user_id = ?',
  INSERT_NEW_USER: 'INSERT INTO users (first_name, last_name, email_address) VALUES (?, ?, ?)',
  DELETE_INACTIVE_USERS: 'DELETE FROM users WHERE is_active = FALSE AND last_login < ?',
  COUNT_ACTIVE_USERS: 'SELECT COUNT(*) as user_count FROM users WHERE is_active = TRUE',
};

// Old error handling patterns
class ErrorHandlerOld {
  handle_validation_error(error_message: string): void {
    console.error(`Validation Error: ${error_message}`);
  }

  handle_database_error(error_code: number, error_message: string): void {
    console.error(`Database Error [${error_code}]: ${error_message}`);
  }

  handle_network_error(request_url: string, error_details: string): void {
    console.error(`Network Error for ${request_url}: ${error_details}`);
  }

  log_error_with_context(error_type: string, error_message: string, user_id?: string): void {
    const log_entry = {
      timestamp: new Date().toISOString(),
      error_type,
      error_message,
      user_id: user_id || 'unknown',
      stack_trace: new Error().stack,
    };
    console.error('Error logged:', log_entry);
  }
}

// Configuration with inconsistent naming
const APP_CONFIG_OLD = {
  server_port: 3000,           // Should be: serverPort
  database_url: 'localhost',   // Should be: databaseUrl
  redis_host: 'localhost',     // Should be: redisHost
  redis_port: 6379,           // Should be: redisPort
  session_timeout: 1800,      // Should be: sessionTimeout
  max_file_size: 1048576,     // Should be: maxFileSize
  enable_logging: true,        // Should be: enableLogging
  log_level: 'info',          // Should be: logLevel
  api_base_url: '/api/v1',    // Should be: apiBaseUrl
  cors_enabled: true,         // Should be: corsEnabled
};

// Old validation functions with inconsistent patterns
const validateUserInput = (input: any): string[] => {
  const validation_errors: string[] = [];

  if (!input.first_name || input.first_name.trim() === '') {
    validation_errors.push('first_name is required');
  }

  if (!input.last_name || input.last_name.trim() === '') {
    validation_errors.push('last_name is required');
  }

  if (!input.email_address || !input.email_address.includes('@')) {
    validation_errors.push('valid email_address is required');
  }

  return validation_errors;
};

// Legacy HTTP status codes with old naming
const HTTP_STATUS_CODES = {
  OK_SUCCESS: 200,              // Should be: OK
  CREATED_SUCCESS: 201,         // Should be: CREATED
  BAD_REQUEST_ERROR: 400,       // Should be: BAD_REQUEST
  UNAUTHORIZED_ERROR: 401,      // Should be: UNAUTHORIZED
  FORBIDDEN_ERROR: 403,         // Should be: FORBIDDEN
  NOT_FOUND_ERROR: 404,         // Should be: NOT_FOUND
  INTERNAL_SERVER_ERROR: 500,   // Should be: INTERNAL_SERVER_ERROR
};

// Old middleware patterns
const authMiddlewareOld = (req: any, res: any, next: any) => {
  const auth_header = req.headers.authorization;
  const bearer_token = auth_header?.split(' ')[1];

  if (!bearer_token) {
    return res.status(HTTP_STATUS_CODES.UNAUTHORIZED_ERROR).json({
      error_message: 'No auth token provided',
      status_code: HTTP_STATUS_CODES.UNAUTHORIZED_ERROR
    });
  }

  // Verify token logic here
  next();
};

// Old utility functions with snake_case
const formatUserDisplayName = (first_name: string, last_name: string): string => {
  return `${first_name} ${last_name}`.trim();
};

const calculateTimeDifference = (start_time: Date, end_time: Date): number => {
  return end_time.getTime() - start_time.getTime();
};

const generateRandomId = (prefix: string = 'id'): string => {
  const random_number = Math.floor(Math.random() * 1000000);
  const timestamp = Date.now();
  return `${prefix}_${timestamp}_${random_number}`;
};

// Legacy type definitions
type DatabaseConnectionOld = {
  host_name: string;
  port_number: number;
  database_name: string;
  user_name: string;
  pass_word: string;
  connection_timeout: number;
  max_connections: number;
};

type CacheConfigurationOld = {
  cache_enabled: boolean;
  cache_type: 'redis' | 'memory';
  cache_host: string;
  cache_port: number;
  cache_ttl: number;
  max_cache_size: number;
};

// Old email templates with outdated patterns
const EMAIL_TEMPLATES = {
  WELCOME_MESSAGE: 'Welcome {{first_name}} {{last_name}}! Your account has been created.',
  PASSWORD_RESET: 'Hello {{first_name}}, click here to reset your password.',
  ACCOUNT_VERIFICATION: 'Please verify your email {{email_address}} by clicking the link.',
  SUBSCRIPTION_REMINDER: 'Hi {{first_name}}, your subscription expires on {{expiry_date}}.',
};

// Test data with old naming conventions
const SAMPLE_USERS = [
  { user_id: '1', first_name: 'John', last_name: 'Doe', email_address: 'john@example.com', is_active: true },
  { user_id: '2', first_name: 'Jane', last_name: 'Smith', email_address: 'jane@example.com', is_active: true },
  { user_id: '3', first_name: 'Bob', last_name: 'Johnson', email_address: 'bob@example.com', is_active: false },
  { user_id: '4', first_name: 'Alice', last_name: 'Brown', email_address: 'alice@example.com', is_active: true },
  { user_id: '5', first_name: 'Charlie', last_name: 'Wilson', email_address: 'charlie@example.com', is_active: false },
];

// More old patterns to practice search and replace
const API_ENDPOINTS = {
  GET_USER_BY_ID: '/api/users/:user_id',
  UPDATE_USER_PROFILE: '/api/users/:user_id/profile',
  DELETE_USER_ACCOUNT: '/api/users/:user_id/delete',
  GET_USER_PREFERENCES: '/api/users/:user_id/preferences',
  POST_USER_AVATAR: '/api/users/:user_id/avatar',
};