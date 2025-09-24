-- PostgreSQL Practice: Operator + Motion Combinations
-- Day 20: Perfect for practicing d, c, y with various motions
-- Focus on combining operators (d, c, y, v) with motions (w, b, e, $, 0, f, t, etc.)

-- SECTION A: Word and Line Operations Practice
-- Use dw, cw, yw on words | d$, c$, y$ on line endings | d0, c0, y0 on line beginnings

SELECT customer_id, customer_name, customer_email, customer_phone, customer_address
FROM customer_master_table
WHERE registration_date >= '2023-01-01'
    AND account_status = 'ACTIVE'
    AND loyalty_tier IN ('GOLD', 'PLATINUM', 'DIAMOND')
    AND marketing_preferences = 'OPTED_IN';

-- Practice deleting/changing/yanking individual words in the WHERE clause above
-- Try: dw on 'registration_date', cw on 'ACTIVE', yw on 'GOLD'

UPDATE product_inventory_table
SET stock_quantity = stock_quantity + incoming_shipment_quantity,
    last_updated_timestamp = CURRENT_TIMESTAMP,
    warehouse_location = 'MAIN_WAREHOUSE_SECTOR_A',
    inventory_status = CASE
        WHEN stock_quantity + incoming_shipment_quantity > reorder_threshold THEN 'WELL_STOCKED'
        WHEN stock_quantity + incoming_shipment_quantity > minimum_stock_level THEN 'ADEQUATE_STOCK'
        ELSE 'LOW_STOCK_WARNING'
    END
WHERE product_sku IN ('LAPTOP-001', 'MOUSE-042', 'KEYBOARD-155', 'MONITOR-088');

-- SECTION B: Character Navigation Practice
-- Use df, dt, cf, ct, yf, yt for character-based operations

INSERT INTO sales_transactions (transaction_id, customer_id, product_sku, quantity_purchased)
VALUES
    ('TXN-2024-001-ABC123', 'CUST-789012', 'LAPTOP-GAMING-RTX4090', 2),
    ('TXN-2024-002-DEF456', 'CUST-345678', 'MOUSE-WIRELESS-LOGITECH', 5),
    ('TXN-2024-003-GHI789', 'CUST-901234', 'KEYBOARD-MECHANICAL-RGB', 1),
    ('TXN-2024-004-JKL012', 'CUST-567890', 'MONITOR-4K-ULTRAWIDE', 3);

-- Practice with character motions:
-- Try: df- (delete until first dash), ct- (change until dash)
-- Try: y2f- (yank until second dash), d3t- (delete until third dash, not including)

SELECT order_id, customer_email, product_name, unit_price, quantity, total_amount
FROM order_details_view
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31'
    AND payment_status IN ('COMPLETED', 'PROCESSING', 'PENDING_REVIEW')
    AND shipping_country IN ('USA', 'CANADA', 'MEXICO', 'UK', 'GERMANY', 'FRANCE')
    AND product_category NOT IN ('RESTRICTED', 'DISCONTINUED', 'OUT_OF_STOCK');

-- SECTION C: Text Object Combinations
-- Practice combining operators with text objects (iw, aw, i", a", i(, a(, etc.)

CREATE TABLE customer_preferences AS
SELECT
    customer_id,
    JSON_BUILD_OBJECT(
        'communication_preferences', JSON_BUILD_OBJECT(
            'email_notifications', email_opt_in,
            'sms_notifications', sms_opt_in,
            'phone_calls', phone_opt_in,
            'preferred_language', language_preference
        ),
        'shopping_preferences', JSON_BUILD_OBJECT(
            'favorite_categories', favorite_product_categories,
            'price_range_preference', preferred_price_range,
            'brand_preferences', preferred_brands,
            'delivery_preferences', preferred_delivery_method
        ),
        'marketing_preferences', JSON_BUILD_OBJECT(
            'newsletter_subscription', newsletter_subscribed,
            'promotional_emails', promo_emails_enabled,
            'personalized_recommendations', recommendations_enabled,
            'social_media_integration', social_media_connected
        )
    ) as customer_preference_data
FROM customer_profiles
WHERE profile_completion_percentage > 75.0
    AND last_activity_date >= CURRENT_DATE - INTERVAL '6 months';

-- Practice text object operations on the JSON structure above:
-- Try: ci" (change inside quotes), da" (delete around quotes)
-- Try: ci( (change inside parentheses), yi{ (yank inside braces)

-- SECTION D: Complex Function Call Practice
-- Perfect for practicing with nested parentheses and complex expressions

WITH monthly_sales_analytics AS (
    SELECT
        DATE_TRUNC('month', order_date) as sales_month,
        COUNT(DISTINCT order_id) as total_orders,
        COUNT(DISTINCT customer_id) as unique_customers,
        SUM(order_total) as monthly_revenue,
        AVG(order_total) as average_order_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY order_total) as median_order_value,
        STDDEV(order_total) as order_value_standard_deviation,
        MIN(order_total) as minimum_order_value,
        MAX(order_total) as maximum_order_value
    FROM orders
    WHERE order_status NOT IN ('CANCELLED', 'REFUNDED', 'FAILED')
        AND order_date >= DATE_TRUNC('year', CURRENT_DATE - INTERVAL '2 years')
    GROUP BY DATE_TRUNC('month', order_date)
)
SELECT
    sales_month,
    total_orders,
    unique_customers,
    ROUND(monthly_revenue::NUMERIC, 2) as monthly_revenue,
    ROUND(average_order_value::NUMERIC, 2) as avg_order_value,
    ROUND(median_order_value::NUMERIC, 2) as median_order_value,
    LAG(monthly_revenue) OVER (ORDER BY sales_month) as previous_month_revenue,
    ROUND(((monthly_revenue - LAG(monthly_revenue) OVER (ORDER BY sales_month)) /
           NULLIF(LAG(monthly_revenue) OVER (ORDER BY sales_month), 0) * 100)::NUMERIC, 2) as revenue_growth_percentage,
    CASE
        WHEN monthly_revenue > LAG(monthly_revenue) OVER (ORDER BY sales_month) THEN 'GROWTH'
        WHEN monthly_revenue < LAG(monthly_revenue) OVER (ORDER BY sales_month) THEN 'DECLINE'
        ELSE 'STABLE'
    END as trend_direction
FROM monthly_sales_analytics
ORDER BY sales_month DESC;

-- Practice with nested function operations:
-- Try: di( on various function calls, ci( to change function parameters
-- Try: da( to delete entire function calls, yi( to yank function contents

-- SECTION E: String and Array Operations
-- Great for practicing motions within complex data structures

SELECT
    product_id,
    product_name,
    ARRAY['electronics', 'computers', 'gaming', 'high-performance'] as product_tags,
    CONCAT(product_name, ' - ', product_category, ' (', product_subcategory, ')') as full_product_description,
    SUBSTRING(product_description FROM 1 FOR 100) || '...' as truncated_description,
    REGEXP_REPLACE(product_name, '[^A-Za-z0-9\s]', '', 'g') as sanitized_product_name,
    COALESCE(manufacturer_name, 'Unknown Manufacturer') as manufacturer,
    CASE
        WHEN product_weight > 50.0 THEN 'HEAVY_ITEM'
        WHEN product_weight > 10.0 THEN 'MEDIUM_WEIGHT'
        WHEN product_weight > 1.0 THEN 'LIGHT_WEIGHT'
        ELSE 'VERY_LIGHT'
    END as weight_category
FROM products
WHERE product_name ILIKE '%laptop%'
    OR product_name ILIKE '%computer%'
    OR product_name ILIKE '%gaming%'
    OR product_category IN ('Electronics', 'Computing', 'Gaming');

-- Practice string manipulation operations:
-- Try: cf' (change until single quote), dt] (delete until bracket)
-- Try: yi[ (yank inside array brackets), ci' (change inside quotes)

-- SECTION F: Complex WHERE Clause Practice
-- Excellent for practicing motions within conditional logic

DELETE FROM temporary_user_sessions
WHERE session_start_time < CURRENT_TIMESTAMP - INTERVAL '24 hours'
    AND (session_status = 'EXPIRED' OR session_status = 'INACTIVE')
    AND user_id NOT IN (
        SELECT DISTINCT user_id
        FROM active_premium_subscriptions
        WHERE subscription_end_date > CURRENT_DATE
    )
    AND session_id NOT IN (
        SELECT session_id
        FROM recent_high_value_transactions
        WHERE transaction_amount > 1000.00
            AND transaction_date >= CURRENT_DATE - INTERVAL '7 days'
    );

-- Practice with logical operators and conditions:
-- Try: daw on AND/OR keywords, ciw to change status values
-- Try: di( on subquery parentheses, da( to delete entire subqueries

-- SECTION G: Advanced CASE Statement Practice
-- Perfect for nested conditions and complex logic

UPDATE customer_loyalty_tiers
SET
    current_tier = CASE
        WHEN total_lifetime_spend >= 10000.00 AND orders_last_year >= 12 THEN 'DIAMOND'
        WHEN total_lifetime_spend >= 5000.00 AND orders_last_year >= 8 THEN 'PLATINUM'
        WHEN total_lifetime_spend >= 2000.00 AND orders_last_year >= 4 THEN 'GOLD'
        WHEN total_lifetime_spend >= 500.00 AND orders_last_year >= 2 THEN 'SILVER'
        WHEN total_lifetime_spend >= 100.00 OR orders_last_year >= 1 THEN 'BRONZE'
        ELSE 'STANDARD'
    END,
    tier_benefits = CASE current_tier
        WHEN 'DIAMOND' THEN ARRAY['free_shipping', 'priority_support', 'exclusive_access', 'personal_shopper', 'early_access']
        WHEN 'PLATINUM' THEN ARRAY['free_shipping', 'priority_support', 'exclusive_access', 'early_access']
        WHEN 'GOLD' THEN ARRAY['free_shipping', 'priority_support', 'exclusive_access']
        WHEN 'SILVER' THEN ARRAY['free_shipping', 'priority_support']
        WHEN 'BRONZE' THEN ARRAY['free_shipping']
        ELSE ARRAY[]::TEXT[]
    END,
    discount_percentage = CASE
        WHEN current_tier = 'DIAMOND' THEN 15.0
        WHEN current_tier = 'PLATINUM' THEN 12.0
        WHEN current_tier = 'GOLD' THEN 10.0
        WHEN current_tier = 'SILVER' THEN 7.5
        WHEN current_tier = 'BRONZE' THEN 5.0
        ELSE 0.0
    END
WHERE customer_status = 'ACTIVE'
    AND last_purchase_date >= CURRENT_DATE - INTERVAL '2 years';

-- Practice CASE statement navigation:
-- Try: daw on WHEN keywords, ciw on tier names like 'DIAMOND'
-- Try: di[ on array brackets, ci' on string values in arrays

-- SECTION H: Advanced Join Operations
-- Complex table relationships for motion practice

SELECT
    c.customer_id,
    c.first_name || ' ' || c.last_name as full_name,
    c.email_address,
    COUNT(DISTINCT o.order_id) as total_orders,
    SUM(o.order_total) as lifetime_value,
    AVG(o.order_total) as average_order_value,
    STRING_AGG(DISTINCT p.product_category, ', ' ORDER BY p.product_category) as purchased_categories,
    COUNT(DISTINCT p.product_id) as unique_products_purchased,
    MAX(o.order_date) as last_order_date,
    MIN(o.order_date) as first_order_date,
    EXTRACT(DAYS FROM (MAX(o.order_date) - MIN(o.order_date))) as customer_lifespan_days
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
INNER JOIN products p ON oi.product_id = p.product_id
LEFT JOIN customer_reviews r ON c.customer_id = r.customer_id AND p.product_id = r.product_id
WHERE c.registration_date >= '2022-01-01'
    AND c.account_status IN ('ACTIVE', 'PREMIUM', 'VIP')
    AND o.order_status NOT IN ('CANCELLED', 'REFUNDED', 'FAILED', 'DISPUTED')
    AND p.product_status = 'AVAILABLE'
GROUP BY c.customer_id, c.first_name, c.last_name, c.email_address
HAVING COUNT(DISTINCT o.order_id) >= 3
    AND SUM(o.order_total) >= 500.00
ORDER BY lifetime_value DESC, total_orders DESC
LIMIT 100;

-- Practice join syntax and conditions:
-- Try: daw on JOIN keywords, ciw on table aliases (c, o, oi, p, r)
-- Try: cf. (change until dot in table.column), dt space (delete until space)
-- Try: yi( in ON conditions, da( around entire join conditions

-- SECTION I: Window Function Practice
-- Complex analytical functions for advanced motion practice

WITH customer_ranking AS (
    SELECT
        customer_id,
        order_date,
        order_total,
        ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) as order_sequence,
        LAG(order_total, 1) OVER (PARTITION BY customer_id ORDER BY order_date) as previous_order_amount,
        LEAD(order_total, 1) OVER (PARTITION BY customer_id ORDER BY order_date) as next_order_amount,
        SUM(order_total) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total,
        AVG(order_total) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING) as five_order_moving_average,
        RANK() OVER (PARTITION BY DATE_TRUNC('month', order_date) ORDER BY order_total DESC) as monthly_order_rank,
        DENSE_RANK() OVER (ORDER BY order_total DESC) as overall_order_rank,
        NTILE(10) OVER (ORDER BY order_total) as order_value_decile,
        PERCENT_RANK() OVER (PARTITION BY EXTRACT(QUARTER FROM order_date) ORDER BY order_total) as quarterly_percentile
    FROM orders
    WHERE order_status = 'COMPLETED'
        AND order_date >= '2023-01-01'
)
SELECT * FROM customer_ranking
WHERE order_sequence <= 10
    AND monthly_order_rank <= 5
ORDER BY customer_id, order_sequence;