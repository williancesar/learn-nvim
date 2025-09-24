-- =============================================================================
-- DAY 02: BASIC NAVIGATION - SQL Practice File
-- =============================================================================
--
-- LEARNING OBJECTIVES:
-- - Use h, j, k, l for basic movement (left, down, up, right)
-- - Navigate to specific lines with :line_number or line_numberG
-- - Use 0 to go to start of line, $ to go to end of line
-- - Use gg to go to top of file, G to go to bottom
-- - Use Ctrl+f (page down) and Ctrl+b (page up)
-- - Use H, M, L for screen positioning (High, Middle, Low)
--
-- NAVIGATION TARGETS:
-- Line 25: Customer analytics query
-- Line 45: Product inventory view
-- Line 68: Order processing workflow
-- Line 89: Sales reporting dashboard
-- Line 112: Performance optimization section
-- Line 135: Data cleanup procedures
-- =============================================================================

-- Data Warehouse Schema for E-commerce Analytics
CREATE SCHEMA analytics;
CREATE SCHEMA staging;
CREATE SCHEMA operational;

-- Navigate to this section using :25 or 25G
-- =============================================================================
-- CUSTOMER ANALYTICS SECTION (Lines 25-44)
-- Practice: Use H, M, L to position cursor on screen
-- =============================================================================
CREATE TABLE analytics.dim_customers (
    customer_key SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    registration_date DATE NOT NULL,
    customer_segment VARCHAR(20) DEFAULT 'Standard',
    lifetime_value DECIMAL(12, 2) DEFAULT 0.00,
    last_order_date DATE,
    total_orders INTEGER DEFAULT 0,
    preferred_category VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer behavior analysis with complex CTEs
WITH customer_segments AS (
    SELECT customer_id, first_name, last_name, email FROM analytics.dim_customers
), monthly_activity AS (
    SELECT customer_id, DATE_TRUNC('month', order_date) as month FROM operational.orders
)
SELECT cs.customer_id, cs.first_name, ma.month FROM customer_segments cs JOIN monthly_activity ma ON cs.customer_id = ma.customer_id;

-- Navigate here with :45 or 45G
-- =============================================================================
-- PRODUCT INVENTORY SECTION (Lines 45-67)
-- Practice: Use 0 and $ to move to line start/end
-- =============================================================================
CREATE TABLE analytics.dim_products (
    product_key SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    category_level_1 VARCHAR(50),
    category_level_2 VARCHAR(50),
    category_level_3 VARCHAR(50),
    cost_price DECIMAL(10, 2),
    retail_price DECIMAL(10, 2),
    margin_percent DECIMAL(5, 2),
    weight_kg DECIMAL(8, 3),
    dimensions_cm VARCHAR(50),
    color VARCHAR(30),
    size VARCHAR(20),
    material VARCHAR(100),
    supplier_id INTEGER,
    reorder_point INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 1000,
    is_discontinued BOOLEAN DEFAULT false,
    launch_date DATE,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE DEFAULT '9999-12-31'
);

-- Navigate to this section with :68G
-- =============================================================================
-- ORDER PROCESSING WORKFLOW (Lines 68-88)
-- Practice: Use Ctrl+f and Ctrl+b to scroll pages
-- =============================================================================
CREATE TABLE analytics.fact_orders (
    order_key SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    customer_key INTEGER REFERENCES analytics.dim_customers(customer_key),
    order_date_key INTEGER,
    order_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_method VARCHAR(30),
    shipping_method VARCHAR(30),
    gross_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_cost DECIMAL(8, 2) DEFAULT 0.00,
    net_amount DECIMAL(12, 2) NOT NULL,
    currency_code CHAR(3) DEFAULT 'USD',
    exchange_rate DECIMAL(10, 4) DEFAULT 1.0000,
    sales_channel VARCHAR(20) DEFAULT 'online',
    promotion_code VARCHAR(50),
    referral_source VARCHAR(100),
    device_type VARCHAR(20),
    session_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Navigate here using :89 or 89G
-- =============================================================================
-- SALES REPORTING DASHBOARD (Lines 89-111)
-- Practice: Use j and k to move up/down line by line
-- =============================================================================
CREATE MATERIALIZED VIEW analytics.mv_daily_sales_summary AS
WITH daily_metrics AS (
    SELECT
        DATE(fo.order_date) as sale_date,
        COUNT(DISTINCT fo.order_id) as total_orders,
        COUNT(DISTINCT fo.customer_key) as unique_customers,
        SUM(fo.gross_amount) as gross_revenue,
        SUM(fo.discount_amount) as total_discounts,
        SUM(fo.tax_amount) as total_tax,
        SUM(fo.shipping_cost) as total_shipping,
        SUM(fo.net_amount) as net_revenue,
        AVG(fo.net_amount) as average_order_value,
        MAX(fo.net_amount) as highest_order_value,
        MIN(fo.net_amount) as lowest_order_value,
        COUNT(CASE WHEN fo.status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN fo.status = 'cancelled' THEN 1 END) as cancelled_orders,
        COUNT(CASE WHEN fo.status = 'refunded' THEN 1 END) as refunded_orders
    FROM analytics.fact_orders fo
    WHERE fo.order_date >= CURRENT_DATE - INTERVAL '365 days'
    GROUP BY DATE(fo.order_date)
),
running_totals AS (
    SELECT dm.*, SUM(dm.net_revenue) OVER (ORDER BY dm.sale_date ROWS UNBOUNDED PRECEDING) as cumulative_revenue FROM daily_metrics dm
)
SELECT * FROM running_totals ORDER BY sale_date DESC;

-- Jump to this section with :112
-- =============================================================================
-- PERFORMANCE OPTIMIZATION (Lines 112-134)
-- Practice: Use h and l to move character by character
-- =============================================================================
CREATE INDEX CONCURRENTLY idx_fact_orders_date_status ON analytics.fact_orders (order_date, status) WHERE status IN ('delivered', 'shipped');
CREATE INDEX CONCURRENTLY idx_fact_orders_customer_date ON analytics.fact_orders (customer_key, order_date DESC);
CREATE INDEX CONCURRENTLY idx_dim_products_category ON analytics.dim_products (category_level_1, category_level_2, category_level_3) WHERE is_discontinued = false;
CREATE INDEX CONCURRENTLY idx_dim_customers_segment ON analytics.dim_customers (customer_segment, last_order_date DESC) WHERE is_active = true;

-- Complex query with window functions and multiple CTEs
WITH product_performance AS (
    SELECT
        dp.product_key,
        dp.product_name,
        dp.category_level_1,
        SUM(foi.quantity) as total_quantity_sold,
        SUM(foi.quantity * foi.unit_price) as total_revenue,
        COUNT(DISTINCT fo.customer_key) as unique_buyers,
        AVG(foi.unit_price) as average_selling_price,
        RANK() OVER (PARTITION BY dp.category_level_1 ORDER BY SUM(foi.quantity * foi.unit_price) DESC) as revenue_rank_in_category,
        PERCENT_RANK() OVER (ORDER BY SUM(foi.quantity * foi.unit_price)) as revenue_percentile,
        LAG(SUM(foi.quantity * foi.unit_price)) OVER (PARTITION BY dp.category_level_1 ORDER BY SUM(foi.quantity * foi.unit_price) DESC) as next_product_revenue,
        DENSE_RANK() OVER (ORDER BY COUNT(DISTINCT fo.customer_key) DESC) as popularity_rank
    FROM analytics.dim_products dp
    JOIN analytics.fact_order_items foi ON dp.product_key = foi.product_key
    JOIN analytics.fact_orders fo ON foi.order_key = fo.order_key
    WHERE fo.order_date >= CURRENT_DATE - INTERVAL '12 months'
      AND fo.status IN ('delivered', 'shipped')
    GROUP BY dp.product_key, dp.product_name, dp.category_level_1
)
SELECT * FROM product_performance WHERE revenue_rank_in_category <= 5 ORDER BY category_level_1, revenue_rank_in_category;

-- Navigate to end of file with G, then use :135 to come back here
-- =============================================================================
-- DATA CLEANUP PROCEDURES (Lines 135-End)
-- Practice: Use gg to go to top, then G to return to bottom
-- =============================================================================
CREATE OR REPLACE FUNCTION analytics.cleanup_old_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM staging.user_sessions
    WHERE created_at < CURRENT_DATE - INTERVAL '90 days';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    INSERT INTO operational.cleanup_log (
        procedure_name,
        execution_date,
        records_processed,
        status,
        notes
    ) VALUES (
        'cleanup_old_sessions',
        CURRENT_TIMESTAMP,
        deleted_count,
        'SUCCESS',
        'Removed sessions older than 90 days'
    );

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Quarterly data archival procedure
CREATE OR REPLACE PROCEDURE analytics.archive_quarterly_data(
    IN archive_year INTEGER,
    IN archive_quarter INTEGER
)
LANGUAGE plpgsql AS $$
DECLARE
    archive_table_name TEXT;
    start_date DATE;
    end_date DATE;
    archived_records INTEGER;
BEGIN
    -- Calculate quarter date range
    start_date := DATE_TRUNC('quarter', MAKE_DATE(archive_year, (archive_quarter - 1) * 3 + 1, 1));
    end_date := start_date + INTERVAL '3 months' - INTERVAL '1 day';

    -- Create archive table name
    archive_table_name := 'fact_orders_archive_' || archive_year || '_q' || archive_quarter;

    -- Create archive table
    EXECUTE format('CREATE TABLE IF NOT EXISTS analytics.%I AS SELECT * FROM analytics.fact_orders WHERE 1=0', archive_table_name);

    -- Insert archived records
    EXECUTE format('INSERT INTO analytics.%I SELECT * FROM analytics.fact_orders WHERE order_date BETWEEN %L AND %L',
                   archive_table_name, start_date, end_date);

    GET DIAGNOSTICS archived_records = ROW_COUNT;

    -- Delete from main table
    DELETE FROM analytics.fact_orders WHERE order_date BETWEEN start_date AND end_date;

    RAISE NOTICE 'Archived % records to table %', archived_records, archive_table_name;
END;
$$;

-- =============================================================================
-- NAVIGATION EXERCISES:
-- 1. Use :25 to jump to Customer Analytics
-- 2. Use :45 to jump to Product Inventory
-- 3. Use :68 to jump to Order Processing
-- 4. Use :89 to jump to Sales Reporting
-- 5. Use :112 to jump to Performance section
-- 6. Use :135 to jump to Data Cleanup
-- 7. Practice gg (top) and G (bottom)
-- 8. Use Ctrl+f and Ctrl+b to scroll pages
-- 9. Use H, M, L for screen positioning
-- 10. Practice 0 and $ for line start/end navigation
-- =============================================================================