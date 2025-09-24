// Error handling utilities
// Referenced throughout the application

class ApplicationError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'ApplicationError';
        this.statusCode = statusCode;
        this.timestamp = new Date();
    }
}

class ValidationError extends ApplicationError {
    constructor(errors) {
        super('Validation failed', 400);
        this.name = 'ValidationError';
        this.errors = errors;
    }
}

class NotFoundError extends ApplicationError {
    constructor(resource) {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
        this.resource = resource;
    }
}

class DatabaseError extends ApplicationError {
    constructor(message, query) {
        super(`Database error: ${message}`, 500);
        this.name = 'DatabaseError';
        this.query = query;
    }
}

// Error handler middleware
function errorHandler(err, req, res, next) {
    // Log error (check config.json for log settings)
    console.error({
        error: err.name,
        message: err.message,
        stack: err.stack,
        timestamp: new Date(),
        request: {
            method: req.method,
            url: req.url,
            body: req.body
        }
    });

    // Send appropriate response
    if (err instanceof ApplicationError) {
        res.status(err.statusCode).json({
            error: err.name,
            message: err.message,
            ...(err.errors && { errors: err.errors })
        });
    } else {
        // Generic error response
        res.status(500).json({
            error: 'InternalServerError',
            message: 'An unexpected error occurred'
        });
    }
}

module.exports = {
    ApplicationError,
    ValidationError,
    NotFoundError,
    DatabaseError,
    errorHandler
};