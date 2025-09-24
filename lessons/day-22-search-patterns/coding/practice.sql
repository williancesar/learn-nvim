-- PostgreSQL Practice: Search Patterns
-- Day 22: SQL with searchable patterns for practicing / and ? searches
-- Use this file to practice searching for table names, column names, and specific patterns

-- ================================================
-- CUSTOMER_MASTER_TABLE - Search for "customer"
-- ================================================

CREATE TABLE customer_master_table (
    customer_id SERIAL PRIMARY KEY,
    customer_code VARCHAR(20) UNIQUE NOT NULL,
    customer_first_name VARCHAR(50) NOT NULL,
    customer_last_name VARCHAR(50) NOT NULL,
    customer_email VARCHAR(100) UNIQUE,
    customer_phone VARCHAR(20),
    customer_address_line1 VARCHAR(200),
    customer_address_line2 VARCHAR(200),
    customer_city VARCHAR(50),
    customer_state VARCHAR(50),
    customer_country VARCHAR(50) DEFAULT 'USA',
    customer_postal_code VARCHAR(20),
    customer_registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    customer_status VARCHAR(20) DEFAULT 'ACTIVE',
    customer_type VARCHAR(20) DEFAULT 'REGULAR',
    customer_loyalty_tier VARCHAR(20) DEFAULT 'BRONZE',
    customer_birth_date DATE,
    customer_marketing_opt_in BOOLEAN DEFAULT false,
    customer_newsletter_subscription BOOLEAN DEFAULT false,
    customer_preferred_language VARCHAR(10) DEFAULT 'en'
);

-- Search practice: Try /customer to find all customer-related fields
-- Use /customer_email, /customer_phone, /customer_address patterns

INSERT INTO customer_master_table (
    customer_code,
    customer_first_name,
    customer_last_name,
    customer_email,
    customer_phone,
    customer_city,
    customer_state,
    customer_type,
    customer_loyalty_tier
) VALUES
    ('CUST001', 'John', 'Smith', 'john.smith@email.com', '555-0101', 'New York', 'NY', 'PREMIUM', 'GOLD'),
    ('CUST002', 'Jane', 'Johnson', 'jane.johnson@email.com', '555-0102', 'Los Angeles', 'CA', 'REGULAR', 'SILVER'),
    ('CUST003', 'Mike', 'Williams', 'mike.williams@email.com', '555-0103', 'Chicago', 'IL', 'VIP', 'PLATINUM'),
    ('CUST004', 'Sarah', 'Brown', 'sarah.brown@email.com', '555-0104', 'Houston', 'TX', 'REGULAR', 'BRONZE'),
    ('CUST005', 'David', 'Davis', 'david.davis@email.com', '555-0105', 'Phoenix', 'AZ', 'PREMIUM', 'GOLD');

-- ================================================
-- PRODUCT_CATALOG - Search for "product" patterns
-- ================================================

CREATE TABLE product_catalog_master (
    product_id SERIAL PRIMARY KEY,
    product_sku VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_description TEXT,
    product_category_id INTEGER,
    product_subcategory VARCHAR(100),
    product_brand VARCHAR(100),
    product_manufacturer VARCHAR(100),
    product_model_number VARCHAR(100),
    product_color VARCHAR(50),
    product_size VARCHAR(50),
    product_weight DECIMAL(8,3),
    product_dimensions VARCHAR(100),
    product_material VARCHAR(100),
    product_retail_price DECIMAL(10,2),
    product_wholesale_price DECIMAL(10,2),
    product_cost_price DECIMAL(10,2),
    product_discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    product_tax_rate DECIMAL(5,4) DEFAULT 0.0875,
    product_stock_quantity INTEGER DEFAULT 0,
    product_reorder_level INTEGER DEFAULT 10,
    product_max_stock_level INTEGER DEFAULT 1000,
    product_supplier_id INTEGER,
    product_warranty_months INTEGER DEFAULT 12,
    product_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_status VARCHAR(20) DEFAULT 'ACTIVE',
    product_featured BOOLEAN DEFAULT false,
    product_bestseller BOOLEAN DEFAULT false,
    product_new_arrival BOOLEAN DEFAULT false
);

-- Search practice: Try /product_price, /product_stock, /product_status
-- Practice with ?product to search backwards for product patterns

INSERT INTO product_catalog_master (
    product_sku, product_name, product_description, product_category_id,
    product_brand, product_retail_price, product_wholesale_price,
    product_stock_quantity, product_status
) VALUES
    ('LAPTOP001', 'Gaming Laptop Pro', 'High-performance gaming laptop with RTX graphics', 1, 'TechBrand', 1999.99, 1500.00, 25, 'ACTIVE'),
    ('MOUSE001', 'Wireless Gaming Mouse', 'RGB wireless mouse with programmable buttons', 2, 'GamerGear', 79.99, 45.00, 150, 'ACTIVE'),
    ('KEYBOARD001', 'Mechanical Gaming Keyboard', 'RGB mechanical keyboard with blue switches', 2, 'GamerGear', 129.99, 75.00, 80, 'ACTIVE'),
    ('MONITOR001', '4K Gaming Monitor', '27-inch 4K monitor with 144Hz refresh rate', 3, 'DisplayTech', 599.99, 400.00, 15, 'ACTIVE'),
    ('HEADSET001', 'Noise-Canceling Headset', 'Wireless headset with active noise cancellation', 4, 'AudioMax', 199.99, 120.00, 60, 'ACTIVE');

-- ================================================
-- ORDER_MANAGEMENT - Search for "order" patterns
-- ================================================

CREATE TABLE order_header_table (
    order_id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_customer_id INTEGER NOT NULL,
    order_status VARCHAR(20) DEFAULT 'PENDING',
    order_payment_method VARCHAR(50),
    order_payment_status VARCHAR(20) DEFAULT 'PENDING',
    order_shipping_method VARCHAR(50),
    order_shipping_cost DECIMAL(8,2) DEFAULT 0.00,
    order_subtotal DECIMAL(12,2) DEFAULT 0.00,
    order_tax_amount DECIMAL(10,2) DEFAULT 0.00,
    order_discount_amount DECIMAL(10,2) DEFAULT 0.00,
    order_total_amount DECIMAL(12,2) DEFAULT 0.00,
    order_currency_code VARCHAR(3) DEFAULT 'USD',
    order_exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
    order_billing_address_line1 VARCHAR(200),
    order_billing_address_line2 VARCHAR(200),
    order_billing_city VARCHAR(50),
    order_billing_state VARCHAR(50),
    order_billing_country VARCHAR(50),
    order_billing_postal_code VARCHAR(20),
    order_shipping_address_line1 VARCHAR(200),
    order_shipping_address_line2 VARCHAR(200),
    order_shipping_city VARCHAR(50),
    order_shipping_state VARCHAR(50),
    order_shipping_country VARCHAR(50),
    order_shipping_postal_code VARCHAR(20),
    order_notes TEXT,
    order_created_by INTEGER,
    order_updated_by INTEGER,
    order_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search patterns: /order_status, /order_total, /order_shipping, /order_billing

CREATE TABLE order_line_items_table (
    order_line_id SERIAL PRIMARY KEY,
    order_header_id INTEGER NOT NULL,
    order_line_number INTEGER NOT NULL,
    order_product_id INTEGER NOT NULL,
    order_product_sku VARCHAR(50),
    order_product_name VARCHAR(200),
    order_line_quantity INTEGER NOT NULL,
    order_line_unit_price DECIMAL(10,2) NOT NULL,
    order_line_discount_percent DECIMAL(5,2) DEFAULT 0.00,
    order_line_discount_amount DECIMAL(10,2) DEFAULT 0.00,
    order_line_tax_rate DECIMAL(5,4) DEFAULT 0.0875,
    order_line_tax_amount DECIMAL(10,2) DEFAULT 0.00,
    order_line_subtotal DECIMAL(12,2) NOT NULL,
    order_line_total DECIMAL(12,2) NOT NULL,
    order_line_status VARCHAR(20) DEFAULT 'PENDING',
    order_line_ship_date TIMESTAMP,
    order_line_delivery_date TIMESTAMP,
    order_line_tracking_number VARCHAR(100),
    order_line_notes TEXT
);

-- ================================================
-- INVENTORY_MANAGEMENT - Search for "inventory"
-- ================================================

CREATE TABLE inventory_transactions_log (
    inventory_transaction_id SERIAL PRIMARY KEY,
    inventory_product_id INTEGER NOT NULL,
    inventory_transaction_type VARCHAR(20) NOT NULL, -- INBOUND, OUTBOUND, ADJUSTMENT
    inventory_transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inventory_quantity_before INTEGER NOT NULL,
    inventory_quantity_change INTEGER NOT NULL,
    inventory_quantity_after INTEGER NOT NULL,
    inventory_reference_number VARCHAR(100),
    inventory_reference_type VARCHAR(50), -- PURCHASE_ORDER, SALES_ORDER, ADJUSTMENT
    inventory_location_code VARCHAR(20),
    inventory_warehouse_section VARCHAR(50),
    inventory_bin_location VARCHAR(20),
    inventory_transaction_reason VARCHAR(100),
    inventory_performed_by INTEGER,
    inventory_notes TEXT,
    inventory_unit_cost DECIMAL(10,4),
    inventory_total_value DECIMAL(12,2)
);

-- Search practice: Try searching for /inventory_transaction, /inventory_quantity

INSERT INTO inventory_transactions_log (
    inventory_product_id, inventory_transaction_type, inventory_quantity_before,
    inventory_quantity_change, inventory_quantity_after, inventory_reference_number,
    inventory_location_code, inventory_transaction_reason
) VALUES
    (1, 'INBOUND', 20, 50, 70, 'PO-2024-001', 'WH-MAIN', 'Purchase order receipt'),
    (2, 'OUTBOUND', 150, -25, 125, 'SO-2024-001', 'WH-MAIN', 'Customer order fulfillment'),
    (3, 'OUTBOUND', 80, -15, 65, 'SO-2024-002', 'WH-MAIN', 'Customer order fulfillment'),
    (4, 'INBOUND', 10, 20, 30, 'PO-2024-002', 'WH-MAIN', 'Purchase order receipt'),
    (5, 'ADJUSTMENT', 60, -5, 55, 'ADJ-2024-001', 'WH-MAIN', 'Inventory count adjustment');

-- ================================================
-- SUPPLIER_VENDOR - Search for "supplier" patterns
-- ================================================

CREATE TABLE supplier_vendor_master (
    supplier_id SERIAL PRIMARY KEY,
    supplier_code VARCHAR(20) UNIQUE NOT NULL,
    supplier_company_name VARCHAR(200) NOT NULL,
    supplier_contact_first_name VARCHAR(50),
    supplier_contact_last_name VARCHAR(50),
    supplier_contact_title VARCHAR(100),
    supplier_email VARCHAR(100),
    supplier_phone VARCHAR(20),
    supplier_fax VARCHAR(20),
    supplier_website VARCHAR(200),
    supplier_address_line1 VARCHAR(200),
    supplier_address_line2 VARCHAR(200),
    supplier_city VARCHAR(50),
    supplier_state VARCHAR(50),
    supplier_country VARCHAR(50),
    supplier_postal_code VARCHAR(20),
    supplier_tax_id VARCHAR(50),
    supplier_payment_terms VARCHAR(100),
    supplier_credit_limit DECIMAL(12,2),
    supplier_discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    supplier_lead_time_days INTEGER DEFAULT 7,
    supplier_minimum_order_amount DECIMAL(10,2) DEFAULT 0.00,
    supplier_preferred_payment_method VARCHAR(50),
    supplier_status VARCHAR(20) DEFAULT 'ACTIVE',
    supplier_rating INTEGER CHECK (supplier_rating >= 1 AND supplier_rating <= 5),
    supplier_created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    supplier_updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search patterns: /supplier_contact, /supplier_payment, /supplier_status

-- ================================================
-- EMPLOYEE_DEPARTMENT - Search for "employee"
-- ================================================

CREATE TABLE employee_master_table (
    employee_id SERIAL PRIMARY KEY,
    employee_number VARCHAR(20) UNIQUE NOT NULL,
    employee_first_name VARCHAR(50) NOT NULL,
    employee_last_name VARCHAR(50) NOT NULL,
    employee_middle_name VARCHAR(50),
    employee_email VARCHAR(100) UNIQUE,
    employee_phone VARCHAR(20),
    employee_mobile VARCHAR(20),
    employee_emergency_contact VARCHAR(100),
    employee_emergency_phone VARCHAR(20),
    employee_department_id INTEGER,
    employee_position_title VARCHAR(100),
    employee_manager_id INTEGER,
    employee_hire_date DATE NOT NULL,
    employee_termination_date DATE,
    employee_employment_status VARCHAR(20) DEFAULT 'ACTIVE',
    employee_employment_type VARCHAR(20) DEFAULT 'FULL_TIME',
    employee_salary DECIMAL(10,2),
    employee_hourly_rate DECIMAL(8,2),
    employee_commission_rate DECIMAL(5,4) DEFAULT 0.0000,
    employee_benefits_eligible BOOLEAN DEFAULT true,
    employee_vacation_days_accrued DECIMAL(5,2) DEFAULT 0.00,
    employee_sick_days_accrued DECIMAL(5,2) DEFAULT 0.00,
    employee_address_line1 VARCHAR(200),
    employee_address_line2 VARCHAR(200),
    employee_city VARCHAR(50),
    employee_state VARCHAR(50),
    employee_country VARCHAR(50),
    employee_postal_code VARCHAR(20),
    employee_birth_date DATE,
    employee_social_security VARCHAR(20),
    employee_tax_id VARCHAR(20)
);

-- Search practice: /employee_status, /employee_salary, /employee_contact

-- ================================================
-- FINANCIAL_ACCOUNTING - Search for "financial"
-- ================================================

CREATE TABLE financial_transactions_journal (
    financial_transaction_id SERIAL PRIMARY KEY,
    financial_transaction_number VARCHAR(50) UNIQUE NOT NULL,
    financial_transaction_date DATE NOT NULL,
    financial_transaction_type VARCHAR(50) NOT NULL,
    financial_account_debit_id INTEGER NOT NULL,
    financial_account_credit_id INTEGER NOT NULL,
    financial_debit_amount DECIMAL(12,2) NOT NULL,
    financial_credit_amount DECIMAL(12,2) NOT NULL,
    financial_transaction_description TEXT,
    financial_reference_number VARCHAR(100),
    financial_reference_type VARCHAR(50),
    financial_posted_by INTEGER,
    financial_posting_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    financial_period_year INTEGER,
    financial_period_month INTEGER,
    financial_status VARCHAR(20) DEFAULT 'PENDING',
    financial_approved_by INTEGER,
    financial_approval_date TIMESTAMP,
    financial_notes TEXT
);

-- Search patterns: /financial_transaction, /financial_account, /financial_amount

-- ================================================
-- ANALYTICS_REPORTING - Complex search patterns
-- ================================================

SELECT
    customer_master_table.customer_id,
    customer_master_table.customer_first_name,
    customer_master_table.customer_last_name,
    order_header_table.order_number,
    order_header_table.order_date,
    order_header_table.order_status,
    order_header_table.order_total_amount,
    SUM(order_line_items_table.order_line_total) as calculated_order_total,
    COUNT(order_line_items_table.order_line_id) as total_order_lines
FROM customer_master_table
JOIN order_header_table ON customer_master_table.customer_id = order_header_table.order_customer_id
JOIN order_line_items_table ON order_header_table.order_id = order_line_items_table.order_header_id
WHERE customer_master_table.customer_status = 'ACTIVE'
    AND order_header_table.order_status IN ('COMPLETED', 'SHIPPED', 'DELIVERED')
    AND order_header_table.order_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY
    customer_master_table.customer_id,
    customer_master_table.customer_first_name,
    customer_master_table.customer_last_name,
    order_header_table.order_number,
    order_header_table.order_date,
    order_header_table.order_status,
    order_header_table.order_total_amount
HAVING COUNT(order_line_items_table.order_line_id) > 1
ORDER BY order_header_table.order_date DESC, order_header_table.order_total_amount DESC;

-- Practice complex searches: /customer_master, /order_header, /order_line

-- ================================================
-- PERFORMANCE_METRICS - Search patterns practice
-- ================================================

WITH customer_performance_metrics AS (
    SELECT
        customer_master_table.customer_id,
        customer_master_table.customer_code,
        customer_master_table.customer_first_name || ' ' || customer_master_table.customer_last_name as customer_full_name,
        customer_master_table.customer_loyalty_tier,
        COUNT(DISTINCT order_header_table.order_id) as customer_total_orders,
        SUM(order_header_table.order_total_amount) as customer_lifetime_value,
        AVG(order_header_table.order_total_amount) as customer_average_order_value,
        MAX(order_header_table.order_date) as customer_last_order_date,
        MIN(order_header_table.order_date) as customer_first_order_date
    FROM customer_master_table
    LEFT JOIN order_header_table ON customer_master_table.customer_id = order_header_table.order_customer_id
    WHERE customer_master_table.customer_status = 'ACTIVE'
    GROUP BY
        customer_master_table.customer_id,
        customer_master_table.customer_code,
        customer_master_table.customer_first_name,
        customer_master_table.customer_last_name,
        customer_master_table.customer_loyalty_tier
),
product_performance_metrics AS (
    SELECT
        product_catalog_master.product_id,
        product_catalog_master.product_sku,
        product_catalog_master.product_name,
        product_catalog_master.product_category_id,
        SUM(order_line_items_table.order_line_quantity) as product_total_quantity_sold,
        SUM(order_line_items_table.order_line_total) as product_total_revenue,
        AVG(order_line_items_table.order_line_unit_price) as product_average_selling_price,
        COUNT(DISTINCT order_line_items_table.order_header_id) as product_order_frequency
    FROM product_catalog_master
    LEFT JOIN order_line_items_table ON product_catalog_master.product_id = order_line_items_table.order_product_id
    WHERE product_catalog_master.product_status = 'ACTIVE'
    GROUP BY
        product_catalog_master.product_id,
        product_catalog_master.product_sku,
        product_catalog_master.product_name,
        product_catalog_master.product_category_id
)
SELECT
    'Customer Performance' as metric_category,
    customer_performance_metrics.customer_code as entity_code,
    customer_performance_metrics.customer_full_name as entity_name,
    customer_performance_metrics.customer_total_orders as total_transactions,
    customer_performance_metrics.customer_lifetime_value as total_value
FROM customer_performance_metrics
WHERE customer_performance_metrics.customer_total_orders > 0

UNION ALL

SELECT
    'Product Performance' as metric_category,
    product_performance_metrics.product_sku as entity_code,
    product_performance_metrics.product_name as entity_name,
    product_performance_metrics.product_order_frequency as total_transactions,
    product_performance_metrics.product_total_revenue as total_value
FROM product_performance_metrics
WHERE product_performance_metrics.product_total_quantity_sold > 0

ORDER BY metric_category, total_value DESC;

-- Final search practice: Try searching for specific table patterns
-- /customer_performance_metrics, /product_performance_metrics
-- /total_transactions, /total_value, /metric_category