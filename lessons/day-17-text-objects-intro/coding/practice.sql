-- PostgreSQL Practice: Text Objects Introduction
-- Day 17: Text object practice with words, expressions, and SQL-specific structures
-- Practice with iw, aw, i", a", i', a', i(, a(, i{, a{, i[, a[

-- Practice Section 1: Word Objects (iw, aw)
-- Use diw, ciw, yiw, viw for inner word operations
-- Use daw, caw, yaw, vaw for word including surrounding spaces
SELECT customer_id, customer_name, customer_email
FROM customers_table
WHERE active_status = 'ACTIVE'
    AND registration_date >= '2023-01-01'
    AND loyalty_points > 1000;

-- Practice Section 2: Double Quote Objects (i", a")
-- Use di", ci", yi", vi" for content inside quotes
-- Use da", ca", ya", va" for quotes and content
INSERT INTO products (name, description, category)
VALUES
    ("Wireless Headphones", "High-quality bluetooth headphones with noise cancellation", "Electronics"),
    ("Running Shoes", "Lightweight athletic shoes designed for long-distance running", "Footwear"),
    ("Coffee Maker", "Programmable drip coffee maker with thermal carafe", "Kitchen");

UPDATE inventory_items
SET status = "IN_STOCK",
    location = "WAREHOUSE_A",
    last_updated = "2024-01-15 10:30:00"
WHERE product_sku IN ("WH-001", "RS-042", "CM-103");

-- Practice Section 3: Single Quote Objects (i', a')
-- Use di', ci', yi', vi' for content inside single quotes
-- Use da', ca', ya', va' for quotes and content
SELECT p.name, p.price, c.name as category
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.status = 'active'
    AND p.price BETWEEN 50.00 AND 500.00
    AND c.slug IN ('electronics', 'clothing', 'books')
ORDER BY p.created_at DESC;

-- Practice Section 4: Parentheses Objects (i(, a))
-- Use di(, ci(, yi(, vi( for content inside parentheses
-- Use da(, ca(, ya(, va( for parentheses and content
SELECT
    customer_id,
    first_name,
    last_name,
    CONCAT(first_name, ' ', last_name) as full_name,
    EXTRACT(YEAR FROM birth_date) as birth_year,
    AGE(CURRENT_DATE, birth_date) as current_age,
    ROUND(AVG(order_total), 2) as avg_order_value
FROM customers
WHERE DATE_PART('year', registration_date) >= 2020
    AND (status = 'premium' OR loyalty_tier IN ('gold', 'platinum'))
GROUP BY customer_id, first_name, last_name, birth_date
HAVING COUNT(order_id) > 5
    AND SUM(order_total) > 1000;

-- Practice Section 5: Complex Nested Parentheses
-- Challenge your text object skills with deeply nested expressions
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) as sales_month,
        SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as completed_sales,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        AVG(CASE WHEN status = 'completed' THEN total_amount END) as avg_completed_order
    FROM orders
    WHERE order_date >= DATE_TRUNC('year', CURRENT_DATE)
        AND (customer_type IN ('retail', 'wholesale') OR priority_level = 'high')
    GROUP BY DATE_TRUNC('month', order_date)
),
growth_metrics AS (
    SELECT
        sales_month,
        completed_sales,
        LAG(completed_sales) OVER (ORDER BY sales_month) as prev_month_sales,
        ROUND(((completed_sales - LAG(completed_sales) OVER (ORDER BY sales_month)) /
               NULLIF(LAG(completed_sales) OVER (ORDER BY sales_month), 0) * 100), 2) as growth_rate
    FROM monthly_sales
)
SELECT * FROM growth_metrics WHERE growth_rate IS NOT NULL;

-- Practice Section 6: Bracket Objects (i[, a])
-- Use di[, ci[, yi[, vi[ for content inside brackets
-- Use da[, ca[, ya[, va[ for brackets and content
SELECT
    product_id,
    attributes['color'] as product_color,
    attributes['size'] as product_size,
    attributes['material'] as product_material,
    tags[1] as primary_tag,
    tags[2] as secondary_tag,
    specifications['weight'] as weight_kg,
    specifications['dimensions']['length'] as length_cm
FROM products
WHERE attributes['category'] = 'clothing'
    AND tags && ARRAY['summer', 'casual', 'outdoor']
    AND specifications['rating'] >= 4.0;

-- Practice Section 7: Curly Brace Objects (i{, a})
-- Use di{, ci{, yi{, vi{ for content inside braces
-- Use da{, ca{, ya{, va{ for braces and content
CREATE OR REPLACE FUNCTION calculate_discount(
    customer_tier VARCHAR,
    order_amount DECIMAL,
    is_new_customer BOOLEAN
) RETURNS DECIMAL AS $$
DECLARE
    discount_rate DECIMAL := 0.0;
    base_discount DECIMAL := 0.05;
    tier_bonus DECIMAL := 0.0;
BEGIN
    -- Base discount calculation logic
    IF order_amount > 1000 THEN {
        discount_rate := base_discount + 0.10;
    } ELSIF order_amount > 500 THEN {
        discount_rate := base_discount + 0.05;
    } ELSE {
        discount_rate := base_discount;
    }

    -- Tier-based bonus calculation
    CASE customer_tier
        WHEN 'platinum' THEN {
            tier_bonus := 0.15;
        }
        WHEN 'gold' THEN {
            tier_bonus := 0.10;
        }
        WHEN 'silver' THEN {
            tier_bonus := 0.05;
        }
        ELSE {
            tier_bonus := 0.0;
        }
    END CASE;

    -- New customer bonus
    IF is_new_customer THEN {
        tier_bonus := tier_bonus + 0.05;
    }

    RETURN LEAST(discount_rate + tier_bonus, 0.50);
END;
$$ LANGUAGE plpgsql;

-- Practice Section 8: Mixed Text Objects Challenge
-- Complex query with multiple text object types for advanced practice
WITH customer_segments AS (
    SELECT
        c.customer_id,
        c.email,
        CASE
            WHEN c.total_spent > 5000 THEN 'high_value'
            WHEN c.total_spent > 1000 THEN 'medium_value'
            ELSE 'low_value'
        END as segment,
        JSON_BUILD_OBJECT(
            'name', CONCAT(c.first_name, ' ', c.last_name),
            'contact', JSON_BUILD_OBJECT(
                'email', c.email,
                'phone', c.phone,
                'address', JSON_BUILD_OBJECT(
                    'street', c.address['street'],
                    'city', c.address['city'],
                    'country', c.address['country']
                )
            ),
            'preferences', ARRAY[c.communication_preference, c.language_preference],
            'metrics', JSON_BUILD_OBJECT(
                'lifetime_value', c.total_spent,
                'order_frequency', c.avg_days_between_orders,
                'satisfaction_score', c.avg_rating
            )
        ) as customer_profile
    FROM customers c
    WHERE c.status IN ('active', 'premium')
        AND c.registration_date >= DATE_TRUNC('year', CURRENT_DATE - INTERVAL '2 years')
),
segment_analysis AS (
    SELECT
        segment,
        COUNT(*) as customer_count,
        AVG((customer_profile->>'metrics')::JSON->>'lifetime_value')::DECIMAL as avg_lifetime_value,
        PERCENTILE_CONT(0.5) WITHIN GROUP (
            ORDER BY (customer_profile->>'metrics')::JSON->>'lifetime_value')::DECIMAL
        ) as median_lifetime_value,
        STRING_AGG(
            DISTINCT (customer_profile->>'contact')::JSON->>'address')::JSON->>'country',
            ', '
        ) as countries_represented
    FROM customer_segments
    GROUP BY segment
)
SELECT
    segment,
    customer_count,
    ROUND(avg_lifetime_value, 2) as avg_lifetime_value,
    ROUND(median_lifetime_value, 2) as median_lifetime_value,
    countries_represented,
    CASE segment
        WHEN 'high_value' THEN 'VIP treatment with dedicated account manager'
        WHEN 'medium_value' THEN 'Regular engagement with targeted promotions'
        WHEN 'low_value' THEN 'Nurture campaigns to increase engagement'
    END as recommended_strategy
FROM segment_analysis
ORDER BY avg_lifetime_value DESC;

-- Practice Section 9: Window Function Text Objects
-- Practice with complex window function expressions containing various text objects
SELECT
    order_id,
    customer_id,
    order_date,
    total_amount,
    -- Window functions with parentheses text objects
    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date) as customer_order_sequence,
    LAG(total_amount, 1) OVER (PARTITION BY customer_id ORDER BY order_date) as previous_order_amount,
    LEAD(order_date, 1) OVER (PARTITION BY customer_id ORDER BY order_date) as next_order_date,

    -- Complex CASE statements with quotes and parentheses
    CASE
        WHEN total_amount > AVG(total_amount) OVER (PARTITION BY EXTRACT(MONTH FROM order_date))
        THEN 'above_monthly_average'
        WHEN total_amount < AVG(total_amount) OVER (PARTITION BY EXTRACT(MONTH FROM order_date)) * 0.5
        THEN 'significantly_below_average'
        ELSE 'within_normal_range'
    END as order_performance_category,

    -- Nested aggregations with multiple text object types
    SUM(total_amount) OVER (
        PARTITION BY customer_id
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as cumulative_customer_spending,

    ROUND(
        AVG(total_amount) OVER (
            PARTITION BY EXTRACT(QUARTER FROM order_date)
            ORDER BY order_date
            ROWS BETWEEN 30 PRECEDING AND CURRENT ROW
        ), 2
    ) as rolling_30_order_average

FROM orders
WHERE order_date >= '2023-01-01'
    AND status NOT IN ('cancelled', 'refunded', 'pending_payment')
    AND customer_id IN (
        SELECT DISTINCT customer_id
        FROM orders
        WHERE order_date >= CURRENT_DATE - INTERVAL '1 year'
        GROUP BY customer_id
        HAVING COUNT(*) >= 3
    )
ORDER BY customer_id, order_date;

-- Practice Section 10: Advanced JSON and Array Text Objects
-- Final challenge with complex nested structures for text object mastery
WITH product_analytics AS (
    SELECT
        p.product_id,
        p.name,
        p.metadata::JSON as product_metadata,
        -- Complex JSON path operations with text objects
        (p.metadata::JSON->'specifications'->>'weight')::DECIMAL as weight_kg,
        (p.metadata::JSON->'pricing'->'retail'->>'amount')::DECIMAL as retail_price,
        (p.metadata::JSON->'pricing'->'wholesale'->>'amount')::DECIMAL as wholesale_price,

        -- Array operations with brackets text objects
        ARRAY_LENGTH(p.tags, 1) as tag_count,
        p.tags[1:3] as primary_tags,
        ARRAY_TO_STRING(p.tags[4:], ', ') as additional_tags,

        -- Complex aggregations with nested text objects
        (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'review_id', r.id,
                    'rating', r.rating,
                    'comment_excerpt', LEFT(r.comment, 50) || '...',
                    'reviewer_info', JSON_BUILD_OBJECT(
                        'name', r.reviewer_name,
                        'verified', r.is_verified_purchase,
                        'helpful_votes', r.helpful_count
                    )
                )
            )
            FROM reviews r
            WHERE r.product_id = p.product_id
                AND r.rating >= 4
                AND r.created_at >= CURRENT_DATE - INTERVAL '90 days'
            LIMIT 5
        ) as recent_positive_reviews,

        -- Window function with complex CASE and text objects
        RANK() OVER (
            PARTITION BY (p.metadata::JSON->>'category')
            ORDER BY (
                SELECT AVG(rating)
                FROM reviews
                WHERE product_id = p.product_id
                    AND created_at >= CURRENT_DATE - INTERVAL '1 year'
            ) DESC NULLS LAST
        ) as category_rating_rank

    FROM products p
    WHERE p.is_active = true
        AND p.metadata::JSON ? 'specifications'
        AND (p.metadata::JSON->'pricing') IS NOT NULL
        AND ARRAY_LENGTH(p.tags, 1) > 0
)
SELECT
    product_id,
    name,
    weight_kg,
    retail_price,
    wholesale_price,
    (retail_price - wholesale_price) / retail_price * 100 as margin_percentage,
    tag_count,
    primary_tags,
    additional_tags,
    JSON_ARRAY_LENGTH(recent_positive_reviews) as positive_review_count,
    category_rating_rank,

    -- Final complex expression combining all text object types
    CASE
        WHEN category_rating_rank <= 3 AND JSON_ARRAY_LENGTH(recent_positive_reviews) >= 3
        THEN 'featured_product_candidate'
        WHEN (retail_price - wholesale_price) / retail_price > 0.50
        THEN 'high_margin_focus'
        WHEN weight_kg < 1.0 AND 'lightweight' = ANY(primary_tags)
        THEN 'shipping_advantage'
        ELSE 'standard_product'
    END as product_strategy_category

FROM product_analytics
WHERE retail_price > 0
    AND wholesale_price > 0
ORDER BY category_rating_rank, retail_price DESC;