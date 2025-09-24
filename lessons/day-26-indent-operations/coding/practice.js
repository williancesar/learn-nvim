// Day 26: Indent Operations Practice - >>, <<, =, >, <
// Practice fixing poorly indented code using indent commands
// This file has intentionally poor indentation for practice

/**
* Poorly Indented JavaScript Code for Practice
* Use >>, <<, = commands to fix indentation
* Practice with visual mode selection and motion-based indenting
*/

// Configuration object with poor indentation
const API_CONFIG = {
host: 'localhost',
port: 3000,
database: {
name: 'myapp',
user: 'admin',
password: 'secret',
host: 'db-server',
port: 5432,
ssl: {
enabled: true,
cert: '/path/to/cert.pem',
key: '/path/to/key.pem'
}
},
redis: {
host: 'redis-server',
port: 6379,
password: 'redis-pass',
options: {
retryDelayOnFailover: 100,
enableReadyCheck: false,
maxRetriesPerRequest: null
}
},
email: {
service: 'gmail',
auth: {
user: 'noreply@example.com',
pass: 'email_password'
},
templates: {
welcome: './templates/welcome.html',
reset: './templates/password-reset.html',
notification: './templates/notification.html'
}
}
};

// Class definition with incorrect indentation
class UserManager {
constructor(database, cache) {
this.db = database;
this.cache = cache;
this.users = new Map();
this.sessionStore = new Map();
}

async createUser(userData) {
try {
const validation = this.validateUserData(userData);
if (!validation.isValid) {
throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
}

const hashedPassword = await this.hashPassword(userData.password);
const user = {
id: this.generateUserId(),
email: userData.email,
password: hashedPassword,
firstName: userData.firstName,
lastName: userData.lastName,
role: userData.role || 'user',
isActive: true,
createdAt: new Date(),
updatedAt: new Date()
};

await this.db.users.insert(user);
await this.cache.set(`user:${user.id}`, user, 3600);

this.users.set(user.id, user);
return user;
} catch (error) {
console.error('Error creating user:', error);
throw error;
}
}

validateUserData(userData) {
const errors = [];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!userData.email) {
errors.push('Email is required');
} else if (!emailRegex.test(userData.email)) {
errors.push('Invalid email format');
}

if (!userData.password) {
errors.push('Password is required');
} else if (userData.password.length < 8) {
errors.push('Password must be at least 8 characters');
}

if (!userData.firstName) {
errors.push('First name is required');
}

if (!userData.lastName) {
errors.push('Last name is required');
}

return {
isValid: errors.length === 0,
errors
};
}

async hashPassword(password) {
const bcrypt = require('bcrypt');
const saltRounds = 12;
return await bcrypt.hash(password, saltRounds);
}

generateUserId() {
return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

async getUserById(userId) {
try {
// Check cache first
let user = await this.cache.get(`user:${userId}`);
if (user) {
return user;
}

// If not in cache, get from database
user = await this.db.users.findById(userId);
if (user) {
await this.cache.set(`user:${userId}`, user, 3600);
}

return user;
} catch (error) {
console.error('Error getting user:', error);
return null;
}
}

async updateUser(userId, updates) {
try {
const user = await this.getUserById(userId);
if (!user) {
throw new Error('User not found');
}

const updatedUser = {
...user,
...updates,
updatedAt: new Date()
};

await this.db.users.update(userId, updatedUser);
await this.cache.set(`user:${userId}`, updatedUser, 3600);

this.users.set(userId, updatedUser);
return updatedUser;
} catch (error) {
console.error('Error updating user:', error);
throw error;
}
}

async deleteUser(userId) {
try {
const user = await this.getUserById(userId);
if (!user) {
throw new Error('User not found');
}

await this.db.users.delete(userId);
await this.cache.delete(`user:${userId}`);
this.users.delete(userId);

return true;
} catch (error) {
console.error('Error deleting user:', error);
throw error;
}
}
}

// Function with nested conditionals and poor indentation
function processOrderPayment(order, paymentMethod, billingAddress) {
try {
if (!order) {
throw new Error('Order is required');
}

if (!paymentMethod) {
throw new Error('Payment method is required');
}

if (order.status !== 'pending') {
throw new Error('Order is not in pending status');
}

const paymentProcessor = getPaymentProcessor(paymentMethod.type);
if (!paymentProcessor) {
throw new Error('Invalid payment method type');
}

const paymentData = {
amount: order.total,
currency: order.currency || 'USD',
description: `Payment for order ${order.id}`,
metadata: {
orderId: order.id,
customerId: order.customerId
}
};

if (paymentMethod.type === 'credit_card') {
paymentData.card = {
number: paymentMethod.cardNumber,
expiry: paymentMethod.expiry,
cvv: paymentMethod.cvv,
name: paymentMethod.cardholderName
};

if (billingAddress) {
paymentData.billingAddress = {
street: billingAddress.street,
city: billingAddress.city,
state: billingAddress.state,
zipCode: billingAddress.zipCode,
country: billingAddress.country
};
}
} else if (paymentMethod.type === 'paypal') {
paymentData.paypal = {
email: paymentMethod.email,
returnUrl: `${process.env.BASE_URL}/payment/success`,
cancelUrl: `${process.env.BASE_URL}/payment/cancel`
};
} else if (paymentMethod.type === 'bank_transfer') {
paymentData.bankTransfer = {
accountNumber: paymentMethod.accountNumber,
routingNumber: paymentMethod.routingNumber,
accountType: paymentMethod.accountType
};
}

const paymentResult = await paymentProcessor.processPayment(paymentData);

if (paymentResult.success) {
order.status = 'paid';
order.paymentId = paymentResult.transactionId;
order.paidAt = new Date();

await updateOrderStatus(order.id, 'paid');
await sendPaymentConfirmationEmail(order);

return {
success: true,
transactionId: paymentResult.transactionId,
order: order
};
} else {
order.status = 'payment_failed';
order.paymentError = paymentResult.error;

await updateOrderStatus(order.id, 'payment_failed');

return {
success: false,
error: paymentResult.error,
order: order
};
}
} catch (error) {
console.error('Payment processing error:', error);
return {
success: false,
error: error.message
};
}
}

// Complex async function with poor indentation
async function generateReports(reportType, dateRange, filters = {}) {
try {
const validReportTypes = ['sales', 'users', 'products', 'orders', 'financial'];
if (!validReportTypes.includes(reportType)) {
throw new Error(`Invalid report type: ${reportType}`);
}

if (!dateRange || !dateRange.start || !dateRange.end) {
throw new Error('Date range with start and end dates is required');
}

const startDate = new Date(dateRange.start);
const endDate = new Date(dateRange.end);

if (startDate >= endDate) {
throw new Error('Start date must be before end date');
}

let reportData = {};

switch (reportType) {
case 'sales':
const salesData = await getSalesData(startDate, endDate, filters);
reportData = {
totalSales: salesData.reduce((sum, sale) => sum + sale.amount, 0),
salesCount: salesData.length,
averageSaleAmount: salesData.length > 0 ?
salesData.reduce((sum, sale) => sum + sale.amount, 0) / salesData.length : 0,
topProducts: getTopSellingProducts(salesData),
salesByDate: groupSalesByDate(salesData),
salesByCategory: groupSalesByCategory(salesData)
};
break;

case 'users':
const userData = await getUserData(startDate, endDate, filters);
reportData = {
totalUsers: userData.totalUsers,
newUsers: userData.newUsers,
activeUsers: userData.activeUsers,
userGrowthRate: calculateGrowthRate(userData),
usersByCountry: userData.usersByCountry,
userActivityData: userData.activityData
};
break;

case 'products':
const productData = await getProductData(startDate, endDate, filters);
reportData = {
totalProducts: productData.length,
newProducts: productData.filter(p => new Date(p.createdAt) >= startDate).length,
topSellingProducts: getTopSellingProducts(productData),
lowStockProducts: productData.filter(p => p.stock < 10),
productsByCategory: groupProductsByCategory(productData),
averageRating: calculateAverageRating(productData)
};
break;

case 'orders':
const orderData = await getOrderData(startDate, endDate, filters);
reportData = {
totalOrders: orderData.length,
completedOrders: orderData.filter(o => o.status === 'completed').length,
cancelledOrders: orderData.filter(o => o.status === 'cancelled').length,
totalRevenue: orderData
.filter(o => o.status === 'completed')
.reduce((sum, order) => sum + order.total, 0),
averageOrderValue: calculateAverageOrderValue(orderData),
ordersByStatus: groupOrdersByStatus(orderData)
};
break;

case 'financial':
const financialData = await getFinancialData(startDate, endDate, filters);
reportData = {
totalRevenue: financialData.revenue,
totalExpenses: financialData.expenses,
netProfit: financialData.revenue - financialData.expenses,
profitMargin: ((financialData.revenue - financialData.expenses) / financialData.revenue) * 100,
revenueByMonth: financialData.revenueByMonth,
expensesByCategory: financialData.expensesByCategory
};
break;

default:
throw new Error(`Report generation not implemented for type: ${reportType}`);
}

const report = {
type: reportType,
dateRange: {
start: startDate.toISOString(),
end: endDate.toISOString()
},
generatedAt: new Date().toISOString(),
filters: filters,
data: reportData
};

await saveReport(report);
return report;

} catch (error) {
console.error('Error generating report:', error);
throw error;
}
}

// Helper functions with inconsistent indentation
function getTopSellingProducts(salesData) {
const productSales = {};
salesData.forEach(sale => {
sale.items.forEach(item => {
if (!productSales[item.productId]) {
productSales[item.productId] = {
productId: item.productId,
productName: item.productName,
quantity: 0,
revenue: 0
};
}
productSales[item.productId].quantity += item.quantity;
productSales[item.productId].revenue += item.price * item.quantity;
});
});

return Object.values(productSales)
.sort((a, b) => b.revenue - a.revenue)
.slice(0, 10);
}

function groupSalesByDate(salesData) {
const salesByDate = {};
salesData.forEach(sale => {
const date = new Date(sale.createdAt).toISOString().split('T')[0];
if (!salesByDate[date]) {
salesByDate[date] = {
date: date,
salesCount: 0,
totalAmount: 0
};
}
salesByDate[date].salesCount++;
salesByDate[date].totalAmount += sale.amount;
});

return Object.values(salesByDate).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Export functions and classes
export {
API_CONFIG,
UserManager,
processOrderPayment,
generateReports,
getTopSellingProducts,
groupSalesByDate
};