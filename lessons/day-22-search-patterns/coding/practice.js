// Day 22: Search Patterns Practice - /, ?, *, #, n, N
// Practice searching for patterns with forward search (/), backward search (?),
// word search (*, #), and navigation (n, N)
// This file contains searchable patterns, variable names, and repeated elements

/**
 * Data Processing and Analysis Engine
 * Contains many searchable patterns, variable names, and repeated structures
 * Perfect for practicing search commands and pattern matching
 */

// Configuration constants with searchable patterns
const API_ENDPOINTS = {
    USER_SERVICE: 'https://api.example.com/users',
    PRODUCT_SERVICE: 'https://api.example.com/products',
    ORDER_SERVICE: 'https://api.example.com/orders',
    PAYMENT_SERVICE: 'https://api.example.com/payments',
    NOTIFICATION_SERVICE: 'https://api.example.com/notifications',
    ANALYTICS_SERVICE: 'https://api.example.com/analytics',
    INVENTORY_SERVICE: 'https://api.example.com/inventory',
    SHIPPING_SERVICE: 'https://api.example.com/shipping'
};

const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
    NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    NETWORK_ERROR: 'NETWORK_ERROR'
};

const STATUS_CODES = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
};

// Data validation patterns and regular expressions
const VALIDATION_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    postalCode: /^[0-9]{5}(-[0-9]{4})?$/,
    creditCard: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$/,
    ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    url: /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/
};

// User data processing functions with searchable variable names
function validateUserData(userData) {
    const errors = [];

    // Validate user email address
    if (!userData.userEmail || !VALIDATION_PATTERNS.email.test(userData.userEmail)) {
        errors.push('Invalid user email format');
    }

    // Validate user phone number
    if (!userData.userPhone || !VALIDATION_PATTERNS.phone.test(userData.userPhone)) {
        errors.push('Invalid user phone format');
    }

    // Validate user password strength
    if (!userData.userPassword || !VALIDATION_PATTERNS.password.test(userData.userPassword)) {
        errors.push('User password does not meet security requirements');
    }

    // Validate user username format
    if (!userData.userName || !VALIDATION_PATTERNS.username.test(userData.userName)) {
        errors.push('Invalid user name format');
    }

    return errors;
}

function processUserRegistration(userRegistrationData) {
    const validationErrors = validateUserData(userRegistrationData);

    if (validationErrors.length > 0) {
        throw new Error(`User registration validation failed: ${validationErrors.join(', ')}`);
    }

    const newUser = {
        userId: generateUserId(),
        userEmail: userRegistrationData.userEmail,
        userPhone: userRegistrationData.userPhone,
        userName: userRegistrationData.userName,
        userStatus: 'ACTIVE',
        userCreatedAt: new Date(),
        userLastLogin: null,
        userPreferences: {
            userNotifications: true,
            userTheme: 'light',
            userLanguage: 'en'
        }
    };

    return newUser;
}

function updateUserProfile(userId, userUpdateData) {
    const existingUser = getUserById(userId);
    if (!existingUser) {
        throw new Error(`User not found: ${userId}`);
    }

    const updatedUser = {
        ...existingUser,
        ...userUpdateData,
        userUpdatedAt: new Date()
    };

    return updatedUser;
}

// Product management functions with repeated patterns
function createProduct(productData) {
    const productId = generateProductId();
    const productName = productData.productName;
    const productPrice = parseFloat(productData.productPrice);
    const productCategory = productData.productCategory;
    const productDescription = productData.productDescription;
    const productSku = productData.productSku;
    const productStock = parseInt(productData.productStock);

    const newProduct = {
        productId,
        productName,
        productPrice,
        productCategory,
        productDescription,
        productSku,
        productStock,
        productStatus: 'ACTIVE',
        productCreatedAt: new Date(),
        productUpdatedAt: new Date(),
        productRating: 0,
        productReviews: [],
        productImages: [],
        productAttributes: {}
    };

    return newProduct;
}

function updateProductStock(productId, newStock) {
    const product = getProductById(productId);
    if (!product) {
        throw new Error(`Product not found: ${productId}`);
    }

    product.productStock = newStock;
    product.productUpdatedAt = new Date();

    if (newStock <= 0) {
        product.productStatus = 'OUT_OF_STOCK';
    } else if (newStock < 10) {
        product.productStatus = 'LOW_STOCK';
    } else {
        product.productStatus = 'ACTIVE';
    }

    return product;
}

function searchProducts(searchQuery, searchFilters = {}) {
    const products = getAllProducts();
    let filteredProducts = products;

    // Search by product name
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(product =>
            product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.productDescription.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // Filter by product category
    if (searchFilters.productCategory) {
        filteredProducts = filteredProducts.filter(product =>
            product.productCategory === searchFilters.productCategory
        );
    }

    // Filter by product price range
    if (searchFilters.minPrice) {
        filteredProducts = filteredProducts.filter(product =>
            product.productPrice >= searchFilters.minPrice
        );
    }

    if (searchFilters.maxPrice) {
        filteredProducts = filteredProducts.filter(product =>
            product.productPrice <= searchFilters.maxPrice
        );
    }

    // Filter by product stock status
    if (searchFilters.inStock) {
        filteredProducts = filteredProducts.filter(product =>
            product.productStock > 0
        );
    }

    return filteredProducts;
}

// Order processing functions with searchable patterns
function createOrder(orderData) {
    const orderId = generateOrderId();
    const orderUserId = orderData.userId;
    const orderItems = orderData.items;
    const orderShippingAddress = orderData.shippingAddress;
    const orderBillingAddress = orderData.billingAddress;
    const orderPaymentMethod = orderData.paymentMethod;

    const orderSubtotal = calculateOrderSubtotal(orderItems);
    const orderTax = calculateOrderTax(orderSubtotal);
    const orderShipping = calculateOrderShipping(orderItems);
    const orderTotal = orderSubtotal + orderTax + orderShipping;

    const newOrder = {
        orderId,
        orderUserId,
        orderItems,
        orderSubtotal,
        orderTax,
        orderShipping,
        orderTotal,
        orderStatus: 'PENDING',
        orderCreatedAt: new Date(),
        orderUpdatedAt: new Date(),
        orderShippingAddress,
        orderBillingAddress,
        orderPaymentMethod,
        orderTrackingNumber: null,
        orderNotes: ''
    };

    return newOrder;
}

function updateOrderStatus(orderId, newStatus) {
    const order = getOrderById(orderId);
    if (!order) {
        throw new Error(`Order not found: ${orderId}`);
    }

    order.orderStatus = newStatus;
    order.orderUpdatedAt = new Date();

    // Generate tracking number for shipped orders
    if (newStatus === 'SHIPPED' && !order.orderTrackingNumber) {
        order.orderTrackingNumber = generateTrackingNumber();
    }

    return order;
}

function searchOrders(searchCriteria) {
    const orders = getAllOrders();
    let filteredOrders = orders;

    // Search by order ID
    if (searchCriteria.orderId) {
        filteredOrders = filteredOrders.filter(order =>
            order.orderId.includes(searchCriteria.orderId)
        );
    }

    // Search by user ID
    if (searchCriteria.userId) {
        filteredOrders = filteredOrders.filter(order =>
            order.orderUserId === searchCriteria.userId
        );
    }

    // Search by order status
    if (searchCriteria.orderStatus) {
        filteredOrders = filteredOrders.filter(order =>
            order.orderStatus === searchCriteria.orderStatus
        );
    }

    // Search by date range
    if (searchCriteria.startDate) {
        filteredOrders = filteredOrders.filter(order =>
            order.orderCreatedAt >= new Date(searchCriteria.startDate)
        );
    }

    if (searchCriteria.endDate) {
        filteredOrders = filteredOrders.filter(order =>
            order.orderCreatedAt <= new Date(searchCriteria.endDate)
        );
    }

    return filteredOrders;
}

// Analytics and reporting functions with repeated variable names
function generateUserReport(reportStartDate, reportEndDate) {
    const reportData = {
        reportId: generateReportId(),
        reportType: 'USER_ANALYTICS',
        reportStartDate,
        reportEndDate,
        reportGeneratedAt: new Date(),
        reportData: {
            totalUsers: 0,
            newUsers: 0,
            activeUsers: 0,
            deletedUsers: 0,
            userGrowthRate: 0,
            userRetentionRate: 0,
            averageUserAge: 0,
            userGeographicDistribution: {},
            userEngagementMetrics: {}
        }
    };

    return reportData;
}

function generateProductReport(reportStartDate, reportEndDate) {
    const reportData = {
        reportId: generateReportId(),
        reportType: 'PRODUCT_ANALYTICS',
        reportStartDate,
        reportEndDate,
        reportGeneratedAt: new Date(),
        reportData: {
            totalProducts: 0,
            newProducts: 0,
            outOfStockProducts: 0,
            lowStockProducts: 0,
            topSellingProducts: [],
            productCategoryDistribution: {},
            averageProductPrice: 0,
            productRatingDistribution: {},
            productPerformanceMetrics: {}
        }
    };

    return reportData;
}

function generateOrderReport(reportStartDate, reportEndDate) {
    const reportData = {
        reportId: generateReportId(),
        reportType: 'ORDER_ANALYTICS',
        reportStartDate,
        reportEndDate,
        reportGeneratedAt: new Date(),
        reportData: {
            totalOrders: 0,
            completedOrders: 0,
            cancelledOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
            averageOrderValue: 0,
            orderStatusDistribution: {},
            orderPaymentMethodDistribution: {},
            orderShippingMethodDistribution: {},
            peakOrderTimes: {},
            orderConversionRate: 0
        }
    };

    return reportData;
}

// Error handling functions with searchable error patterns
function handleValidationError(validationError) {
    const errorResponse = {
        errorCode: ERROR_CODES.VALIDATION_ERROR,
        errorMessage: 'Validation failed',
        errorDetails: validationError.details,
        errorTimestamp: new Date(),
        errorId: generateErrorId()
    };

    logError(errorResponse);
    return errorResponse;
}

function handleAuthenticationError(authError) {
    const errorResponse = {
        errorCode: ERROR_CODES.AUTHENTICATION_ERROR,
        errorMessage: 'Authentication failed',
        errorDetails: authError.message,
        errorTimestamp: new Date(),
        errorId: generateErrorId()
    };

    logError(errorResponse);
    return errorResponse;
}

function handleDatabaseError(dbError) {
    const errorResponse = {
        errorCode: ERROR_CODES.DATABASE_ERROR,
        errorMessage: 'Database operation failed',
        errorDetails: dbError.message,
        errorTimestamp: new Date(),
        errorId: generateErrorId()
    };

    logError(errorResponse);
    return errorResponse;
}

function handleNetworkError(networkError) {
    const errorResponse = {
        errorCode: ERROR_CODES.NETWORK_ERROR,
        errorMessage: 'Network request failed',
        errorDetails: networkError.message,
        errorTimestamp: new Date(),
        errorId: generateErrorId()
    };

    logError(errorResponse);
    return errorResponse;
}

// Utility functions with searchable names
function generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateProductId() {
    return `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateOrderId() {
    return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateReportId() {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateTrackingNumber() {
    return `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
}

// Helper functions for data retrieval (placeholder implementations)
function getUserById(userId) { /* Implementation */ }
function getProductById(productId) { /* Implementation */ }
function getOrderById(orderId) { /* Implementation */ }
function getAllProducts() { /* Implementation */ }
function getAllOrders() { /* Implementation */ }
function calculateOrderSubtotal(items) { /* Implementation */ }
function calculateOrderTax(subtotal) { /* Implementation */ }
function calculateOrderShipping(items) { /* Implementation */ }
function logError(error) { /* Implementation */ }

// Export all functions for use in other modules
export {
    API_ENDPOINTS,
    ERROR_CODES,
    STATUS_CODES,
    VALIDATION_PATTERNS,
    validateUserData,
    processUserRegistration,
    updateUserProfile,
    createProduct,
    updateProductStock,
    searchProducts,
    createOrder,
    updateOrderStatus,
    searchOrders,
    generateUserReport,
    generateProductReport,
    generateOrderReport,
    handleValidationError,
    handleAuthenticationError,
    handleDatabaseError,
    handleNetworkError
};