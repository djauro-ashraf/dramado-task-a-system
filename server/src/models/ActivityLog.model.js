const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null
  },
  type: {
    type: String,
    enum: [
      'CREATED_TASK',
      'COMPLETED',
      'SNOOZED',
      'IGNORED',
      'MISSED_DEADLINE',
      'LOGIN',
      'UPLOAD_SOUND',
      'UPDATED_TASK',
      'DELETED_TASK'
    ],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient timeline queries
activityLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
