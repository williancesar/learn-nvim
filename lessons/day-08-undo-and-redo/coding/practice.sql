-- Day 08: SQL with Syntax Errors - Practice Undo/Redo Operations
-- This file contains intentional SQL syntax errors for practicing undo (u) and redo (Ctrl-r)
-- Goal: Fix the errors, then practice undoing and redoing your changes
-- PostgreSQL Dialect

-- Error 1: Missing comma in SELECT clause
SELECT customer_id, first_name last_name, email, registration_date
FROM customers
WHERE registration_date >= '2023-01-01';

-- Error 2: Missing closing parenthesis in CTE
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) as month,
        SUM(total_amount) as monthly_revenue,
        COUNT(*) as order_count
    FROM orders
    WHERE order_date >= '2023-01-01'
    GROUP BY DATE_TRUNC('month', order_date
)
SELECT
    month,
    monthly_revenue,
    LAG(monthly_revenue) OVER (ORDER BY month) as prev_month_revenue,
    ROUND(
        (monthly_revenue - LAG(monthly_revenue) OVER (ORDER BY month)) /
        LAG(monthly_revenue) OVER (ORDER BY month) * 100, 2
    ) as growth_percentage
FROM monthly_sales
ORDER BY month;

-- Error 3: Wrong table alias and missing JOIN keyword
SELECT
    p.product_name,
    p.category,
    c.category_name,
    p.price,
    RANK() OVER (PARTITION BY p.category ORDER BY p.price DESC) as price_rank
FROM products p
    categories c ON p.category = c.category_id
WHERE p.active = true
ORDER BY p.category, price_rank;

-- Error 4: Missing GROUP BY clause with aggregate function
SELECT
    customer_id,
    COUNT(*) as order_count,
    SUM(total_amount) as total_spent,
    AVG(total_amount) as avg_order_value,
    MAX(order_date) as last_order_date
FROM orders
WHERE order_date >= '2023-01-01'
ORDER BY total_spent DESC;

-- Error 5: Incorrect window function syntax - missing OVER clause
SELECT
    employee_id,
    first_name,
    last_name,
    department,
    salary,
    ROW_NUMBER() as row_num,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank
FROM employees
WHERE active = true;

-- Error 6: Missing quotes around string literal
SELECT
    product_id,
    product_name,
    CASE
        WHEN category = electronics THEN 'Tech Product'
        WHEN category = 'clothing' THEN 'Fashion Item'
        WHEN category = 'books' THEN 'Educational'
        ELSE 'Other'
    END as product_type
FROM products;

-- Error 7: Unclosed string literal
SELECT
    customer_id,
    first_name || ' || last_name as full_name,
    email,
    phone
FROM customers
WHERE city = 'New York';

-- Error 8: Wrong aggregate function name
SELECT
    department,
    AVERAGE(salary) as avg_salary,
    MIN(salary) as min_salary,
    MAX(salary) as max_salary,
    COUNT(*) as employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;

-- Error 9: Missing ON clause in JOIN
SELECT
    o.order_id,
    o.order_date,
    c.first_name,
    c.last_name,
    o.total_amount
FROM orders o
JOIN customers c
WHERE o.order_date >= '2023-01-01'
ORDER BY o.order_date DESC;

-- Error 10: Invalid column reference in ORDER BY
WITH customer_analytics AS (
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        COUNT(o.order_id) as order_count,
        SUM(o.total_amount) as lifetime_value,
        AVG(o.total_amount) as avg_order_value
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.first_name, c.last_name
)
SELECT
    customer_id,
    first_name || ' ' || last_name as full_name,
    order_count,
    lifetime_value,
    CASE
        WHEN lifetime_value > 1000 THEN 'VIP'
        WHEN lifetime_value > 500 THEN 'Premium'
        ELSE 'Standard'
    END as customer_tier
FROM customer_analytics
ORDER BY total_spent DESC;  -- Error: total_spent doesn't exist, should be lifetime_value

-- Error 11: Missing semicolon and wrong syntax in UNION
SELECT product_id, product_name, 'current' as status
FROM products
WHERE active = true
UNION ALL
SELECT product_id, product_name, 'discontinued' as status
FROM archived_products  -- Missing semicolon at end

-- Error 12: Incorrect recursive CTE syntax
WITH RECURSIVE employee_hierarchy AS (
    -- Base case: top-level managers
    SELECT
        employee_id,
        first_name,
        last_name,
        manager_id,
        1 as level,
        first_name || ' ' || last_name as path
    FROM employees
    WHERE manager_id IS NULL

    UNION

    -- Recursive case: employees with managers
    SELECT
        e.employee_id,
        e.first_name,
        e.last_name,
        e.manager_id,
        eh.level + 1,
        eh.path || ' -> ' || e.first_name || ' ' || e.last_name
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_id = eh.employee_id  -- Missing ALL keyword
)
SELECT
    employee_id,
    first_name,
    last_name,
    level,
    path as reporting_chain
FROM employee_hierarchy
ORDER BY level, last_name;

-- Error 13: Missing PARTITION BY in window function
SELECT
    order_id,
    customer_id,
    order_date,
    total_amount,
    SUM(total_amount) OVER (ORDER BY order_date
                           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total,
    ROW_NUMBER() OVER (ORDER BY total_amount DESC) as order_rank_by_amount
FROM orders
WHERE order_date >= '2023-01-01';

-- Error 14: Missing closing bracket in array
SELECT
    employee_id,
    first_name,
    last_name,
    skills,
    array_length(skills, 1) as skill_count
FROM employees
WHERE skills && ARRAY['SQL', 'Python', 'JavaScript'  -- Missing closing bracket
ORDER BY skill_count DESC;

-- Error 15: Incorrect date function
SELECT
    order_id,
    order_date,
    EXTRACT(QUARTER FROM order_date) as quarter,
    DATE_PARTS('year', order_date) as year,  -- Should be EXTRACT or DATE_PART
    total_amount
FROM orders
WHERE order_date >= '2023-01-01'
ORDER BY order_date;