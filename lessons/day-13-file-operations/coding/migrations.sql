-- Day 13: Database Migrations - Schema Evolution and Data Updates
-- This file contains database migrations for practicing file navigation and editing
-- Practice: Navigate between schema.sql, migrations.sql, and queries.sql files
-- PostgreSQL Dialect

-- =============================================================================
-- MIGRATION TRACKING
-- =============================================================================

-- Create migration tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS schema_migrations (
    migration_id SERIAL PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rolled_back_at TIMESTAMP,
    checksum VARCHAR(64)
);

-- =============================================================================
-- MIGRATION 001: Initial Indexes for Performance
-- =============================================================================

-- Version: 001_add_performance_indexes
INSERT INTO schema_migrations (version, description)
VALUES ('001_add_performance_indexes', 'Add essential indexes for query performance')
ON CONFLICT (version) DO NOTHING;

-- Indexes for companies table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_industry
    ON companies(industry) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_type_revenue
    ON companies(company_type, annual_revenue DESC) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_companies_country_city
    ON companies(headquarters_country, headquarters_city) WHERE active = true;

-- Indexes for employees table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employees_company_dept
    ON employees(company_id, department_id) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employees_manager
    ON employees(manager_id) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employees_hire_date
    ON employees(hire_date) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employees_email_lower
    ON employees(LOWER(email)) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employees_skills_gin
    ON employees USING GIN(skills) WHERE active = true;

-- Indexes for customers table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_email_lower
    ON customers(LOWER(email)) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_registration_date
    ON customers(registration_date) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_type_tier
    ON customers(customer_type, loyalty_tier) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_lifetime_value
    ON customers(lifetime_value DESC) WHERE active = true;

-- Indexes for products table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_category
    ON products(category_id) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_supplier
    ON products(supplier_id) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_sku_unique
    ON products(UPPER(sku)) WHERE active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_price_range
    ON products(price) WHERE active = true AND price > 0;

-- Indexes for orders table
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_date
    ON orders(customer_id, order_date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_status_date
    ON orders(order_status, order_date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_sales_rep
    ON orders(sales_rep_id, order_date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_total_amount
    ON orders(total_amount DESC) WHERE order_status IN ('delivered', 'shipped');

-- =============================================================================
-- MIGRATION 002: Add Audit Trails
-- =============================================================================

-- Version: 002_add_audit_trails
INSERT INTO schema_migrations (version, description)
VALUES ('002_add_audit_trails', 'Add audit trail functionality for critical tables')
ON CONFLICT (version) DO NOTHING;

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    audit_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_by INTEGER REFERENCES employees(employee_id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_reason TEXT,
    ip_address INET,
    user_agent TEXT
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, changed_at)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), CURRENT_TIMESTAMP);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, new_values, changed_at)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, operation, new_values, changed_at)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), CURRENT_TIMESTAMP);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for critical tables
CREATE TRIGGER audit_customers_trigger
    AFTER INSERT OR UPDATE OR DELETE ON customers
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_orders_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_products_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =============================================================================
-- MIGRATION 003: Add Data Validation Constraints
-- =============================================================================

-- Version: 003_add_validation_constraints
INSERT INTO schema_migrations (version, description)
VALUES ('003_add_validation_constraints', 'Add comprehensive data validation constraints')
ON CONFLICT (version) DO NOTHING;

-- Add check constraints for companies
ALTER TABLE companies
ADD CONSTRAINT check_founded_year
CHECK (founded_year IS NULL OR (founded_year >= 1800 AND founded_year <= EXTRACT(YEAR FROM CURRENT_DATE)));

ALTER TABLE companies
ADD CONSTRAINT check_employee_count
CHECK (employee_count IS NULL OR employee_count >= 0);

ALTER TABLE companies
ADD CONSTRAINT check_annual_revenue
CHECK (annual_revenue IS NULL OR annual_revenue >= 0);

-- Add check constraints for employees
ALTER TABLE employees
ADD CONSTRAINT check_hire_date
CHECK (hire_date >= '1900-01-01' AND hire_date <= CURRENT_DATE + INTERVAL '1 year');

ALTER TABLE employees
ADD CONSTRAINT check_termination_after_hire
CHECK (termination_date IS NULL OR termination_date >= hire_date);

ALTER TABLE employees
ADD CONSTRAINT check_salary_positive
CHECK (salary IS NULL OR salary > 0);

-- Add check constraints for customers
ALTER TABLE customers
ADD CONSTRAINT check_birth_date
CHECK (birth_date IS NULL OR (birth_date >= '1900-01-01' AND birth_date <= CURRENT_DATE - INTERVAL '13 years'));

ALTER TABLE customers
ADD CONSTRAINT check_customer_revenue
CHECK (annual_revenue IS NULL OR annual_revenue >= 0);

-- Add check constraints for products
ALTER TABLE products
ADD CONSTRAINT check_product_price
CHECK (price > 0);

ALTER TABLE products
ADD CONSTRAINT check_product_cost
CHECK (cost IS NULL OR cost >= 0);

ALTER TABLE products
ADD CONSTRAINT check_weight
CHECK (weight IS NULL OR weight > 0);

-- =============================================================================
-- MIGRATION 004: Performance and Analytics Enhancements
-- =============================================================================

-- Version: 004_analytics_enhancements
INSERT INTO schema_migrations (version, description)
VALUES ('004_analytics_enhancements', 'Add materialized views and analytics functions')
ON CONFLICT (version) DO NOTHING;

-- Create materialized view for sales analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS monthly_sales_summary AS
WITH monthly_data AS (
    SELECT
        DATE_TRUNC('month', o.order_date) as month,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        COUNT(o.order_id) as total_orders,
        SUM(o.total_amount) as total_revenue,
        AVG(o.total_amount) as avg_order_value,
        SUM(oi.quantity) as total_items_sold
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.order_status IN ('delivered', 'shipped')
    GROUP BY DATE_TRUNC('month', o.order_date)
)
SELECT
    month,
    unique_customers,
    total_orders,
    total_revenue,
    avg_order_value,
    total_items_sold,
    LAG(total_revenue) OVER (ORDER BY month) as prev_month_revenue,
    total_revenue - LAG(total_revenue) OVER (ORDER BY month) as revenue_change,
    ROUND(
        ((total_revenue - LAG(total_revenue) OVER (ORDER BY month)) /
         NULLIF(LAG(total_revenue) OVER (ORDER BY month), 0) * 100), 2
    ) as revenue_growth_percentage
FROM monthly_data
ORDER BY month;

-- Create refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_monthly_sales_summary()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales_summary;
END;
$$ LANGUAGE plpgsql;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_monthly_sales_summary_month
    ON monthly_sales_summary(month);

-- =============================================================================
-- MIGRATION 005: Add Advanced Features
-- =============================================================================

-- Version: 005_advanced_features
INSERT INTO schema_migrations (version, description)
VALUES ('005_advanced_features', 'Add advanced database features and functions')
ON CONFLICT (version) DO NOTHING;

-- Create custom data types
CREATE TYPE order_priority AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE shipping_method AS ENUM ('standard', 'expedited', 'overnight', 'pickup');

-- Add new columns using custom types
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS priority order_priority DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS shipping_method shipping_method DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE;

-- Create function for calculating shipping cost
CREATE OR REPLACE FUNCTION calculate_shipping_cost(
    shipping_method shipping_method,
    order_total DECIMAL,
    customer_tier VARCHAR(50)
) RETURNS DECIMAL AS $$
DECLARE
    base_cost DECIMAL := 0;
    tier_discount DECIMAL := 0;
BEGIN
    -- Base shipping costs
    CASE shipping_method
        WHEN 'standard' THEN base_cost := 5.99;
        WHEN 'expedited' THEN base_cost := 12.99;
        WHEN 'overnight' THEN base_cost := 24.99;
        WHEN 'pickup' THEN base_cost := 0;
    END CASE;

    -- Free shipping threshold
    IF order_total >= 100 THEN
        base_cost := 0;
    END IF;

    -- Tier discounts
    CASE customer_tier
        WHEN 'platinum' THEN tier_discount := 1.0; -- Free shipping
        WHEN 'gold' THEN tier_discount := 0.5;
        WHEN 'silver' THEN tier_discount := 0.25;
        ELSE tier_discount := 0;
    END CASE;

    RETURN GREATEST(base_cost * (1 - tier_discount), 0);
END;
$$ LANGUAGE plpgsql;

-- Create function for customer segmentation
CREATE OR REPLACE FUNCTION get_customer_segment(
    total_orders INTEGER,
    lifetime_value DECIMAL,
    days_since_last_order INTEGER
) RETURNS VARCHAR(50) AS $$
BEGIN
    IF total_orders = 0 OR days_since_last_order > 365 THEN
        RETURN 'Inactive';
    ELSIF total_orders >= 20 AND lifetime_value >= 5000 THEN
        RETURN 'VIP';
    ELSIF total_orders >= 10 AND lifetime_value >= 2000 THEN
        RETURN 'Loyal';
    ELSIF total_orders >= 5 AND lifetime_value >= 500 THEN
        RETURN 'Regular';
    ELSIF total_orders >= 2 THEN
        RETURN 'Developing';
    ELSE
        RETURN 'New';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- MIGRATION 006: Full-Text Search Implementation
-- =============================================================================

-- Version: 006_fulltext_search
INSERT INTO schema_migrations (version, description)
VALUES ('006_fulltext_search', 'Implement full-text search capabilities')
ON CONFLICT (version) DO NOTHING;

-- Add full-text search columns
ALTER TABLE products
ADD COLUMN IF NOT EXISTS search_vector tsvector;

ALTER TABLE customers
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to update product search vector
CREATE OR REPLACE FUNCTION update_product_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.product_name, '') || ' ' ||
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(NEW.brand, '') || ' ' ||
        COALESCE(NEW.model, '') || ' ' ||
        COALESCE(NEW.sku, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to update customer search vector
CREATE OR REPLACE FUNCTION update_customer_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.first_name, '') || ' ' ||
        COALESCE(NEW.last_name, '') || ' ' ||
        COALESCE(NEW.company_name, '') || ' ' ||
        COALESCE(NEW.email, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for search vector updates
CREATE TRIGGER product_search_vector_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_product_search_vector();

CREATE TRIGGER customer_search_vector_trigger
    BEFORE INSERT OR UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_customer_search_vector();

-- Create indexes for full-text search
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_search_vector
    ON products USING GIN(search_vector);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_customers_search_vector
    ON customers USING GIN(search_vector);

-- Update existing records
UPDATE products SET search_vector = to_tsvector('english',
    COALESCE(product_name, '') || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(brand, '') || ' ' ||
    COALESCE(model, '') || ' ' ||
    COALESCE(sku, '')
) WHERE search_vector IS NULL;

UPDATE customers SET search_vector = to_tsvector('english',
    COALESCE(first_name, '') || ' ' ||
    COALESCE(last_name, '') || ' ' ||
    COALESCE(company_name, '') || ' ' ||
    COALESCE(email, '')
) WHERE search_vector IS NULL;

-- =============================================================================
-- MIGRATION 007: Data Archiving and Partitioning
-- =============================================================================

-- Version: 007_archiving_partitioning
INSERT INTO schema_migrations (version, description)
VALUES ('007_archiving_partitioning', 'Implement data archiving and table partitioning')
ON CONFLICT (version) DO NOTHING;

-- Create archived orders table for old data
CREATE TABLE IF NOT EXISTS orders_archived (
    LIKE orders INCLUDING ALL
);

-- Create function to archive old orders
CREATE OR REPLACE FUNCTION archive_old_orders(cutoff_date DATE)
RETURNS INTEGER AS $$
DECLARE
    rows_moved INTEGER;
BEGIN
    -- Move old orders to archive table
    WITH moved_orders AS (
        DELETE FROM orders
        WHERE order_date < cutoff_date
        AND order_status IN ('delivered', 'cancelled')
        RETURNING *
    )
    INSERT INTO orders_archived SELECT * FROM moved_orders;

    GET DIAGNOSTICS rows_moved = ROW_COUNT;
    RETURN rows_moved;
END;
$$ LANGUAGE plpgsql;

-- Create partition table for audit logs by month
CREATE TABLE IF NOT EXISTS audit_log_partitioned (
    LIKE audit_log INCLUDING ALL
) PARTITION BY RANGE (changed_at);

-- Create partitions for current and next few months
CREATE TABLE IF NOT EXISTS audit_log_2024_01 PARTITION OF audit_log_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE IF NOT EXISTS audit_log_2024_02 PARTITION OF audit_log_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE IF NOT EXISTS audit_log_2024_03 PARTITION OF audit_log_partitioned
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

-- =============================================================================
-- ROLLBACK PROCEDURES
-- =============================================================================

-- Create rollback function for migrations
CREATE OR REPLACE FUNCTION rollback_migration(migration_version VARCHAR(50))
RETURNS BOOLEAN AS $$
DECLARE
    rollback_successful BOOLEAN := FALSE;
BEGIN
    -- Log rollback attempt
    UPDATE schema_migrations
    SET rolled_back_at = CURRENT_TIMESTAMP
    WHERE version = migration_version;

    -- Specific rollback logic would go here based on migration_version
    -- This is a simplified example

    CASE migration_version
        WHEN '001_add_performance_indexes' THEN
            -- Drop performance indexes
            DROP INDEX IF EXISTS idx_companies_industry;
            DROP INDEX IF EXISTS idx_employees_company_dept;
            -- ... other index drops
            rollback_successful := TRUE;

        WHEN '002_add_audit_trails' THEN
            -- Drop audit triggers and functions
            DROP TRIGGER IF EXISTS audit_customers_trigger ON customers;
            DROP FUNCTION IF EXISTS audit_trigger_function();
            DROP TABLE IF EXISTS audit_log;
            rollback_successful := TRUE;

        ELSE
            RAISE NOTICE 'No rollback procedure defined for migration: %', migration_version;
    END CASE;

    RETURN rollback_successful;
END;
$$ LANGUAGE plpgsql;