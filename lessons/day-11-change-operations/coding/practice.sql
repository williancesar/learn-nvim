-- Day 11: Legacy SQL to Modernize - Practice Change Operations (c, cc, C, s, S, r, R)
-- This file contains old-style SQL that needs modernization using change commands
-- Goal: Practice replacing old syntax with modern SQL features like CTEs, window functions, etc.
-- PostgreSQL Dialect - Transform legacy patterns to modern equivalents

-- Legacy Pattern 1: Old-style comma joins → Modern explicit JOINs
-- Practice: Use 'ci(' to change inside parentheses, 'ct,' to change to comma
SELECT c.customer_id, c.first_name, c.last_name, o.order_id, o.total_amount, p.product_name
FROM customers c, orders o, order_items oi, products p
WHERE c.customer_id = o.customer_id
  AND o.order_id = oi.order_id
  AND oi.product_id = p.product_id
  AND o.order_date >= '2023-01-01'
  AND c.active = 'Y'
  AND p.discontinued = 'N';

-- Legacy Pattern 2: Correlated subqueries → Window functions
-- Practice: Use 'ciW' to change word, 'C' to change to end of line
SELECT
    customer_id,
    first_name,
    last_name,
    (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) as order_count,
    (SELECT MAX(total_amount) FROM orders o WHERE o.customer_id = c.customer_id) as max_order,
    (SELECT AVG(total_amount) FROM orders o WHERE o.customer_id = c.customer_id) as avg_order,
    (SELECT SUM(total_amount) FROM orders o WHERE o.customer_id = c.customer_id) as total_spent
FROM customers c
WHERE c.active = 'Y'
ORDER BY (SELECT SUM(total_amount) FROM orders o WHERE o.customer_id = c.customer_id) DESC;

-- Legacy Pattern 3: Nested subqueries → CTEs
-- Practice: Use 'cc' to change entire line, 's' to substitute character
SELECT customer_id, first_name, last_name, total_orders, rank_in_segment
FROM (
    SELECT customer_id, first_name, last_name, total_orders,
           RANK() OVER (PARTITION BY segment ORDER BY total_orders DESC) as rank_in_segment
    FROM (
        SELECT c.customer_id, c.first_name, c.last_name,
               COUNT(o.order_id) as total_orders,
               CASE
                   WHEN c.annual_revenue > 1000000 THEN 'Enterprise'
                   WHEN c.annual_revenue > 100000 THEN 'SMB'
                   ELSE 'Small'
               END as segment
        FROM customers c
        LEFT JOIN orders o ON c.customer_id = o.customer_id
        WHERE c.active = 'Y'
        GROUP BY c.customer_id, c.first_name, c.last_name, c.annual_revenue
    ) customer_summary
) ranked_customers
WHERE rank_in_segment <= 10;

-- Legacy Pattern 4: Old date functions → Modern EXTRACT and DATE_TRUNC
-- Practice: Use 'ciw' to change inner word, 'r' to replace character
SELECT
    order_id,
    order_date,
    YEAR(order_date) as order_year,
    MONTH(order_date) as order_month,
    DAYOFWEEK(order_date) as day_of_week,
    QUARTER(order_date) as order_quarter,
    DATE_FORMAT(order_date, '%Y-%m') as year_month,
    DATEDIFF(CURDATE(), order_date) as days_ago
FROM orders
WHERE YEAR(order_date) = 2023
  AND MONTH(order_date) IN (1, 2, 3);

-- Legacy Pattern 5: String concatenation with + or || → CONCAT function
-- Practice: Use 'ct)' to change to closing parenthesis
SELECT
    customer_id,
    first_name + ' ' + last_name as full_name,
    'Customer: ' + first_name + ' ' + last_name + ' (' + email + ')' as customer_info,
    UPPER(LEFT(first_name, 1)) + LOWER(SUBSTRING(first_name, 2, 100)) as proper_case_first,
    phone_area + '-' + phone_number as full_phone
FROM customers
WHERE first_name + ' ' + last_name IS NOT NULL;

-- Legacy Pattern 6: Old CASE structure → Modern CASE with cleaner syntax
-- Practice: Use 'S' to substitute entire line, 'cw' to change word
SELECT
    product_id,
    product_name,
    price,
    CASE
        WHEN price < 10 THEN 'Budget'
        WHEN price >= 10 AND price < 50 THEN 'Standard'
        WHEN price >= 50 AND price < 200 THEN 'Premium'
        WHEN price >= 200 THEN 'Luxury'
        ELSE 'Unknown'
    END as price_category,
    CASE
        WHEN inventory_count = 0 THEN 'Out of Stock'
        WHEN inventory_count > 0 AND inventory_count <= 10 THEN 'Low Stock'
        WHEN inventory_count > 10 AND inventory_count <= 100 THEN 'In Stock'
        WHEN inventory_count > 100 THEN 'Well Stocked'
        ELSE 'Status Unknown'
    END as stock_status
FROM products;

-- Legacy Pattern 7: Old aggregate patterns → Modern window functions with OVER
-- Practice: Use 'R' to replace from cursor to end of line
SELECT
    department,
    employee_id,
    first_name,
    last_name,
    salary,
    (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e1.department) as dept_avg_salary,
    (SELECT COUNT(*) FROM employees e2 WHERE e2.department = e1.department) as dept_employee_count,
    (SELECT MAX(salary) FROM employees e2 WHERE e2.department = e1.department) as dept_max_salary,
    salary - (SELECT AVG(salary) FROM employees e2 WHERE e2.department = e1.department) as salary_vs_avg
FROM employees e1
WHERE active = 1
ORDER BY department, salary DESC;

-- Legacy Pattern 8: Old ranking logic → Modern RANK, DENSE_RANK, ROW_NUMBER
-- Practice: Use 'ci"' to change inside quotes, 'ca(' to change around parentheses
SELECT
    customer_id,
    total_spent,
    (SELECT COUNT(*) + 1 FROM (
        SELECT customer_id, SUM(total_amount) as total_spent
        FROM orders
        GROUP BY customer_id
    ) t WHERE t.total_spent > main.total_spent) as spending_rank
FROM (
    SELECT customer_id, SUM(total_amount) as total_spent
    FROM orders
    GROUP BY customer_id
) main
ORDER BY total_spent DESC;

-- Legacy Pattern 9: Old-style UNION without proper deduplication handling
-- Practice: Use 'cE' to change to end of word, substitute multiple words
SELECT customer_id, 'Active' as status FROM customers WHERE active = 'Y'
UNION
SELECT customer_id, 'Inactive' as status FROM customers WHERE active = 'N'
UNION
SELECT customer_id, 'Pending' as status FROM customers WHERE active = 'P'
ORDER BY customer_id;

-- Legacy Pattern 10: Old NULL handling → Modern COALESCE and NULLIF
-- Practice: Use 'ct,' to change until comma, 'cf)' to change find parenthesis
SELECT
    customer_id,
    CASE WHEN first_name IS NULL THEN 'Unknown' ELSE first_name END as first_name_clean,
    CASE WHEN last_name IS NULL THEN 'Unknown' ELSE last_name END as last_name_clean,
    CASE WHEN email IS NULL OR email = '' THEN 'No Email' ELSE email END as email_clean,
    CASE WHEN phone IS NULL OR phone = '' THEN 'No Phone' ELSE phone END as phone_clean,
    CASE WHEN annual_revenue IS NULL THEN 0 ELSE annual_revenue END as revenue_clean
FROM customers;

-- Legacy Pattern 11: Inefficient EXISTS patterns → Modern IN or window functions
-- Practice: Change multiple patterns using combination of commands
SELECT c.customer_id, c.first_name, c.last_name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.customer_id
    AND o.order_date >= '2023-01-01'
    AND EXISTS (
        SELECT 1 FROM order_items oi
        WHERE oi.order_id = o.order_id
        AND EXISTS (
            SELECT 1 FROM products p
            WHERE p.product_id = oi.product_id
            AND p.category = 'electronics'
        )
    )
);

-- Legacy Pattern 12: Old GROUP BY with HAVING → Modern filtered aggregates
-- Practice: Practice changing complex expressions with nested commands
SELECT
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price
FROM products
WHERE active = 'Y'
GROUP BY category
HAVING COUNT(*) > 10
   AND AVG(price) > (SELECT AVG(price) FROM products WHERE active = 'Y')
ORDER BY AVG(price) DESC;

-- Legacy Pattern 13: Old-style pagination → Modern LIMIT/OFFSET
-- Practice: Change old TOP syntax to modern equivalents
SELECT TOP 50
    customer_id,
    first_name,
    last_name,
    total_orders
FROM (
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        COUNT(o.order_id) as total_orders
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.first_name, c.last_name
) customer_orders
ORDER BY total_orders DESC;

-- Legacy Pattern 14: Old datetime comparisons → Modern date ranges
-- Practice: Change old BETWEEN patterns and date functions
SELECT order_id, customer_id, order_date, total_amount
FROM orders
WHERE YEAR(order_date) = 2023
  AND MONTH(order_date) BETWEEN 1 AND 3
  AND DAY(order_date) <= 15
  AND HOUR(order_date) BETWEEN 9 AND 17;

-- Legacy Pattern 15: Old string manipulation → Modern string functions
-- Practice: Transform multiple string operations to modern equivalents
SELECT
    customer_id,
    LTRIM(RTRIM(first_name)) as clean_first_name,
    LTRIM(RTRIM(last_name)) as clean_last_name,
    UPPER(SUBSTRING(first_name, 1, 1)) + LOWER(SUBSTRING(first_name, 2, LEN(first_name))) as proper_first,
    CHARINDEX('@', email) as at_position,
    SUBSTRING(email, CHARINDEX('@', email) + 1, LEN(email)) as email_domain,
    REPLACE(REPLACE(REPLACE(phone, '(', ''), ')', ''), '-', '') as clean_phone
FROM customers
WHERE LEN(LTRIM(RTRIM(first_name))) > 0;