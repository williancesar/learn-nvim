// Day 18: Quote and Bracket Objects Practice - i", a", i', a', i), a), i], a], i}, a}
// Practice with quote objects (i", a", i', a') and bracket objects (i), a), i], a], i}, a})
// This file contains many strings, function calls, arrays, and objects for text object practice

/**
 * Dynamic Form Builder and Validation System
 * Extensive use of quotes, brackets, and nested structures for vim text object practice
 */

// Configuration objects with nested structures
const FORM_CONFIG = {
    "validation": {
        "email": {
            "pattern": "/^[^\s@]+@[^\s@]+\.[^\s@]+$/",
            "message": "Please enter a valid email address"
        },
        "password": {
            "minLength": 8,
            "pattern": "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/",
            "message": "Password must contain at least 8 characters with uppercase, lowercase, number and special character"
        },
        "phone": {
            "pattern": "/^\(\d{3}\)\s\d{3}-\d{4}$/",
            "message": "Phone number must be in format: (555) 123-4567"
        }
    },
    "themes": {
        "default": {
            "primaryColor": "#007bff",
            "secondaryColor": "#6c757d",
            "backgroundColor": "#ffffff",
            "textColor": "#212529"
        },
        "dark": {
            "primaryColor": "#0d6efd",
            "secondaryColor": "#6c757d",
            "backgroundColor": "#212529",
            "textColor": "#ffffff"
        }
    }
};

// String manipulation utilities with various quote types
function sanitizeInput(input) {
    return input
        .replace(/[<>&"']/g, (char) => {
            const entities = {
                '<': '&lt;',
                '>': '&gt;',
                '&': '&amp;',
                '"': '&quot;',
                "'": '&#x27;'
            };
            return entities[char];
        });
}

function formatMessage(template, variables) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return variables[key] || match;
    });
}

function createErrorMessages() {
    return {
        "required": "This field is required",
        "email": "Please enter a valid email address",
        "minLength": "Must be at least {min} characters long",
        "maxLength": "Cannot exceed {max} characters",
        "pattern": "Please match the requested format",
        "custom": "Custom validation failed"
    };
}

// Form field generation with nested arrays and objects
function createFormField(fieldConfig) {
    const field = {
        "type": fieldConfig.type || "text",
        "name": fieldConfig.name,
        "label": fieldConfig.label,
        "placeholder": fieldConfig.placeholder || "",
        "required": fieldConfig.required || false,
        "validation": fieldConfig.validation || {},
        "attributes": fieldConfig.attributes || {}
    };

    if (fieldConfig.options && Array.isArray(fieldConfig.options)) {
        field.options = fieldConfig.options.map((option) => {
            if (typeof option === "string") {
                return { "value": option, "label": option };
            }
            return option;
        });
    }

    return field;
}

function generateSelectOptions(items) {
    return items.map((item) => {
        return `<option value="${item.value}">${item.label}</option>`;
    }).join('\n');
}

function buildFormHTML(fields) {
    return fields.map((field) => {
        const attributes = Object.entries(field.attributes)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');

        switch (field.type) {
            case 'select':
                return `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}</label>
                        <select id="${field.name}" name="${field.name}" ${attributes}>
                            ${generateSelectOptions(field.options)}
                        </select>
                    </div>
                `;
            case 'textarea':
                return `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}</label>
                        <textarea id="${field.name}" name="${field.name}"
                                 placeholder="${field.placeholder}" ${attributes}></textarea>
                    </div>
                `;
            default:
                return `
                    <div class="form-group">
                        <label for="${field.name}">${field.label}</label>
                        <input type="${field.type}" id="${field.name}" name="${field.name}"
                               placeholder="${field.placeholder}" ${attributes} />
                    </div>
                `;
        }
    }).join('\n');
}

// Validation functions with complex string patterns
class FormValidator {
    constructor(config = {}) {
        this.config = config;
        this.errors = {};
        this.patterns = {
            "email": /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "url": /^https?:\/\/[^\s]+$/,
            "phone": /^\(\d{3}\)\s\d{3}-\d{4}$/,
            "zipCode": /^\d{5}(-\d{4})?$/,
            "creditCard": /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/
        };
    }

    validateField(fieldName, value, rules) {
        const fieldErrors = [];

        if (rules.required && (!value || value.trim() === '')) {
            fieldErrors.push('This field is required');
        }

        if (value && rules.minLength && value.length < rules.minLength) {
            fieldErrors.push(`Must be at least ${rules.minLength} characters long`);
        }

        if (value && rules.maxLength && value.length > rules.maxLength) {
            fieldErrors.push(`Cannot exceed ${rules.maxLength} characters`);
        }

        if (value && rules.pattern) {
            const pattern = new RegExp(rules.pattern);
            if (!pattern.test(value)) {
                fieldErrors.push(rules.message || 'Please match the requested format');
            }
        }

        if (value && rules.type && this.patterns[rules.type]) {
            if (!this.patterns[rules.type].test(value)) {
                fieldErrors.push(`Please enter a valid ${rules.type}`);
            }
        }

        if (fieldErrors.length > 0) {
            this.errors[fieldName] = fieldErrors;
        } else {
            delete this.errors[fieldName];
        }

        return fieldErrors.length === 0;
    }

    validateForm(formData, schema) {
        this.errors = {};

        Object.keys(schema).forEach((fieldName) => {
            const value = formData[fieldName];
            const rules = schema[fieldName];
            this.validateField(fieldName, value, rules);
        });

        return Object.keys(this.errors).length === 0;
    }

    getErrorMessage(fieldName) {
        return this.errors[fieldName] ? this.errors[fieldName][0] : '';
    }

    getAllErrors() {
        return { ...this.errors };
    }
}

// Dynamic form builder with nested function calls
function createDynamicForm(formSchema) {
    const validator = new FormValidator();
    const form = document.createElement('form');

    formSchema.fields.forEach((fieldConfig) => {
        const fieldElement = createFormElement(fieldConfig);
        const wrapperDiv = createFieldWrapper(fieldConfig, fieldElement);

        form.appendChild(wrapperDiv);

        fieldElement.addEventListener('blur', () => {
            validateSingleField(fieldConfig, fieldElement, validator);
        });

        fieldElement.addEventListener('input', debounce(() => {
            clearFieldError(fieldConfig.name);
        }, 300));
    });

    const submitButton = createSubmitButton(formSchema.submitText || 'Submit');
    form.appendChild(submitButton);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        handleFormSubmission(form, formSchema, validator);
    });

    return form;
}

function createFormElement(config) {
    const element = document.createElement(config.type === 'textarea' ? 'textarea' : 'input');

    if (config.type !== 'textarea') {
        element.type = config.type || 'text';
    }

    element.name = config.name;
    element.id = config.name;
    element.placeholder = config.placeholder || '';

    if (config.required) {
        element.required = true;
        element.setAttribute('aria-required', 'true');
    }

    Object.entries(config.attributes || {}).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });

    return element;
}

function createFieldWrapper(config, element) {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = config.name;
    label.textContent = config.label;

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.id = `${config.name}-error`;

    wrapper.appendChild(label);
    wrapper.appendChild(element);
    wrapper.appendChild(errorDiv);

    return wrapper;
}

function createSubmitButton(text) {
    const button = document.createElement('button');
    button.type = 'submit';
    button.textContent = text;
    button.className = 'btn btn-primary';
    return button;
}

// Event handling with arrow functions and complex expressions
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

const validateSingleField = (config, element, validator) => {
    const isValid = validator.validateField(config.name, element.value, config.validation || {});
    const errorElement = document.getElementById(`${config.name}-error`);

    if (!isValid) {
        errorElement.textContent = validator.getErrorMessage(config.name);
        errorElement.style.display = 'block';
        element.classList.add('error');
    } else {
        errorElement.style.display = 'none';
        element.classList.remove('error');
    }
};

const clearFieldError = (fieldName) => {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName);

    if (errorElement) {
        errorElement.style.display = 'none';
    }
    if (inputElement) {
        inputElement.classList.remove('error');
    }
};

const handleFormSubmission = async (form, schema, validator) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const isValid = validator.validateForm(data, schema.validation || {});

    if (isValid) {
        try {
            const response = await fetch(schema.action || '/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                showSuccessMessage(result.message || 'Form submitted successfully!');
                form.reset();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            showErrorMessage(`Submission failed: ${error.message}`);
        }
    } else {
        Object.keys(validator.getAllErrors()).forEach((fieldName) => {
            const element = document.getElementById(fieldName);
            validateSingleField(
                { name: fieldName, validation: schema.validation[fieldName] },
                element,
                validator
            );
        });
    }
};

// Notification system with template literals and dynamic content
function showSuccessMessage(message) {
    const notification = createNotification('success', message);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showErrorMessage(message) {
    const notification = createNotification('error', message);
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

function createNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '✗'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    return notification;
}

// Sample form schemas with complex nested structures
const USER_REGISTRATION_FORM = {
    "title": "User Registration",
    "action": "/api/users/register",
    "fields": [
        {
            "type": "text",
            "name": "firstName",
            "label": "First Name",
            "placeholder": "Enter your first name",
            "required": true,
            "validation": { "required": true, "minLength": 2, "maxLength": 50 }
        },
        {
            "type": "text",
            "name": "lastName",
            "label": "Last Name",
            "placeholder": "Enter your last name",
            "required": true,
            "validation": { "required": true, "minLength": 2, "maxLength": 50 }
        },
        {
            "type": "email",
            "name": "email",
            "label": "Email Address",
            "placeholder": "Enter your email address",
            "required": true,
            "validation": { "required": true, "type": "email" }
        },
        {
            "type": "password",
            "name": "password",
            "label": "Password",
            "placeholder": "Create a strong password",
            "required": true,
            "validation": {
                "required": true,
                "minLength": 8,
                "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]",
                "message": "Password must contain uppercase, lowercase, number and special character"
            }
        }
    ],
    "submitText": "Create Account"
};

// Export the form builder and related utilities
export {
    FORM_CONFIG,
    FormValidator,
    createDynamicForm,
    createFormField,
    buildFormHTML,
    USER_REGISTRATION_FORM,
    sanitizeInput,
    formatMessage,
    showSuccessMessage,
    showErrorMessage
};