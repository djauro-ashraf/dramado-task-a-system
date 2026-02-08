const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const { user, token } = await authService.register(email, password, name);

  res.status(201).json({
    success: true,
    message: '🎭 Welcome to DramaDo! Your dramatic journey begins!',
    data: {
      user,
      token
    }
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login(email, password);

  res.json({
    success: true,
    message: '🎭 Welcome back to the stage!',
    data: {
      user,
      token
    }
  });
});

/**
 * Get current user
 * GET /api/auth/me
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  res.json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * Logout (mainly for client-side token removal)
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: '🎭 Exit stage left! See you next time!'
  });
});

module.exports = {
  register,
  login,
  getCurrentUser,
  logout
};
