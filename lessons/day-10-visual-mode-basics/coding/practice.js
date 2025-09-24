/**
 * DAY 10: VISUAL MODE PRACTICE
 * =============================
 *
 * LEARNING OBJECTIVES:
 * - Master visual selection modes (v, V, Ctrl-v)
 * - Practice selecting code blocks efficiently
 * - Learn to combine visual selection with editing operations
 *
 * KEY COMMANDS TO PRACTICE:
 * - v        : Character-wise visual mode
 * - V        : Line-wise visual mode
 * - Ctrl-v   : Block-wise (column) visual mode
 * - o        : Switch to other end of selection
 * - O        : Switch to other corner (block mode)
 * - gv       : Reselect last visual selection
 * - aw, iw   : Select word (around/inner)
 * - ap, ip   : Select paragraph (around/inner)
 * - a), i)   : Select parentheses block
 * - a}, i}   : Select brace block
 * - a], i]   : Select bracket block
 * - a", i"   : Select quoted string
 *
 * EXERCISE INSTRUCTIONS:
 * 1. Practice different visual selection modes
 * 2. Select various code constructs using text objects
 * 3. Combine visual selection with operations (d, c, y, >, <)
 * 4. Use block mode for column editing
 */

// SELECTION TARGET: Simple strings for character-wise selection
const greetings = [
    'Hello, World!',        // Practice: v to select parts of this string
    'Welcome to Vim!',      // Practice: Select from 'W' to 'V'
    'Happy coding!',        // Practice: Select the word 'coding'
    'See you later!'        // Practice: Select 'you later'
];

// SELECTION TARGET: Complete lines for line-wise selection (V)
const userTypes = [
    'admin',           // Practice: V to select this entire line
    'moderator',       // Practice: V then j to select multiple lines
    'user',            // Practice: Select these 3 lines at once
    'guest',
    'subscriber',
    'premium',
    'trial'
];

// SELECTION TARGET: Function blocks for brace selection (vi{, va{)
function calculateStats(numbers) {
    // Practice: vi{ to select inside this function
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const average = sum / numbers.length;
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);

    return {
        sum,
        average,
        min,
        max,
        count: numbers.length
    };
}

// SELECTION TARGET: Object literals for brace selection
const databaseConfig = {
    // Practice: vi{ to select inside this object
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    username: 'admin',
    password: 'secret123',
    ssl: {
        enabled: true,
        certificate: '/path/to/cert.pem',
        key: '/path/to/key.pem'
    },
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 60000,
        idleTimeoutMillis: 30000
    }
};

// SELECTION TARGET: Array elements for bracket selection (vi[, va[)
const shoppingCart = [
    // Practice: vi[ to select inside brackets
    { id: 1, name: 'Laptop', price: 999.99, quantity: 1 },
    { id: 2, name: 'Mouse', price: 29.99, quantity: 2 },
    { id: 3, name: 'Keyboard', price: 89.99, quantity: 1 },
    { id: 4, name: 'Monitor', price: 299.99, quantity: 1 },
    { id: 5, name: 'Speakers', price: 149.99, quantity: 1 }
];

// SELECTION TARGET: Function parameters for parentheses selection (vi(, va()
function processOrder(orderId, customerInfo, items, shippingAddress, paymentMethod) {
    // Practice: vi( to select function parameters
    // Practice: va( to include parentheses

    const order = {
        id: orderId,
        customer: customerInfo,
        items: items.map(item => ({
            ...item,
            total: item.price * item.quantity
        })),
        shipping: shippingAddress,
        payment: paymentMethod,
        status: 'pending',
        createdAt: new Date()
    };

    // Practice: Select the entire map function call
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return {
        ...order,
        total: totalAmount
    };
}

// SELECTION TARGET: Quoted strings for quote selection (vi", va")
const messages = {
    welcome: "Welcome to our amazing application!",     // Practice: vi" to select inside quotes
    error: "An unexpected error occurred. Please try again.", // Practice: va" to include quotes
    success: "Your operation completed successfully!",
    warning: "Please review your input before proceeding.",
    info: "Check our documentation for more details."
};

// SELECTION TARGET: Template literals for complex string selection
const emailTemplate = `
Dear ${customerName},

Thank you for your recent purchase of:
${items.map(item => `- ${item.name} (Qty: ${item.quantity})`).join('\n')}

Your order total is: $${totalAmount.toFixed(2)}

Best regards,
The Sales Team
`;

// SELECTION TARGET: Class definition for large block selection
class TaskManager {
    // Practice: Select the entire class body with vi{
    constructor() {
        this.tasks = [];
        this.completedTasks = [];
        this.nextId = 1;
    }

    addTask(title, description = '', priority = 'medium') {
        // Practice: Select method body with vi{
        // Practice: Select parameter list with vi(
        const task = {
            id: this.nextId++,
            title,
            description,
            priority,
            completed: false,
            createdAt: new Date(),
            tags: []
        };

        this.tasks.push(task);
        return task;
    }

    updateTask(taskId, updates) {
        // Practice: Select this entire method with va{
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);

        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...updates,
                updatedAt: new Date()
            };
            return this.tasks[taskIndex];
        }

        return null;
    }

    completeTask(taskId) {
        const task = this.getTaskById(taskId);
        if (task) {
            task.completed = true;
            task.completedAt = new Date();

            // Move to completed tasks
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.completedTasks.push(task);

            return task;
        }
        return null;
    }

    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId) ||
               this.completedTasks.find(task => task.id === taskId);
    }
}

// SELECTION TARGET: Switch statement for line-wise selection
function getStatusColor(status) {
    // Practice: Select entire switch block
    switch (status) {
        case 'pending':
            return '#ffc107'; // Yellow
        case 'processing':
            return '#007bff'; // Blue
        case 'completed':
            return '#28a745'; // Green
        case 'failed':
            return '#dc3545'; // Red
        case 'cancelled':
            return '#6c757d'; // Gray
        default:
            return '#343a40'; // Dark gray
    }
}

// SELECTION TARGET: Conditional chains for block selection
function calculateShipping(weight, distance, method) {
    // Practice: Select each if-else block
    if (method === 'express') {
        if (weight < 1) {
            return distance < 100 ? 15.99 : 25.99;
        } else if (weight < 5) {
            return distance < 100 ? 22.99 : 35.99;
        } else {
            return distance < 100 ? 35.99 : 55.99;
        }
    } else if (method === 'standard') {
        if (weight < 1) {
            return distance < 100 ? 7.99 : 12.99;
        } else if (weight < 5) {
            return distance < 100 ? 12.99 : 18.99;
        } else {
            return distance < 100 ? 18.99 : 28.99;
        }
    } else {
        // Free shipping for orders over $50
        return 0;
    }
}

// SELECTION TARGET: Array methods chaining for line selection
const processUserData = (users) => {
    // Practice: Select each method call line individually
    // Practice: Select entire chain with V and multiple j
    return users
        .filter(user => user.active)
        .filter(user => user.emailVerified)
        .map(user => ({
            ...user,
            displayName: `${user.firstName} ${user.lastName}`,
            age: new Date().getFullYear() - new Date(user.birthDate).getFullYear()
        }))
        .sort((a, b) => a.lastName.localeCompare(b.lastName))
        .slice(0, 100);
};

// SELECTION TARGET: Complex object for nested selection practice
const applicationConfig = {
    // Practice: Select different nesting levels
    server: {
        host: 'localhost',
        port: 3000,
        cors: {
            origin: ['http://localhost:3000', 'https://myapp.com'],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    },
    database: {
        connection: {
            host: 'db.example.com',
            port: 5432,
            database: 'myapp_production',
            ssl: {
                enabled: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            min: 2,
            max: 10
        }
    },
    logging: {
        level: 'info',
        format: 'combined',
        file: {
            enabled: true,
            path: '/var/log/myapp.log',
            maxSize: '10MB',
            maxFiles: 5
        },
        console: {
            enabled: true,
            colorize: true
        }
    }
};

// SELECTION TARGET: Regular expressions for character-wise selection
const validationPatterns = {
    // Practice: Select different parts of regex patterns
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    url: /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// SELECTION TARGET: Comments for line-wise selection practice
/*
 * PRACTICE AREA FOR BLOCK COMMENTS
 * =================================
 *
 * Practice selecting these comment lines:
 * - Use V to select single lines
 * - Use V + j/k to select multiple lines
 * - Practice with gv to reselect
 *
 * This is a multi-line comment that you can practice
 * selecting in various ways. Try selecting just the
 * explanatory text, or the entire comment block.
 */

// Single line comments for practice
// Practice: Select this comment line with V
// Practice: Select multiple comment lines with V + j
// Practice: Select from '//' to end of line with v + $

// SELECTION TARGET: HTML/JSX-like strings for complex selection
const htmlTemplate = `
<div class="container">
    <header class="header">
        <h1>Welcome to MyApp</h1>
        <nav class="navigation">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    </header>
    <main class="content">
        <section class="hero">
            <h2>Build Amazing Applications</h2>
            <p>Start your journey with our powerful tools and features.</p>
            <button class="btn btn-primary">Get Started</button>
        </section>
    </main>
</div>
`;

// SELECTION TARGET: Data for column (block) mode practice
const tableData = [
    'ID    | Name          | Age | City        | Country',
    '------|---------------|-----|-------------|--------',
    '001   | John Doe      | 30  | New York    | USA',
    '002   | Jane Smith    | 25  | London      | UK',
    '003   | Bob Johnson   | 35  | Toronto     | Canada',
    '004   | Alice Brown   | 28  | Sydney      | Australia',
    '005   | Charlie Davis | 32  | Berlin      | Germany'
];

// Practice area for block mode (Ctrl-v) column selection:
// 1. Place cursor on 'ID' and use Ctrl-v
// 2. Select down to create a column
// 3. Practice selecting the Age column
// 4. Practice selecting the pipe separators

/**
 * PRACTICE EXERCISES:
 *
 * 1. CHARACTER-WISE VISUAL MODE (v):
 *    - Select parts of strings in the greetings array
 *    - Select function names without parentheses
 *    - Select property names in objects
 *    - Practice with o to switch selection ends
 *
 * 2. LINE-WISE VISUAL MODE (V):
 *    - Select single lines in the userTypes array
 *    - Select multiple consecutive lines
 *    - Select entire functions
 *    - Select complete object definitions
 *
 * 3. BLOCK (COLUMN) VISUAL MODE (Ctrl-v):
 *    - Select columns in the tableData array
 *    - Select indentation spaces/tabs
 *    - Select parts of aligned code
 *    - Practice with O to switch corners
 *
 * 4. TEXT OBJECTS:
 *    - Use viw to select words
 *    - Use vi( to select inside parentheses
 *    - Use vi{ to select inside braces
 *    - Use vi[ to select inside brackets
 *    - Use vi" to select inside quotes
 *    - Compare vi vs va (inner vs around)
 *
 * 5. VISUAL OPERATIONS:
 *    - Select text and press d to delete
 *    - Select text and press c to change
 *    - Select text and press y to yank
 *    - Select lines and press > to indent
 *    - Select lines and press < to unindent
 *
 * 6. ADVANCED PRACTICE:
 *    - Use gv to reselect last selection
 *    - Select nested structures (objects within objects)
 *    - Select and manipulate function parameters
 *    - Select and reformat code blocks
 *
 * REMEMBER:
 * - v = character-wise selection
 * - V = line-wise selection
 * - Ctrl-v = block/column selection
 * - o = switch to other end of selection
 * - gv = reselect last visual selection
 * - Text objects (iw, i{, i", etc.) work great with visual mode
 */