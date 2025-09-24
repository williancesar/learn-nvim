-- =============================================================================
-- DAY 05: BASIC EDITING - SQL Practice File
-- =============================================================================
--
-- LEARNING OBJECTIVES:
-- - Use 'i' to insert text at cursor position
-- - Use 'a' to append text after cursor
-- - Use 'r' to replace single characters
-- - Use 'R' to enter Replace mode
-- - Use 's' to substitute characters
-- - Use 'c' with motions (cw, c$, etc.)
-- - Complete incomplete SQL queries and statements
--
-- EDITING TASKS:
-- This file contains incomplete SQL queries that need to be completed.
-- Each incomplete section is marked with [INCOMPLETE] or [MISSING].
-- Practice different editing commands to complete the SQL statements.
--
-- COMPLETION TARGETS:
-- - Add missing SELECT clauses
-- - Complete WHERE conditions
-- - Add missing JOIN clauses
-- - Complete function parameters
-- - Add missing column names
-- - Complete ORDER BY clauses
-- =============================================================================

-- Financial Analytics Database Schema
CREATE DATABASE financial_analytics;

-- [INCOMPLETE] Complete the USE statement
financial_analytics;

-- [MISSING] Add the missing schema creation statements
CREATE SCHEMA ;
CREATE SCHEMA ;
CREATE SCHEMA ;

-- [INCOMPLETE] Complete the table definition
CREATE TABLE accounts (
    account_id SERIAL PRIMARY ,
    account_number VARCHAR() NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('checking', '', 'investment', 'credit')),
    customer_id INTEGER NOT NULL,
    balance DECIMAL(, 2) DEFAULT 0.00,
    currency_code CHAR() DEFAULT 'USD',
    opened_date  DEFAULT CURRENT_DATE,
    status VARCHAR(10) DEFAULT '' CHECK (status IN ('active', 'closed', 'frozen')),
    interest_rate DECIMAL(, 4) DEFAULT 0.0000,
    minimum_balance DECIMAL(10, ) DEFAULT 0.00,
    overdraft_limit DECIMAL(10, 2) DEFAULT ,
    last_transaction_date ,
    created_at TIMESTAMP DEFAULT ,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- [INCOMPLETE] Complete the transactions table
CREATE TABLE transactions (
    transaction_id  PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id INTEGER NOT NULL,
    transaction_type VARCHAR() NOT NULL,
    amount DECIMAL(, 2) NOT NULL,
    description TEXT,
    reference_number VARCHAR() UNIQUE,
    counterparty_account VARCHAR(20),
    transaction_date TIMESTAMP DEFAULT ,
    posted_date TIMESTAMP,
    category VARCHAR(),
    subcategory VARCHAR(50),
    merchant_name VARCHAR(),
    merchant_category VARCHAR(50),
    location_city VARCHAR(),
    location_country VARCHAR(50),
    payment_method VARCHAR() DEFAULT 'electronic',
    is_recurring BOOLEAN DEFAULT ,
    recurring_frequency VARCHAR(20),
    fee_amount DECIMAL(, 2) DEFAULT 0.00,
    exchange_rate DECIMAL(, 6) DEFAULT 1.000000,
    original_currency CHAR() DEFAULT 'USD',
    status VARCHAR() DEFAULT 'pending'
);

-- [MISSING] Add the missing foreign key constraints
ALTER TABLE transactions ADD CONSTRAINT  FOREIGN KEY (account_id) REFERENCES ;
ALTER TABLE accounts ADD CONSTRAINT  FOREIGN KEY () REFERENCES customers(customer_id);

-- [INCOMPLETE] Complete the indexes
CREATE INDEX  ON accounts ();
CREATE INDEX idx_transactions_date ON transactions ();
CREATE INDEX idx_transactions_type_amount ON transactions (, );
CREATE INDEX  ON transactions (account_id, ) WHERE status = 'completed';

-- [INCOMPLETE] Complete the customer balance view
CREATE VIEW customer_balances AS
    c.customer_id,
    c.first_name,
    c.,
    COUNT() AS total_accounts,
    SUM(a.) AS total_balance,
    AVG() AS average_balance,
    MAX(a.balance) AS ,
    MIN() AS minimum_balance
FROM customers c
 JOIN accounts a ON c. = a.customer_id
WHERE a.status = ''
 BY c.customer_id, c.first_name, c.last_name;

-- [INCOMPLETE] Complete the monthly transaction summary
WITH monthly_summary AS (
        DATE_TRUNC('', t.transaction_date) AS month,
        t.account_id,
        COUNT() AS transaction_count,
        SUM(CASE WHEN t.amount > 0  1 ELSE 0 END) AS credit_count,
        SUM(CASE WHEN t. < 0 THEN 1  0 END) AS debit_count,
        SUM(t.) AS total_amount,
        SUM(CASE WHEN t.amount >  THEN t.amount ELSE 0 END) AS total_credits,
        SUM(CASE WHEN t.amount <  THEN ABS(t.amount)  0 END) AS total_debits,
        () AS average_transaction_amount
    FROM transactions t
    WHERE t.status = ''
      AND t.transaction_date >= CURRENT_DATE - INTERVAL ' months'
     BY DATE_TRUNC('month', t.transaction_date), t.account_id
)
SELECT
    ms.,
    a.account_number,
    a.,
    c.first_name,
    c.,
    ms.transaction_count,
    ms.,
    ms.debit_count,
    ms.total_amount,
    ms.,
    ms.total_debits,
    ms.
FROM monthly_summary ms
JOIN  a ON ms.account_id = a.
JOIN customers c ON a. = c.customer_id
 BY ms.month DESC, ms.total_amount DESC;

-- [INCOMPLETE] Complete the account performance analysis
SELECT
    a.account_id,
    a.,
    a.account_type,
    a.,
    -- [MISSING] Add window function to calculate running balance
    SUM() OVER (
        PARTITION BY
        ORDER BY t.transaction_date
         BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_balance,
    -- [INCOMPLETE] Complete the LAG function
    LAG(, 1) OVER (
        PARTITION BY a.account_id
         BY t.transaction_date
    ) AS previous_transaction_amount,
    -- [MISSING] Add RANK function for transaction amounts
    () OVER (
        PARTITION BY a.account_id
        ORDER BY ABS(t.amount)
    ) AS transaction_amount_rank,
    -- [INCOMPLETE] Complete the moving average calculation
    AVG() OVER (
        PARTITION BY
        ORDER BY t.transaction_date
        ROWS BETWEEN  PRECEDING AND  FOLLOWING
    ) AS moving_avg_amount
FROM accounts a
JOIN  t ON a.account_id = t.
WHERE t.status = ''
  AND t.transaction_date >= CURRENT_DATE - INTERVAL ' days'
ORDER BY a.account_id, t.;

-- [INCOMPLETE] Complete the stored procedure for account reconciliation
CREATE OR REPLACE FUNCTION reconcile_account_balance(
    account_id_param ,
    reconciliation_date_param  DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    account_id INTEGER,
    calculated_balance DECIMAL(, 2),
    recorded_balance DECIMAL(12, ),
    difference DECIMAL(, 2),
    reconciliation_status VARCHAR()
) AS $$
DECLARE
    calc_balance DECIMAL(12, 2);
    record_balance DECIMAL(, );
    balance_diff DECIMAL(12, );
BEGIN
    -- [INCOMPLETE] Complete the calculated balance query
    SELECT COALESCE(SUM(), 0)
    INTO
    FROM transactions t
    WHERE t. = account_id_param
      AND t.posted_date <=
      AND t.status = '';

    -- [MISSING] Add query to get recorded balance
    SELECT
    INTO record_balance
    FROM
    WHERE account_id = ;

    -- [INCOMPLETE] Complete the difference calculation
    balance_diff := calc_balance - ;

    -- [MISSING] Add the RETURN QUERY statement
    RETURN
    SELECT
        account_id_param,
        ,
        record_balance,
        ,
        CASE
            WHEN ABS() < 0.01 THEN 'RECONCILED'
            WHEN ABS(balance_diff) < 10.00 THEN ''
            ELSE 'SIGNIFICANT_DIFFERENCE'
        END;
END;
$$ LANGUAGE ;

-- [INCOMPLETE] Complete the fraud detection query
WITH suspicious_patterns AS (
    SELECT
        t.account_id,
        t.transaction_id,
        t.,
        t.description,
        -- [MISSING] Add COUNT window function for frequency analysis
        COUNT() OVER (
            PARTITION BY t.account_id
            ORDER BY t.transaction_date
            RANGE BETWEEN INTERVAL ' hour' PRECEDING AND CURRENT ROW
        ) AS transactions_last_hour,
        -- [INCOMPLETE] Complete the amount comparison
        CASE
            WHEN ABS(t.amount) > (
                SELECT AVG(ABS()) * 5
                FROM transactions t2
                WHERE t2. = t.account_id
                  AND t2.transaction_date >= CURRENT_DATE - INTERVAL ' days'
            ) THEN
            ELSE FALSE
        END AS unusual_amount,
        -- [MISSING] Add location-based fraud detection
        CASE
            WHEN t.location_country != (
                SELECT
                FROM transactions t3
                WHERE t3.account_id = t.
                  AND t3.transaction_date < t.transaction_date
                  AND t3.location_country IS NOT NULL
                ORDER BY t3.transaction_date
                LIMIT 1
            ) THEN TRUE
            ELSE
        END AS unusual_location
    FROM transactions t
    WHERE t.transaction_date >= CURRENT_DATE - INTERVAL ' days'
      AND t.status = ''
),
risk_scoring AS (
    SELECT
        sp.*,
        -- [INCOMPLETE] Complete the risk score calculation
        (CASE WHEN sp.transactions_last_hour >  THEN 30 ELSE 0 END +
         CASE WHEN sp. = TRUE THEN 40 ELSE 0 END +
         CASE WHEN sp.unusual_location =  THEN 25 ELSE 0 END +
         CASE WHEN sp.amount > 10000 THEN  ELSE 0 END) AS risk_score
    FROM suspicious_patterns
)
SELECT
    rs.account_id,
    rs.,
    rs.amount,
    rs.,
    rs.transactions_last_hour,
    rs.unusual_amount,
    rs.,
    rs.risk_score,
    CASE
        WHEN rs. >= 70 THEN 'HIGH'
        WHEN rs.risk_score >=  THEN 'MEDIUM'
        ELSE ''
    END AS risk_level
FROM risk_scoring rs
WHERE rs. > 0
ORDER BY rs. DESC, rs.transaction_date DESC;

-- [INCOMPLETE] Complete the customer segmentation analysis
SELECT
    c.customer_id,
    c.,
    c.last_name,
    COUNT() AS total_accounts,
    SUM(a.) AS total_balance,
    COUNT(DISTINCT t.transaction_id) AS total_transactions,
    SUM() AS total_transaction_volume,
    AVG(t.amount) AS avg_transaction_amount,
    MAX() AS largest_transaction,
    MIN(t.transaction_date) AS first_transaction_date,
    MAX() AS last_transaction_date,
    -- [MISSING] Add customer lifetime value calculation
    (SUM(t.fee_amount) * ) AS estimated_annual_revenue,
    -- [INCOMPLETE] Complete the customer tier assignment
    CASE
        WHEN SUM(a.balance) >=  THEN 'Platinum'
        WHEN SUM() >= 50000 THEN 'Gold'
        WHEN SUM(a.balance) >=  THEN 'Silver'
        ELSE ''
    END AS customer_tier,
    -- [MISSING] Add activity score calculation
    CASE
        WHEN COUNT(t.transaction_id) >=  THEN 'Highly Active'
        WHEN COUNT() >= 50 THEN 'Active'
        WHEN COUNT(t.transaction_id) >=  THEN 'Moderately Active'
        ELSE ''
    END AS activity_level
FROM customers c
 accounts a ON c.customer_id = a.
LEFT JOIN  t ON a.account_id = t.account_id
WHERE a. = 'active'
  AND (t.transaction_date IS NULL OR t.transaction_date >= CURRENT_DATE - INTERVAL ' months')
GROUP BY c., c.first_name, c.last_name
 HAVING SUM(a.balance) >
ORDER BY  DESC, total_transaction_volume DESC;

-- [INCOMPLETE] Complete the performance optimization procedure
CREATE OR REPLACE PROCEDURE optimize_database_performance()
LANGUAGE  AS $$
DECLARE
    table_name TEXT;
    index_name TEXT;
    optimization_start_time ;
BEGIN
    optimization_start_time := ;

    -- [MISSING] Add RAISE NOTICE statement
     'Starting database optimization at %', optimization_start_time;

    -- [INCOMPLETE] Complete the table maintenance loop
    FOR table_name IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = ''
    LOOP
        -- [MISSING] Add ANALYZE statement
         table_name;

        -- [INCOMPLETE] Complete the VACUUM statement
         ANALYZE table_name;
    END ;

    -- [INCOMPLETE] Complete the index maintenance
    FOR index_name IN
        SELECT indexname
        FROM pg_indexes
        WHERE schemaname = 'public'
          AND indexname LIKE '%_'
    LOOP
        -- [MISSING] Add REINDEX statement
        EXECUTE format('', index_name);
    END LOOP;

    -- [INCOMPLETE] Complete the statistics update
    UPDATE pg_stat_user_tables
    SET  = CURRENT_TIMESTAMP
    WHERE schemaname = '';

    RAISE NOTICE 'Database optimization completed in %',
                 CURRENT_TIMESTAMP - ;

EXCEPTION
    WHEN  THEN
        RAISE WARNING 'Optimization failed: %', ;
        RAISE;
END;
$$;

-- =============================================================================
-- BASIC EDITING EXERCISES:
--
-- 1. INSERTION AND APPENDING:
--    - Use 'i' to insert missing keywords (SELECT, FROM, WHERE)
--    - Use 'a' to append missing punctuation and operators
--    - Complete table and column names using insert mode
--
-- 2. CHARACTER REPLACEMENT:
--    - Use 'r' to replace single incorrect characters
--    - Use 'R' to replace multiple characters in sequence
--    - Fix data types and numeric values
--
-- 3. SUBSTITUTION:
--    - Use 's' to substitute characters and add text
--    - Complete incomplete function names and parameters
--    - Add missing clauses and conditions
--
-- 4. CHANGE OPERATIONS:
--    - Use 'cw' to change words (incomplete keywords to complete ones)
--    - Use 'c$' to change from cursor to end of line
--    - Use 'c)' to change within parentheses
--
-- 5. COMPLETION TARGETS:
--    - Complete all [INCOMPLETE] sections
--    - Add all [MISSING] elements
--    - Ensure all queries are syntactically correct
--    - Test completed queries for logical correctness
-- =============================================================================