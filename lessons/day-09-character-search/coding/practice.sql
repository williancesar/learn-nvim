-- Day 09: SQL with Punctuation Targets - Practice f/F/t/T Character Search
-- This file contains SQL with various punctuation marks for practicing character search
-- Goal: Use f, F, t, T to quickly navigate to specific characters like (, ), [, ], {, }, ', ", ;, :, =
-- PostgreSQL Dialect with rich punctuation for navigation practice

-- Practice navigating to parentheses, quotes, and brackets
WITH customer_segments AS (
    SELECT
        customer_id,
        first_name,
        last_name,
        CASE
            WHEN annual_revenue > 100000 THEN 'Enterprise'
            WHEN annual_revenue > 50000 THEN 'Mid-Market'
            WHEN annual_revenue > 10000 THEN 'SMB'
            ELSE 'Startup'
        END as segment,
        COALESCE(industry, 'Unknown') as industry_clean,
        EXTRACT(YEAR FROM registration_date) as registration_year,
        (current_date - registration_date) / 365.25 as years_active
    FROM customers
    WHERE registration_date >= '2020-01-01'::date
),
revenue_analytics AS (
    SELECT
        cs.segment,
        cs.industry_clean,
        COUNT(*) as customer_count,
        SUM(COALESCE(o.total_amount, 0)) as total_revenue,
        AVG(COALESCE(o.total_amount, 0)) as avg_order_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY o.total_amount) as median_order,
        ARRAY_AGG(DISTINCT cs.customer_id ORDER BY cs.customer_id) as customer_ids
    FROM customer_segments cs
    LEFT JOIN orders o ON cs.customer_id = o.customer_id
    WHERE o.order_date >= '2023-01-01'::timestamp
    GROUP BY cs.segment, cs.industry_clean
    HAVING COUNT(DISTINCT cs.customer_id) >= 10
)
SELECT
    segment,
    industry_clean,
    customer_count,
    ROUND(total_revenue::numeric, 2) as revenue,
    ROUND(avg_order_value::numeric, 2) as aov,
    ROUND(median_order::numeric, 2) as median,
    array_length(customer_ids, 1) as id_count,
    CASE
        WHEN total_revenue > 500000 THEN '🟢 High'
        WHEN total_revenue > 100000 THEN '🟡 Medium'
        ELSE '🔴 Low'
    END as revenue_status
FROM revenue_analytics
ORDER BY total_revenue DESC;

-- Advanced window functions with complex punctuation
SELECT
    product_id,
    product_name,
    category,
    price,
    RANK() OVER (PARTITION BY category ORDER BY price DESC) as price_rank,
    DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) as dense_rank,
    PERCENT_RANK() OVER (PARTITION BY category ORDER BY price DESC) as price_percentile,
    LAG(price, 1, 0) OVER (PARTITION BY category ORDER BY price DESC) as prev_price,
    LEAD(price, 1, 0) OVER (PARTITION BY category ORDER BY price DESC) as next_price,
    price - LAG(price, 1, price) OVER (PARTITION BY category ORDER BY price DESC) as price_diff,
    CASE
        WHEN price > AVG(price) OVER (PARTITION BY category) THEN 'Above Average'
        WHEN price = AVG(price) OVER (PARTITION BY category) THEN 'Average'
        ELSE 'Below Average'
    END as price_category,
    ROUND(
        (price - AVG(price) OVER (PARTITION BY category)) /
        STDDEV(price) OVER (PARTITION BY category),
        2
    ) as price_zscore
FROM products
WHERE active = true
    AND created_date >= '2022-01-01'::date
    AND price BETWEEN 10.00 AND 999.99
ORDER BY category, price DESC;

-- JSON operations with brackets and quotes
SELECT
    order_id,
    customer_id,
    order_details->>'product_name' as product,
    (order_details->'quantity')::int as qty,
    (order_details->'unit_price')::decimal(10,2) as unit_price,
    order_details->'metadata'->>'source' as order_source,
    CASE
        WHEN order_details ? 'discount' THEN (order_details->'discount')::decimal(5,2)
        ELSE 0.00
    END as discount_applied,
    order_details @> '{"express_shipping": true}'::jsonb as is_express,
    jsonb_array_elements_text(order_details->'tags') as tag,
    order_details || '{"processed": true}'::jsonb as updated_details
FROM orders_with_json
WHERE order_details IS NOT NULL
    AND order_details ? 'product_name'
    AND (order_details->'quantity')::int > 0;

-- Array operations with brackets and parentheses
SELECT
    employee_id,
    first_name || ' ' || last_name as full_name,
    skills,
    array_length(skills, 1) as skill_count,
    skills[1] as primary_skill,
    skills[array_length(skills, 1)] as last_skill,
    skills && ARRAY['SQL', 'Python', 'JavaScript'] as has_key_skills,
    ARRAY_TO_STRING(skills, ', ') as skills_text,
    CASE
        WHEN 'SQL' = ANY(skills) THEN 'Database Expert'
        WHEN 'Python' = ANY(skills) THEN 'Python Developer'
        WHEN 'JavaScript' = ANY(skills) THEN 'Frontend Developer'
        ELSE 'Other Specialist'
    END as primary_role
FROM employees
WHERE skills IS NOT NULL
    AND array_length(skills, 1) >= 3
ORDER BY array_length(skills, 1) DESC;

-- Complex string operations with quotes and concatenation
SELECT
    customer_id,
    CONCAT(first_name, ' ', COALESCE(middle_initial || '.', ''), ' ', last_name) as full_name,
    UPPER(LEFT(first_name, 1)) || LOWER(SUBSTRING(first_name, 2)) as proper_first,
    REGEXP_REPLACE(phone, '[^0-9]', '', 'g') as clean_phone,
    CASE
        WHEN email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN 'Valid'
        ELSE 'Invalid'
    END as email_status,
    LENGTH(address) as address_length,
    POSITION('@' IN email) as at_position,
    SPLIT_PART(email, '@', 2) as email_domain,
    TRANSLATE(phone, '()-. ', '') as phone_digits_only
FROM customers
WHERE email IS NOT NULL
    AND phone IS NOT NULL
    AND LENGTH(TRIM(first_name)) > 0;

-- Advanced date/time functions with parentheses and quotes
SELECT
    order_id,
    order_date,
    EXTRACT(EPOCH FROM order_date)::bigint as unix_timestamp,
    TO_CHAR(order_date, 'YYYY-MM-DD HH24:MI:SS') as formatted_date,
    DATE_TRUNC('hour', order_date) as hour_bucket,
    order_date + INTERVAL '30 days' as due_date,
    AGE(CURRENT_DATE, order_date::date) as order_age,
    CASE
        WHEN EXTRACT(DOW FROM order_date) IN (0, 6) THEN 'Weekend'
        ELSE 'Weekday'
    END as day_type,
    CASE
        WHEN EXTRACT(HOUR FROM order_date) BETWEEN 9 AND 17 THEN 'Business Hours'
        WHEN EXTRACT(HOUR FROM order_date) BETWEEN 18 AND 22 THEN 'Evening'
        ELSE 'Off Hours'
    END as time_category
FROM orders
WHERE order_date >= '2023-01-01 00:00:00'::timestamp
    AND order_date < CURRENT_DATE + INTERVAL '1 day'
ORDER BY order_date DESC;

-- Recursive CTE with complex punctuation patterns
WITH RECURSIVE category_hierarchy AS (
    -- Base case: root categories (parentless)
    SELECT
        category_id,
        category_name,
        parent_category_id,
        1 as level,
        ARRAY[category_id] as path,
        category_name::text as full_path
    FROM product_categories
    WHERE parent_category_id IS NULL

    UNION ALL

    -- Recursive case: child categories
    SELECT
        pc.category_id,
        pc.category_name,
        pc.parent_category_id,
        ch.level + 1,
        ch.path || pc.category_id,
        ch.full_path || ' > ' || pc.category_name
    FROM product_categories pc
    INNER JOIN category_hierarchy ch ON pc.parent_category_id = ch.category_id
    WHERE ch.level < 5  -- Prevent infinite recursion
),
category_stats AS (
    SELECT
        ch.category_id,
        ch.category_name,
        ch.level,
        ch.full_path,
        COUNT(p.product_id) as product_count,
        COALESCE(SUM(p.price), 0) as total_inventory_value,
        COALESCE(AVG(p.price), 0) as avg_product_price
    FROM category_hierarchy ch
    LEFT JOIN products p ON ch.category_id = p.category_id
    WHERE p.active = true OR p.product_id IS NULL
    GROUP BY ch.category_id, ch.category_name, ch.level, ch.full_path
)
SELECT
    category_id,
    category_name,
    level,
    full_path,
    product_count,
    ROUND(total_inventory_value::numeric, 2) as inventory_value,
    ROUND(avg_product_price::numeric, 2) as avg_price,
    CASE
        WHEN product_count > 100 THEN 'Large Category'
        WHEN product_count > 20 THEN 'Medium Category'
        WHEN product_count > 0 THEN 'Small Category'
        ELSE 'Empty Category'
    END as category_size
FROM category_stats
ORDER BY level, category_name;

-- Complex aggregation with multiple punctuation targets
SELECT
    DATE_TRUNC('month', o.order_date) as month,
    c.segment,
    COUNT(DISTINCT o.customer_id) as unique_customers,
    COUNT(o.order_id) as total_orders,
    SUM(o.total_amount) as revenue,
    AVG(o.total_amount) as avg_order_value,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY o.total_amount) as q1_order_value,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY o.total_amount) as q3_order_value,
    STDDEV(o.total_amount) as order_value_stddev,
    COUNT(o.order_id)::decimal / COUNT(DISTINCT o.customer_id) as orders_per_customer,
    STRING_AGG(DISTINCT p.category, '; ' ORDER BY p.category) as categories_sold
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_date >= '2023-01-01'::date
    AND o.status IN ('completed', 'shipped', 'delivered')
    AND o.total_amount > 0
GROUP BY DATE_TRUNC('month', o.order_date), c.segment
HAVING COUNT(DISTINCT o.customer_id) >= 5
ORDER BY month DESC, revenue DESC;