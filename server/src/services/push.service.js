const webpush = require('web-push');
const config = require('../config/env');
const PushSubscription = require('../models/PushSubscription.model');

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  `mailto:${config.VAPID_EMAIL}`,
  config.VAPID_PUBLIC_KEY,
  config.VAPID_PRIVATE_KEY
);

/**
 * Save or update a push subscription for a user.
 */
const saveSubscription = async (userId, subscription) => {
  const { endpoint, keys } = subscription;

  // Upsert: if this endpoint already exists, update keys; otherwise create
  await PushSubscription.findOneAndUpdate(
    { endpoint },
    { userId, endpoint, keys },
    { upsert: true, new: true }
  );
};

/**
 * Remove a push subscription (user unsubscribed).
 */
const removeSubscription = async (endpoint) => {
  await PushSubscription.findOneAndDelete({ endpoint });
};

/**
 * Send a push notification to all of a user's subscribed devices.
 * Silently removes stale/expired subscriptions (410 Gone).
 */
const sendPushToUser = async (userId, payload) => {
  const subscriptions = await PushSubscription.find({ userId });

  if (!subscriptions.length) return;

  const payloadStr = JSON.stringify(payload);
  const staleEndpoints = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payloadStr
        );
      } catch (err) {
        // 410 = subscription expired/unsubscribed; clean it up
        if (err.statusCode === 410 || err.statusCode === 404) {
          staleEndpoints.push(sub.endpoint);
        } else {
          console.error(`Push send error for user ${userId}:`, err.message);
        }
      }
    })
  );

  if (staleEndpoints.length) {
    await PushSubscription.deleteMany({ endpoint: { $in: staleEndpoints } });
  }
};

module.exports = { saveSubscription, removeSubscription, sendPushToUser };
