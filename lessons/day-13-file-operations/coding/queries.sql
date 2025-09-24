-- Day 13: Complex SQL Queries - Advanced Analytics and Reporting
-- This file contains complex queries for practicing file navigation and advanced SQL
-- Practice: Navigate between schema.sql, migrations.sql, and queries.sql using file operations
-- PostgreSQL Dialect with CTEs, window functions, and advanced analytics

-- =============================================================================
-- CUSTOMER ANALYTICS QUERIES
-- =============================================================================

-- Query 1: Customer Lifetime Value Analysis with Cohort Analysis
WITH customer_cohorts AS (
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        c.registration_date,
        DATE_TRUNC('month', c.registration_date) as cohort_month,
        COUNT(o.order_id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as lifetime_value,
        COALESCE(AVG(o.total_amount), 0) as avg_order_value,
        COALESCE(MAX(o.order_date), c.registration_date::timestamp) as last_order_date,
        EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - COALESCE(MAX(o.order_date), c.registration_date::timestamp))) as days_since_last_order
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
        AND o.order_status IN ('delivered', 'shipped')
    WHERE c.active = true
    GROUP BY c.customer_id, c.first_name, c.last_name, c.registration_date
),
cohort_analysis AS (
    SELECT
        cohort_month,
        COUNT(*) as cohort_size,
        AVG(lifetime_value) as avg_cohort_ltv,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY lifetime_value) as median_cohort_ltv,
        COUNT(CASE WHEN total_orders > 0 THEN 1 END) as active_customers,
        COUNT(CASE WHEN total_orders > 1 THEN 1 END) as repeat_customers,
        COUNT(CASE WHEN days_since_last_order <= 90 THEN 1 END) as recent_customers
    FROM customer_cohorts
    GROUP BY cohort_month
),
retention_analysis AS (
    SELECT
        cc.cohort_month,
        DATE_TRUNC('month', o.order_date) as activity_month,
        EXTRACT(MONTH FROM AGE(o.order_date, cc.registration_date)) as month_number,
        COUNT(DISTINCT cc.customer_id) as active_customers
    FROM customer_cohorts cc
    JOIN orders o ON cc.customer_id = o.customer_id
    WHERE o.order_status IN ('delivered', 'shipped')
    GROUP BY cc.cohort_month, DATE_TRUNC('month', o.order_date)
)
SELECT
    ca.cohort_month,
    ca.cohort_size,
    ROUND(ca.avg_cohort_ltv, 2) as avg_lifetime_value,
    ROUND(ca.median_cohort_ltv, 2) as median_lifetime_value,
    ca.active_customers,
    ca.repeat_customers,
    ROUND(ca.repeat_customers::decimal / NULLIF(ca.active_customers, 0) * 100, 2) as repeat_rate_percentage,
    ca.recent_customers,
    ROUND(ca.recent_customers::decimal / ca.cohort_size * 100, 2) as recent_activity_rate
FROM cohort_analysis ca
ORDER BY ca.cohort_month DESC;

-- Query 2: Advanced Product Performance Analysis
WITH product_sales_metrics AS (
    SELECT
        p.product_id,
        p.sku,
        p.product_name,
        pc.category_name,
        p.price,
        p.cost,
        COUNT(DISTINCT oi.order_id) as orders_containing_product,
        SUM(oi.quantity) as total_quantity_sold,
        SUM(oi.line_total) as total_revenue,
        AVG(oi.quantity) as avg_quantity_per_order,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        MIN(o.order_date) as first_sale_date,
        MAX(o.order_date) as last_sale_date
    FROM products p
    LEFT JOIN product_categories pc ON p.category_id = pc.category_id
    LEFT JOIN order_items oi ON p.product_id = oi.product_id
    LEFT JOIN orders o ON oi.order_id = o.order_id
        AND o.order_status IN ('delivered', 'shipped')
    WHERE p.active = true
    GROUP BY p.product_id, p.sku, p.product_name, pc.category_name, p.price, p.cost
),
product_rankings AS (
    SELECT
        *,
        CASE
            WHEN cost > 0 THEN ROUND(((price - cost) / cost * 100), 2)
            ELSE NULL
        END as margin_percentage,
        ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as revenue_rank,
        ROW_NUMBER() OVER (ORDER BY total_quantity_sold DESC) as quantity_rank,
        ROW_NUMBER() OVER (PARTITION BY category_name ORDER BY total_revenue DESC) as category_revenue_rank,
        PERCENT_RANK() OVER (ORDER BY total_revenue) as revenue_percentile,
        CASE
            WHEN total_quantity_sold = 0 THEN 'No Sales'
            WHEN PERCENT_RANK() OVER (ORDER BY total_revenue) >= 0.8 THEN 'Top Performer'
            WHEN PERCENT_RANK() OVER (ORDER BY total_revenue) >= 0.6 THEN 'Good Performer'
            WHEN PERCENT_RANK() OVER (ORDER BY total_revenue) >= 0.4 THEN 'Average Performer'
            WHEN PERCENT_RANK() OVER (ORDER BY total_revenue) >= 0.2 THEN 'Below Average'
            ELSE 'Poor Performer'
        END as performance_category
    FROM product_sales_metrics
)
SELECT
    sku,
    product_name,
    category_name,
    price,
    margin_percentage,
    total_quantity_sold,
    ROUND(total_revenue, 2) as total_revenue,
    orders_containing_product,
    unique_customers,
    ROUND(avg_quantity_per_order, 2) as avg_qty_per_order,
    revenue_rank,
    category_revenue_rank,
    performance_category,
    first_sale_date,
    last_sale_date,
    EXTRACT(DAYS FROM (CURRENT_DATE - last_sale_date)) as days_since_last_sale
FROM product_rankings
WHERE total_revenue > 0
ORDER BY total_revenue DESC
LIMIT 50;

-- Query 3: Sales Representative Performance Analysis
WITH sales_rep_metrics AS (
    SELECT
        sr.sales_rep_id,
        e.first_name,
        e.last_name,
        e.hire_date,
        sr.territory,
        sr.quota,
        sr.commission_rate,
        COUNT(o.order_id) as total_orders,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        SUM(o.total_amount) as total_sales,
        AVG(o.total_amount) as avg_order_value,
        SUM(o.total_amount * sr.commission_rate) as total_commission_earned,
        MIN(o.order_date) as first_sale_date,
        MAX(o.order_date) as last_sale_date
    FROM sales_reps sr
    JOIN employees e ON sr.employee_id = e.employee_id
    LEFT JOIN orders o ON sr.sales_rep_id = o.sales_rep_id
        AND o.order_status IN ('delivered', 'shipped')
        AND o.order_date >= DATE_TRUNC('year', CURRENT_DATE)
    WHERE sr.active = true
        AND e.active = true
    GROUP BY sr.sales_rep_id, e.first_name, e.last_name, e.hire_date,
             sr.territory, sr.quota, sr.commission_rate
),
rep_performance AS (
    SELECT
        *,
        CASE
            WHEN quota > 0 THEN ROUND((total_sales / quota * 100), 2)
            ELSE NULL
        END as quota_achievement_percentage,
        ROUND(total_sales / NULLIF(total_orders, 0), 2) as sales_per_order,
        ROUND(total_orders::decimal / NULLIF(unique_customers, 0), 2) as orders_per_customer,
        RANK() OVER (ORDER BY total_sales DESC) as sales_rank,
        RANK() OVER (ORDER BY total_orders DESC) as volume_rank,
        CASE
            WHEN quota > 0 AND total_sales >= quota * 1.2 THEN 'Exceptional'
            WHEN quota > 0 AND total_sales >= quota THEN 'Achieved'
            WHEN quota > 0 AND total_sales >= quota * 0.8 THEN 'Near Target'
            WHEN quota > 0 THEN 'Below Target'
            ELSE 'No Quota Set'
        END as performance_rating
    FROM sales_rep_metrics
)
SELECT
    first_name || ' ' || last_name as rep_name,
    territory,
    quota,
    total_sales,
    quota_achievement_percentage,
    performance_rating,
    total_orders,
    unique_customers,
    ROUND(avg_order_value, 2) as avg_order_value,
    sales_rank,
    volume_rank,
    ROUND(total_commission_earned, 2) as commission_earned,
    EXTRACT(DAYS FROM (CURRENT_DATE - hire_date)) as days_employed,
    first_sale_date,
    last_sale_date
FROM rep_performance
ORDER BY total_sales DESC;

-- =============================================================================
-- ADVANCED BUSINESS INTELLIGENCE QUERIES
-- =============================================================================

-- Query 4: Monthly Cohort Retention Analysis
WITH monthly_cohorts AS (
    SELECT
        c.customer_id,
        DATE_TRUNC('month', c.registration_date) as cohort_month,
        c.registration_date
    FROM customers c
    WHERE c.active = true
),
customer_orders_by_month AS (
    SELECT
        mc.customer_id,
        mc.cohort_month,
        DATE_TRUNC('month', o.order_date) as order_month,
        EXTRACT(MONTH FROM AGE(o.order_date, mc.registration_date)) as period_number
    FROM monthly_cohorts mc
    JOIN orders o ON mc.customer_id = o.customer_id
    WHERE o.order_status IN ('delivered', 'shipped')
),
cohort_table AS (
    SELECT
        cohort_month,
        period_number,
        COUNT(DISTINCT customer_id) as customers_in_period
    FROM customer_orders_by_month
    GROUP BY cohort_month, period_number
),
cohort_sizes AS (
    SELECT
        cohort_month,
        COUNT(customer_id) as cohort_size
    FROM monthly_cohorts
    GROUP BY cohort_month
)
SELECT
    cs.cohort_month,
    cs.cohort_size,
    ct.period_number,
    ct.customers_in_period,
    ROUND(ct.customers_in_period::decimal / cs.cohort_size * 100, 2) as retention_rate
FROM cohort_sizes cs
JOIN cohort_table ct ON cs.cohort_month = ct.cohort_month
WHERE ct.period_number <= 12  -- Show first 12 months
ORDER BY cs.cohort_month DESC, ct.period_number;

-- Query 5: RFM Analysis (Recency, Frequency, Monetary)
WITH customer_rfm_metrics AS (
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        c.email,
        COUNT(o.order_id) as frequency,
        COALESCE(SUM(o.total_amount), 0) as monetary_value,
        COALESCE(MAX(o.order_date), c.registration_date::timestamp) as last_order_date,
        EXTRACT(DAYS FROM (CURRENT_TIMESTAMP - COALESCE(MAX(o.order_date), c.registration_date::timestamp))) as recency_days
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
        AND o.order_status IN ('delivered', 'shipped')
    WHERE c.active = true
    GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.registration_date
),
rfm_scores AS (
    SELECT
        *,
        NTILE(5) OVER (ORDER BY recency_days ASC) as recency_score,  -- Lower days = higher score
        NTILE(5) OVER (ORDER BY frequency) as frequency_score,
        NTILE(5) OVER (ORDER BY monetary_value) as monetary_score
    FROM customer_rfm_metrics
),
rfm_segments AS (
    SELECT
        *,
        CASE
            WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4 THEN 'Champions'
            WHEN recency_score >= 3 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'Loyal Customers'
            WHEN recency_score >= 4 AND frequency_score <= 2 AND monetary_score <= 2 THEN 'New Customers'
            WHEN recency_score >= 3 AND frequency_score <= 2 AND monetary_score <= 2 THEN 'Potential Loyalists'
            WHEN recency_score <= 2 AND frequency_score >= 3 AND monetary_score >= 3 THEN 'At Risk'
            WHEN recency_score <= 2 AND frequency_score <= 2 AND monetary_score >= 3 THEN 'Cannot Lose Them'
            WHEN recency_score <= 2 AND frequency_score <= 2 AND monetary_score <= 2 THEN 'Hibernating'
            ELSE 'Others'
        END as rfm_segment
    FROM rfm_scores
)
SELECT
    rfm_segment,
    COUNT(*) as customer_count,
    ROUND(AVG(recency_days), 1) as avg_recency_days,
    ROUND(AVG(frequency), 1) as avg_frequency,
    ROUND(AVG(monetary_value), 2) as avg_monetary_value,
    ROUND(SUM(monetary_value), 2) as total_segment_value,
    ROUND(AVG(recency_score), 2) as avg_recency_score,
    ROUND(AVG(frequency_score), 2) as avg_frequency_score,
    ROUND(AVG(monetary_score), 2) as avg_monetary_score
FROM rfm_segments
GROUP BY rfm_segment
ORDER BY total_segment_value DESC;

-- Query 6: Advanced Inventory Analysis with Forecasting
WITH inventory_movement AS (
    SELECT
        p.product_id,
        p.sku,
        p.product_name,
        pc.category_name,
        i.quantity_on_hand,
        i.quantity_reserved,
        i.quantity_available,
        p.reorder_point,
        COALESCE(sales_30d.qty_sold_30d, 0) as qty_sold_last_30_days,
        COALESCE(sales_90d.qty_sold_90d, 0) as qty_sold_last_90_days,
        COALESCE(sales_30d.qty_sold_30d, 0) / 30.0 as avg_daily_sales_30d,
        COALESCE(sales_90d.qty_sold_90d, 0) / 90.0 as avg_daily_sales_90d
    FROM products p
    LEFT JOIN product_categories pc ON p.category_id = pc.category_id
    LEFT JOIN inventory i ON p.product_id = i.product_id
    LEFT JOIN (
        SELECT
            oi.product_id,
            SUM(oi.quantity) as qty_sold_30d
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_status IN ('delivered', 'shipped')
            AND o.order_date >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY oi.product_id
    ) sales_30d ON p.product_id = sales_30d.product_id
    LEFT JOIN (
        SELECT
            oi.product_id,
            SUM(oi.quantity) as qty_sold_90d
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.order_status IN ('delivered', 'shipped')
            AND o.order_date >= CURRENT_DATE - INTERVAL '90 days'
        GROUP BY oi.product_id
    ) sales_90d ON p.product_id = sales_90d.product_id
    WHERE p.active = true
),
reorder_analysis AS (
    SELECT
        *,
        CASE
            WHEN avg_daily_sales_30d > 0 THEN
                ROUND(quantity_available / avg_daily_sales_30d, 1)
            ELSE NULL
        END as days_of_stock_remaining_30d,
        CASE
            WHEN avg_daily_sales_90d > 0 THEN
                ROUND(quantity_available / avg_daily_sales_90d, 1)
            ELSE NULL
        END as days_of_stock_remaining_90d,
        CASE
            WHEN quantity_available <= 0 THEN 'Out of Stock'
            WHEN quantity_available <= reorder_point * 0.5 THEN 'Critical'
            WHEN quantity_available <= reorder_point THEN 'Reorder Now'
            WHEN quantity_available <= reorder_point * 1.5 THEN 'Monitor'
            ELSE 'Good Stock'
        END as stock_status,
        ROUND(avg_daily_sales_30d * 60, 0) as suggested_reorder_qty  -- 60 days supply
    FROM inventory_movement
)
SELECT
    sku,
    product_name,
    category_name,
    quantity_on_hand,
    quantity_reserved,
    quantity_available,
    stock_status,
    qty_sold_last_30_days,
    ROUND(avg_daily_sales_30d, 2) as avg_daily_sales,
    days_of_stock_remaining_30d,
    suggested_reorder_qty,
    reorder_point
FROM reorder_analysis
WHERE stock_status IN ('Out of Stock', 'Critical', 'Reorder Now', 'Monitor')
ORDER BY
    CASE stock_status
        WHEN 'Out of Stock' THEN 1
        WHEN 'Critical' THEN 2
        WHEN 'Reorder Now' THEN 3
        WHEN 'Monitor' THEN 4
        ELSE 5
    END,
    days_of_stock_remaining_30d NULLS LAST;

-- =============================================================================
-- EXECUTIVE DASHBOARD QUERIES
-- =============================================================================

-- Query 7: Executive Summary Dashboard
WITH kpi_metrics AS (
    SELECT
        COUNT(DISTINCT c.customer_id) as total_customers,
        COUNT(DISTINCT CASE WHEN c.registration_date >= CURRENT_DATE - INTERVAL '30 days' THEN c.customer_id END) as new_customers_30d,
        COUNT(DISTINCT p.product_id) as total_products,
        COUNT(DISTINCT CASE WHEN p.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN p.product_id END) as new_products_30d
    FROM customers c
    CROSS JOIN products p
    WHERE c.active = true AND p.active = true
),
sales_metrics AS (
    SELECT
        COUNT(o.order_id) as total_orders_30d,
        COALESCE(SUM(o.total_amount), 0) as total_revenue_30d,
        COALESCE(AVG(o.total_amount), 0) as avg_order_value_30d,
        COUNT(DISTINCT o.customer_id) as active_customers_30d
    FROM orders o
    WHERE o.order_date >= CURRENT_DATE - INTERVAL '30 days'
        AND o.order_status IN ('delivered', 'shipped', 'processing')
),
growth_metrics AS (
    SELECT
        current_month.revenue as current_month_revenue,
        previous_month.revenue as previous_month_revenue,
        CASE
            WHEN previous_month.revenue > 0 THEN
                ROUND(((current_month.revenue - previous_month.revenue) / previous_month.revenue * 100), 2)
            ELSE NULL
        END as revenue_growth_percentage
    FROM (
        SELECT COALESCE(SUM(total_amount), 0) as revenue
        FROM orders
        WHERE DATE_TRUNC('month', order_date) = DATE_TRUNC('month', CURRENT_DATE)
            AND order_status IN ('delivered', 'shipped')
    ) current_month
    CROSS JOIN (
        SELECT COALESCE(SUM(total_amount), 0) as revenue
        FROM orders
        WHERE DATE_TRUNC('month', order_date) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
            AND order_status IN ('delivered', 'shipped')
    ) previous_month
)
SELECT
    'Customer Metrics' as metric_category,
    json_build_object(
        'total_customers', k.total_customers,
        'new_customers_30d', k.new_customers_30d,
        'customer_growth_rate', ROUND(k.new_customers_30d::decimal / NULLIF(k.total_customers, 0) * 100, 2)
    ) as metrics
FROM kpi_metrics k

UNION ALL

SELECT
    'Product Metrics' as metric_category,
    json_build_object(
        'total_products', k.total_products,
        'new_products_30d', k.new_products_30d,
        'product_growth_rate', ROUND(k.new_products_30d::decimal / NULLIF(k.total_products, 0) * 100, 2)
    ) as metrics
FROM kpi_metrics k

UNION ALL

SELECT
    'Sales Metrics' as metric_category,
    json_build_object(
        'total_orders_30d', s.total_orders_30d,
        'total_revenue_30d', ROUND(s.total_revenue_30d, 2),
        'avg_order_value_30d', ROUND(s.avg_order_value_30d, 2),
        'active_customers_30d', s.active_customers_30d
    ) as metrics
FROM sales_metrics s

UNION ALL

SELECT
    'Growth Metrics' as metric_category,
    json_build_object(
        'current_month_revenue', ROUND(g.current_month_revenue, 2),
        'previous_month_revenue', ROUND(g.previous_month_revenue, 2),
        'revenue_growth_percentage', g.revenue_growth_percentage
    ) as metrics
FROM growth_metrics g;