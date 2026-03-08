const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');
const { saveSubscription, removeSubscription } = require('../services/push.service');
const config = require('../config/env');

/**
 * GET /api/push/vapid-public-key
 * Returns the VAPID public key so the client can subscribe.
 * Public — no auth required.
 */
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: config.VAPID_PUBLIC_KEY });
});

/**
 * POST /api/push/subscribe
 * Body: { endpoint, keys: { p256dh, auth } }
 * Saves the browser's push subscription to the DB.
 */
router.post('/subscribe', authenticate, asyncHandler(async (req, res) => {
  const { endpoint, keys } = req.body;

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ success: false, message: 'Invalid subscription object' });
  }

  await saveSubscription(req.user._id, { endpoint, keys });

  res.json({ success: true, message: '🔔 Push subscription saved!' });
}));

/**
 * POST /api/push/unsubscribe
 * Body: { endpoint }
 * Removes a push subscription (user turned off notifications).
 */
router.post('/unsubscribe', authenticate, asyncHandler(async (req, res) => {
  const { endpoint } = req.body;

  if (!endpoint) {
    return res.status(400).json({ success: false, message: 'Endpoint required' });
  }

  await removeSubscription(endpoint);

  res.json({ success: true, message: 'Push subscription removed.' });
}));

module.exports = router;
