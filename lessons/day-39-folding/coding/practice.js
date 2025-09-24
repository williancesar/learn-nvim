/**
 * Day 39: Folding Practice - Code with Natural Fold Points
 *
 * This file contains code with clear hierarchical structures perfect for
 * practicing Vim's folding features.
 *
 * Key commands to practice:
 * - zf{motion} (create fold)
 * - za (toggle fold under cursor)
 * - zo (open fold under cursor)
 * - zc (close fold under cursor)
 * - zR (open all folds)
 * - zM (close all folds)
 * - zj (move to next fold)
 * - zk (move to previous fold)
 * - :set foldmethod=indent/syntax/manual
 */

// FOLDING EXERCISE 1: Large class with multiple methods (fold by class/methods)
class UserManagementSystem {
  constructor(config) {
    this.config = config;
    this.database = config.database;
    this.cache = config.cache;
    this.logger = config.logger;
    this.validator = new UserValidator();
    this.encryptor = new PasswordEncryptor();
  }

  // Authentication Methods Group - Fold this section
  async authenticateUser(credentials) {
    try {
      this.logger.info('Starting user authentication');

      const { username, password } = credentials;
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      const user = await this.database.findUser({ username });
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await this.encryptor.verify(password, user.passwordHash);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      const token = this.generateAuthToken(user);
      await this.updateLastLogin(user.id);

      this.logger.info(`User ${username} authenticated successfully`);
      return { success: true, token, user: this.sanitizeUser(user) };
    } catch (error) {
      this.logger.error('Authentication failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async registerUser(userData) {
    try {
      this.logger.info('Starting user registration');

      const validationResult = this.validator.validateRegistration(userData);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }

      const existingUser = await this.database.findUser({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const hashedPassword = await this.encryptor.hash(userData.password);
      const newUser = await this.database.createUser({
        ...userData,
        passwordHash: hashedPassword,
        createdAt: new Date(),
        isActive: true,
        isVerified: false
      });

      await this.sendVerificationEmail(newUser);

      this.logger.info(`User ${userData.email} registered successfully`);
      return { success: true, user: this.sanitizeUser(newUser) };
    } catch (error) {
      this.logger.error('Registration failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async logoutUser(token) {
    try {
      this.logger.info('Starting user logout');

      const decoded = this.verifyAuthToken(token);
      if (!decoded) {
        throw new Error('Invalid token');
      }

      await this.blacklistToken(token);
      await this.clearUserSessions(decoded.userId);

      this.logger.info(`User ${decoded.userId} logged out successfully`);
      return { success: true };
    } catch (error) {
      this.logger.error('Logout failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // User Profile Methods Group - Fold this section
  async getUserProfile(userId) {
    try {
      this.logger.info(`Retrieving profile for user ${userId}`);

      const cachedProfile = await this.cache.get(`user_profile_${userId}`);
      if (cachedProfile) {
        return { success: true, profile: cachedProfile };
      }

      const user = await this.database.findUser({ id: userId });
      if (!user) {
        throw new Error('User not found');
      }

      const profile = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        website: user.website,
        joinDate: user.createdAt,
        lastActive: user.lastLoginAt,
        isVerified: user.isVerified,
        preferences: user.preferences
      };

      await this.cache.set(`user_profile_${userId}`, profile, 3600);

      this.logger.info(`Profile retrieved for user ${userId}`);
      return { success: true, profile };
    } catch (error) {
      this.logger.error('Profile retrieval failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      this.logger.info(`Updating profile for user ${userId}`);

      const validationResult = this.validator.validateProfileUpdate(updates);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }

      const user = await this.database.findUser({ id: userId });
      if (!user) {
        throw new Error('User not found');
      }

      const updatedUser = await this.database.updateUser(userId, {
        ...updates,
        updatedAt: new Date()
      });

      await this.cache.delete(`user_profile_${userId}`);

      this.logger.info(`Profile updated for user ${userId}`);
      return { success: true, user: this.sanitizeUser(updatedUser) };
    } catch (error) {
      this.logger.error('Profile update failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async deleteUserAccount(userId) {
    try {
      this.logger.info(`Deleting account for user ${userId}`);

      const user = await this.database.findUser({ id: userId });
      if (!user) {
        throw new Error('User not found');
      }

      // Soft delete - mark as inactive
      await this.database.updateUser(userId, {
        isActive: false,
        deletedAt: new Date()
      });

      await this.cache.delete(`user_profile_${userId}`);
      await this.clearUserSessions(userId);
      await this.anonymizeUserData(userId);

      this.logger.info(`Account deleted for user ${userId}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Account deletion failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Password Management Methods Group - Fold this section
  async changePassword(userId, currentPassword, newPassword) {
    try {
      this.logger.info(`Changing password for user ${userId}`);

      const user = await this.database.findUser({ id: userId });
      if (!user) {
        throw new Error('User not found');
      }

      const isValidCurrentPassword = await this.encryptor.verify(currentPassword, user.passwordHash);
      if (!isValidCurrentPassword) {
        throw new Error('Current password is incorrect');
      }

      const passwordValidation = this.validator.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      const newPasswordHash = await this.encryptor.hash(newPassword);
      await this.database.updateUser(userId, {
        passwordHash: newPasswordHash,
        passwordChangedAt: new Date()
      });

      await this.clearUserSessions(userId);
      await this.sendPasswordChangeNotification(user);

      this.logger.info(`Password changed for user ${userId}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Password change failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async resetPassword(email) {
    try {
      this.logger.info(`Password reset requested for ${email}`);

      const user = await this.database.findUser({ email });
      if (!user) {
        // Don't reveal if user exists
        return { success: true, message: 'If the email exists, a reset link has been sent' };
      }

      const resetToken = this.generateResetToken(user.id);
      const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

      await this.database.updateUser(user.id, {
        resetToken,
        resetTokenExpiry: resetExpiry
      });

      await this.sendPasswordResetEmail(user, resetToken);

      this.logger.info(`Password reset email sent to ${email}`);
      return { success: true, message: 'If the email exists, a reset link has been sent' };
    } catch (error) {
      this.logger.error('Password reset failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async confirmPasswordReset(token, newPassword) {
    try {
      this.logger.info('Confirming password reset');

      const user = await this.database.findUser({ resetToken: token });
      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      if (new Date() > user.resetTokenExpiry) {
        throw new Error('Reset token has expired');
      }

      const passwordValidation = this.validator.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      const newPasswordHash = await this.encryptor.hash(newPassword);
      await this.database.updateUser(user.id, {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetTokenExpiry: null,
        passwordChangedAt: new Date()
      });

      await this.clearUserSessions(user.id);
      await this.sendPasswordResetConfirmation(user);

      this.logger.info(`Password reset confirmed for user ${user.id}`);
      return { success: true };
    } catch (error) {
      this.logger.error('Password reset confirmation failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Utility Methods Group - Fold this section
  generateAuthToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      issuedAt: Date.now()
    };

    return this.encryptor.generateJWT(payload, this.config.jwtSecret, {
      expiresIn: this.config.tokenExpiry || '24h'
    });
  }

  verifyAuthToken(token) {
    try {
      return this.encryptor.verifyJWT(token, this.config.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  generateResetToken(userId) {
    return this.encryptor.generateRandomToken(32);
  }

  sanitizeUser(user) {
    const { passwordHash, resetToken, resetTokenExpiry, ...sanitized } = user;
    return sanitized;
  }

  async updateLastLogin(userId) {
    await this.database.updateUser(userId, {
      lastLoginAt: new Date()
    });
  }

  async blacklistToken(token) {
    const key = `blacklisted_token_${token}`;
    await this.cache.set(key, true, this.config.tokenExpiry);
  }

  async clearUserSessions(userId) {
    const sessionKey = `user_sessions_${userId}`;
    await this.cache.delete(sessionKey);
  }

  async anonymizeUserData(userId) {
    await this.database.updateUser(userId, {
      email: `deleted_user_${userId}@example.com`,
      firstName: 'Deleted',
      lastName: 'User',
      bio: null,
      avatar: null,
      website: null,
      location: null
    });
  }

  // Email Methods Group - Fold this section
  async sendVerificationEmail(user) {
    const verificationToken = this.generateResetToken(user.id);
    const verificationUrl = `${this.config.baseUrl}/verify-email?token=${verificationToken}`;

    await this.database.updateUser(user.id, {
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 86400000) // 24 hours
    });

    const emailData = {
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      data: {
        firstName: user.firstName,
        verificationUrl
      }
    };

    await this.sendEmail(emailData);
  }

  async sendPasswordChangeNotification(user) {
    const emailData = {
      to: user.email,
      subject: 'Password Changed Successfully',
      template: 'password-change-notification',
      data: {
        firstName: user.firstName,
        timestamp: new Date().toISOString()
      }
    };

    await this.sendEmail(emailData);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${this.config.baseUrl}/reset-password?token=${resetToken}`;

    const emailData = {
      to: user.email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      data: {
        firstName: user.firstName,
        resetUrl,
        expiryTime: '1 hour'
      }
    };

    await this.sendEmail(emailData);
  }

  async sendPasswordResetConfirmation(user) {
    const emailData = {
      to: user.email,
      subject: 'Password Reset Successful',
      template: 'password-reset-confirmation',
      data: {
        firstName: user.firstName,
        timestamp: new Date().toISOString()
      }
    };

    await this.sendEmail(emailData);
  }

  async sendEmail(emailData) {
    // Email sending implementation would go here
    this.logger.info(`Email sent to ${emailData.to}: ${emailData.subject}`);
  }
}

// FOLDING EXERCISE 2: Configuration object with nested sections (fold by sections)
const applicationConfiguration = {
  // Server Configuration Section - Fold this
  server: {
    development: {
      host: 'localhost',
      port: 3000,
      ssl: false,
      cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
      },
      security: {
        rateLimiting: {
          windowMs: 15 * 60 * 1000, // 15 minutes
          max: 100, // requests per window
          message: 'Too many requests from this IP'
        },
        helmet: {
          contentSecurityPolicy: false,
          crossOriginEmbedderPolicy: false
        }
      }
    },
    production: {
      host: '0.0.0.0',
      port: process.env.PORT || 80,
      ssl: true,
      cors: {
        origin: ['https://myapp.com', 'https://www.myapp.com'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
      },
      security: {
        rateLimiting: {
          windowMs: 15 * 60 * 1000,
          max: 50,
          message: 'Rate limit exceeded'
        },
        helmet: {
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              scriptSrc: ["'self'"],
              imgSrc: ["'self'", "data:", "https:"]
            }
          }
        }
      }
    }
  },

  // Database Configuration Section - Fold this
  database: {
    development: {
      host: 'localhost',
      port: 5432,
      database: 'myapp_development',
      username: 'dev_user',
      password: 'dev_password',
      dialect: 'postgres',
      logging: console.log,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    },
    test: {
      host: 'localhost',
      port: 5432,
      database: 'myapp_test',
      username: 'test_user',
      password: 'test_password',
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 3,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    },
    production: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dialect: 'postgres',
      logging: false,
      ssl: true,
      pool: {
        max: 20,
        min: 5,
        acquire: 60000,
        idle: 300000
      },
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    }
  },

  // Cache Configuration Section - Fold this
  cache: {
    redis: {
      development: {
        host: 'localhost',
        port: 6379,
        password: null,
        db: 0,
        keyPrefix: 'myapp:dev:',
        retryDelayOnFailover: 100,
        enableOfflineQueue: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      },
      production: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD,
        db: 0,
        keyPrefix: 'myapp:prod:',
        retryDelayOnFailover: 500,
        enableOfflineQueue: true,
        maxRetriesPerRequest: 5,
        lazyConnect: true,
        tls: {
          rejectUnauthorized: false
        }
      }
    },
    memcached: {
      servers: ['localhost:11211'],
      options: {
        timeout: 500,
        retries: 2,
        retry: 10000,
        remove: true,
        idle: 5000
      }
    }
  },

  // Authentication Configuration Section - Fold this
  authentication: {
    jwt: {
      secret: process.env.JWT_SECRET || 'fallback_secret_key',
      expiresIn: '24h',
      issuer: 'myapp',
      audience: 'myapp-users',
      algorithm: 'HS256'
    },
    session: {
      secret: process.env.SESSION_SECRET || 'session_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
      store: {
        type: 'redis',
        prefix: 'sess:',
        ttl: 86400
      }
    },
    oauth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
      },
      facebook: {
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: '/auth/facebook/callback'
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback'
      }
    }
  },

  // Email Configuration Section - Fold this
  email: {
    smtp: {
      development: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
      },
      production: {
        service: 'SendGrid',
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        }
      }
    },
    templates: {
      welcomeEmail: {
        subject: 'Welcome to MyApp!',
        template: 'welcome',
        from: 'noreply@myapp.com'
      },
      passwordReset: {
        subject: 'Password Reset Request',
        template: 'password-reset',
        from: 'security@myapp.com'
      },
      emailVerification: {
        subject: 'Verify Your Email',
        template: 'email-verification',
        from: 'verify@myapp.com'
      }
    }
  },

  // Logging Configuration Section - Fold this
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined',
    transports: {
      console: {
        enabled: true,
        colorize: true,
        timestamp: true
      },
      file: {
        enabled: true,
        filename: 'logs/app.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        tailable: true
      },
      error: {
        enabled: true,
        filename: 'logs/error.log',
        level: 'error'
      }
    },
    exceptions: {
      enabled: true,
      filename: 'logs/exceptions.log'
    }
  }
};

export { UserManagementSystem, applicationConfiguration };