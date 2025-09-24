-- PostgreSQL Practice: Visual Block Operations
-- Day 25: Data tables perfect for visual block editing (Ctrl+V)
-- Practice selecting columns, editing multiple lines simultaneously

-- ==========================================
-- SALES REPRESENTATIVES DATA TABLE
-- ==========================================
-- Perfect for visual block editing - select columns vertically

INSERT INTO sales_representatives (rep_id, first_name, last_name, territory, quota_target, current_sales) VALUES
(101, 'John',        'Smith',      'Northeast', 250000.00, 180000.00),
(102, 'Sarah',       'Johnson',    'Southeast', 275000.00, 220000.00),
(103, 'Michael',     'Williams',   'Midwest',   300000.00, 285000.00),
(104, 'Jessica',     'Brown',      'Southwest', 225000.00, 190000.00),
(105, 'David',       'Davis',      'West',      350000.00, 315000.00),
(106, 'Emily',       'Wilson',     'Northeast', 250000.00, 195000.00),
(107, 'Robert',      'Miller',     'Southeast', 275000.00, 260000.00),
(108, 'Ashley',      'Moore',      'Midwest',   300000.00, 270000.00),
(109, 'Christopher', 'Taylor',     'Southwest', 225000.00, 210000.00),
(110, 'Amanda',      'Anderson',   'West',      350000.00, 340000.00),
(111, 'Joshua',      'Thomas',     'Northeast', 250000.00, 175000.00),
(112, 'Melissa',     'Jackson',    'Southeast', 275000.00, 245000.00),
(113, 'Matthew',     'White',      'Midwest',   300000.00, 295000.00),
(114, 'Stephanie',   'Harris',     'Southwest', 225000.00, 205000.00),
(115, 'Andrew',      'Martin',     'West',      350000.00, 325000.00);

-- Practice: Use Ctrl+V to select the quota_target column and modify all values
-- Practice: Select the territory column and change all 'Northeast' to 'NE'

-- ==========================================
-- PRODUCT PRICING TABLE
-- ==========================================
-- Aligned columns for visual block selection practice

INSERT INTO product_pricing (sku, product_name, cost_price, retail_price, wholesale_price, margin_pct) VALUES
('LAP001', 'Gaming Laptop Ultra',     1200.00,  1999.99,  1500.00,  39.95),
('MON001', '4K Monitor 27inch',        300.00,   599.99,   450.00,   49.95),
('KEY001', 'Mechanical RGB Keyboard',   45.00,   129.99,    85.00,   65.40),
('MOU001', 'Wireless Gaming Mouse',     25.00,    79.99,    55.00,   68.75),
('HEA001', 'Noise Cancel Headset',      80.00,   199.99,   140.00,   59.95),
('TAB001', 'Tablet Pro 12inch',        400.00,   799.99,   600.00,   49.95),
('PHO001', 'Smartphone Premium',       500.00,   999.99,   750.00,   49.95),
('SPE001', 'Bluetooth Speaker',         30.00,    89.99,    60.00,   66.65),
('CAM001', 'Webcam 4K Ultra',          120.00,   299.99,   200.00,   59.95),
('PRI001', 'Laser Printer Color',      200.00,   499.99,   350.00,   59.95),
('STO001', 'External SSD 1TB',          80.00,   199.99,   130.00,   59.95),
('ROU001', 'WiFi Router 6E',            60.00,   149.99,   100.00,   59.95),
('CHA001', 'Wireless Charger Pad',      15.00,    49.99,    30.00,   69.95),
('CAB001', 'USB-C Cable 6ft',            5.00,    19.99,    12.00,   74.95),
('ADA001', 'USB Hub 7-Port',            20.00,    59.99,    35.00,   66.65);

-- Practice: Select the cost_price column and increase all values by 10%
-- Practice: Select retail_price column and round to nearest dollar
-- Practice: Use visual block to add currency symbols ($) to price columns

-- ==========================================
-- EMPLOYEE SCHEDULE TABLE
-- ==========================================
-- Perfect grid layout for column operations

INSERT INTO employee_schedule (emp_id, name, mon_hours, tue_hours, wed_hours, thu_hours, fri_hours, sat_hours, sun_hours) VALUES
(201, 'Alice Johnson',    8.0, 8.0, 8.0, 8.0, 8.0, 4.0, 0.0),
(202, 'Bob Wilson',       8.0, 8.0, 8.0, 8.0, 6.0, 0.0, 0.0),
(203, 'Carol Davis',      6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 0.0),
(204, 'Dave Miller',      8.0, 8.0, 8.0, 8.0, 8.0, 0.0, 4.0),
(205, 'Eva Brown',        8.0, 8.0, 8.0, 8.0, 4.0, 4.0, 0.0),
(206, 'Frank Taylor',     8.0, 8.0, 8.0, 8.0, 8.0, 0.0, 0.0),
(207, 'Grace Lee',        4.0, 8.0, 8.0, 8.0, 8.0, 4.0, 0.0),
(208, 'Henry Clark',      8.0, 8.0, 8.0, 8.0, 8.0, 8.0, 4.0),
(209, 'Ivy Martinez',     6.0, 6.0, 6.0, 6.0, 6.0, 0.0, 0.0),
(210, 'Jack Robinson',    8.0, 8.0, 8.0, 8.0, 8.0, 4.0, 4.0),
(211, 'Kelly White',      8.0, 8.0, 8.0, 8.0, 6.0, 0.0, 0.0),
(212, 'Luke Thompson',    8.0, 8.0, 8.0, 8.0, 8.0, 0.0, 0.0),
(213, 'Maya Garcia',      4.0, 4.0, 4.0, 4.0, 4.0, 8.0, 8.0),
(214, 'Noah Anderson',    8.0, 8.0, 8.0, 8.0, 8.0, 0.0, 0.0),
(215, 'Olivia Moore',     6.0, 8.0, 8.0, 8.0, 6.0, 4.0, 0.0);

-- Practice: Select all Friday hours and change them to 6.0
-- Practice: Select weekend columns (sat_hours, sun_hours) and set to 0.0
-- Practice: Use visual block to add '.5' to make all schedules 30 minutes longer

-- ==========================================
-- MONTHLY SALES FIGURES
-- ==========================================
-- Grid data perfect for visual block operations

INSERT INTO monthly_sales (region, jan_sales, feb_sales, mar_sales, apr_sales, may_sales, jun_sales, jul_sales, aug_sales, sep_sales, oct_sales, nov_sales, dec_sales) VALUES
('North',     125000,  130000,  145000,  155000,  160000,  170000,  175000,  180000,  165000,  170000,  185000,  195000),
('South',     110000,  115000,  125000,  135000,  140000,  150000,  155000,  160000,  145000,  150000,  165000,  175000),
('East',      135000,  140000,  155000,  165000,  170000,  180000,  185000,  190000,  175000,  180000,  195000,  205000),
('West',      145000,  150000,  165000,  175000,  180000,  190000,  195000,  200000,  185000,  190000,  205000,  215000),
('Central',   120000,  125000,  135000,  145000,  150000,  160000,  165000,  170000,  155000,  160000,  175000,  185000),
('Mountain',   95000,  100000,  110000,  120000,  125000,  135000,  140000,  145000,  130000,  135000,  150000,  160000),
('Pacific',   160000,  165000,  180000,  190000,  195000,  205000,  210000,  215000,  200000,  205000,  220000,  230000),
('Atlantic',  140000,  145000,  160000,  170000,  175000,  185000,  190000,  195000,  180000,  185000,  200000,  210000),
('Gulf',      105000,  110000,  120000,  130000,  135000,  145000,  150000,  155000,  140000,  145000,  160000,  170000),
('Lakes',     115000,  120000,  130000,  140000,  145000,  155000,  160000,  165000,  150000,  155000,  170000,  180000);

-- Practice: Select Q1 columns (jan, feb, mar) and increase by 5%
-- Practice: Select summer months (jun, jul, aug) for promotional analysis
-- Practice: Use visual block to format currency (add commas to large numbers)

-- ==========================================
-- INVENTORY LOCATIONS TABLE
-- ==========================================
-- Warehouse grid for location-based visual editing

INSERT INTO warehouse_inventory (product_code, warehouse_A, warehouse_B, warehouse_C, warehouse_D, warehouse_E, warehouse_F, total_stock) VALUES
('ELEC001',    45,   32,   28,   55,   41,   37,   238),
('ELEC002',    67,   45,   52,   38,   29,   44,   275),
('ELEC003',    23,   18,   15,   31,   26,   22,   135),
('FURN001',    12,    8,   14,   19,   11,   16,    80),
('FURN002',    34,   28,   31,   25,   22,   27,   167),
('FURN003',     8,    6,    9,   12,    7,   10,    52),
('CLOT001',    89,   76,   82,   68,   73,   79,   467),
('CLOT002',    56,   48,   61,   44,   51,   58,   318),
('CLOT003',    34,   29,   37,   31,   28,   35,   194),
('BOOK001',   156,  142,  128,  174,  163,  151,   914),
('BOOK002',    78,   65,   71,   83,   76,   72,   445),
('BOOK003',    23,   19,   26,   21,   24,   20,   133),
('SPOR001',    67,   54,   61,   48,   59,   52,   341),
('SPOR002',    89,   76,   83,   71,   78,   74,   471),
('SPOR003',    34,   28,   31,   37,   29,   35,   194);

-- Practice: Select specific warehouse columns and redistribute inventory
-- Practice: Use visual block to update multiple warehouse quantities
-- Practice: Select total_stock column and recalculate sums

-- ==========================================
-- CUSTOMER CONTACT MATRIX
-- ==========================================
-- Contact attempts tracking for visual block editing

INSERT INTO customer_contacts (customer_id, call_attempt_1, call_attempt_2, call_attempt_3, email_attempt_1, email_attempt_2, text_attempt_1, response_received) VALUES
(301, '2024-01-15', '2024-01-18', '2024-01-22', '2024-01-16', '2024-01-20', '2024-01-19', 'YES'),
(302, '2024-01-16', '2024-01-19', NULL,         '2024-01-17', '2024-01-21', '2024-01-20', 'YES'),
(303, '2024-01-17', '2024-01-20', '2024-01-24', '2024-01-18', NULL,         '2024-01-21', 'NO'),
(304, '2024-01-18', NULL,         NULL,         '2024-01-19', '2024-01-23', NULL,         'YES'),
(305, '2024-01-19', '2024-01-22', '2024-01-26', '2024-01-20', '2024-01-24', '2024-01-23', 'NO'),
(306, '2024-01-20', '2024-01-23', NULL,         '2024-01-21', '2024-01-25', '2024-01-24', 'YES'),
(307, '2024-01-21', NULL,         NULL,         '2024-01-22', NULL,         '2024-01-25', 'NO'),
(308, '2024-01-22', '2024-01-25', '2024-01-29', '2024-01-23', '2024-01-27', '2024-01-26', 'YES'),
(309, '2024-01-23', '2024-01-26', NULL,         '2024-01-24', '2024-01-28', '2024-01-27', 'NO'),
(310, '2024-01-24', NULL,         NULL,         '2024-01-25', NULL,         '2024-01-28', 'YES'),
(311, '2024-01-25', '2024-01-28', '2024-02-01', '2024-01-26', '2024-01-30', '2024-01-29', 'NO'),
(312, '2024-01-26', '2024-01-29', NULL,         '2024-01-27', '2024-01-31', '2024-01-30', 'YES'),
(313, '2024-01-27', NULL,         NULL,         '2024-01-28', NULL,         '2024-01-31', 'YES'),
(314, '2024-01-28', '2024-01-31', '2024-02-04', '2024-01-29', '2024-02-02', '2024-02-01', 'NO'),
(315, '2024-01-29', '2024-02-01', NULL,         '2024-01-30', '2024-02-03', '2024-02-02', 'YES');

-- Practice: Select call attempt columns and standardize date formats
-- Practice: Use visual block to change NULL values to 'N/A'
-- Practice: Select response_received column and change 'YES'/'NO' to 'Y'/'N'

-- ==========================================
-- PERFORMANCE SCORES MATRIX
-- ==========================================
-- Employee evaluation scores for visual block operations

INSERT INTO performance_scores (employee_name, q1_score, q2_score, q3_score, q4_score, teamwork, communication, innovation, leadership, overall_rating) VALUES
('Jennifer Adams',     85,  88,  92,  90,  4.2,  4.5,  3.8,  4.1,  'EXCELLENT'),
('Michael Brooks',     78,  82,  85,  87,  3.9,  4.1,  4.3,  3.7,  'GOOD'),
('Sarah Chen',         92,  95,  89,  93,  4.8,  4.6,  4.7,  4.5,  'EXCELLENT'),
('David Foster',       74,  77,  81,  79,  3.5,  3.8,  3.6,  3.4,  'SATISFACTORY'),
('Emily Garcia',       88,  91,  87,  89,  4.3,  4.4,  4.1,  4.2,  'EXCELLENT'),
('Robert Hill',        82,  85,  83,  86,  4.0,  3.9,  3.7,  4.1,  'GOOD'),
('Lisa Johnson',       95,  97,  94,  96,  4.9,  4.8,  4.6,  4.7,  'OUTSTANDING'),
('Kevin Lee',          76,  79,  82,  80,  3.7,  3.6,  3.9,  3.8,  'GOOD'),
('Maria Martinez',     89,  87,  91,  88,  4.4,  4.2,  4.3,  4.0,  'EXCELLENT'),
('James Miller',       71,  74,  76,  78,  3.3,  3.5,  3.4,  3.2,  'SATISFACTORY'),
('Amanda Nelson',      86,  89,  84,  87,  4.1,  4.3,  3.9,  4.0,  'GOOD'),
('Ryan Parker',        90,  93,  88,  91,  4.5,  4.4,  4.2,  4.3,  'EXCELLENT'),
('Nicole Roberts',     83,  86,  89,  85,  4.0,  4.2,  4.1,  3.9,  'GOOD'),
('Thomas Smith',       77,  80,  78,  81,  3.8,  3.7,  3.5,  3.6,  'SATISFACTORY'),
('Jessica Taylor',     91,  94,  92,  93,  4.6,  4.7,  4.4,  4.5,  'EXCELLENT');

-- Practice: Select quarterly score columns and calculate averages
-- Practice: Use visual block to update all scores by adding 2 points
-- Practice: Select skill rating columns (teamwork, communication, etc.) and round to 1 decimal

-- ==========================================
-- BUDGET ALLOCATION TABLE
-- ==========================================
-- Department budgets in aligned columns for visual editing

INSERT INTO department_budgets (department, personnel_cost, equipment_cost, training_cost, travel_cost, supplies_cost, overhead_cost, total_budget) VALUES
('Engineering',       450000,  75000,  25000,  15000,  10000,  85000,  660000),
('Marketing',         320000,  45000,  35000,  40000,  20000,  60000,  520000),
('Sales',             380000,  35000,  30000,  55000,  15000,  70000,  585000),
('HR',                180000,  15000,  40000,  10000,  12000,  35000,  292000),
('Finance',           220000,  25000,  20000,   8000,   8000,  40000,  321000),
('Operations',        290000,  85000,  15000,  12000,  25000,  55000,  482000),
('IT',                350000,  120000, 45000,  20000,  30000,  65000,  630000),
('Legal',             150000,  10000,  25000,   5000,   5000,  25000,  220000),
('R&D',               400000,  95000,  50000,  25000,  35000,  75000,  680000),
('Customer Support',  180000,  20000,  30000,   8000,  10000,  30000,  278000);

-- Practice: Select cost columns and increase by inflation rate (3%)
-- Practice: Use visual block to add thousand separators to large numbers
-- Practice: Select total_budget column and verify calculations

-- Final visual block challenge: Create a new column by selecting empty space
-- Practice using I (insert at beginning) and A (append at end) in visual block mode