/**
 * Day 40: Advanced Yanking Practice - Register Orchestration
 *
 * This file contains complex scenarios for practicing advanced yanking and
 * register orchestration techniques.
 *
 * Key commands to practice:
 * - "ay (yank to named register 'a')
 * - "Ay (append to named register 'a')
 * - "+y (yank to system clipboard)
 * - "*y (yank to selection clipboard)
 * - "0p (paste from yank register)
 * - "1p (paste from first delete register)
 * - :reg (view all registers)
 * - Ctrl-r a (insert from register 'a' in insert mode)
 */

// REGISTER ORCHESTRATION EXERCISE 1: API Configuration Templates
// Practice yanking different configurations to different registers for mixing/matching

// Configuration A - Store in register 'a'
const developmentConfig = {
  apiUrl: 'http://localhost:3000/api',
  databaseUrl: 'postgresql://localhost:5432/myapp_dev',
  redisUrl: 'redis://localhost:6379',
  logLevel: 'debug',
  enableCors: true,
  corsOrigins: ['http://localhost:3000', 'http://localhost:3001'],
  jwtSecret: 'dev_secret_key_123',
  sessionSecret: 'dev_session_secret',
  smtpHost: 'smtp.mailtrap.io',
  smtpPort: 2525,
  enableSsl: false
};

// Configuration B - Store in register 'b'
const stagingConfig = {
  apiUrl: 'https://staging-api.example.com',
  databaseUrl: process.env.STAGING_DATABASE_URL,
  redisUrl: process.env.STAGING_REDIS_URL,
  logLevel: 'info',
  enableCors: true,
  corsOrigins: ['https://staging.example.com'],
  jwtSecret: process.env.STAGING_JWT_SECRET,
  sessionSecret: process.env.STAGING_SESSION_SECRET,
  smtpHost: 'smtp.sendgrid.net',
  smtpPort: 587,
  enableSsl: true
};

// Configuration C - Store in register 'c'
const productionConfig = {
  apiUrl: 'https://api.example.com',
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  logLevel: 'error',
  enableCors: false,
  corsOrigins: ['https://example.com', 'https://www.example.com'],
  jwtSecret: process.env.JWT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  enableSsl: true
};

// REGISTER ORCHESTRATION EXERCISE 2: Component Templates
// Practice collecting component parts to different registers

// Header Component - Store in register 'h'
const HeaderComponent = `
import React from 'react';
import './Header.css';

const Header = ({ user, onLogout, onToggleMenu }) => {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-logo">
          <img src="/logo.svg" alt="Logo" />
          <span className="app-title">MyApp</span>
        </div>

        <nav className="header-navigation">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/products" className="nav-link">Products</a>
          <a href="/orders" className="nav-link">Orders</a>
          <a href="/settings" className="nav-link">Settings</a>
        </nav>

        <div className="header-actions">
          <span className="user-name">Welcome, {user.firstName}</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
`;

// Footer Component - Store in register 'f'
const FooterComponent = `
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/press">Press</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/documentation">Documentation</a></li>
            <li><a href="/community">Community</a></li>
            <li><a href="/status">System Status</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/cookies">Cookie Policy</a></li>
            <li><a href="/security">Security</a></li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} MyApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
`;

// Sidebar Component - Store in register 's'
const SidebarComponent = `
import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, currentUser }) => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { id: 'products', label: 'Products', icon: '📦', path: '/products' },
    { id: 'orders', label: 'Orders', icon: '🛒', path: '/orders' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    { id: 'help', label: 'Help', icon: '❓', path: '/help' }
  ];

  return (
    <aside className={\`sidebar \${isOpen ? 'sidebar--open' : ''}\`}>
      <div className="sidebar-header">
        <div className="user-info">
          <img
            src={currentUser.avatar || '/default-avatar.png'}
            alt="User Avatar"
            className="user-avatar"
          />
          <div className="user-details">
            <span className="user-name">{currentUser.firstName} {currentUser.lastName}</span>
            <span className="user-role">{currentUser.role}</span>
          </div>
        </div>
        <button onClick={onClose} className="sidebar-close">×</button>
      </div>

      <nav className="sidebar-navigation">
        {menuItems.map(item => (
          <a
            key={item.id}
            href={item.path}
            className={\`nav-item \${activeSection === item.id ? 'nav-item--active' : ''}\`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
`;

// REGISTER ORCHESTRATION EXERCISE 3: Database Schemas
// Practice collecting different table schemas to different registers

// Users Table Schema - Store in register 'u'
const usersTableSchema = `
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  phone_number VARCHAR(20),
  avatar_url TEXT,
  bio TEXT,
  website VARCHAR(255),
  location VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  last_login_at TIMESTAMP,
  login_count INTEGER DEFAULT 0,
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_uuid ON users(uuid);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_verified ON users(is_verified);
`;

// Products Table Schema - Store in register 'p'
const productsTableSchema = `
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  sku VARCHAR(100) UNIQUE NOT NULL,
  barcode VARCHAR(255),
  price DECIMAL(12,2) NOT NULL,
  cost_price DECIMAL(12,2),
  compare_at_price DECIMAL(12,2),
  weight DECIMAL(8,3),
  dimensions JSONB,
  category_id INTEGER REFERENCES categories(id),
  brand_id INTEGER REFERENCES brands(id),
  vendor_id INTEGER REFERENCES vendors(id),
  tags JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  attributes JSONB DEFAULT '{}',
  variants JSONB DEFAULT '[]',
  inventory_quantity INTEGER DEFAULT 0,
  inventory_policy VARCHAR(20) DEFAULT 'deny',
  track_inventory BOOLEAN DEFAULT TRUE,
  allow_backorders BOOLEAN DEFAULT FALSE,
  requires_shipping BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords VARCHAR(500),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
`;

// Orders Table Schema - Store in register 'o'
const ordersTableSchema = `
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id),
  guest_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
  currency VARCHAR(3) DEFAULT 'USD',
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(8,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL,
  billing_address JSONB,
  shipping_address JSONB,
  shipping_method VARCHAR(100),
  payment_method VARCHAR(100),
  payment_reference VARCHAR(255),
  notes TEXT,
  internal_notes TEXT,
  discount_codes JSONB DEFAULT '[]',
  line_items JSONB DEFAULT '[]',
  shipping_lines JSONB DEFAULT '[]',
  tax_lines JSONB DEFAULT '[]',
  refunds JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  custom_attributes JSONB DEFAULT '{}',
  cancelled_at TIMESTAMP,
  cancel_reason VARCHAR(255),
  processed_at TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
`;

// REGISTER ORCHESTRATION EXERCISE 4: API Route Handlers
// Practice collecting different route handlers to different registers

// User Routes - Store in register 'r'
const userRoutes = `
// GET /api/users
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;

    const filters = {};
    if (search) {
      filters[Op.or] = [
        { firstName: { [Op.iLike]: \`%\${search}%\` } },
        { lastName: { [Op.iLike]: \`%\${search}%\` } },
        { email: { [Op.iLike]: \`%\${search}%\` } }
      ];
    }
    if (role) filters.role = role;
    if (status) filters.isActive = status === 'active';

    const offset = (page - 1) * limit;
    const users = await User.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['passwordHash'] }
    });

    res.json({
      users: users.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.count,
        pages: Math.ceil(users.count / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
      role: role || 'user'
    });

    const { passwordHash: _, ...userResponse } = user.toJSON();
    res.status(201).json({ user: userResponse });
  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
`;

// REGISTER ORCHESTRATION EXERCISE 5: Test Suites
// Practice collecting different test patterns to different registers

// Unit Tests - Store in register 't'
const unitTests = `
describe('UserService', () => {
  let userService;
  let mockDatabase;

  beforeEach(() => {
    mockDatabase = {
      findUser: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn()
    };

    userService = new UserService(mockDatabase);
  });

  describe('authenticateUser', () => {
    it('should authenticate user with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        passwordHash: 'hashed_password'
      };

      mockDatabase.findUser.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await userService.authenticateUser({
        email: 'test@example.com',
        password: 'correct_password'
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should reject authentication with invalid credentials', async () => {
      mockDatabase.findUser.mockResolvedValue(null);

      const result = await userService.authenticateUser({
        email: 'nonexistent@example.com',
        password: 'any_password'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid credentials');
    });
  });
});
`;

export {
  developmentConfig,
  stagingConfig,
  productionConfig,
  HeaderComponent,
  FooterComponent,
  SidebarComponent,
  usersTableSchema,
  productsTableSchema,
  ordersTableSchema,
  userRoutes,
  unitTests
};