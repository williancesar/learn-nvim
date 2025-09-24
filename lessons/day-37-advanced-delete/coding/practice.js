/**
 * Day 37: Advanced Delete Practice - Deletion Without Affecting Registers
 *
 * This file contains code designed for practicing advanced delete operations,
 * particularly the black hole register to delete without affecting other registers.
 *
 * Key commands to practice:
 * - "_d (delete to black hole register - doesn't affect other registers)
 * - "_x (delete character to black hole register)
 * - "_c (change to black hole register)
 * - "_s (substitute to black hole register)
 * - "_dd (delete line to black hole register)
 * - "_D (delete to end of line to black hole register)
 * - Practice using "_ prefix before any delete operation
 */

// DELETE EXERCISE 1: Code with typos and extra characters to clean up
// Practice using "_x and "_d to remove unwanted characters without affecting clipboard
const userDattaa = {
  firstNamme: 'Johnn',
  lastNamee: 'Doee',
  emaail: 'john.doe@exammpple.com',
  phonee: '+1-555-01234',
  addreess: '123 Maain Streett',
  cityy: 'San Franncisco',
  statee: 'Callifornia',
  zipCodee: '941102',
  countryy: 'Unnited Staates'
};

const productDaata = {
  idd: 'PROD00001',
  namme: 'Wiireless Headphoones',
  descrription: 'Hiigh-quality wiireless headphoones with nooise cancellatiion',
  priice: 199.999,
  categorry: 'Electronnicss',
  brandd: 'AudiooTech',
  ssku: 'AT-100001',
  weightt: '250gg',
  dimensiions: '20cmm x 15cmm x 8cmm',
  coloor: 'Blaack'
};

// DELETE EXERCISE 2: Debug statements and console logs to remove
// Practice using "_dd to delete entire lines without affecting the default register
const authenticationService = {
  async login(credentials) {
    console.log('DEBUG: Starting login process');
    console.log('DEBUG: Credentials received:', credentials);

    const { username, password } = credentials;

    console.log('DEBUG: Validating username:', username);
    if (!this.validateUsername(username)) {
      console.log('DEBUG: Username validation failed');
      throw new Error('Invalid username format');
    }

    console.log('DEBUG: Validating password');
    if (!this.validatePassword(password)) {
      console.log('DEBUG: Password validation failed');
      throw new Error('Invalid password format');
    }

    console.log('DEBUG: Making API request');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      console.log('DEBUG: API response received:', response.status);

      if (!response.ok) {
        console.log('DEBUG: API request failed');
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      console.log('DEBUG: Authentication successful');
      console.log('DEBUG: User data:', data);

      return data;
    } catch (error) {
      console.log('DEBUG: Error occurred:', error.message);
      throw error;
    }
  },

  validateUsername(username) {
    console.log('DEBUG: Validating username format');
    return username && username.length >= 3;
  },

  validatePassword(password) {
    console.log('DEBUG: Validating password format');
    return password && password.length >= 8;
  }
};

// DELETE EXERCISE 3: Commented out code blocks to remove cleanly
// Practice using visual mode with "_d to delete comment blocks
const userService = {
  // TODO: Remove this old implementation
  // async getUser(id) {
  //   const response = await fetch(`/api/users/${id}`);
  //   return response.json();
  // }

  async getUserById(id) {
    try {
      const response = await fetch(`/api/v2/users/${id}`);
      if (!response.ok) {
        throw new Error('User not found');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // DEPRECATED: Use createUserAccount instead
  // async addUser(userData) {
  //   return await this.createUserAccount(userData);
  // }

  async createUserAccount(userData) {
    const validatedData = this.validateUserData(userData);
    const response = await fetch('/api/v2/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData)
    });

    if (!response.ok) {
      throw new Error('Failed to create user account');
    }

    return await response.json();
  },

  // NOTE: This method will be removed in v3.0
  // async updateUserData(id, data) {
  //   const response = await fetch(`/api/users/${id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify(data)
  //   });
  //   return response.json();
  // }

  async updateUserProfile(id, profileData) {
    const sanitizedData = this.sanitizeInput(profileData);
    const response = await fetch(`/api/v2/users/${id}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sanitizedData)
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    return await response.json();
  }
};

// DELETE EXERCISE 4: Extra whitespace and formatting issues
// Practice removing unnecessary whitespace without affecting useful content
const   configurationData    = {
  server:     {
    host:        'localhost'   ,
    port:        3000      ,
    ssl:         false     ,
    timeout:     30000
  } ,

  database:   {
    host:        'localhost'   ,
    port:        5432      ,
    name:        'myapp'   ,
    username:    'admin'   ,
    password:    'secret'
  }   ,

  redis:      {
    host:        'localhost'   ,
    port:        6379      ,
    password:    null
  }    ,

  logging:    {
    level:       'info'    ,
    file:        '/var/log/app.log'   ,
    rotation:    'daily'
  }
};

// DELETE EXERCISE 5: Duplicate property definitions to clean up
// Practice removing duplicate entries without disturbing the valid ones
const apiEndpoints = {
  users: {
    list: '/api/users',
    create: '/api/users',
    get: '/api/users/:id',
    update: '/api/users/:id',
    delete: '/api/users/:id',
    list: '/api/v2/users',           // duplicate - remove this
    create: '/api/v2/users',         // duplicate - remove this
    get: '/api/v2/users/:id',        // duplicate - remove this
    update: '/api/v2/users/:id',     // duplicate - remove this
    delete: '/api/v2/users/:id'      // duplicate - remove this
  },

  products: {
    list: '/api/products',
    create: '/api/products',
    get: '/api/products/:id',
    update: '/api/products/:id',
    delete: '/api/products/:id',
    list: '/api/v2/products',        // duplicate - remove this
    create: '/api/v2/products',      // duplicate - remove this
    get: '/api/v2/products/:id',     // duplicate - remove this
    update: '/api/v2/products/:id',  // duplicate - remove this
    delete: '/api/v2/products/:id'   // duplicate - remove this
  }
};

// DELETE EXERCISE 6: Unnecessary import statements to remove
// Practice cleaning up imports without affecting the ones actually needed
import React from 'react';
import ReactDOM from 'react-dom';       // Not used - remove
import { useState, useEffect } from 'react';
import { useContext } from 'react';     // Not used - remove
import { useCallback } from 'react';    // Not used - remove
import { useMemo } from 'react';        // Not used - remove
import axios from 'axios';
import lodash from 'lodash';            // Not used - remove
import moment from 'moment';            // Not used - remove
import validator from 'validator';      // Not used - remove
import jwt from 'jsonwebtoken';         // Not used - remove

import './App.css';
import './components/Header.css';       // Not used - remove
import './components/Footer.css';       // Not used - remove
import './utils/helpers.css';           // Not used - remove

import Header from './components/Header';
import Footer from './components/Footer';  // Not used - remove
import Sidebar from './components/Sidebar';  // Not used - remove
import Navigation from './components/Navigation';  // Not used - remove

// DELETE EXERCISE 7: Error handling code with unnecessary catches
// Practice removing redundant error handling while keeping essential parts
const dataProcessor = {
  async processUserData(userData) {
    try {
      const validatedData = this.validateData(userData);
      return validatedData;
    } catch (ValidationError) {
      console.error('Validation failed');
      throw ValidationError;
    } catch (TypeError) {
      console.error('Type error occurred');
      throw TypeError;
    } catch (ReferenceError) {      // Not needed - remove
      console.error('Reference error');
      throw ReferenceError;
    } catch (SyntaxError) {         // Not needed - remove
      console.error('Syntax error');
      throw SyntaxError;
    } catch (Error) {
      console.error('General error occurred');
      throw Error;
    }
  },

  async saveToDatabase(data) {
    try {
      const result = await database.save(data);
      return result;
    } catch (DatabaseConnectionError) {
      console.error('Database connection failed');
      throw DatabaseConnectionError;
    } catch (QueryTimeoutError) {
      console.error('Query timeout');
      throw QueryTimeoutError;
    } catch (PermissionError) {     // Not needed - remove
      console.error('Permission denied');
      throw PermissionError;
    } catch (NetworkError) {        // Not needed - remove
      console.error('Network error');
      throw NetworkError;
    } catch (Error) {
      console.error('Database operation failed');
      throw Error;
    }
  }
};

// DELETE EXERCISE 8: Unused variable declarations and assignments
// Practice removing unused variables without affecting active code
const calculateOrderTotal = (items, taxRate, shippingCost) => {
  const unusedVar1 = 'not needed';           // Remove this
  let unusedVar2 = 0;                        // Remove this
  const tempVar = 'temporary';               // Remove this

  const subtotal = items.reduce((sum, item) => {
    const unusedItemVar = item.category;     // Remove this
    const tempPrice = item.price;           // Remove this
    return sum + (item.price * item.quantity);
  }, 0);

  const debugFlag = true;                    // Remove this
  const maxItems = 100;                     // Remove this

  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount + shippingCost;

  const unusedResult = total * 1.1;         // Remove this
  const tempTotal = total;                  // Remove this

  return total;
};

// DELETE EXERCISE 9: Redundant function calls and assignments
// Practice removing unnecessary operations
const userProfileManager = {
  updateProfile(userId, profileData) {
    const startTime = Date.now();           // Remove if not used

    // Remove these redundant validations
    this.validateUserId(userId);
    this.validateUserId(userId);            // Duplicate - remove

    this.sanitizeData(profileData);
    this.sanitizeData(profileData);         // Duplicate - remove

    const result = this.saveProfile(userId, profileData);
    const resultCopy = result;              // Unnecessary - remove

    const endTime = Date.now();             // Remove if not used
    const duration = endTime - startTime;  // Remove if not used

    return result;
  },

  validateUserId(userId) {
    if (!userId) return false;
    const userIdString = userId.toString(); // Unnecessary - remove
    const userIdNumber = parseInt(userId);  // Unnecessary - remove
    return userId > 0;
  }
};

// DELETE EXERCISE 10: Empty functions and placeholder code
// Practice removing empty implementations and TODO stubs
const placeholderService = {
  // TODO: Implement this method
  processPayment(paymentData) {
    // Implementation coming soon
  },

  // STUB: Remove this when real implementation is ready
  generateReport(reportType) {
    return null;
  },

  // Empty function - remove
  logActivity() {

  },

  validateInput(input) {
    // Validate the input here
    if (!input) {
      throw new Error('Input is required');
    }
    return true;
  },

  // Placeholder - remove when not needed
  calculateMetrics() {
    // Metrics calculation will be added later
    return {};
  },

  // Remove this empty handler
  handleError(error) {

  },

  processTransaction(transaction) {
    if (!transaction) {
      throw new Error('Transaction is required');
    }

    // Process the transaction
    return this.saveTransaction(transaction);
  }
};

export {
  userDattaa,
  productDaata,
  authenticationService,
  userService,
  configurationData,
  apiEndpoints,
  dataProcessor,
  calculateOrderTotal,
  userProfileManager,
  placeholderService
};