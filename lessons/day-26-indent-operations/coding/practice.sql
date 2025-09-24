-- PostgreSQL Practice: Poorly Indented SQL to Fix
-- Day 26: Use >>, <<, =, and visual mode indenting to fix this messy code
-- Practice with >>, <<, =ap, >i{, <i{, and visual mode indenting

-- SECTION 1: Completely unindented query - fix with >> and =
SELECT customer_id,
first_name,
last_name,
email,
registration_date,
(SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.customer_id) as order_count,
(SELECT SUM(total_amount) FROM orders o WHERE o.customer_id = c.customer_id AND o.status = 'completed') as lifetime_value
FROM customers c
WHERE registration_date >= '2023-01-01'
AND status = 'active'
ORDER BY lifetime_value DESC;

-- SECTION 2: Inconsistent CTE indentation - use visual mode and >
WITH customer_metrics AS (
SELECT
customer_id,
COUNT(order_id) as total_orders,
AVG(order_total) as avg_order_value,
SUM(order_total) as lifetime_value,
MAX(order_date) as last_order_date
FROM orders
WHERE order_status = 'completed'
GROUP BY customer_id
),
customer_tiers AS (
SELECT
customer_id,
total_orders,
lifetime_value,
CASE
WHEN lifetime_value >= 10000 THEN 'VIP'
WHEN lifetime_value >= 5000 THEN 'Premium'
WHEN lifetime_value >= 1000 THEN 'Gold'
ELSE 'Standard'
END as customer_tier
FROM customer_metrics
)
SELECT
ct.customer_id,
c.first_name || ' ' || c.last_name as full_name,
ct.total_orders,
ct.lifetime_value,
ct.customer_tier
FROM customer_tiers ct
JOIN customers c ON ct.customer_id = c.customer_id
ORDER BY ct.lifetime_value DESC;

-- SECTION 3: Badly indented function - practice with =i{ and >i{
CREATE OR REPLACE FUNCTION calculate_customer_discount(
customer_tier VARCHAR,
order_amount DECIMAL,
is_first_time BOOLEAN
) RETURNS DECIMAL AS $$
DECLARE
base_discount DECIMAL := 0.0;
tier_bonus DECIMAL := 0.0;
first_time_bonus DECIMAL := 0.0;
BEGIN
-- Base discount calculation
IF order_amount > 1000 THEN
base_discount := 0.10;
ELSIF order_amount > 500 THEN
base_discount := 0.05;
ELSIF order_amount > 100 THEN
base_discount := 0.02;
END IF;

-- Tier-based bonus
CASE customer_tier
WHEN 'VIP' THEN
tier_bonus := 0.15;
WHEN 'Premium' THEN
tier_bonus := 0.10;
WHEN 'Gold' THEN
tier_bonus := 0.05;
ELSE
tier_bonus := 0.0;
END CASE;

-- First-time customer bonus
IF is_first_time THEN
first_time_bonus := 0.05;
END IF;

-- Return total discount (capped at 50%)
RETURN LEAST(base_discount + tier_bonus + first_time_bonus, 0.50);
END;
$$ LANGUAGE plpgsql;

-- SECTION 4: Deeply nested query with poor indentation
SELECT
p.product_id,
p.product_name,
p.category_id,
cat.category_name,
(
SELECT COUNT(DISTINCT o.order_id)
FROM order_details od
JOIN orders o ON od.order_id = o.order_id
WHERE od.product_id = p.product_id
AND o.order_status = 'completed'
AND o.order_date >= CURRENT_DATE - INTERVAL '1 year'
) as orders_last_year,
(
SELECT SUM(od.quantity * od.unit_price)
FROM order_details od
JOIN orders o ON od.order_id = o.order_id
WHERE od.product_id = p.product_id
AND o.order_status = 'completed'
AND o.order_date >= CURRENT_DATE - INTERVAL '1 year'
) as revenue_last_year,
(
SELECT AVG(r.rating)
FROM reviews r
WHERE r.product_id = p.product_id
AND r.review_date >= CURRENT_DATE - INTERVAL '6 months'
) as avg_recent_rating
FROM products p
JOIN categories cat ON p.category_id = cat.category_id
WHERE p.is_active = true
AND p.created_date >= CURRENT_DATE - INTERVAL '2 years'
ORDER BY revenue_last_year DESC NULLS LAST;

-- SECTION 5: Complex CASE statement with wrong indentation
UPDATE customer_loyalty_status
SET
loyalty_tier = CASE
WHEN total_lifetime_spend >= 50000 AND total_orders >= 100 THEN
'Diamond_Elite'
WHEN total_lifetime_spend >= 25000 AND total_orders >= 50 THEN
'Platinum_Plus'
WHEN total_lifetime_spend >= 10000 AND total_orders >= 25 THEN
'Gold_Premium'
WHEN total_lifetime_spend >= 5000 AND total_orders >= 10 THEN
'Silver_Standard'
WHEN total_lifetime_spend >= 1000 AND total_orders >= 3 THEN
'Bronze_Basic'
ELSE
'Standard_Member'
END,
benefits = CASE loyalty_tier
WHEN 'Diamond_Elite' THEN
ARRAY['free_shipping', 'priority_support', 'exclusive_access', 'personal_concierge', 'birthday_gift']
WHEN 'Platinum_Plus' THEN
ARRAY['free_shipping', 'priority_support', 'exclusive_access', 'early_access']
WHEN 'Gold_Premium' THEN
ARRAY['free_shipping', 'priority_support', 'exclusive_access']
WHEN 'Silver_Standard' THEN
ARRAY['free_shipping', 'priority_support']
WHEN 'Bronze_Basic' THEN
ARRAY['free_shipping']
ELSE
ARRAY[]::TEXT[]
END,
discount_rate = CASE
WHEN loyalty_tier = 'Diamond_Elite' THEN 0.20
WHEN loyalty_tier = 'Platinum_Plus' THEN 0.15
WHEN loyalty_tier = 'Gold_Premium' THEN 0.12
WHEN loyalty_tier = 'Silver_Standard' THEN 0.08
WHEN loyalty_tier = 'Bronze_Basic' THEN 0.05
ELSE 0.00
END
WHERE customer_status = 'active'
AND last_purchase_date >= CURRENT_DATE - INTERVAL '2 years';

-- SECTION 6: Window function with terrible formatting
SELECT
order_id,
customer_id,
order_date,
order_total,
ROW_NUMBER() OVER (
PARTITION BY customer_id
ORDER BY order_date DESC
) as customer_order_rank,
RANK() OVER (
PARTITION BY DATE_TRUNC('month', order_date)
ORDER BY order_total DESC
) as monthly_order_rank,
LAG(order_total, 1) OVER (
PARTITION BY customer_id
ORDER BY order_date
) as previous_order_amount,
LEAD(order_date, 1) OVER (
PARTITION BY customer_id
ORDER BY order_date
) as next_order_date,
SUM(order_total) OVER (
PARTITION BY customer_id
ORDER BY order_date
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
) as running_customer_total,
AVG(order_total) OVER (
PARTITION BY customer_id
ORDER BY order_date
ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING
) as five_order_moving_average
FROM orders
WHERE order_status = 'completed'
AND order_date >= CURRENT_DATE - INTERVAL '1 year'
ORDER BY customer_id, order_date;

-- SECTION 7: Complex JOIN with misaligned conditions
SELECT
c.customer_id,
c.first_name,
c.last_name,
c.email,
o.order_id,
o.order_date,
o.order_total,
p.product_name,
od.quantity,
od.unit_price,
cat.category_name,
s.shipping_method,
s.tracking_number
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
AND o.order_status IN ('completed', 'shipped', 'delivered')
AND o.order_date >= CURRENT_DATE - INTERVAL '6 months'
INNER JOIN order_details od ON o.order_id = od.order_id
INNER JOIN products p ON od.product_id = p.product_id
AND p.is_active = true
LEFT JOIN categories cat ON p.category_id = cat.category_id
LEFT JOIN shipments s ON o.order_id = s.order_id
AND s.shipment_status NOT IN ('cancelled', 'returned')
WHERE c.customer_status = 'active'
AND c.registration_date >= '2022-01-01'
AND (
c.loyalty_tier IN ('Gold', 'Platinum', 'Diamond')
OR (
c.total_lifetime_value > 1000
AND c.total_orders >= 5
)
)
ORDER BY o.order_date DESC, c.customer_id;

-- SECTION 8: Recursive CTE with poor structure
WITH RECURSIVE category_hierarchy AS (
-- Base case: top-level categories
SELECT
category_id,
category_name,
parent_category_id,
0 as level,
category_name as category_path,
ARRAY[category_id] as id_path
FROM categories
WHERE parent_category_id IS NULL

UNION ALL

-- Recursive case: child categories
SELECT
c.category_id,
c.category_name,
c.parent_category_id,
ch.level + 1,
ch.category_path || ' > ' || c.category_name,
ch.id_path || c.category_id
FROM categories c
INNER JOIN category_hierarchy ch ON c.parent_category_id = ch.category_id
WHERE ch.level < 5
),
category_sales AS (
SELECT
ch.category_id,
ch.category_name,
ch.level,
ch.category_path,
COUNT(DISTINCT p.product_id) as product_count,
COUNT(DISTINCT od.order_id) as order_count,
SUM(od.quantity) as total_units_sold,
SUM(od.quantity * od.unit_price) as total_revenue
FROM category_hierarchy ch
LEFT JOIN products p ON ch.category_id = p.category_id
AND p.is_active = true
LEFT JOIN order_details od ON p.product_id = od.product_id
LEFT JOIN orders o ON od.order_id = o.order_id
AND o.order_status = 'completed'
AND o.order_date >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY ch.category_id, ch.category_name, ch.level, ch.category_path
)
SELECT
level,
category_name,
category_path,
product_count,
order_count,
total_units_sold,
ROUND(total_revenue, 2) as total_revenue,
CASE
WHEN total_revenue > 100000 THEN 'High_Performing'
WHEN total_revenue > 50000 THEN 'Medium_Performing'
WHEN total_revenue > 10000 THEN 'Low_Performing'
ELSE 'Underperforming'
END as performance_tier
FROM category_sales
WHERE product_count > 0
ORDER BY level, total_revenue DESC;

-- SECTION 9: Complex stored procedure with inconsistent indentation
CREATE OR REPLACE FUNCTION process_bulk_order_discounts(
order_batch_id INTEGER,
discount_percentage DECIMAL DEFAULT 0.05
) RETURNS TABLE(
order_id INTEGER,
original_total DECIMAL,
discount_amount DECIMAL,
new_total DECIMAL,
processing_status TEXT
) AS $$
DECLARE
order_record RECORD;
calculated_discount DECIMAL;
updated_total DECIMAL;
BEGIN
-- Process each order in the batch
FOR order_record IN
SELECT o.order_id, o.order_total, o.customer_id, c.loyalty_tier
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.batch_id = order_batch_id
AND o.order_status = 'pending'
LOOP
-- Calculate discount based on customer tier
CASE order_record.loyalty_tier
WHEN 'Diamond' THEN
calculated_discount := order_record.order_total * (discount_percentage + 0.10);
WHEN 'Platinum' THEN
calculated_discount := order_record.order_total * (discount_percentage + 0.05);
WHEN 'Gold' THEN
calculated_discount := order_record.order_total * (discount_percentage + 0.02);
ELSE
calculated_discount := order_record.order_total * discount_percentage;
END CASE;

-- Calculate new total
updated_total := order_record.order_total - calculated_discount;

-- Update the order
BEGIN
UPDATE orders
SET order_total = updated_total,
discount_applied = calculated_discount,
last_modified = CURRENT_TIMESTAMP
WHERE order_id = order_record.order_id;

-- Return the result
order_id := order_record.order_id;
original_total := order_record.order_total;
discount_amount := calculated_discount;
new_total := updated_total;
processing_status := 'SUCCESS';

RETURN NEXT;

EXCEPTION
WHEN OTHERS THEN
-- Handle errors
order_id := order_record.order_id;
original_total := order_record.order_total;
discount_amount := 0;
new_total := order_record.order_total;
processing_status := 'ERROR: ' || SQLERRM;

RETURN NEXT;
END;
END LOOP;

RETURN;
END;
$$ LANGUAGE plpgsql;

-- SECTION 10: Final challenge - extremely messy nested query
SELECT
main_query.customer_id,
main_query.customer_name,
main_query.customer_tier,
main_query.total_orders,
main_query.total_spent,
main_query.avg_order_value,
main_query.favorite_category,
main_query.last_order_date,
CASE
WHEN main_query.days_since_last_order <= 30 THEN 'Active'
WHEN main_query.days_since_last_order <= 90 THEN 'Recent'
WHEN main_query.days_since_last_order <= 180 THEN 'Dormant'
ELSE 'At_Risk'
END as engagement_status
FROM (
SELECT
c.customer_id,
c.first_name || ' ' || c.last_name as customer_name,
c.loyalty_tier as customer_tier,
COUNT(DISTINCT o.order_id) as total_orders,
SUM(o.order_total) as total_spent,
AVG(o.order_total) as avg_order_value,
(
SELECT cat.category_name
FROM order_details od
JOIN products p ON od.product_id = p.product_id
JOIN categories cat ON p.category_id = cat.category_id
JOIN orders o2 ON od.order_id = o2.order_id
WHERE o2.customer_id = c.customer_id
AND o2.order_status = 'completed'
GROUP BY cat.category_name
ORDER BY SUM(od.quantity * od.unit_price) DESC
LIMIT 1
) as favorite_category,
MAX(o.order_date) as last_order_date,
EXTRACT(DAYS FROM (CURRENT_DATE - MAX(o.order_date))) as days_since_last_order
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
AND o.order_status = 'completed'
WHERE c.customer_status = 'active'
GROUP BY c.customer_id, c.first_name, c.last_name, c.loyalty_tier
HAVING COUNT(DISTINCT o.order_id) > 0
) main_query
ORDER BY main_query.total_spent DESC;

-- Practice Instructions:
-- 1. Use >> to indent lines and << to unindent
-- 2. Use =ap to auto-indent paragraphs
-- 3. Use visual mode (V) to select blocks and then > or < to indent/unindent
-- 4. Use =i{ to auto-indent inside curly braces
-- 5. Use >i{ or <i{ to manually indent inside braces