/**
 * DATA PROCESSOR MODULE
 * =====================
 *
 * This file is part of the Day 13 file operations practice.
 * Practice opening this file from main.js using :e dataProcessor.js
 */

/**
 * Data Processor Class
 * Practice: Open main.js in a horizontal split to see how this is used
 */
export class DataProcessor {
    constructor() {
        this.config = null;
        this.running = false;
        this.processingQueue = [];
        this.results = new Map();
        this.stats = {
            processed: 0,
            failed: 0,
            totalTime: 0
        };
    }

    /**
     * Initialize the data processor
     * Practice: Open config.json in vertical split to verify processing settings
     */
    async initialize(processingConfig) {
        try {
            this.config = {
                batchSize: 100,
                timeout: 5000,
                maxRetries: 3,
                ...processingConfig
            };

            // Setup processing environment
            // Practice: Create processors/ directory and files
            console.log('Initializing data processor...');

            // Load processing modules
            await this.loadProcessors();

            console.log('DataProcessor initialized');
            return true;

        } catch (error) {
            console.error('DataProcessor initialization failed:', error);
            throw error;
        }
    }

    /**
     * Start the data processor
     * Practice: Use :b main.js to see where this is called
     */
    async start() {
        if (!this.config) {
            throw new Error('DataProcessor not initialized');
        }

        this.running = true;

        // Start processing queue worker
        this.startQueueWorker();

        console.log('DataProcessor started');
    }

    /**
     * Process user data
     * Practice: This is called from main.js - check the data flow
     */
    async processUsers(users) {
        if (!this.running) {
            throw new Error('DataProcessor not running');
        }

        const startTime = Date.now();
        const results = [];

        try {
            // Process in batches
            for (let i = 0; i < users.length; i += this.config.batchSize) {
                const batch = users.slice(i, i + this.config.batchSize);

                // Practice: Create processors/userProcessor.js with :e processors/userProcessor.js
                const batchResults = await this.processBatch(batch);
                results.push(...batchResults);

                // Update statistics
                this.stats.processed += batch.length;

                // Practice: Log progress to processing.log with :e processing.log
                console.log(`Processed batch ${Math.floor(i / this.config.batchSize) + 1}, ${batch.length} users`);
            }

            // Calculate processing time
            const processingTime = Date.now() - startTime;
            this.stats.totalTime += processingTime;

            // Practice: Save results to data/processed/ directory
            await this.saveProcessingResults(results, processingTime);

            return results;

        } catch (error) {
            this.stats.failed += users.length;
            console.error('User processing failed:', error);
            throw error;
        }
    }

    /**
     * Process a batch of users
     * Practice: Open userService.js in a tab to compare user structure
     */
    async processBatch(users) {
        const batchResults = [];

        for (const user of users) {
            try {
                // Validate user data
                const validatedUser = await this.validateUserData(user);

                // Enrich user data
                // Practice: Create enrichment/dataEnricher.js with :tabnew enrichment/dataEnricher.js
                const enrichedUser = await this.enrichUserData(validatedUser);

                // Transform user data
                const transformedUser = await this.transformUserData(enrichedUser);

                // Calculate user metrics
                // Practice: Create analytics/userMetrics.js with :e analytics/userMetrics.js
                const userMetrics = await this.calculateUserMetrics(transformedUser);

                batchResults.push({
                    ...transformedUser,
                    metrics: userMetrics,
                    processedAt: new Date()
                });

            } catch (error) {
                console.error(`Failed to process user ${user.username}:`, error);

                // Practice: Log errors to error/processing.log with :e errors/processing.log
                batchResults.push({
                    ...user,
                    error: error.message,
                    processedAt: new Date(),
                    failed: true
                });
            }
        }

        return batchResults;
    }

    /**
     * Validate user data structure
     * Practice: Create validators/dataValidator.js with :e validators/dataValidator.js
     */
    async validateUserData(user) {
        const validationRules = {
            username: { required: true, type: 'string', minLength: 3 },
            email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            profile: { required: false, type: 'object' }
        };

        const errors = [];

        for (const [field, rules] of Object.entries(validationRules)) {
            const value = user[field];

            if (rules.required && !value) {
                errors.push(`${field} is required`);
                continue;
            }

            if (value && rules.type && typeof value !== rules.type) {
                errors.push(`${field} must be of type ${rules.type}`);
            }

            if (value && rules.minLength && value.length < rules.minLength) {
                errors.push(`${field} must be at least ${rules.minLength} characters`);
            }

            if (value && rules.pattern && !rules.pattern.test(value)) {
                errors.push(`${field} format is invalid`);
            }
        }

        if (errors.length > 0) {
            throw new Error(`Validation failed: ${errors.join(', ')}`);
        }

        return user;
    }

    /**
     * Enrich user data with additional information
     * Practice: Open enrichment/ directory files in tabs
     */
    async enrichUserData(user) {
        const enrichedUser = { ...user };

        try {
            // Add geolocation data
            // Practice: Create enrichment/geolocation.js with :e enrichment/geolocation.js
            if (user.profile?.location) {
                enrichedUser.geo = await this.getGeolocationData(user.profile.location);
            }

            // Add demographic data
            // Practice: Create enrichment/demographics.js with :split enrichment/demographics.js
            enrichedUser.demographics = await this.getDemographicData(user);

            // Add preference scores
            // Practice: Create enrichment/preferences.js with :vsplit enrichment/preferences.js
            enrichedUser.preferenceScores = await this.calculatePreferenceScores(user);

            // Add social data
            if (user.profile?.socialMedia) {
                enrichedUser.socialData = await this.getSocialData(user.profile.socialMedia);
            }

        } catch (error) {
            console.warn(`Enrichment failed for user ${user.username}:`, error);
            // Continue processing even if enrichment fails
        }

        return enrichedUser;
    }

    /**
     * Transform user data for analysis
     * Practice: Create transforms/userTransform.js with :tabnew transforms/userTransform.js
     */
    async transformUserData(user) {
        const transformed = {
            id: user.id,
            username: user.username,
            email: user.email,

            // Standardize profile data
            profile: {
                displayName: user.profile?.displayName || user.username,
                firstName: user.profile?.firstName || '',
                lastName: user.profile?.lastName || '',
                age: this.calculateAge(user.profile?.birthDate),
                location: this.standardizeLocation(user.profile?.location),
                interests: this.normalizeInterests(user.profile?.interests)
            },

            // Add computed fields
            computed: {
                fullName: `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}`.trim(),
                initials: this.getInitials(user.profile?.firstName, user.profile?.lastName),
                domainFromEmail: user.email.split('@')[1],
                accountAge: this.calculateAccountAge(user.createdAt)
            },

            // Preserve metadata
            metadata: {
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
                processedAt: new Date()
            }
        };

        // Practice: Save transformed schema to schemas/transformedUser.json
        return transformed;
    }

    /**
     * Calculate user metrics
     * Practice: Open analytics/ directory files in different splits
     */
    async calculateUserMetrics(user) {
        const metrics = {};

        try {
            // Engagement metrics
            // Practice: Create analytics/engagement.js with :e analytics/engagement.js
            metrics.engagement = {
                loginFrequency: this.calculateLoginFrequency(user),
                profileCompleteness: this.calculateProfileCompleteness(user),
                activityScore: this.calculateActivityScore(user)
            };

            // Behavioral metrics
            // Practice: Create analytics/behavior.js with :split analytics/behavior.js
            metrics.behavior = {
                preferenceAlignment: this.calculatePreferenceAlignment(user),
                interactionPattern: this.analyzeInteractionPattern(user),
                riskScore: this.calculateRiskScore(user)
            };

            // Demographic metrics
            metrics.demographics = {
                ageGroup: this.getAgeGroup(user.profile.age),
                locationTier: this.getLocationTier(user.profile.location),
                interestCategories: this.categorizeInterests(user.profile.interests)
            };

        } catch (error) {
            console.warn(`Metrics calculation failed for user ${user.username}:`, error);
        }

        return metrics;
    }

    /**
     * Start queue worker for background processing
     * Practice: Create workers/queueWorker.js with :e workers/queueWorker.js
     */
    startQueueWorker() {
        const processQueue = async () => {
            while (this.running) {
                if (this.processingQueue.length > 0) {
                    const job = this.processingQueue.shift();

                    try {
                        await this.processJob(job);
                    } catch (error) {
                        console.error('Queue job failed:', error);
                    }
                }

                // Wait before checking queue again
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        };

        processQueue().catch(console.error);
    }

    /**
     * Process a queued job
     * Practice: Create jobs/ directory with different job types
     */
    async processJob(job) {
        const { type, data, id } = job;

        console.log(`Processing job ${id} of type ${type}`);

        switch (type) {
            case 'user_analysis':
                // Practice: Create jobs/userAnalysis.js with :e jobs/userAnalysis.js
                return await this.processUserAnalysis(data);

            case 'batch_export':
                // Practice: Create jobs/batchExport.js with :e jobs/batchExport.js
                return await this.processBatchExport(data);

            case 'data_cleanup':
                // Practice: Create jobs/dataCleanup.js with :e jobs/dataCleanup.js
                return await this.processDataCleanup(data);

            default:
                throw new Error(`Unknown job type: ${type}`);
        }
    }

    /**
     * Load processing modules
     * Practice: Create all processor modules in separate files
     */
    async loadProcessors() {
        console.log('Loading data processors...');

        // Practice: Create these processor files
        // :e processors/textProcessor.js
        // :e processors/imageProcessor.js
        // :e processors/geoProcessor.js
        // :e processors/analyticsProcessor.js

        console.log('All processors loaded');
    }

    /**
     * Save processing results
     * Practice: Create data/results/ directory structure
     */
    async saveProcessingResults(results, processingTime) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `processing_results_${timestamp}.json`;

        const resultData = {
            timestamp: new Date(),
            processingTime,
            resultCount: results.length,
            stats: { ...this.stats },
            results
        };

        // Practice: Create results directory and save file
        // :e data/results/processing_results.json

        console.log(`Processing results saved to ${filename}`);
        console.log(`Processed ${results.length} records in ${processingTime}ms`);
    }

    /**
     * Utility methods for data processing
     * Practice: Create utils/ directory for these utility functions
     */

    calculateAge(birthDate) {
        if (!birthDate) return null;

        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();

        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }

    standardizeLocation(location) {
        if (!location) return null;

        // Practice: Create utils/locationStandardizer.js with :e utils/locationStandardizer.js
        return location.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
    }

    normalizeInterests(interests) {
        if (!interests || !Array.isArray(interests)) return [];

        // Practice: Create utils/interestNormalizer.js with :e utils/interestNormalizer.js
        return interests.map(interest =>
            interest.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '')
        );
    }

    getInitials(firstName, lastName) {
        const first = firstName?.charAt(0).toUpperCase() || '';
        const last = lastName?.charAt(0).toUpperCase() || '';
        return first + last;
    }

    calculateAccountAge(createdAt) {
        if (!createdAt) return 0;

        const created = new Date(createdAt);
        const now = new Date();
        return Math.floor((now - created) / (1000 * 60 * 60 * 24)); // days
    }

    /**
     * Analytics helper methods
     * Practice: Move these to separate analytics files
     */

    calculateLoginFrequency(user) {
        // Placeholder implementation
        // Practice: Create detailed implementation in analytics/loginFrequency.js
        return Math.random(); // Mock data
    }

    calculateProfileCompleteness(user) {
        const fields = ['firstName', 'lastName', 'email', 'location', 'interests'];
        const completed = fields.filter(field => user.profile?.[field]).length;
        return completed / fields.length;
    }

    calculateActivityScore(user) {
        // Practice: Create analytics/activityScore.js with :e analytics/activityScore.js
        return Math.random(); // Mock implementation
    }

    /**
     * Service management methods
     * Practice: These are called from main.js
     */

    isRunning() {
        return this.running;
    }

    async stop() {
        this.running = false;

        // Wait for current processing to finish
        // Practice: Create graceful shutdown in shutdown/dataProcessor.js
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('DataProcessor stopped');
    }

    getStats() {
        return {
            ...this.stats,
            queueSize: this.processingQueue.length,
            running: this.running
        };
    }

    /**
     * Add job to processing queue
     * Practice: Called from external services
     */
    addToQueue(job) {
        this.processingQueue.push({
            ...job,
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            addedAt: new Date()
        });
    }
}

/**
 * PRACTICE EXERCISES SPECIFIC TO THIS FILE:
 *
 * 1. Navigate between related files:
 *    - From main.js: :e dataProcessor.js
 *    - To userService.js: :e userService.js
 *    - Back to main.js: :b main.js
 *    - Use :b# to alternate between files
 *
 * 2. Create directory structure:
 *    - :e processors/userProcessor.js
 *    - :e analytics/engagement.js
 *    - :e utils/locationStandardizer.js
 *    - :e data/results/processing_results.json
 *
 * 3. Work with multiple files:
 *    - Open main.js, userService.js, and dataProcessor.js in tabs
 *    - Use splits to compare implementations
 *    - Use :wa to save all files at once
 *
 * 4. Create processing pipeline files:
 *    - :tabnew enrichment/dataEnricher.js
 *    - :split transforms/userTransform.js
 *    - :vsplit analytics/userMetrics.js
 *
 * 5. Test file operations workflow:
 *    - Make changes across multiple files
 *    - Save individual files with :w
 *    - Save all files with :wa
 *    - Navigate between files to test connections
 */