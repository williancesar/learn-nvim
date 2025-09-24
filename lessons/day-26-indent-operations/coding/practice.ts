/**
 * TypeScript Practice: Poorly Indented Code to Fix
 *
 * This file contains TypeScript code with inconsistent indentation
 * designed for practicing indent operations (>>, <<, =, ==, gg=G).
 *
 * Focus on fixing indentation using Vim's indent commands.
 */

// Poorly indented interface definitions
interface UserAccount {
id: string;
      username: string;
  email: string;
        profile: {
    firstName: string;
          lastName: string;
      dateOfBirth?: Date;
            avatar?: string;
  preferences: {
        theme: 'light' | 'dark';
      language: string;
notifications: {
        email: boolean;
      push: boolean;
            sms: boolean;
        };
      };
    };
      credentials: {
    passwordHash: string;
          lastLogin?: Date;
      twoFactorEnabled: boolean;
        };
  status: 'active' | 'inactive' | 'suspended';
      createdAt: Date;
    updatedAt: Date;
}

// Badly indented class definition
class UserManager {
    private users: Map<string, UserAccount>;
      private logger: Logger;
  private cache: CacheService;

constructor(logger: Logger, cache: CacheService) {
      this.users = new Map();
    this.logger = logger;
        this.cache = cache;
  }

      async createUser(userData: CreateUserRequest): Promise<UserAccount> {
    try {
          this.logger.info('Creating new user', userData);

        // Validate user data
      if (!userData.email || !userData.username) {
            throw new Error('Email and username are required');
        }

    // Check for existing user
        const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
          throw new Error('User already exists');
          }

            // Create user object
        const user: UserAccount = {
      id: this.generateUserId(),
            username: userData.username,
        email: userData.email,
              profile: {
          firstName: userData.firstName,
                lastName: userData.lastName,
            dateOfBirth: userData.dateOfBirth,
                  preferences: {
                theme: 'light',
              language: 'en',
                    notifications: {
                  email: true,
                push: true,
                      sms: false,
                    },
                },
              },
        credentials: {
              passwordHash: await this.hashPassword(userData.password),
            twoFactorEnabled: false,
                },
          status: 'active',
            createdAt: new Date(),
          updatedAt: new Date(),
        };

      // Save user
          this.users.set(user.id, user);
        await this.cache.set(`user:${user.id}`, user);

            this.logger.info('User created successfully', { userId: user.id });
        return user;

        } catch (error) {
      this.logger.error('Failed to create user', error);
            throw error;
        }
    }

  async updateUser(userId: string, updates: UpdateUserRequest): Promise<UserAccount> {
        try {
      const user = this.users.get(userId);
          if (!user) {
        throw new Error('User not found');
            }

    // Apply updates
          if (updates.profile) {
        if (updates.profile.firstName) {
              user.profile.firstName = updates.profile.firstName;
            }
      if (updates.profile.lastName) {
                user.profile.lastName = updates.profile.lastName;
          }
        if (updates.profile.preferences) {
              if (updates.profile.preferences.theme) {
            user.profile.preferences.theme = updates.profile.preferences.theme;
                  }
            if (updates.profile.preferences.language) {
                user.profile.preferences.language = updates.profile.preferences.language;
                }
          if (updates.profile.preferences.notifications) {
                    if (updates.profile.preferences.notifications.email !== undefined) {
                user.profile.preferences.notifications.email = updates.profile.preferences.notifications.email;
                      }
                if (updates.profile.preferences.notifications.push !== undefined) {
                  user.profile.preferences.notifications.push = updates.profile.preferences.notifications.push;
                    }
              if (updates.profile.preferences.notifications.sms !== undefined) {
                      user.profile.preferences.notifications.sms = updates.profile.preferences.notifications.sms;
                  }
                }
            }
          }

        user.updatedAt = new Date();
            this.users.set(userId, user);
          await this.cache.set(`user:${userId}`, user);

        return user;
    } catch (error) {
            this.logger.error('Failed to update user', error);
      throw error;
        }
      }

    async deleteUser(userId: string): Promise<boolean> {
      try {
            const user = this.users.get(userId);
        if (!user) {
      return false;
            }

        this.users.delete(userId);
              await this.cache.delete(`user:${userId}`);

      this.logger.info('User deleted', { userId });
            return true;
    } catch (error) {
              this.logger.error('Failed to delete user', error);
        return false;
          }
      }

  private async findUserByEmail(email: string): Promise<UserAccount | null> {
        for (const [id, user] of this.users) {
      if (user.email === email) {
            return user;
          }
        }
      return null;
        }

    private generateUserId(): string {
          return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

      private async hashPassword(password: string): Promise<string> {
        // Mock password hashing
      return `hashed_${password}`;
        }
}

// Poorly indented function definitions
function processUserData(
    users: UserAccount[],
      options: ProcessingOptions
  ): ProcessedUserData[] {
      const results: ProcessedUserData[] = [];

    for (const user of users) {
          try {
        const processedUser: ProcessedUserData = {
              ...user,
            fullName: `${user.profile.firstName} ${user.profile.lastName}`,
        isAdult: user.profile.dateOfBirth ?
                  calculateAge(user.profile.dateOfBirth) >= 18 : false,
              lastLoginFormatted: user.credentials.lastLogin ?
            formatDate(user.credentials.lastLogin) : 'Never',
                  settings: {
                theme: user.profile.preferences.theme,
              language: user.profile.preferences.language,
                    emailNotifications: user.profile.preferences.notifications.email,
                pushNotifications: user.profile.preferences.notifications.push,
              smsNotifications: user.profile.preferences.notifications.sms,
                },
            };

      if (options.includeAnalytics) {
                processedUser.analytics = {
              loginCount: await getLoginCount(user.id),
                lastActivityDate: await getLastActivity(user.id),
            sessionsThisMonth: await getSessionsCount(user.id, 'month'),
                    avgSessionDuration: await getAvgSessionDuration(user.id),
                };
            }

        if (options.includePermissions) {
                processedUser.permissions = await getUserPermissions(user.id);
              }

          results.push(processedUser);
        } catch (error) {
              console.error(`Failed to process user ${user.id}:`, error);
            if (options.continueOnError) {
          continue;
                } else {
              throw error;
                }
        }
      }

        return results;
}

// Badly indented configuration object
const systemConfiguration = {
    database: {
      primary: {
          host: 'localhost',
        port: 5432,
              database: 'userdb',
        username: 'admin',
            password: 'secret',
          ssl: true,
      pool: {
              min: 5,
            max: 20,
        idle: 30000,
              },
        },
      secondary: {
            host: 'replica.example.com',
        port: 5433,
              database: 'userdb_replica',
          username: 'readonly',
        password: 'readonly_secret',
            ssl: true,
          pool: {
        min: 2,
              max: 10,
            idle: 60000,
          },
            },
    },
      cache: {
        redis: {
              host: 'localhost',
            port: 6379,
          password: 'redis_secret',
                database: 0,
            keyPrefix: 'user:',
        ttl: 3600,
              },
        memory: {
            maxSize: '100MB',
          ttl: 1800,
                },
        },
      logging: {
          level: 'info',
        format: 'json',
              transports: [
            {
                type: 'console',
              colorize: true,
            },
                {
              type: 'file',
                filename: 'app.log',
            maxSize: '10MB',
                  maxFiles: 5,
                },
              ],
        },
    auth: {
          jwtSecret: 'super_secret_key',
        tokenExpiry: '24h',
              refreshTokenExpiry: '7d',
        saltRounds: 12,
            sessionTimeout: 3600,
          },
      monitoring: {
        metrics: {
              enabled: true,
            port: 9090,
          endpoint: '/metrics',
                },
        healthCheck: {
            enabled: true,
              endpoint: '/health',
            interval: 30000,
                },
          alerts: {
                enabled: true,
            webhookUrl: 'https://hooks.slack.com/webhook',
          emailRecipients: [
                'admin@example.com',
              'ops@example.com',
            ],
              },
        },
};

// Poorly indented async function with complex logic
async function generateUserReport(
      userIds: string[],
    reportType: 'summary' | 'detailed' | 'analytics',
        options?: ReportOptions
  ): Promise<UserReport> {
      const report: UserReport = {
        id: generateReportId(),
          type: reportType,
        generatedAt: new Date(),
              data: [],
        summary: {
              totalUsers: 0,
            activeUsers: 0,
          suspendedUsers: 0,
                avgAge: 0,
            },
        };

    try {
          for (const userId of userIds) {
        const user = await getUserById(userId);
              if (!user) {
            console.warn(`User ${userId} not found, skipping`);
                continue;
              }

        report.data.push(user);
              report.summary.totalUsers++;

            if (user.status === 'active') {
          report.summary.activeUsers++;
                } else if (user.status === 'suspended') {
              report.summary.suspendedUsers++;
            }

        if (user.profile.dateOfBirth) {
                const age = calculateAge(user.profile.dateOfBirth);
              report.summary.avgAge += age;
            }
          }

      if (report.summary.totalUsers > 0) {
            report.summary.avgAge = report.summary.avgAge / report.summary.totalUsers;
          }

        if (reportType === 'detailed' || reportType === 'analytics') {
          for (const user of report.data) {
                const analytics = await getUserAnalytics(user.id);
              user.analytics = {
            ...analytics,
                  loginFrequency: calculateLoginFrequency(analytics.logins),
                sessionStats: calculateSessionStats(analytics.sessions),
              };

                if (reportType === 'analytics') {
              const behaviorData = await getUserBehaviorData(user.id);
                  user.behavior = {
                ...behaviorData,
                    patterns: identifyUserPatterns(behaviorData),
                  riskScore: calculateRiskScore(behaviorData),
                };
                }
            }
          }

      if (options?.includeCharts) {
            report.charts = await generateReportCharts(report.data);
          }

        if (options?.saveToFile) {
              await saveReportToFile(report, options.filename);
            }

          return report;
    } catch (error) {
          console.error('Failed to generate user report:', error);
        throw new Error('Report generation failed');
          }
}

// Supporting interfaces with bad indentation
interface CreateUserRequest {
    username: string;
      email: string;
    password: string;
      firstName: string;
        lastName: string;
  dateOfBirth?: Date;
}

interface UpdateUserRequest {
      profile?: {
    firstName?: string;
        lastName?: string;
      preferences?: {
          theme?: 'light' | 'dark';
        language?: string;
            notifications?: {
          email?: boolean;
                push?: boolean;
            sms?: boolean;
              };
            };
        };
}

interface ProcessingOptions {
      includeAnalytics: boolean;
    includePermissions: boolean;
        continueOnError: boolean;
}

interface ProcessedUserData extends UserAccount {
        fullName: string;
      isAdult: boolean;
    lastLoginFormatted: string;
          settings: {
        theme: string;
              language: string;
            emailNotifications: boolean;
        pushNotifications: boolean;
              smsNotifications: boolean;
          };
      analytics?: UserAnalytics;
        permissions?: string[];
}

// Export with inconsistent indentation
export {
        UserManager,
      type UserAccount,
    type CreateUserRequest,
        type UpdateUserRequest,
      processUserData,
        generateUserReport,
      systemConfiguration,
    type ProcessedUserData,
};