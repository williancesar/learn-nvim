/**
 * Day 29: Register Practice - Multiple Copy/Paste Scenarios
 *
 * This file contains various code snippets designed for practicing Vim registers.
 * Practice copying different sections to different registers and pasting them
 * in various combinations.
 *
 * Key register commands to practice:
 * - "ayy (copy line to register 'a')
 * - "ap (paste from register 'a')
 * - "+yy (copy to system clipboard)
 * - "*yy (copy to selection clipboard)
 * - :reg (view all registers)
 */

// SECTION 1: User Authentication Module
class UserAuth {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 5000;
    this.retryAttempts = config.retryAttempts || 3;
  }

  async login(credentials) {
    const { username, password } = credentials;
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.storeToken(data.token);
        return { success: true, user: data.user };
      }

      throw new Error(`Login failed: ${response.statusText}`);
    } catch (error) {
      console.error('Authentication error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      this.clearToken();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.message);
      return { success: false, error: error.message };
    }
  }

  storeToken(token) {
    localStorage.setItem('authToken', token);
    sessionStorage.setItem('lastActivity', Date.now().toString());
  }

  clearToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('lastActivity');
  }
}

// SECTION 2: API Request Handler
class ApiClient {
  constructor(baseUrl, defaultHeaders = {}) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
    this.interceptors = [];
  }

  addInterceptor(interceptor) {
    this.interceptors.push(interceptor);
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  async request(endpoint, options) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    // Apply interceptors
    for (const interceptor of this.interceptors) {
      if (interceptor.request) {
        config = await interceptor.request(config);
      }
    }

    try {
      const response = await fetch(url, config);

      // Apply response interceptors
      for (const interceptor of this.interceptors) {
        if (interceptor.response) {
          response = await interceptor.response(response);
        }
      }

      return response;
    } catch (error) {
      console.error(`Request failed for ${url}:`, error);
      throw error;
    }
  }
}

// SECTION 3: Data Validation Utilities
const validators = {
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(value);
  },

  password: (value) => {
    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  },

  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  creditCard: (value) => {
    const cleaned = value.replace(/\s+/g, '');
    const cardRegex = /^\d{13,19}$/;

    if (!cardRegex.test(cleaned)) return false;

    // Luhn algorithm
    let sum = 0;
    let alternate = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);

      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }

      sum += digit;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  }
};

// SECTION 4: Form Handler Class
class FormHandler {
  constructor(formElement, validationRules = {}) {
    this.form = formElement;
    this.rules = validationRules;
    this.errors = {};
    this.touched = {};

    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', this.handleBlur.bind(this));
      input.addEventListener('input', this.handleInput.bind(this));
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const isValid = this.validateAll();
    if (isValid) {
      const formData = this.getFormData();
      this.onSubmit(formData);
    } else {
      this.displayErrors();
    }
  }

  handleBlur(event) {
    const { name, value } = event.target;
    this.touched[name] = true;
    this.validateField(name, value);
    this.updateFieldDisplay(name);
  }

  handleInput(event) {
    const { name, value } = event.target;
    if (this.touched[name]) {
      this.validateField(name, value);
      this.updateFieldDisplay(name);
    }
  }

  validateField(name, value) {
    const rule = this.rules[name];
    if (!rule) return true;

    this.errors[name] = [];

    if (rule.required && !value.trim()) {
      this.errors[name].push('This field is required');
      return false;
    }

    if (rule.validator && !rule.validator(value)) {
      this.errors[name].push(rule.message || 'Invalid value');
      return false;
    }

    return true;
  }

  validateAll() {
    const formData = this.getFormData();
    let isValid = true;

    Object.keys(this.rules).forEach(fieldName => {
      const value = formData[fieldName] || '';
      if (!this.validateField(fieldName, value)) {
        isValid = false;
      }
      this.touched[fieldName] = true;
    });

    return isValid;
  }

  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  updateFieldDisplay(name) {
    const field = this.form.querySelector(`[name="${name}"]`);
    const errorContainer = this.form.querySelector(`[data-error="${name}"]`);

    if (this.errors[name] && this.errors[name].length > 0) {
      field.classList.add('error');
      if (errorContainer) {
        errorContainer.textContent = this.errors[name][0];
        errorContainer.style.display = 'block';
      }
    } else {
      field.classList.remove('error');
      if (errorContainer) {
        errorContainer.style.display = 'none';
      }
    }
  }

  displayErrors() {
    Object.keys(this.errors).forEach(fieldName => {
      this.updateFieldDisplay(fieldName);
    });
  }

  onSubmit(data) {
    console.log('Form submitted:', data);
    // Override this method in subclasses
  }
}

// SECTION 5: Event Bus Implementation
class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    this.events.get(event).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  emit(event, data) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  off(event, callback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      callback(data);
      unsubscribe();
    });

    return unsubscribe;
  }

  clear(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }
}

// SECTION 6: Usage Examples and Configurations
const authConfig = {
  apiKey: 'your-api-key-here',
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  retryAttempts: 5
};

const apiClient = new ApiClient('https://api.example.com', {
  'Authorization': 'Bearer token',
  'User-Agent': 'MyApp/1.0'
});

const formRules = {
  email: {
    required: true,
    validator: validators.email,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    validator: validators.password,
    message: 'Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters'
  },
  phone: {
    required: false,
    validator: validators.phone,
    message: 'Please enter a valid phone number'
  }
};

const eventBus = new EventBus();

// Event listener examples
const unsubscribeAuth = eventBus.on('user:login', (userData) => {
  console.log('User logged in:', userData);
  // Update UI, redirect, etc.
});

const unsubscribeError = eventBus.on('api:error', (error) => {
  console.error('API Error:', error);
  // Show notification, log error, etc.
});

export { UserAuth, ApiClient, validators, FormHandler, EventBus };