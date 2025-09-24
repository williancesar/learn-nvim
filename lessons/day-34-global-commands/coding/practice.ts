/**
 * Day 34: Global Commands - TypeScript Code for :g and :v Operations
 *
 * This file contains TypeScript code designed for practicing global commands.
 * Learn to use :g/pattern/command and :v/pattern/command for batch operations
 * on lines matching or not matching patterns.
 *
 * Global Commands Objectives:
 * - Use :g/pattern/d to delete all lines matching pattern
 * - Use :v/pattern/d to delete all lines NOT matching pattern
 * - Use :g/pattern/m$ to move all matching lines to end of file
 * - Use :g/pattern/t$ to copy all matching lines to end of file
 * - Use :g/pattern/normal command to execute normal mode commands on matches
 */

// ========== MIXED CODE WITH DIFFERENT PATTERNS ==========
// Practice using global commands to manipulate specific line types

// DEBUG: This is a debug log statement
console.log('Application starting up');

const API_BASE_URL = 'https://api.example.com';
// DEBUG: API base URL configuration
console.debug('API base URL:', API_BASE_URL);

interface User {
  id: string;
  email: string;
  name: string;
  // DEBUG: User interface definition
  createdAt: Date;
}

// TODO: Add input validation
function createUser(userData: Partial<User>): User {
  // DEBUG: Creating new user
  console.log('Creating user with data:', userData);

  const user: User = {
    id: generateUUID(),
    email: userData.email || '',
    name: userData.name || '',
    createdAt: new Date()
  };

  // DEBUG: User created successfully
  console.debug('User created:', user.id);
  return user;
}

// FIXME: This function has a potential security issue
function authenticateUser(email: string, password: string) {
  // DEBUG: Authenticating user
  console.log('Authenticating user:', email);

  // TODO: Hash password before comparison
  const user = database.findByEmail(email);

  if (!user) {
    // DEBUG: User not found
    console.warn('Authentication failed: user not found');
    return null;
  }

  // FIXME: Password comparison is not secure
  if (user.password === password) {
    // DEBUG: Authentication successful
    console.log('User authenticated successfully');
    return user;
  }

  // DEBUG: Invalid password
  console.warn('Authentication failed: invalid password');
  return null;
}

// TODO: Implement proper error handling
class UserService {
  // DEBUG: UserService class definition

  constructor(private userRepository: UserRepository) {}

  // TODO: Add input validation
  async findById(id: string): Promise<User | null> {
    // DEBUG: Finding user by ID
    console.debug(`Finding user by ID: ${id}`);

    try {
      const user = await this.userRepository.findById(id);
      // DEBUG: User lookup completed
      console.debug('User lookup result:', user ? 'found' : 'not found');
      return user;
    } catch (error) {
      // DEBUG: Error during user lookup
      console.error('Error finding user:', error);
      throw error;
    }
  }

  // FIXME: Method doesn't handle duplicate emails
  async createUser(userData: Partial<User>): Promise<User> {
    // DEBUG: Creating new user via service
    console.log('UserService.createUser called');

    // TODO: Validate email format
    // TODO: Check for existing email
    const user = await this.userRepository.create(userData);

    // DEBUG: User creation completed
    console.debug('User created via service:', user.id);
    return user;
  }
}

// DEPRECATED: This function will be removed in v2.0
function legacyUserProcessor(user: User) {
  // DEBUG: Processing user with legacy method
  console.warn('Using deprecated legacyUserProcessor');

  // TODO: Replace with new implementation
  return {
    ...user,
    processed: true,
    legacyProcessed: new Date()
  };
}

// TODO: Refactor this class to use dependency injection
class EmailService {
  // DEBUG: EmailService initialization

  private smtpConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false
  };

  // TODO: Add email template system
  async sendWelcomeEmail(user: User): Promise<void> {
    // DEBUG: Sending welcome email
    console.log(`Sending welcome email to: ${user.email}`);

    const emailContent = {
      to: user.email,
      subject: 'Welcome!',
      body: `Hello ${user.name}, welcome to our platform!`
    };

    // FIXME: Error handling is inadequate
    try {
      await this.sendEmail(emailContent);
      // DEBUG: Welcome email sent successfully
      console.debug('Welcome email sent successfully');
    } catch (error) {
      // DEBUG: Failed to send welcome email
      console.error('Failed to send welcome email:', error);
      throw error;
    }
  }

  // TODO: Implement retry mechanism
  private async sendEmail(emailContent: any): Promise<void> {
    // DEBUG: Sending email via SMTP
    console.debug('Sending email:', emailContent.subject);

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    // DEBUG: Email sent via SMTP
    console.debug('Email sent successfully via SMTP');
  }
}

// DEPRECATED: Use UserService instead
const userHelpers = {
  // DEBUG: Legacy user helpers object

  // TODO: Move to UserService
  formatUserName(user: User): string {
    // DEBUG: Formatting user name
    console.debug('Formatting name for user:', user.id);
    return `${user.name} (${user.email})`;
  },

  // FIXME: This method modifies the original object
  updateLastLogin(user: User): User {
    // DEBUG: Updating last login time
    console.debug('Updating last login for:', user.id);
    user.lastLogin = new Date();
    return user;
  }
};

// Global Commands Practice Exercises:
/*
1. Delete all DEBUG lines:
   :g/DEBUG:/d

2. Delete all lines that don't contain TODO, FIXME, or DEPRECATED:
   :v/TODO\|FIXME\|DEPRECATED/d

3. Move all TODO comments to the end of file:
   :g/TODO:/m$

4. Copy all FIXME lines to the end:
   :g/FIXME:/t$

5. Add line numbers to all console.log statements:
   :g/console\.log/normal I// Line

6. Delete all empty lines:
   :g/^$/d

7. Comment out all DEBUG console statements:
   :g/console\.debug/normal I//

8. Find and collect all function definitions:
   :g/^function\|^async function/t$

9. Move all DEPRECATED comments to top of file:
    :g/DEPRECATED:/m0

10. Delete all lines containing 'console' but not 'error':
    :g/console/v/error/d
*/