const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middleware/rateLimit.middleware');
const authService = require('../services/auth.service');
const config = require('../config/env');

const router = express.Router();

// Register
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

// Login
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login
);

// Get current user (protected)
router.get('/me', authenticate, authController.getCurrentUser);

// Logout
router.post('/logout', authenticate, authController.logout);

// Google OAuth routes
// NOTE: We always register these routes so the API doesn't 404 when Google isn't configured.
// If env vars are missing, we return a helpful error instead.

// Initiate Google OAuth
router.get('/google', (req, res, next) => {
  if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({
      success: false,
      message:
        'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env, then restart the server.'
    });
  }

  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({
      success: false,
      message:
        'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env, then restart the server.'
    });
  }

  return passport.authenticate('google', {
    session: false,
    failureRedirect: `${config.CLIENT_URL}/login?error=oauth_failed`
  })(req, res, async (err) => {
    if (err) {
      return res.redirect(`${config.CLIENT_URL}/login?error=oauth_failed`);
    }
    try {
      const token = authService.generateToken(req.user._id);
      return res.redirect(`${config.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (error) {
      return res.redirect(`${config.CLIENT_URL}/login?error=oauth_failed`);
    }
  });
});

module.exports = router;
