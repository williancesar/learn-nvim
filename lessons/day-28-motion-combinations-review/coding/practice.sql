-- PostgreSQL Practice: Comprehensive SQL Review
-- Day 28: Final comprehensive review combining all learned motions and techniques
-- This file combines all previous lessons for complete Vim mastery practice

-- ==========================================
-- COMPREHENSIVE REVIEW SECTION 1: E-COMMERCE DATABASE
-- ==========================================
-- Practice all motion combinations, text objects, and navigation techniques

-- Schema creation with bracket matching practice
CREATE SCHEMA ecommerce_analytics;
SET search_path TO ecommerce_analytics;

-- Table creation with various SQL structures for complete practice
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_uuid UUID DEFAULT gen_random_uuid(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    customer_status VARCHAR(20) DEFAULT 'active' CHECK (customer_status IN ('active', 'inactive', 'suspended', 'deleted')),
    customer_type VARCHAR(20) DEFAULT 'retail' CHECK (customer_type IN ('retail', 'wholesale', 'vip', 'enterprise')),
    loyalty_tier VARCHAR(20) DEFAULT 'bronze' CHECK (loyalty_tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    marketing_opt_in BOOLEAN DEFAULT false,
    newsletter_subscription BOOLEAN DEFAULT false,
    preferred_language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_by INTEGER DEFAULT 1,
    updated_by INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Complex index creation for search practice
CREATE INDEX idx_customers_email_active ON customers(email) WHERE customer_status = 'active';
CREATE INDEX idx_customers_registration_tier ON customers(registration_date, loyalty_tier);
CREATE INDEX idx_customers_status_type ON customers(customer_status, customer_type);

-- Product catalog with nested JSON and arrays
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_uuid UUID DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_description TEXT,
    short_description VARCHAR(500),
    category_id INTEGER,
    subcategory_id INTEGER,
    brand_id INTEGER,
    supplier_id INTEGER,

    -- Pricing information
    cost_price DECIMAL(10,2) NOT NULL CHECK (cost_price >= 0),
    retail_price DECIMAL(10,2) NOT NULL CHECK (retail_price >= 0),
    wholesale_price DECIMAL(10,2) CHECK (wholesale_price >= 0),
    discount_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),

    -- Physical attributes
    weight_kg DECIMAL(8,3),
    dimensions_cm VARCHAR(50), -- Format: "LxWxH"
    color VARCHAR(50),
    size VARCHAR(20),
    material VARCHAR(100),

    -- Inventory tracking
    current_stock INTEGER DEFAULT 0 CHECK (current_stock >= 0),
    reserved_stock INTEGER DEFAULT 0 CHECK (reserved_stock >= 0),
    reorder_level INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 1000,

    -- Product attributes as JSON
    attributes JSONB DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],

    -- Status and flags
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_on_sale BOOLEAN DEFAULT false,
    requires_shipping BOOLEAN DEFAULT true,
    is_digital BOOLEAN DEFAULT false,

    -- SEO and marketing
    seo_title VARCHAR(200),
    seo_description TEXT,
    meta_keywords TEXT[],

    -- Audit fields
    created_by INTEGER DEFAULT 1,
    updated_by INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data with various formats for text object practice
INSERT INTO products (sku, product_name, cost_price, retail_price, attributes, tags, specifications) VALUES
('LAPTOP-GAMING-001', 'High-Performance Gaming Laptop', 1200.00, 1999.99,
 '{"brand": "TechMaster", "model": "GamePro X1", "warranty_months": 24}',
 ARRAY['gaming', 'laptop', 'high-performance', 'rgb'],
 '{"cpu": "Intel i7-12700H", "gpu": "RTX 4070", "ram": "32GB DDR5", "storage": "1TB NVMe SSD"}'),

('MONITOR-4K-001', '27-inch 4K Gaming Monitor', 300.00, 599.99,
 '{"brand": "DisplayTech", "model": "UltraView 27", "warranty_months": 36}',
 ARRAY['monitor', '4k', 'gaming', '144hz'],
 '{"resolution": "3840x2160", "refresh_rate": "144Hz", "panel_type": "IPS", "response_time": "1ms"}'),

('KEYBOARD-MECH-001', 'RGB Mechanical Gaming Keyboard', 45.00, 129.99,
 '{"brand": "KeyMaster", "model": "MechPro RGB", "warranty_months": 12}',
 ARRAY['keyboard', 'mechanical', 'rgb', 'gaming'],
 '{"switch_type": "Cherry MX Red", "layout": "Full Size", "backlight": "RGB", "connectivity": "USB-C"}');

-- ==========================================
-- SECTION 2: COMPLEX ANALYTICS QUERIES
-- ==========================================
-- Practice paragraph navigation, CTE structures, and advanced SQL

-- Customer Lifetime Value Analysis with extensive CTEs
WITH customer_order_history AS (
    -- First CTE: Basic order aggregation
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        c.email,
        c.registration_date,
        c.loyalty_tier,
        c.customer_type,
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(o.total_amount) as total_spent,
        AVG(o.total_amount) as avg_order_value,
        MIN(o.order_date) as first_order_date,
        MAX(o.order_date) as last_order_date,

        -- Calculate customer lifespan and activity metrics
        EXTRACT(DAYS FROM (MAX(o.order_date) - MIN(o.order_date))) as customer_lifespan_days,
        EXTRACT(DAYS FROM (CURRENT_DATE - MAX(o.order_date))) as days_since_last_order,
        COUNT(DISTINCT DATE_TRUNC('month', o.order_date)) as active_months,

        -- Revenue per day calculation
        CASE
            WHEN EXTRACT(DAYS FROM (MAX(o.order_date) - MIN(o.order_date))) > 0
            THEN SUM(o.total_amount) / EXTRACT(DAYS FROM (MAX(o.order_date) - MIN(o.order_date)))
            ELSE SUM(o.total_amount)
        END as daily_revenue_rate

    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
        AND o.order_status IN ('completed', 'shipped', 'delivered')
    WHERE c.customer_status = 'active'
        AND c.registration_date >= '2022-01-01'
    GROUP BY c.customer_id, c.first_name, c.last_name, c.email,
             c.registration_date, c.loyalty_tier, c.customer_type
),

customer_behavioral_segments AS (
    -- Second CTE: RFM Analysis and behavioral segmentation
    SELECT
        *,
        -- Recency Score (1-5, where 5 is most recent)
        CASE
            WHEN days_since_last_order IS NULL THEN 0
            WHEN days_since_last_order <= 30 THEN 5
            WHEN days_since_last_order <= 90 THEN 4
            WHEN days_since_last_order <= 180 THEN 3
            WHEN days_since_last_order <= 365 THEN 2
            ELSE 1
        END as recency_score,

        -- Frequency Score (1-5, where 5 is highest frequency)
        CASE
            WHEN total_orders >= 20 THEN 5
            WHEN total_orders >= 10 THEN 4
            WHEN total_orders >= 5 THEN 3
            WHEN total_orders >= 2 THEN 2
            WHEN total_orders >= 1 THEN 1
            ELSE 0
        END as frequency_score,

        -- Monetary Score (1-5, where 5 is highest value)
        CASE
            WHEN total_spent >= 10000 THEN 5
            WHEN total_spent >= 5000 THEN 4
            WHEN total_spent >= 2000 THEN 3
            WHEN total_spent >= 500 THEN 2
            WHEN total_spent >= 100 THEN 1
            ELSE 0
        END as monetary_score,

        -- Customer lifecycle stage
        CASE
            WHEN total_orders = 0 THEN 'prospect'
            WHEN total_orders = 1 AND days_since_last_order <= 90 THEN 'new'
            WHEN total_orders = 1 AND days_since_last_order > 90 THEN 'one_time'
            WHEN total_orders BETWEEN 2 AND 5 AND days_since_last_order <= 90 THEN 'developing'
            WHEN total_orders BETWEEN 2 AND 5 AND days_since_last_order > 90 THEN 'declining'
            WHEN total_orders > 5 AND days_since_last_order <= 90 THEN 'loyal'
            WHEN total_orders > 5 AND days_since_last_order > 90 THEN 'at_risk'
            ELSE 'undefined'
        END as lifecycle_stage

    FROM customer_order_history
),

customer_product_preferences AS (
    -- Third CTE: Product category preferences and buying patterns
    SELECT
        coh.customer_id,

        -- Top product categories by spending
        STRING_AGG(
            DISTINCT cat.category_name,
            ', '
            ORDER BY cat.category_name
        ) FILTER (WHERE cat_spending_rank <= 3) as top_3_categories,

        -- Favorite brand
        (SELECT p.attributes->>'brand'
         FROM order_details od
         JOIN products p ON od.product_id = p.product_id
         JOIN orders o ON od.order_id = o.order_id
         WHERE o.customer_id = coh.customer_id
           AND o.order_status IN ('completed', 'shipped', 'delivered')
         GROUP BY p.attributes->>'brand'
         ORDER BY SUM(od.quantity * od.unit_price) DESC
         LIMIT 1) as favorite_brand,

        -- Average order frequency (days between orders)
        CASE
            WHEN coh.total_orders > 1
            THEN coh.customer_lifespan_days / (coh.total_orders - 1)
            ELSE NULL
        END as avg_days_between_orders,

        -- Seasonal buying pattern
        (SELECT mode() WITHIN GROUP (ORDER BY EXTRACT(QUARTER FROM o.order_date))
         FROM orders o
         WHERE o.customer_id = coh.customer_id
           AND o.order_status IN ('completed', 'shipped', 'delivered')) as preferred_quarter

    FROM customer_order_history coh
    LEFT JOIN (
        SELECT
            o.customer_id,
            cat.category_name,
            SUM(od.quantity * od.unit_price) as category_spending,
            RANK() OVER (PARTITION BY o.customer_id ORDER BY SUM(od.quantity * od.unit_price) DESC) as cat_spending_rank
        FROM orders o
        JOIN order_details od ON o.order_id = od.order_id
        JOIN products p ON od.product_id = p.product_id
        JOIN categories cat ON p.category_id = cat.category_id
        WHERE o.order_status IN ('completed', 'shipped', 'delivered')
        GROUP BY o.customer_id, cat.category_name
    ) cat_prefs ON coh.customer_id = cat_prefs.customer_id
    GROUP BY coh.customer_id, coh.total_orders, coh.customer_lifespan_days
),

final_customer_scoring AS (
    -- Final CTE: Combine all metrics and create comprehensive scoring
    SELECT
        cbs.*,
        cpp.top_3_categories,
        cpp.favorite_brand,
        cpp.avg_days_between_orders,
        cpp.preferred_quarter,

        -- Combined RFM Score
        (cbs.recency_score + cbs.frequency_score + cbs.monetary_score) as total_rfm_score,

        -- Customer value tier based on multiple factors
        CASE
            WHEN (cbs.recency_score + cbs.frequency_score + cbs.monetary_score) >= 13 THEN 'champion'
            WHEN (cbs.recency_score >= 4 AND cbs.frequency_score >= 4) THEN 'loyal_customer'
            WHEN (cbs.recency_score >= 4 AND cbs.monetary_score >= 4) THEN 'potential_loyalist'
            WHEN (cbs.recency_score >= 4 AND cbs.frequency_score = 1) THEN 'new_customer'
            WHEN (cbs.recency_score >= 3 AND cbs.monetary_score >= 3) THEN 'promising'
            WHEN (cbs.recency_score <= 2 AND cbs.frequency_score >= 3) THEN 'at_risk'
            WHEN (cbs.recency_score <= 2 AND cbs.frequency_score <= 2 AND cbs.monetary_score >= 3) THEN 'cant_lose_them'
            WHEN (cbs.recency_score <= 2) THEN 'hibernating'
            ELSE 'others'
        END as customer_segment,

        -- Predicted future value (simple model)
        CASE
            WHEN cbs.daily_revenue_rate > 0 AND cpp.avg_days_between_orders > 0
            THEN cbs.daily_revenue_rate * 365 / (cpp.avg_days_between_orders + 1) *
                 CASE cbs.lifecycle_stage
                     WHEN 'loyal' THEN 1.2
                     WHEN 'developing' THEN 1.1
                     WHEN 'new' THEN 1.0
                     WHEN 'declining' THEN 0.8
                     WHEN 'at_risk' THEN 0.5
                     ELSE 0.7
                 END
            ELSE cbs.total_spent * 0.1  -- Conservative estimate for others
        END as predicted_annual_value

    FROM customer_behavioral_segments cbs
    LEFT JOIN customer_product_preferences cpp ON cbs.customer_id = cpp.customer_id
)

-- Main query: Comprehensive customer analysis report
SELECT
    customer_id,
    first_name || ' ' || last_name as customer_name,
    email,
    loyalty_tier,
    customer_type,
    total_orders,
    ROUND(total_spent, 2) as total_spent,
    ROUND(avg_order_value, 2) as avg_order_value,
    days_since_last_order,
    lifecycle_stage,
    recency_score,
    frequency_score,
    monetary_score,
    total_rfm_score,
    customer_segment,
    top_3_categories,
    favorite_brand,
    ROUND(avg_days_between_orders, 1) as avg_days_between_orders,
    preferred_quarter,
    ROUND(predicted_annual_value, 2) as predicted_annual_value,

    -- Action recommendations based on segment
    CASE customer_segment
        WHEN 'champion' THEN 'Reward with VIP treatment, exclusive offers, and loyalty programs'
        WHEN 'loyal_customer' THEN 'Upsell premium products, cross-sell complementary items'
        WHEN 'potential_loyalist' THEN 'Engage with loyalty programs, personalized recommendations'
        WHEN 'new_customer' THEN 'Onboard with welcome series, encourage second purchase'
        WHEN 'promising' THEN 'Nurture with targeted campaigns, value-based offers'
        WHEN 'at_risk' THEN 'Win-back campaign, satisfaction survey, special discounts'
        WHEN 'cant_lose_them' THEN 'Aggressive retention, personal outreach, exclusive deals'
        WHEN 'hibernating' THEN 'Re-engagement campaign, brand awareness, new product alerts'
        ELSE 'Standard marketing campaigns, monitor behavior'
    END as recommended_action

FROM final_customer_scoring
WHERE total_orders > 0  -- Focus on customers who have made at least one purchase
ORDER BY predicted_annual_value DESC, total_rfm_score DESC, total_spent DESC
LIMIT 100;


-- ==========================================
-- SECTION 3: INVENTORY OPTIMIZATION ANALYSIS
-- ==========================================
-- Practice with complex aggregations, window functions, and nested queries

-- Advanced inventory analysis with demand forecasting
WITH daily_sales_patterns AS (
    -- Analyze daily sales patterns for demand forecasting
    SELECT
        p.product_id,
        p.sku,
        p.product_name,
        DATE(o.order_date) as sale_date,
        EXTRACT(DOW FROM o.order_date) as day_of_week,
        EXTRACT(MONTH FROM o.order_date) as sale_month,
        EXTRACT(QUARTER FROM o.order_date) as sale_quarter,
        SUM(od.quantity) as daily_quantity_sold,
        SUM(od.quantity * od.unit_price) as daily_revenue,
        COUNT(DISTINCT o.order_id) as daily_order_count
    FROM products p
    JOIN order_details od ON p.product_id = od.product_id
    JOIN orders o ON od.order_id = o.order_id
    WHERE o.order_status IN ('completed', 'shipped', 'delivered')
        AND o.order_date >= CURRENT_DATE - INTERVAL '365 days'
        AND p.is_active = true
    GROUP BY p.product_id, p.sku, p.product_name, DATE(o.order_date)
),

aggregated_demand_metrics AS (
    -- Calculate comprehensive demand metrics
    SELECT
        product_id,
        sku,
        product_name,

        -- Basic demand statistics
        COUNT(*) as total_sale_days,
        SUM(daily_quantity_sold) as total_quantity_sold,
        AVG(daily_quantity_sold) as avg_daily_quantity,
        STDDEV(daily_quantity_sold) as quantity_stddev,
        MIN(daily_quantity_sold) as min_daily_quantity,
        MAX(daily_quantity_sold) as max_daily_quantity,

        -- Revenue metrics
        SUM(daily_revenue) as total_revenue,
        AVG(daily_revenue) as avg_daily_revenue,

        -- Seasonality analysis
        AVG(CASE WHEN sale_quarter = 1 THEN daily_quantity_sold END) as q1_avg_demand,
        AVG(CASE WHEN sale_quarter = 2 THEN daily_quantity_sold END) as q2_avg_demand,
        AVG(CASE WHEN sale_quarter = 3 THEN daily_quantity_sold END) as q3_avg_demand,
        AVG(CASE WHEN sale_quarter = 4 THEN daily_quantity_sold END) as q4_avg_demand,

        -- Day of week patterns
        AVG(CASE WHEN day_of_week = 1 THEN daily_quantity_sold END) as monday_avg,
        AVG(CASE WHEN day_of_week = 2 THEN daily_quantity_sold END) as tuesday_avg,
        AVG(CASE WHEN day_of_week = 3 THEN daily_quantity_sold END) as wednesday_avg,
        AVG(CASE WHEN day_of_week = 4 THEN daily_quantity_sold END) as thursday_avg,
        AVG(CASE WHEN day_of_week = 5 THEN daily_quantity_sold END) as friday_avg,
        AVG(CASE WHEN day_of_week = 6 THEN daily_quantity_sold END) as saturday_avg,
        AVG(CASE WHEN day_of_week = 0 THEN daily_quantity_sold END) as sunday_avg,

        -- Trend analysis using linear regression approach
        REGR_SLOPE(daily_quantity_sold, EXTRACT(EPOCH FROM sale_date)) as demand_trend_slope,
        CORR(daily_quantity_sold, EXTRACT(EPOCH FROM sale_date)) as demand_trend_correlation

    FROM daily_sales_patterns
    GROUP BY product_id, sku, product_name
),

inventory_status_analysis AS (
    -- Current inventory status and requirements
    SELECT
        p.product_id,
        p.sku,
        p.product_name,
        p.current_stock,
        p.reserved_stock,
        p.current_stock - p.reserved_stock as available_stock,
        p.reorder_level,
        p.max_stock_level,

        -- Supplier information
        s.supplier_name,
        s.lead_time_days,
        s.minimum_order_quantity,
        p.cost_price,

        -- Calculate days of stock remaining
        CASE
            WHEN adm.avg_daily_quantity > 0
            THEN (p.current_stock - p.reserved_stock) / adm.avg_daily_quantity
            ELSE 999
        END as days_of_stock_remaining,

        -- Safety stock calculation (based on standard deviation and lead time)
        CASE
            WHEN adm.quantity_stddev > 0 AND s.lead_time_days > 0
            THEN CEIL(adm.quantity_stddev * SQRT(s.lead_time_days) * 1.65) -- 95% service level
            ELSE CEIL(adm.avg_daily_quantity * s.lead_time_days * 0.5) -- Conservative fallback
        END as recommended_safety_stock,

        -- Reorder point calculation
        CASE
            WHEN adm.avg_daily_quantity > 0 AND s.lead_time_days > 0
            THEN CEIL((adm.avg_daily_quantity * s.lead_time_days) +
                     (adm.quantity_stddev * SQRT(s.lead_time_days) * 1.65))
            ELSE p.reorder_level
        END as calculated_reorder_point,

        -- Economic Order Quantity (EOQ) estimation
        CASE
            WHEN adm.avg_daily_quantity > 0 AND p.cost_price > 0
            THEN CEIL(SQRT((2 * adm.avg_daily_quantity * 365 * 50) / (p.cost_price * 0.25))) -- Assuming $50 order cost, 25% holding cost
            ELSE s.minimum_order_quantity
        END as economic_order_quantity

    FROM products p
    LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
    LEFT JOIN aggregated_demand_metrics adm ON p.product_id = adm.product_id
    WHERE p.is_active = true
),

reorder_recommendations AS (
    -- Generate specific reorder recommendations
    SELECT
        *,
        -- Determine reorder urgency
        CASE
            WHEN available_stock <= 0 THEN 'EMERGENCY - OUT OF STOCK'
            WHEN available_stock <= calculated_reorder_point * 0.5 THEN 'URGENT - IMMEDIATE REORDER'
            WHEN available_stock <= calculated_reorder_point THEN 'REORDER NOW'
            WHEN days_of_stock_remaining <= lead_time_days THEN 'REORDER SOON'
            WHEN days_of_stock_remaining <= lead_time_days * 1.5 THEN 'MONITOR CLOSELY'
            ELSE 'ADEQUATE STOCK'
        END as reorder_status,

        -- Calculate suggested order quantity
        GREATEST(
            minimum_order_quantity,
            economic_order_quantity,
            calculated_reorder_point + recommended_safety_stock - available_stock
        ) as suggested_order_quantity,

        -- Financial impact calculations
        available_stock * cost_price as current_inventory_value,
        CASE
            WHEN available_stock <= calculated_reorder_point
            THEN GREATEST(minimum_order_quantity, economic_order_quantity) * cost_price
            ELSE 0
        END as recommended_order_value,

        -- Risk assessment
        CASE
            WHEN days_of_stock_remaining <= lead_time_days * 0.5 THEN 'HIGH RISK'
            WHEN days_of_stock_remaining <= lead_time_days THEN 'MEDIUM RISK'
            WHEN days_of_stock_remaining <= lead_time_days * 2 THEN 'LOW RISK'
            ELSE 'NO RISK'
        END as stockout_risk

    FROM inventory_status_analysis
)

-- Final inventory optimization report
SELECT
    rr.sku,
    rr.product_name,
    rr.supplier_name,
    rr.current_stock,
    rr.available_stock,
    rr.reorder_level as current_reorder_level,
    rr.calculated_reorder_point as recommended_reorder_level,
    rr.recommended_safety_stock,
    ROUND(rr.days_of_stock_remaining, 1) as days_stock_remaining,
    rr.lead_time_days,
    rr.reorder_status,
    rr.stockout_risk,
    rr.suggested_order_quantity,
    rr.minimum_order_quantity,
    rr.economic_order_quantity,
    ROUND(rr.current_inventory_value, 2) as current_inventory_value,
    ROUND(rr.recommended_order_value, 2) as recommended_order_value,

    -- Include demand metrics for context
    ROUND(adm.avg_daily_quantity, 2) as avg_daily_demand,
    ROUND(adm.quantity_stddev, 2) as demand_volatility,
    adm.total_quantity_sold as annual_quantity_sold,
    ROUND(adm.total_revenue, 2) as annual_revenue,

    -- Seasonality indicators
    CASE
        WHEN adm.q4_avg_demand > adm.avg_daily_quantity * 1.2 THEN 'HOLIDAY_PEAK'
        WHEN adm.q2_avg_demand > adm.avg_daily_quantity * 1.2 THEN 'SPRING_PEAK'
        WHEN adm.q3_avg_demand > adm.avg_daily_quantity * 1.2 THEN 'SUMMER_PEAK'
        ELSE 'STABLE_DEMAND'
    END as seasonality_pattern,

    -- Performance indicators
    CASE
        WHEN adm.demand_trend_slope > 0 AND adm.demand_trend_correlation > 0.3 THEN 'GROWING'
        WHEN adm.demand_trend_slope < 0 AND adm.demand_trend_correlation < -0.3 THEN 'DECLINING'
        ELSE 'STABLE'
    END as demand_trend

FROM reorder_recommendations rr
LEFT JOIN aggregated_demand_metrics adm ON rr.product_id = adm.product_id
WHERE rr.reorder_status IN ('EMERGENCY - OUT OF STOCK', 'URGENT - IMMEDIATE REORDER', 'REORDER NOW', 'REORDER SOON')
ORDER BY
    CASE rr.reorder_status
        WHEN 'EMERGENCY - OUT OF STOCK' THEN 1
        WHEN 'URGENT - IMMEDIATE REORDER' THEN 2
        WHEN 'REORDER NOW' THEN 3
        WHEN 'REORDER SOON' THEN 4
        ELSE 5
    END,
    rr.days_of_stock_remaining ASC,
    adm.total_revenue DESC;

-- ==========================================
-- END OF COMPREHENSIVE REVIEW
-- ==========================================
-- This final section tests all Vim motion skills learned:
-- - Paragraph navigation with { and }
-- - Text objects with i", a", i(, a(, i{, a{
-- - Search patterns with / and ?
-- - Line numbers and :line_number navigation
-- - Marks with ma, mb, 'a, 'b
-- - Visual block operations with Ctrl+V
-- - Indentation with >>, <<, =
-- - Join and format with J, gq, gw
-- - Screen navigation with H, M, L, Ctrl+D, Ctrl+U
-- - Jump history with Ctrl+O, Ctrl+I
-- Congratulations on completing the comprehensive Vim SQL practice!