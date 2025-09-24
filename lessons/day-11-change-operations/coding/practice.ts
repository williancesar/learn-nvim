/**
 * Day 11: Change Operations Practice with TypeScript
 *
 * This file contains outdated TypeScript patterns that you'll modernize using change operations.
 * Practice these change commands:
 * - c: Change (delete and enter insert mode)
 * - cc: Change entire line
 * - C: Change to end of line
 * - cw: Change word
 * - ciw: Change inner word
 * - caw: Change a word (including surrounding whitespace)
 * - ci): Change inside parentheses
 * - ca): Change around parentheses
 * - ci": Change inside quotes
 * - ca": Change around quotes
 * - ct{char}: Change until character
 * - cf{char}: Change find character
 * - s: Substitute character (delete char and enter insert mode)
 * - S: Substitute line (same as cc)
 * - r: Replace single character
 * - R: Replace mode (overwrite)
 */

// Legacy JavaScript-style TypeScript code to modernize

// Old: var declarations (change to const/let)
var globalConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
};

var userSettings = {
  theme: 'light',
  language: 'en',
  notifications: true
};

// Old: Function declarations without types (add proper typing)
function fetchUserData(userId) {
  return fetch(`${globalConfig.apiUrl}/users/${userId}`)
    .then(response => response.json())
    .then(data => data)
    .catch(error => console.error(error));
}

function calculateTotalPrice(items, taxRate, discountRate) {
  var subtotal = items.reduce(function(sum, item) {
    return sum + (item.price * item.quantity);
  }, 0);

  var discount = subtotal * discountRate;
  var afterDiscount = subtotal - discount;
  var tax = afterDiscount * taxRate;

  return afterDiscount + tax;
}

// Old: Classes without proper typing (modernize with interfaces and generics)
class LegacyApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.requestCounter = 0;
  }

  get(endpoint, params) {
    this.requestCounter++;
    const url = new URL(endpoint, this.baseUrl);

    if (params) {
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
    }

    return fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  post(endpoint, data) {
    this.requestCounter++;
    return fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json());
  }

  delete(endpoint) {
    this.requestCounter++;
    return fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    }).then(response => response.ok);
  }
}

// Old: Any types everywhere (replace with proper types)
class DataProcessor {
  constructor() {
    this.cache = new Map();
    this.processors = [];
  }

  addProcessor(processor) {
    this.processors.push(processor);
  }

  processData(data, options) {
    let result = data;

    for (let processor of this.processors) {
      result = processor.process(result, options);
    }

    return result;
  }

  processArray(items, transformer) {
    return items.map(transformer);
  }

  filterData(data, predicate) {
    if (Array.isArray(data)) {
      return data.filter(predicate);
    }

    const result = {};
    for (const key in data) {
      if (predicate(data[key], key)) {
        result[key] = data[key];
      }
    }
    return result;
  }

  cacheResult(key, value, ttl) {
    this.cache.set(key, {
      value: value,
      expires: Date.now() + (ttl || 300000) // 5 minutes default
    });
  }

  getCachedResult(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }
}

// Old: String concatenation instead of template literals
function generateApiEndpoint(baseUrl, version, resource, id, action) {
  var endpoint = baseUrl + '/api/v' + version + '/' + resource;

  if (id !== null && id !== undefined) {
    endpoint = endpoint + '/' + id;
  }

  if (action) {
    endpoint = endpoint + '/' + action;
  }

  return endpoint;
}

function createErrorMessage(operation, error, context) {
  return 'Error during ' + operation + ': ' + error.message +
         ' (Context: ' + JSON.stringify(context) + ')';
}

// Old: Callback-based async patterns (modernize to async/await)
function loadUserProfile(userId, callback) {
  fetchUserData(userId)
    .then(function(userData) {
      fetchUserPreferences(userId, function(preferences, error) {
        if (error) {
          callback(null, error);
          return;
        }

        fetchUserPermissions(userId, function(permissions, permError) {
          if (permError) {
            callback(null, permError);
            return;
          }

          var profile = {
            user: userData,
            preferences: preferences,
            permissions: permissions,
            loadedAt: new Date()
          };

          callback(profile, null);
        });
      });
    })
    .catch(function(error) {
      callback(null, error);
    });
}

function fetchUserPreferences(userId, callback) {
  setTimeout(function() {
    // Simulate API call
    var preferences = {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC'
    };
    callback(preferences, null);
  }, 100);
}

function fetchUserPermissions(userId, callback) {
  setTimeout(function() {
    // Simulate API call
    var permissions = ['read', 'write', 'delete'];
    callback(permissions, null);
  }, 150);
}

// Old: Manual object property checks (use optional chaining and nullish coalescing)
function getUserDisplayName(user) {
  var displayName;

  if (user && user.profile && user.profile.displayName) {
    displayName = user.profile.displayName;
  } else if (user && user.firstName && user.lastName) {
    displayName = user.firstName + ' ' + user.lastName;
  } else if (user && user.firstName) {
    displayName = user.firstName;
  } else if (user && user.email) {
    displayName = user.email.split('@')[0];
  } else {
    displayName = 'Anonymous User';
  }

  return displayName;
}

function getConfigValue(config, path, defaultValue) {
  var value = config;
  var keys = path.split('.');

  for (var i = 0; i < keys.length; i++) {
    if (value && typeof value === 'object' && keys[i] in value) {
      value = value[keys[i]];
    } else {
      return defaultValue;
    }
  }

  return value !== null && value !== undefined ? value : defaultValue;
}

// Old: ES5 array methods patterns (modernize with better TypeScript patterns)
function processUsers(users, filters, sorters, transformers) {
  var result = users;

  // Apply filters
  if (filters && filters.length > 0) {
    for (var i = 0; i < filters.length; i++) {
      result = result.filter(function(user) {
        return filters[i](user);
      });
    }
  }

  // Apply sorting
  if (sorters && sorters.length > 0) {
    result = result.sort(function(a, b) {
      for (var j = 0; j < sorters.length; j++) {
        var comparison = sorters[j](a, b);
        if (comparison !== 0) {
          return comparison;
        }
      }
      return 0;
    });
  }

  // Apply transformations
  if (transformers && transformers.length > 0) {
    for (var k = 0; k < transformers.length; k++) {
      result = result.map(transformers[k]);
    }
  }

  return result;
}

// Old: Manual enum-like patterns (convert to proper TypeScript enums)
var UserRole = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
};

var ApiStatus = {
  PENDING: 'pending',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  CANCELLED: 'cancelled'
};

var HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// Old: Constructor functions instead of classes
function EventEmitter() {
  this.events = {};
  this.maxListeners = 10;
}

EventEmitter.prototype.on = function(event, listener) {
  if (!this.events[event]) {
    this.events[event] = [];
  }

  if (this.events[event].length >= this.maxListeners) {
    console.warn('MaxListenersExceededWarning: ' + this.maxListeners + ' listeners added');
  }

  this.events[event].push(listener);
  return this;
};

EventEmitter.prototype.off = function(event, listener) {
  if (!this.events[event]) {
    return this;
  }

  var index = this.events[event].indexOf(listener);
  if (index !== -1) {
    this.events[event].splice(index, 1);
  }

  return this;
};

EventEmitter.prototype.emit = function(event) {
  if (!this.events[event]) {
    return false;
  }

  var args = Array.prototype.slice.call(arguments, 1);
  var listeners = this.events[event].slice();

  for (var i = 0; i < listeners.length; i++) {
    listeners[i].apply(this, args);
  }

  return true;
};

// Old: Manual promise chains (convert to async/await)
function saveUserData(userData) {
  return validateUserData(userData)
    .then(function(validatedData) {
      return transformUserData(validatedData);
    })
    .then(function(transformedData) {
      return encryptSensitiveData(transformedData);
    })
    .then(function(encryptedData) {
      return saveToDatabase(encryptedData);
    })
    .then(function(savedData) {
      return updateSearchIndex(savedData);
    })
    .then(function(indexedData) {
      return sendNotification(indexedData);
    })
    .catch(function(error) {
      console.error('Error saving user data:', error);
      throw error;
    });
}

function validateUserData(data) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (!data.email || !data.name) {
        reject(new Error('Missing required fields'));
      } else {
        resolve(data);
      }
    }, 50);
  });
}

function transformUserData(data) {
  return Promise.resolve({
    ...data,
    email: data.email.toLowerCase(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

function encryptSensitiveData(data) {
  return Promise.resolve({
    ...data,
    password: '***encrypted***'
  });
}

function saveToDatabase(data) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve({ ...data, id: Math.random().toString(36) });
    }, 100);
  });
}

function updateSearchIndex(data) {
  return Promise.resolve(data);
}

function sendNotification(data) {
  return Promise.resolve(data);
}

// Old: Module pattern (convert to ES6 modules with proper exports)
var UtilityModule = (function() {
  var privateVariable = 'secret';

  function privateFunction(value) {
    return privateVariable + value;
  }

  return {
    publicMethod: function(input) {
      return privateFunction(input);
    },

    formatDate: function(date, format) {
      // Simplified date formatting
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var day = String(date.getDate()).padStart(2, '0');

      switch (format) {
        case 'yyyy-mm-dd':
          return year + '-' + month + '-' + day;
        case 'mm/dd/yyyy':
          return month + '/' + day + '/' + year;
        default:
          return date.toString();
      }
    },

    debounce: function(func, wait) {
      var timeout;
      return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
          func.apply(context, args);
        }, wait);
      };
    },

    throttle: function(func, limit) {
      var inThrottle;
      return function() {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(function() {
            inThrottle = false;
          }, limit);
        }
      };
    }
  };
})();

// Old: jQuery-style DOM manipulation (modernize to use native APIs)
function setupEventHandlers() {
  var buttons = document.getElementsByClassName('btn');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(event) {
      var button = event.target;
      var action = button.getAttribute('data-action');

      if (action === 'save') {
        handleSaveAction(button);
      } else if (action === 'delete') {
        handleDeleteAction(button);
      } else if (action === 'edit') {
        handleEditAction(button);
      }
    });
  }

  var forms = document.getElementsByTagName('form');
  for (var j = 0; j < forms.length; j++) {
    forms[j].addEventListener('submit', function(event) {
      event.preventDefault();
      var formData = new FormData(event.target);
      submitFormData(formData);
    });
  }
}

function handleSaveAction(button) {
  button.textContent = 'Saving...';
  button.disabled = true;

  setTimeout(function() {
    button.textContent = 'Save';
    button.disabled = false;
  }, 2000);
}

function handleDeleteAction(button) {
  if (confirm('Are you sure you want to delete this item?')) {
    var row = button.closest('tr');
    if (row) {
      row.remove();
    }
  }
}

function handleEditAction(button) {
  var row = button.closest('tr');
  var cells = row.getElementsByTagName('td');

  for (var i = 0; i < cells.length - 1; i++) { // Skip last cell with buttons
    var cell = cells[i];
    var value = cell.textContent;
    cell.innerHTML = '<input type="text" value="' + value + '">';
  }

  button.textContent = 'Save';
  button.setAttribute('data-action', 'save-edit');
}

function submitFormData(formData) {
  var data = {};
  for (var pair of formData.entries()) {
    data[pair[0]] = pair[1];
  }

  console.log('Submitting form data:', data);
  // Actual submission logic would go here
}