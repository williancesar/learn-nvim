/**
 * DAY 13: FILE OPERATIONS PRACTICE - MAIN MODULE
 * ===============================================
 *
 * LEARNING OBJECTIVES:
 * - Master file opening and switching (:e, :split, :vsplit)
 * - Practice buffer navigation (:bn, :bp, :b#)
 * - Learn file saving operations (:w, :wa, :wq)
 * - Master tab management (:tabnew, gt, gT)
 *
 * KEY COMMANDS TO PRACTICE:
 * - :e filename    : Edit/open file
 * - :split         : Horizontal split
 * - :vsplit        : Vertical split
 * - :tabnew        : New tab
 * - :w             : Save current file
 * - :wa            : Save all files
 * - :wq            : Save and quit
 * - :q!            : Quit without saving
 * - Ctrl-w + hjkl : Navigate between splits
 * - :bn            : Next buffer
 * - :bp            : Previous buffer
 * - :b#            : Switch to alternate buffer
 * - gt             : Next tab
 * - gT             : Previous tab
 *
 * FILE STRUCTURE:
 * This exercise includes multiple interconnected files:
 * - main.js (this file) - Entry point and orchestration
 * - userService.js - User management functionality
 * - dataProcessor.js - Data processing utilities
 * - config.json - Configuration settings
 * - styles.css - Styling definitions
 * - README.md - Documentation
 * - package.json - Package configuration
 */

// Import statements - practice opening these files with :e
import { UserService } from './userService.js';
import { DataProcessor } from './dataProcessor.js';
import configData from './config.json';

/**
 * Main Application Class
 * Practice: Open userService.js with :e userService.js to see the UserService implementation
 */
class Application {
    constructor() {
        this.userService = new UserService();
        this.dataProcessor = new DataProcessor();
        this.config = configData;
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     * Practice: Use :split to open config.json in horizontal split to verify settings
     */
    async initialize() {
        try {
            console.log('Initializing application...');

            // Load configuration
            // Practice: Open config.json with :e config.json to check these settings
            this.config = await this.loadConfiguration();

            // Initialize services
            await this.userService.initialize(this.config.database);
            await this.dataProcessor.initialize(this.config.processing);

            this.isInitialized = true;
            console.log('Application initialized successfully');

            return true;
        } catch (error) {
            console.error('Failed to initialize application:', error);
            // Practice: Open a new tab with :tabnew to create an error log
            return false;
        }
    }

    /**
     * Load configuration from file
     * Practice: Use :vsplit config.json to view config while editing this method
     */
    async loadConfiguration() {
        // Practice: Open config.json to verify these default values
        const defaultConfig = {
            server: {
                port: 3000,
                host: 'localhost'
            },
            database: {
                url: 'mongodb://localhost:27017/myapp',
                options: { useNewUrlParser: true }
            },
            processing: {
                batchSize: 100,
                timeout: 5000
            }
        };

        try {
            // In a real app, this would read from config.json
            // Practice: Switch to config.json buffer with :b config.json
            return { ...defaultConfig, ...this.config };
        } catch (error) {
            console.warn('Using default configuration');
            return defaultConfig;
        }
    }

    /**
     * Start the application server
     * Practice: Open userService.js and dataProcessor.js in splits to see implementations
     */
    async start() {
        if (!this.isInitialized) {
            throw new Error('Application not initialized');
        }

        try {
            // Start services
            // Practice: Use :bn and :bp to navigate between related files
            await this.userService.start();
            await this.dataProcessor.start();

            // Start server
            console.log(`Server starting on ${this.config.server.host}:${this.config.server.port}`);

            // Practice: Open package.json to check version and scripts
            this.setupRoutes();
            this.setupMiddleware();

            console.log('Application started successfully');

        } catch (error) {
            console.error('Failed to start application:', error);
            throw error;
        }
    }

    /**
     * Setup application routes
     * Practice: Create a new file routes.js with :e routes.js
     */
    setupRoutes() {
        // User routes
        // Practice: Open userService.js to see available methods
        console.log('Setting up user routes...');

        // Data processing routes
        // Practice: Open dataProcessor.js to see available methods
        console.log('Setting up data processing routes...');

        // Static routes
        // Practice: Open styles.css to see styling definitions
        console.log('Setting up static routes...');
    }

    /**
     * Setup middleware
     * Practice: Create middleware.js with :tabnew middleware.js
     */
    setupMiddleware() {
        console.log('Setting up middleware...');

        // CORS middleware
        // Authentication middleware
        // Logging middleware
        // Error handling middleware
    }

    /**
     * Process user data batch
     * Practice: Open both userService.js and dataProcessor.js in vertical splits
     */
    async processUserBatch(users) {
        try {
            // Validate users
            // Practice: Switch to userService.js with :b userService.js
            const validUsers = await this.userService.validateUsers(users);

            // Process data
            // Practice: Switch to dataProcessor.js with :b dataProcessor.js
            const processedData = await this.dataProcessor.processUsers(validUsers);

            // Save results
            // Practice: Create results.json with :e results.json
            await this.saveResults(processedData);

            return processedData;

        } catch (error) {
            console.error('Batch processing failed:', error);
            // Practice: Open error.log with :e error.log to log this error
            throw error;
        }
    }

    /**
     * Save processing results
     * Practice: Create a new results directory and file with :e results/output.json
     */
    async saveResults(data) {
        console.log('Saving results...');

        // Save to file
        // Practice: Use :w to save after making changes
        const timestamp = new Date().toISOString();
        const filename = `results_${timestamp}.json`;

        // Practice: Open the results file in a new tab
        console.log(`Results saved to ${filename}`);
    }

    /**
     * Shutdown the application
     * Practice: Save all open files with :wa before shutdown
     */
    async shutdown() {
        console.log('Shutting down application...');

        try {
            // Stop services
            await this.userService.stop();
            await this.dataProcessor.stop();

            // Close connections
            // Practice: Review all open files before closing

            console.log('Application shutdown complete');

        } catch (error) {
            console.error('Error during shutdown:', error);
            // Practice: Force quit with :q! if there are unsaved changes
        }
    }

    /**
     * Health check endpoint
     * Practice: Open all related files to verify their status
     */
    getHealthStatus() {
        return {
            status: 'healthy',
            initialized: this.isInitialized,
            services: {
                userService: this.userService.isRunning(),
                dataProcessor: this.dataProcessor.isRunning()
            },
            timestamp: new Date().toISOString()
        };
    }
}

// Application entry point
// Practice: Open package.json to see npm scripts that might run this
async function main() {
    const app = new Application();

    try {
        // Practice: Open all related files in tabs before running
        await app.initialize();
        await app.start();

        // Practice: Use Ctrl-w + hjkl to navigate between split windows
        console.log('Application is running...');

        // Setup graceful shutdown
        // Practice: Create shutdown.js with :e shutdown.js
        process.on('SIGINT', async () => {
            console.log('Received SIGINT, shutting down...');
            await app.shutdown();
            process.exit(0);
        });

    } catch (error) {
        console.error('Application failed to start:', error);
        // Practice: Check error.log with :e error.log
        process.exit(1);
    }
}

// Export for testing
// Practice: Create test files with :e test/main.test.js
export { Application };

// Run if this is the main module
// Practice: Check package.json to see how this is configured
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

/**
 * PRACTICE EXERCISES FOR FILE OPERATIONS:
 *
 * 1. BASIC FILE OPENING:
 *    - Open userService.js: :e userService.js
 *    - Open config.json: :e config.json
 *    - Open styles.css: :e styles.css
 *    - Open package.json: :e package.json
 *
 * 2. SPLIT WINDOW PRACTICE:
 *    - Open horizontal split: :split userService.js
 *    - Open vertical split: :vsplit dataProcessor.js
 *    - Navigate splits: Ctrl-w + h/j/k/l
 *    - Close split: Ctrl-w + c
 *
 * 3. BUFFER NAVIGATION:
 *    - Next buffer: :bn
 *    - Previous buffer: :bp
 *    - Switch to alternate: :b#
 *    - List buffers: :ls
 *    - Switch to specific: :b userService.js
 *
 * 4. TAB MANAGEMENT:
 *    - New tab: :tabnew
 *    - Open file in new tab: :tabnew config.json
 *    - Next tab: gt
 *    - Previous tab: gT
 *    - Close tab: :tabclose
 *
 * 5. SAVING OPERATIONS:
 *    - Save current file: :w
 *    - Save all files: :wa
 *    - Save and quit: :wq
 *    - Save as new name: :w newfile.js
 *
 * 6. COMPLEX WORKFLOWS:
 *    - Open related files in tabs
 *    - Use splits to compare implementations
 *    - Navigate between files while editing
 *    - Save multiple files before testing
 *
 * WORKFLOW SUGGESTIONS:
 * - Open main.js, userService.js, and dataProcessor.js in tabs
 * - Use splits to view config.json while editing main.js
 * - Create new files as referenced in the code
 * - Practice saving all files before testing changes
 */