const mongoose = require('mongoose');

/**
 * Stores Web Push subscriptions per user.
 * A user can have multiple subscriptions (different browsers/devices).
 */
const pushSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // The full PushSubscription object from the browser
  endpoint: {
    type: String,
    required: true,
    unique: true
  },
  keys: {
    p256dh: { type: String, required: true },
    auth:   { type: String, required: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PushSubscription', pushSubscriptionSchema);
