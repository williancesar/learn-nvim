-- PostgreSQL Practice: Jump History Navigation
-- Day 21: Multi-query file for practicing Ctrl+O, Ctrl+I, and jump list navigation
-- Use this file to practice jumping between different query sections

-- ==============================================
-- QUERY BLOCK 1: USER AUTHENTICATION ANALYTICS
-- ==============================================
-- Practice: Jump here frequently with searches and marks

SELECT 
    user_id,
    username,
    email,
    login_count,
    last_login_date,
    account_creation_date,
    EXTRACT(DAYS FROM (CURRENT_DATE - last_login_date)) as days_since_last_login
FROM user_accounts 
WHERE account_status = 'active'
    AND login_count > 0
    AND last_login_date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY login_count DESC, last_login_date DESC;

-- ==============================================
-- QUERY BLOCK 2: PRODUCT INVENTORY MANAGEMENT  
-- ==============================================
-- Navigate here using /QUERY BLOCK 2 and create jump points

WITH inventory_levels AS (
    SELECT 
        product_id,
        product_name,
        current_stock,
        reorder_level,
        max_stock_level,
        supplier_id,
        CASE 
            WHEN current_stock <= reorder_level THEN 'REORDER_NEEDED'
            WHEN current_stock >= max_stock_level * 0.9 THEN 'OVERSTOCKED'
            ELSE 'NORMAL'
        END as stock_status
    FROM products
    WHERE is_active = true
),
reorder_calculations AS (
    SELECT 
        il.*,
        (max_stock_level - current_stock) as reorder_quantity,
        s.supplier_name,
        s.lead_time_days,
        s.minimum_order_quantity
    FROM inventory_levels il
    JOIN suppliers s ON il.supplier_id = s.supplier_id
    WHERE il.stock_status = 'REORDER_NEEDED'
)
SELECT * FROM reorder_calculations
ORDER BY lead_time_days, supplier_name;

-- ==============================================
-- QUERY BLOCK 3: SALES PERFORMANCE DASHBOARD
-- ==============================================
-- Jump between this and other blocks to practice Ctrl+O/Ctrl+I

SELECT 
    DATE_TRUNC('week', order_date) as sales_week,
    COUNT(DISTINCT order_id) as total_orders,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(order_total) as weekly_revenue,
    AVG(order_total) as average_order_value,
    SUM(order_total) - LAG(SUM(order_total)) OVER (ORDER BY DATE_TRUNC('week', order_date)) as revenue_change,
    ROUND(
        ((SUM(order_total) - LAG(SUM(order_total)) OVER (ORDER BY DATE_TRUNC('week', order_date))) / 
         NULLIF(LAG(SUM(order_total)) OVER (ORDER BY DATE_TRUNC('week', order_date)), 0) * 100), 2
    ) as revenue_growth_percentage
FROM orders 
WHERE order_status = 'completed'
    AND order_date >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', order_date)
ORDER BY sales_week DESC;

-- ==============================================
-- QUERY BLOCK 4: CUSTOMER SEGMENTATION ANALYSIS
-- ==============================================
-- Practice jumping to specific line numbers within this block

WITH customer_metrics AS (
    SELECT 
        c.customer_id,
        c.first_name,
        c.last_name,
        c.registration_date,
        COUNT(o.order_id) as total_orders,
        SUM(o.order_total) as lifetime_value,
        AVG(o.order_total) as avg_order_value,
        MAX(o.order_date) as last_order_date,
        MIN(o.order_date) as first_order_date,
        EXTRACT(DAYS FROM (CURRENT_DATE - MAX(o.order_date))) as days_since_last_order
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.order_status = 'completed'
    WHERE c.registration_date >= '2022-01-01'
    GROUP BY c.customer_id, c.first_name, c.last_name, c.registration_date
),
customer_segments AS (
    SELECT 
        *,
        CASE 
            WHEN total_orders = 0 THEN 'NEW_REGISTERED'
            WHEN total_orders = 1 THEN 'ONE_TIME_BUYER'
            WHEN total_orders BETWEEN 2 AND 5 THEN 'OCCASIONAL_BUYER'
            WHEN total_orders BETWEEN 6 AND 15 THEN 'REGULAR_BUYER'
            WHEN total_orders > 15 THEN 'FREQUENT_BUYER'
        END as frequency_segment,
        CASE 
            WHEN lifetime_value = 0 THEN 'NO_VALUE'
            WHEN lifetime_value BETWEEN 0.01 AND 100 THEN 'LOW_VALUE'
            WHEN lifetime_value BETWEEN 100.01 AND 500 THEN 'MEDIUM_VALUE'
            WHEN lifetime_value BETWEEN 500.01 AND 2000 THEN 'HIGH_VALUE'
            WHEN lifetime_value > 2000 THEN 'VIP_VALUE'
        END as value_segment,
        CASE 
            WHEN days_since_last_order IS NULL THEN 'NEVER_PURCHASED'
            WHEN days_since_last_order <= 30 THEN 'RECENT'
            WHEN days_since_last_order <= 90 THEN 'ACTIVE'
            WHEN days_since_last_order <= 180 THEN 'DORMANT'
            WHEN days_since_last_order > 180 THEN 'CHURNED'
        END as recency_segment
    FROM customer_metrics
)
SELECT 
    frequency_segment,
    value_segment,
    recency_segment,
    COUNT(*) as customer_count,
    AVG(lifetime_value) as avg_segment_value,
    AVG(total_orders) as avg_segment_orders
FROM customer_segments
GROUP BY frequency_segment, value_segment, recency_segment
ORDER BY customer_count DESC;

-- ==============================================
-- QUERY BLOCK 5: GEOGRAPHIC SALES DISTRIBUTION
-- ==============================================
-- Use marks (ma, mb, mc) to set bookmarks in this section

SELECT 
    shipping_country,
    shipping_state,
    shipping_city,
    COUNT(DISTINCT order_id) as order_count,
    COUNT(DISTINCT customer_id) as customer_count,
    SUM(order_total) as total_revenue,
    AVG(order_total) as avg_order_value,
    AVG(shipping_cost) as avg_shipping_cost,
    ROUND(AVG(shipping_cost) / AVG(order_total) * 100, 2) as shipping_cost_percentage
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_status = 'completed'
    AND o.order_date >= CURRENT_DATE - INTERVAL '1 year'
    AND shipping_country IS NOT NULL
GROUP BY shipping_country, shipping_state, shipping_city
HAVING COUNT(DISTINCT order_id) >= 5
ORDER BY total_revenue DESC, order_count DESC;

-- ==============================================
-- QUERY BLOCK 6: PRODUCT CATEGORY PERFORMANCE
-- ==============================================
-- Jump here using gg, G, and specific line numbers

WITH category_sales AS (
    SELECT 
        p.category_id,
        cat.category_name,
        p.subcategory,
        COUNT(DISTINCT oi.order_id) as orders_with_category,
        SUM(oi.quantity) as total_units_sold,
        SUM(oi.quantity * oi.unit_price) as category_revenue,
        AVG(oi.unit_price) as avg_unit_price,
        COUNT(DISTINCT p.product_id) as products_in_category,
        COUNT(DISTINCT oi.order_id) / COUNT(DISTINCT p.product_id)::FLOAT as avg_orders_per_product
    FROM products p
    JOIN categories cat ON p.category_id = cat.category_id
    JOIN order_items oi ON p.product_id = oi.product_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.order_status = 'completed'
        AND o.order_date >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY p.category_id, cat.category_name, p.subcategory
)
SELECT 
    category_name,
    subcategory,
    orders_with_category,
    total_units_sold,
    ROUND(category_revenue, 2) as category_revenue,
    ROUND(avg_unit_price, 2) as avg_unit_price,
    products_in_category,
    ROUND(avg_orders_per_product, 2) as avg_orders_per_product,
    RANK() OVER (ORDER BY category_revenue DESC) as revenue_rank,
    RANK() OVER (ORDER BY total_units_sold DESC) as volume_rank
FROM category_sales
WHERE category_revenue > 1000
ORDER BY category_revenue DESC;

-- ==============================================
-- QUERY BLOCK 7: EMPLOYEE PERFORMANCE METRICS
-- ==============================================
-- Navigate between employee records using f/F and t/T

SELECT 
    e.employee_id,
    e.first_name || ' ' || e.last_name as employee_name,
    e.department,
    e.position,
    e.hire_date,
    COUNT(DISTINCT o.order_id) as orders_processed,
    SUM(o.order_total) as total_sales_amount,
    AVG(o.order_total) as avg_order_processed,
    COUNT(DISTINCT o.customer_id) as unique_customers_served,
    AVG(cr.rating) as avg_customer_rating,
    COUNT(cr.review_id) as total_reviews_received,
    ROUND(
        SUM(o.order_total) / COUNT(DISTINCT o.order_id), 2
    ) as revenue_per_order,
    RANK() OVER (PARTITION BY e.department ORDER BY SUM(o.order_total) DESC) as dept_sales_rank
FROM employees e
LEFT JOIN orders o ON e.employee_id = o.processed_by_employee_id 
    AND o.order_status = 'completed'
    AND o.order_date >= CURRENT_DATE - INTERVAL '3 months'
LEFT JOIN customer_reviews cr ON o.order_id = cr.order_id
WHERE e.employment_status = 'active'
GROUP BY e.employee_id, e.first_name, e.last_name, e.department, e.position, e.hire_date
HAVING COUNT(DISTINCT o.order_id) > 0
ORDER BY total_sales_amount DESC, orders_processed DESC;

-- ==============================================
-- QUERY BLOCK 8: SEASONAL TRENDS ANALYSIS
-- ==============================================
-- Practice jumping between seasons and months

WITH monthly_trends AS (
    SELECT 
        EXTRACT(YEAR FROM order_date) as order_year,
        EXTRACT(MONTH FROM order_date) as order_month,
        EXTRACT(QUARTER FROM order_date) as order_quarter,
        CASE EXTRACT(MONTH FROM order_date)
            WHEN 12 OR 1 OR 2 THEN 'Winter'
            WHEN 3 OR 4 OR 5 THEN 'Spring' 
            WHEN 6 OR 7 OR 8 THEN 'Summer'
            WHEN 9 OR 10 OR 11 THEN 'Fall'
        END as season,
        COUNT(DISTINCT order_id) as monthly_orders,
        SUM(order_total) as monthly_revenue,
        AVG(order_total) as monthly_avg_order,
        COUNT(DISTINCT customer_id) as monthly_customers
    FROM orders
    WHERE order_status = 'completed'
        AND order_date >= CURRENT_DATE - INTERVAL '2 years'
    GROUP BY 
        EXTRACT(YEAR FROM order_date),
        EXTRACT(MONTH FROM order_date),
        EXTRACT(QUARTER FROM order_date)
),
seasonal_comparison AS (
    SELECT 
        season,
        order_year,
        SUM(monthly_orders) as seasonal_orders,
        SUM(monthly_revenue) as seasonal_revenue,
        AVG(monthly_avg_order) as seasonal_avg_order,
        SUM(monthly_customers) as seasonal_customers,
        LAG(SUM(monthly_revenue)) OVER (PARTITION BY season ORDER BY order_year) as prev_year_seasonal_revenue
    FROM monthly_trends
    GROUP BY season, order_year
)
SELECT 
    season,
    order_year,
    seasonal_orders,
    ROUND(seasonal_revenue, 2) as seasonal_revenue,
    ROUND(seasonal_avg_order, 2) as seasonal_avg_order,
    seasonal_customers,
    ROUND(prev_year_seasonal_revenue, 2) as prev_year_revenue,
    ROUND(
        (seasonal_revenue - prev_year_seasonal_revenue) / 
        NULLIF(prev_year_seasonal_revenue, 0) * 100, 2
    ) as year_over_year_growth
FROM seasonal_comparison
ORDER BY order_year DESC, 
    CASE season 
        WHEN 'Spring' THEN 1
        WHEN 'Summer' THEN 2 
        WHEN 'Fall' THEN 3
        WHEN 'Winter' THEN 4
    END;

-- ==============================================
-- QUERY BLOCK 9: SHIPPING AND LOGISTICS
-- ==============================================
-- Use this section for practicing complex navigation patterns

SELECT 
    s.shipping_method,
    s.carrier_name,
    COUNT(DISTINCT o.order_id) as shipments_count,
    AVG(s.shipping_cost) as avg_shipping_cost,
    AVG(EXTRACT(DAYS FROM (s.delivered_date - s.shipped_date))) as avg_delivery_days,
    COUNT(CASE WHEN s.delivery_status = 'delivered_on_time' THEN 1 END) as on_time_deliveries,
    COUNT(CASE WHEN s.delivery_status = 'delivered_late' THEN 1 END) as late_deliveries,
    COUNT(CASE WHEN s.delivery_status = 'lost_or_damaged' THEN 1 END) as problematic_deliveries,
    ROUND(
        COUNT(CASE WHEN s.delivery_status = 'delivered_on_time' THEN 1 END) * 100.0 / 
        COUNT(DISTINCT o.order_id), 2
    ) as on_time_percentage,
    SUM(s.shipping_cost) as total_shipping_revenue,
    AVG(customer_satisfaction_rating) as avg_satisfaction_rating
FROM orders o
JOIN shipments s ON o.order_id = s.order_id
WHERE o.order_date >= CURRENT_DATE - INTERVAL '6 months'
    AND s.shipped_date IS NOT NULL
GROUP BY s.shipping_method, s.carrier_name
HAVING COUNT(DISTINCT o.order_id) >= 10
ORDER BY on_time_percentage DESC, avg_delivery_days ASC;

-- ==============================================
-- QUERY BLOCK 10: FINANCIAL SUMMARY DASHBOARD  
-- ==============================================
-- Final section for comprehensive jump practice

WITH financial_overview AS (
    SELECT 
        'Total Revenue' as metric,
        SUM(order_total)::TEXT as value,
        'Last 12 Months' as period
    FROM orders 
    WHERE order_status = 'completed' 
        AND order_date >= CURRENT_DATE - INTERVAL '12 months'
    
    UNION ALL
    
    SELECT 
        'Average Order Value' as metric,
        ROUND(AVG(order_total), 2)::TEXT as value,
        'Last 12 Months' as period
    FROM orders 
    WHERE order_status = 'completed' 
        AND order_date >= CURRENT_DATE - INTERVAL '12 months'
    
    UNION ALL
    
    SELECT 
        'Total Orders' as metric,
        COUNT(DISTINCT order_id)::TEXT as value,
        'Last 12 Months' as period
    FROM orders 
    WHERE order_status = 'completed' 
        AND order_date >= CURRENT_DATE - INTERVAL '12 months'
    
    UNION ALL
    
    SELECT 
        'Unique Customers' as metric,
        COUNT(DISTINCT customer_id)::TEXT as value,
        'Last 12 Months' as period
    FROM orders 
    WHERE order_status = 'completed' 
        AND order_date >= CURRENT_DATE - INTERVAL '12 months'
    
    UNION ALL
    
    SELECT 
        'Customer Acquisition Cost' as metric,
        ROUND(
            (SELECT SUM(marketing_spend) FROM marketing_campaigns WHERE campaign_date >= CURRENT_DATE - INTERVAL '12 months') /
            NULLIF((SELECT COUNT(DISTINCT customer_id) FROM customers WHERE registration_date >= CURRENT_DATE - INTERVAL '12 months'), 0), 2
        )::TEXT as value,
        'Last 12 Months' as period
)
SELECT * FROM financial_overview
ORDER BY metric;

-- End of jump practice file - Use Ctrl+O and Ctrl+I to navigate your jump history!