-- PostgreSQL Practice: Marks Usage
-- Day 24: Strategic sections requiring marks for efficient navigation
-- Practice setting marks with ma, mb, mc, etc. and jumping with 'a, 'b, 'c

-- ========================================
-- MARK A: Customer Data Analysis Section
-- ========================================
-- Set mark 'a' here with: ma

-- Strategic bookmark location for customer queries
-- Jump back to this section anytime with 'a

WITH customer_segmentation AS (
    SELECT
        customer_id,
        first_name,
        last_name,
        email,
        registration_date,
        COUNT(o.order_id) as total_orders,
        SUM(o.total_amount) as lifetime_value,
        AVG(o.total_amount) as avg_order_value,
        MAX(o.order_date) as last_order_date,
        EXTRACT(DAYS FROM (CURRENT_DATE - MAX(o.order_date))) as days_since_last_order,

        -- Customer tier calculation
        CASE
            WHEN SUM(o.total_amount) >= 10000 THEN 'VIP'
            WHEN SUM(o.total_amount) >= 5000 THEN 'Premium'
            WHEN SUM(o.total_amount) >= 1000 THEN 'Gold'
            WHEN SUM(o.total_amount) >= 500 THEN 'Silver'
            ELSE 'Bronze'
        END as customer_tier,

        -- Engagement level based on recency and frequency
        CASE
            WHEN COUNT(o.order_id) >= 10 AND EXTRACT(DAYS FROM (CURRENT_DATE - MAX(o.order_date))) <= 30 THEN 'Highly_Engaged'
            WHEN COUNT(o.order_id) >= 5 AND EXTRACT(DAYS FROM (CURRENT_DATE - MAX(o.order_date))) <= 90 THEN 'Engaged'
            WHEN COUNT(o.order_id) >= 2 AND EXTRACT(DAYS FROM (CURRENT_DATE - MAX(o.order_date))) <= 180 THEN 'Moderately_Engaged'
            WHEN EXTRACT(DAYS FROM (CURRENT_DATE - MAX(o.order_date))) <= 365 THEN 'Low_Engagement'
            ELSE 'At_Risk'
        END as engagement_level

    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
        AND o.order_status = 'completed'
    WHERE c.registration_date >= '2022-01-01'
    GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.registration_date
)
SELECT
    customer_tier,
    engagement_level,
    COUNT(*) as customer_count,
    AVG(lifetime_value) as avg_lifetime_value,
    AVG(total_orders) as avg_orders,
    AVG(days_since_last_order) as avg_days_since_last_order
FROM customer_segmentation
GROUP BY customer_tier, engagement_level
ORDER BY
    CASE customer_tier
        WHEN 'VIP' THEN 1
        WHEN 'Premium' THEN 2
        WHEN 'Gold' THEN 3
        WHEN 'Silver' THEN 4
        ELSE 5
    END,
    CASE engagement_level
        WHEN 'Highly_Engaged' THEN 1
        WHEN 'Engaged' THEN 2
        WHEN 'Moderately_Engaged' THEN 3
        WHEN 'Low_Engagement' THEN 4
        ELSE 5
    END;

-- ========================================
-- MARK B: Product Performance Section
-- ========================================
-- Set mark 'b' here with: mb

-- Key product analytics requiring frequent reference
-- Navigate here quickly with 'b

WITH product_metrics AS (
    SELECT
        p.product_id,
        p.product_name,
        p.category_id,
        cat.category_name,
        p.unit_price,
        p.cost_price,
        p.unit_price - p.cost_price as profit_per_unit,
        (p.unit_price - p.cost_price) / p.unit_price * 100 as profit_margin_pct,

        -- Sales performance metrics
        COALESCE(SUM(od.quantity), 0) as total_units_sold,
        COALESCE(SUM(od.quantity * od.unit_price), 0) as total_revenue,
        COALESCE(COUNT(DISTINCT od.order_id), 0) as orders_containing_product,
        COALESCE(COUNT(DISTINCT o.customer_id), 0) as unique_customers,

        -- Time-based analysis
        MIN(o.order_date) as first_sale_date,
        MAX(o.order_date) as last_sale_date,
        EXTRACT(DAYS FROM (MAX(o.order_date) - MIN(o.order_date))) as selling_period_days,

        -- Current inventory status
        p.units_in_stock,
        p.reorder_level,
        CASE
            WHEN p.units_in_stock <= 0 THEN 'Out_of_Stock'
            WHEN p.units_in_stock <= p.reorder_level THEN 'Low_Stock'
            WHEN p.units_in_stock <= p.reorder_level * 2 THEN 'Moderate_Stock'
            ELSE 'Well_Stocked'
        END as stock_status

    FROM products p
    LEFT JOIN categories cat ON p.category_id = cat.category_id
    LEFT JOIN order_details od ON p.product_id = od.product_id
    LEFT JOIN orders o ON od.order_id = o.order_id
        AND o.order_status = 'completed'
        AND o.order_date >= CURRENT_DATE - INTERVAL '1 year'
    WHERE p.discontinued = false
    GROUP BY p.product_id, p.product_name, p.category_id, cat.category_name,
             p.unit_price, p.cost_price, p.units_in_stock, p.reorder_level
),
product_rankings AS (
    SELECT
        *,
        ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as revenue_rank,
        ROW_NUMBER() OVER (ORDER BY total_units_sold DESC) as volume_rank,
        ROW_NUMBER() OVER (ORDER BY profit_margin_pct DESC) as margin_rank,
        ROW_NUMBER() OVER (PARTITION BY category_name ORDER BY total_revenue DESC) as category_revenue_rank,

        -- Performance classification
        CASE
            WHEN total_revenue >= (SELECT PERCENTILE_CONT(0.8) WITHIN GROUP (ORDER BY total_revenue) FROM product_metrics WHERE total_revenue > 0)
                AND total_units_sold >= (SELECT PERCENTILE_CONT(0.8) WITHIN GROUP (ORDER BY total_units_sold) FROM product_metrics WHERE total_units_sold > 0)
            THEN 'Star'
            WHEN total_revenue >= (SELECT PERCENTILE_CONT(0.6) WITHIN GROUP (ORDER BY total_revenue) FROM product_metrics WHERE total_revenue > 0)
            THEN 'Rising_Star'
            WHEN total_units_sold >= (SELECT PERCENTILE_CONT(0.6) WITHIN GROUP (ORDER BY total_units_sold) FROM product_metrics WHERE total_units_sold > 0)
            THEN 'Volume_Driver'
            WHEN profit_margin_pct >= 50
            THEN 'High_Margin'
            WHEN total_revenue > 0
            THEN 'Standard'
            ELSE 'No_Sales'
        END as performance_category

    FROM product_metrics
)
SELECT
    product_name,
    category_name,
    total_units_sold,
    total_revenue,
    profit_margin_pct,
    stock_status,
    performance_category,
    revenue_rank,
    category_revenue_rank
FROM product_rankings
WHERE total_revenue > 0
ORDER BY revenue_rank
LIMIT 50;

-- ========================================
-- MARK C: Financial Summary Section
-- ========================================
-- Set mark 'c' here with: mc

-- Critical financial metrics and KPIs
-- Quick access with 'c for dashboard updates

WITH monthly_financials AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        COUNT(DISTINCT order_id) as total_orders,
        COUNT(DISTINCT customer_id) as unique_customers,
        SUM(total_amount) as gross_revenue,
        SUM(total_amount - shipping_cost) as net_revenue,
        AVG(total_amount) as average_order_value,
        SUM(shipping_cost) as total_shipping_revenue,

        -- Cost calculations (estimated)
        SUM(
            (SELECT SUM(od.quantity * p.cost_price)
             FROM order_details od
             JOIN products p ON od.product_id = p.product_id
             WHERE od.order_id = o.order_id)
        ) as total_cost_of_goods,

        -- Customer metrics
        COUNT(CASE WHEN c.registration_date >= DATE_TRUNC('month', o.order_date) THEN 1 END) as new_customers,
        COUNT(CASE WHEN c.registration_date < DATE_TRUNC('month', o.order_date) THEN 1 END) as returning_customers,

        -- Payment method breakdown
        COUNT(CASE WHEN payment_method = 'credit_card' THEN 1 END) as credit_card_orders,
        COUNT(CASE WHEN payment_method = 'paypal' THEN 1 END) as paypal_orders,
        COUNT(CASE WHEN payment_method = 'bank_transfer' THEN 1 END) as bank_transfer_orders

    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    WHERE o.order_status = 'completed'
        AND o.order_date >= CURRENT_DATE - INTERVAL '24 months'
    GROUP BY DATE_TRUNC('month', order_date)
),
financial_analysis AS (
    SELECT
        month,
        total_orders,
        unique_customers,
        gross_revenue,
        net_revenue,
        total_cost_of_goods,
        gross_revenue - total_cost_of_goods as gross_profit,
        (gross_revenue - total_cost_of_goods) / gross_revenue * 100 as gross_profit_margin,
        average_order_value,
        total_shipping_revenue,
        new_customers,
        returning_customers,
        new_customers::FLOAT / unique_customers * 100 as new_customer_percentage,

        -- Growth calculations
        LAG(gross_revenue) OVER (ORDER BY month) as prev_month_revenue,
        (gross_revenue - LAG(gross_revenue) OVER (ORDER BY month)) /
            NULLIF(LAG(gross_revenue) OVER (ORDER BY month), 0) * 100 as revenue_growth_pct,

        LAG(unique_customers) OVER (ORDER BY month) as prev_month_customers,
        (unique_customers - LAG(unique_customers) OVER (ORDER BY month)) /
            NULLIF(LAG(unique_customers) OVER (ORDER BY month), 0) * 100 as customer_growth_pct,

        -- Payment method percentages
        credit_card_orders::FLOAT / total_orders * 100 as credit_card_pct,
        paypal_orders::FLOAT / total_orders * 100 as paypal_pct,
        bank_transfer_orders::FLOAT / total_orders * 100 as bank_transfer_pct

    FROM monthly_financials
)
SELECT
    TO_CHAR(month, 'YYYY-MM') as month,
    total_orders,
    unique_customers,
    ROUND(gross_revenue, 2) as gross_revenue,
    ROUND(net_revenue, 2) as net_revenue,
    ROUND(gross_profit, 2) as gross_profit,
    ROUND(gross_profit_margin, 2) as gross_profit_margin_pct,
    ROUND(average_order_value, 2) as avg_order_value,
    new_customers,
    returning_customers,
    ROUND(new_customer_percentage, 2) as new_customer_pct,
    ROUND(revenue_growth_pct, 2) as revenue_growth_pct,
    ROUND(customer_growth_pct, 2) as customer_growth_pct
FROM financial_analysis
ORDER BY month DESC;

-- ========================================
-- MARK D: Inventory Management Section
-- ========================================
-- Set mark 'd' here with: md

-- Inventory control and reorder analysis
-- Bookmark for supply chain decisions with 'd

WITH inventory_analysis AS (
    SELECT
        p.product_id,
        p.product_name,
        p.sku,
        cat.category_name,
        s.company_name as supplier_name,
        p.units_in_stock,
        p.reorder_level,
        p.units_on_order,

        -- Historical usage calculation
        COALESCE(
            (SELECT SUM(od.quantity)
             FROM order_details od
             JOIN orders o ON od.order_id = o.order_id
             WHERE od.product_id = p.product_id
               AND o.order_status = 'completed'
               AND o.order_date >= CURRENT_DATE - INTERVAL '90 days'), 0
        ) as units_sold_90_days,

        COALESCE(
            (SELECT SUM(od.quantity)
             FROM order_details od
             JOIN orders o ON od.order_id = o.order_id
             WHERE od.product_id = p.product_id
               AND o.order_status = 'completed'
               AND o.order_date >= CURRENT_DATE - INTERVAL '30 days'), 0
        ) as units_sold_30_days,

        -- Projected usage
        COALESCE(
            (SELECT SUM(od.quantity)
             FROM order_details od
             JOIN orders o ON od.order_id = o.order_id
             WHERE od.product_id = p.product_id
               AND o.order_status = 'completed'
               AND o.order_date >= CURRENT_DATE - INTERVAL '90 days'), 0
        ) / 90.0 as daily_usage_rate,

        -- Supplier information
        s.lead_time_days,
        s.minimum_order_quantity,
        p.unit_price,
        p.cost_price

    FROM products p
    LEFT JOIN categories cat ON p.category_id = cat.category_id
    LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
    WHERE p.discontinued = false
),
reorder_recommendations AS (
    SELECT
        *,
        daily_usage_rate * lead_time_days as safety_stock_needed,
        daily_usage_rate * (lead_time_days + 7) as recommended_reorder_level,
        units_in_stock / NULLIF(daily_usage_rate, 0) as days_of_stock_remaining,

        -- Reorder urgency classification
        CASE
            WHEN units_in_stock <= 0 THEN 'Emergency_Order'
            WHEN units_in_stock <= reorder_level THEN 'Immediate_Reorder'
            WHEN units_in_stock <= daily_usage_rate * lead_time_days THEN 'Reorder_Soon'
            WHEN units_in_stock <= daily_usage_rate * (lead_time_days + 14) THEN 'Monitor_Closely'
            ELSE 'Adequate_Stock'
        END as reorder_status,

        -- Calculate optimal order quantity
        GREATEST(
            minimum_order_quantity,
            CEIL((daily_usage_rate * (lead_time_days + 30)) - units_in_stock)
        ) as suggested_order_quantity,

        -- Financial impact
        (units_in_stock + units_on_order) * cost_price as inventory_value,
        units_sold_30_days * (unit_price - cost_price) as monthly_profit_contribution

    FROM inventory_analysis
    WHERE daily_usage_rate > 0 OR units_in_stock <= reorder_level
)
SELECT
    product_name,
    sku,
    category_name,
    supplier_name,
    units_in_stock,
    reorder_level,
    ROUND(recommended_reorder_level) as recommended_reorder_level,
    ROUND(daily_usage_rate, 2) as daily_usage_rate,
    ROUND(days_of_stock_remaining, 1) as days_remaining,
    reorder_status,
    suggested_order_quantity,
    lead_time_days,
    ROUND(inventory_value, 2) as inventory_value,
    ROUND(monthly_profit_contribution, 2) as monthly_profit
FROM reorder_recommendations
WHERE reorder_status IN ('Emergency_Order', 'Immediate_Reorder', 'Reorder_Soon')
ORDER BY
    CASE reorder_status
        WHEN 'Emergency_Order' THEN 1
        WHEN 'Immediate_Reorder' THEN 2
        WHEN 'Reorder_Soon' THEN 3
        ELSE 4
    END,
    days_of_stock_remaining ASC;

-- ========================================
-- MARK E: Marketing Campaign Analysis
-- ========================================
-- Set mark 'e' here with: me

-- Marketing effectiveness and ROI tracking
-- Quick navigation to campaign data with 'e

WITH campaign_performance AS (
    SELECT
        mc.campaign_id,
        mc.campaign_name,
        mc.campaign_type,
        mc.start_date,
        mc.end_date,
        mc.budget_allocated,
        mc.actual_spent,

        -- Customer acquisition metrics
        COUNT(DISTINCT c.customer_id) as customers_acquired,
        COUNT(DISTINCT CASE WHEN c.registration_date BETWEEN mc.start_date AND mc.end_date THEN c.customer_id END) as new_customers_during_campaign,

        -- Revenue attribution
        SUM(CASE WHEN o.order_date BETWEEN mc.start_date AND mc.end_date THEN o.total_amount ELSE 0 END) as revenue_during_campaign,
        SUM(CASE WHEN o.order_date BETWEEN mc.start_date AND mc.end_date + INTERVAL '30 days' THEN o.total_amount ELSE 0 END) as revenue_30_days_post,
        COUNT(CASE WHEN o.order_date BETWEEN mc.start_date AND mc.end_date THEN o.order_id END) as orders_during_campaign,

        -- Long-term value tracking
        SUM(o.total_amount) as total_attributed_revenue,
        COUNT(o.order_id) as total_attributed_orders,
        AVG(o.total_amount) as avg_order_value_from_campaign

    FROM marketing_campaigns mc
    LEFT JOIN customers c ON c.acquisition_campaign_id = mc.campaign_id
    LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.order_status = 'completed'
    WHERE mc.start_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY mc.campaign_id, mc.campaign_name, mc.campaign_type,
             mc.start_date, mc.end_date, mc.budget_allocated, mc.actual_spent
),
roi_analysis AS (
    SELECT
        *,
        CASE WHEN actual_spent > 0 THEN revenue_during_campaign / actual_spent ELSE 0 END as immediate_roi,
        CASE WHEN actual_spent > 0 THEN revenue_30_days_post / actual_spent ELSE 0 END as extended_roi,
        CASE WHEN actual_spent > 0 THEN total_attributed_revenue / actual_spent ELSE 0 END as lifetime_roi,
        CASE WHEN customers_acquired > 0 THEN actual_spent / customers_acquired ELSE 0 END as cost_per_acquisition,
        CASE WHEN orders_during_campaign > 0 THEN actual_spent / orders_during_campaign ELSE 0 END as cost_per_order,

        -- Performance rating
        CASE
            WHEN actual_spent > 0 AND total_attributed_revenue / actual_spent >= 3 THEN 'Excellent'
            WHEN actual_spent > 0 AND total_attributed_revenue / actual_spent >= 2 THEN 'Good'
            WHEN actual_spent > 0 AND total_attributed_revenue / actual_spent >= 1.5 THEN 'Fair'
            WHEN actual_spent > 0 AND total_attributed_revenue / actual_spent >= 1 THEN 'Break_Even'
            ELSE 'Poor'
        END as performance_rating
    FROM campaign_performance
)
SELECT
    campaign_name,
    campaign_type,
    TO_CHAR(start_date, 'YYYY-MM-DD') as start_date,
    TO_CHAR(end_date, 'YYYY-MM-DD') as end_date,
    ROUND(budget_allocated, 2) as budget_allocated,
    ROUND(actual_spent, 2) as actual_spent,
    customers_acquired,
    new_customers_during_campaign,
    orders_during_campaign,
    ROUND(revenue_during_campaign, 2) as immediate_revenue,
    ROUND(total_attributed_revenue, 2) as lifetime_revenue,
    ROUND(immediate_roi, 2) as immediate_roi,
    ROUND(lifetime_roi, 2) as lifetime_roi,
    ROUND(cost_per_acquisition, 2) as cost_per_acquisition,
    ROUND(cost_per_order, 2) as cost_per_order,
    performance_rating
FROM roi_analysis
ORDER BY lifetime_roi DESC, actual_spent DESC;

-- ========================================
-- MARK F: Executive Dashboard Summary
-- ========================================
-- Set mark 'f' here with: mf

-- High-level KPIs for executive reporting
-- Jump to summary view quickly with 'f

SELECT 'KEY PERFORMANCE INDICATORS - EXECUTIVE SUMMARY' as report_title;

-- Revenue Summary
SELECT
    'Revenue Metrics' as category,
    'Last 30 Days' as period,
    ROUND(SUM(total_amount), 2) as total_revenue,
    COUNT(DISTINCT order_id) as total_orders,
    ROUND(AVG(total_amount), 2) as avg_order_value,
    COUNT(DISTINCT customer_id) as unique_customers
FROM orders
WHERE order_status = 'completed'
    AND order_date >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

-- Customer Growth
SELECT
    'Customer Growth' as category,
    'Last 30 Days' as period,
    COUNT(*)::DECIMAL as new_registrations,
    NULL as total_orders,
    NULL as avg_order_value,
    NULL as unique_customers
FROM customers
WHERE registration_date >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

-- Top Product Categories
SELECT
    'Top Category Revenue' as category,
    cat.category_name as period,
    ROUND(SUM(od.quantity * od.unit_price), 2) as category_revenue,
    SUM(od.quantity) as units_sold,
    COUNT(DISTINCT od.order_id) as orders,
    COUNT(DISTINCT p.product_id) as products_sold
FROM order_details od
JOIN products p ON od.product_id = p.product_id
JOIN categories cat ON p.category_id = cat.category_id
JOIN orders o ON od.order_id = o.order_id
WHERE o.order_status = 'completed'
    AND o.order_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY cat.category_name
ORDER BY SUM(od.quantity * od.unit_price) DESC
LIMIT 5;