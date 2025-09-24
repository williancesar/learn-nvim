/**
 * Day 36: Case Operations Practice - Mixed Case Text
 *
 * This file contains text with various case patterns for practicing case conversion.
 * Focus on using Vim's case changing operators efficiently.
 *
 * Key commands to practice:
 * - ~ (toggle case of character under cursor)
 * - g~motion (toggle case for motion)
 * - gUmotion (uppercase for motion)
 * - gumotion (lowercase for motion)
 * - g~~ (toggle case for entire line)
 * - gUU (uppercase entire line)
 * - guu (lowercase entire line)
 */

// CASE EXERCISE 1: Mixed case variable names needing standardization
// Practice converting between camelCase, snake_case, and PascalCase
const UserName = 'john_doe';
const user_email = 'JOHN@EXAMPLE.COM';
const UserAge = 25;
const user_phone_number = '+1-555-0123';
const UserAddress = '123 main street';
const user_city = 'SAN FRANCISCO';
const UserState = 'california';
const user_zip_code = '94102';
const UserCountry = 'UNITED STATES';
const user_created_at = '2023-01-15T10:30:00Z';

// CASE EXERCISE 2: API endpoint constants needing consistent casing
const API_BASE_URL = 'https://api.example.com';
const user_endpoints = {
  get_user: '/api/v1/Users/:id',
  CREATE_USER: '/api/v1/users',
  Update_User: '/api/v1/USERS/:id',
  delete_user: '/API/V1/users/:id',
  LIST_USERS: '/api/V1/Users'
};

const Product_Endpoints = {
  get_product: '/API/v1/products/:ID',
  create_PRODUCT: '/api/v1/PRODUCTS',
  UPDATE_product: '/Api/V1/Products/:Id',
  Delete_Product: '/api/v1/PRODUCTS/:id',
  list_products: '/API/V1/products'
};

// CASE EXERCISE 3: Database column names with inconsistent casing
const database_schema = {
  users_table: {
    User_Id: 'INTEGER PRIMARY KEY',
    first_NAME: 'VARCHAR(50)',
    Last_Name: 'VARCHAR(50)',
    EMAIL_address: 'varchar(255)',
    Phone_Number: 'VARCHAR(20)',
    created_AT: 'TIMESTAMP',
    Updated_At: 'timestamp',
    IS_active: 'BOOLEAN',
    is_VERIFIED: 'boolean'
  },

  PRODUCTS_table: {
    product_ID: 'integer primary key',
    Product_Name: 'VARCHAR(200)',
    product_DESCRIPTION: 'text',
    PRODUCT_price: 'decimal(10,2)',
    category_ID: 'INTEGER',
    Brand_Id: 'integer',
    created_at: 'TIMESTAMP',
    UPDATED_at: 'timestamp',
    is_ACTIVE: 'boolean'
  }
};

// CASE EXERCISE 4: HTML/CSS class names needing standardization
const html_classes = [
  'User-Profile-Container',
  'user_navigation_menu',
  'CONTENT-SECTION-HEADER',
  'sidebar_widget_area',
  'Footer-Copyright-Text',
  'BUTTON-PRIMARY-LARGE',
  'input_field_error',
  'Modal-Dialog-Content',
  'NAVIGATION-BREADCRUMB',
  'card_header_title'
];

const css_properties = {
  'Background-Color': '#ffffff',
  'FONT-size': '16px',
  'margin_top': '10px',
  'Padding-Bottom': '20px',
  'BORDER-radius': '4px',
  'box_shadow': '0 2px 4px rgba(0,0,0,0.1)',
  'Text-Align': 'center',
  'LINE-height': '1.5',
  'FONT-weight': 'bold',
  'color': '#333333'
};

// CASE EXERCISE 5: Error messages with inconsistent casing
const Error_Messages = {
  AUTHENTICATION: {
    invalid_credentials: 'INVALID EMAIL OR PASSWORD PROVIDED',
    Token_Expired: 'authentication token has expired',
    ACCESS_denied: 'Access Denied For This Resource',
    account_LOCKED: 'ACCOUNT HAS BEEN TEMPORARILY LOCKED'
  },

  validation_errors: {
    REQUIRED_field: 'this field is required',
    Invalid_Email: 'PLEASE PROVIDE A VALID EMAIL ADDRESS',
    password_TOO_weak: 'Password Must Contain At Least 8 Characters',
    INVALID_phone: 'please provide a valid phone number'
  },

  Database_Errors: {
    connection_FAILED: 'UNABLE TO CONNECT TO DATABASE',
    Query_Timeout: 'database query timeout',
    DUPLICATE_entry: 'Record Already Exists',
    foreign_KEY_constraint: 'CANNOT DELETE RECORD DUE TO EXISTING REFERENCES'
  }
};

// CASE EXERCISE 6: Function names with mixed conventions
function Calculate_Total_Price(BASE_price, tax_Rate, DISCOUNT_rate) {
  const Sub_Total = BASE_price - (BASE_price * DISCOUNT_rate);
  const TAX_amount = Sub_Total * tax_Rate;
  const total_PRICE = Sub_Total + TAX_amount;
  return total_PRICE;
}

function Process_User_Registration(FIRST_name, last_NAME, email_ADDRESS) {
  const User_Data = {
    firstName: FIRST_name,
    LastName: last_NAME,
    Email: email_ADDRESS,
    Created_At: new Date().toISOString()
  };
  return User_Data;
}

function Generate_Product_Report(PRODUCT_id, start_DATE, end_Date) {
  const Report_Data = {
    ProductId: PRODUCT_id,
    Start_Date: start_DATE,
    endDate: end_Date,
    generated_AT: new Date().toISOString()
  };
  return Report_Data;
}

// CASE EXERCISE 7: Configuration object keys
const Application_Config = {
  Server_Settings: {
    HOST_name: 'localhost',
    Port_Number: 3000,
    SSL_enabled: false,
    REQUEST_timeout: 30000
  },

  database_CONFIG: {
    host_ADDRESS: 'localhost',
    PORT_number: 5432,
    Database_Name: 'myapp',
    USER_name: 'admin',
    password_HASH: 'encrypted_password'
  },

  REDIS_settings: {
    host_name: 'localhost',
    Port_NUMBER: 6379,
    Password_Required: false,
    CONNECTION_timeout: 5000
  }
};

// CASE EXERCISE 8: Test case descriptions
const Test_Descriptions = [
  'IT SHOULD CREATE USER WITH VALID DATA',
  'it should update user with valid data',
  'It Should Delete User With Valid Id',
  'IT should get user with valid id',
  'it SHOULD list all users',
  'It Should Create Product With Valid Data',
  'IT SHOULD UPDATE PRODUCT WITH VALID DATA',
  'it should delete product with valid id',
  'It Should Get Product With Valid Id',
  'IT should list all products'
];

// CASE EXERCISE 9: File and directory names
const File_Paths = [
  '/src/Components/User-Profile.jsx',
  '/SRC/components/PRODUCT-list.jsx',
  '/src/COMPONENTS/order_history.jsx',
  '/Src/Components/Shopping-Cart.JSX',
  '/src/components/navigation_MENU.jsx',
  '/SRC/Components/Footer-Section.jsx',
  '/src/UTILS/api_client.js',
  '/Src/Utils/VALIDATION-helpers.js',
  '/src/utils/date_FORMATTER.js',
  '/SRC/UTILS/String-Utilities.JS'
];

// CASE EXERCISE 10: Environment variable names
const Environment_Variables = {
  node_ENV: 'development',
  PORT_number: 3000,
  DATABASE_url: 'postgresql://localhost:5432/myapp',
  redis_URL: 'redis://localhost:6379',
  JWT_secret_KEY: 'super_secret_key',
  SMTP_host_NAME: 'smtp.gmail.com',
  smtp_PORT: 587,
  AWS_access_KEY: 'access_key_123',
  aws_SECRET_key: 'secret_key_456',
  S3_bucket_NAME: 'my-app-uploads'
};

// CASE EXERCISE 11: React component prop names
const Component_Props = {
  User_Profile_Props: {
    user_NAME: 'John Doe',
    USER_email: 'john@example.com',
    profile_IMAGE_url: '/images/profile.jpg',
    IS_verified: true,
    LAST_login_date: '2023-12-10',
    Account_Status: 'active'
  },

  Product_Card_PROPS: {
    product_NAME: 'Wireless Headphones',
    PRODUCT_price: 199.99,
    image_URL: '/images/headphones.jpg',
    IS_in_stock: true,
    RATING_score: 4.5,
    review_COUNT: 324
  },

  ORDER_summary_props: {
    order_ID: 'ORD-123456',
    CUSTOMER_name: 'Jane Smith',
    total_AMOUNT: 299.99,
    Order_Status: 'pending',
    CREATED_date: '2023-12-10',
    estimated_DELIVERY: '2023-12-15'
  }
};

// CASE EXERCISE 12: SQL query components
const SQL_Queries = {
  SELECT_statements: [
    'SELECT User_Id, First_Name, LAST_name FROM users',
    'select PRODUCT_id, product_NAME, Price from PRODUCTS',
    'Select Order_ID, Customer_ID, TOTAL_amount From Orders',
    'SELECT Category_Id, CATEGORY_name, Description FROM categories'
  ],

  INSERT_statements: [
    'INSERT INTO Users (First_Name, LAST_name, Email) VALUES',
    'insert into PRODUCTS (product_NAME, Price, CATEGORY_id) values',
    'Insert Into Orders (CUSTOMER_id, Total_Amount, STATUS) Values',
    'INSERT into Categories (CATEGORY_name, Description, PARENT_id) VALUES'
  ],

  UPDATE_statements: [
    'UPDATE Users SET First_Name = ?, LAST_name = ? WHERE User_Id = ?',
    'update PRODUCTS set PRODUCT_name = ?, Price = ? where PRODUCT_id = ?',
    'Update Orders SET STATUS = ?, Updated_At = NOW() WHERE Order_ID = ?',
    'UPDATE Categories SET CATEGORY_name = ? WHERE Category_Id = ?'
  ]
};

// CASE EXERCISE 13: JSON API response keys
const API_Responses = {
  USER_response: {
    User_Id: 123,
    FIRST_name: 'john',
    last_NAME: 'DOE',
    email_ADDRESS: 'JOHN@EXAMPLE.COM',
    Phone_Number: '+1-555-0123',
    created_AT: '2023-01-15T10:30:00Z',
    IS_active: true,
    Account_Type: 'PREMIUM'
  },

  product_RESPONSE: {
    PRODUCT_id: 456,
    product_NAME: 'WIRELESS HEADPHONES',
    Description: 'high quality wireless headphones',
    PRICE_amount: 199.99,
    category_NAME: 'ELECTRONICS',
    Brand_Name: 'audiotech',
    IN_stock: true,
    Stock_Quantity: 50
  }
};

export {
  UserName,
  user_email,
  API_BASE_URL,
  user_endpoints,
  database_schema,
  html_classes,
  Error_Messages,
  Calculate_Total_Price,
  Application_Config,
  Test_Descriptions,
  File_Paths,
  Environment_Variables,
  Component_Props,
  SQL_Queries,
  API_Responses
};