-- Day 14: Comprehensive SQL Application - Week Review and Advanced Techniques
-- This comprehensive file combines all techniques from Days 8-13 for week review practice
-- Goal: Practice all Vim motions and editing techniques learned this week on complex SQL
-- PostgreSQL Dialect with advanced features, CTEs, window functions, and modern SQL patterns

-- =============================================================================
-- E-COMMERCE ANALYTICS PLATFORM - COMPREHENSIVE APPLICATION
-- =============================================================================

-- Configuration and Settings
SET work_mem = '256MB';
SET enable_hashjoin = on;
SET enable_mergejoin = on;

-- Create custom types for better data modeling
CREATE TYPE customer_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE product_condition AS ENUM ('new', 'refurbished', 'used', 'damaged');

-- =============================================================================
-- REAL-TIME SALES DASHBOARD - Complex CTEs and Window Functions
-- =============================================================================

-- Advanced sales performance analysis with multiple CTEs
WITH real_time_metrics AS (
    SELECT
        DATE_TRUNC('hour', o.order_date) as sales_hour,
        DATE_TRUNC('day', o.order_date) as sales_date,
        DATE_TRUNC('week', o.order_date) as sales_week,
        DATE_TRUNC('month', o.order_date) as sales_month,
        COUNT(o.order_id) as orders_count,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(o.total_amount) as revenue,
        AVG(o.total_amount) as avg_order_value,
        SUM(oi.quantity) as items_sold,
        COUNT(DISTINCT oi.product_id) as unique_products_sold
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.order_date >= CURRENT_DATE - INTERVAL '90 days'
        AND o.order_status IN ('delivered', 'shipped', 'processing')
    GROUP BY DATE_TRUNC('hour', o.order_date),
             DATE_TRUNC('day', o.order_date),
             DATE_TRUNC('week', o.order_date),
             DATE_TRUNC('month', o.order_date)
),
hourly_trends AS (
    SELECT
        sales_hour,
        sales_date,
        orders_count,
        revenue,
        LAG(revenue, 1) OVER (ORDER BY sales_hour) as prev_hour_revenue,
        LAG(revenue, 24) OVER (ORDER BY sales_hour) as same_hour_yesterday,
        LAG(revenue, 168) OVER (ORDER BY sales_hour) as same_hour_last_week,
        AVG(revenue) OVER (
            ORDER BY sales_hour
            ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
        ) as rolling_24h_avg_revenue,
        RANK() OVER (
            PARTITION BY sales_date
            ORDER BY revenue DESC
        ) as hourly_revenue_rank_of_day,
        PERCENT_RANK() OVER (
            PARTITION BY EXTRACT(HOUR FROM sales_hour)
            ORDER BY revenue
        ) as hour_performance_percentile
    FROM real_time_metrics
),
performance_indicators AS (
    SELECT
        *,
        CASE
            WHEN prev_hour_revenue IS NOT NULL AND prev_hour_revenue > 0 THEN
                ROUND(((revenue - prev_hour_revenue) / prev_hour_revenue * 100), 2)
            ELSE NULL
        END as hour_over_hour_growth,
        CASE
            WHEN same_hour_yesterday IS NOT NULL AND same_hour_yesterday > 0 THEN
                ROUND(((revenue - same_hour_yesterday) / same_hour_yesterday * 100), 2)
            ELSE NULL
        END as day_over_day_growth,
        CASE
            WHEN same_hour_last_week IS NOT NULL AND same_hour_last_week > 0 THEN
                ROUND(((revenue - same_hour_last_week) / same_hour_last_week * 100), 2)
            ELSE NULL
        END as week_over_week_growth,
        CASE
            WHEN rolling_24h_avg_revenue > 0 THEN
                ROUND((revenue / rolling_24h_avg_revenue), 2)
            ELSE NULL
        END as vs_24h_average_ratio
    FROM hourly_trends
)
SELECT
    sales_hour,
    TO_CHAR(sales_hour, 'YYYY-MM-DD HH24:MI') as formatted_hour,
    EXTRACT(DOW FROM sales_hour) as day_of_week,
    EXTRACT(HOUR FROM sales_hour) as hour_of_day,
    orders_count,
    ROUND(revenue, 2) as revenue,
    ROUND(rolling_24h_avg_revenue, 2) as avg_24h_revenue,
    hour_over_hour_growth,
    day_over_day_growth,
    week_over_week_growth,
    vs_24h_average_ratio,
    hourly_revenue_rank_of_day,
    ROUND(hour_performance_percentile * 100, 1) as hour_percentile,
    CASE
        WHEN hour_performance_percentile >= 0.9 THEN 'Exceptional Hour'
        WHEN hour_performance_percentile >= 0.75 THEN 'Strong Hour'
        WHEN hour_performance_percentile >= 0.5 THEN 'Average Hour'
        WHEN hour_performance_percentile >= 0.25 THEN 'Below Average Hour'
        ELSE 'Poor Hour'
    END as performance_rating
FROM performance_indicators
WHERE sales_hour >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY sales_hour DESC
LIMIT 168; -- Last week's data

-- =============================================================================
-- CUSTOMER SEGMENTATION AND BEHAVIORAL ANALYSIS
-- =============================================================================

-- Advanced RFM analysis with machine learning-style scoring
WITH customer_behavior_metrics AS (
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        c.email,
        c.registration_date,
        c.loyalty_tier,
        EXTRACT(DAYS FROM (CURRENT_DATE - c.registration_date)) as customer_age_days,
        COUNT(o.order_id) as total_orders,
        COUNT(DISTINCT DATE_TRUNC('month', o.order_date)) as active_months,
        COALESCE(SUM(o.total_amount), 0) as lifetime_value,
        COALESCE(AVG(o.total_amount), 0) as avg_order_value,
        COALESCE(STDDEV(o.total_amount), 0) as order_value_stddev,
        COALESCE(MAX(o.order_date), c.registration_date::timestamp) as last_order_date,
        COALESCE(MIN(o.order_date), c.registration_date::timestamp) as first_order_date,
        COUNT(DISTINCT oi.product_id) as unique_products_purchased,
        COUNT(DISTINCT pc.category_id) as unique_categories_purchased,
        SUM(oi.quantity) as total_items_purchased,
        COUNT(CASE WHEN o.order_status = 'returned' THEN 1 END) as returned_orders,
        COUNT(CASE WHEN o.order_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as orders_last_30d,
        COUNT(CASE WHEN o.order_date >= CURRENT_DATE - INTERVAL '90 days' THEN 1 END) as orders_last_90d
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
        AND o.order_status NOT IN ('cancelled')
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    LEFT JOIN product_categories pc ON p.category_id = pc.category_id
    WHERE c.active = true
    GROUP BY c.customer_id, c.first_name, c.last_name, c.email,
             c.registration_date, c.loyalty_tier
),
behavioral_scores AS (
    SELECT
        *,
        EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - last_order_date)) as recency_days,
        CASE
            WHEN total_orders > 0 THEN
                ROUND(lifetime_value / total_orders, 2)
            ELSE 0
        END as calculated_avg_order_value,
        CASE
            WHEN customer_age_days > 0 THEN
                ROUND(total_orders::decimal / (customer_age_days / 30.0), 2)
            ELSE 0
        END as orders_per_month,
        CASE
            WHEN returned_orders > 0 AND total_orders > 0 THEN
                ROUND(returned_orders::decimal / total_orders * 100, 2)
            ELSE 0
        END as return_rate_percentage,
        NTILE(5) OVER (ORDER BY EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - last_order_date)) ASC) as recency_score,
        NTILE(5) OVER (ORDER BY total_orders) as frequency_score,
        NTILE(5) OVER (ORDER BY lifetime_value) as monetary_score,
        NTILE(5) OVER (ORDER BY unique_products_purchased) as variety_score,
        NTILE(5) OVER (ORDER BY customer_age_days) as tenure_score
    FROM customer_behavior_metrics
),
customer_segments AS (
    SELECT
        *,
        (recency_score + frequency_score + monetary_score + variety_score + tenure_score) / 5.0 as composite_score,
        CASE
            WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'VIP Champions'
            WHEN recency_score >= 4 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Loyal Customers'
            WHEN recency_score >= 4 AND frequency_score <= 2 AND monetary_score <= 2 THEN 'New Customers'
            WHEN recency_score >= 3 AND frequency_score <= 2 AND monetary_score <= 2 THEN 'Potential Loyalists'
            WHEN recency_score <= 2 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'At Risk Valuable'
            WHEN recency_score <= 2 AND frequency_score <= 2 AND monetary_score >= 4 THEN 'Cannot Lose Them'
            WHEN recency_score <= 2 AND frequency_score <= 2 AND monetary_score <= 2 THEN 'Hibernating'
            WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score <= 2 THEN 'Price Sensitive'
            ELSE 'Needs Attention'
        END as rfm_segment,
        CASE
            WHEN orders_last_30d >= 3 THEN 'Highly Active'
            WHEN orders_last_30d >= 1 THEN 'Active'
            WHEN orders_last_90d >= 1 THEN 'Moderately Active'
            ELSE 'Inactive'
        END as activity_level,
        CASE
            WHEN unique_categories_purchased >= 5 THEN 'Diverse Shopper'
            WHEN unique_categories_purchased >= 3 THEN 'Multi-Category'
            WHEN unique_categories_purchased >= 2 THEN 'Focused Shopper'
            ELSE 'Single Category'
        END as shopping_behavior
    FROM behavioral_scores
)
SELECT
    customer_id,
    first_name || ' ' || last_name as full_name,
    email,
    loyalty_tier,
    rfm_segment,
    activity_level,
    shopping_behavior,
    total_orders,
    ROUND(lifetime_value, 2) as lifetime_value,
    ROUND(avg_order_value, 2) as avg_order_value,
    recency_days,
    orders_last_30d,
    unique_products_purchased,
    unique_categories_purchased,
    return_rate_percentage,
    ROUND(composite_score, 2) as composite_score,
    recency_score,
    frequency_score,
    monetary_score,
    variety_score,
    tenure_score,
    CASE
        WHEN composite_score >= 4.5 THEN 'Tier 1: VIP Treatment'
        WHEN composite_score >= 3.5 THEN 'Tier 2: High Value'
        WHEN composite_score >= 2.5 THEN 'Tier 3: Standard'
        WHEN composite_score >= 1.5 THEN 'Tier 4: Growth Opportunity'
        ELSE 'Tier 5: Win Back'
    END as recommended_treatment
FROM customer_segments
ORDER BY composite_score DESC, lifetime_value DESC;

-- =============================================================================
-- ADVANCED INVENTORY OPTIMIZATION WITH FORECASTING
-- =============================================================================

-- Sophisticated inventory analysis with demand forecasting
WITH product_demand_analysis AS (
    SELECT
        p.product_id,
        p.sku,
        p.product_name,
        pc.category_name,
        p.price,
        p.cost,
        COALESCE(i.quantity_on_hand, 0) as current_stock,
        COALESCE(i.quantity_reserved, 0) as reserved_stock,
        p.reorder_point,
        p.max_stock_level,
        -- Daily sales metrics for different periods
        COALESCE(sales_7d.daily_avg_7d, 0) as avg_daily_sales_7d,
        COALESCE(sales_30d.daily_avg_30d, 0) as avg_daily_sales_30d,
        COALESCE(sales_90d.daily_avg_90d, 0) as avg_daily_sales_90d,
        COALESCE(sales_365d.daily_avg_365d, 0) as avg_daily_sales_365d,
        -- Seasonal analysis
        COALESCE(seasonal.same_month_last_year, 0) as same_month_last_year_sales,
        COALESCE(seasonal.same_quarter_last_year, 0) as same_quarter_last_year_sales,
        -- Volatility metrics
        COALESCE(volatility.sales_variance, 0) as sales_variance,
        COALESCE(volatility.sales_stddev, 0) as sales_stddev,
        COALESCE(volatility.coefficient_of_variation, 0) as coefficient_of_variation
    FROM products p
    LEFT JOIN product_categories pc ON p.category_id = pc.category_id
    LEFT JOIN inventory i ON p.product_id = i.product_id
    -- 7-day sales
    LEFT JOIN (
        SELECT
            oi.product_id,
            SUM(oi.quantity) / 7.0 as daily_avg_7d
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_status IN ('delivered', 'shipped')
            AND o.order_date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY oi.product_id
    ) sales_7d ON p.product_id = sales_7d.product_id
    -- 30-day sales
    LEFT JOIN (
        SELECT
            oi.product_id,
            SUM(oi.quantity) / 30.0 as daily_avg_30d
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_status IN ('delivered', 'shipped')
            AND o.order_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY oi.product_id
    ) sales_30d ON p.product_id = sales_30d.product_id
    -- 90-day sales
    LEFT JOIN (
        SELECT
            oi.product_id,
            SUM(oi.quantity) / 90.0 as daily_avg_90d
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_status IN ('delivered', 'shipped')
            AND o.order_date >= CURRENT_DATE - INTERVAL '90 days'
        GROUP BY oi.product_id
    ) sales_90d ON p.product_id = sales_90d.product_id
    -- 365-day sales
    LEFT JOIN (
        SELECT
            oi.product_id,
            SUM(oi.quantity) / 365.0 as daily_avg_365d
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_status IN ('delivered', 'shipped')
            AND o.order_date >= CURRENT_DATE - INTERVAL '365 days'
        GROUP BY oi.product_id
    ) sales_365d ON p.product_id = sales_365d.product_id
    -- Seasonal comparison
    LEFT JOIN (
        SELECT
            oi.product_id,
            SUM(CASE
                WHEN EXTRACT(MONTH FROM o.order_date) = EXTRACT(MONTH FROM CURRENT_DATE)
                     AND EXTRACT(YEAR FROM o.order_date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1
                THEN oi.quantity ELSE 0
            END) as same_month_last_year,
            SUM(CASE
                WHEN EXTRACT(QUARTER FROM o.order_date) = EXTRACT(QUARTER FROM CURRENT_DATE)
                     AND EXTRACT(YEAR FROM o.order_date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1
                THEN oi.quantity ELSE 0
            END) as same_quarter_last_year
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_status IN ('delivered', 'shipped')
            AND o.order_date >= CURRENT_DATE - INTERVAL '2 years'
        GROUP BY oi.product_id
    ) seasonal ON p.product_id = seasonal.product_id
    -- Sales volatility analysis
    LEFT JOIN (
        SELECT
            oi.product_id,
            VARIANCE(daily_sales.daily_qty) as sales_variance,
            STDDEV(daily_sales.daily_qty) as sales_stddev,
            CASE
                WHEN AVG(daily_sales.daily_qty) > 0 THEN
                    STDDEV(daily_sales.daily_qty) / AVG(daily_sales.daily_qty)
                ELSE 0
            END as coefficient_of_variation
        FROM (
            SELECT
                oi.product_id,
                DATE_TRUNC('day', o.order_date) as sale_date,
                SUM(oi.quantity) as daily_qty
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.order_id
            WHERE o.order_status IN ('delivered', 'shipped')
                AND o.order_date >= CURRENT_DATE - INTERVAL '90 days'
            GROUP BY oi.product_id, DATE_TRUNC('day', o.order_date)
        ) daily_sales
        GROUP BY oi.product_id
    ) volatility ON p.product_id = volatility.product_id
    WHERE p.active = true
),
demand_forecast AS (
    SELECT
        *,
        -- Weighted demand forecast (more weight on recent data)
        (avg_daily_sales_7d * 0.4 + avg_daily_sales_30d * 0.3 + avg_daily_sales_90d * 0.2 + avg_daily_sales_365d * 0.1) as weighted_daily_demand,
        -- Seasonal adjustment
        CASE
            WHEN same_quarter_last_year > 0 AND avg_daily_sales_365d > 0 THEN
                (avg_daily_sales_365d * (same_quarter_last_year / NULLIF(same_quarter_last_year, 0)))
            ELSE avg_daily_sales_365d
        END as seasonally_adjusted_demand,
        -- Safety stock calculation based on volatility
        GREATEST(
            avg_daily_sales_30d * 7,  -- Minimum 7 days
            avg_daily_sales_30d * (1 + coefficient_of_variation) * 14  -- Volatility-adjusted
        ) as calculated_safety_stock
    FROM product_demand_analysis
),
inventory_recommendations AS (
    SELECT
        *,
        -- Current situation analysis
        CASE
            WHEN current_stock <= 0 THEN 'OUT_OF_STOCK'
            WHEN current_stock <= calculated_safety_stock THEN 'CRITICAL'
            WHEN current_stock <= reorder_point THEN 'REORDER_NOW'
            WHEN current_stock <= reorder_point * 1.5 THEN 'MONITOR'
            WHEN current_stock >= max_stock_level * 0.9 THEN 'OVERSTOCK'
            ELSE 'NORMAL'
        END as stock_status,
        -- Days of inventory remaining
        CASE
            WHEN weighted_daily_demand > 0 THEN
                ROUND((current_stock - reserved_stock) / weighted_daily_demand, 1)
            ELSE NULL
        END as days_of_inventory,
        -- Recommended order quantity
        CASE
            WHEN current_stock <= reorder_point THEN
                GREATEST(
                    (weighted_daily_demand * 30) + calculated_safety_stock - current_stock,  -- 30 days supply
                    max_stock_level - current_stock
                )
            ELSE 0
        END as recommended_order_qty,
        -- Financial impact
        (price - COALESCE(cost, 0)) * weighted_daily_demand * 30 as monthly_profit_potential,
        current_stock * COALESCE(cost, price * 0.7) as inventory_value
    FROM demand_forecast
)
SELECT
    sku,
    product_name,
    category_name,
    stock_status,
    current_stock,
    reserved_stock,
    current_stock - reserved_stock as available_stock,
    ROUND(weighted_daily_demand, 2) as daily_demand_forecast,
    days_of_inventory,
    reorder_point,
    ROUND(calculated_safety_stock, 0) as recommended_safety_stock,
    ROUND(recommended_order_qty, 0) as recommended_order_qty,
    ROUND(coefficient_of_variation, 3) as demand_volatility,
    ROUND(monthly_profit_potential, 2) as monthly_profit_potential,
    ROUND(inventory_value, 2) as current_inventory_value,
    price,
    cost,
    CASE
        WHEN cost > 0 THEN ROUND(((price - cost) / cost * 100), 1)
        ELSE NULL
    END as margin_percentage
FROM inventory_recommendations
WHERE stock_status IN ('OUT_OF_STOCK', 'CRITICAL', 'REORDER_NOW', 'MONITOR', 'OVERSTOCK')
ORDER BY
    CASE stock_status
        WHEN 'OUT_OF_STOCK' THEN 1
        WHEN 'CRITICAL' THEN 2
        WHEN 'REORDER_NOW' THEN 3
        WHEN 'MONITOR' THEN 4
        WHEN 'OVERSTOCK' THEN 5
        ELSE 6
    END,
    monthly_profit_potential DESC;

-- =============================================================================
-- FINANCIAL ANALYTICS AND PROFITABILITY ANALYSIS
-- =============================================================================

-- Comprehensive financial performance analysis
WITH financial_metrics AS (
    SELECT
        DATE_TRUNC('month', o.order_date) as month,
        -- Revenue metrics
        SUM(o.total_amount) as gross_revenue,
        SUM(o.total_amount - o.tax_amount - o.shipping_amount) as net_revenue,
        SUM(oi.quantity * COALESCE(p.cost, p.price * 0.7)) as total_cogs,
        SUM(o.shipping_amount) as shipping_revenue,
        SUM(o.tax_amount) as tax_collected,
        SUM(o.discount_amount) as discounts_given,
        -- Volume metrics
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(oi.quantity) as total_units_sold,
        COUNT(DISTINCT oi.product_id) as unique_products_sold,
        -- Average metrics
        AVG(o.total_amount) as avg_order_value,
        AVG(oi.quantity * oi.unit_price) as avg_line_item_value,
        -- Returns and refunds
        COUNT(CASE WHEN o.order_status = 'returned' THEN 1 END) as returned_orders,
        SUM(CASE WHEN o.order_status = 'returned' THEN o.total_amount ELSE 0 END) as refund_amount
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
    WHERE o.order_date >= CURRENT_DATE - INTERVAL '24 months'
        AND o.order_status NOT IN ('cancelled')
    GROUP BY DATE_TRUNC('month', o.order_date)
),
profitability_analysis AS (
    SELECT
        month,
        gross_revenue,
        net_revenue,
        total_cogs,
        shipping_revenue,
        tax_collected,
        discounts_given,
        refund_amount,
        -- Calculated profitability metrics
        net_revenue - total_cogs as gross_profit,
        (net_revenue - total_cogs) / NULLIF(net_revenue, 0) * 100 as gross_margin_percentage,
        total_orders,
        unique_customers,
        total_units_sold,
        avg_order_value,
        returned_orders,
        returned_orders::decimal / NULLIF(total_orders, 0) * 100 as return_rate_percentage,
        -- Growth calculations
        LAG(gross_revenue) OVER (ORDER BY month) as prev_month_revenue,
        LAG(total_orders) OVER (ORDER BY month) as prev_month_orders,
        LAG(unique_customers) OVER (ORDER BY month) as prev_month_customers,
        -- Rolling metrics
        AVG(gross_revenue) OVER (
            ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
        ) as rolling_3m_avg_revenue,
        AVG(total_orders) OVER (
            ORDER BY month ROWS BETWEEN 11 PRECEDING AND CURRENT ROW
        ) as rolling_12m_avg_orders
    FROM financial_metrics
),
growth_analysis AS (
    SELECT
        *,
        CASE
            WHEN prev_month_revenue > 0 THEN
                ROUND(((gross_revenue - prev_month_revenue) / prev_month_revenue * 100), 2)
            ELSE NULL
        END as revenue_growth_mom,
        CASE
            WHEN prev_month_orders > 0 THEN
                ROUND(((total_orders - prev_month_orders)::decimal / prev_month_orders * 100), 2)
            ELSE NULL
        END as order_growth_mom,
        CASE
            WHEN prev_month_customers > 0 THEN
                ROUND(((unique_customers - prev_month_customers)::decimal / prev_month_customers * 100), 2)
            ELSE NULL
        END as customer_growth_mom,
        ROUND(gross_revenue / NULLIF(rolling_3m_avg_revenue, 0), 2) as vs_3m_avg_ratio,
        ROUND(total_orders::decimal / NULLIF(rolling_12m_avg_orders, 0), 2) as vs_12m_avg_ratio
    FROM profitability_analysis
)
SELECT
    TO_CHAR(month, 'YYYY-MM') as month,
    ROUND(gross_revenue, 2) as gross_revenue,
    ROUND(net_revenue, 2) as net_revenue,
    ROUND(total_cogs, 2) as cost_of_goods_sold,
    ROUND(gross_profit, 2) as gross_profit,
    ROUND(gross_margin_percentage, 1) as gross_margin_pct,
    total_orders,
    unique_customers,
    total_units_sold,
    ROUND(avg_order_value, 2) as avg_order_value,
    ROUND(discounts_given, 2) as discounts_given,
    ROUND(refund_amount, 2) as refunds,
    ROUND(return_rate_percentage, 1) as return_rate_pct,
    revenue_growth_mom,
    order_growth_mom,
    customer_growth_mom,
    vs_3m_avg_ratio,
    vs_12m_avg_ratio,
    CASE
        WHEN revenue_growth_mom >= 10 THEN 'Excellent Growth'
        WHEN revenue_growth_mom >= 5 THEN 'Good Growth'
        WHEN revenue_growth_mom >= 0 THEN 'Positive Growth'
        WHEN revenue_growth_mom >= -5 THEN 'Slight Decline'
        ELSE 'Concerning Decline'
    END as growth_assessment,
    CASE
        WHEN gross_margin_percentage >= 50 THEN 'Excellent Margins'
        WHEN gross_margin_percentage >= 35 THEN 'Good Margins'
        WHEN gross_margin_percentage >= 25 THEN 'Average Margins'
        WHEN gross_margin_percentage >= 15 THEN 'Tight Margins'
        ELSE 'Poor Margins'
    END as margin_assessment
FROM growth_analysis
WHERE month >= CURRENT_DATE - INTERVAL '12 months'
ORDER BY month DESC;

-- =============================================================================
-- PERFORMANCE MONITORING AND OPTIMIZATION QUERIES
-- =============================================================================

-- Database performance monitoring for query optimization
SELECT
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation,
    most_common_vals[1:3] as top_values,
    most_common_freqs[1:3] as value_frequencies
FROM pg_stats
WHERE schemaname = 'public'
    AND tablename IN ('customers', 'orders', 'products', 'order_items')
    AND n_distinct > 100
ORDER BY tablename, n_distinct DESC;

-- Index usage analysis
SELECT
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan,
    ROUND(idx_tup_read::decimal / NULLIF(idx_scan, 0), 2) as avg_tuples_per_scan
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Final comprehensive view combining all metrics for executive dashboard
CREATE OR REPLACE VIEW executive_dashboard AS
WITH summary_metrics AS (
    SELECT
        'Total Customers' as metric,
        COUNT(*)::text as value,
        'customers' as category
    FROM customers WHERE active = true

    UNION ALL

    SELECT
        'Active Products',
        COUNT(*)::text,
        'products'
    FROM products WHERE active = true

    UNION ALL

    SELECT
        'Monthly Revenue',
        '$' || ROUND(SUM(total_amount), 0)::text,
        'financial'
    FROM orders
    WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)
        AND order_status IN ('delivered', 'shipped')

    UNION ALL

    SELECT
        'Orders This Month',
        COUNT(*)::text,
        'operations'
    FROM orders
    WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)
        AND order_status NOT IN ('cancelled')
)
SELECT * FROM summary_metrics;