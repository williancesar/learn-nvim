-- Day 13: Multi-File Database Project - Schema Definition
-- This is the main schema file defining tables, indexes, constraints, and relationships
-- Practice file operations: switching between files (:e, :b, :bn, :bp), opening multiple files
-- PostgreSQL Dialect

-- =============================================================================
-- CORE ENTITIES
-- =============================================================================

-- Companies table - main business entities
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    founded_year INTEGER,
    headquarters_city VARCHAR(100),
    headquarters_country VARCHAR(100),
    employee_count INTEGER,
    annual_revenue DECIMAL(15,2),
    company_type VARCHAR(50) CHECK (company_type IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    website_url VARCHAR(500),
    stock_symbol VARCHAR(10),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Departments within companies
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(20) UNIQUE,
    budget DECIMAL(12,2),
    head_employee_id INTEGER, -- Will be linked to employees table
    location VARCHAR(200),
    cost_center VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Employees table with comprehensive information
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    department_id INTEGER REFERENCES departments(department_id) ON DELETE SET NULL,
    manager_id INTEGER REFERENCES employees(employee_id) ON DELETE SET NULL,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    hire_date DATE NOT NULL,
    termination_date DATE,
    job_title VARCHAR(150),
    job_level VARCHAR(50),
    salary DECIMAL(10,2),
    currency_code VARCHAR(3) DEFAULT 'USD',
    employment_type VARCHAR(50) CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'intern')),
    office_location VARCHAR(200),
    skills TEXT[], -- PostgreSQL array for skills
    certifications JSONB, -- JSON for structured certification data
    performance_rating DECIMAL(3,2) CHECK (performance_rating BETWEEN 1.0 AND 5.0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Add foreign key for department head
ALTER TABLE departments
ADD CONSTRAINT fk_departments_head_employee
FOREIGN KEY (head_employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL;

-- =============================================================================
-- CUSTOMER RELATIONSHIP MANAGEMENT
-- =============================================================================

-- Customers table
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_type VARCHAR(50) CHECK (customer_type IN ('individual', 'business')),
    company_name VARCHAR(255), -- For business customers
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    registration_date DATE DEFAULT CURRENT_DATE,
    birth_date DATE,
    gender VARCHAR(20),
    industry VARCHAR(100), -- For business customers
    annual_revenue DECIMAL(15,2), -- For business customers
    employee_count INTEGER, -- For business customers
    preferred_language VARCHAR(10) DEFAULT 'en',
    communication_preferences JSONB,
    loyalty_tier VARCHAR(50) DEFAULT 'bronze',
    lifetime_value DECIMAL(12,2) DEFAULT 0,
    acquisition_channel VARCHAR(100),
    referral_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Customer addresses (supporting multiple addresses per customer)
CREATE TABLE customer_addresses (
    address_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    address_type VARCHAR(50) CHECK (address_type IN ('billing', 'shipping', 'home', 'office')),
    street_address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- =============================================================================
-- PRODUCT CATALOG
-- =============================================================================

-- Product categories with hierarchical support
CREATE TABLE product_categories (
    category_id SERIAL PRIMARY KEY,
    parent_category_id INTEGER REFERENCES product_categories(category_id) ON DELETE CASCADE,
    category_name VARCHAR(150) NOT NULL,
    category_code VARCHAR(50) UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Suppliers/Vendors
CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(200),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(500),
    address VARCHAR(500),
    city VARCHAR(100),
    country VARCHAR(100),
    payment_terms VARCHAR(100),
    lead_time_days INTEGER,
    quality_rating DECIMAL(3,2) CHECK (quality_rating BETWEEN 1.0 AND 5.0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES product_categories(category_id) ON DELETE SET NULL,
    supplier_id INTEGER REFERENCES suppliers(supplier_id) ON DELETE SET NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    specifications JSONB,
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    currency_code VARCHAR(3) DEFAULT 'USD',
    weight DECIMAL(8,3),
    dimensions JSONB, -- {"length": 10, "width": 5, "height": 3, "unit": "cm"}
    color VARCHAR(50),
    size VARCHAR(50),
    material VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    warranty_months INTEGER,
    minimum_order_quantity INTEGER DEFAULT 1,
    reorder_point INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 1000,
    is_digital BOOLEAN DEFAULT FALSE,
    requires_shipping BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Product inventory tracking
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    warehouse_location VARCHAR(100),
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    quantity_reserved INTEGER NOT NULL DEFAULT 0,
    quantity_available AS (quantity_on_hand - quantity_reserved) STORED,
    last_restock_date DATE,
    last_inventory_check DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- SALES AND ORDERS
-- =============================================================================

-- Sales representatives
CREATE TABLE sales_reps (
    sales_rep_id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id) ON DELETE SET NULL,
    territory VARCHAR(200),
    quota DECIMAL(12,2),
    commission_rate DECIMAL(5,4) DEFAULT 0.05,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    sales_rep_id INTEGER REFERENCES sales_reps(sales_rep_id) ON DELETE SET NULL,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    required_date DATE,
    shipped_date DATE,
    delivered_date DATE,
    order_status VARCHAR(50) CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    payment_status VARCHAR(50) CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')),
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency_code VARCHAR(3) DEFAULT 'USD',
    billing_address_id INTEGER REFERENCES customer_addresses(address_id),
    shipping_address_id INTEGER REFERENCES customer_addresses(address_id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order line items
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    line_number INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price * (1 - discount_percentage / 100)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (order_id, line_number)
);

-- =============================================================================
-- FINANCIAL TRACKING
-- =============================================================================

-- Payment methods
CREATE TABLE payment_methods (
    payment_method_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    method_type VARCHAR(50) CHECK (method_type IN ('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'check')),
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    expiry_month INTEGER,
    expiry_year INTEGER,
    billing_address_id INTEGER REFERENCES customer_addresses(address_id),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT TRUE
);

-- Payments
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_method_id INTEGER REFERENCES payment_methods(payment_method_id),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'USD',
    payment_status VARCHAR(50) CHECK (payment_status IN ('pending', 'authorized', 'captured', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    gateway_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- ANALYTICS AND REPORTING VIEWS
-- =============================================================================

-- Customer lifetime value view
CREATE VIEW customer_analytics AS
WITH customer_metrics AS (
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        c.email,
        c.registration_date,
        COUNT(o.order_id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as lifetime_value,
        COALESCE(AVG(o.total_amount), 0) as avg_order_value,
        COALESCE(MAX(o.order_date), c.registration_date::timestamp) as last_order_date,
        COALESCE(MIN(o.order_date), c.registration_date::timestamp) as first_order_date
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    WHERE c.active = true
    GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.registration_date
)
SELECT
    customer_id,
    first_name,
    last_name,
    email,
    registration_date,
    total_orders,
    lifetime_value,
    avg_order_value,
    last_order_date,
    first_order_date,
    EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - last_order_date)) as days_since_last_order,
    CASE
        WHEN total_orders = 0 THEN 'Never Purchased'
        WHEN total_orders = 1 THEN 'One-Time Buyer'
        WHEN total_orders <= 5 THEN 'Occasional Buyer'
        WHEN total_orders <= 15 THEN 'Regular Customer'
        ELSE 'VIP Customer'
    END as customer_segment,
    CASE
        WHEN lifetime_value = 0 THEN 'No Value'
        WHEN lifetime_value <= 100 THEN 'Low Value'
        WHEN lifetime_value <= 500 THEN 'Medium Value'
        WHEN lifetime_value <= 2000 THEN 'High Value'
        ELSE 'Premium Value'
    END as value_segment
FROM customer_metrics;

-- Product performance view
CREATE VIEW product_performance AS
SELECT
    p.product_id,
    p.sku,
    p.product_name,
    pc.category_name,
    p.price,
    p.cost,
    COALESCE(sales_data.total_quantity_sold, 0) as total_quantity_sold,
    COALESCE(sales_data.total_revenue, 0) as total_revenue,
    COALESCE(sales_data.order_count, 0) as order_count,
    COALESCE(i.quantity_on_hand, 0) as current_stock,
    CASE
        WHEN p.cost > 0 THEN ROUND(((p.price - p.cost) / p.cost * 100), 2)
        ELSE NULL
    END as margin_percentage,
    CASE
        WHEN COALESCE(sales_data.total_quantity_sold, 0) = 0 THEN 'No Sales'
        WHEN COALESCE(sales_data.total_quantity_sold, 0) <= 10 THEN 'Low Sales'
        WHEN COALESCE(sales_data.total_quantity_sold, 0) <= 100 THEN 'Medium Sales'
        WHEN COALESCE(sales_data.total_quantity_sold, 0) <= 500 THEN 'High Sales'
        ELSE 'Very High Sales'
    END as sales_category
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.category_id
LEFT JOIN inventory i ON p.product_id = i.product_id
LEFT JOIN (
    SELECT
        oi.product_id,
        SUM(oi.quantity) as total_quantity_sold,
        SUM(oi.line_total) as total_revenue,
        COUNT(DISTINCT oi.order_id) as order_count
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.order_status IN ('delivered', 'shipped')
    GROUP BY oi.product_id
) sales_data ON p.product_id = sales_data.product_id
WHERE p.active = true;