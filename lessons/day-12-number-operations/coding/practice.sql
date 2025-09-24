-- Day 12: SQL with Numeric Values - Practice Ctrl-a/Ctrl-x (Increment/Decrement)
-- This file contains SQL with various numeric values for practicing number operations
-- Goal: Practice incrementing and decrementing numbers, version numbers, dates, etc.
-- PostgreSQL Dialect with rich numeric content for increment/decrement practice

-- Database version and schema versioning
-- Practice: Increment version numbers, schema versions, migration numbers
CREATE TABLE schema_migrations (
    version_major INTEGER DEFAULT 1,
    version_minor INTEGER DEFAULT 0,
    version_patch INTEGER DEFAULT 0,
    migration_number INTEGER DEFAULT 1001,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product catalog with pricing tiers
-- Practice: Adjust prices, quantities, and numeric thresholds
SELECT
    product_id,
    product_name,
    category,
    base_price DECIMAL(10,2) DEFAULT 19.99,
    discount_percentage INTEGER DEFAULT 5,
    min_quantity INTEGER DEFAULT 1,
    max_quantity INTEGER DEFAULT 100,
    reorder_point INTEGER DEFAULT 10,
    stock_level INTEGER DEFAULT 50,
    CASE
        WHEN stock_level <= 5 THEN 'Critical'
        WHEN stock_level <= 15 THEN 'Low'
        WHEN stock_level <= 25 THEN 'Medium'
        ELSE 'Good'
    END as stock_status,
    base_price * (1 - discount_percentage / 100.0) as discounted_price
FROM products
WHERE created_date >= '2023-01-01'
    AND base_price BETWEEN 10.00 AND 999.99
    AND stock_level > 0
ORDER BY category, base_price;

-- Customer tier analysis with numeric thresholds
-- Practice: Modify tier thresholds, percentages, and counts
WITH customer_tiers AS (
    SELECT
        customer_id,
        first_name,
        last_name,
        total_orders,
        lifetime_value,
        CASE
            WHEN total_orders >= 20 AND lifetime_value >= 5000 THEN 'Platinum'
            WHEN total_orders >= 15 AND lifetime_value >= 2000 THEN 'Gold'
            WHEN total_orders >= 10 AND lifetime_value >= 1000 THEN 'Silver'
            WHEN total_orders >= 5 AND lifetime_value >= 500 THEN 'Bronze'
            ELSE 'Standard'
        END as tier,
        CASE
            WHEN lifetime_value > 10000 THEN 25
            WHEN lifetime_value > 5000 THEN 20
            WHEN lifetime_value > 2000 THEN 15
            WHEN lifetime_value > 1000 THEN 10
            WHEN lifetime_value > 500 THEN 5
            ELSE 0
        END as discount_rate
    FROM customer_summary
)
SELECT
    tier,
    COUNT(*) as customer_count,
    MIN(total_orders) as min_orders,
    MAX(total_orders) as max_orders,
    AVG(total_orders) as avg_orders,
    MIN(lifetime_value) as min_value,
    MAX(lifetime_value) as max_value,
    AVG(lifetime_value) as avg_value,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage_of_customers
FROM customer_tiers
GROUP BY tier
ORDER BY
    CASE tier
        WHEN 'Platinum' THEN 1
        WHEN 'Gold' THEN 2
        WHEN 'Silver' THEN 3
        WHEN 'Bronze' THEN 4
        ELSE 5
    END;

-- Sales performance metrics with targets
-- Practice: Adjust targets, quotas, and performance thresholds
SELECT
    sales_rep_id,
    first_name,
    last_name,
    department,
    quarterly_quota DECIMAL(12,2) DEFAULT 50000.00,
    actual_sales DECIMAL(12,2),
    quota_achievement_percentage DECIMAL(5,2),
    CASE
        WHEN quota_achievement_percentage >= 120 THEN 'Exceptional'
        WHEN quota_achievement_percentage >= 100 THEN 'Achieved'
        WHEN quota_achievement_percentage >= 90 THEN 'Near Target'
        WHEN quota_achievement_percentage >= 80 THEN 'Below Target'
        ELSE 'Underperforming'
    END as performance_rating,
    CASE
        WHEN quota_achievement_percentage >= 150 THEN base_salary * 1.25
        WHEN quota_achievement_percentage >= 120 THEN base_salary * 1.15
        WHEN quota_achievement_percentage >= 100 THEN base_salary * 1.10
        WHEN quota_achievement_percentage >= 90 THEN base_salary * 1.05
        ELSE base_salary
    END as adjusted_salary,
    commission_rate DECIMAL(4,3) DEFAULT 0.025,
    actual_sales * commission_rate as commission_earned
FROM sales_performance
WHERE performance_period = '2023-Q4'
    AND actual_sales > 0
ORDER BY quota_achievement_percentage DESC;

-- Inventory management with reorder calculations
-- Practice: Modify reorder points, lead times, and safety stock levels
SELECT
    product_id,
    product_name,
    current_stock INTEGER,
    avg_daily_sales DECIMAL(8,2),
    lead_time_days INTEGER DEFAULT 7,
    safety_stock_days INTEGER DEFAULT 3,
    reorder_point INTEGER,
    max_stock_level INTEGER DEFAULT 500,
    (avg_daily_sales * lead_time_days) + (avg_daily_sales * safety_stock_days) as calculated_reorder_point,
    CASE
        WHEN current_stock <= reorder_point * 0.5 THEN 'Urgent Reorder'
        WHEN current_stock <= reorder_point THEN 'Reorder Now'
        WHEN current_stock <= reorder_point * 1.5 THEN 'Monitor Closely'
        ELSE 'Stock OK'
    END as reorder_status,
    max_stock_level - current_stock as space_available,
    LEAST(max_stock_level - current_stock, avg_daily_sales * 30) as suggested_order_quantity
FROM inventory_analysis
WHERE active = true
    AND avg_daily_sales > 0
ORDER BY reorder_status, current_stock;

-- Financial analysis with budget allocations
-- Practice: Adjust budget percentages, amounts, and financial ratios
WITH department_budgets AS (
    SELECT
        department_id,
        department_name,
        annual_budget DECIMAL(15,2),
        spent_to_date DECIMAL(15,2),
        budget_utilization_percentage DECIMAL(5,2),
        CASE
            WHEN budget_utilization_percentage > 95 THEN 'Over Budget Risk'
            WHEN budget_utilization_percentage > 85 THEN 'High Utilization'
            WHEN budget_utilization_percentage > 70 THEN 'Moderate Utilization'
            WHEN budget_utilization_percentage > 50 THEN 'Low Utilization'
            ELSE 'Very Low Utilization'
        END as utilization_status,
        annual_budget * 0.25 as q1_allocation,
        annual_budget * 0.30 as q2_allocation,
        annual_budget * 0.25 as q3_allocation,
        annual_budget * 0.20 as q4_allocation
    FROM budget_analysis
    WHERE fiscal_year = 2024
)
SELECT
    department_name,
    annual_budget,
    spent_to_date,
    annual_budget - spent_to_date as remaining_budget,
    budget_utilization_percentage,
    utilization_status,
    q1_allocation,
    q2_allocation,
    q3_allocation,
    q4_allocation,
    CASE
        WHEN budget_utilization_percentage < 50 THEN remaining_budget * 0.10
        WHEN budget_utilization_percentage < 75 THEN remaining_budget * 0.15
        ELSE remaining_budget * 0.05
    END as emergency_reserve
FROM department_budgets
ORDER BY budget_utilization_percentage DESC;

-- Employee performance ratings and salary adjustments
-- Practice: Modify performance scores, salary percentages, and review cycles
SELECT
    employee_id,
    first_name,
    last_name,
    current_salary DECIMAL(10,2),
    performance_score INTEGER CHECK (performance_score BETWEEN 1 AND 5),
    years_of_service INTEGER,
    review_cycle_months INTEGER DEFAULT 12,
    next_review_date DATE,
    CASE
        WHEN performance_score = 5 AND years_of_service >= 3 THEN current_salary * 1.15
        WHEN performance_score = 5 THEN current_salary * 1.12
        WHEN performance_score = 4 AND years_of_service >= 2 THEN current_salary * 1.08
        WHEN performance_score = 4 THEN current_salary * 1.05
        WHEN performance_score = 3 AND years_of_service >= 1 THEN current_salary * 1.03
        WHEN performance_score = 3 THEN current_salary * 1.02
        ELSE current_salary
    END as recommended_salary,
    CASE
        WHEN performance_score >= 4 THEN 'Eligible for promotion'
        WHEN performance_score = 3 THEN 'Meeting expectations'
        WHEN performance_score = 2 THEN 'Needs improvement'
        ELSE 'Performance plan required'
    END as career_status,
    bonus_percentage DECIMAL(4,2) DEFAULT 5.00,
    current_salary * (bonus_percentage / 100.0) as annual_bonus
FROM employee_reviews
WHERE review_date >= '2023-01-01'
    AND active = true
ORDER BY performance_score DESC, years_of_service DESC;

-- Product pricing analysis with competitive positioning
-- Practice: Adjust price points, margins, and competitive ratios
SELECT
    product_id,
    product_name,
    our_price DECIMAL(8,2),
    competitor_avg_price DECIMAL(8,2),
    cost DECIMAL(8,2),
    markup_percentage DECIMAL(5,2),
    margin_percentage DECIMAL(5,2),
    price_competitiveness_ratio DECIMAL(4,3),
    CASE
        WHEN price_competitiveness_ratio <= 0.85 THEN 'Significantly Cheaper'
        WHEN price_competitiveness_ratio <= 0.95 THEN 'Cheaper'
        WHEN price_competitiveness_ratio <= 1.05 THEN 'Competitive'
        WHEN price_competitiveness_ratio <= 1.15 THEN 'More Expensive'
        ELSE 'Significantly More Expensive'
    END as price_position,
    CASE
        WHEN margin_percentage >= 50 THEN 'High Margin'
        WHEN margin_percentage >= 30 THEN 'Good Margin'
        WHEN margin_percentage >= 20 THEN 'Average Margin'
        WHEN margin_percentage >= 10 THEN 'Low Margin'
        ELSE 'Very Low Margin'
    END as margin_category,
    our_price * 0.95 as price_with_5_percent_discount,
    our_price * 1.05 as price_with_5_percent_increase
FROM product_pricing_analysis
WHERE active = true
    AND cost > 0
    AND competitor_avg_price > 0
ORDER BY margin_percentage DESC;

-- Time-based analysis with date arithmetic
-- Practice: Modify time intervals, date ranges, and temporal calculations
SELECT
    order_id,
    customer_id,
    order_date,
    shipped_date,
    delivered_date,
    EXTRACT(EPOCH FROM (shipped_date - order_date)) / 86400 as days_to_ship,
    EXTRACT(EPOCH FROM (delivered_date - shipped_date)) / 86400 as days_in_transit,
    EXTRACT(EPOCH FROM (delivered_date - order_date)) / 86400 as total_fulfillment_days,
    CASE
        WHEN EXTRACT(EPOCH FROM (shipped_date - order_date)) / 86400 <= 1 THEN 'Same Day'
        WHEN EXTRACT(EPOCH FROM (shipped_date - order_date)) / 86400 <= 2 THEN 'Next Day'
        WHEN EXTRACT(EPOCH FROM (shipped_date - order_date)) / 86400 <= 3 THEN '2-3 Days'
        WHEN EXTRACT(EPOCH FROM (shipped_date - order_date)) / 86400 <= 7 THEN 'Within Week'
        ELSE 'Over 1 Week'
    END as shipping_speed,
    order_date + INTERVAL '30 days' as payment_due_date,
    order_date + INTERVAL '90 days' as warranty_start,
    order_date + INTERVAL '455 days' as warranty_end,
    EXTRACT(QUARTER FROM order_date) as order_quarter,
    EXTRACT(WEEK FROM order_date) as order_week
FROM fulfillment_tracking
WHERE order_date >= '2023-01-01'
    AND shipped_date IS NOT NULL
    AND delivered_date IS NOT NULL
ORDER BY total_fulfillment_days;

-- Resource allocation with capacity planning
-- Practice: Modify capacity percentages, utilization rates, and allocation numbers
SELECT
    resource_id,
    resource_name,
    resource_type,
    max_capacity INTEGER DEFAULT 100,
    current_utilization INTEGER,
    utilization_percentage DECIMAL(5,2),
    peak_utilization INTEGER,
    avg_utilization DECIMAL(5,2),
    CASE
        WHEN utilization_percentage >= 95 THEN 'Critical'
        WHEN utilization_percentage >= 85 THEN 'High'
        WHEN utilization_percentage >= 70 THEN 'Moderate'
        WHEN utilization_percentage >= 50 THEN 'Low'
        ELSE 'Very Low'
    END as utilization_level,
    max_capacity - current_utilization as available_capacity,
    ROUND(max_capacity * 0.80) as target_capacity,
    CASE
        WHEN current_utilization > max_capacity * 0.90 THEN 'Scale Up'
        WHEN current_utilization < max_capacity * 0.30 THEN 'Scale Down'
        ELSE 'Maintain'
    END as scaling_recommendation,
    projected_growth_percentage DECIMAL(4,1) DEFAULT 15.0,
    ROUND(current_utilization * (1 + projected_growth_percentage / 100.0)) as projected_utilization
FROM resource_monitoring
WHERE active = true
    AND last_updated >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY utilization_percentage DESC;