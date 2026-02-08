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
if (config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET) {
  // Initiate Google OAuth
  router.get(
    '/google',
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      session: false 
    })
  );

  // Google OAuth callback
  router.get(
    '/google/callback',
    passport.authenticate('google', { 
      session: false,
      failureRedirect: `${config.CLIENT_URL}/login?error=oauth_failed`
    }),
    async (req, res) => {
      try {
        // Generate JWT for the authenticated user
        const token = authService.generateToken(req.user._id);
        
        // Redirect to client with token
        res.redirect(`${config.CLIENT_URL}/auth/callback?token=${token}`);
      } catch (error) {
        res.redirect(`${config.CLIENT_URL}/login?error=oauth_failed`);
      }
    }
  );
}

module.exports = router;
