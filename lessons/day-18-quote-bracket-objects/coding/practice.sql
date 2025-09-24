-- PostgreSQL Practice: Complex Nested Parentheses and Quotes
-- Day 18: Advanced text object practice with deeply nested structures
-- Focus on complex nesting of (), [], {}, "", '' for advanced text object manipulation

-- Section 1: Deeply Nested Function Calls and Expressions
-- Practice navigating complex nested parentheses with function calls
SELECT
    customer_id,
    COALESCE(
        NULLIF(
            TRIM(
                CONCAT(
                    COALESCE(first_name, ''),
                    CASE
                        WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN ' '
                        ELSE ''
                    END,
                    COALESCE(last_name, '')
                )
            ),
            ''
        ),
        'Unknown Customer'
    ) as full_name,
    ROUND(
        CAST(
            COALESCE(
                (
                    SELECT AVG(order_total)
                    FROM orders o
                    WHERE o.customer_id = c.customer_id
                        AND o.status IN ('completed', 'shipped', 'delivered')
                        AND o.order_date >= (CURRENT_DATE - INTERVAL '1 year')
                ),
                0.00
            ) as DECIMAL(10,2)
        ),
        2
    ) as avg_annual_order_value,
    GREATEST(
        0,
        LEAST(
            100,
            ROUND(
                (
                    COUNT(
                        CASE
                            WHEN o.status = 'completed'
                                AND o.order_date >= (CURRENT_DATE - INTERVAL '90 days')
                            THEN 1
                        END
                    ) * 25.0
                ) + (
                    CASE
                        WHEN c.loyalty_tier = 'platinum' THEN 25
                        WHEN c.loyalty_tier = 'gold' THEN 15
                        WHEN c.loyalty_tier = 'silver' THEN 10
                        ELSE 0
                    END
                ),
                0
            )
        )
    ) as satisfaction_score
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE c.registration_date >= DATE_TRUNC(
    'month',
    CURRENT_DATE - INTERVAL '2 years'
)
GROUP BY c.customer_id, c.first_name, c.last_name, c.loyalty_tier
HAVING COUNT(o.order_id) > 0;

-- Section 2: Complex JSON Operations with Nested Quotes and Brackets
-- Practice with mixed quote types and nested bracket structures
WITH complex_product_data AS (
    SELECT
        p.product_id,
        p.name as product_name,
        -- Complex JSON construction with nested quotes and structures
        JSON_BUILD_OBJECT(
            'basic_info', JSON_BUILD_OBJECT(
                'name', p.name,
                'description', COALESCE(p.description, 'No description available'),
                'sku', p.sku,
                'status', CASE
                    WHEN p.is_active = true THEN 'active'
                    ELSE 'inactive'
                END
            ),
            'pricing', JSON_BUILD_OBJECT(
                'retail_price', p.price,
                'cost_price', p.cost,
                'margin_percentage', ROUND(
                    (
                        (p.price - COALESCE(p.cost, 0)) /
                        NULLIF(p.price, 0)
                    ) * 100,
                    2
                ),
                'discount_tiers', JSON_BUILD_ARRAY(
                    JSON_BUILD_OBJECT(
                        'quantity_min', 1,
                        'quantity_max', 9,
                        'discount_percent', 0
                    ),
                    JSON_BUILD_OBJECT(
                        'quantity_min', 10,
                        'quantity_max', 49,
                        'discount_percent', 5
                    ),
                    JSON_BUILD_OBJECT(
                        'quantity_min', 50,
                        'quantity_max', NULL,
                        'discount_percent', 15
                    )
                )
            ),
            'analytics', JSON_BUILD_OBJECT(
                'total_sold', (
                    SELECT COALESCE(SUM(od.quantity), 0)
                    FROM order_details od
                    JOIN orders o ON od.order_id = o.order_id
                    WHERE od.product_id = p.product_id
                        AND o.status IN ('completed', 'shipped')
                        AND o.order_date >= (CURRENT_DATE - INTERVAL '1 year')
                ),
                'revenue_generated', (
                    SELECT COALESCE(SUM(od.quantity * od.unit_price), 0)
                    FROM order_details od
                    JOIN orders o ON od.order_id = o.order_id
                    WHERE od.product_id = p.product_id
                        AND o.status IN ('completed', 'shipped')
                        AND o.order_date >= (CURRENT_DATE - INTERVAL '1 year')
                ),
                'avg_rating', (
                    SELECT ROUND(AVG(rating), 2)
                    FROM reviews r
                    WHERE r.product_id = p.product_id
                        AND r.is_verified = true
                        AND r.created_at >= (CURRENT_DATE - INTERVAL '6 months')
                )
            ),
            'categories', (
                SELECT JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', c.category_id,
                        'name', c.name,
                        'path', ARRAY_TO_STRING(
                            ARRAY[
                                COALESCE(parent_cat.name, ''),
                                c.name
                            ],
                            ' > '
                        )
                    )
                )
                FROM categories c
                LEFT JOIN categories parent_cat ON c.parent_id = parent_cat.category_id
                WHERE c.category_id = p.category_id
            ),
            'inventory', JSON_BUILD_OBJECT(
                'current_stock', p.stock_quantity,
                'reserved_stock', COALESCE(
                    (
                        SELECT SUM(od.quantity)
                        FROM order_details od
                        JOIN orders o ON od.order_id = o.order_id
                        WHERE od.product_id = p.product_id
                            AND o.status IN ('pending', 'processing')
                    ),
                    0
                ),
                'available_stock', GREATEST(
                    0,
                    p.stock_quantity - COALESCE(
                        (
                            SELECT SUM(od.quantity)
                            FROM order_details od
                            JOIN orders o ON od.order_id = o.order_id
                            WHERE od.product_id = p.product_id
                                AND o.status IN ('pending', 'processing')
                        ),
                        0
                    )
                ),
                'reorder_threshold', p.reorder_level,
                'needs_reorder', CASE
                    WHEN p.stock_quantity <= p.reorder_level THEN true
                    ELSE false
                END
            )
        ) as product_data
    FROM products p
    WHERE p.created_at >= (CURRENT_DATE - INTERVAL '2 years')
)
SELECT
    product_id,
    product_name,
    -- Extract nested JSON values with complex path operations
    (product_data->'basic_info'->>'name') as extracted_name,
    (product_data->'pricing'->>'retail_price')::DECIMAL as retail_price,
    (product_data->'pricing'->>'margin_percentage')::DECIMAL as margin_pct,
    (product_data->'analytics'->>'total_sold')::INTEGER as units_sold,
    (product_data->'analytics'->>'revenue_generated')::DECIMAL as revenue,
    (product_data->'analytics'->>'avg_rating')::DECIMAL as avg_rating,
    (product_data->'inventory'->>'current_stock')::INTEGER as stock,
    (product_data->'inventory'->>'needs_reorder')::BOOLEAN as needs_reorder,

    -- Complex CASE with nested conditions and quotes
    CASE
        WHEN (product_data->'analytics'->>'avg_rating')::DECIMAL >= 4.5
            AND (product_data->'analytics'->>'total_sold')::INTEGER >= 100
        THEN 'star_product'
        WHEN (product_data->'pricing'->>'margin_percentage')::DECIMAL >= 50
            AND (product_data->'inventory'->>'needs_reorder')::BOOLEAN = false
        THEN 'high_margin_available'
        WHEN (product_data->'inventory'->>'needs_reorder')::BOOLEAN = true
            AND (product_data->'analytics'->>'total_sold')::INTEGER > 0
        THEN 'reorder_priority'
        ELSE 'standard_product'
    END as product_classification,

    -- Nested array operations with brackets
    JSON_ARRAY_LENGTH(product_data->'pricing'->'discount_tiers') as discount_tier_count,
    (product_data->'pricing'->'discount_tiers'->0->>'discount_percent')::INTEGER as first_tier_discount,
    (product_data->'pricing'->'discount_tiers'->-1->>'discount_percent')::INTEGER as max_tier_discount

FROM complex_product_data
WHERE (product_data->'basic_info'->>'status') = 'active'
ORDER BY (product_data->'analytics'->>'revenue_generated')::DECIMAL DESC;

-- Section 3: Complex Window Functions with Nested Aggregations
-- Advanced nested structures in window function definitions
WITH order_analytics AS (
    SELECT
        o.order_id,
        o.customer_id,
        o.order_date,
        o.total_amount,
        -- Complex window function with nested CASE statements and quotes
        CASE
            WHEN LAG(o.order_date) OVER (
                PARTITION BY o.customer_id
                ORDER BY o.order_date
            ) IS NULL
            THEN 'first_order'
            WHEN o.order_date - LAG(o.order_date) OVER (
                PARTITION BY o.customer_id
                ORDER BY o.order_date
            ) <= INTERVAL '30 days'
            THEN 'frequent_buyer'
            WHEN o.order_date - LAG(o.order_date) OVER (
                PARTITION BY o.customer_id
                ORDER BY o.order_date
            ) <= INTERVAL '90 days'
            THEN 'regular_buyer'
            ELSE 'irregular_buyer'
        END as purchase_pattern,

        -- Nested aggregation with complex FILTER clause
        SUM(
            CASE
                WHEN o.status IN ('completed', 'shipped', 'delivered')
                THEN o.total_amount
                ELSE 0
            END
        ) OVER (
            PARTITION BY o.customer_id
            ORDER BY o.order_date
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) as cumulative_spending,

        -- Complex ranking with nested conditions
        DENSE_RANK() OVER (
            PARTITION BY DATE_TRUNC('month', o.order_date)
            ORDER BY (
                o.total_amount * (
                    CASE
                        WHEN o.status = 'completed' THEN 1.0
                        WHEN o.status = 'shipped' THEN 0.9
                        WHEN o.status = 'processing' THEN 0.5
                        ELSE 0.1
                    END
                )
            ) DESC
        ) as monthly_order_rank,

        -- Nested statistical functions
        ROUND(
            (
                o.total_amount - AVG(o.total_amount) OVER (
                    PARTITION BY o.customer_id
                )
            ) / NULLIF(
                STDDEV(o.total_amount) OVER (
                    PARTITION BY o.customer_id
                ),
                0
            ),
            2
        ) as order_z_score,

        -- Complex FIRST_VALUE with nested ordering
        FIRST_VALUE(
            JSON_BUILD_OBJECT(
                'order_id', o.order_id,
                'amount', o.total_amount,
                'date', o.order_date::TEXT,
                'status', o.status
            )
        ) OVER (
            PARTITION BY o.customer_id
            ORDER BY (
                CASE
                    WHEN o.status = 'completed' THEN o.total_amount
                    ELSE 0
                END
            ) DESC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) as customer_largest_order

    FROM orders o
    WHERE o.order_date >= (CURRENT_DATE - INTERVAL '1 year')
        AND o.customer_id IN (
            SELECT DISTINCT customer_id
            FROM orders
            WHERE order_date >= (CURRENT_DATE - INTERVAL '1 year')
            GROUP BY customer_id
            HAVING COUNT(*) >= 2
        )
),
customer_behavior_metrics AS (
    SELECT
        customer_id,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_spent,
        AVG(total_amount) as avg_order_value,

        -- Complex aggregation with nested JSON operations
        JSON_BUILD_OBJECT(
            'purchase_patterns', JSON_BUILD_OBJECT(
                'first_orders', COUNT(CASE WHEN purchase_pattern = 'first_order' THEN 1 END),
                'frequent_purchases', COUNT(CASE WHEN purchase_pattern = 'frequent_buyer' THEN 1 END),
                'regular_purchases', COUNT(CASE WHEN purchase_pattern = 'regular_buyer' THEN 1 END),
                'irregular_purchases', COUNT(CASE WHEN purchase_pattern = 'irregular_buyer' THEN 1 END)
            ),
            'spending_analysis', JSON_BUILD_OBJECT(
                'total_amount', SUM(total_amount),
                'avg_amount', ROUND(AVG(total_amount), 2),
                'max_amount', MAX(total_amount),
                'min_amount', MIN(total_amount),
                'stddev_amount', ROUND(STDDEV(total_amount), 2)
            ),
            'order_performance', JSON_BUILD_OBJECT(
                'top_monthly_ranks', COUNT(CASE WHEN monthly_order_rank <= 5 THEN 1 END),
                'avg_z_score', ROUND(AVG(order_z_score), 3),
                'extreme_orders', COUNT(CASE WHEN ABS(order_z_score) > 2 THEN 1 END)
            ),
            'largest_order_info', MAX(customer_largest_order)
        ) as behavior_metrics,

        -- Complex string aggregation with conditional logic
        STRING_AGG(
            CASE
                WHEN monthly_order_rank <= 3
                THEN CONCAT(
                    'Rank ', monthly_order_rank,
                    ' in ', TO_CHAR(order_date, 'Mon YYYY'),
                    ' ($', total_amount, ')'
                )
            END,
            ' | '
            ORDER BY order_date DESC
        ) as top_monthly_performances

    FROM order_analytics
    GROUP BY customer_id
)
SELECT
    cbm.customer_id,
    cbm.total_orders,
    ROUND(cbm.total_spent, 2) as total_spent,
    ROUND(cbm.avg_order_value, 2) as avg_order_value,

    -- Extract nested behavior metrics
    (cbm.behavior_metrics->'purchase_patterns'->>'frequent_purchases')::INTEGER as frequent_purchase_count,
    (cbm.behavior_metrics->'spending_analysis'->>'stddev_amount')::DECIMAL as spending_volatility,
    (cbm.behavior_metrics->'order_performance'->>'avg_z_score')::DECIMAL as avg_z_score,
    (cbm.behavior_metrics->'largest_order_info'->>'amount')::DECIMAL as largest_order_amount,
    (cbm.behavior_metrics->'largest_order_info'->>'date')::DATE as largest_order_date,

    cbm.top_monthly_performances,

    -- Final complex classification with multiple nested conditions
    CASE
        WHEN (cbm.behavior_metrics->'order_performance'->>'top_monthly_ranks')::INTEGER >= 3
            AND (cbm.behavior_metrics->'purchase_patterns'->>'frequent_purchases')::INTEGER >= 2
            AND cbm.total_spent >= 1000
        THEN 'vip_frequent_high_value'
        WHEN (cbm.behavior_metrics->'spending_analysis'->>'stddev_amount')::DECIMAL > cbm.avg_order_value * 0.5
            AND (cbm.behavior_metrics->'order_performance'->>'extreme_orders')::INTEGER > 0
        THEN 'high_variance_spender'
        WHEN cbm.total_orders >= 5
            AND (cbm.behavior_metrics->'purchase_patterns'->>'regular_purchases')::INTEGER >= 2
        THEN 'loyal_regular_customer'
        WHEN (cbm.behavior_metrics->'largest_order_info'->>'amount')::DECIMAL > cbm.avg_order_value * 3
        THEN 'occasional_big_spender'
        ELSE 'standard_customer'
    END as customer_segment

FROM customer_behavior_metrics cbm
WHERE cbm.total_orders >= 2
ORDER BY cbm.total_spent DESC, cbm.total_orders DESC;

-- Section 4: Ultra-Complex Nested Query Challenge
-- The ultimate test of text object navigation with maximum nesting depth
WITH RECURSIVE category_hierarchy AS (
    -- Base case: root categories
    SELECT
        category_id,
        name,
        parent_id,
        0 as level,
        ARRAY[category_id] as path,
        name as full_path
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive case: child categories
    SELECT
        c.category_id,
        c.name,
        c.parent_id,
        ch.level + 1,
        ch.path || c.category_id,
        ch.full_path || ' > ' || c.name
    FROM categories c
    JOIN category_hierarchy ch ON c.parent_id = ch.category_id
    WHERE ch.level < 5  -- Prevent infinite recursion
),
product_category_analytics AS (
    SELECT
        ch.category_id,
        ch.name as category_name,
        ch.level as category_level,
        ch.full_path as category_path,

        -- Extremely nested aggregation with multiple subqueries
        (
            SELECT JSON_BUILD_OBJECT(
                'product_count', COUNT(p.product_id),
                'active_products', COUNT(CASE WHEN p.is_active THEN 1 END),
                'avg_price', ROUND(
                    AVG(
                        CASE
                            WHEN p.is_active AND p.price > 0
                            THEN p.price
                        END
                    ),
                    2
                ),
                'price_range', JSON_BUILD_OBJECT(
                    'min', MIN(
                        CASE
                            WHEN p.is_active AND p.price > 0
                            THEN p.price
                        END
                    ),
                    'max', MAX(
                        CASE
                            WHEN p.is_active AND p.price > 0
                            THEN p.price
                        END
                    ),
                    'quartiles', JSON_BUILD_ARRAY(
                        PERCENTILE_CONT(0.25) WITHIN GROUP (
                            ORDER BY CASE
                                WHEN p.is_active AND p.price > 0
                                THEN p.price
                            END
                        ),
                        PERCENTILE_CONT(0.5) WITHIN GROUP (
                            ORDER BY CASE
                                WHEN p.is_active AND p.price > 0
                                THEN p.price
                            END
                        ),
                        PERCENTILE_CONT(0.75) WITHIN GROUP (
                            ORDER BY CASE
                                WHEN p.is_active AND p.price > 0
                                THEN p.price
                            END
                        )
                    )
                ),
                'sales_performance', JSON_BUILD_OBJECT(
                    'total_revenue', COALESCE(
                        (
                            SELECT SUM(od.quantity * od.unit_price)
                            FROM order_details od
                            JOIN orders o ON od.order_id = o.order_id
                            WHERE od.product_id = p.product_id
                                AND o.status IN ('completed', 'shipped')
                                AND o.order_date >= (CURRENT_DATE - INTERVAL '1 year')
                        ),
                        0
                    ),
                    'total_units_sold', COALESCE(
                        (
                            SELECT SUM(od.quantity)
                            FROM order_details od
                            JOIN orders o ON od.order_id = o.order_id
                            WHERE od.product_id = p.product_id
                                AND o.status IN ('completed', 'shipped')
                                AND o.order_date >= (CURRENT_DATE - INTERVAL '1 year')
                        ),
                        0
                    ),
                    'unique_customers', COALESCE(
                        (
                            SELECT COUNT(DISTINCT o.customer_id)
                            FROM order_details od
                            JOIN orders o ON od.order_id = o.order_id
                            WHERE od.product_id = p.product_id
                                AND o.status IN ('completed', 'shipped')
                                AND o.order_date >= (CURRENT_DATE - INTERVAL '1 year')
                        ),
                        0
                    )
                ),
                'top_products', (
                    SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', sq.product_id,
                            'name', sq.name,
                            'revenue', sq.revenue,
                            'units_sold', sq.units_sold
                        )
                        ORDER BY sq.revenue DESC
                    )
                    FROM (
                        SELECT
                            p2.product_id,
                            p2.name,
                            COALESCE(
                                (
                                    SELECT SUM(od.quantity * od.unit_price)
                                    FROM order_details od
                                    JOIN orders o ON od.order_id = o.order_id
                                    WHERE od.product_id = p2.product_id
                                        AND o.status IN ('completed', 'shipped')
                                        AND o.order_date >= (CURRENT_DATE - INTERVAL '1 year')
                                ),
                                0
                            ) as revenue,
                            COALESCE(
                                (
                                    SELECT SUM(od.quantity)
                                    FROM order_details od
                                    JOIN orders o ON od.order_id = o.order_id
                                    WHERE od.product_id = p2.product_id
                                        AND o.status IN ('completed', 'shipped')
                                        AND o.order_date >= (CURRENT_DATE - INTERVAL '1 year')
                                ),
                                0
                            ) as units_sold
                        FROM products p2
                        WHERE p2.category_id = ch.category_id
                            AND p2.is_active = true
                        ORDER BY revenue DESC
                        LIMIT 3
                    ) sq
                )
            )
            FROM products p
            WHERE p.category_id = ch.category_id
        ) as category_analytics

    FROM category_hierarchy ch
),
final_category_report AS (
    SELECT
        pca.category_id,
        pca.category_name,
        pca.category_level,
        pca.category_path,

        -- Extract deeply nested analytics
        (pca.category_analytics->>'product_count')::INTEGER as total_products,
        (pca.category_analytics->>'active_products')::INTEGER as active_products,
        (pca.category_analytics->>'avg_price')::DECIMAL as avg_price,
        (pca.category_analytics->'price_range'->>'min')::DECIMAL as min_price,
        (pca.category_analytics->'price_range'->>'max')::DECIMAL as max_price,
        (pca.category_analytics->'price_range'->'quartiles'->0)::DECIMAL as price_q1,
        (pca.category_analytics->'price_range'->'quartiles'->1)::DECIMAL as price_median,
        (pca.category_analytics->'price_range'->'quartiles'->2)::DECIMAL as price_q3,
        (pca.category_analytics->'sales_performance'->>'total_revenue')::DECIMAL as annual_revenue,
        (pca.category_analytics->'sales_performance'->>'total_units_sold')::INTEGER as annual_units_sold,
        (pca.category_analytics->'sales_performance'->>'unique_customers')::INTEGER as unique_customers,
        JSON_ARRAY_LENGTH(pca.category_analytics->'top_products') as top_product_count,

        -- Ultra-complex conditional logic with nested operations
        CASE
            WHEN (pca.category_analytics->'sales_performance'->>'total_revenue')::DECIMAL > (
                SELECT AVG((category_analytics->'sales_performance'->>'total_revenue')::DECIMAL)
                FROM product_category_analytics
                WHERE category_level = pca.category_level
                    AND (category_analytics->'sales_performance'->>'total_revenue')::DECIMAL > 0
            ) * 1.5
            AND (pca.category_analytics->>'active_products')::INTEGER >= 5
            THEN 'high_performing_category'

            WHEN (pca.category_analytics->'sales_performance'->>'unique_customers')::INTEGER > (
                SELECT PERCENTILE_CONT(0.75) WITHIN GROUP (
                    ORDER BY (category_analytics->'sales_performance'->>'unique_customers')::INTEGER
                )
                FROM product_category_analytics
                WHERE category_level = pca.category_level
            )
            AND (pca.category_analytics->>'avg_price')::DECIMAL BETWEEN 10 AND 1000
            THEN 'broad_appeal_category'

            WHEN (pca.category_analytics->'price_range'->'quartiles'->2)::DECIMAL > (
                pca.category_analytics->'price_range'->'quartiles'->0)::DECIMAL * 3
            AND (pca.category_analytics->>'product_count')::INTEGER >= 10
            THEN 'diverse_pricing_category'

            WHEN pca.category_level >= 2
            AND (pca.category_analytics->'sales_performance'->>'total_revenue')::DECIMAL > 0
            AND (pca.category_analytics->>'active_products')::INTEGER < 5
            THEN 'niche_specialized_category'

            ELSE 'standard_category'
        END as category_classification,

        -- Final nested ranking calculation
        DENSE_RANK() OVER (
            PARTITION BY pca.category_level
            ORDER BY (
                (pca.category_analytics->'sales_performance'->>'total_revenue')::DECIMAL * 0.6 +
                (pca.category_analytics->'sales_performance'->>'unique_customers')::INTEGER * 10 * 0.3 +
                (pca.category_analytics->>'active_products')::INTEGER * 100 * 0.1
            ) DESC
        ) as performance_rank_in_level

    FROM product_category_analytics pca
    WHERE (pca.category_analytics->>'product_count')::INTEGER > 0
)
SELECT * FROM final_category_report
WHERE category_level <= 3
ORDER BY category_level, performance_rank_in_level, annual_revenue DESC;