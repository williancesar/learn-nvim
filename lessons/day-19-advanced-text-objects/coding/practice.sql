-- PostgreSQL Practice: Extensive Comments and CTEs
-- Day 19: Advanced text object practice with comprehensive documentation
-- Focus on navigating around comments, CTE structures, and well-documented SQL

/*
 * COMPREHENSIVE E-COMMERCE ANALYTICS SYSTEM
 * ==========================================
 *
 * This file demonstrates complex PostgreSQL queries with extensive documentation,
 * Common Table Expressions (CTEs), and detailed explanations for learning purposes.
 *
 * Use this file to practice:
 * - Navigating between comment blocks (/* */)
 * - Moving through single-line comments (--)
 * - Working with CTE structures and WITH clauses
 * - Text object manipulation in documented code
 *
 * Author: SQL Learning Team
 * Date: 2024
 * Version: 1.0
 */

-- ============================================================================
-- SECTION 1: CUSTOMER LIFECYCLE ANALYSIS
-- ============================================================================

/*
 * Customer Lifecycle Analysis Query
 *
 * This comprehensive query analyzes customer behavior patterns throughout
 * their entire lifecycle with our e-commerce platform. It includes:
 *
 * 1. Customer acquisition patterns
 * 2. Engagement frequency analysis
 * 3. Revenue contribution tracking
 * 4. Retention and churn indicators
 * 5. Lifetime value calculations
 *
 * The query uses multiple CTEs to break down complex calculations into
 * manageable, readable components.
 */

WITH customer_first_interactions AS (
    /*
     * CTE 1: Customer First Interactions
     * ----------------------------------
     * Identifies the first touchpoint for each customer across multiple channels.
     * This includes their first website visit, first order, first support ticket,
     * and first marketing interaction.
     */
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        c.email,
        c.registration_date,
        -- First order information with detailed analysis
        (
            SELECT MIN(o.order_date)  -- Get the earliest order date
            FROM orders o
            WHERE o.customer_id = c.customer_id
                AND o.order_status NOT IN ('cancelled', 'refunded')  -- Exclude unsuccessful orders
        ) as first_order_date,
        -- Calculate days between registration and first purchase
        (
            SELECT MIN(o.order_date) - c.registration_date  -- Time to first purchase
            FROM orders o
            WHERE o.customer_id = c.customer_id
                AND o.order_status NOT IN ('cancelled', 'refunded')
        ) as days_to_first_purchase,
        -- First order value analysis
        (
            SELECT o.total_amount
            FROM orders o
            WHERE o.customer_id = c.customer_id
                AND o.order_status NOT IN ('cancelled', 'refunded')
            ORDER BY o.order_date ASC
            LIMIT 1  -- Get only the first successful order
        ) as first_order_value,
        -- Customer acquisition channel information
        c.acquisition_channel,
        c.marketing_source,
        c.initial_referrer
    FROM customers c
    WHERE c.registration_date >= '2022-01-01'  -- Focus on recent customers
        AND c.is_active = true  -- Only active customers
),

customer_engagement_metrics AS (
    /*
     * CTE 2: Customer Engagement Metrics
     * ----------------------------------
     * Calculates comprehensive engagement metrics for each customer including:
     * - Order frequency and timing patterns
     * - Website interaction data
     * - Support ticket history
     * - Email engagement rates
     */
    SELECT
        c.customer_id,
        -- Order-based engagement metrics
        COUNT(DISTINCT o.order_id) as total_orders,
        COUNT(DISTINCT DATE_TRUNC('month', o.order_date)) as active_months,
        -- Average time between orders (for customers with multiple orders)
        CASE
            WHEN COUNT(DISTINCT o.order_id) > 1 THEN
                EXTRACT(DAYS FROM (MAX(o.order_date) - MIN(o.order_date))) /
                NULLIF((COUNT(DISTINCT o.order_id) - 1), 0)
            ELSE NULL
        END as avg_days_between_orders,
        -- Revenue and spending patterns
        SUM(o.total_amount) as total_lifetime_value,
        AVG(o.total_amount) as average_order_value,
        MIN(o.total_amount) as minimum_order_value,
        MAX(o.total_amount) as maximum_order_value,
        STDDEV(o.total_amount) as order_value_variance,
        -- Recent activity indicators (last 90 days)
        COUNT(
            CASE
                WHEN o.order_date >= CURRENT_DATE - INTERVAL '90 days'
                THEN 1
            END
        ) as recent_orders_90d,
        SUM(
            CASE
                WHEN o.order_date >= CURRENT_DATE - INTERVAL '90 days'
                THEN o.total_amount
                ELSE 0
            END
        ) as recent_spending_90d,
        -- Seasonal patterns (quarters with orders)
        COUNT(DISTINCT EXTRACT(QUARTER FROM o.order_date)) as quarters_with_orders,
        -- Product diversity (unique products purchased)
        COUNT(DISTINCT od.product_id) as unique_products_purchased
    FROM customer_first_interactions c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
        AND o.order_status NOT IN ('cancelled', 'refunded')
    LEFT JOIN order_details od ON o.order_id = od.order_id
    GROUP BY c.customer_id
),

customer_segmentation_base AS (
    /*
     * CTE 3: Customer Segmentation Base
     * ---------------------------------
     * Creates foundational customer segments based on behavioral patterns.
     * Uses RFM analysis (Recency, Frequency, Monetary) as the base for
     * segmentation with additional engagement factors.
     */
    SELECT
        cfi.customer_id,
        cfi.first_name,
        cfi.last_name,
        cfi.email,
        cfi.registration_date,
        cfi.first_order_date,
        cfi.days_to_first_purchase,
        cfi.first_order_value,
        cfi.acquisition_channel,

        -- Engagement metrics from previous CTE
        cem.total_orders,
        cem.active_months,
        cem.avg_days_between_orders,
        cem.total_lifetime_value,
        cem.average_order_value,
        cem.recent_orders_90d,
        cem.recent_spending_90d,
        cem.quarters_with_orders,
        cem.unique_products_purchased,

        -- Recency calculation (days since last order)
        COALESCE(
            EXTRACT(DAYS FROM (CURRENT_DATE - (
                SELECT MAX(o.order_date)
                FROM orders o
                WHERE o.customer_id = cfi.customer_id
                    AND o.order_status NOT IN ('cancelled', 'refunded')
            ))),
            9999  -- Assign high value if no orders exist
        ) as days_since_last_order,

        -- Customer lifecycle stage determination
        CASE
            WHEN cfi.first_order_date IS NULL THEN 'registered_no_purchase'
            WHEN cem.total_orders = 1 THEN 'single_purchase'
            WHEN cem.recent_orders_90d > 0 THEN 'active_repeat'
            WHEN EXTRACT(DAYS FROM (CURRENT_DATE - (
                SELECT MAX(o.order_date)
                FROM orders o
                WHERE o.customer_id = cfi.customer_id
                    AND o.order_status NOT IN ('cancelled', 'refunded')
            ))) <= 180 THEN 'dormant_recent'
            WHEN EXTRACT(DAYS FROM (CURRENT_DATE - (
                SELECT MAX(o.order_date)
                FROM orders o
                WHERE o.customer_id = cfi.customer_id
                    AND o.order_status NOT IN ('cancelled', 'refunded')
            ))) <= 365 THEN 'dormant_long_term'
            ELSE 'churned'
        END as lifecycle_stage,

        -- Value tier classification
        CASE
            WHEN cem.total_lifetime_value >= 5000 THEN 'vip'
            WHEN cem.total_lifetime_value >= 1000 THEN 'high_value'
            WHEN cem.total_lifetime_value >= 250 THEN 'medium_value'
            WHEN cem.total_lifetime_value > 0 THEN 'low_value'
            ELSE 'no_value'
        END as value_tier

    FROM customer_first_interactions cfi
    LEFT JOIN customer_engagement_metrics cem ON cfi.customer_id = cem.customer_id
),

rfm_scores AS (
    /*
     * CTE 4: RFM Scoring System
     * -------------------------
     * Implements a comprehensive RFM (Recency, Frequency, Monetary) scoring system.
     * Each customer receives scores from 1-5 in each dimension, which are then
     * combined to create detailed customer segments.
     */
    SELECT
        customer_id,
        first_name,
        last_name,
        email,
        total_orders,
        total_lifetime_value,
        days_since_last_order,
        lifecycle_stage,
        value_tier,

        -- Recency Score (1-5, where 5 is most recent)
        CASE
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
            ELSE 1
        END as frequency_score,

        -- Monetary Score (1-5, where 5 is highest value)
        CASE
            WHEN total_lifetime_value >= 5000 THEN 5
            WHEN total_lifetime_value >= 1000 THEN 4
            WHEN total_lifetime_value >= 500 THEN 3
            WHEN total_lifetime_value >= 100 THEN 2
            ELSE 1
        END as monetary_score

    FROM customer_segmentation_base
    WHERE lifecycle_stage != 'registered_no_purchase'  -- Exclude customers who never purchased
),

customer_segments AS (
    /*
     * CTE 5: Final Customer Segments
     * ------------------------------
     * Combines RFM scores into actionable customer segments with specific
     * marketing and retention strategies.
     */
    SELECT
        *,
        -- Combine RFM scores into a single string for easy reference
        CONCAT(recency_score, frequency_score, monetary_score) as rfm_segment,

        -- Create named segments based on RFM combinations
        CASE
            -- Champions: Recent, frequent, high-value customers
            WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4
            THEN 'champions'

            -- Loyal Customers: Frequent, high-value but not recent
            WHEN frequency_score >= 4 AND monetary_score >= 4
            THEN 'loyal_customers'

            -- Potential Loyalists: Recent, moderate frequency and value
            WHEN recency_score >= 4 AND frequency_score >= 2 AND monetary_score >= 2
            THEN 'potential_loyalists'

            -- New Customers: Recent but low frequency
            WHEN recency_score >= 4 AND frequency_score = 1
            THEN 'new_customers'

            -- Promising: Recent with good monetary value
            WHEN recency_score >= 3 AND monetary_score >= 3
            THEN 'promising'

            -- Need Attention: Moderate recency and frequency, good monetary
            WHEN recency_score >= 2 AND frequency_score >= 2 AND monetary_score >= 3
            THEN 'need_attention'

            -- About to Sleep: Declining recency but good history
            WHEN recency_score = 2 AND (frequency_score >= 3 OR monetary_score >= 3)
            THEN 'about_to_sleep'

            -- At Risk: Low recency but good frequency/monetary history
            WHEN recency_score = 1 AND (frequency_score >= 3 OR monetary_score >= 3)
            THEN 'at_risk'

            -- Cannot Lose Them: Very low recency but high frequency/monetary
            WHEN recency_score = 1 AND frequency_score >= 4 AND monetary_score >= 4
            THEN 'cannot_lose_them'

            -- Hibernating: Low across all dimensions but have some history
            WHEN recency_score <= 2 AND frequency_score <= 2 AND monetary_score <= 2
            THEN 'hibernating'

            -- Lost: Very low across all dimensions
            ELSE 'lost'
        END as segment_name,

        -- Define marketing actions for each segment
        CASE
            WHEN recency_score >= 4 AND frequency_score >= 4 AND monetary_score >= 4
            THEN 'VIP treatment, exclusive offers, loyalty rewards'

            WHEN frequency_score >= 4 AND monetary_score >= 4
            THEN 'Retention campaigns, cross-sell premium products'

            WHEN recency_score >= 4 AND frequency_score >= 2 AND monetary_score >= 2
            THEN 'Loyalty programs, frequency incentives'

            WHEN recency_score >= 4 AND frequency_score = 1
            THEN 'Onboarding campaigns, second purchase incentives'

            WHEN recency_score >= 3 AND monetary_score >= 3
            THEN 'Upsell campaigns, value-based offers'

            WHEN recency_score >= 2 AND frequency_score >= 2 AND monetary_score >= 3
            THEN 'Re-engagement campaigns, special promotions'

            WHEN recency_score = 2 AND (frequency_score >= 3 OR monetary_score >= 3)
            THEN 'Win-back campaigns, limited-time offers'

            WHEN recency_score = 1 AND (frequency_score >= 3 OR monetary_score >= 3)
            THEN 'Aggressive win-back, deep discounts'

            WHEN recency_score = 1 AND frequency_score >= 4 AND monetary_score >= 4
            THEN 'High-touch retention, personal outreach'

            WHEN recency_score <= 2 AND frequency_score <= 2 AND monetary_score <= 2
            THEN 'Re-activation campaigns, brand awareness'

            ELSE 'Minimal investment, brand maintenance'
        END as recommended_action

    FROM rfm_scores
)

-- ============================================================================
-- MAIN QUERY: CUSTOMER SEGMENT ANALYSIS REPORT
-- ============================================================================

/*
 * Final Customer Segment Analysis Report
 * ======================================
 *
 * This query produces a comprehensive report showing:
 * 1. Detailed customer segments with RFM scores
 * 2. Segment-level aggregations and insights
 * 3. Recommended marketing actions
 * 4. Performance metrics by segment
 */

SELECT
    segment_name,
    COUNT(*) as customer_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as segment_percentage,

    -- Financial metrics by segment
    ROUND(AVG(total_lifetime_value), 2) as avg_lifetime_value,
    ROUND(SUM(total_lifetime_value), 2) as total_segment_value,
    ROUND(SUM(total_lifetime_value) * 100.0 / SUM(SUM(total_lifetime_value)) OVER (), 2) as revenue_percentage,

    -- Behavioral metrics by segment
    ROUND(AVG(total_orders), 1) as avg_orders_per_customer,
    ROUND(AVG(days_since_last_order), 0) as avg_days_since_last_order,

    -- RFM score averages for validation
    ROUND(AVG(recency_score), 1) as avg_recency_score,
    ROUND(AVG(frequency_score), 1) as avg_frequency_score,
    ROUND(AVG(monetary_score), 1) as avg_monetary_score,

    -- Business impact indicators
    CASE
        WHEN AVG(total_lifetime_value) >= 1000 THEN 'High Impact'
        WHEN AVG(total_lifetime_value) >= 300 THEN 'Medium Impact'
        ELSE 'Low Impact'
    END as business_impact,

    -- Priority level for marketing efforts
    CASE
        WHEN segment_name IN ('champions', 'loyal_customers', 'cannot_lose_them') THEN 'Critical Priority'
        WHEN segment_name IN ('potential_loyalists', 'promising', 'at_risk') THEN 'High Priority'
        WHEN segment_name IN ('new_customers', 'need_attention', 'about_to_sleep') THEN 'Medium Priority'
        ELSE 'Low Priority'
    END as marketing_priority,

    -- Sample recommended action (first customer's action in each segment)
    (SELECT recommended_action
     FROM customer_segments cs2
     WHERE cs2.segment_name = cs.segment_name
     LIMIT 1) as sample_recommended_action

FROM customer_segments cs
GROUP BY segment_name
ORDER BY total_segment_value DESC;

-- ============================================================================
-- SECTION 2: ADDITIONAL ANALYTICAL VIEWS
-- ============================================================================

/*
 * SUPPLEMENTARY ANALYSIS: ACQUISITION CHANNEL PERFORMANCE
 * ========================================================
 *
 * This section provides additional insights into customer acquisition
 * channel performance, complementing the main segmentation analysis.
 */

-- Acquisition Channel Analysis by Customer Segment
WITH channel_segment_performance AS (
    /*
     * Analyze how different acquisition channels perform in terms of
     * the quality of customers they bring in (measured by segment distribution)
     */
    SELECT
        csb.acquisition_channel,
        cs.segment_name,
        COUNT(*) as customers_in_segment,
        ROUND(AVG(cs.total_lifetime_value), 2) as avg_segment_ltv,
        ROUND(AVG(cs.total_orders), 1) as avg_segment_orders
    FROM customer_segmentation_base csb
    JOIN customer_segments cs ON csb.customer_id = cs.customer_id
    WHERE csb.acquisition_channel IS NOT NULL
    GROUP BY csb.acquisition_channel, cs.segment_name
)
SELECT
    acquisition_channel,
    -- Customer distribution across segments
    SUM(CASE WHEN segment_name = 'champions' THEN customers_in_segment ELSE 0 END) as champions,
    SUM(CASE WHEN segment_name = 'loyal_customers' THEN customers_in_segment ELSE 0 END) as loyal_customers,
    SUM(CASE WHEN segment_name = 'potential_loyalists' THEN customers_in_segment ELSE 0 END) as potential_loyalists,
    SUM(CASE WHEN segment_name = 'new_customers' THEN customers_in_segment ELSE 0 END) as new_customers,
    SUM(CASE WHEN segment_name IN ('at_risk', 'hibernating', 'lost') THEN customers_in_segment ELSE 0 END) as at_risk_or_lost,

    -- Channel quality metrics
    SUM(customers_in_segment) as total_customers,
    ROUND(AVG(avg_segment_ltv), 2) as channel_avg_ltv,

    -- Channel effectiveness score (weighted by segment quality)
    ROUND(
        (SUM(CASE WHEN segment_name = 'champions' THEN customers_in_segment * 5 ELSE 0 END) +
         SUM(CASE WHEN segment_name = 'loyal_customers' THEN customers_in_segment * 4 ELSE 0 END) +
         SUM(CASE WHEN segment_name = 'potential_loyalists' THEN customers_in_segment * 3 ELSE 0 END) +
         SUM(CASE WHEN segment_name = 'new_customers' THEN customers_in_segment * 2 ELSE 0 END) +
         SUM(CASE WHEN segment_name IN ('promising', 'need_attention') THEN customers_in_segment * 1 ELSE 0 END)) /
        NULLIF(SUM(customers_in_segment), 0)
    , 2) as channel_quality_score

FROM channel_segment_performance
GROUP BY acquisition_channel
ORDER BY channel_quality_score DESC, channel_avg_ltv DESC;

-- End of comprehensive customer analytics with extensive documentation