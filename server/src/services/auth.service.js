const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const config = require('../config/env');
const ApiError = require('../utils/ApiError');
const activityService = require('./activity.service');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

/**
 * Register new user
 */
const register = async (email, password, name) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  // Hash password
  const passwordHash = await User.hashPassword(password);

  // Create user
  const user = await User.create({
    email,
    passwordHash,
    name
  });

  // Log activity
  await activityService.logActivity(
    user._id,
    null,
    'LOGIN',
    '🎭 Welcome to the drama! A new hero has entered the stage.',
    { action: 'register' }
  );

  // Generate token
  const token = generateToken(user._id);

  return { user, token };
};

/**
 * Login user
 */
const login = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Log activity
  await activityService.logActivity(
    user._id,
    null,
    'LOGIN',
    '🎭 The protagonist returns! Another day, another dramatic entrance.',
    { action: 'login' }
  );

  // Generate token
  const token = generateToken(user._id);

  return { user, token };
};

/**
 * Get current user info
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
};

module.exports = {
  register,
  login,
  getCurrentUser,
  generateToken
};
