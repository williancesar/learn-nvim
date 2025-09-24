// Day 25: Visual Block Operations Practice - Ctrl-v, I, A, r, c, d
// Practice visual block mode for column editing, multi-line operations
// This file contains data tables and aligned text perfect for visual block editing

/**
 * Data Analytics and Reporting Dashboard
 * Contains tables, aligned data, and structured content for visual block practice
 * Use Ctrl-v to enter visual block mode, then I, A, r, c, d for operations
 */

// Sales data table - perfect for visual block column operations
const SALES_DATA = {
    january:   { revenue: 125000, expenses:  85000, profit:  40000, growth:  8.5 },
    february:  { revenue: 132000, expenses:  88000, profit:  44000, growth:  5.6 },
    march:     { revenue: 145000, expenses:  92000, profit:  53000, growth: 20.5 },
    april:     { revenue: 138000, expenses:  89000, profit:  49000, growth: -4.8 },
    may:       { revenue: 155000, expenses:  95000, profit:  60000, growth: 12.3 },
    june:      { revenue: 168000, expenses:  98000, profit:  70000, growth: 16.7 },
    july:      { revenue: 172000, expenses: 102000, profit:  70000, growth:  2.4 },
    august:    { revenue: 165000, expenses:  99000, profit:  66000, growth: -4.1 },
    september: { revenue: 178000, expenses: 105000, profit:  73000, growth:  7.9 },
    october:   { revenue: 185000, expenses: 108000, profit:  77000, growth:  3.9 },
    november:  { revenue: 192000, expenses: 112000, profit:  80000, growth:  3.8 },
    december:  { revenue: 205000, expenses: 118000, profit:  87000, growth:  6.8 }
};

// Product inventory table with aligned columns
const INVENTORY_DATA = [
    { sku: 'PROD001', name: 'Wireless Headphones',     category: 'Electronics', stock:  250, price:  99.99, supplier: 'AudioTech' },
    { sku: 'PROD002', name: 'Bluetooth Speaker',       category: 'Electronics', stock:  180, price: 149.99, supplier: 'SoundWave' },
    { sku: 'PROD003', name: 'Laptop Stand',            category: 'Accessories', stock:  320, price:  45.50, supplier: 'DeskPro'   },
    { sku: 'PROD004', name: 'USB-C Cable',             category: 'Accessories', stock:  500, price:  12.99, supplier: 'CableCorp' },
    { sku: 'PROD005', name: 'Wireless Mouse',          category: 'Electronics', stock:  275, price:  35.99, supplier: 'ClickTech' },
    { sku: 'PROD006', name: 'Mechanical Keyboard',     category: 'Electronics', stock:  150, price: 129.99, supplier: 'KeyMaster' },
    { sku: 'PROD007', name: 'Monitor Arm',             category: 'Accessories', stock:   95, price:  79.99, supplier: 'DeskPro'   },
    { sku: 'PROD008', name: 'Webcam HD',               category: 'Electronics', stock:  125, price:  89.99, supplier: 'VisionCorp'},
    { sku: 'PROD009', name: 'Desk Lamp',               category: 'Accessories', stock:  200, price:  55.99, supplier: 'LightTech' },
    { sku: 'PROD010', name: 'Portable Charger',        category: 'Electronics', stock:  400, price:  29.99, supplier: 'PowerPack' }
];

// Employee data with consistent column alignment
const EMPLOYEE_DATA = [
    { id: 'EMP001', firstName: 'John',    lastName: 'Smith',    department: 'Engineering', position: 'Senior Developer',   salary:  95000, startDate: '2019-03-15' },
    { id: 'EMP002', firstName: 'Sarah',   lastName: 'Johnson',  department: 'Marketing',    position: 'Marketing Manager',  salary:  78000, startDate: '2020-07-22' },
    { id: 'EMP003', firstName: 'Michael', lastName: 'Brown',    department: 'Engineering', position: 'DevOps Engineer',    salary:  88000, startDate: '2018-11-08' },
    { id: 'EMP004', firstName: 'Emily',   lastName: 'Davis',    department: 'Design',       position: 'UX Designer',        salary:  72000, startDate: '2021-01-12' },
    { id: 'EMP005', firstName: 'Robert',  lastName: 'Wilson',   department: 'Sales',        position: 'Sales Director',     salary: 105000, startDate: '2017-05-30' },
    { id: 'EMP006', firstName: 'Lisa',    lastName: 'Anderson', department: 'HR',           position: 'HR Specialist',      salary:  65000, startDate: '2020-09-14' },
    { id: 'EMP007', firstName: 'David',   lastName: 'Martinez', department: 'Engineering', position: 'Frontend Developer', salary:  82000, startDate: '2019-12-03' },
    { id: 'EMP008', firstName: 'Jennifer',lastName: 'Taylor',   department: 'Finance',      position: 'Financial Analyst',  salary:  70000, startDate: '2021-04-18' },
    { id: 'EMP009', firstName: 'Chris',   lastName: 'Garcia',   department: 'Engineering', position: 'Backend Developer',  salary:  85000, startDate: '2018-08-25' },
    { id: 'EMP010', firstName: 'Amanda',  lastName: 'Rodriguez',department: 'Marketing',    position: 'Content Specialist', salary:  58000, startDate: '2022-02-07' }
];

// Configuration table with aligned key-value pairs
const APP_CONFIGURATION = {
    database: {
        host:           'localhost',
        port:           '5432',
        username:       'admin',
        password:       'secret123',
        maxConnections: '100',
        timeout:        '30000'
    },
    redis: {
        host:           'redis-server',
        port:           '6379',
        password:       'redis_pass',
        maxConnections: '50',
        timeout:        '5000'
    },
    api: {
        host:           'api.example.com',
        port:           '443',
        protocol:       'https',
        version:        'v1',
        timeout:        '10000'
    },
    security: {
        jwtSecret:      'jwt_secret_key',
        tokenExpiry:    '3600',
        bcryptRounds:   '12',
        corsOrigin:     'https://app.example.com',
        csrfProtection: 'true'
    }
};

// Test results table for visual block operations practice
const TEST_RESULTS = [
    { testId: 'T001', name: 'User Authentication',    status: 'PASS', duration: '2.5s', coverage: '95%', priority: 'HIGH'   },
    { testId: 'T002', name: 'Database Connection',    status: 'PASS', duration: '1.2s', coverage: '88%', priority: 'HIGH'   },
    { testId: 'T003', name: 'API Endpoints',          status: 'FAIL', duration: '3.8s', coverage: '72%', priority: 'MEDIUM' },
    { testId: 'T004', name: 'File Upload',            status: 'PASS', duration: '4.1s', coverage: '90%', priority: 'MEDIUM' },
    { testId: 'T005', name: 'Email Notifications',    status: 'SKIP', duration: '0.0s', coverage: '0%',  priority: 'LOW'    },
    { testId: 'T006', name: 'Payment Processing',     status: 'PASS', duration: '5.2s', coverage: '98%', priority: 'HIGH'   },
    { testId: 'T007', name: 'Search Functionality',   status: 'PASS', duration: '2.8s', coverage: '85%', priority: 'MEDIUM' },
    { testId: 'T008', name: 'User Preferences',       status: 'FAIL', duration: '1.9s', coverage: '76%', priority: 'LOW'    },
    { testId: 'T009', name: 'Cache Management',       status: 'PASS', duration: '1.1s', coverage: '92%', priority: 'MEDIUM' },
    { testId: 'T010', name: 'Security Validation',    status: 'PASS', duration: '3.3s', coverage: '97%', priority: 'HIGH'   }
];

// Server monitoring metrics with columns to edit
const SERVER_METRICS = {
    webServer01: { cpu: '45%', memory: '78%', disk: '23%', network: '125MB/s', uptime: '99.9%', status: 'HEALTHY' },
    webServer02: { cpu: '52%', memory: '82%', disk: '19%', network: '98MB/s',  uptime: '99.8%', status: 'HEALTHY' },
    webServer03: { cpu: '38%', memory: '65%', disk: '31%', network: '156MB/s', uptime: '99.9%', status: 'HEALTHY' },
    dbServer01:  { cpu: '67%', memory: '89%', disk: '56%', network: '245MB/s', uptime: '99.7%', status: 'WARNING'},
    dbServer02:  { cpu: '71%', memory: '91%', disk: '58%', network: '267MB/s', uptime: '99.6%', status: 'WARNING'},
    cacheServer: { cpu: '28%', memory: '45%', disk: '12%', network: '67MB/s',  uptime: '99.9%', status: 'HEALTHY' },
    loadBalancer:{ cpu: '15%', memory: '32%', disk: '8%',  network: '89MB/s',  uptime: '100%',  status: 'HEALTHY' },
    fileServer:  { cpu: '41%', memory: '58%', disk: '78%', network: '134MB/s', uptime: '99.5%', status: 'CAUTION'}
};

// Code quality metrics table
const CODE_QUALITY_METRICS = [
    { file: 'src/auth/login.js',           lines: 245, complexity: 8,  coverage: 95, bugs: 0, smells: 2, debt: '15min' },
    { file: 'src/auth/register.js',        lines: 189, complexity: 6,  coverage: 88, bugs: 1, smells: 3, debt: '25min' },
    { file: 'src/api/users.js',            lines: 567, complexity: 12, coverage: 78, bugs: 2, smells: 8, debt: '2h'    },
    { file: 'src/api/products.js',         lines: 423, complexity: 9,  coverage: 85, bugs: 0, smells: 4, debt: '45min' },
    { file: 'src/utils/validation.js',     lines: 156, complexity: 4,  coverage: 97, bugs: 0, smells: 1, debt: '5min'  },
    { file: 'src/utils/encryption.js',     lines: 89,  complexity: 3,  coverage: 92, bugs: 0, smells: 0, debt: '0min'  },
    { file: 'src/database/connection.js',  lines: 134, complexity: 5,  coverage: 89, bugs: 1, smells: 2, debt: '20min' },
    { file: 'src/middleware/auth.js',      lines: 78,  complexity: 3,  coverage: 94, bugs: 0, smells: 1, debt: '10min' },
    { file: 'src/controllers/orders.js',   lines: 678, complexity: 15, coverage: 72, bugs: 3, smells: 12,debt: '4h'    },
    { file: 'src/services/email.js',       lines: 234, complexity: 7,  coverage: 83, bugs: 1, smells: 5, debt: '1h'    }
];

// Financial report with currency symbols for block editing
const FINANCIAL_REPORT = {
    revenue: {
        Q1: '$1,250,000',
        Q2: '$1,380,000',
        Q3: '$1,465,000',
        Q4: '$1,620,000'
    },
    expenses: {
        Q1: '$985,000',
        Q2: '$1,045,000',
        Q3: '$1,125,000',
        Q4: '$1,235,000'
    },
    profit: {
        Q1: '$265,000',
        Q2: '$335,000',
        Q3: '$340,000',
        Q4: '$385,000'
    },
    growth: {
        Q1: '8.5%',
        Q2: '26.4%',
        Q3: '1.5%',
        Q4: '13.2%'
    }
};

// API endpoint documentation with consistent formatting
const API_ENDPOINTS = [
    { method: 'GET',    endpoint: '/api/v1/users',           description: 'Get all users',              auth: 'Required' },
    { method: 'POST',   endpoint: '/api/v1/users',           description: 'Create new user',            auth: 'Required' },
    { method: 'GET',    endpoint: '/api/v1/users/:id',       description: 'Get user by ID',             auth: 'Required' },
    { method: 'PUT',    endpoint: '/api/v1/users/:id',       description: 'Update user',                auth: 'Required' },
    { method: 'DELETE', endpoint: '/api/v1/users/:id',       description: 'Delete user',                auth: 'Required' },
    { method: 'GET',    endpoint: '/api/v1/products',        description: 'Get all products',           auth: 'Optional' },
    { method: 'POST',   endpoint: '/api/v1/products',        description: 'Create new product',         auth: 'Required' },
    { method: 'GET',    endpoint: '/api/v1/products/:id',    description: 'Get product by ID',          auth: 'Optional' },
    { method: 'PUT',    endpoint: '/api/v1/products/:id',    description: 'Update product',             auth: 'Required' },
    { method: 'DELETE', endpoint: '/api/v1/products/:id',    description: 'Delete product',             auth: 'Required' },
    { method: 'GET',    endpoint: '/api/v1/orders',          description: 'Get user orders',            auth: 'Required' },
    { method: 'POST',   endpoint: '/api/v1/orders',          description: 'Create new order',           auth: 'Required' },
    { method: 'GET',    endpoint: '/api/v1/orders/:id',      description: 'Get order by ID',            auth: 'Required' },
    { method: 'PUT',    endpoint: '/api/v1/orders/:id',      description: 'Update order status',        auth: 'Required' },
    { method: 'DELETE', endpoint: '/api/v1/orders/:id',      description: 'Cancel order',               auth: 'Required' }
];

// Database schema with aligned column definitions
const DATABASE_SCHEMA = {
    users: {
        id:         'SERIAL PRIMARY KEY',
        email:      'VARCHAR(255) UNIQUE NOT NULL',
        password:   'VARCHAR(255) NOT NULL',
        firstName:  'VARCHAR(100) NOT NULL',
        lastName:   'VARCHAR(100) NOT NULL',
        role:       'VARCHAR(50) DEFAULT "user"',
        isActive:   'BOOLEAN DEFAULT true',
        createdAt:  'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        updatedAt:  'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
    },
    products: {
        id:          'SERIAL PRIMARY KEY',
        name:        'VARCHAR(255) NOT NULL',
        description: 'TEXT',
        price:       'DECIMAL(10,2) NOT NULL',
        category:    'VARCHAR(100) NOT NULL',
        sku:         'VARCHAR(50) UNIQUE NOT NULL',
        stock:       'INTEGER DEFAULT 0',
        isActive:    'BOOLEAN DEFAULT true',
        createdAt:   'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        updatedAt:   'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
    },
    orders: {
        id:           'SERIAL PRIMARY KEY',
        userId:       'INTEGER REFERENCES users(id)',
        status:       'VARCHAR(50) DEFAULT "pending"',
        total:        'DECIMAL(10,2) NOT NULL',
        shippingFee:  'DECIMAL(10,2) DEFAULT 0',
        taxAmount:    'DECIMAL(10,2) DEFAULT 0',
        notes:        'TEXT',
        createdAt:    'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
        updatedAt:    'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
    }
};

// CSS Grid layout definitions for block editing practice
const GRID_LAYOUTS = {
    mainLayout: {
        display:               'grid',
        gridTemplateColumns:   '250px 1fr 300px',
        gridTemplateRows:      '80px 1fr 60px',
        gridTemplateAreas:     '"header header header" "sidebar main aside" "footer footer footer"',
        gap:                   '20px',
        minHeight:             '100vh'
    },
    productGrid: {
        display:               'grid',
        gridTemplateColumns:   'repeat(auto-fit, minmax(300px, 1fr))',
        gridAutoRows:          'minmax(400px, auto)',
        gap:                   '30px',
        padding:               '20px'
    },
    dashboardGrid: {
        display:               'grid',
        gridTemplateColumns:   'repeat(12, 1fr)',
        gridTemplateRows:      'repeat(8, 100px)',
        gap:                   '15px',
        width:                 '100%',
        height:                '100vh'
    }
};

// Export all data structures for use in other modules
export {
    SALES_DATA,
    INVENTORY_DATA,
    EMPLOYEE_DATA,
    APP_CONFIGURATION,
    TEST_RESULTS,
    SERVER_METRICS,
    CODE_QUALITY_METRICS,
    FINANCIAL_REPORT,
    API_ENDPOINTS,
    DATABASE_SCHEMA,
    GRID_LAYOUTS
};