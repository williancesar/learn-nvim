-- =============================================================================
-- DAY 04: LINE OPERATIONS - SQL Practice File
-- =============================================================================
--
-- LEARNING OBJECTIVES:
-- - Use 'dd' to delete entire lines
-- - Use 'yy' to yank (copy) entire lines
-- - Use 'cc' to change entire lines
-- - Use 'S' to substitute entire lines
-- - Use numbers with line operations (3dd, 5yy, etc.)
-- - Navigate to specific line numbers efficiently
-- - Practice line-level editing operations
--
-- FILE STRUCTURE - NUMBERED SECTIONS:
-- Section 01 (Lines 25-45): Database Setup and Schema Creation
-- Section 02 (Lines 50-75): Core Tables and Relationships
-- Section 03 (Lines 80-105): Indexes and Constraints
-- Section 04 (Lines 110-135): Views and Materialized Views
-- Section 05 (Lines 140-165): Stored Procedures and Functions
-- Section 06 (Lines 170-195): Triggers and Event Handlers
-- Section 07 (Lines 200-225): Data Import and ETL Procedures
-- Section 08 (Lines 230-255): Analytics and Reporting Queries
-- Section 09 (Lines 260-285): Performance Monitoring
-- Section 10 (Lines 290-315): Backup and Maintenance Scripts
-- =============================================================================

-- =============================================================================
-- SECTION 01: DATABASE SETUP AND SCHEMA CREATION (Lines 25-45)
-- Practice: Use 'dd' to delete lines, 'yy' to copy entire schema definitions
-- Navigate here with :25 or 25G
-- =============================================================================

CREATE DATABASE enterprise_analytics_platform;
USE enterprise_analytics_platform;

-- Create schemas for different data domains
CREATE SCHEMA raw_data;
CREATE SCHEMA staging;
CREATE SCHEMA processed;
CREATE SCHEMA analytics;
CREATE SCHEMA reporting;
CREATE SCHEMA archive;

-- Set default schema search path
SET search_path = processed, analytics, staging, raw_data, public;

-- Create custom data types for consistent usage
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'deleted');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cryptocurrency');
CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');

-- Create extension for additional functionality
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================================================
-- SECTION 02: CORE TABLES AND RELATIONSHIPS (Lines 50-75)
-- Practice: Use '3dd' to delete 3 lines, '5yy' to copy 5 lines
-- Navigate here with :50 or 50G
-- =============================================================================

-- Users table with comprehensive user information
CREATE TABLE processed.users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    status user_status DEFAULT 'active',
    subscription_tier subscription_tier DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    profile_picture_url TEXT,
    bio TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    language_preference VARCHAR(10) DEFAULT 'en',
    marketing_opt_in BOOLEAN DEFAULT FALSE,
    data_processing_consent BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMP WITH TIME ZONE,
    privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- SECTION 03: INDEXES AND CONSTRAINTS (Lines 80-105)
-- Practice: Use 'cc' to change entire constraint definitions
-- Navigate here with :80 or 80G
-- =============================================================================

-- Primary indexes for performance optimization
CREATE INDEX CONCURRENTLY idx_users_email ON processed.users (email);
CREATE INDEX CONCURRENTLY idx_users_username ON processed.users (username);
CREATE INDEX CONCURRENTLY idx_users_status ON processed.users (status) WHERE status IN ('active', 'suspended');
CREATE INDEX CONCURRENTLY idx_users_subscription ON processed.users (subscription_tier, created_at);
CREATE INDEX CONCURRENTLY idx_users_last_login ON processed.users (last_login_at DESC) WHERE status = 'active';

-- Composite indexes for complex queries
CREATE INDEX CONCURRENTLY idx_users_compound_search ON processed.users (status, subscription_tier, created_at);
CREATE INDEX CONCURRENTLY idx_users_text_search ON processed.users USING gin (to_tsvector('english', first_name || ' ' || last_name || ' ' || username));

-- Partial indexes for specific use cases
CREATE INDEX CONCURRENTLY idx_users_premium_active ON processed.users (user_id, created_at) WHERE status = 'active' AND subscription_tier IN ('premium', 'enterprise');
CREATE INDEX CONCURRENTLY idx_users_unverified_email ON processed.users (created_at) WHERE email_verified = FALSE AND created_at > CURRENT_DATE - INTERVAL '30 days';

-- Check constraints for data integrity
ALTER TABLE processed.users ADD CONSTRAINT chk_users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE processed.users ADD CONSTRAINT chk_users_age_reasonable CHECK (date_of_birth IS NULL OR date_of_birth BETWEEN CURRENT_DATE - INTERVAL '120 years' AND CURRENT_DATE - INTERVAL '13 years');
ALTER TABLE processed.users ADD CONSTRAINT chk_users_phone_format CHECK (phone_number IS NULL OR phone_number ~* '^\+?[\d\s\-\(\)]{7,20}$');

-- =============================================================================
-- SECTION 04: VIEWS AND MATERIALIZED VIEWS (Lines 110-135)
-- Practice: Use 'S' to substitute entire view definitions
-- Navigate here with :110 or 110G
-- =============================================================================

-- User summary view for reporting
CREATE VIEW analytics.user_summary AS
SELECT
    u.user_id,
    u.username,
    u.email,
    u.first_name,
    u.last_name,
    u.status,
    u.subscription_tier,
    u.created_at,
    u.last_login_at,
    DATE_PART('year', AGE(u.date_of_birth)) AS age,
    CASE
        WHEN u.last_login_at >= CURRENT_DATE - INTERVAL '7 days' THEN 'Highly Active'
        WHEN u.last_login_at >= CURRENT_DATE - INTERVAL '30 days' THEN 'Active'
        WHEN u.last_login_at >= CURRENT_DATE - INTERVAL '90 days' THEN 'Inactive'
        ELSE 'Dormant'
    END AS activity_level,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - u.created_at)) / 86400 AS days_since_registration
FROM processed.users u
WHERE u.status != 'deleted';

-- Materialized view for dashboard analytics
CREATE MATERIALIZED VIEW analytics.daily_user_metrics AS
SELECT
    DATE(created_at) AS registration_date,
    subscription_tier,
    COUNT(*) AS new_registrations,
    COUNT(CASE WHEN email_verified = TRUE THEN 1 END) AS verified_registrations,
    COUNT(CASE WHEN two_factor_enabled = TRUE THEN 1 END) AS two_factor_enabled_count,
    COUNT(CASE WHEN marketing_opt_in = TRUE THEN 1 END) AS marketing_opted_in_count
FROM processed.users
WHERE created_at >= CURRENT_DATE - INTERVAL '365 days'
GROUP BY DATE(created_at), subscription_tier
ORDER BY registration_date DESC, subscription_tier;

-- =============================================================================
-- SECTION 05: STORED PROCEDURES AND FUNCTIONS (Lines 140-165)
-- Practice: Use number + 'dd' to delete multiple function lines
-- Navigate here with :140 or 140G
-- =============================================================================

-- Function to calculate user engagement score
CREATE OR REPLACE FUNCTION analytics.calculate_user_engagement_score(
    user_id_param UUID,
    days_back INTEGER DEFAULT 30
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    login_frequency DECIMAL;
    activity_score DECIMAL;
    subscription_bonus DECIMAL;
    final_score DECIMAL;
BEGIN
    -- Calculate login frequency
    SELECT COUNT(*)::DECIMAL / days_back
    INTO login_frequency
    FROM user_activity_logs
    WHERE user_id = user_id_param
      AND activity_type = 'login'
      AND created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back;

    -- Calculate activity score based on various actions
    SELECT COALESCE(SUM(CASE
        WHEN activity_type = 'page_view' THEN 1
        WHEN activity_type = 'search' THEN 2
        WHEN activity_type = 'purchase' THEN 10
        WHEN activity_type = 'review' THEN 5
        ELSE 0
    END), 0)::DECIMAL / days_back
    INTO activity_score
    FROM user_activity_logs
    WHERE user_id = user_id_param
      AND created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back;

    -- Add subscription tier bonus
    SELECT CASE
        WHEN subscription_tier = 'enterprise' THEN 2.0
        WHEN subscription_tier = 'premium' THEN 1.5
        WHEN subscription_tier = 'basic' THEN 1.2
        ELSE 1.0
    END
    INTO subscription_bonus
    FROM processed.users
    WHERE user_id = user_id_param;

    -- Calculate final engagement score
    final_score := LEAST(100.0, (login_frequency * 10 + activity_score * 2) * subscription_bonus);

    RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SECTION 06: TRIGGERS AND EVENT HANDLERS (Lines 170-195)
-- Practice: Use 'yy' to copy trigger definitions, then 'p' to paste
-- Navigate here with :170 or 170G
-- =============================================================================

-- Function for updating timestamp on row modification
CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at column
CREATE TRIGGER tr_users_update_timestamp
    BEFORE UPDATE ON processed.users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_timestamp();

-- Function for user audit logging
CREATE OR REPLACE FUNCTION log_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit.user_changes (
            user_id, operation, old_values, new_values, changed_at, changed_by
        ) VALUES (
            NEW.user_id, 'INSERT', NULL, row_to_json(NEW), CURRENT_TIMESTAMP, current_user
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.user_changes (
            user_id, operation, old_values, new_values, changed_at, changed_by
        ) VALUES (
            NEW.user_id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), CURRENT_TIMESTAMP, current_user
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit.user_changes (
            user_id, operation, old_values, new_values, changed_at, changed_by
        ) VALUES (
            OLD.user_id, 'DELETE', row_to_json(OLD), NULL, CURRENT_TIMESTAMP, current_user
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SECTION 07: DATA IMPORT AND ETL PROCEDURES (Lines 200-225)
-- Practice: Use '2yy' to copy 2 lines, navigate and paste with 'p'
-- Navigate here with :200 or 200G
-- =============================================================================

-- Procedure for batch user import from CSV
CREATE OR REPLACE PROCEDURE staging.import_users_from_csv(
    csv_file_path TEXT,
    batch_size INTEGER DEFAULT 1000
)
LANGUAGE plpgsql AS $$
DECLARE
    import_start_time TIMESTAMP;
    total_records INTEGER;
    processed_records INTEGER := 0;
    failed_records INTEGER := 0;
BEGIN
    import_start_time := CURRENT_TIMESTAMP;

    -- Create temporary table for CSV import
    CREATE TEMP TABLE temp_user_import (
        username VARCHAR(50),
        email VARCHAR(255),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        date_of_birth DATE,
        phone_number VARCHAR(20),
        subscription_tier VARCHAR(20)
    );

    -- Copy data from CSV file
    EXECUTE format('COPY temp_user_import FROM %L WITH CSV HEADER', csv_file_path);

    GET DIAGNOSTICS total_records = ROW_COUNT;

    -- Process records in batches
    FOR batch_start IN 0..total_records BY batch_size LOOP
        BEGIN
            INSERT INTO processed.users (
                username, email, first_name, last_name, date_of_birth,
                phone_number, subscription_tier, password_hash
            )
            SELECT
                tui.username,
                tui.email,
                tui.first_name,
                tui.last_name,
                tui.date_of_birth,
                tui.phone_number,
                tui.subscription_tier::subscription_tier,
                'temp_password_hash'
            FROM temp_user_import tui
            OFFSET batch_start LIMIT batch_size
            ON CONFLICT (email) DO NOTHING;

            GET DIAGNOSTICS processed_records = ROW_COUNT;

        EXCEPTION
            WHEN OTHERS THEN
                failed_records := failed_records + batch_size;
                RAISE WARNING 'Batch starting at % failed: %', batch_start, SQLERRM;
        END;
    END LOOP;

    -- Log import results
    INSERT INTO staging.import_logs (
        import_type, file_path, total_records, processed_records,
        failed_records, import_duration, import_timestamp
    ) VALUES (
        'user_csv_import', csv_file_path, total_records, processed_records,
        failed_records, CURRENT_TIMESTAMP - import_start_time, import_start_time
    );

    RAISE NOTICE 'Import completed: % total, % processed, % failed',
                 total_records, processed_records, failed_records;

    DROP TABLE temp_user_import;
END;
$$;

-- =============================================================================
-- SECTION 08: ANALYTICS AND REPORTING QUERIES (Lines 230-255)
-- Practice: Use 'dd' to delete complex query lines
-- Navigate here with :230 or 230G
-- =============================================================================

-- Complex analytics query for user segmentation
WITH user_activity_summary AS (
    SELECT
        u.user_id,
        u.subscription_tier,
        u.created_at,
        u.last_login_at,
        COUNT(DISTINCT DATE(ual.created_at)) AS active_days_last_30,
        COUNT(ual.activity_id) AS total_activities_last_30,
        SUM(CASE WHEN ual.activity_type = 'purchase' THEN 1 ELSE 0 END) AS purchases_last_30,
        SUM(CASE WHEN ual.activity_type = 'login' THEN 1 ELSE 0 END) AS logins_last_30,
        MAX(ual.created_at) AS last_activity_at
    FROM processed.users u
    LEFT JOIN user_activity_logs ual ON u.user_id = ual.user_id
        AND ual.created_at >= CURRENT_DATE - INTERVAL '30 days'
    WHERE u.status = 'active'
    GROUP BY u.user_id, u.subscription_tier, u.created_at, u.last_login_at
),
user_segments AS (
    SELECT
        *,
        CASE
            WHEN active_days_last_30 >= 20 AND purchases_last_30 >= 5 THEN 'Power User'
            WHEN active_days_last_30 >= 15 AND purchases_last_30 >= 2 THEN 'Regular User'
            WHEN active_days_last_30 >= 5 THEN 'Casual User'
            WHEN last_activity_at >= CURRENT_DATE - INTERVAL '7 days' THEN 'Recent User'
            ELSE 'Inactive User'
        END AS user_segment,
        ROW_NUMBER() OVER (ORDER BY total_activities_last_30 DESC) AS activity_rank
    FROM user_activity_summary
)
SELECT
    user_segment,
    subscription_tier,
    COUNT(*) AS user_count,
    AVG(active_days_last_30) AS avg_active_days,
    AVG(total_activities_last_30) AS avg_total_activities,
    AVG(purchases_last_30) AS avg_purchases,
    MIN(activity_rank) AS top_activity_rank,
    MAX(activity_rank) AS bottom_activity_rank
FROM user_segments
GROUP BY user_segment, subscription_tier
ORDER BY user_segment, subscription_tier;

-- =============================================================================
-- SECTION 09: PERFORMANCE MONITORING (Lines 260-285)
-- Practice: Use '4dd' to delete 4 monitoring lines at once
-- Navigate here with :260 or 260G
-- =============================================================================

-- Query performance monitoring view
CREATE VIEW analytics.query_performance_stats AS
SELECT
    query,
    calls,
    total_time,
    mean_time,
    min_time,
    max_time,
    stddev_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat_statements%'
ORDER BY total_time DESC;

-- Database size monitoring query
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS data_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size,
    (pg_total_relation_size(schemaname||'.'||tablename)::NUMERIC / (1024^3))::DECIMAL(10,2) AS size_gb
FROM pg_tables
WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage statistics
SELECT
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan,
    CASE
        WHEN idx_scan = 0 THEN 'Unused'
        WHEN idx_scan < 100 THEN 'Low Usage'
        WHEN idx_scan < 1000 THEN 'Medium Usage'
        ELSE 'High Usage'
    END AS usage_category
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- =============================================================================
-- SECTION 10: BACKUP AND MAINTENANCE SCRIPTS (Lines 290-315)
-- Practice: Use 'cc' to change entire maintenance procedures
-- Navigate here with :290 or 290G
-- =============================================================================

-- Automated maintenance procedure
CREATE OR REPLACE PROCEDURE maintenance.daily_maintenance()
LANGUAGE plpgsql AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    maintenance_log_id INTEGER;
BEGIN
    start_time := CURRENT_TIMESTAMP;

    -- Insert maintenance log entry
    INSERT INTO maintenance.maintenance_logs (procedure_name, start_time, status)
    VALUES ('daily_maintenance', start_time, 'RUNNING')
    RETURNING log_id INTO maintenance_log_id;

    -- Update table statistics
    ANALYZE processed.users;
    ANALYZE analytics.user_activity_logs;
    ANALYZE processed.orders;

    -- Refresh materialized views
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.daily_user_metrics;
    REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.monthly_revenue_summary;

    -- Clean up old log entries
    DELETE FROM staging.import_logs WHERE import_timestamp < CURRENT_DATE - INTERVAL '90 days';
    DELETE FROM analytics.user_activity_logs WHERE created_at < CURRENT_DATE - INTERVAL '365 days';

    -- Vacuum and reindex critical tables
    VACUUM ANALYZE processed.users;
    VACUUM ANALYZE analytics.user_activity_logs;

    end_time := CURRENT_TIMESTAMP;

    -- Update maintenance log
    UPDATE maintenance.maintenance_logs
    SET end_time = end_time,
        duration = end_time - start_time,
        status = 'COMPLETED'
    WHERE log_id = maintenance_log_id;

    RAISE NOTICE 'Daily maintenance completed in %', end_time - start_time;

EXCEPTION
    WHEN OTHERS THEN
        UPDATE maintenance.maintenance_logs
        SET end_time = CURRENT_TIMESTAMP,
            status = 'FAILED',
            error_message = SQLERRM
        WHERE log_id = maintenance_log_id;
        RAISE;
END;
$$;

-- =============================================================================
-- LINE OPERATION EXERCISES:
--
-- 1. BASIC LINE OPERATIONS:
--    - Navigate to Section 02 (:50) and use 'dd' to delete table definition lines
--    - Go to Section 03 (:80) and use 'yy' to copy index creation lines
--    - Navigate to Section 05 (:140) and use 'cc' to change function lines
--
-- 2. NUMBERED LINE OPERATIONS:
--    - Use '3dd' to delete 3 constraint lines in Section 03
--    - Use '5yy' to copy 5 lines of view definition in Section 04
--    - Use '2cc' to change 2 lines of trigger definition in Section 06
--
-- 3. SECTION NAVIGATION:
--    - Practice jumping between sections using line numbers
--    - Use line operations to reorganize code sections
--    - Copy entire procedures between sections
--
-- 4. ADVANCED EXERCISES:
--    - Delete entire function definitions with multiple 'dd' operations
--    - Copy and modify maintenance procedures
--    - Practice line substitution with 'S' command
-- =============================================================================