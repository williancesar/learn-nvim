-- =============================================================================
-- DAY 03: WORD MOTION - SQL Practice File
-- =============================================================================
--
-- LEARNING OBJECTIVES:
-- - Use 'w' to move forward by words
-- - Use 'b' to move backward by words
-- - Use 'e' to move to end of current word
-- - Use 'W', 'B', 'E' for WORD motion (whitespace separated)
-- - Navigate through different identifier naming conventions
-- - Practice word boundaries with special characters and punctuation
--
-- NAMING CONVENTIONS IN THIS FILE:
-- - snake_case_identifiers (most common in SQL)
-- - CamelCaseIdentifiers (sometimes used)
-- - kebab-case-identifiers (in quoted identifiers)
-- - SCREAMING_SNAKE_CASE (constants and legacy)
-- - Mixed.notation.with.dots
-- - Special$Characters&InNames
--
-- PRACTICE TARGETS:
-- - Navigate between different word styles
-- - Jump over punctuation and special characters
-- - Use word motion to edit identifiers efficiently
-- =============================================================================

-- Database schema with mixed naming conventions for word motion practice
CREATE DATABASE analytics_warehouse_2024;
USE analytics_warehouse_2024;

-- Table with snake_case, camelCase, and special characters
CREATE TABLE user_behavior_analytics (
    userId BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(128) NOT NULL,
    userAgent TEXT,
    ip_address INET,
    page_url TEXT,
    referrer_url TEXT,
    time_on_page INTEGER,
    scroll_depth_percentage DECIMAL(5,2),
    click_coordinates JSON,
    device_type ENUM('desktop', 'mobile', 'tablet'),
    browser_name VARCHAR(50),
    operating_system VARCHAR(50),
    screen_resolution VARCHAR(20),
    viewport_size VARCHAR(20),
    session_start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end_time TIMESTAMP NULL,
    is_authenticated BOOLEAN DEFAULT FALSE,
    user_engagement_score DECIMAL(4,2),
    conversion_funnel_stage VARCHAR(30),
    a_b_test_variant VARCHAR(10),
    marketing_campaign_id VARCHAR(50),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_content VARCHAR(100),
    geo_country_code CHAR(2),
    geo_region_code VARCHAR(10),
    geo_city_name VARCHAR(100),
    timezone_offset INTEGER
);

-- Practice word motion with complex identifier names
CREATE TABLE ecommerce_product_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id BIGINT NOT NULL,
    recommended_product_id BIGINT NOT NULL,
    recommendation_algorithm VARCHAR(50) NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0.00 AND 1.00),
    personalization_factors JSON,
    collaborative_filtering_weight DECIMAL(3,2),
    content_based_filtering_weight DECIMAL(3,2),
    popularity_based_weight DECIMAL(3,2),
    contextual_signals JSON,
    real_time_inventory_check BOOLEAN DEFAULT TRUE,
    price_sensitivity_adjustment DECIMAL(3,2),
    seasonal_trend_multiplier DECIMAL(3,2),
    cross_sell_opportunity_score DECIMAL(3,2),
    up_sell_opportunity_score DECIMAL(3,2),
    recommendation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_interaction_feedback VARCHAR(20),
    conversion_tracking_id VARCHAR(100),
    a_b_test_control_group VARCHAR(20),
    machine_learning_model_version VARCHAR(10)
);

-- Table with quoted identifiers and special characters for advanced word motion
CREATE TABLE "social-media-engagement-metrics" (
    "metric-id" SERIAL PRIMARY KEY,
    "platform$name" VARCHAR(50) NOT NULL,
    "user@handle" VARCHAR(100),
    "post#identifier" VARCHAR(200) UNIQUE,
    "engagement&type" VARCHAR(30),
    "likes*count" INTEGER DEFAULT 0,
    "shares+count" INTEGER DEFAULT 0,
    "comments%count" INTEGER DEFAULT 0,
    "reach^metrics" JSON,
    "impression~data" JSON,
    "click-through-rate" DECIMAL(5,4),
    "cost.per.click" DECIMAL(8,4),
    "return_on_ad_spend" DECIMAL(6,2),
    "brand!mention!sentiment" VARCHAR(20),
    "hashtag|performance" JSON,
    "video/watch/time" INTEGER,
    "story_completion_rate" DECIMAL(4,2),
    "swipe_up_actions" INTEGER,
    "profile?visits" INTEGER,
    "website=traffic=from=social" INTEGER
);

-- Complex CTE with mixed naming for word motion practice
WITH monthly_revenue_analysis AS (
    SELECT
        DATE_TRUNC('month', order_created_timestamp) AS reporting_month,
        customer_acquisition_channel,
        product_category_hierarchy,
        SUM(gross_merchandise_value) AS total_gmv,
        SUM(net_revenue_after_discounts) AS net_revenue,
        COUNT(DISTINCT customer_unique_identifier) AS unique_customers,
        COUNT(DISTINCT order_transaction_id) AS total_orders,
        AVG(average_order_value_calculation) AS avg_order_value,
        STDDEV(order_value_standard_deviation) AS order_value_stddev,
        MIN(minimum_order_value_in_period) AS min_order_value,
        MAX(maximum_order_value_in_period) AS max_order_value,
        SUM(CASE WHEN first_time_customer_flag = TRUE THEN 1 ELSE 0 END) AS new_customer_orders,
        SUM(CASE WHEN returning_customer_flag = TRUE THEN 1 ELSE 0 END) AS repeat_customer_orders,
        COUNT(DISTINCT promotional_campaign_identifier) AS campaigns_active,
        SUM(discount_amount_applied_total) AS total_discounts_given
    FROM ecommerce_transactions_fact_table
    WHERE order_status_final IN ('completed', 'shipped', 'delivered')
      AND payment_processing_successful = TRUE
      AND fraud_detection_passed = TRUE
    GROUP BY
        DATE_TRUNC('month', order_created_timestamp),
        customer_acquisition_channel,
        product_category_hierarchy
),
year_over_year_comparison AS (
    SELECT
        mra.*,
        LAG(mra.total_gmv, 12) OVER (
            PARTITION BY mra.customer_acquisition_channel, mra.product_category_hierarchy
            ORDER BY mra.reporting_month
        ) AS previous_year_same_month_gmv,
        LAG(mra.unique_customers, 12) OVER (
            PARTITION BY mra.customer_acquisition_channel, mra.product_category_hierarchy
            ORDER BY mra.reporting_month
        ) AS previous_year_same_month_customers,
        PERCENT_RANK() OVER (
            PARTITION BY DATE_PART('year', mra.reporting_month)
            ORDER BY mra.total_gmv
        ) AS gmv_percentile_rank_within_year
    FROM monthly_revenue_analysis mra
),
cohort_retention_analysis AS (
    SELECT
        customer_first_purchase_month,
        months_since_first_purchase,
        COUNT(DISTINCT customer_unique_identifier) AS customers_in_cohort,
        SUM(monthly_purchase_frequency) AS total_purchases_in_period,
        AVG(customer_lifetime_value_estimated) AS avg_estimated_clv,
        AVG(customer_satisfaction_score) AS avg_satisfaction_score,
        COUNT(DISTINCT CASE WHEN churn_probability_score < 0.3 THEN customer_unique_identifier END) AS low_churn_risk_customers,
        COUNT(DISTINCT CASE WHEN churn_probability_score >= 0.7 THEN customer_unique_identifier END) AS high_churn_risk_customers
    FROM customer_behavior_cohort_table
    GROUP BY customer_first_purchase_month, months_since_first_purchase
)
SELECT
    yoy.reporting_month,
    yoy.customer_acquisition_channel,
    yoy.product_category_hierarchy,
    yoy.total_gmv,
    yoy.previous_year_same_month_gmv,
    CASE
        WHEN yoy.previous_year_same_month_gmv IS NOT NULL AND yoy.previous_year_same_month_gmv > 0
        THEN ((yoy.total_gmv - yoy.previous_year_same_month_gmv) / yoy.previous_year_same_month_gmv) * 100
        ELSE NULL
    END AS year_over_year_growth_percentage,
    yoy.unique_customers,
    yoy.total_orders,
    yoy.avg_order_value,
    yoy.gmv_percentile_rank_within_year,
    cra.avg_estimated_clv,
    cra.low_churn_risk_customers,
    cra.high_churn_risk_customers
FROM year_over_year_comparison yoy
LEFT JOIN cohort_retention_analysis cra ON DATE_TRUNC('month', yoy.reporting_month) = cra.customer_first_purchase_month
WHERE yoy.reporting_month >= CURRENT_DATE - INTERVAL '24 months'
ORDER BY yoy.reporting_month DESC, yoy.total_gmv DESC;

-- Stored procedure with extremely long parameter names for word motion practice
CREATE OR REPLACE FUNCTION calculate_customer_lifetime_value_with_advanced_segmentation(
    customer_demographic_profile_input JSON,
    purchase_history_time_series_data JSON,
    marketing_touchpoint_attribution_weights JSON,
    seasonal_adjustment_factors JSON,
    competitive_landscape_pricing_data JSON,
    macro_economic_indicators JSON,
    product_recommendation_engine_scores JSON,
    customer_service_interaction_sentiment JSON,
    social_media_engagement_metrics JSON,
    mobile_app_usage_analytics JSON,
    email_marketing_response_rates JSON,
    loyalty_program_participation_data JSON,
    payment_method_preferences JSON,
    geographic_location_context JSON,
    device_and_browser_fingerprint JSON
) RETURNS TABLE (
    customer_id BIGINT,
    predicted_lifetime_value DECIMAL(12,2),
    confidence_interval_lower_bound DECIMAL(12,2),
    confidence_interval_upper_bound DECIMAL(12,2),
    segment_classification VARCHAR(50),
    churn_risk_probability DECIMAL(4,3),
    next_purchase_prediction_date DATE,
    recommended_marketing_strategy TEXT,
    personalized_discount_threshold DECIMAL(5,2),
    cross_sell_product_recommendations JSON,
    up_sell_opportunity_assessment JSON
) AS $$
DECLARE
    machine_learning_model_coefficients JSON;
    customer_segmentation_thresholds JSON;
    seasonal_trend_multipliers JSON;
    competitive_price_sensitivity_factor DECIMAL(4,3);
BEGIN
    -- Initialize machine learning model coefficients
    machine_learning_model_coefficients := '{
        "recency_weight": 0.25,
        "frequency_weight": 0.30,
        "monetary_weight": 0.35,
        "engagement_weight": 0.10
    }'::JSON;

    -- Calculate customer lifetime value using advanced algorithms
    RETURN QUERY
    WITH customer_behavioral_features AS (
        SELECT
            c.customer_id,
            c.registration_date AS customer_acquisition_date,
            COUNT(DISTINCT o.order_id) AS total_order_frequency,
            SUM(o.order_total_amount) AS cumulative_monetary_value,
            MAX(o.order_date) AS most_recent_purchase_date,
            AVG(o.order_total_amount) AS average_order_value_historical,
            STDDEV(o.order_total_amount) AS order_value_variance_indicator,
            COUNT(DISTINCT DATE_TRUNC('month', o.order_date)) AS active_months_count,
            AVG(EXTRACT(EPOCH FROM (o.order_date - LAG(o.order_date) OVER (PARTITION BY c.customer_id ORDER BY o.order_date)))) / 86400 AS avg_days_between_purchases
        FROM customers c
        LEFT JOIN orders o ON c.customer_id = o.customer_id
        GROUP BY c.customer_id, c.registration_date
    )
    SELECT
        cbf.customer_id,
        (cbf.cumulative_monetary_value * 1.2 + cbf.average_order_value_historical * cbf.total_order_frequency * 0.8)::DECIMAL(12,2) AS predicted_lifetime_value,
        (cbf.cumulative_monetary_value * 0.9)::DECIMAL(12,2) AS confidence_interval_lower_bound,
        (cbf.cumulative_monetary_value * 1.5)::DECIMAL(12,2) AS confidence_interval_upper_bound,
        CASE
            WHEN cbf.cumulative_monetary_value >= 5000 THEN 'Premium_High_Value_Customer'
            WHEN cbf.cumulative_monetary_value >= 1000 THEN 'Gold_Tier_Customer'
            WHEN cbf.total_order_frequency >= 10 THEN 'Frequent_Purchaser_Segment'
            ELSE 'Standard_Customer_Segment'
        END AS segment_classification,
        LEAST(1.0, GREATEST(0.0, 1.0 - (cbf.total_order_frequency::DECIMAL / 50)))::DECIMAL(4,3) AS churn_risk_probability,
        (cbf.most_recent_purchase_date + INTERVAL '30 days')::DATE AS next_purchase_prediction_date,
        'Personalized email campaign with product recommendations' AS recommended_marketing_strategy,
        CASE
            WHEN cbf.cumulative_monetary_value >= 2000 THEN 15.00
            WHEN cbf.cumulative_monetary_value >= 500 THEN 10.00
            ELSE 5.00
        END AS personalized_discount_threshold,
        '[]'::JSON AS cross_sell_product_recommendations,
        '[]'::JSON AS up_sell_opportunity_assessment
    FROM customer_behavioral_features cbf;
END;
$$ LANGUAGE plpgsql;

-- Window function query with ultra-long aliases for word motion practice
SELECT
    customer_unique_identification_number,
    order_transaction_timestamp,
    product_category_main_classification,
    order_gross_merchandise_value,
    ROW_NUMBER() OVER (
        PARTITION BY customer_unique_identification_number
        ORDER BY order_transaction_timestamp DESC
    ) AS customer_order_sequence_number_descending,
    DENSE_RANK() OVER (
        PARTITION BY product_category_main_classification
        ORDER BY order_gross_merchandise_value DESC
    ) AS product_category_revenue_ranking_position,
    PERCENT_RANK() OVER (
        ORDER BY order_gross_merchandise_value
    ) AS order_value_percentile_ranking_score,
    LAG(order_gross_merchandise_value, 1) OVER (
        PARTITION BY customer_unique_identification_number
        ORDER BY order_transaction_timestamp
    ) AS previous_order_value_same_customer,
    LEAD(order_gross_merchandise_value, 1) OVER (
        PARTITION BY customer_unique_identification_number
        ORDER BY order_transaction_timestamp
    ) AS next_order_value_same_customer,
    SUM(order_gross_merchandise_value) OVER (
        PARTITION BY customer_unique_identification_number
        ORDER BY order_transaction_timestamp
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_customer_lifetime_value_running_total,
    AVG(order_gross_merchandise_value) OVER (
        PARTITION BY customer_unique_identification_number
        ORDER BY order_transaction_timestamp
        ROWS BETWEEN 2 PRECEDING AND 2 FOLLOWING
    ) AS rolling_five_order_average_value,
    FIRST_VALUE(order_gross_merchandise_value) OVER (
        PARTITION BY customer_unique_identification_number
        ORDER BY order_transaction_timestamp
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS customer_first_order_value_ever,
    LAST_VALUE(order_gross_merchandise_value) OVER (
        PARTITION BY customer_unique_identification_number
        ORDER BY order_transaction_timestamp
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS customer_most_recent_order_value
FROM ecommerce_order_analytics_materialized_view
WHERE order_status_classification IN ('completed', 'shipped', 'delivered', 'processing')
  AND order_transaction_timestamp >= CURRENT_DATE - INTERVAL '12 months'
  AND customer_account_status = 'active'
  AND fraud_detection_algorithm_passed = TRUE
ORDER BY
    customer_unique_identification_number,
    order_transaction_timestamp DESC;

-- =============================================================================
-- WORD MOTION PRACTICE EXERCISES:
--
-- 1. BASIC WORD NAVIGATION:
--    - Use 'w' to jump forward through snake_case_identifiers
--    - Use 'b' to jump backward through camelCaseVariables
--    - Use 'e' to jump to end of words like user_behavior_analytics
--
-- 2. SPECIAL CHARACTER NAVIGATION:
--    - Practice 'w' and 'b' on "social-media-engagement-metrics"
--    - Navigate through "metric-id", "platform$name", "user@handle"
--    - Use 'W', 'B', 'E' for WORD motion over punctuation
--
-- 3. LONG IDENTIFIER PRACTICE:
--    - Navigate through calculate_customer_lifetime_value_with_advanced_segmentation
--    - Use word motion on customer_unique_identification_number
--    - Practice on rolling_five_order_average_value
--
-- 4. MIXED NAMING CONVENTIONS:
--    - Jump between snake_case and camelCase in same line
--    - Navigate through JSON field names and SQL keywords
--    - Practice word boundaries with numbers and underscores
--
-- 5. ADVANCED EXERCISES:
--    - Use 'w' to navigate through complex function parameter lists
--    - Practice 'b' and 'e' on long column alias names
--    - Navigate through JSON object keys and SQL operators
-- =============================================================================