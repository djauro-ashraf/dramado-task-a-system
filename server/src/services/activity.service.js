const ActivityLog = require('../models/ActivityLog.model');

/**
 * Log an activity
 */
const logActivity = async (userId, taskId, type, message, meta = {}) => {
  try {
    await ActivityLog.create({
      userId,
      taskId,
      type,
      message,
      meta
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw - activity logging should not break the main flow
  }
};

/**
 * Get user's activity timeline
 */
const getUserActivities = async (userId, limit = 50, skip = 0) => {
  const activities = await ActivityLog.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('taskId', 'title priority status')
    .lean();

  return activities;
};

/**
 * Get activity stats for user
 */
const getActivityStats = async (userId) => {
  const stats = await ActivityLog.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 }
      }
    }
  ]);

  const statsMap = {};
  stats.forEach(stat => {
    statsMap[stat._id] = stat.count;
  });

  return {
    totalActivities: stats.reduce((sum, stat) => sum + stat.count, 0),
    tasksCompleted: statsMap.COMPLETED || 0,
    tasksSnoozed: statsMap.SNOOZED || 0,
    tasksIgnored: statsMap.IGNORED || 0,
    missedDeadlines: statsMap.MISSED_DEADLINE || 0,
    tasksCreated: statsMap.CREATED_TASK || 0
  };
};

/**
 * Delete activities for a task (when task is deleted)
 */
const deleteTaskActivities = async (taskId) => {
  await ActivityLog.deleteMany({ taskId });
};

module.exports = {
  logActivity,
  getUserActivities,
  getActivityStats,
  deleteTaskActivities
};
