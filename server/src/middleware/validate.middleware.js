const ApiError = require('../utils/ApiError');

/**
 * Middleware to validate request body against Joi schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      return next(ApiError.badRequest(errorMessage));
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
