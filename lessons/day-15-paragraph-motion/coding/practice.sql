-- PostgreSQL Practice: Paragraph Motion Navigation
-- Day 15: Clear paragraph boundaries for { and } navigation
-- Use { and } to jump between paragraphs (blank line separated sections)

-- SECTION 1: Basic Customer Queries
SELECT customer_id, first_name, last_name, email
FROM customers
WHERE country = 'USA'
ORDER BY last_name;


-- SECTION 2: Product Inventory Analysis
SELECT
    p.product_name,
    p.category_id,
    p.unit_price,
    p.units_in_stock
FROM products p
WHERE p.units_in_stock < 10
    AND p.discontinued = false;


-- SECTION 3: Order Aggregation
SELECT
    EXTRACT(YEAR FROM order_date) as order_year,
    EXTRACT(MONTH FROM order_date) as order_month,
    COUNT(*) as total_orders,
    SUM(total_amount) as monthly_revenue
FROM orders
WHERE order_date >= '2023-01-01'
GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(MONTH FROM order_date)
ORDER BY order_year, order_month;


-- SECTION 4: Employee Performance
SELECT
    e.employee_id,
    e.first_name || ' ' || e.last_name as full_name,
    COUNT(o.order_id) as orders_handled,
    AVG(o.total_amount) as avg_order_value
FROM employees e
LEFT JOIN orders o ON e.employee_id = o.employee_id
WHERE e.hire_date >= '2022-01-01'
GROUP BY e.employee_id, e.first_name, e.last_name
HAVING COUNT(o.order_id) > 0;


-- SECTION 5: Shipping Analysis
SELECT
    s.company_name as shipper,
    COUNT(o.order_id) as shipments,
    AVG(o.freight) as avg_freight_cost,
    MAX(o.freight) as max_freight_cost
FROM shippers s
INNER JOIN orders o ON s.shipper_id = o.ship_via
WHERE o.shipped_date IS NOT NULL
GROUP BY s.shipper_id, s.company_name
ORDER BY shipments DESC;


-- SECTION 6: Category Performance
SELECT
    c.category_name,
    COUNT(p.product_id) as product_count,
    AVG(p.unit_price) as avg_price,
    SUM(p.units_in_stock) as total_inventory
FROM categories c
LEFT JOIN products p ON c.category_id = p.category_id
GROUP BY c.category_id, c.category_name
ORDER BY total_inventory DESC;


-- SECTION 7: Customer Geography
SELECT
    country,
    region,
    COUNT(*) as customer_count,
    COUNT(CASE WHEN city LIKE '%New%' THEN 1 END) as cities_with_new
FROM customers
WHERE country IN ('USA', 'Canada', 'Mexico')
GROUP BY country, region
ORDER BY country, customer_count DESC;


-- SECTION 8: Top Customers by Revenue
SELECT
    c.customer_id,
    c.company_name,
    c.contact_name,
    SUM(od.unit_price * od.quantity * (1 - od.discount)) as total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_details od ON o.order_id = od.order_id
GROUP BY c.customer_id, c.company_name, c.contact_name
HAVING SUM(od.unit_price * od.quantity * (1 - od.discount)) > 10000
ORDER BY total_spent DESC
LIMIT 20;


-- SECTION 9: Product Popularity
SELECT
    p.product_name,
    p.category_id,
    SUM(od.quantity) as total_sold,
    COUNT(DISTINCT od.order_id) as orders_containing_product,
    AVG(od.unit_price) as avg_selling_price
FROM products p
INNER JOIN order_details od ON p.product_id = od.product_id
INNER JOIN orders o ON od.order_id = o.order_id
WHERE o.order_date >= '2023-01-01'
GROUP BY p.product_id, p.product_name, p.category_id
ORDER BY total_sold DESC;


-- SECTION 10: Quarterly Sales Trends
SELECT
    'Q' || EXTRACT(QUARTER FROM order_date) || ' ' || EXTRACT(YEAR FROM order_date) as quarter,
    COUNT(DISTINCT order_id) as orders,
    COUNT(DISTINCT customer_id) as unique_customers,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_order_value
FROM orders
WHERE order_date >= '2022-01-01'
GROUP BY EXTRACT(YEAR FROM order_date), EXTRACT(QUARTER FROM order_date)
ORDER BY EXTRACT(YEAR FROM order_date), EXTRACT(QUARTER FROM order_date);


-- SECTION 11: Regional Manager Reports
SELECT
    e.reports_to,
    COUNT(e.employee_id) as direct_reports,
    AVG(EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM e.birth_date)) as avg_age,
    STRING_AGG(e.first_name || ' ' || e.last_name, ', ') as team_members
FROM employees e
WHERE e.reports_to IS NOT NULL
GROUP BY e.reports_to
ORDER BY direct_reports DESC;


-- SECTION 12: Supplier Analysis
SELECT
    s.company_name,
    s.country,
    COUNT(p.product_id) as products_supplied,
    AVG(p.unit_price) as avg_product_price,
    MAX(p.unit_price) as most_expensive_product
FROM suppliers s
LEFT JOIN products p ON s.supplier_id = p.supplier_id
WHERE s.country != 'USA'
GROUP BY s.supplier_id, s.company_name, s.country
HAVING COUNT(p.product_id) > 0
ORDER BY products_supplied DESC;


-- SECTION 13: Order Processing Time Analysis
SELECT
    EXTRACT(DOW FROM order_date) as day_of_week,
    CASE EXTRACT(DOW FROM order_date)
        WHEN 0 THEN 'Sunday'
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
    END as day_name,
    COUNT(*) as orders_placed,
    AVG(shipped_date - order_date) as avg_processing_days
FROM orders
WHERE shipped_date IS NOT NULL
    AND order_date >= '2023-01-01'
GROUP BY EXTRACT(DOW FROM order_date)
ORDER BY EXTRACT(DOW FROM order_date);


-- SECTION 14: Final Summary Query
SELECT
    'Total Customers' as metric,
    COUNT(*)::text as value
FROM customers
UNION ALL
SELECT
    'Total Products' as metric,
    COUNT(*)::text as value
FROM products
UNION ALL
SELECT
    'Total Orders' as metric,
    COUNT(*)::text as value
FROM orders
UNION ALL
SELECT
    'Average Order Value' as metric,
    ROUND(AVG(total_amount), 2)::text as value
FROM orders
ORDER BY metric;