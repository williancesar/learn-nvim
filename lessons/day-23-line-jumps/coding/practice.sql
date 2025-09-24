-- PostgreSQL Practice: Line Numbers and Bracket Matching
-- Day 23: SQL for practicing :line_number, %, [, ], {, } navigation
-- Enable line numbers with :set number for this practice

-- Line 5-10: Basic table creation with matching brackets
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE
);

-- Line 11-20: Complex nested parentheses for bracket matching practice
SELECT customer_id, (
    SELECT COUNT(*) FROM orders o WHERE (
        o.customer_id = c.customer_id AND (
            o.status = 'completed' OR (
                o.status = 'pending' AND o.created_at > (
                    CURRENT_DATE - INTERVAL '30 days'
                )
            )
        )
    )
) as order_count FROM customers c;

-- Line 21-30: JSON bracket matching with square brackets
SELECT
    product_id,
    attributes->'specs'->'dimensions'->>'height' as height,
    tags[1] as primary_tag,
    tags[2] as secondary_tag,
    metadata['category'] as category
FROM products
WHERE attributes ? 'specs';

-- Line 31-40: Function with curly braces for matching practice
CREATE OR REPLACE FUNCTION calculate_total(base_amount DECIMAL, tax_rate DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF base_amount IS NULL THEN {
        RETURN 0;
    }

    IF tax_rate IS NULL THEN {
        tax_rate := 0.08;
    }

    RETURN base_amount * (1 + tax_rate);
END;
$$ LANGUAGE plpgsql;

-- Line 41-50: Complex window function with nested parentheses
SELECT
    order_id,
    customer_id,
    order_total,
    ROW_NUMBER() OVER (
        PARTITION BY customer_id
        ORDER BY order_date DESC
    ) as recent_order_rank,
    LAG(order_total, 1) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
    ) as previous_order_total
FROM orders;

-- Line 51-60: Nested CASE statements with bracket matching
UPDATE customer_status
SET tier = CASE
    WHEN total_spent > 10000 THEN (
        CASE
            WHEN orders_count > 50 THEN 'platinum_frequent'
            WHEN orders_count > 20 THEN 'platinum_regular'
            ELSE 'platinum_occasional'
        END
    )
    WHEN total_spent > 5000 THEN 'gold'
    ELSE 'silver'
END;

-- Line 61-70: Array operations with bracket matching
SELECT
    user_id,
    permissions[1:3] as primary_permissions,
    permissions[4:] as additional_permissions,
    ARRAY_LENGTH(permissions, 1) as total_permissions,
    CASE
        WHEN 'admin' = ANY(permissions) THEN 'administrator'
        WHEN 'editor' = ANY(permissions) THEN 'content_manager'
        ELSE 'viewer'
    END as role_category
FROM user_permissions;

-- Line 71-80: Complex JOIN with multiple parentheses levels
SELECT
    p.product_name,
    c.category_name,
    (
        SELECT AVG(rating)
        FROM reviews r
        WHERE r.product_id = p.product_id AND (
            r.verified_purchase = true AND (
                r.review_date > CURRENT_DATE - INTERVAL '1 year'
            )
        )
    ) as avg_recent_rating
FROM products p
JOIN categories c ON p.category_id = c.category_id;

-- Line 81-90: CTE with nested bracket structures
WITH recursive_categories AS (
    SELECT
        category_id,
        name,
        parent_id,
        0 as level,
        ARRAY[category_id] as path
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    SELECT
        c.category_id,
        c.name,
        c.parent_id,
        rc.level + 1,
        rc.path || c.category_id
    FROM categories c
    JOIN recursive_categories rc ON c.parent_id = rc.category_id
    WHERE rc.level < 5
)
SELECT * FROM recursive_categories;

-- Line 91-100: Nested aggregation functions
SELECT
    department_id,
    COUNT(*) as employee_count,
    AVG(
        CASE
            WHEN hire_date > CURRENT_DATE - INTERVAL '1 year'
            THEN salary
        END
    ) as avg_new_employee_salary,
    MAX(
        CASE
            WHEN performance_rating >= 4
            THEN bonus_percentage
        END
    ) as max_high_performer_bonus
FROM employees
GROUP BY department_id;

-- Line 101-110: JSON aggregation with nested brackets
SELECT
    customer_id,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'order_id', order_id,
            'items', (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'product_name', product_name,
                        'quantity', quantity,
                        'price', price
                    )
                )
                FROM order_items oi
                WHERE oi.order_id = o.order_id
            ),
            'total', order_total
        )
    ) as order_history
FROM orders o
GROUP BY customer_id;

-- Line 111-120: Complex WHERE clause with nested conditions
SELECT * FROM products p
WHERE (
    p.category_id IN (
        SELECT category_id FROM categories
        WHERE (name ILIKE '%electronics%' OR name ILIKE '%gadgets%')
    ) AND (
        p.price BETWEEN (
            SELECT AVG(price) * 0.5 FROM products
            WHERE category_id = p.category_id
        ) AND (
            SELECT AVG(price) * 1.5 FROM products
            WHERE category_id = p.category_id
        )
    )
) OR (
    p.featured = true AND p.stock_quantity > (
        SELECT AVG(stock_quantity) FROM products
    )
);

-- Line 121-130: Stored procedure with exception handling
CREATE OR REPLACE FUNCTION process_order(order_id_param INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    order_exists BOOLEAN;
    inventory_sufficient BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM orders
        WHERE order_id = order_id_param AND status = 'pending'
    ) INTO order_exists;

    IF NOT order_exists THEN {
        RAISE EXCEPTION 'Order not found or not pending';
    }

    SELECT bool_and(
        p.stock_quantity >= oi.quantity
    ) INTO inventory_sufficient
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = order_id_param;

    IF NOT inventory_sufficient THEN {
        RAISE EXCEPTION 'Insufficient inventory';
    }

    UPDATE orders SET status = 'processing'
    WHERE order_id = order_id_param;

    RETURN TRUE;
EXCEPTION
    WHEN others THEN {
        RETURN FALSE;
    }
END;
$$ LANGUAGE plpgsql;

-- Line 131-140: Complex analytics query with multiple nesting levels
WITH sales_metrics AS (
    SELECT
        DATE_TRUNC('month', order_date) as sales_month,
        COUNT(*) as order_count,
        SUM(order_total) as monthly_revenue,
        AVG(order_total) as avg_order_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP (
            ORDER BY order_total
        ) as median_order_value
    FROM orders
    WHERE order_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', order_date)
),
growth_analysis AS (
    SELECT
        *,
        LAG(monthly_revenue) OVER (ORDER BY sales_month) as prev_month_revenue,
        (
            monthly_revenue - LAG(monthly_revenue) OVER (ORDER BY sales_month)
        ) / NULLIF(
            LAG(monthly_revenue) OVER (ORDER BY sales_month), 0
        ) * 100 as growth_rate
    FROM sales_metrics
)
SELECT * FROM growth_analysis
WHERE growth_rate IS NOT NULL;

-- Line 141-150: Nested subqueries with multiple levels
SELECT
    customer_id,
    customer_name,
    (
        SELECT COUNT(*) FROM orders o1
        WHERE o1.customer_id = c.customer_id AND o1.status = 'completed'
    ) as completed_orders,
    (
        SELECT SUM(order_total) FROM orders o2
        WHERE o2.customer_id = c.customer_id AND (
            o2.status = 'completed' AND o2.order_date >= (
                SELECT MAX(order_date) - INTERVAL '1 year'
                FROM orders o3
                WHERE o3.customer_id = c.customer_id
            )
        )
    ) as last_year_spending
FROM customers c
WHERE c.customer_id IN (
    SELECT DISTINCT customer_id FROM orders
    WHERE order_date >= CURRENT_DATE - INTERVAL '2 years'
);

-- Line 151-160: Complex UPDATE with nested conditions
UPDATE inventory_levels
SET reorder_status = CASE
    WHEN current_stock <= (
        SELECT AVG(monthly_usage) * lead_time_weeks / 4
        FROM product_usage_stats pus
        WHERE pus.product_id = inventory_levels.product_id
    ) THEN 'urgent_reorder'
    WHEN current_stock <= (
        SELECT AVG(monthly_usage) * (lead_time_weeks + 2) / 4
        FROM product_usage_stats pus
        WHERE pus.product_id = inventory_levels.product_id
    ) THEN 'standard_reorder'
    ELSE 'sufficient_stock'
END
WHERE product_id IN (
    SELECT product_id FROM products
    WHERE status = 'active' AND category_id IN (
        SELECT category_id FROM categories
        WHERE requires_inventory_tracking = true
    )
);

-- Line 161-170: Trigger function with nested logic
CREATE OR REPLACE FUNCTION audit_inventory_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN {
        IF OLD.stock_quantity != NEW.stock_quantity THEN {
            INSERT INTO inventory_audit_log (
                product_id,
                old_quantity,
                new_quantity,
                change_reason,
                changed_by,
                change_date
            ) VALUES (
                NEW.product_id,
                OLD.stock_quantity,
                NEW.stock_quantity,
                COALESCE(NEW.change_reason, 'automatic_update'),
                COALESCE(NEW.changed_by, user),
                CURRENT_TIMESTAMP
            );
        }
    }

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Line 171-180: Complex view definition with nested selects
CREATE VIEW customer_analytics AS
SELECT
    c.customer_id,
    c.customer_name,
    c.registration_date,
    (
        SELECT COUNT(*) FROM orders o
        WHERE o.customer_id = c.customer_id
    ) as total_orders,
    (
        SELECT SUM(order_total) FROM orders o
        WHERE o.customer_id = c.customer_id AND o.status = 'completed'
    ) as lifetime_value,
    (
        SELECT AVG(rating) FROM reviews r
        JOIN orders o ON r.order_id = o.order_id
        WHERE o.customer_id = c.customer_id
    ) as avg_review_rating,
    CASE
        WHEN (
            SELECT SUM(order_total) FROM orders o
            WHERE o.customer_id = c.customer_id AND o.status = 'completed'
        ) > 5000 THEN 'VIP'
        WHEN (
            SELECT COUNT(*) FROM orders o
            WHERE o.customer_id = c.customer_id
        ) > 10 THEN 'Loyal'
        ELSE 'Standard'
    END as customer_tier
FROM customers c;

-- Line 181-190: Final complex query with maximum nesting
SELECT
    product_category,
    total_products,
    avg_price,
    top_seller_info
FROM (
    SELECT
        c.category_name as product_category,
        COUNT(p.product_id) as total_products,
        ROUND(AVG(p.price), 2) as avg_price,
        (
            SELECT JSON_BUILD_OBJECT(
                'name', p2.product_name,
                'sales', (
                    SELECT SUM(oi.quantity)
                    FROM order_items oi
                    WHERE oi.product_id = p2.product_id
                ),
                'revenue', (
                    SELECT SUM(oi.quantity * oi.price)
                    FROM order_items oi
                    WHERE oi.product_id = p2.product_id
                )
            )
            FROM products p2
            WHERE p2.category_id = c.category_id
            ORDER BY (
                SELECT SUM(oi.quantity * oi.price)
                FROM order_items oi
                WHERE oi.product_id = p2.product_id
            ) DESC NULLS LAST
            LIMIT 1
        ) as top_seller_info
    FROM categories c
    JOIN products p ON c.category_id = p.category_id
    WHERE p.status = 'active'
    GROUP BY c.category_id, c.category_name
    HAVING COUNT(p.product_id) >= 5
) category_summary
ORDER BY total_products DESC, avg_price DESC;