/**
 * DAY 14: WEEK REVIEW - COMPREHENSIVE PRACTICE
 * =============================================
 *
 * LEARNING OBJECTIVES:
 * - Review and practice all skills from Days 1-13
 * - Combine multiple Vim/Neovim techniques in realistic scenarios
 * - Build muscle memory through comprehensive exercises
 * - Master keyboard-driven development workflow
 *
 * SKILLS REVIEW CHECKLIST:
 * □ Basic navigation (h,j,k,l)
 * □ Word motions (w,b,e)
 * □ Line operations (0,$,^,g_)
 * □ Basic editing (i,a,o,O)
 * □ Delete operations (x,dd,dw,d$)
 * □ Copy and paste (yy,yw,p,P)
 * □ Undo and redo (u,Ctrl-r,.)
 * □ Character search (f,F,t,T,;,comma)
 * □ Visual mode (v,V,Ctrl-v)
 * □ Change operations (c,cc,C,s,S)
 * □ Number operations (Ctrl-a,Ctrl-x)
 * □ File operations (:e,:split,:vsplit,buffers,tabs)
 *
 * EXERCISE INSTRUCTIONS:
 * This file contains a comprehensive JavaScript project that requires
 * all the skills learned in the previous days. Work through each section
 * systematically, using the appropriate Vim commands for each task.
 */

// =============================================================================
// SECTION 1: BASIC NAVIGATION AND EDITING
// Practice: h,j,k,l navigation and basic editing commands
// =============================================================================

/**
 * E-COMMERCE APPLICATION
 * ======================
 *
 * This is a complete e-commerce application that you'll edit using all
 * the Vim skills learned this week. Start by navigating through the code
 * structure using hjkl keys.
 */

// PRACTICE: Use 'w' and 'b' to navigate between words in this comment block
// PRACTICE: Use 'f{' to jump to opening braces, 'f;' to jump to semicolons

class ECommerceApp {
    constructor() {
        // PRACTICE: Use 'i' to insert, add your name as a comment here
        this.products = new Map();
        this.users = new Map();
        this.orders = new Map();
        this.cart = new Map();
        this.categories = new Set();
        this.config = {};

        // PRACTICE: Use 'A' to append at end of line, add initialization timestamp
        this.initialized = false;
    }

    // PRACTICE: Use 'o' to create new line below, add a comment about this method
    async initialize() {
        try {
            // PRACTICE: Use visual mode 'V' to select this entire try block
            await this.loadConfiguration();
            await this.setupDatabase();
            await this.loadInitialData();
            await this.startServices();

            this.initialized = true;
            console.log('E-commerce application initialized successfully');

            return true;
        } catch (error) {
            // PRACTICE: Use 'cc' to change this entire line to a more descriptive error message
            console.error('Initialization failed:', error);
            throw error;
        }
    }

    // PRACTICE: Use 'dd' to delete lines, then 'u' to undo, then 'Ctrl-r' to redo
    async loadConfiguration() {
        // PRACTICE: Change these configuration values using 'cw' (change word)
        this.config = {
            version: '1.0.0',           // PRACTICE: Increment with Ctrl-a
            maxCartItems: 10,           // PRACTICE: Change to 15 using Ctrl-a
            sessionTimeout: 3600,       // PRACTICE: Change to 7200
            enableAnalytics: true,      // PRACTICE: Change to false using 'cw'
            paymentMethods: ['credit', 'debit', 'paypal'],
            shippingOptions: ['standard', 'express', 'overnight'],

            // PRACTICE: Use 'ci{' to change inside these braces
            database: {
                host: 'localhost',
                port: 5432,
                name: 'ecommerce_db'
            },

            // PRACTICE: Use 'vi"' to select inside quotes, then 'c' to change
            api: {
                baseUrl: 'https://api.example.com',
                timeout: 5000,
                retries: 3
            }
        };
    }

    // =============================================================================
    // SECTION 2: CHARACTER SEARCH AND VISUAL MODE
    // Practice: f,F,t,T commands and visual selection
    // =============================================================================

    async setupDatabase() {
        // PRACTICE: Use 'f(' to jump between function calls
        const connection = await this.connectToDatabase();
        const tables = await this.createTables();
        const indices = await this.createIndices();

        // PRACTICE: Use 't,' to jump till commas in this array
        const requiredTables = ['users', 'products', 'orders', 'categories', 'reviews'];

        // PRACTICE: Select this entire for loop with visual mode 'V' + movement
        for (const table of requiredTables) {
            const exists = await this.checkTableExists(table);
            if (!exists) {
                // PRACTICE: Use 'f}' to jump to the closing brace
                throw new Error(`Required table ${table} does not exist`);
            }
        }

        console.log('Database setup completed');
        return true;
    }

    // PRACTICE: Use character search to navigate this method efficiently
    async loadInitialData() {
        // PRACTICE: Use 'f:' to jump between property definitions
        const sampleProducts = [
            {
                id: 1, name: 'Laptop', price: 999.99, category: 'Electronics',
                description: 'High-performance laptop for work and gaming',
                stock: 25, rating: 4.5, reviews: 128
            },
            {
                id: 2, name: 'Mouse', price: 29.99, category: 'Electronics',
                description: 'Wireless optical mouse with ergonomic design',
                stock: 100, rating: 4.2, reviews: 89
            },
            {
                id: 3, name: 'Keyboard', price: 89.99, category: 'Electronics',
                description: 'Mechanical keyboard with RGB backlighting',
                stock: 50, rating: 4.7, reviews: 156
            }
        ];

        // PRACTICE: Use visual block mode 'Ctrl-v' to select the id column
        // PRACTICE: Use 'g Ctrl-a' to increment IDs sequentially

        for (const product of sampleProducts) {
            // PRACTICE: Use 'vi(' to select function parameters
            await this.addProduct(product);
        }

        // PRACTICE: Use ';' to repeat the last f/F/t/T search
        this.categories.add('Electronics');
        this.categories.add('Clothing');
        this.categories.add('Books');
        this.categories.add('Home');
    }

    // =============================================================================
    // SECTION 3: CHANGE OPERATIONS AND TEXT OBJECTS
    // Practice: c, cc, C, s, S commands with text objects
    // =============================================================================

    // PRACTICE: Use 'ciw' to change individual words in method names
    async addProductToInventory(productData) {
        // PRACTICE: Change variable names using 'caw' (change around word)
        const productId = productData.id;
        const productName = productData.name;
        const productPrice = productData.price;
        const productStock = productData.stock;

        // PRACTICE: Use 'ci"' to change text inside quotes
        if (!productName || productName === '') {
            throw new Error('Product name is required');
        }

        // PRACTICE: Use 'ci(' to change function parameters
        if (this.validatePrice(productPrice) === false) {
            throw new Error('Invalid product price');
        }

        // PRACTICE: Use 'ct;' to change until semicolon
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            stock: productStock,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // PRACTICE: Use 'ca{' to change around the entire object
        this.products.set(productId, product);

        return product;
    }

    // PRACTICE: Use 'S' to substitute entire lines, then rebuild the method
    validateProductData(data) {
        const errors = [];

        // PRACTICE: Use 'cc' to change these validation lines
        if (!data.name) errors.push('Name is required');
        if (!data.price) errors.push('Price is required');
        if (!data.category) errors.push('Category is required');

        // PRACTICE: Change these conditions using 'cf)' (change find parenthesis)
        if (data.price <= 0) errors.push('Price must be positive');
        if (data.stock < 0) errors.push('Stock cannot be negative');

        return errors.length === 0 ? null : errors;
    }

    // =============================================================================
    // SECTION 4: NUMBER OPERATIONS AND ARRAY MANIPULATION
    // Practice: Ctrl-a, Ctrl-x and array index operations
    // =============================================================================

    updateProductStock(productId, quantity) {
        const product = this.products.get(productId);

        if (!product) {
            return null;
        }

        // PRACTICE: Use Ctrl-a and Ctrl-x to adjust these quantities
        const currentStock = product.stock;     // Try: 5Ctrl-a to increase by 5
        const newStock = currentStock + quantity;

        // PRACTICE: Increment/decrement these thresholds
        const lowStockThreshold = 10;           // Try: Ctrl-a to increase
        const highStockThreshold = 100;         // Try: 10Ctrl-a to increase by 10

        product.stock = Math.max(0, newStock);
        product.updatedAt = new Date();

        // PRACTICE: Use visual mode to select array indices and g Ctrl-a for sequential
        const stockLevels = [5, 5, 5, 5, 5];   // Make these: [5, 6, 7, 8, 9]

        // PRACTICE: Adjust these percentage values
        if (product.stock <= lowStockThreshold) {
            product.status = 'low_stock';
            this.sendLowStockAlert(productId, 25);    // 25% threshold
        } else if (product.stock >= highStockThreshold) {
            product.status = 'high_stock';
            this.sendRestockAlert(productId, 90);     // 90% threshold
        }

        return product;
    }

    // PRACTICE: Use number operations on array indices and values
    getProductsByCategory(categoryName, page = 1, limit = 20) {
        // PRACTICE: Change these pagination parameters using Ctrl-a/Ctrl-x
        const offset = (page - 1) * limit;     // Try: increment page number
        const products = Array.from(this.products.values());

        // PRACTICE: Use visual mode to select array indices [0] and [1]
        const filtered = products
            .filter(product => product.category === categoryName)
            .slice(offset, offset + limit);

        // PRACTICE: Adjust these array indices using Ctrl-a
        return {
            products: filtered,
            pagination: {
                page: page,                     // Try: Ctrl-a
                limit: limit,                   // Try: 5Ctrl-a
                total: filtered.length,
                hasNext: (page * limit) < products.length,
                hasPrev: page > 1
            }
        };
    }

    // =============================================================================
    // SECTION 5: COMPLEX EDITING WITH MULTIPLE TECHNIQUES
    // Practice: Combining all skills learned
    // =============================================================================

    // PRACTICE: This method needs major refactoring - use all your skills!
    async processOrder(userId, cartItems, shippingInfo, paymentInfo) {
        // PRACTICE: Use 'dd' to delete lines, 'yy' to copy, 'p' to paste
        const user = this.users.get(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // PRACTICE: Use visual mode to select and reorganize this validation block
        if (!cartItems || cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
            throw new Error('Incomplete shipping information');
        }

        if (!paymentInfo.method || !paymentInfo.details) {
            throw new Error('Payment information required');
        }

        // PRACTICE: Use '.' (dot) to repeat operations on similar lines
        const orderItems = [];
        let totalAmount = 0.00;     // PRACTICE: Use Ctrl-x to make this 0
        let totalTax = 0.00;        // PRACTICE: Repeat with '.'
        let shippingCost = 5.99;    // PRACTICE: Change to 7.99 using change operations

        // PRACTICE: Use character search to navigate this loop efficiently
        for (const item of cartItems) {
            const product = this.products.get(item.productId);

            if (!product) {
                // PRACTICE: Use 'ci"' to change the error message
                throw new Error(`Product ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                // PRACTICE: Use template literal - change to `Insufficient stock for ${product.name}`
                throw new Error('Insufficient stock for ' + product.name);
            }

            // PRACTICE: Use visual mode to select this calculation block
            const itemTotal = product.price * item.quantity;
            const itemTax = itemTotal * 0.08;    // PRACTICE: Change tax rate to 0.10

            orderItems.push({
                productId: item.productId,
                productName: product.name,
                price: product.price,
                quantity: item.quantity,
                subtotal: itemTotal,
                tax: itemTax
            });

            // PRACTICE: Use Ctrl-a to increment these calculations
            totalAmount += itemTotal;
            totalTax += itemTax;

            // PRACTICE: Update stock using number operations
            product.stock -= item.quantity;     // Use visual mode to select this operation
        }

        // PRACTICE: Use change operations to modify this order object structure
        const order = {
            id: this.generateOrderId(),          // PRACTICE: Create this method
            userId: userId,
            items: orderItems,
            subtotal: totalAmount.toFixed(2),    // PRACTICE: Change precision to 3 decimals
            tax: totalTax.toFixed(2),
            shipping: shippingCost.toFixed(2),
            total: (totalAmount + totalTax + shippingCost).toFixed(2),
            status: 'pending',                   // PRACTICE: Change to 'confirmed'
            createdAt: new Date(),
            shippingInfo: shippingInfo,
            paymentInfo: {
                method: paymentInfo.method,
                // PRACTICE: Remove sensitive payment details
                last4: paymentInfo.details.number.slice(-4)
            }
        };

        // PRACTICE: Use visual mode to select and reorganize this save block
        this.orders.set(order.id, order);
        await this.processPayment(order);
        await this.updateInventory(order);
        await this.sendOrderConfirmation(order);

        return order;
    }

    // =============================================================================
    // SECTION 6: FILE OPERATIONS AND MULTI-FILE EDITING
    // Practice: Working with multiple files (to be created)
    // =============================================================================

    // PRACTICE: Create these files using :e filename
    // :e userService.js - Move user-related methods here
    // :e productService.js - Move product-related methods here
    // :e orderService.js - Move order processing methods here
    // :e config.json - Move configuration to separate file

    async generateReports() {
        // PRACTICE: Use :split to open multiple files while editing this method

        // PRACTICE: Create analytics.js with :e analytics.js
        const salesReport = await this.generateSalesReport();

        // PRACTICE: Create reporting.js with :tabnew reporting.js
        const inventoryReport = await this.generateInventoryReport();

        // PRACTICE: Create exports.js with :vsplit exports.js
        const userReport = await this.generateUserReport();

        // PRACTICE: Use :wa to save all files before generating final report
        return {
            sales: salesReport,
            inventory: inventoryReport,
            users: userReport,
            generatedAt: new Date()
        };
    }

    // PRACTICE: Use undo/redo to experiment with different implementations
    calculateShippingCost(items, shippingMethod, destination) {
        // PRACTICE: Make intentional mistakes, then use 'u' to undo
        let baseCost = 5.99;        // PRACTICE: Change with Ctrl-a, undo with 'u'
        let weightMultiplier = 1.5; // PRACTICE: Change, then redo with 'Ctrl-r'

        // PRACTICE: Use '.' to repeat similar operations
        if (shippingMethod === 'express') {
            baseCost *= 2;          // PRACTICE: Change this calculation
        } else if (shippingMethod === 'overnight') {
            baseCost *= 3;          // PRACTICE: Use '.' to repeat similar change
        }

        // PRACTICE: Use visual mode to select and modify this calculation
        const totalWeight = items.reduce((sum, item) => {
            const product = this.products.get(item.productId);
            return sum + (product.weight || 1) * item.quantity;
        }, 0);

        return Math.max(baseCost, totalWeight * weightMultiplier);
    }

    // =============================================================================
    // SECTION 7: COMPREHENSIVE PRACTICE CHALLENGES
    // Use ALL skills learned in creative combinations
    // =============================================================================

    // CHALLENGE 1: Navigation and Editing Combination
    // Practice: Use word motions, character search, and editing together
    async searchProducts(query, filters = {}) {
        // PRACTICE: Navigate this method using only keyboard commands
        // Use 'w', 'b', 'f', 't' for navigation, then edit efficiently

        const searchTerms = query.toLowerCase().split(' ');
        let results = Array.from(this.products.values());

        // PRACTICE: Use visual block mode to select and modify filter conditions
        if (filters.category) {
            results = results.filter(p => p.category === filters.category);
        }

        if (filters.minPrice) {
            results = results.filter(p => p.price >= filters.minPrice);
        }

        if (filters.maxPrice) {
            results = results.filter(p => p.price <= filters.maxPrice);
        }

        // PRACTICE: Use change operations to modify this search logic
        results = results.filter(product => {
            const searchableText = `${product.name} ${product.description}`.toLowerCase();
            return searchTerms.every(term => searchableText.includes(term));
        });

        // PRACTICE: Use number operations on these ranking values
        return results
            .map(product => ({
                ...product,
                relevanceScore: this.calculateRelevance(product, searchTerms),
                rank: 0  // PRACTICE: Implement ranking system
            }))
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, 50);  // PRACTICE: Change limit using Ctrl-a
    }

    // CHALLENGE 2: Complex Refactoring Exercise
    // PRACTICE: Refactor this method using all Vim skills
    // Original method has many issues - fix them efficiently!
    validateAndProcessPayment(paymentData) {
        // PRACTICE: This method needs complete restructuring
        // Use visual mode, change operations, and copy/paste creatively

        // BAD CODE - Fix using change operations
        var cardNumber = paymentData.cardNumber;
        var expiryDate = paymentData.expiry;
        var cvv = paymentData.cvv;
        var amount = paymentData.amount;

        // PRACTICE: Change var to const, fix naming
        // Use 'cw' for each variable, '.' to repeat

        // PRACTICE: Use visual mode to select and reorganize validation
        if (cardNumber.length != 16) return false;
        if (expiryDate.length != 5) return false;
        if (cvv.length != 3) return false;
        if (amount <= 0) return false;

        // PRACTICE: Convert to modern JavaScript
        // Change this callback pattern to async/await
        this.paymentProcessor.charge(cardNumber, amount, function(error, result) {
            if (error) {
                console.log('Payment failed: ' + error);
                return false;
            } else {
                console.log('Payment successful: ' + result.transactionId);
                return true;
            }
        });
    }

    // CHALLENGE 3: Multi-file Workflow
    // PRACTICE: Break this large method into multiple files
    generateCompleteReport() {
        // PRACTICE: Create separate files for each section
        // Use :e, :split, :tabnew to manage multiple files

        // Sales analytics - move to analytics/sales.js
        const salesData = this.calculateSalesMetrics();

        // User analytics - move to analytics/users.js
        const userData = this.calculateUserMetrics();

        // Product analytics - move to analytics/products.js
        const productData = this.calculateProductMetrics();

        // PRACTICE: Use :wa to save all files, then test integration
        return this.combineReports(salesData, userData, productData);
    }
}

// =============================================================================
// FINAL PRACTICE EXERCISES
// =============================================================================

/**
 * COMPREHENSIVE PRACTICE ROUTINE
 * ==============================
 *
 * Complete these exercises in order, using ONLY keyboard commands:
 *
 * 1. NAVIGATION MASTERY (5 minutes)
 *    - Navigate through the entire file using hjkl
 *    - Use w, b, e to move between words efficiently
 *    - Use f, F, t, T to jump to specific characters
 *    - Practice ; and , to repeat searches
 *
 * 2. EDITING COMBINATIONS (10 minutes)
 *    - Use o/O to add new methods and comments
 *    - Use i/a/A to insert in different positions
 *    - Use c commands with text objects (ciw, ci", ca{)
 *    - Use visual mode to select and manipulate code blocks
 *
 * 3. REFACTORING CHALLENGE (15 minutes)
 *    - Fix all the "BAD CODE" comments using change operations
 *    - Convert old JavaScript patterns to modern ES6+
 *    - Use copy/paste to reorganize code structure
 *    - Use undo/redo to experiment with different approaches
 *
 * 4. NUMBER OPERATIONS (5 minutes)
 *    - Adjust all numeric values using Ctrl-a/Ctrl-x
 *    - Practice sequential numbering with visual mode + g Ctrl-a
 *    - Update array indices and configuration values
 *
 * 5. FILE OPERATIONS (10 minutes)
 *    - Create the suggested separate files
 *    - Practice split windows and tab management
 *    - Move code between files using copy/paste
 *    - Save multiple files and test integration
 *
 * 6. SPEED BUILDING (10 minutes)
 *    - Repeat common operations to build muscle memory
 *    - Practice command combinations without thinking
 *    - Time yourself on specific editing tasks
 *    - Focus on eliminating mouse usage completely
 *
 * MASTERY INDICATORS:
 * □ Can navigate entire file without arrow keys or mouse
 * □ Can edit code efficiently using text objects
 * □ Can refactor code structure using visual mode
 * □ Can work with multiple files seamlessly
 * □ Can undo/redo complex editing sequences
 * □ Can use number operations for quick adjustments
 * □ Can perform all operations from memory
 *
 * GRADUATION CRITERIA:
 * Complete all exercises above in under 45 minutes total,
 * using ONLY Vim keyboard commands. No mouse, no arrow keys!
 */

// Export the class for use in other files
// PRACTICE: Create test files and import this class
export default ECommerceApp;

// PRACTICE: Create package.json with :e package.json
// PRACTICE: Create tests with :e test/ecommerce.test.js
// PRACTICE: Create documentation with :e docs/api.md

/**
 * BONUS CHALLENGES:
 *
 * 1. Create a complete file structure for this application
 * 2. Implement all the referenced but missing methods
 * 3. Add proper error handling throughout
 * 4. Create comprehensive test files
 * 5. Add JSDoc comments to all methods
 * 6. Refactor into proper module structure
 *
 * Remember: Use ONLY Vim commands. The goal is to become
 * completely comfortable with keyboard-driven development!
 */