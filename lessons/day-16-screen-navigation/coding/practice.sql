-- PostgreSQL Practice: Screen Navigation (Long File)
-- Day 16: Long SQL file for practicing H, M, L, Ctrl+D, Ctrl+U, Ctrl+F, Ctrl+B, gg, G
-- This file contains extensive queries to practice screen-based navigation commands

-- =====================================================
-- SALES ANALYTICS DATABASE STRUCTURE
-- =====================================================

-- Create comprehensive e-commerce database schema with detailed tables
-- This section demonstrates table creation and constraints

CREATE SCHEMA IF NOT EXISTS ecommerce;
SET search_path TO ecommerce;

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    street_address VARCHAR(200),
    city VARCHAR(50),
    state_province VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'USA',
    customer_tier VARCHAR(20) DEFAULT 'Standard',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    total_lifetime_value DECIMAL(12,2) DEFAULT 0.00,
    preferred_language VARCHAR(10) DEFAULT 'en',
    marketing_opt_in BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    parent_category_id INTEGER REFERENCES categories(category_id),
    description TEXT,
    category_image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    seo_title VARCHAR(200),
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100),
    contact_title VARCHAR(50),
    street_address VARCHAR(200),
    city VARCHAR(50),
    state_province VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    phone VARCHAR(20),
    fax VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    tax_id VARCHAR(50),
    payment_terms VARCHAR(100),
    is_preferred BOOLEAN DEFAULT false,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    supplier_id INTEGER REFERENCES suppliers(supplier_id),
    category_id INTEGER REFERENCES categories(category_id),
    sku VARCHAR(100) UNIQUE NOT NULL,
    product_description TEXT,
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    cost_price DECIMAL(10,2) CHECK (cost_price >= 0),
    units_in_stock INTEGER DEFAULT 0 CHECK (units_in_stock >= 0),
    units_on_order INTEGER DEFAULT 0 CHECK (units_on_order >= 0),
    reorder_level INTEGER DEFAULT 0,
    discontinued BOOLEAN DEFAULT false,
    weight DECIMAL(8,3),
    dimensions VARCHAR(50),
    color VARCHAR(30),
    size VARCHAR(20),
    material VARCHAR(100),
    warranty_months INTEGER DEFAULT 12,
    is_featured BOOLEAN DEFAULT false,
    product_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    title VARCHAR(100),
    title_of_courtesy VARCHAR(20),
    birth_date DATE,
    hire_date DATE NOT NULL,
    termination_date DATE,
    street_address VARCHAR(200),
    city VARCHAR(50),
    state_province VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    home_phone VARCHAR(20),
    extension VARCHAR(10),
    photo_url VARCHAR(500),
    notes TEXT,
    reports_to INTEGER REFERENCES employees(employee_id),
    salary DECIMAL(10,2),
    commission_rate DECIMAL(5,4) DEFAULT 0.0000,
    department VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shippers (
    shipper_id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(200),
    street_address VARCHAR(200),
    city VARCHAR(50),
    state_province VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50),
    service_areas TEXT[],
    shipping_rates JSONB,
    delivery_time_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(customer_id),
    employee_id INTEGER REFERENCES employees(employee_id),
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    required_date DATE,
    shipped_date TIMESTAMP,
    ship_via INTEGER REFERENCES shippers(shipper_id),
    freight DECIMAL(8,2) DEFAULT 0.00,
    ship_name VARCHAR(100),
    ship_address VARCHAR(200),
    ship_city VARCHAR(50),
    ship_state_province VARCHAR(50),
    ship_postal_code VARCHAR(20),
    ship_country VARCHAR(50),
    order_status VARCHAR(20) DEFAULT 'Pending',
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'Pending',
    subtotal DECIMAL(12,2) DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_details (
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(product_id),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    discount DECIMAL(5,4) DEFAULT 0.0000 CHECK (discount >= 0 AND discount <= 1),
    line_total DECIMAL(12,2) GENERATED ALWAYS AS (unit_price * quantity * (1 - discount)) STORED,
    PRIMARY KEY (order_id, product_id)
);

-- =====================================================
-- COMPLEX ANALYTICS QUERIES SECTION
-- =====================================================

-- Query 1: Comprehensive Customer Lifetime Value Analysis
-- This query demonstrates complex aggregations and window functions
WITH customer_metrics AS (
    SELECT
        c.customer_id,
        c.first_name,
        c.last_name,
        c.email,
        c.registration_date,
        c.customer_tier,
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(o.total_amount) as lifetime_value,
        AVG(o.total_amount) as avg_order_value,
        MIN(o.order_date) as first_order_date,
        MAX(o.order_date) as last_order_date,
        MAX(o.order_date) - MIN(o.order_date) as customer_lifespan,
        EXTRACT(DAYS FROM (MAX(o.order_date) - MIN(o.order_date))) as lifespan_days,
        SUM(o.total_amount) / NULLIF(EXTRACT(DAYS FROM (MAX(o.order_date) - MIN(o.order_date))), 0) as daily_value_rate
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    WHERE c.is_active = true
    GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.registration_date, c.customer_tier
),
customer_rankings AS (
    SELECT
        *,
        ROW_NUMBER() OVER (ORDER BY lifetime_value DESC) as value_rank,
        NTILE(10) OVER (ORDER BY lifetime_value) as value_decile,
        PERCENT_RANK() OVER (ORDER BY lifetime_value) as value_percentile,
        LAG(lifetime_value) OVER (ORDER BY lifetime_value) as prev_customer_value,
        LEAD(lifetime_value) OVER (ORDER BY lifetime_value) as next_customer_value
    FROM customer_metrics
    WHERE total_orders > 0
)
SELECT
    customer_id,
    first_name || ' ' || last_name as full_name,
    email,
    customer_tier,
    total_orders,
    ROUND(lifetime_value, 2) as lifetime_value,
    ROUND(avg_order_value, 2) as avg_order_value,
    first_order_date,
    last_order_date,
    lifespan_days,
    ROUND(daily_value_rate, 4) as daily_value_rate,
    value_rank,
    value_decile,
    ROUND(value_percentile::numeric, 4) as value_percentile,
    CASE
        WHEN value_decile >= 9 THEN 'VIP'
        WHEN value_decile >= 7 THEN 'Premium'
        WHEN value_decile >= 5 THEN 'Standard'
        ELSE 'Basic'
    END as recommended_tier
FROM customer_rankings
WHERE lifetime_value > 100
ORDER BY lifetime_value DESC
LIMIT 100;

-- Query 2: Advanced Product Performance Analysis with Cohort Behavior
-- This demonstrates complex joins, window functions, and statistical analysis
WITH product_sales_metrics AS (
    SELECT
        p.product_id,
        p.product_name,
        p.sku,
        c.category_name,
        s.company_name as supplier_name,
        p.unit_price,
        p.cost_price,
        p.unit_price - p.cost_price as margin_per_unit,
        (p.unit_price - p.cost_price) / p.unit_price as margin_percentage,
        SUM(od.quantity) as total_units_sold,
        SUM(od.line_total) as total_revenue,
        COUNT(DISTINCT od.order_id) as orders_containing_product,
        COUNT(DISTINCT o.customer_id) as unique_customers,
        AVG(od.quantity) as avg_quantity_per_order,
        AVG(od.unit_price) as avg_selling_price,
        MIN(o.order_date) as first_sale_date,
        MAX(o.order_date) as last_sale_date,
        EXTRACT(DAYS FROM (MAX(o.order_date) - MIN(o.order_date))) as sales_period_days
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN suppliers s ON p.supplier_id = s.supplier_id
    LEFT JOIN order_details od ON p.product_id = od.product_id
    LEFT JOIN orders o ON od.order_id = o.order_id
    WHERE p.discontinued = false
        AND o.order_date >= '2022-01-01'
    GROUP BY p.product_id, p.product_name, p.sku, c.category_name,
             s.company_name, p.unit_price, p.cost_price
),
product_rankings AS (
    SELECT
        *,
        ROW_NUMBER() OVER (ORDER BY total_revenue DESC) as revenue_rank,
        ROW_NUMBER() OVER (ORDER BY total_units_sold DESC) as units_rank,
        ROW_NUMBER() OVER (ORDER BY orders_containing_product DESC) as popularity_rank,
        ROW_NUMBER() OVER (PARTITION BY category_name ORDER BY total_revenue DESC) as category_revenue_rank,
        SUM(total_revenue) OVER (PARTITION BY category_name) as category_total_revenue,
        total_revenue / SUM(total_revenue) OVER (PARTITION BY category_name) as category_revenue_share,
        NTILE(5) OVER (ORDER BY total_revenue) as revenue_quintile,
        CASE
            WHEN sales_period_days > 0 THEN total_revenue / sales_period_days
            ELSE 0
        END as daily_revenue_rate
    FROM product_sales_metrics
    WHERE total_units_sold > 0
),
category_benchmarks AS (
    SELECT
        category_name,
        AVG(total_revenue) as avg_category_revenue,
        STDDEV(total_revenue) as stddev_category_revenue,
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_revenue) as median_category_revenue,
        PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY total_revenue) as q1_category_revenue,
        PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY total_revenue) as q3_category_revenue
    FROM product_rankings
    GROUP BY category_name
)
SELECT
    pr.product_id,
    pr.product_name,
    pr.sku,
    pr.category_name,
    pr.supplier_name,
    ROUND(pr.unit_price, 2) as unit_price,
    ROUND(pr.cost_price, 2) as cost_price,
    ROUND(pr.margin_per_unit, 2) as margin_per_unit,
    ROUND(pr.margin_percentage * 100, 2) as margin_percentage,
    pr.total_units_sold,
    ROUND(pr.total_revenue, 2) as total_revenue,
    pr.orders_containing_product,
    pr.unique_customers,
    ROUND(pr.avg_quantity_per_order, 2) as avg_quantity_per_order,
    ROUND(pr.avg_selling_price, 2) as avg_selling_price,
    pr.first_sale_date,
    pr.last_sale_date,
    pr.sales_period_days,
    ROUND(pr.daily_revenue_rate, 2) as daily_revenue_rate,
    pr.revenue_rank,
    pr.units_rank,
    pr.popularity_rank,
    pr.category_revenue_rank,
    ROUND(pr.category_revenue_share * 100, 2) as category_revenue_share_pct,
    pr.revenue_quintile,
    ROUND(cb.avg_category_revenue, 2) as avg_category_revenue,
    ROUND(cb.median_category_revenue, 2) as median_category_revenue,
    CASE
        WHEN pr.total_revenue > cb.q3_category_revenue THEN 'Top Performer'
        WHEN pr.total_revenue > cb.median_category_revenue THEN 'Above Average'
        WHEN pr.total_revenue > cb.q1_category_revenue THEN 'Below Average'
        ELSE 'Poor Performer'
    END as performance_category,
    CASE
        WHEN pr.revenue_quintile = 5 THEN 'Star'
        WHEN pr.revenue_quintile = 4 THEN 'Rising Star'
        WHEN pr.revenue_quintile = 3 THEN 'Steady'
        WHEN pr.revenue_quintile = 2 THEN 'Declining'
        ELSE 'Dog'
    END as bcg_matrix_category
FROM product_rankings pr
LEFT JOIN category_benchmarks cb ON pr.category_name = cb.category_name
ORDER BY pr.total_revenue DESC;

-- Query 3: Seasonal Sales Pattern Analysis with Time Series Decomposition
-- This query demonstrates advanced time series analysis and seasonal pattern detection
WITH daily_sales AS (
    SELECT
        DATE(order_date) as sale_date,
        EXTRACT(YEAR FROM order_date) as sale_year,
        EXTRACT(MONTH FROM order_date) as sale_month,
        EXTRACT(DAY FROM order_date) as sale_day,
        EXTRACT(DOW FROM order_date) as day_of_week,
        EXTRACT(QUARTER FROM order_date) as sale_quarter,
        EXTRACT(WEEK FROM order_date) as sale_week,
        COUNT(DISTINCT order_id) as daily_orders,
        COUNT(DISTINCT customer_id) as daily_customers,
        SUM(total_amount) as daily_revenue,
        AVG(total_amount) as daily_avg_order_value,
        SUM(SUM(total_amount)) OVER (
            ORDER BY DATE(order_date)
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) / 7 as seven_day_moving_avg,
        SUM(SUM(total_amount)) OVER (
            ORDER BY DATE(order_date)
            ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ) / 30 as thirty_day_moving_avg
    FROM orders
    WHERE order_date >= '2022-01-01'
        AND order_date < '2024-01-01'
        AND order_status NOT IN ('Cancelled', 'Refunded')
    GROUP BY DATE(order_date)
),
seasonal_patterns AS (
    SELECT
        *,
        AVG(daily_revenue) OVER (PARTITION BY sale_month) as monthly_avg_revenue,
        AVG(daily_revenue) OVER (PARTITION BY day_of_week) as dow_avg_revenue,
        AVG(daily_revenue) OVER (PARTITION BY sale_quarter) as quarterly_avg_revenue,
        STDDEV(daily_revenue) OVER (PARTITION BY sale_month) as monthly_revenue_stddev,
        LAG(daily_revenue, 7) OVER (ORDER BY sale_date) as same_dow_last_week,
        LAG(daily_revenue, 365) OVER (ORDER BY sale_date) as same_date_last_year,
        daily_revenue - LAG(daily_revenue, 1) OVER (ORDER BY sale_date) as day_over_day_change,
        (daily_revenue - LAG(daily_revenue, 7) OVER (ORDER BY sale_date)) /
            NULLIF(LAG(daily_revenue, 7) OVER (ORDER BY sale_date), 0) * 100 as week_over_week_pct_change,
        (daily_revenue - LAG(daily_revenue, 365) OVER (ORDER BY sale_date)) /
            NULLIF(LAG(daily_revenue, 365) OVER (ORDER BY sale_date), 0) * 100 as year_over_year_pct_change
    FROM daily_sales
),
trend_analysis AS (
    SELECT
        *,
        CASE day_of_week
            WHEN 0 THEN 'Sunday'
            WHEN 1 THEN 'Monday'
            WHEN 2 THEN 'Tuesday'
            WHEN 3 THEN 'Wednesday'
            WHEN 4 THEN 'Thursday'
            WHEN 5 THEN 'Friday'
            WHEN 6 THEN 'Saturday'
        END as day_name,
        CASE sale_month
            WHEN 1 THEN 'January'
            WHEN 2 THEN 'February'
            WHEN 3 THEN 'March'
            WHEN 4 THEN 'April'
            WHEN 5 THEN 'May'
            WHEN 6 THEN 'June'
            WHEN 7 THEN 'July'
            WHEN 8 THEN 'August'
            WHEN 9 THEN 'September'
            WHEN 10 THEN 'October'
            WHEN 11 THEN 'November'
            WHEN 12 THEN 'December'
        END as month_name,
        CASE
            WHEN daily_revenue > monthly_avg_revenue + monthly_revenue_stddev THEN 'Exceptional'
            WHEN daily_revenue > monthly_avg_revenue + (monthly_revenue_stddev * 0.5) THEN 'High'
            WHEN daily_revenue < monthly_avg_revenue - monthly_revenue_stddev THEN 'Poor'
            WHEN daily_revenue < monthly_avg_revenue - (monthly_revenue_stddev * 0.5) THEN 'Low'
            ELSE 'Normal'
        END as performance_vs_monthly_avg,
        ROW_NUMBER() OVER (PARTITION BY sale_year, sale_month ORDER BY daily_revenue DESC) as daily_rank_in_month,
        DENSE_RANK() OVER (ORDER BY daily_revenue DESC) as overall_daily_rank
    FROM seasonal_patterns
)
SELECT
    sale_date,
    day_name,
    month_name,
    sale_year,
    sale_quarter,
    daily_orders,
    daily_customers,
    ROUND(daily_revenue, 2) as daily_revenue,
    ROUND(daily_avg_order_value, 2) as daily_avg_order_value,
    ROUND(seven_day_moving_avg, 2) as seven_day_moving_avg,
    ROUND(thirty_day_moving_avg, 2) as thirty_day_moving_avg,
    ROUND(monthly_avg_revenue, 2) as monthly_avg_revenue,
    ROUND(dow_avg_revenue, 2) as dow_avg_revenue,
    ROUND(quarterly_avg_revenue, 2) as quarterly_avg_revenue,
    ROUND(day_over_day_change, 2) as day_over_day_change,
    ROUND(week_over_week_pct_change, 2) as week_over_week_pct_change,
    ROUND(year_over_year_pct_change, 2) as year_over_year_pct_change,
    performance_vs_monthly_avg,
    daily_rank_in_month,
    overall_daily_rank,
    CASE
        WHEN sale_date IN (
            '2022-11-24', '2023-11-23', '2024-11-28',  -- Black Friday
            '2022-12-25', '2023-12-25', '2024-12-25',  -- Christmas
            '2022-01-01', '2023-01-01', '2024-01-01'   -- New Year
        ) THEN 'Holiday'
        WHEN EXTRACT(MONTH FROM sale_date) IN (11, 12) THEN 'Holiday Season'
        WHEN EXTRACT(MONTH FROM sale_date) IN (6, 7, 8) THEN 'Summer'
        WHEN EXTRACT(MONTH FROM sale_date) IN (3, 4, 5) THEN 'Spring'
        WHEN EXTRACT(MONTH FROM sale_date) IN (9, 10, 11) THEN 'Fall'
        ELSE 'Winter'
    END as season_category
FROM trend_analysis
WHERE sale_date >= '2023-01-01'
ORDER BY sale_date DESC;

-- Query 4: Customer Segmentation and Cohort Analysis
-- This final query demonstrates complex customer behavior analysis
WITH customer_cohorts AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', MIN(order_date)) as cohort_month,
        MIN(order_date) as first_order_date,
        MAX(order_date) as last_order_date,
        COUNT(DISTINCT order_id) as total_orders,
        SUM(total_amount) as total_spent,
        AVG(total_amount) as avg_order_value,
        EXTRACT(DAYS FROM (MAX(order_date) - MIN(order_date))) as customer_lifetime_days
    FROM orders
    WHERE order_status NOT IN ('Cancelled', 'Refunded')
    GROUP BY customer_id
),
monthly_activity AS (
    SELECT
        cc.customer_id,
        cc.cohort_month,
        DATE_TRUNC('month', o.order_date) as activity_month,
        EXTRACT(MONTH FROM AGE(DATE_TRUNC('month', o.order_date), cc.cohort_month)) as period_number,
        SUM(o.total_amount) as monthly_revenue,
        COUNT(o.order_id) as monthly_orders
    FROM customer_cohorts cc
    JOIN orders o ON cc.customer_id = o.customer_id
    WHERE o.order_status NOT IN ('Cancelled', 'Refunded')
    GROUP BY cc.customer_id, cc.cohort_month, DATE_TRUNC('month', o.order_date)
),
cohort_table AS (
    SELECT
        cohort_month,
        period_number,
        COUNT(DISTINCT customer_id) as customers,
        SUM(monthly_revenue) as revenue,
        AVG(monthly_revenue) as avg_revenue_per_customer,
        SUM(monthly_orders) as total_orders,
        AVG(monthly_orders) as avg_orders_per_customer
    FROM monthly_activity
    GROUP BY cohort_month, period_number
),
cohort_sizes AS (
    SELECT
        cohort_month,
        COUNT(DISTINCT customer_id) as cohort_size
    FROM customer_cohorts
    GROUP BY cohort_month
),
retention_rates AS (
    SELECT
        ct.cohort_month,
        ct.period_number,
        ct.customers,
        cs.cohort_size,
        ROUND(ct.customers::numeric / cs.cohort_size * 100, 2) as retention_rate,
        ct.revenue,
        ct.avg_revenue_per_customer,
        ct.total_orders,
        ct.avg_orders_per_customer,
        LAG(ct.customers) OVER (PARTITION BY ct.cohort_month ORDER BY ct.period_number) as prev_period_customers,
        ct.customers - LAG(ct.customers) OVER (PARTITION BY ct.cohort_month ORDER BY ct.period_number) as customer_change
    FROM cohort_table ct
    JOIN cohort_sizes cs ON ct.cohort_month = cs.cohort_month
)
SELECT
    cohort_month,
    period_number,
    CASE period_number
        WHEN 0 THEN 'Month 0 (Acquisition)'
        WHEN 1 THEN 'Month 1'
        WHEN 2 THEN 'Month 2'
        WHEN 3 THEN 'Month 3'
        WHEN 6 THEN 'Month 6'
        WHEN 12 THEN 'Month 12'
        ELSE 'Month ' || period_number
    END as period_label,
    customers,
    cohort_size,
    retention_rate,
    ROUND(revenue, 2) as revenue,
    ROUND(avg_revenue_per_customer, 2) as avg_revenue_per_customer,
    total_orders,
    ROUND(avg_orders_per_customer, 2) as avg_orders_per_customer,
    prev_period_customers,
    customer_change,
    CASE
        WHEN retention_rate >= 80 THEN 'Excellent'
        WHEN retention_rate >= 60 THEN 'Good'
        WHEN retention_rate >= 40 THEN 'Average'
        WHEN retention_rate >= 20 THEN 'Poor'
        ELSE 'Critical'
    END as retention_health,
    CASE
        WHEN period_number = 0 THEN 'New'
        WHEN period_number <= 3 THEN 'Early Stage'
        WHEN period_number <= 12 THEN 'Growing'
        ELSE 'Mature'
    END as cohort_stage
FROM retention_rates
WHERE cohort_month >= '2022-01-01'
    AND period_number <= 24
ORDER BY cohort_month DESC, period_number;

-- End of practice file - use gg to go to top, G to go to bottom