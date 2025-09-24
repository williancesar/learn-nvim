-- =============================================================================
-- DAY 07: COPY & PASTE - SQL Practice File
-- =============================================================================
--
-- LEARNING OBJECTIVES:
-- - Use 'yy' to yank (copy) entire lines
-- - Use 'y' with motions (yw, y$, y2j, etc.)
-- - Use 'p' to paste after cursor/line
-- - Use 'P' to paste before cursor/line
-- - Practice copying SQL patterns and templates
-- - Duplicate and modify common query structures
-- - Copy CTEs and window functions for reuse
--
-- COPY & PASTE TASKS:
-- This file contains SQL patterns, CTEs, and query templates that need duplication.
-- Practice copying various elements and pasting them to create similar structures.
-- Modify copied patterns to create variations and avoid redundancy.
--
-- COPY TARGETS:
-- - CTE definitions for reuse in multiple queries
-- - Window function patterns
-- - Complex JOIN structures
-- - Stored procedure templates
-- - Index creation patterns
-- - Table definition templates
-- =============================================================================

-- Data Warehouse Schema for Business Intelligence
CREATE DATABASE business_intelligence_warehouse;
USE business_intelligence_warehouse;

-- Schema organization for data warehouse layers
CREATE SCHEMA raw_layer;      -- Landing zone for raw data
CREATE SCHEMA staging_layer;  -- Data transformation staging
CREATE SCHEMA presentation;   -- Curated data for analytics

-- =============================================================================
-- REUSABLE CTE PATTERNS FOR COPYING
-- Practice copying these CTEs and adapting them for different use cases
-- =============================================================================

-- CTE Pattern 1: Date Dimension Generator
-- Copy this CTE pattern and modify for different date ranges
WITH date_dimension AS (
    SELECT
        date_value,
        EXTRACT(YEAR FROM date_value) AS year_number,
        EXTRACT(QUARTER FROM date_value) AS quarter_number,
        EXTRACT(MONTH FROM date_value) AS month_number,
        EXTRACT(DAY FROM date_value) AS day_number,
        EXTRACT(DOW FROM date_value) AS day_of_week,
        TO_CHAR(date_value, 'Day') AS day_name,
        TO_CHAR(date_value, 'Month') AS month_name,
        CASE WHEN EXTRACT(DOW FROM date_value) IN (0, 6) THEN 'Weekend' ELSE 'Weekday' END AS day_type
    FROM generate_series('2020-01-01'::date, '2025-12-31'::date, '1 day'::interval) AS date_value
)
SELECT * FROM date_dimension WHERE year_number = 2024;

-- CTE Pattern 2: Running Totals and Window Functions
-- Copy this pattern for different metrics and calculations
WITH sales_metrics AS (
    SELECT
        sale_date,
        product_id,
        customer_id,
        sale_amount,
        SUM(sale_amount) OVER (
            ORDER BY sale_date
            ROWS UNBOUNDED PRECEDING
        ) AS running_total,
        AVG(sale_amount) OVER (
            ORDER BY sale_date
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) AS seven_day_moving_avg,
        ROW_NUMBER() OVER (
            PARTITION BY customer_id
            ORDER BY sale_date
        ) AS purchase_sequence,
        RANK() OVER (
            PARTITION BY DATE_TRUNC('month', sale_date)
            ORDER BY sale_amount DESC
        ) AS monthly_rank
    FROM sales_transactions
    WHERE sale_date >= CURRENT_DATE - INTERVAL '365 days'
)
SELECT * FROM sales_metrics ORDER BY sale_date;

-- =============================================================================
-- TABLE DEFINITION TEMPLATES FOR COPYING
-- Copy these table patterns and modify for different entity types
-- =============================================================================

-- Template 1: Dimensional Table Pattern
-- Copy this structure for other dimension tables
CREATE TABLE presentation.dim_customer (
    customer_key SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    customer_name VARCHAR(200) NOT NULL,
    customer_type VARCHAR(50),
    segment VARCHAR(50),
    region VARCHAR(100),
    country VARCHAR(100),
    registration_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    effective_to DATE DEFAULT '9999-12-31',
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Template 2: Fact Table Pattern
-- Copy this structure for other fact tables
CREATE TABLE presentation.fact_sales (
    sales_key SERIAL PRIMARY KEY,
    date_key INTEGER NOT NULL,
    customer_key INTEGER NOT NULL,
    product_key INTEGER NOT NULL,
    sales_rep_key INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    profit_margin DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEX PATTERNS FOR DUPLICATION
-- Copy these index patterns for different tables
-- =============================================================================

-- Index Pattern 1: Dimensional Table Indexes
-- Copy and modify for other dimension tables
CREATE INDEX idx_dim_customer_id ON presentation.dim_customer (customer_id);
CREATE INDEX idx_dim_customer_type ON presentation.dim_customer (customer_type, status);
CREATE INDEX idx_dim_customer_region ON presentation.dim_customer (region, country);
CREATE INDEX idx_dim_customer_dates ON presentation.dim_customer (effective_from, effective_to);

-- Index Pattern 2: Fact Table Indexes
-- Copy and adapt for other fact tables
CREATE INDEX idx_fact_sales_date ON presentation.fact_sales (date_key);
CREATE INDEX idx_fact_sales_customer ON presentation.fact_sales (customer_key);
CREATE INDEX idx_fact_sales_product ON presentation.fact_sales (product_key);
CREATE INDEX idx_fact_sales_compound ON presentation.fact_sales (date_key, customer_key, product_key);

-- =============================================================================
-- COMPLEX QUERY PATTERNS FOR COPYING
-- Practice copying these query structures and adapting them
-- =============================================================================

-- Query Pattern 1: Cohort Analysis Template
-- Copy this pattern for different cohort analyses
WITH customer_cohorts AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', MIN(first_purchase_date)) AS cohort_month,
        DATE_TRUNC('month', purchase_date) AS purchase_month,
        EXTRACT(YEAR FROM AGE(DATE_TRUNC('month', purchase_date), DATE_TRUNC('month', MIN(first_purchase_date) OVER (PARTITION BY customer_id)))) * 12 +
        EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', purchase_date), DATE_TRUNC('month', MIN(first_purchase_date) OVER (PARTITION BY customer_id)))) AS period_number
    FROM customer_purchases
    GROUP BY customer_id, purchase_date
),
cohort_data AS (
    SELECT
        cohort_month,
        period_number,
        COUNT(DISTINCT customer_id) AS customers
    FROM customer_cohorts
    GROUP BY cohort_month, period_number
),
cohort_sizes AS (
    SELECT
        cohort_month,
        COUNT(DISTINCT customer_id) AS total_customers
    FROM customer_cohorts
    WHERE period_number = 0
    GROUP BY cohort_month
)
SELECT
    cd.cohort_month,
    cs.total_customers,
    cd.period_number,
    cd.customers,
    ROUND(cd.customers::DECIMAL / cs.total_customers * 100, 2) AS retention_rate
FROM cohort_data cd
JOIN cohort_sizes cs ON cd.cohort_month = cs.cohort_month
ORDER BY cd.cohort_month, cd.period_number;

-- Query Pattern 2: Time Series Analysis Template
-- Copy this pattern for different time series metrics
WITH daily_metrics AS (
    SELECT
        DATE_TRUNC('day', transaction_timestamp) AS metric_date,
        COUNT(*) AS transaction_count,
        SUM(amount) AS total_amount,
        AVG(amount) AS avg_amount,
        STDDEV(amount) AS amount_stddev,
        MIN(amount) AS min_amount,
        MAX(amount) AS max_amount,
        COUNT(DISTINCT customer_id) AS unique_customers
    FROM transactions
    WHERE transaction_timestamp >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY DATE_TRUNC('day', transaction_timestamp)
),
metrics_with_trends AS (
    SELECT
        metric_date,
        transaction_count,
        total_amount,
        avg_amount,
        LAG(transaction_count, 1) OVER (ORDER BY metric_date) AS prev_day_count,
        LAG(total_amount, 1) OVER (ORDER BY metric_date) AS prev_day_amount,
        AVG(transaction_count) OVER (ORDER BY metric_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS seven_day_avg_count,
        AVG(total_amount) OVER (ORDER BY metric_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS seven_day_avg_amount
    FROM daily_metrics
)
SELECT
    metric_date,
    transaction_count,
    total_amount,
    CASE
        WHEN prev_day_count > 0 THEN ROUND((transaction_count - prev_day_count)::DECIMAL / prev_day_count * 100, 2)
        ELSE NULL
    END AS count_change_percent,
    CASE
        WHEN prev_day_amount > 0 THEN ROUND((total_amount - prev_day_amount) / prev_day_amount * 100, 2)
        ELSE NULL
    END AS amount_change_percent,
    seven_day_avg_count,
    seven_day_avg_amount
FROM metrics_with_trends
ORDER BY metric_date;

-- =============================================================================
-- STORED PROCEDURE TEMPLATES FOR COPYING
-- Copy these procedure patterns and modify for different use cases
-- =============================================================================

-- Procedure Template 1: Data Quality Check
-- Copy this template for different data quality validations
CREATE OR REPLACE FUNCTION data_quality_check_template(
    table_name_param TEXT,
    check_date_param DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    check_name VARCHAR(100),
    check_result VARCHAR(20),
    record_count INTEGER,
    issue_description TEXT
) AS $$
DECLARE
    total_records INTEGER;
    null_records INTEGER;
    duplicate_records INTEGER;
BEGIN
    -- Get total record count
    EXECUTE format('SELECT COUNT(*) FROM %I', table_name_param) INTO total_records;

    -- Check for null values in critical fields
    EXECUTE format('SELECT COUNT(*) FROM %I WHERE customer_id IS NULL', table_name_param) INTO null_records;

    -- Check for duplicate records
    EXECUTE format('SELECT COUNT(*) - COUNT(DISTINCT customer_id) FROM %I', table_name_param) INTO duplicate_records;

    -- Return results
    RETURN QUERY VALUES
        ('Total Records', 'INFO', total_records, 'Total record count'),
        ('Null Customer IDs', CASE WHEN null_records = 0 THEN 'PASS' ELSE 'FAIL' END, null_records, 'Records with null customer_id'),
        ('Duplicate Records', CASE WHEN duplicate_records = 0 THEN 'PASS' ELSE 'FAIL' END, duplicate_records, 'Duplicate customer records');
END;
$$ LANGUAGE plpgsql;

-- Procedure Template 2: Aggregation Builder
-- Copy this template for different aggregation patterns
CREATE OR REPLACE FUNCTION build_aggregation_template(
    source_table TEXT,
    group_by_column TEXT,
    date_column TEXT,
    metric_column TEXT,
    aggregation_type TEXT DEFAULT 'SUM'
)
RETURNS TEXT AS $$
DECLARE
    query_text TEXT;
BEGIN
    query_text := format('
        WITH aggregated_data AS (
            SELECT
                %I AS group_field,
                DATE_TRUNC(''month'', %I) AS period,
                %s(%I) AS metric_value,
                COUNT(*) AS record_count
            FROM %I
            WHERE %I >= CURRENT_DATE - INTERVAL ''12 months''
            GROUP BY %I, DATE_TRUNC(''month'', %I)
        ),
        trend_analysis AS (
            SELECT
                group_field,
                period,
                metric_value,
                LAG(metric_value) OVER (PARTITION BY group_field ORDER BY period) AS prev_period_value,
                AVG(metric_value) OVER (PARTITION BY group_field ORDER BY period ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS three_month_avg
            FROM aggregated_data
        )
        SELECT
            group_field,
            period,
            metric_value,
            prev_period_value,
            three_month_avg,
            CASE
                WHEN prev_period_value > 0 THEN ROUND((metric_value - prev_period_value) / prev_period_value * 100, 2)
                ELSE NULL
            END AS percent_change
        FROM trend_analysis
        ORDER BY group_field, period',
        group_by_column, date_column, aggregation_type, metric_column, source_table,
        date_column, group_by_column, date_column
    );

    RETURN query_text;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- WINDOW FUNCTION PATTERNS FOR COPYING
-- Practice copying these window function templates
-- =============================================================================

-- Window Pattern 1: Ranking and Percentiles
-- Copy this pattern for different ranking scenarios
SELECT
    customer_id,
    order_date,
    order_amount,
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) AS order_sequence,
    RANK() OVER (ORDER BY order_amount DESC) AS amount_rank,
    DENSE_RANK() OVER (PARTITION BY DATE_TRUNC('month', order_date) ORDER BY order_amount DESC) AS monthly_rank,
    PERCENT_RANK() OVER (ORDER BY order_amount) AS amount_percentile,
    NTILE(4) OVER (ORDER BY order_amount) AS quartile,
    CUME_DIST() OVER (ORDER BY order_amount) AS cumulative_distribution
FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '6 months';

-- Window Pattern 2: Lead/Lag Analysis
-- Copy this pattern for different time-based comparisons
SELECT
    product_id,
    sale_date,
    daily_sales,
    LAG(daily_sales, 1) OVER (PARTITION BY product_id ORDER BY sale_date) AS previous_day_sales,
    LEAD(daily_sales, 1) OVER (PARTITION BY product_id ORDER BY sale_date) AS next_day_sales,
    LAG(daily_sales, 7) OVER (PARTITION BY product_id ORDER BY sale_date) AS same_day_last_week,
    FIRST_VALUE(daily_sales) OVER (PARTITION BY product_id, DATE_TRUNC('month', sale_date) ORDER BY sale_date) AS month_first_day_sales,
    LAST_VALUE(daily_sales) OVER (
        PARTITION BY product_id, DATE_TRUNC('month', sale_date)
        ORDER BY sale_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS month_last_day_sales
FROM daily_product_sales
ORDER BY product_id, sale_date;

-- =============================================================================
-- JSON PROCESSING PATTERNS FOR COPYING
-- Copy these JSON patterns for different data structures
-- =============================================================================

-- JSON Pattern 1: Nested Object Processing
-- Copy this pattern for different JSON structures
WITH json_data AS (
    SELECT
        customer_id,
        preferences::json AS customer_preferences,
        order_history::json AS order_data
    FROM customer_profiles
),
extracted_preferences AS (
    SELECT
        customer_id,
        preferences->>'language' AS preferred_language,
        preferences->>'currency' AS preferred_currency,
        (preferences->'notifications'->>'email')::boolean AS email_notifications,
        (preferences->'notifications'->>'sms')::boolean AS sms_notifications,
        json_array_length(preferences->'interests') AS interest_count,
        preferences->'interests' AS interests_array
    FROM json_data
)
SELECT
    customer_id,
    preferred_language,
    preferred_currency,
    email_notifications,
    sms_notifications,
    interest_count,
    json_array_elements_text(interests_array) AS individual_interest
FROM extracted_preferences;

-- =============================================================================
-- PERFORMANCE OPTIMIZATION PATTERNS FOR COPYING
-- Copy these optimization patterns for different scenarios
-- =============================================================================

-- Optimization Pattern 1: Partitioned Aggregation
-- Copy this pattern for large table aggregations
WITH partitioned_data AS (
    SELECT
        DATE_TRUNC('week', created_at) AS week_start,
        category,
        COUNT(*) AS record_count,
        SUM(amount) AS total_amount,
        AVG(amount) AS avg_amount
    FROM large_transactions_table
    WHERE created_at >= CURRENT_DATE - INTERVAL '52 weeks'
    GROUP BY DATE_TRUNC('week', created_at), category
),
weekly_totals AS (
    SELECT
        week_start,
        SUM(record_count) AS total_records,
        SUM(total_amount) AS weekly_total,
        AVG(avg_amount) AS weekly_avg
    FROM partitioned_data
    GROUP BY week_start
)
SELECT
    pd.week_start,
    pd.category,
    pd.record_count,
    pd.total_amount,
    pd.avg_amount,
    wt.total_records,
    wt.weekly_total,
    ROUND(pd.total_amount / wt.weekly_total * 100, 2) AS category_percentage
FROM partitioned_data pd
JOIN weekly_totals wt ON pd.week_start = wt.week_start
ORDER BY pd.week_start, pd.total_amount DESC;

-- =============================================================================
-- COPY & PASTE PRACTICE EXERCISES:
--
-- 1. CTE DUPLICATION:
--    - Copy the date_dimension CTE and modify for different date ranges
--    - Copy sales_metrics CTE and adapt for inventory or customer metrics
--    - Create variations of cohort_analysis for different business metrics
--
-- 2. TABLE TEMPLATE COPYING:
--    - Copy dim_customer template to create dim_product table
--    - Copy fact_sales template to create fact_inventory table
--    - Duplicate index patterns for new tables
--
-- 3. QUERY PATTERN REPLICATION:
--    - Copy time series analysis for different metrics
--    - Duplicate window function patterns for new calculations
--    - Copy JSON processing patterns for different data structures
--
-- 4. PROCEDURE TEMPLATE ADAPTATION:
--    - Copy data_quality_check_template for different validations
--    - Duplicate aggregation_builder for different groupings
--    - Create variations of optimization patterns
--
-- 5. ADVANCED COPY OPERATIONS:
--    - Use 'y2j' to copy 2 lines including current
--    - Use 'y$' to copy from cursor to end of line
--    - Use 'yiw' to copy inner word (useful for column names)
--    - Use 'yi(' to copy content within parentheses
--    - Use 'ya{' to copy content including braces
--
-- 6. PASTE VARIATIONS:
--    - Use 'p' to paste after cursor/line
--    - Use 'P' to paste before cursor/line
--    - Use ']p' to paste with proper indentation
--    - Practice pasting multiple copied elements
-- =============================================================================