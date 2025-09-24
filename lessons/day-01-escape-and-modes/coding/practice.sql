-- =============================================================================
-- DAY 01: ESCAPE & MODES - SQL Practice File
-- =============================================================================
--
-- LEARNING OBJECTIVES:
-- - Practice switching between Normal and Insert modes using <Esc>
-- - Use 'i' to enter Insert mode at cursor
-- - Use 'I' to enter Insert mode at beginning of line
-- - Use 'a' to enter Insert mode after cursor
-- - Use 'A' to enter Insert mode at end of line
-- - Use 'o' to open new line below and enter Insert mode
-- - Use 'O' to open new line above and enter Insert mode
--
-- PRACTICE INSTRUCTIONS:
-- 1. Navigate to each TODO marker using search: /TODO
-- 2. Practice different ways to enter Insert mode
-- 3. Complete the missing parts as indicated
-- 4. Use <Esc> to return to Normal mode after each edit
-- =============================================================================

-- E-commerce Database Schema
-- TODO: Add missing column definition after line break (use 'o' to open new line)
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
    -- TODO: Add created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP here
);

-- TODO: Complete the products table definition (use 'A' to go to end of line)
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER
    -- TODO: Add foreign key constraint here
);

-- TODO: Add missing table comment (use 'I' to go to beginning of line)
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    parent_category_id INTEGER,
    is_active BOOLEAN DEFAULT true
);

-- Orders table with TODO markers for mode practice
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- TODO: Add check constraint here (use 'a')
    total_amount DECIMAL(12, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    billing_address TEXT
    -- TODO: Add foreign key to customers table (use 'O' to open line above)
);

-- Order items junction table
CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL
    -- TODO: Add composite unique constraint on (order_id, product_id)
);

-- TODO: Create indexes for performance (practice 'o' and 'O')
-- Index on customers email


-- Index on products category


-- Index on orders customer_id and status


-- Sample Data Insertion
-- TODO: Complete the INSERT statements (practice different insert modes)

INSERT INTO categories (category_name, is_active) VALUES
    ('Electronics', true),
    ('Books', true),
    ('Clothing' -- TODO: Complete this tuple
    ('Home & Garden', true);

-- TODO: Add missing columns in INSERT (use 'i' to insert)
INSERT INTO customers (first_name, last_name) VALUES
    ('John', 'Doe'),
    ('Jane', 'Smith'),
    ('Bob', 'Johnson');

-- TODO: Complete product insertions (practice 'A' for end of line)
INSERT INTO products (product_name, description, price, stock_quantity, category_id) VALUES
    ('Laptop Pro', 'High-performance laptop', 1299.99, 50),
    ('Wireless Mouse', 'Ergonomic wireless mouse', 29.99, 200, 1),
    ('SQL Cookbook', 'Advanced SQL techniques', 49.99 -- TODO: Add stock and category
    ('Cotton T-Shirt', 'Comfortable cotton t-shirt', 19.99, 100, 3);

-- Common Table Expressions (CTEs) with TODO markers
-- TODO: Add missing CTE name (use 'i' at cursor)
WITH  AS (
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        COUNT(o.order_id) as order_count,
        SUM(o.total_amount) as total_spent
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.first_name, c.last_name
),
-- TODO: Add second CTE for top products (use 'O' to open line above)

SELECT
    cs.first_name,
    cs.last_name,
    cs.order_count,
    cs.total_spent,
    CASE
        WHEN cs.total_spent >= 1000 THEN 'Premium'
        WHEN cs.total_spent >= 500 THEN 'Gold'
        ELSE 'Standard'
    END as customer_tier
FROM customer_stats cs
ORDER BY cs.total_spent DESC;

-- Window Functions Practice
-- TODO: Complete the window function (practice insert at different positions)
SELECT
    p.product_name,
    p.price,
    c.category_name,
    AVG(p.price) OVER (PARTITION BY  -- TODO: Add partition column
    ) as avg_category_price,
    ROW_NUMBER() OVER (
        PARTITION BY p.category_id
        ORDER BY  -- TODO: Add order column
    ) as price_rank_in_category
FROM products p
JOIN categories c ON p.category_id = c.category_id
WHERE p.stock_quantity > 0;

-- TODO: Add missing query comment (use 'I' to go to line start)
SELECT
    DATE_TRUNC('month', o.order_date) as month,
    COUNT(*) as order_count,
    SUM(o.total_amount) as revenue,
    AVG(o.total_amount) as avg_order_value,
    LAG(SUM(o.total_amount)) OVER (ORDER BY DATE_TRUNC('month', o.order_date)) as prev_month_revenue
FROM orders o
WHERE o.status = 'completed'
GROUP BY DATE_TRUNC('month', o.order_date)
ORDER BY month;

-- TODO: Complete stored procedure definition (practice all insert modes)
CREATE OR REPLACE FUNCTION get_customer_order_summary(
    customer_id_param INTEGER
) RETURNS TABLE (
    -- TODO: Add return columns here
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        o.order_id,
        o.order_date,
        o.status,
        o.total_amount
    FROM orders o
    WHERE o.customer_id = customer_id_param
    ORDER BY o.order_date DESC;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- MODE SWITCHING EXERCISES:
-- 1. Use /TODO to find each marker
-- 2. Practice 'i', 'I', 'a', 'A', 'o', 'O' to enter Insert mode
-- 3. Use <Esc> to return to Normal mode
-- 4. Complete all TODO items to finish the schema
-- =============================================================================