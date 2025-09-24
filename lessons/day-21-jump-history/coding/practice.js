// Day 21: Jump History and Navigation Practice
// Practice with Ctrl-o (jump back), Ctrl-i (jump forward), and complex navigation history
// This multi-file project structure helps practice navigation between different code sections

/**
 * Multi-Module JavaScript Application - Main Entry Point
 * Navigate between different modules and functions to practice jump history
 * Use Ctrl-o and Ctrl-i to move through your navigation history
 */

// Import statements that create jump opportunities
import { DatabaseManager } from './database/connection.js';
import { UserService } from './services/user-service.js';
import { ProductService } from './services/product-service.js';
import { OrderService } from './services/order-service.js';
import { EmailService } from './services/email-service.js';
import { PaymentProcessor } from './payment/payment-processor.js';
import { InventoryManager } from './inventory/inventory-manager.js';
import { ReportGenerator } from './reports/report-generator.js';
import { CacheManager } from './cache/cache-manager.js';
import { LoggingService } from './utils/logging-service.js';
import { ValidationHelpers } from './utils/validation-helpers.js';
import { DateTimeUtils } from './utils/datetime-utils.js';

// Application configuration and initialization
const APP_CONFIG = {
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        name: process.env.DB_NAME || 'ecommerce',
        username: process.env.DB_USER || 'admin',
        password: process.env.DB_PASS || 'password'
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASS || null
    },
    api: {
        baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
        timeout: parseInt(process.env.API_TIMEOUT) || 30000,
        retryAttempts: parseInt(process.env.API_RETRY_ATTEMPTS) || 3
    },
    email: {
        service: process.env.EMAIL_SERVICE || 'smtp',
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        username: process.env.EMAIL_USER || '',
        password: process.env.EMAIL_PASS || ''
    },
    payment: {
        stripeApiKey: process.env.STRIPE_API_KEY || '',
        paypalClientId: process.env.PAYPAL_CLIENT_ID || '',
        paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET || ''
    }
};

// Main application class that orchestrates all services
class ECommerceApplication {
    constructor() {
        this.services = new Map();
        this.isInitialized = false;
        this.startTime = Date.now();
        this.logger = new LoggingService('APPLICATION');
    }

    async initialize() {
        try {
            this.logger.info('Starting application initialization...');

            // Initialize database connection
            await this.initializeDatabaseConnection();

            // Initialize cache system
            await this.initializeCacheSystem();

            // Initialize core services
            await this.initializeCoreServices();

            // Initialize payment processing
            await this.initializePaymentProcessing();

            // Initialize email services
            await this.initializeEmailServices();

            // Initialize reporting system
            await this.initializeReportingSystem();

            // Start background jobs
            await this.startBackgroundJobs();

            this.isInitialized = true;
            this.logger.info('Application initialization completed successfully');

        } catch (error) {
            this.logger.error('Application initialization failed:', error);
            throw error;
        }
    }

    async initializeDatabaseConnection() {
        this.logger.info('Initializing database connection...');

        const dbManager = new DatabaseManager(APP_CONFIG.database);
        await dbManager.connect();
        await dbManager.runMigrations();
        await dbManager.seedInitialData();

        this.services.set('database', dbManager);
        this.logger.info('Database connection established');
    }

    async initializeCacheSystem() {
        this.logger.info('Initializing cache system...');

        const cacheManager = new CacheManager(APP_CONFIG.redis);
        await cacheManager.connect();
        await cacheManager.flushExpiredKeys();

        this.services.set('cache', cacheManager);
        this.logger.info('Cache system initialized');
    }

    async initializeCoreServices() {
        this.logger.info('Initializing core services...');

        const database = this.services.get('database');
        const cache = this.services.get('cache');

        // User service for authentication and user management
        const userService = new UserService(database, cache);
        await userService.initialize();
        this.services.set('user', userService);

        // Product service for catalog management
        const productService = new ProductService(database, cache);
        await productService.loadCategories();
        await productService.updateSearchIndex();
        this.services.set('product', productService);

        // Inventory service for stock management
        const inventoryManager = new InventoryManager(database, cache);
        await inventoryManager.loadInventoryData();
        await inventoryManager.startStockMonitoring();
        this.services.set('inventory', inventoryManager);

        // Order service for order processing
        const orderService = new OrderService(database, cache, inventoryManager);
        await orderService.loadOrderStatuses();
        await orderService.resumePendingOrders();
        this.services.set('order', orderService);

        this.logger.info('Core services initialized');
    }

    async initializePaymentProcessing() {
        this.logger.info('Initializing payment processing...');

        const paymentProcessor = new PaymentProcessor(APP_CONFIG.payment);
        await paymentProcessor.validateApiKeys();
        await paymentProcessor.loadPaymentMethods();

        this.services.set('payment', paymentProcessor);
        this.logger.info('Payment processing initialized');
    }

    async initializeEmailServices() {
        this.logger.info('Initializing email services...');

        const emailService = new EmailService(APP_CONFIG.email);
        await emailService.testConnection();
        await emailService.loadEmailTemplates();

        this.services.set('email', emailService);
        this.logger.info('Email services initialized');
    }

    async initializeReportingSystem() {
        this.logger.info('Initializing reporting system...');

        const reportGenerator = new ReportGenerator(
            this.services.get('database'),
            this.services.get('cache')
        );
        await reportGenerator.loadReportTemplates();
        await reportGenerator.scheduleAutomaticReports();

        this.services.set('reports', reportGenerator);
        this.logger.info('Reporting system initialized');
    }

    async startBackgroundJobs() {
        this.logger.info('Starting background jobs...');

        // Inventory monitoring job
        this.startInventoryMonitoringJob();

        // Email queue processing job
        this.startEmailQueueProcessor();

        // Cache cleanup job
        this.startCacheCleanupJob();

        // Report generation job
        this.startReportGenerationJob();

        // Health check monitoring job
        this.startHealthCheckJob();

        this.logger.info('Background jobs started');
    }

    startInventoryMonitoringJob() {
        setInterval(async () => {
            try {
                const inventoryManager = this.services.get('inventory');
                await inventoryManager.checkLowStockItems();
                await inventoryManager.updateReorderRecommendations();
            } catch (error) {
                this.logger.error('Inventory monitoring job failed:', error);
            }
        }, 60000); // Run every minute
    }

    startEmailQueueProcessor() {
        setInterval(async () => {
            try {
                const emailService = this.services.get('email');
                await emailService.processEmailQueue();
            } catch (error) {
                this.logger.error('Email queue processor failed:', error);
            }
        }, 30000); // Run every 30 seconds
    }

    startCacheCleanupJob() {
        setInterval(async () => {
            try {
                const cacheManager = this.services.get('cache');
                await cacheManager.cleanupExpiredKeys();
                await cacheManager.optimizeMemoryUsage();
            } catch (error) {
                this.logger.error('Cache cleanup job failed:', error);
            }
        }, 300000); // Run every 5 minutes
    }

    startReportGenerationJob() {
        setInterval(async () => {
            try {
                const reportGenerator = this.services.get('reports');
                await reportGenerator.generateScheduledReports();
            } catch (error) {
                this.logger.error('Report generation job failed:', error);
            }
        }, 3600000); // Run every hour
    }

    startHealthCheckJob() {
        setInterval(async () => {
            try {
                await this.performHealthCheck();
            } catch (error) {
                this.logger.error('Health check job failed:', error);
            }
        }, 120000); // Run every 2 minutes
    }

    async performHealthCheck() {
        const healthStatus = {
            timestamp: new Date().toISOString(),
            uptime: Date.now() - this.startTime,
            services: {},
            memory: process.memoryUsage(),
            cpu: process.cpuUsage()
        };

        // Check database health
        try {
            const database = this.services.get('database');
            await database.ping();
            healthStatus.services.database = { status: 'healthy', responseTime: 0 };
        } catch (error) {
            healthStatus.services.database = { status: 'unhealthy', error: error.message };
        }

        // Check cache health
        try {
            const cache = this.services.get('cache');
            await cache.ping();
            healthStatus.services.cache = { status: 'healthy', responseTime: 0 };
        } catch (error) {
            healthStatus.services.cache = { status: 'unhealthy', error: error.message };
        }

        // Check email service health
        try {
            const emailService = this.services.get('email');
            await emailService.ping();
            healthStatus.services.email = { status: 'healthy', responseTime: 0 };
        } catch (error) {
            healthStatus.services.email = { status: 'unhealthy', error: error.message };
        }

        // Check payment service health
        try {
            const paymentProcessor = this.services.get('payment');
            await paymentProcessor.ping();
            healthStatus.services.payment = { status: 'healthy', responseTime: 0 };
        } catch (error) {
            healthStatus.services.payment = { status: 'unhealthy', error: error.message };
        }

        this.logger.info('Health check completed', healthStatus);
        return healthStatus;
    }

    getService(serviceName) {
        const service = this.services.get(serviceName);
        if (!service) {
            throw new Error(`Service '${serviceName}' not found or not initialized`);
        }
        return service;
    }

    async shutdown() {
        this.logger.info('Starting application shutdown...');

        try {
            // Stop background jobs (they will stop automatically when the process exits)

            // Close service connections in reverse order
            const shutdownOrder = ['reports', 'email', 'payment', 'order', 'inventory', 'product', 'user', 'cache', 'database'];

            for (const serviceName of shutdownOrder) {
                const service = this.services.get(serviceName);
                if (service && typeof service.close === 'function') {
                    this.logger.info(`Shutting down ${serviceName} service...`);
                    await service.close();
                }
            }

            this.isInitialized = false;
            this.logger.info('Application shutdown completed');

        } catch (error) {
            this.logger.error('Error during application shutdown:', error);
            throw error;
        }
    }
}

// API Routes and Controllers - Create navigation points throughout the application
class APIController {
    constructor(app) {
        this.app = app;
        this.setupRoutes();
    }

    setupRoutes() {
        // User management routes
        this.setupUserRoutes();

        // Product catalog routes
        this.setupProductRoutes();

        // Order management routes
        this.setupOrderRoutes();

        // Payment processing routes
        this.setupPaymentRoutes();

        // Administrative routes
        this.setupAdminRoutes();

        // Health and monitoring routes
        this.setupHealthRoutes();
    }

    setupUserRoutes() {
        // User registration and authentication
        this.app.post('/api/users/register', this.handleUserRegistration.bind(this));
        this.app.post('/api/users/login', this.handleUserLogin.bind(this));
        this.app.post('/api/users/logout', this.handleUserLogout.bind(this));
        this.app.get('/api/users/profile', this.handleGetUserProfile.bind(this));
        this.app.put('/api/users/profile', this.handleUpdateUserProfile.bind(this));
        this.app.delete('/api/users/account', this.handleDeleteUserAccount.bind(this));

        // Password management
        this.app.post('/api/users/password/reset', this.handlePasswordReset.bind(this));
        this.app.post('/api/users/password/change', this.handlePasswordChange.bind(this));

        // User preferences and settings
        this.app.get('/api/users/preferences', this.handleGetUserPreferences.bind(this));
        this.app.put('/api/users/preferences', this.handleUpdateUserPreferences.bind(this));
    }

    setupProductRoutes() {
        // Product catalog browsing
        this.app.get('/api/products', this.handleGetProducts.bind(this));
        this.app.get('/api/products/:id', this.handleGetProductDetails.bind(this));
        this.app.get('/api/products/category/:category', this.handleGetProductsByCategory.bind(this));
        this.app.get('/api/products/search', this.handleSearchProducts.bind(this));

        // Product reviews and ratings
        this.app.get('/api/products/:id/reviews', this.handleGetProductReviews.bind(this));
        this.app.post('/api/products/:id/reviews', this.handleCreateProductReview.bind(this));
        this.app.put('/api/products/:id/reviews/:reviewId', this.handleUpdateProductReview.bind(this));
        this.app.delete('/api/products/:id/reviews/:reviewId', this.handleDeleteProductReview.bind(this));

        // Product recommendations
        this.app.get('/api/products/recommendations', this.handleGetProductRecommendations.bind(this));
        this.app.get('/api/products/:id/related', this.handleGetRelatedProducts.bind(this));
    }

    setupOrderRoutes() {
        // Shopping cart management
        this.app.get('/api/cart', this.handleGetCart.bind(this));
        this.app.post('/api/cart/items', this.handleAddToCart.bind(this));
        this.app.put('/api/cart/items/:itemId', this.handleUpdateCartItem.bind(this));
        this.app.delete('/api/cart/items/:itemId', this.handleRemoveFromCart.bind(this));
        this.app.delete('/api/cart', this.handleClearCart.bind(this));

        // Order processing
        this.app.post('/api/orders', this.handleCreateOrder.bind(this));
        this.app.get('/api/orders', this.handleGetUserOrders.bind(this));
        this.app.get('/api/orders/:id', this.handleGetOrderDetails.bind(this));
        this.app.put('/api/orders/:id/cancel', this.handleCancelOrder.bind(this));

        // Order tracking and status
        this.app.get('/api/orders/:id/status', this.handleGetOrderStatus.bind(this));
        this.app.get('/api/orders/:id/tracking', this.handleGetOrderTracking.bind(this));
    }

    setupPaymentRoutes() {
        // Payment method management
        this.app.get('/api/payment/methods', this.handleGetPaymentMethods.bind(this));
        this.app.post('/api/payment/methods', this.handleAddPaymentMethod.bind(this));
        this.app.delete('/api/payment/methods/:id', this.handleRemovePaymentMethod.bind(this));

        // Payment processing
        this.app.post('/api/payment/process', this.handleProcessPayment.bind(this));
        this.app.post('/api/payment/refund', this.handleProcessRefund.bind(this));

        // Payment history and receipts
        this.app.get('/api/payment/history', this.handleGetPaymentHistory.bind(this));
        this.app.get('/api/payment/receipt/:transactionId', this.handleGetPaymentReceipt.bind(this));
    }

    setupAdminRoutes() {
        // Product management (admin only)
        this.app.post('/api/admin/products', this.handleCreateProduct.bind(this));
        this.app.put('/api/admin/products/:id', this.handleUpdateProduct.bind(this));
        this.app.delete('/api/admin/products/:id', this.handleDeleteProduct.bind(this));

        // Inventory management
        this.app.get('/api/admin/inventory', this.handleGetInventoryReport.bind(this));
        this.app.put('/api/admin/inventory/:productId', this.handleUpdateInventory.bind(this));

        // User management (admin only)
        this.app.get('/api/admin/users', this.handleGetAllUsers.bind(this));
        this.app.put('/api/admin/users/:id/status', this.handleUpdateUserStatus.bind(this));

        // Order management (admin only)
        this.app.get('/api/admin/orders', this.handleGetAllOrders.bind(this));
        this.app.put('/api/admin/orders/:id/status', this.handleUpdateOrderStatus.bind(this));

        // Reports and analytics
        this.app.get('/api/admin/reports/sales', this.handleGetSalesReport.bind(this));
        this.app.get('/api/admin/reports/users', this.handleGetUserReport.bind(this));
        this.app.get('/api/admin/reports/inventory', this.handleGetInventoryReport.bind(this));
    }

    setupHealthRoutes() {
        // System health and monitoring
        this.app.get('/api/health', this.handleHealthCheck.bind(this));
        this.app.get('/api/health/detailed', this.handleDetailedHealthCheck.bind(this));
        this.app.get('/api/metrics', this.handleGetSystemMetrics.bind(this));
    }

    // Placeholder method implementations for navigation practice
    async handleUserRegistration(req, res) { /* Implementation would go here */ }
    async handleUserLogin(req, res) { /* Implementation would go here */ }
    async handleUserLogout(req, res) { /* Implementation would go here */ }
    async handleGetUserProfile(req, res) { /* Implementation would go here */ }
    async handleUpdateUserProfile(req, res) { /* Implementation would go here */ }
    async handleDeleteUserAccount(req, res) { /* Implementation would go here */ }
    async handlePasswordReset(req, res) { /* Implementation would go here */ }
    async handlePasswordChange(req, res) { /* Implementation would go here */ }
    async handleGetUserPreferences(req, res) { /* Implementation would go here */ }
    async handleUpdateUserPreferences(req, res) { /* Implementation would go here */ }
    async handleGetProducts(req, res) { /* Implementation would go here */ }
    async handleGetProductDetails(req, res) { /* Implementation would go here */ }
    async handleGetProductsByCategory(req, res) { /* Implementation would go here */ }
    async handleSearchProducts(req, res) { /* Implementation would go here */ }
    async handleHealthCheck(req, res) { /* Implementation would go here */ }
}

// Application entry point and startup sequence
async function startApplication() {
    const logger = new LoggingService('MAIN');

    try {
        logger.info('Starting E-Commerce Application...');

        // Create application instance
        const app = new ECommerceApplication();

        // Initialize all services
        await app.initialize();

        // Start web server
        const port = process.env.PORT || 3000;
        const server = app.listen(port, () => {
            logger.info(`Server running on port ${port}`);
        });

        // Graceful shutdown handling
        const gracefulShutdown = async (signal) => {
            logger.info(`Received ${signal}. Starting graceful shutdown...`);

            server.close(async () => {
                try {
                    await app.shutdown();
                    logger.info('Graceful shutdown completed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}

// Export application components
export {
    ECommerceApplication,
    APIController,
    APP_CONFIG,
    startApplication
};