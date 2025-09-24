/**
 * Day 16: Screen Navigation Practice - H, M, L, Ctrl-d, Ctrl-u
 * This long file is designed for practicing screen navigation commands
 * Use H (top), M (middle), L (bottom), Ctrl-d (half page down), Ctrl-u (half page up)
 * The file contains a complete React application with many components and functions
 */

import React, { useState, useEffect, useCallback, useMemo, useRef, useContext, createContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { debounce, throttle } from 'lodash';
import moment from 'moment';

// Global application context and state management
const AppContext = createContext();
const UserContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

// Theme configuration and styling constants
const THEME_CONFIG = {
  light: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    background: '#ffffff',
    text: '#212529',
    border: '#dee2e6'
  },
  dark: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    background: '#212529',
    text: '#f8f9fa',
    border: '#495057'
  }
};

// API configuration and endpoint definitions
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  endpoints: {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      register: '/auth/register',
      refresh: '/auth/refresh',
      profile: '/auth/profile'
    },
    users: {
      list: '/users',
      create: '/users',
      update: '/users/:id',
      delete: '/users/:id',
      profile: '/users/:id/profile'
    },
    products: {
      list: '/products',
      create: '/products',
      update: '/products/:id',
      delete: '/products/:id',
      categories: '/products/categories',
      search: '/products/search'
    },
    orders: {
      list: '/orders',
      create: '/orders',
      update: '/orders/:id',
      cancel: '/orders/:id/cancel',
      history: '/orders/history'
    }
  }
};

// Custom hooks for application functionality
function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(API_CONFIG.endpoints.auth.login, credentials);
      const { user, token } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(API_CONFIG.endpoints.auth.logout);
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.post(API_CONFIG.endpoints.auth.refresh);
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return token;
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Verify token and get user profile
      axios.get(API_CONFIG.endpoints.auth.profile)
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, login, logout, refreshToken };
}

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(url, options);
      setData(response.data);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Main application component with routing and context providers
function App() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [notifications, setNotifications] = useState([]);
  const { user, loading, login, logout } = useAuth();

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);

    if (notification.autoRemove !== false) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, notification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, [setTheme]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: THEME_CONFIG[theme] }}>
      <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
        <UserContext.Provider value={{ user, login, logout }}>
          <Router>
            <div className={`app ${theme}`}>
              <Header />
              <NotificationContainer />
              <main className="main-content">
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  <Route path="/login" component={LoginPage} />
                  <Route path="/register" component={RegisterPage} />
                  <Route path="/profile" component={ProfilePage} />
                  <Route path="/products" component={ProductsPage} />
                  <Route path="/product/:id" component={ProductDetailPage} />
                  <Route path="/cart" component={CartPage} />
                  <Route path="/orders" component={OrdersPage} />
                  <Route path="/order/:id" component={OrderDetailPage} />
                  <Route path="/admin" component={AdminDashboard} />
                  <Route component={NotFoundPage} />
                </Switch>
              </main>
              <Footer />
            </div>
          </Router>
        </UserContext.Provider>
      </NotificationContext.Provider>
    </ThemeContext.Provider>
  );
}

// Header component with navigation and user menu
function Header() {
  const { user, logout } = useContext(UserContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsMenuOpen(false);
  }, [logout]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="/logo.svg" alt="Company Logo" />
            <span>E-Commerce</span>
          </Link>

          <nav className="main-nav">
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
            <Link to="/deals" className="nav-link">Deals</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="header-actions">
            <SearchBox />
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <Link to="/cart" className="cart-link">
              <CartIcon />
              <span className="cart-count">3</span>
            </Link>

            {user ? (
              <div className="user-menu" ref={menuRef}>
                <button
                  className="user-avatar"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
                </button>

                {isMenuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <Link to="/orders" className="dropdown-item">Orders</Link>
                    <Link to="/wishlist" className="dropdown-item">Wishlist</Link>
                    <Link to="/settings" className="dropdown-item">Settings</Link>
                    <hr className="dropdown-divider" />
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item">Admin Dashboard</Link>
                    )}
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Search functionality with debounced input
function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef(null);

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await axios.get(`${API_CONFIG.endpoints.products.search}?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data.results || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-box" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        <button className="search-button" type="button">
          {isSearching ? <Spinner size="small" /> : <SearchIcon />}
        </button>
      </div>

      {showResults && (
        <div className="search-results">
          {results.length > 0 ? (
            <>
              <div className="search-results-header">
                <span>Products ({results.length})</span>
                <Link to={`/search?q=${encodeURIComponent(query)}`}>
                  View all results
                </Link>
              </div>
              <div className="search-results-list">
                {results.slice(0, 5).map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="search-result-item"
                    onClick={() => setShowResults(false)}
                  >
                    <img src={product.thumbnail} alt={product.name} />
                    <div className="result-info">
                      <span className="result-name">{product.name}</span>
                      <span className="result-price">${product.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : query.trim() && !isSearching ? (
            <div className="no-results">
              <p>No products found for "{query}"</p>
              <Link to="/products">Browse all products</Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default App;