const config = require('../config/env');
const ApiError = require('../utils/ApiError');

/**
 * Error handler middleware - should be last in middleware chain
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert non-ApiError errors to ApiError
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(config.NODE_ENV === 'development' && { stack: error.stack })
  };

  // Log error in development
  if (config.NODE_ENV === 'development') {
    console.error('🎭 Error:', error);
  }

  res.status(error.statusCode).json(response);
};

/**
 * Handle 404 routes
 */
const notFound = (req, res, next) => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Handle Mongoose validation errors
 */
const handleMongooseError = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    const error = ApiError.badRequest(messages.join(', '));
    return next(error);
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const error = ApiError.conflict(`${field} already exists`);
    return next(error);
  }

  if (err.name === 'CastError') {
    const error = ApiError.badRequest('Invalid ID format');
    return next(error);
  }

  next(err);
};

module.exports = {
  errorHandler,
  notFound,
  handleMongooseError
};
