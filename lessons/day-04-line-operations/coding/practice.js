/**
 * Day 04 - Line Operations Practice File
 * Focus: 0, ^, $, gg, G, :line_number, f, F, t, T, ;, ,
 *
 * LINE OPERATION COMMANDS:
 * 0     = beginning of line (column 0)
 * ^     = first non-whitespace character
 * $     = end of line
 * gg    = first line of file
 * G     = last line of file
 * :42   = go to line 42 (replace 42 with any line number)
 * f{c}  = find character {c} forward on current line
 * F{c}  = find character {c} backward on current line
 * t{c}  = until character {c} forward (stops before)
 * T{c}  = until character {c} backward (stops after)
 * ;     = repeat last f/F/t/T search
 * ,     = repeat last f/F/t/T search in opposite direction
 *
 * PRACTICE INSTRUCTIONS: Use :set number to see line numbers
 */

/* === SECTION 1: LINE NUMBERS 1-20 === */
// Line 19: Practice :19 to jump here quickly
const APPLICATION_CONFIG = {
// Line 21: Use gg to go to top, then :21 to jump here
    name: 'Advanced Data Processing System',
    version: '3.2.1',
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 3000,
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        name: process.env.DB_NAME || 'app_database',
        ssl: process.env.NODE_ENV === 'production'
    }
};

/* === SECTION 2: LINE NUMBERS 30-50 === */
// Line 32: Practice navigating with :32
class DatabaseConnectionManager {
    constructor(config) {
        this.config = config;                    // Use ^ to go to first non-whitespace
        this.connectionPool = null;              // Use 0 to go to beginning of line
        this.isConnected = false;                // Use $ to go to end of line
        this.reconnectAttempts = 0;              // Practice f; to find semicolon
        this.maxReconnectAttempts = 5;           // Practice F5 to find number 5 backwards
        this.connectionTimeout = 30000;          // Practice t0 to move until first 0
    }

    // Line 42: Jump here with :42
    async establishConnection() {
        try {
            console.log('Attempting database connection...'); // Practice f( to find opening paren
            this.connectionPool = await this.createPool();   // Practice F= to find equals backwards
            this.isConnected = true;                         // Practice t; to move until semicolon
            this.reconnectAttempts = 0;                      // Use ; to repeat last search
            console.log('Database connection established');   // Use , to reverse last search
            return this.connectionPool;
        } catch (error) {
            console.error('Connection failed:', error.message); // Practice multiple f and ; sequences
            await this.handleConnectionError(error);
            throw error;
        }
    }
}

/* === SECTION 3: LINE NUMBERS 55-75 === */
// Line 57: Navigate here with :57
async function processDataBatch(batchData, processingOptions = {}) {
    const startTime = performance.now();                    // Practice ^ then f= then f(
    const batchSize = batchData.length;                     // Practice 0 then f= then fb
    const {                                                 // Practice fc to find opening brace
        validateInput = true,                                   // Practice f= to find equals
        transformData = true,                                   // Practice ft to find 't' in true
        sanitizeOutput = false,                                 // Practice Ff to find 'f' backwards
        compressionLevel = 'medium',                            // Practice f' to find quote
        outputFormat = 'json'                                   // Practice $ to go to end
    } = processingOptions;

    // Line 68: Jump to this line with :68
    if (validateInput) {                                     // Practice f{ then f)
        console.log(`Validating batch of ${batchSize} items`); // Practice f` then f$ then f}
        const validationResults = await validateBatchData(batchData); // Practice fa then f(
        if (!validationResults.isValid) {                   // Practice f! then f.
            throw new Error(validationResults.errorMessage); // Practice fE then f(
        }
    }
}

/* === SECTION 4: LINE NUMBERS 76-95 === */
// Line 78: Use :78 to navigate here
function calculateProcessingMetrics(processingResults, executionTime) {
    const totalItems = processingResults.length;            // Practice ^ then f= then ft
    const successfulItems = processingResults.filter(       // Practice fp then f(
        result => result.status === 'success'                   // Practice f= then f'
    ).length;                                               // Practice F. to find dot backwards
    const failedItems = totalItems - successfulItems;       // Practice f- then f;
    const successRate = (successfulItems / totalItems) * 100; // Practice f/ then f*
    const averageProcessingTime = executionTime / totalItems; // Practice f/ then f;

    // Line 88: Navigate with :88
    return {                                                // Practice f{ to find opening brace
        totalItemsProcessed: totalItems,                        // Practice f: then f,
        successfullyProcessed: successfulItems,                 // Practice fy then f,
        failedProcessing: failedItems,                          // Practice fg then f,
        successRatePercentage: successRate.toFixed(2),          // Practice f( then f.
        averageTimePerItem: averageProcessingTime.toFixed(4)    // Practice fa then f(
    };
}

/* === SECTION 5: LINE NUMBERS 96-115 === */
// Line 98: Jump here using :98
const ERROR_TYPES = {                                      // Practice fE then f_ then f{
    VALIDATION_ERROR: 'VALIDATION_ERROR',                       // Practice f: then f'
    PROCESSING_ERROR: 'PROCESSING_ERROR',                       // Practice fP then f_
    NETWORK_ERROR: 'NETWORK_ERROR',                             // Practice fN then f'
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',                             // Practice fT then f,
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',               // Practice fA then f_
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',                 // Practice fZ then f_
    DATABASE_ERROR: 'DATABASE_ERROR',                           // Practice fD then f'
    CONFIGURATION_ERROR: 'CONFIGURATION_ERROR'                  // Practice fC then f_
};

// Line 108: Navigate with :108
class ErrorHandler {                                       // Practice fE then f{
    constructor(logger) {                                      // Practice f( then f)
        this.logger = logger;                                   // Practice ft then f.
        this.errorCounts = new Map();                           // Practice fM then f(
        this.lastErrorTimestamp = null;                         // Practice fl then f;
    }

/* === SECTION 6: LINE NUMBERS 116-135 === */
    // Line 117: Use :117
    handleError(error, context = {}) {                      // Practice f( then f, then f{
        const errorType = this.determineErrorType(error);      // Practice f= then f(
        const timestamp = new Date().toISOString();            // Practice fn then f(
        const errorId = this.generateErrorId();                // Practice fg then f(

        // Line 122: Navigate here with :122
        const errorDetails = {                              // Practice fD then f{
            id: errorId,                                        // Practice f: then f,
            type: errorType,                                    // Practice fy then f,
            message: error.message || 'Unknown error',          // Practice fm then f|
            timestamp: timestamp,                               // Practice ft then f,
            context: context,                                   // Practice fc then f,
            stackTrace: error.stack || null                    // Practice fs then f|
        };

        // Line 131: Jump with :131
        this.logger.error('Error occurred:', errorDetails);  // Practice f' then f:
        this.incrementErrorCount(errorType);                 // Practice fi then f(
        this.lastErrorTimestamp = timestamp;                 // Practice fl then f;
        return errorDetails;                                 // Practice fr then f;
    }
}

/* === SECTION 7: LINE NUMBERS 136-155 === */
// Line 138: Navigate using :138
async function executeDataPipeline(inputData, pipelineConfig) {
    const pipeline = [                                      // Practice fp then f[
        { stage: 'input_validation', enabled: true },          // Practice f: then f'
        { stage: 'data_transformation', enabled: true },       // Practice fd then f_
        { stage: 'quality_assessment', enabled: false },       // Practice fq then f_
        { stage: 'output_formatting', enabled: true },         // Practice fo then f_
        { stage: 'result_persistence', enabled: true }         // Practice fr then f_
    ];

    // Line 148: Use :148 to jump here
    const results = [];                                     // Practice fr then f[
    let currentData = inputData;                            // Practice fl then f=

    for (const stageConfig of pipeline) {                   // Practice f( then fo
        if (stageConfig.enabled) {                              // Practice f. then f)
            console.log(`Executing stage: ${stageConfig.stage}`); // Practice f` then f$
            currentData = await executeStage(currentData, stageConfig); // Practice f= then fa
        }
    }
}

/* === SECTION 8: LINE NUMBERS 156-175 === */
// Line 158: Navigate with :158
const API_ENDPOINTS = {                                    // Practice fA then f_ then f{
    users: {                                                   // Practice fu then f{
        list: '/api/v1/users',                                     // Practice f/ then fa
        create: '/api/v1/users',                                   // Practice fc then f/
        update: '/api/v1/users/:id',                               // Practice fu then f:
        delete: '/api/v1/users/:id',                               // Practice fd then f:
        profile: '/api/v1/users/:id/profile'                       // Practice fp then f:
    },
    posts: {                                                   // Practice fp then f{
        list: '/api/v1/posts',                                     // Practice fl then f/
        create: '/api/v1/posts',                                   // Practice fc then f'
        update: '/api/v1/posts/:id',                               // Practice fu then f:
        delete: '/api/v1/posts/:id',                               // Practice fd then f:
        comments: '/api/v1/posts/:id/comments'                     // Practice fc then f:
    }
};

/* === SECTION 9: LINE NUMBERS 176-195 === */
// Line 178: Jump here with :178
function generateApiResponse(data, statusCode = 200, metadata = {}) {
    const response = {                                      // Practice fr then f{
        success: statusCode >= 200 && statusCode < 300,        // Practice f> then f&
        statusCode: statusCode,                                 // Practice fC then f,
        timestamp: new Date().toISOString(),                    // Practice fn then f(
        data: data,                                             // Practice fd then f,
        metadata: {                                             // Practice fm then f{
            version: '1.0.0',                                      // Practice fv then f'
            requestId: Math.random().toString(36).substr(2, 9),    // Practice fM then f(
            processingTime: performance.now(),                     // Practice fp then f(
            ...metadata                                            // Practice f. then f.
        }
    };

    // Line 192: Navigate using :192
    if (!response.success) {                                // Practice f! then f.
        response.error = {                                      // Practice fe then f{
            code: statusCode,                                       // Practice fc then f,
            message: getErrorMessage(statusCode)                    // Practice fm then f(
        };
    }

    return response;                                        // Practice fr then f;
}

/* === FINAL SECTION: LINE NUMBERS 196+ === */
// Line 202: Use G to go to end, then :202 to jump here
/**
 * LINE OPERATION PRACTICE SUMMARY:
 *
 * Vertical Navigation:
 * - gg: Go to first line
 * - G: Go to last line
 * - :50: Go to line 50 (replace with any number)
 *
 * Horizontal Navigation:
 * - 0: Beginning of line
 * - ^: First non-whitespace character
 * - $: End of line
 *
 * Find on Line:
 * - f{char}: Find character forward
 * - F{char}: Find character backward
 * - t{char}: Until character forward
 * - T{char}: Until character backward
 * - ;: Repeat last find
 * - ,: Repeat last find in opposite direction
 *
 * Practice jumping to specific line numbers and using find commands!
 */