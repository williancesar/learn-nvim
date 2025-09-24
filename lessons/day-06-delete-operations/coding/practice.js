/**
 * Day 06 - Delete Operations Practice File
 * Focus: x, X, dw, db, dd, D, dt, df
 *
 * DELETE COMMANDS:
 * x = delete character under cursor
 * X = delete character before cursor
 * dw = delete word forward
 * db = delete word backward
 * dd = delete entire line
 * D = delete to end of line
 * dt{char} = delete until character
 * df{char} = delete including character
 * d$ = delete to end of line (same as D)
 * d0 = delete to beginning of line
 *
 * PRACTICE: Remove redundant code, comments, and fix formatting
 */

// DELETE PRACTICE: Remove redundant comments and fix this messy code

/* This is a redundant comment */ const API_VERSION = 'v1'; /* Remove this comment too */

// TODO: Delete this entire comment line
const BASE_URL = 'https://api.example.com'; // Delete this inline comment

// REDUNDANT: This comment is not needed
const TIMEOUT_MS = 5000; // This comment is also redundant

/**
 * MESSY CLASS: Clean up using delete operations
 * Remove unnecessary comments, fix spacing, and clean formatting
 */
class /* inline comment to delete */ DataProcessor {
    constructor(config) {
        // REDUNDANT: Remove this comment
        this.config = config;
        this.isInitialized = false; // Delete this comment
        this.errorCount = 0; /* Delete this block comment */

        // TODO: Delete this debugging line
        console.log('DataProcessor initialized with config:', config);

        this.processingQueue = []; // Remove this comment
        this.maxRetries = 3; /* Another comment to remove */
    }

    // PRACTICE: Delete 'Debug' from method name using dw
    processDebugData(inputData) {
        // Delete this entire debugging section using dd multiple times:
        console.log('=== DEBUG START ===');
        console.log('Input data:', inputData);
        console.log('Config:', this.config);
        console.log('=== DEBUG END ===');

        if (!inputData || inputData.length === 0) {
            // REDUNDANT: Delete this comment
            return [];
        }

        const results = []; // Delete this comment using dt; then x for semicolon

        // Delete 'Debug' from variable name using dw
        const debugProcessedItems = inputData.map(item => {
            // PRACTICE: Delete ', item' from console.log using dt, then df)
            console.log('Processing item:', item, ', item index:', item.id);

            try {
                // Delete 'Debug' from method call using dw
                const processed = this.processDebugItem(item);
                results.push(processed);

                // Delete this entire debugging line
                console.log('Successfully processed item:', item.id);

                return processed;
            } catch (error) {
                // Delete 'DEBUG: ' from error message using dt:
                console.error('DEBUG: Error processing item:', error.message);

                this.errorCount++; // Delete this comment: // Increment error count
                return null;
            }
        });

        // Delete this debugging section using dd on each line:
        console.log('Processing complete');
        console.log('Total errors:', this.errorCount);
        console.log('Results:', results);

        return debugProcessedItems; // Delete 'Debug' from variable name
    }

    // Delete 'Debug' from method name and clean up comments
    processDebugItem(item) {
        // Delete this debugging comment block:
        /*
         * DEBUG: Processing individual item
         * Item structure: { id, data, metadata }
         * Processing steps: validate, transform, sanitize
         */

        // PRACTICE: Delete from '// ' to end of line using dt then D
        const validated = this.validateItem(item); // Remove this validation comment

        if (!validated) {
            // Delete this debugging line completely
            console.log('DEBUG: Validation failed for item:', item.id);
            throw new Error('Validation failed');
        }

        // Delete 'Debug' from variable name
        const debugTransformed = this.transformItem(validated);

        // Delete this entire debugging section:
        // --- DEBUG INFO START ---
        // console.log('Transformation applied');
        // console.log('Original:', validated);
        // console.log('Transformed:', debugTransformed);
        // --- DEBUG INFO END ---

        return debugTransformed; // Delete 'Debug' from variable name
    }

    // REDUNDANT METHOD: Delete this entire method using dd multiple times
    debugLogState() {
        console.log('=== PROCESSOR STATE ===');
        console.log('Initialized:', this.isInitialized);
        console.log('Error count:', this.errorCount);
        console.log('Queue length:', this.processingQueue.length);
        console.log('=== END STATE ===');
    }

    validateItem(item) {
        // Delete this debugging line
        console.log('Validating item:', item);

        // PRACTICE: Delete 'Debug' from comment using dw
        // Debug: Check if item has required fields
        if (!item || typeof item !== 'object') {
            return false;
        }

        // Delete this redundant comment
        // Check for required properties
        const requiredFields = ['id', 'data'];

        for (const field of requiredFields) {
            if (!(field in item)) {
                // Delete debugging info using dt, then df)
                console.log('Missing field:', field, 'in item:', item.id);
                return false;
            }
        }

        return true; // Delete this comment: // Validation passed
    }

    transformItem(item) {
        // Delete these debugging lines one by one with dd:
        console.log('DEBUG: Starting transformation');
        console.log('DEBUG: Input item:', item);

        const transformed = {
            ...item,
            processedAt: new Date().toISOString(), // Delete this comment
            version: API_VERSION, /* Delete this comment */
            metadata: {
                ...item.metadata,
                processed: true // Delete this comment
            }
        };

        // Delete this entire debugging block:
        if (process.env.NODE_ENV === 'development') {
            console.log('DEBUG: Transformation complete');
            console.log('DEBUG: Output:', transformed);
        }

        return transformed;
    }

    // REDUNDANT: Delete this entire debugging utility method
    printDebugInfo(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[DEBUG ${timestamp}] ${message}`);
        if (data) {
            console.log('[DEBUG DATA]', data);
        }
    }
}

// Delete 'Debug' from class name using dw
const processor = new DataProcessor({
    enableDebugMode: true, // Delete this entire property line
    maxItems: 1000
});

// PRACTICE SECTION: Clean up this test data
const testDataWithDebugInfo = [
    { id: 1, data: 'test1', debugInfo: 'remove this property' }, // Delete debugInfo property
    { id: 2, data: 'test2', debugInfo: 'remove this too' }, // Delete debugInfo property
    { id: 3, data: 'test3' }, // This one is clean
    { id: 4, data: 'test4', debugInfo: 'delete me' } // Delete debugInfo property
];

// Delete this entire debugging function using dd multiple times:
function debugTestRun() {
    console.log('=== STARTING DEBUG TEST ===');

    try {
        const results = processor.processDebugData(testDataWithDebugInfo);
        console.log('DEBUG: Test completed successfully');
        console.log('DEBUG: Results:', results);
    } catch (error) {
        console.log('DEBUG: Test failed:', error.message);
    }

    console.log('=== DEBUG TEST COMPLETE ===');
}

// REDUNDANT COMMENTS: Remove all these inline comments
const config = {
    timeout: 5000, // Remove this comment
    retries: 3, /* Remove this comment */
    debug: true, // Remove this comment
    verbose: false /* Remove this comment */
};

// Delete this debugging section completely:
// ========================================
// DEBUG CONFIGURATION
// ========================================
// Enable this for debugging:
// config.debug = true;
// config.verbose = true;
// ========================================

// PRACTICE: Clean up this array by removing debug entries
const processingSteps = [
    'validate',
    'debug_step_1', // Delete this debug entry
    'transform',
    'debug_step_2', // Delete this debug entry
    'sanitize',
    'debug_final', // Delete this debug entry
    'output'
];

// Delete debugging utility functions completely:

function debugLog(message) {
    if (config.debug) {
        console.log(`[DEBUG] ${message}`);
    }
}

function debugError(error) {
    if (config.debug) {
        console.error(`[DEBUG ERROR] ${error.message}`);
    }
}

function debugTime(label, fn) {
    if (config.debug) {
        console.time(label);
        const result = fn();
        console.timeEnd(label);
        return result;
    }
    return fn();
}

// Clean up this export statement by removing debug exports:
module.exports = {
    DataProcessor,
    debugLog, // Delete this export
    debugError, // Delete this export
    debugTime, // Delete this export
    config
};

/**
 * DELETE OPERATIONS PRACTICE CHECKLIST:
 *
 * Character Deletion:
 * □ Used 'x' to delete characters under cursor
 * □ Used 'X' to delete characters before cursor
 *
 * Word Deletion:
 * □ Used 'dw' to delete words forward
 * □ Used 'db' to delete words backward
 *
 * Line Deletion:
 * □ Used 'dd' to delete entire lines
 * □ Used 'D' to delete to end of line
 *
 * Targeted Deletion:
 * □ Used 'dt{char}' to delete until character
 * □ Used 'df{char}' to delete including character
 * □ Used 'd$' to delete to end of line
 * □ Used 'd0' to delete to beginning of line
 *
 * CLEANUP GOALS:
 * 1. Remove all debug-related code and comments
 * 2. Delete redundant inline comments
 * 3. Clean up variable and method names
 * 4. Remove debugging console.log statements
 * 5. Delete unnecessary utility functions
 * 6. Clean up export statements
 */