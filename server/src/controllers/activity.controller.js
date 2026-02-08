const activityService = require('../services/activity.service');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get user's activity timeline
 * GET /api/activity
 */
const getActivities = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const skip = parseInt(req.query.skip) || 0;

  const activities = await activityService.getUserActivities(
    req.user.id,
    limit,
    skip
  );

  const stats = await activityService.getActivityStats(req.user.id);

  res.json({
    success: true,
    data: {
      activities,
      stats,
      count: activities.length
    }
  });
});

module.exports = {
  getActivities
};
