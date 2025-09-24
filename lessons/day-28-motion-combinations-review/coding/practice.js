// Day 28: Motion Combinations Review - Comprehensive Practice
// Combine all learned motions: word motions, text objects, search, jumps, marks, etc.
// This comprehensive file tests all vim motion skills learned in the previous 27 days

/**
 * Comprehensive JavaScript Application - Final Vim Motions Review
 * This file combines elements from all previous days for comprehensive practice:
 * - Paragraph boundaries ({, }) from Day 15
 * - Long content for screen navigation (H, M, L, Ctrl-d, Ctrl-u) from Day 16
 * - Words for text objects (iw, aw) from Day 17
 * - Quotes and brackets for text objects from Day 18
 * - Comments and code blocks from Day 19
 * - Operator+motion combinations from Day 20
 * - Complex navigation points from Day 21
 * - Searchable patterns from Day 22
 * - Line numbers and brackets from Day 23
 * - Mark locations from Day 24
 * - Visual block content from Day 25
 * - Indentation to fix from Day 26
 * - Long lines to format from Day 27
 */

// MARK A: Application Configuration Section
// Set mark 'a' here - paragraph boundaries practice with {}
const APPLICATION_CONFIG = {
    // Database configuration with nested objects - bracket practice
    database: {
        primary: {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 5432,
            name: process.env.DB_NAME || 'ecommerce_app',
            credentials: {
                username: process.env.DB_USER || 'admin',
                password: process.env.DB_PASS || 'secure_password_123'
            },
            pool: {
                min: 2,
                max: 10,
                acquire: 30000,
                idle: 10000
            },
            ssl: {
                enabled: process.env.NODE_ENV === 'production',
                rejectUnauthorized: false,
                ca: process.env.SSL_CA_CERT,
                key: process.env.SSL_PRIVATE_KEY,
                cert: process.env.SSL_CERTIFICATE
            }
        },

        replica: {
            host: process.env.REPLICA_HOST || 'replica-server',
            port: parseInt(process.env.REPLICA_PORT) || 5433,
            readOnly: true,
            credentials: {
                username: process.env.REPLICA_USER || 'readonly',
                password: process.env.REPLICA_PASS || 'readonly_pass'
            }
        }
    },

    // Cache configuration - practice with quotes and text objects
    cache: {
        redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || null,
            keyPrefix: 'ecommerce:',
            ttl: 3600,
            options: {
                retryDelayOnFailover: 100,
                enableReadyCheck: false,
                maxRetriesPerRequest: 3,
                lazyConnect: true,
                keepAlive: 30000
            }
        },

        memcached: {
            servers: ['127.0.0.1:11211'],
            options: {
                maxValue: 1048576,
                poolSize: 10,
                algorithm: 'md5'
            }
        }
    },

    // API configuration with searchable patterns
    api: {
        baseUrl: process.env.API_BASE_URL || 'https://api.ecommerce.com',
        version: 'v1',
        timeout: 30000,
        rateLimiting: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            maxRequests: 100,
            message: 'Too many requests from this IP'
        },
        endpoints: {
            users: '/users',
            products: '/products',
            orders: '/orders',
            payments: '/payments',
            analytics: '/analytics'
        }
    }
};


// MARK B: Data Models and Validation Section
// Complex class with method chains and nested structures
class AdvancedUserModel {
    constructor(userData) {
        this.id = userData.id || this.generateUniqueId();
        this.personalInfo = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phone: userData.phone,
            dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null
        };

        this.address = {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            zipCode: userData.address?.zipCode || '',
            country: userData.address?.country || 'US'
        };

        this.preferences = {
            language: userData.preferences?.language || 'en',
            currency: userData.preferences?.currency || 'USD',
            timezone: userData.preferences?.timezone || 'UTC',
            notifications: {
                email: userData.preferences?.notifications?.email !== false,
                sms: userData.preferences?.notifications?.sms === true,
                push: userData.preferences?.notifications?.push !== false
            },
            privacy: {
                profileVisible: userData.preferences?.privacy?.profileVisible !== false,
                dataSharing: userData.preferences?.privacy?.dataSharing === true,
                marketingEmails: userData.preferences?.privacy?.marketingEmails !== false
            }
        };

        this.metadata = {
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: null,
            loginCount: 0,
            isActive: true,
            emailVerified: false,
            phoneVerified: false,
            accountStatus: 'pending'
        };
    }

    // Method with complex validation logic - practice operator+motion combinations
    validatePersonalInfo() {
        const errors = [];
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phoneRegex = /^\+?[1-9]\d{1,14}$/;

        // Email validation with multiple conditions
        if (!this.personalInfo.email) {
            errors.push('Email is required');
        } else if (!emailRegex.test(this.personalInfo.email)) {
            errors.push('Invalid email format');
        } else if (this.personalInfo.email.length > 254) {
            errors.push('Email address too long');
        }

        // Phone validation with complex patterns
        if (this.personalInfo.phone) {
            const cleanPhone = this.personalInfo.phone.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                errors.push('Invalid phone number format');
            }
        }

        // Name validation with character limits
        if (!this.personalInfo.firstName) {
            errors.push('First name is required');
        } else if (this.personalInfo.firstName.length < 2) {
            errors.push('First name too short');
        } else if (this.personalInfo.firstName.length > 50) {
            errors.push('First name too long');
        }

        if (!this.personalInfo.lastName) {
            errors.push('Last name is required');
        } else if (this.personalInfo.lastName.length < 2) {
            errors.push('Last name too short');
        } else if (this.personalInfo.lastName.length > 50) {
            errors.push('Last name too long');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Method with searchable patterns and complex logic
    updatePreferences(newPreferences) {
        const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'];
        const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];
        const supportedTimezones = [
            'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
            'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Tokyo', 'Asia/Shanghai'
        ];

        // Validate and update language preference
        if (newPreferences.language && supportedLanguages.includes(newPreferences.language)) {
            this.preferences.language = newPreferences.language;
        }

        // Validate and update currency preference
        if (newPreferences.currency && supportedCurrencies.includes(newPreferences.currency)) {
            this.preferences.currency = newPreferences.currency;
        }

        // Validate and update timezone preference
        if (newPreferences.timezone && supportedTimezones.includes(newPreferences.timezone)) {
            this.preferences.timezone = newPreferences.timezone;
        }

        // Update notification preferences with deep merge
        if (newPreferences.notifications) {
            this.preferences.notifications = {
                ...this.preferences.notifications,
                ...newPreferences.notifications
            };
        }

        // Update privacy preferences with validation
        if (newPreferences.privacy) {
            this.preferences.privacy = {
                ...this.preferences.privacy,
                ...newPreferences.privacy
            };
        }

        this.metadata.updatedAt = new Date();
        return this.preferences;
    }

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }
}


// MARK C: Complex Algorithm Section
// Function with nested loops and conditional logic - practice with various motions
function processAdvancedDataAnalytics(datasets, analysisTypes, configurationOptions) {
    const results = {
        summary: {},
        detailed: {},
        visualizations: [],
        recommendations: [],
        metadata: {
            processedAt: new Date(),
            processingTime: 0,
            dataPoints: 0,
            accuracy: 0
        }
    };

    const startTime = performance.now();

    try {
        // Iterate through each dataset - practice with word motions and text objects
        for (const datasetName in datasets) {
            const dataset = datasets[datasetName];
            const datasetResults = {
                name: datasetName,
                records: dataset.length,
                analysis: {}
            };

            // Perform different types of analysis
            for (const analysisType of analysisTypes) {
                switch (analysisType) {
                    case 'statistical_summary':
                        datasetResults.analysis.statistical = this.calculateStatisticalSummary(dataset);
                        break;

                    case 'trend_analysis':
                        datasetResults.analysis.trends = this.analyzeTrends(dataset, configurationOptions.trendOptions);
                        break;

                    case 'correlation_analysis':
                        datasetResults.analysis.correlations = this.calculateCorrelations(dataset, configurationOptions.correlationFields);
                        break;

                    case 'anomaly_detection':
                        datasetResults.analysis.anomalies = this.detectAnomalies(dataset, configurationOptions.anomalyThreshold);
                        break;

                    case 'predictive_modeling':
                        datasetResults.analysis.predictions = this.buildPredictiveModel(dataset, configurationOptions.modelConfig);
                        break;

                    case 'clustering_analysis':
                        datasetResults.analysis.clusters = this.performClustering(dataset, configurationOptions.clusteringOptions);
                        break;

                    default:
                        console.warn(`Unknown analysis type: ${analysisType}`);
                        continue;
                }
            }

            results.detailed[datasetName] = datasetResults;
            results.metadata.dataPoints += dataset.length;
        }

        // Generate cross-dataset insights
        results.summary = this.generateCrossDatasetInsights(results.detailed);

        // Create visualizations based on analysis results
        results.visualizations = this.generateVisualizations(results.detailed, configurationOptions.visualizationOptions);

        // Generate actionable recommendations
        results.recommendations = this.generateRecommendations(results.summary, configurationOptions.businessContext);

        // Calculate overall accuracy and quality metrics
        results.metadata.accuracy = this.calculateAnalysisAccuracy(results);
        results.metadata.processingTime = performance.now() - startTime;

        return results;

    } catch (error) {
        console.error('Error in advanced data analytics processing:', error);
        throw new Error(`Analytics processing failed: ${error.message}`);
    }
}


// MARK D: Database Operations Section
// Complex database query builder with method chaining - visual block editing practice
const DatabaseQueryBuilder = {
    // Table definitions with aligned columns - perfect for visual block operations
    tables: {
        users:     { id: 'SERIAL PRIMARY KEY', email: 'VARCHAR(255) UNIQUE',    firstName: 'VARCHAR(100)',  lastName: 'VARCHAR(100)',   isActive: 'BOOLEAN DEFAULT true' },
        products:  { id: 'SERIAL PRIMARY KEY', name: 'VARCHAR(255)',           description: 'TEXT',        price: 'DECIMAL(10,2)',    stock: 'INTEGER DEFAULT 0' },
        orders:    { id: 'SERIAL PRIMARY KEY', userId: 'INTEGER REFERENCES',   status: 'VARCHAR(50)',      total: 'DECIMAL(10,2)',    createdAt: 'TIMESTAMP' },
        payments:  { id: 'SERIAL PRIMARY KEY', orderId: 'INTEGER REFERENCES',  method: 'VARCHAR(50)',      amount: 'DECIMAL(10,2)',   status: 'VARCHAR(50)' },
        reviews:   { id: 'SERIAL PRIMARY KEY', productId: 'INTEGER REFERENCES',userId: 'INTEGER REFERENCES',rating: 'INTEGER',         comment: 'TEXT' }
    },

    // Query building methods with complex parameter handling
    buildComplexQuery(baseTable, joins, conditions, groupBy, having, orderBy, limit) {
        let query = `SELECT * FROM ${baseTable}`;

        // Add joins with proper syntax - practice bracket matching
        if (joins && joins.length > 0) {
            joins.forEach(join => {
                const joinType = join.type || 'INNER';
                query += ` ${joinType} JOIN ${join.table} ON ${join.condition}`;
            });
        }

        // Add WHERE conditions with complex logic
        if (conditions && conditions.length > 0) {
            const whereClause = conditions
                .map(condition => {
                    if (condition.operator === 'IN') {
                        const values = condition.value.map(v => `'${v}'`).join(', ');
                        return `${condition.field} IN (${values})`;
                    } else if (condition.operator === 'BETWEEN') {
                        return `${condition.field} BETWEEN '${condition.value.start}' AND '${condition.value.end}'`;
                    } else {
                        return `${condition.field} ${condition.operator} '${condition.value}'`;
                    }
                })
                .join(' AND ');

            query += ` WHERE ${whereClause}`;
        }

        // Add GROUP BY clause
        if (groupBy && groupBy.length > 0) {
            query += ` GROUP BY ${groupBy.join(', ')}`;
        }

        // Add HAVING clause for grouped results
        if (having && having.length > 0) {
            const havingClause = having
                .map(h => `${h.field} ${h.operator} ${h.value}`)
                .join(' AND ');
            query += ` HAVING ${havingClause}`;
        }

        // Add ORDER BY clause
        if (orderBy && orderBy.length > 0) {
            const orderClause = orderBy
                .map(order => `${order.field} ${order.direction || 'ASC'}`)
                .join(', ');
            query += ` ORDER BY ${orderClause}`;
        }

        // Add LIMIT clause
        if (limit) {
            query += ` LIMIT ${limit}`;
        }

        return query;
    }
};


// MARK E: API Integration Section
// RESTful API client with comprehensive error handling - search patterns practice
class ComprehensiveApiClient {
    constructor(baseUrl, defaultHeaders = {}) {
        this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'EcommerceApp/1.0',
            ...defaultHeaders
        };
        this.interceptors = {
            request: [],
            response: []
        };
        this.retryConfig = {
            attempts: 3,
            delay: 1000,
            backoff: 2
        };
    }

    // Method with extensive parameter validation and error handling
    async makeRequest(method, endpoint, data = null, options = {}) {
        const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        const headers = { ...this.defaultHeaders, ...options.headers };

        // Apply request interceptors
        let requestConfig = {
            method: method.toUpperCase(),
            url,
            headers,
            data
        };

        for (const interceptor of this.interceptors.request) {
            requestConfig = await interceptor(requestConfig);
        }

        let lastError;

        // Retry logic with exponential backoff
        for (let attempt = 1; attempt <= this.retryConfig.attempts; attempt++) {
            try {
                const fetchOptions = {
                    method: requestConfig.method,
                    headers: requestConfig.headers
                };

                if (requestConfig.data) {
                    if (requestConfig.method === 'GET') {
                        // Convert data to query parameters for GET requests
                        const params = new URLSearchParams(requestConfig.data);
                        requestConfig.url += `?${params.toString()}`;
                    } else {
                        fetchOptions.body = JSON.stringify(requestConfig.data);
                    }
                }

                const response = await fetch(requestConfig.url, fetchOptions);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                let responseData = await response.json();

                // Apply response interceptors
                for (const interceptor of this.interceptors.response) {
                    responseData = await interceptor(responseData, response);
                }

                return {
                    data: responseData,
                    status: response.status,
                    headers: Object.fromEntries(response.headers.entries()),
                    url: response.url
                };

            } catch (error) {
                lastError = error;

                // Don't retry on client errors (4xx)
                if (error.message.includes('HTTP 4')) {
                    throw error;
                }

                // Wait before retrying (exponential backoff)
                if (attempt < this.retryConfig.attempts) {
                    const delay = this.retryConfig.delay * Math.pow(this.retryConfig.backoff, attempt - 1);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw new Error(`Request failed after ${this.retryConfig.attempts} attempts: ${lastError.message}`);
    }

    // CRUD methods with comprehensive options
    async get(endpoint, params = {}, options = {}) {
        return this.makeRequest('GET', endpoint, params, options);
    }

    async post(endpoint, data = {}, options = {}) {
        return this.makeRequest('POST', endpoint, data, options);
    }

    async put(endpoint, data = {}, options = {}) {
        return this.makeRequest('PUT', endpoint, data, options);
    }

    async patch(endpoint, data = {}, options = {}) {
        return this.makeRequest('PATCH', endpoint, data, options);
    }

    async delete(endpoint, options = {}) {
        return this.makeRequest('DELETE', endpoint, null, options);
    }
}


// MARK F: Performance Monitoring Section
// Complex monitoring and metrics collection - long lines for formatting practice
const PerformanceMonitor = {
    metrics: { requests: { total: 0, successful: 0, failed: 0, averageResponseTime: 0, slowestRequest: 0, fastestRequest: Infinity }, database: { queries: 0, slowQueries: 0, averageQueryTime: 0, connectionPoolSize: 0, activeConnections: 0 }, memory: { heapUsed: 0, heapTotal: 0, external: 0, arrayBuffers: 0, rss: 0 }, cpu: { usage: 0, loadAverage: [0, 0, 0], userTime: 0, systemTime: 0 } },

    collectMetrics() { const memoryUsage = process.memoryUsage(); this.metrics.memory = { heapUsed: memoryUsage.heapUsed, heapTotal: memoryUsage.heapTotal, external: memoryUsage.external, arrayBuffers: memoryUsage.arrayBuffers, rss: memoryUsage.rss }; const cpuUsage = process.cpuUsage(); this.metrics.cpu = { usage: (cpuUsage.user + cpuUsage.system) / 1000000, loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0], userTime: cpuUsage.user, systemTime: cpuUsage.system }; },

    generateReport() { return { timestamp: new Date().toISOString(), uptime: process.uptime(), nodeVersion: process.version, platform: process.platform, architecture: process.arch, metrics: this.metrics, alerts: this.checkAlerts(), recommendations: this.generateRecommendations() }; }
};


// MARK G: Utility Functions Section
// Collection of utility functions with various formatting needs
const UtilityFunctions = {
    // Data transformation utilities - practice with operator+motion combinations
    transformDataStructure: (inputData, mappingRules, validationRules = []) => {
        return inputData
            .filter(item => validationRules.every(rule => rule(item)))
            .map(item => {
                const transformed = {};
                Object.keys(mappingRules).forEach(outputKey => {
                    const mapping = mappingRules[outputKey];
                    if (typeof mapping === 'string') {
                        transformed[outputKey] = item[mapping];
                    } else if (typeof mapping === 'function') {
                        transformed[outputKey] = mapping(item);
                    } else if (mapping.path) {
                        transformed[outputKey] = mapping.path.split('.').reduce((obj, key) => obj?.[key], item);
                    }
                });
                return transformed;
            })
            .sort((a, b) => a.sortKey - b.sortKey);
    },

    // String manipulation with various quote types and patterns
    formatStringTemplate: (template, variables, options = {}) => {
        const { escapeHtml = false, allowMissingVars = false, defaultValue = '' } = options;

        return template.replace(/\{\{(\w+)\}\}/g, (match, variableName) => {
            let value = variables[variableName];

            if (value === undefined || value === null) {
                if (allowMissingVars) {
                    value = defaultValue;
                } else {
                    throw new Error(`Missing variable: ${variableName}`);
                }
            }

            if (escapeHtml && typeof value === 'string') {
                value = value.replace(/[&<>"']/g, (char) => {
                    const entityMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
                    return entityMap[char];
                });
            }

            return String(value);
        });
    }
};


// MARK H: Export and Module Section
// Final export section with comprehensive module exports
export {
    APPLICATION_CONFIG,
    AdvancedUserModel,
    processAdvancedDataAnalytics,
    DatabaseQueryBuilder,
    ComprehensiveApiClient,
    PerformanceMonitor,
    UtilityFunctions
};