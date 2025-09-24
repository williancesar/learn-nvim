// Day 15: Paragraph Motion Practice - { and } navigation
// Practice navigating between paragraph boundaries using { and } motions
// Each logical code block is separated by blank lines for clear paragraph boundaries

/**
 * E-commerce Shopping Cart System
 * This module provides functionality for managing shopping carts
 */

// Configuration and constants
const TAX_RATE = 0.08;
const SHIPPING_THRESHOLD = 50;
const FREE_SHIPPING_AMOUNT = 0;
const STANDARD_SHIPPING = 5.99;


// Product data structure and validation
class Product {
    constructor(id, name, price, category, inStock = true) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.inStock = inStock;
        this.addedAt = new Date();
    }

    validate() {
        if (!this.id || !this.name || this.price < 0) {
            throw new Error('Invalid product data');
        }
        return true;
    }
}


// Shopping cart implementation
class ShoppingCart {
    constructor(userId) {
        this.userId = userId;
        this.items = new Map();
        this.discounts = [];
        this.createdAt = new Date();
    }

    addItem(product, quantity = 1) {
        if (!product.inStock) {
            throw new Error('Product is out of stock');
        }

        const existingItem = this.items.get(product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.lastUpdated = new Date();
        } else {
            this.items.set(product.id, {
                product,
                quantity,
                addedAt: new Date(),
                lastUpdated: new Date()
            });
        }
    }

    removeItem(productId) {
        return this.items.delete(productId);
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.get(productId);
        if (!item) {
            throw new Error('Item not found in cart');
        }

        if (newQuantity <= 0) {
            this.removeItem(productId);
        } else {
            item.quantity = newQuantity;
            item.lastUpdated = new Date();
        }
    }
}


// Price calculation utilities
function calculateSubtotal(cartItems) {
    let subtotal = 0;

    for (const item of cartItems.values()) {
        subtotal += item.product.price * item.quantity;
    }

    return Number(subtotal.toFixed(2));
}

function calculateTax(subtotal) {
    return Number((subtotal * TAX_RATE).toFixed(2));
}

function calculateShipping(subtotal) {
    if (subtotal >= SHIPPING_THRESHOLD) {
        return FREE_SHIPPING_AMOUNT;
    }
    return STANDARD_SHIPPING;
}


// Discount system
class DiscountManager {
    constructor() {
        this.availableDiscounts = new Map();
        this.initializeDiscounts();
    }

    initializeDiscounts() {
        this.availableDiscounts.set('WELCOME10', {
            type: 'percentage',
            value: 0.10,
            minAmount: 25,
            description: 'Welcome 10% off'
        });

        this.availableDiscounts.set('SAVE5', {
            type: 'fixed',
            value: 5.00,
            minAmount: 30,
            description: '$5 off orders over $30'
        });
    }

    applyDiscount(code, subtotal) {
        const discount = this.availableDiscounts.get(code);
        if (!discount) {
            throw new Error('Invalid discount code');
        }

        if (subtotal < discount.minAmount) {
            throw new Error('Order does not meet minimum amount');
        }

        let discountAmount = 0;
        if (discount.type === 'percentage') {
            discountAmount = subtotal * discount.value;
        } else if (discount.type === 'fixed') {
            discountAmount = Math.min(discount.value, subtotal);
        }

        return Number(discountAmount.toFixed(2));
    }
}


// Order processing and checkout
class OrderProcessor {
    constructor() {
        this.discountManager = new DiscountManager();
        this.orders = new Map();
    }

    processOrder(cart, discountCodes = []) {
        const subtotal = calculateSubtotal(cart.items);
        const shipping = calculateShipping(subtotal);

        let totalDiscounts = 0;
        const appliedDiscounts = [];

        for (const code of discountCodes) {
            try {
                const discountAmount = this.discountManager.applyDiscount(code, subtotal);
                totalDiscounts += discountAmount;
                appliedDiscounts.push({ code, amount: discountAmount });
            } catch (error) {
                console.warn(`Failed to apply discount ${code}: ${error.message}`);
            }
        }

        const discountedSubtotal = Math.max(0, subtotal - totalDiscounts);
        const tax = calculateTax(discountedSubtotal);
        const total = discountedSubtotal + tax + shipping;

        return {
            subtotal,
            discounts: appliedDiscounts,
            totalDiscounts,
            discountedSubtotal,
            tax,
            shipping,
            total: Number(total.toFixed(2))
        };
    }

    createOrder(cart, paymentInfo, shippingAddress) {
        const orderSummary = this.processOrder(cart);

        const order = {
            id: generateOrderId(),
            userId: cart.userId,
            items: Array.from(cart.items.values()),
            summary: orderSummary,
            paymentInfo,
            shippingAddress,
            status: 'pending',
            createdAt: new Date()
        };

        this.orders.set(order.id, order);
        return order;
    }
}


// Utility functions
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// Export modules for use in other files
export {
    Product,
    ShoppingCart,
    DiscountManager,
    OrderProcessor,
    calculateSubtotal,
    calculateTax,
    calculateShipping,
    formatCurrency,
    validateEmail
};