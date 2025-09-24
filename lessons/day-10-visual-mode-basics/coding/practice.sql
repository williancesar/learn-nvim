-- Day 10: SQL for Visual Mode Selection Practice
-- This file contains SQL structured for practicing visual mode (v, V, Ctrl-v)
-- Goal: Practice selecting complete expressions, blocks, columns, and logical units
-- PostgreSQL Dialect with clearly delineated blocks for selection practice

-- Practice selecting complete SELECT clauses and expressions
SELECT
    customer_id,
    first_name,
    last_name,
    email,
    phone,
    registration_date,
    EXTRACT(YEAR FROM registration_date) as reg_year,
    CASE
        WHEN registration_date >= '2023-01-01' THEN 'New Customer'
        WHEN registration_date >= '2022-01-01' THEN 'Recent Customer'
        WHEN registration_date >= '2021-01-01' THEN 'Established Customer'
        ELSE 'Legacy Customer'
    END as customer_type,
    CASE
        WHEN annual_revenue > 1000000 THEN 'Enterprise'
        WHEN annual_revenue > 500000 THEN 'Large Business'
        WHEN annual_revenue > 100000 THEN 'Medium Business'
        WHEN annual_revenue > 50000 THEN 'Small Business'
        ELSE 'Micro Business'
    END as business_size,
    COALESCE(industry, 'Unknown') as industry_category
FROM customers
WHERE active = true
    AND registration_date >= '2020-01-01'
    AND email IS NOT NULL
ORDER BY registration_date DESC, last_name, first_name;

-- Practice selecting window function expressions and OVER clauses
WITH monthly_sales AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', order_date) as month,
        SUM(total_amount) as monthly_total,
        COUNT(*) as monthly_orders,
        AVG(total_amount) as monthly_avg
    FROM orders
    WHERE order_date >= '2023-01-01'
    GROUP BY customer_id, DATE_TRUNC('month', order_date)
)
SELECT
    customer_id,
    month,
    monthly_total,
    monthly_orders,
    ROUND(monthly_avg, 2) as avg_order_value,
    SUM(monthly_total) OVER (
        PARTITION BY customer_id
        ORDER BY month
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as running_total,
    LAG(monthly_total, 1) OVER (
        PARTITION BY customer_id
        ORDER BY month
    ) as prev_month_total,
    LEAD(monthly_total, 1) OVER (
        PARTITION BY customer_id
        ORDER BY month
    ) as next_month_total,
    monthly_total - LAG(monthly_total, 1, 0) OVER (
        PARTITION BY customer_id
        ORDER BY month
    ) as month_over_month_change,
    RANK() OVER (
        PARTITION BY month
        ORDER BY monthly_total DESC
    ) as monthly_rank,
    PERCENT_RANK() OVER (
        PARTITION BY month
        ORDER BY monthly_total
    ) as monthly_percentile
FROM monthly_sales
ORDER BY customer_id, month;

-- Practice selecting complex CASE expressions and conditions
SELECT
    product_id,
    product_name,
    category,
    price,
    cost,
    inventory_count,
    CASE
        WHEN inventory_count = 0 THEN 'Out of Stock'
        WHEN inventory_count <= 10 THEN 'Low Stock'
        WHEN inventory_count <= 50 THEN 'Medium Stock'
        WHEN inventory_count <= 100 THEN 'Good Stock'
        ELSE 'Abundant Stock'
    END as stock_status,
    CASE
        WHEN price - cost <= 0 THEN 'No Profit'
        WHEN (price - cost) / cost <= 0.2 THEN 'Low Margin'
        WHEN (price - cost) / cost <= 0.5 THEN 'Medium Margin'
        WHEN (price - cost) / cost <= 1.0 THEN 'High Margin'
        ELSE 'Premium Margin'
    END as profit_margin_category,
    ROUND(((price - cost) / cost * 100), 2) as margin_percentage,
    CASE
        WHEN category = 'electronics' AND price > 500 THEN 'High-End Electronics'
        WHEN category = 'electronics' AND price <= 100 THEN 'Budget Electronics'
        WHEN category = 'clothing' AND price > 200 THEN 'Designer Clothing'
        WHEN category = 'clothing' AND price <= 50 THEN 'Budget Clothing'
        WHEN category = 'books' THEN 'Educational Material'
        WHEN category = 'home' AND price > 300 THEN 'Premium Home Goods'
        ELSE 'Standard Product'
    END as product_classification
FROM products
WHERE active = true
    AND created_date >= '2022-01-01'
ORDER BY category, price DESC;

-- Practice selecting JOIN clauses and table expressions
SELECT
    o.order_id,
    o.order_date,
    o.total_amount,
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email,
    p.product_id,
    p.product_name,
    p.category,
    oi.quantity,
    oi.unit_price,
    oi.quantity * oi.unit_price as line_total,
    s.first_name as sales_rep_first,
    s.last_name as sales_rep_last,
    s.commission_rate
FROM orders o
INNER JOIN customers c
    ON o.customer_id = c.customer_id
INNER JOIN order_items oi
    ON o.order_id = oi.order_id
INNER JOIN products p
    ON oi.product_id = p.product_id
LEFT JOIN sales_reps s
    ON o.sales_rep_id = s.sales_rep_id
WHERE o.order_date >= '2023-01-01'
    AND o.status IN ('completed', 'shipped', 'delivered')
    AND oi.quantity > 0
    AND oi.unit_price > 0
ORDER BY o.order_date DESC, o.order_id, oi.line_number;

-- Practice selecting array and JSON operations
SELECT
    employee_id,
    first_name,
    last_name,
    department,
    skills,
    certifications,
    performance_reviews,
    array_length(skills, 1) as skill_count,
    array_length(certifications, 1) as cert_count,
    skills[1] as primary_skill,
    skills[array_length(skills, 1)] as latest_skill,
    ARRAY_TO_STRING(skills, ', ') as skills_list,
    ARRAY_TO_STRING(certifications, '; ') as certs_list,
    skills && ARRAY['SQL', 'Python', 'Java'] as has_programming_skills,
    CASE
        WHEN 'PMP' = ANY(certifications) THEN 'Project Manager'
        WHEN 'AWS' = ANY(certifications) THEN 'Cloud Specialist'
        WHEN 'Scrum Master' = ANY(certifications) THEN 'Agile Practitioner'
        ELSE 'General Professional'
    END as certification_category,
    performance_reviews->>'overall_rating' as latest_rating,
    (performance_reviews->'goals_met')::boolean as goals_achieved,
    performance_reviews->'metrics'->>'productivity_score' as productivity,
    jsonb_array_length(performance_reviews->'achievements') as achievement_count
FROM employees
WHERE skills IS NOT NULL
    AND array_length(skills, 1) > 0
    AND active = true
ORDER BY array_length(skills, 1) DESC, last_name;

-- Practice selecting aggregate functions and GROUP BY clauses
SELECT
    category,
    COUNT(*) as product_count,
    COUNT(DISTINCT supplier_id) as supplier_count,
    MIN(price) as min_price,
    MAX(price) as max_price,
    AVG(price) as avg_price,
    MEDIAN(price) as median_price,
    STDDEV(price) as price_stddev,
    SUM(inventory_count) as total_inventory,
    SUM(inventory_count * cost) as total_inventory_value,
    SUM(inventory_count * price) as total_retail_value,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY price) as q1_price,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY price) as q3_price,
    ARRAY_AGG(DISTINCT supplier_id ORDER BY supplier_id) as supplier_ids,
    STRING_AGG(product_name, '; ' ORDER BY price DESC) as top_products
FROM products
WHERE active = true
    AND created_date >= '2022-01-01'
    AND price > 0
    AND inventory_count >= 0
GROUP BY category
HAVING COUNT(*) >= 10
    AND AVG(price) > 50
ORDER BY total_retail_value DESC, product_count DESC;

-- Practice selecting complex subqueries and CTEs
WITH customer_lifetime_value AS (
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        c.registration_date,
        COUNT(o.order_id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as lifetime_value,
        COALESCE(AVG(o.total_amount), 0) as avg_order_value,
        COALESCE(MAX(o.order_date), c.registration_date) as last_order_date,
        COALESCE(MIN(o.order_date), c.registration_date) as first_order_date
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    WHERE c.active = true
    GROUP BY c.customer_id, c.first_name, c.last_name, c.registration_date
),
customer_segments AS (
    SELECT
        customer_id,
        first_name,
        last_name,
        total_orders,
        lifetime_value,
        avg_order_value,
        CASE
            WHEN total_orders = 0 THEN 'Never Purchased'
            WHEN total_orders = 1 THEN 'One-Time Buyer'
            WHEN total_orders <= 5 THEN 'Occasional Buyer'
            WHEN total_orders <= 15 THEN 'Regular Customer'
            ELSE 'VIP Customer'
        END as purchase_segment,
        CASE
            WHEN lifetime_value = 0 THEN 'No Value'
            WHEN lifetime_value <= 100 THEN 'Low Value'
            WHEN lifetime_value <= 500 THEN 'Medium Value'
            WHEN lifetime_value <= 2000 THEN 'High Value'
            ELSE 'Premium Value'
        END as value_segment,
        EXTRACT(DAYS FROM (CURRENT_DATE - last_order_date)) as days_since_last_order
    FROM customer_lifetime_value
)
SELECT
    cs.purchase_segment,
    cs.value_segment,
    COUNT(*) as customer_count,
    ROUND(AVG(cs.lifetime_value), 2) as avg_lifetime_value,
    ROUND(AVG(cs.avg_order_value), 2) as avg_order_value,
    ROUND(AVG(cs.total_orders), 1) as avg_total_orders,
    ROUND(AVG(cs.days_since_last_order), 1) as avg_days_since_last_order,
    MIN(cs.lifetime_value) as min_lifetime_value,
    MAX(cs.lifetime_value) as max_lifetime_value
FROM customer_segments cs
GROUP BY cs.purchase_segment, cs.value_segment
ORDER BY
    CASE cs.purchase_segment
        WHEN 'VIP Customer' THEN 1
        WHEN 'Regular Customer' THEN 2
        WHEN 'Occasional Buyer' THEN 3
        WHEN 'One-Time Buyer' THEN 4
        ELSE 5
    END,
    CASE cs.value_segment
        WHEN 'Premium Value' THEN 1
        WHEN 'High Value' THEN 2
        WHEN 'Medium Value' THEN 3
        WHEN 'Low Value' THEN 4
        ELSE 5
    END;